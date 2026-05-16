import express from 'express';
import { submitContact, getContacts } from '../controllers/contactController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .post(submitContact)
  .get(protect, authorize('admin'), getContacts);

export default router;
