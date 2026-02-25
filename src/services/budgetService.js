const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { ApiError } = require('../utils/apiError');

exports.createBudget = async (userId, budgetData) => {
  const budget = await Budget.create({
    user: userId,
    ...budgetData
  });

  // Calculate current spent amount
  const spent = await this.calculateSpentAmount(userId, budgetData.category, budgetData.startDate, budgetData.endDate);
  budget.spent = spent;
  await budget.save();

  return budget.populate('category');
};

exports.getUserBudgets = async (userId, filters = {}) => {
  const query = { user: userId };
  
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  if (filters.period) {
    query.period = filters.period;
  }

  const budgets = await Budget.find(query)
    .populate('category')
    .sort({ createdAt: -1 });

  return budgets;
};

exports.getBudgetById = async (budgetId, userId) => {
  const budget = await Budget.findOne({ _id: budgetId, user: userId })
    .populate('category');
  
  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }
  
  return budget;
};

exports.updateBudget = async (budgetId, userId, updateData) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: budgetId, user: userId },
    updateData,
    { new: true, runValidators: true }
  ).populate('category');
  
  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }
  
  return budget;
};

exports.deleteBudget = async (budgetId, userId) => {
  const budget = await Budget.findOneAndDelete({ _id: budgetId, user: userId });
  
  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }
  
  return budget;
};

exports.calculateSpentAmount = async (userId, categoryId, startDate, endDate) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        category: categoryId,
        type: 'expense',
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  return result.length > 0 ? result[0].total : 0;
};

exports.checkBudgetAlerts = async (userId) => {
  const now = new Date();
  const budgets = await Budget.find({
    user: userId,
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).populate('category');

  const alerts = [];

  budgets.forEach(budget => {
    const percentageUsed = (budget.spent / budget.amount) * 100;
    
    if (percentageUsed >= budget.alertThreshold) {
      alerts.push({
        budget,
        percentageUsed,
        message: `You've used ${percentageUsed.toFixed(1)}% of your ${budget.category.name} budget`
      });
    }
  });

  return alerts;
};
