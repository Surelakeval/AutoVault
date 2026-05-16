import express from 'express';
import {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/carController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(getCars)
  .post(protect, createCar);

router
  .route('/:slug')
  .get(getCar);

router
  .route('/:id')
  .put(protect, updateCar)
  .delete(protect, deleteCar);

export default router;
