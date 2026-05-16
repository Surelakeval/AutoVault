import { Request, Response, NextFunction } from 'express';
import Car from '../models/Car';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
export const getCars = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
  
  let parsedQuery = JSON.parse(queryStr);
  
  // Custom handling for minPrice and maxPrice
  if (reqQuery.minPrice || reqQuery.maxPrice) {
    parsedQuery.price = {};
    if (reqQuery.minPrice) {
      parsedQuery.price.$gte = Number(reqQuery.minPrice);
      delete parsedQuery.minPrice;
    }
    if (reqQuery.maxPrice) {
      parsedQuery.price.$lte = Number(reqQuery.maxPrice);
      delete parsedQuery.maxPrice;
    }
  }
  
  // Handle search query
  if (req.query.search) {
    parsedQuery = {
      ...parsedQuery,
      $or: [
        { title: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } }
      ]
    };
  }

  // Finding resource
  query = Car.find(parsedQuery);

  // Select Fields
  if (req.query.select) {
    const fields = (req.query.select as string).split(',').join(' ');
    query = query.select(fields);
  }

  // Populate seller
  query = query.populate('seller', 'name email avatar');

  // Sort
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Car.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const cars = await query;

  // Pagination result
  const pagination: any = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: cars.length,
    pagination,
    data: cars,
  });
});

// @desc    Get single car
// @route   GET /api/cars/:slug
// @access  Public
export const getCar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const car = await Car.findOne({ slug: req.params.slug }).populate('seller', 'name email avatar');

  if (!car) {
    return next(new AppError(`Car not found with slug of ${req.params.slug}`, 404));
  }

  res.status(200).json({
    success: true,
    data: car,
  });
});

// @desc    Create new car
// @route   POST /api/cars
// @access  Private
export const createCar = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  req.body.seller = req.user.id;

  // Admin approves automatically, users go to pending
  if (req.user.role === 'admin') {
    req.body.status = 'active';
  }

  const car = await Car.create(req.body);

  res.status(201).json({
    success: true,
    data: car,
  });
});

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let car = await Car.findById(req.params.id);

  if (!car) {
    return next(new AppError(`Car not found with id of ${req.params.id}`, 404));
  }

  car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: car,
  });
});

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
export const deleteCar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return next(new AppError(`Car not found with id of ${req.params.id}`, 404));
  }

  await car.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
