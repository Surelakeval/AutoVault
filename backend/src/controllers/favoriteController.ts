import { Request, Response, NextFunction } from 'express';
import Favorite from '../models/Favorite';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const favorites = await Favorite.find({ user: req.user.id }).populate('car');

  res.status(200).json({
    success: true,
    count: favorites.length,
    data: favorites,
  });
});

// @desc    Add a car to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  req.body.user = req.user.id;

  const favorite = await Favorite.create(req.body);

  res.status(201).json({
    success: true,
    data: favorite,
  });
});

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
export const deleteFavorite = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const favorite = await Favorite.findById(req.params.id);

  if (!favorite) {
    return next(new AppError(`Favorite not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns the favorite
  if (favorite.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError(`User ${req.user.id} is not authorized to delete this favorite`, 401));
  }

  await favorite.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
