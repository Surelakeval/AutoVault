import express from 'express';
import {
  bookTestDrive,
  getMyTestDrives,
  getAllTestDrives,
} from '../controllers/testDriveController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(bookTestDrive)
  .get(authorize('admin'), getAllTestDrives);

router.route('/me').get(getMyTestDrives);

export default router;
