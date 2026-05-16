import express from 'express';
import { reserveCar, getMyOrders, getAllOrders, cancelOrder } from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/reserve', protect, reserveCar);
router.get('/my', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
