import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import catchAsync from '../utils/catchAsync';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  req.body.sender = req.user.id;

  const message = await Message.create(req.body);

  res.status(201).json({
    success: true,
    data: message,
  });
});

// @desc    Get conversation between user and seller for a specific car
// @route   GET /api/messages/:carId/:userId
// @access  Private
export const getConversation = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const messages = await Message.find({
    car: req.params.carId,
    $or: [
      { sender: req.user.id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user.id }
    ]
  }).sort('createdAt');

  // Mark as read
  await Message.updateMany(
    { car: req.params.carId, receiver: req.user.id, sender: req.params.userId, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages,
  });
});
