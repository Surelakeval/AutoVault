import express from 'express';
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from '../controllers/favoriteController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getFavorites)
  .post(addFavorite);

router
  .route('/:id')
  .delete(deleteFavorite);

export default router;
