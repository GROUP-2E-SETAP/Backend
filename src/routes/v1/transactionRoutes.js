const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/transactionController');
const { protect } = require('../../middleware/auth');
const { validateTransaction } = require('../../middleware/validation');

router.use(protect);

router
  .route('/')
  .get(transactionController.getTransactions)
  .post(validateTransaction, transactionController.createTransaction);

router.get('/stats', transactionController.getTransactionStats);

router
  .route('/:id')
  .get(transactionController.getTransactionById)
  .put(validateTransaction, transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

module.exports = router;
