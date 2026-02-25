const transactionService = require('../services/transactionService');
const { ApiError } = require('../utils/apiError');

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const result = await transactionService.getUserTransactions(req.user.id, req.query);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.user.id, req.body);
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactionStats = async (req, res, next) => {
  try {
    const stats = await transactionService.getTransactionStats(req.user.id, req.query);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
