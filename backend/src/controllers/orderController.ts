import { Request, Response, NextFunction } from 'express';
import Order, { IOrder } from '../models/Order';
import Car from '../models/Car';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

// @desc    Reserve a car (pay token amount)
// @route   POST /api/orders/reserve
// @access  Private
export const reserveCar = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { carId, financeType, downPayment, loanTenure, emiAmount, contactPhone, deliveryAddress } = req.body;

  // Check car exists and is active
  const car = await Car.findById(carId);
  if (!car) return next(new AppError('Car not found', 404));
  if (car.status !== 'active') return next(new AppError('This car is no longer available', 400));

  // Check no existing active order
  const existingOrder = await Order.findOne({ car: carId, status: { $in: ['reserved', 'confirmed'] } });
  if (existingOrder) return next(new AppError('This car is already reserved by someone else', 400));

  // Create order
  const order = await Order.create({
    car: carId,
    buyer: req.user.id,
    type: 'reservation',
    status: 'reserved',
    tokenAmount: 10000,
    totalPrice: car.price,
    financeType: financeType || 'full_payment',
    downPayment,
    loanTenure,
    emiAmount,
    contactPhone,
    deliveryAddress,
  });

  // Mark car as reserved
  await Car.findByIdAndUpdate(carId, { status: 'sold' });

  // Populate car & buyer details for response
  await order.populate('car');
  await order.populate('buyer', 'name email');

  res.status(201).json({ success: true, data: order });
});

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = catchAsync(async (req: any, res: Response) => {
  const orders = await Order.find({ buyer: req.user.id })
    .populate('car', 'title images price brand slug')
    .sort('-createdAt');
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = catchAsync(async (req: any, res: Response) => {
  const orders = await Order.find()
    .populate('car', 'title images price brand')
    .populate('buyer', 'name email')
    .sort('-createdAt');
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id) as IOrder;
  if (!order) return next(new AppError('Order not found', 404));
  if (!req.user || String(order.buyer) !== String(req.user.id)) {
    return next(new AppError('Not authorized', 403));
  }
  if (order.status !== 'reserved') return next(new AppError('Order cannot be cancelled', 400));

  order.status = 'cancelled';
  await order.save();

  // Re-activate the car
  await Car.findByIdAndUpdate(order.car, { status: 'active' });

  res.status(200).json({ success: true, data: order });
});
