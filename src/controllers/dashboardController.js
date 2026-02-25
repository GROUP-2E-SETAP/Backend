const transactionService = require('../services/transactionService');
const budgetService = require('../services/budgetService');
const { ApiError } = require('../utils/apiError');

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    
    // Get transaction stats
    const transactionStats = await transactionService.getTransactionStats(req.user.id, { period });
    
    // Get budget overview
    const budgets = await budgetService.getUserBudgets(req.user.id, { isActive: true });
    
    // Calculate budget utilization
    const budgetSummary = budgets.reduce((acc, budget) => {
      acc.total += budget.amount;
      acc.spent += budget.spent;
      return acc;
    }, { total: 0, spent: 0 });

    res.status(200).json({
      success: true,
      data: {
        transactions: transactionStats,
        budgets: {
          ...budgetSummary,
          count: budgets.length,
          remaining: budgetSummary.total - budgetSummary.spent
        },
        period
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const transactions = await transactionService.getUserTransactions(req.user.id, {
      limit,
      sort: '-createdAt'
    });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

exports.getSpendingByCategory = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    
    const categoryBreakdown = await transactionService.getSpendingByCategory(req.user.id, { period });

    res.status(200).json({
      success: true,
      data: categoryBreakdown
    });
  } catch (error) {
    next(error);
  }
};
