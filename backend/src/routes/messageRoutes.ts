import express from 'express';
import { sendMessage, getConversation } from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/:carId/:userId', getConversation);

export default router;
