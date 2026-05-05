import express from 'express';
import {
  createTrx,
  getTrxByUserId,
  deleteTrx
} from '../../controllers/transactionControllers.js';
import { authenticate } from '../../middleware/advancedauth.js';

const router = express.Router();

router.post('/', createTrx);
router.get('/:userId', getTrxByUserId);
router.delete('/', deleteTrx);

export default router;