import { Request, Response, NextFunction } from 'express';
import TestDrive from '../models/TestDrive';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

// @desc    Book a test drive
// @route   POST /api/test-drives
// @access  Private
export const bookTestDrive = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  req.body.user = req.user.id;

  const testDrive = await TestDrive.create(req.body);

  res.status(201).json({
    success: true,
    data: testDrive,
  });
});

// @desc    Get user's test drives
// @route   GET /api/test-drives/me
// @access  Private
export const getMyTestDrives = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const testDrives = await TestDrive.find({ user: req.user.id }).populate('car');

  res.status(200).json({
    success: true,
    count: testDrives.length,
    data: testDrives,
  });
});

// @desc    Get all test drives
// @route   GET /api/test-drives
// @access  Private/Admin
export const getAllTestDrives = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const testDrives = await TestDrive.find().populate('user', 'name email').populate('car', 'title');

  res.status(200).json({
    success: true,
    count: testDrives.length,
    data: testDrives,
  });
});
