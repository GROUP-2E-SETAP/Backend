import express from 'express';
import {
  addBudget,
  getBudgets,
  updateExistingBudget,
  removeBudget
} from '../../controllers/budgetControllers.js';
import { authenticate } from '../../middleware/advancedauth.js';

const router = express.Router();

router.post('/', addBudget);
router.get('/:userId', getBudgets);
router.put('/:budgetId', updateExistingBudget);
router.delete('/:budgetId', removeBudget);

export default router;
