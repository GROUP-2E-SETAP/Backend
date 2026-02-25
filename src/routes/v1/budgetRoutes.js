const express = require('express');
const router = express.Router();
const budgetController = require('../../controllers/budgetController');
const { protect } = require('../../middleware/auth');
const { validateBudget } = require('../../middleware/validation');

router.use(protect);

router
  .route('/')
  .get(budgetController.getBudgets)
  .post(validateBudget, budgetController.createBudget);

router
  .route('/:id')
  .get(budgetController.getBudgetById)
  .put(validateBudget, budgetController.updateBudget)
  .delete(budgetController.deleteBudget);

module.exports = router;
