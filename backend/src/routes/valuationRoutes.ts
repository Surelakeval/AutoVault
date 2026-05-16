import express from 'express';
import { getValuation } from '../controllers/valuationController';

const router = express.Router();

router.post('/', getValuation);

export default router;
