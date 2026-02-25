const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { ApiError } = require('../utils/apiError');
const { startOfMonth, endOfMonth, startOfWeek, endOfWeek } = require('../utils/dateHelpers');

exports.createTransaction = async (userId, transactionData) => {
  const transaction = await Transaction.create({
    user: userId,
    ...transactionData
  });

  // Update budget spent amount if applicable
  if (transactionData.type === 'expense') {
    await this.updateBudgetSpent(userId, transactionData.category, transactionData.amount);
  }

  return transaction.populate('category');
};

exports.getUserTransactions = async (userId, filters = {}) => {
  const query = { user: userId };
  const { page = 1, limit = 50, startDate, endDate, type, category, sort = '-date' } = filters;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (type) query.type = type;
  if (category) query.category = category;

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Transaction.countDocuments(query)
  ]);

  return {
    data: transactions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

exports.getTransactionById = async (transactionId, userId) => {
  const transaction = await Transaction.findOne({ _id: transactionId, user: userId })
    .populate('category');
  
  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }
  
  return transaction;
};

exports.updateTransaction = async (transactionId, userId, updateData) => {
  const oldTransaction = await Transaction.findOne({ _id: transactionId, user: userId });
  
  if (!oldTransaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, user: userId },
    updateData,
    { new: true, runValidators: true }
  ).populate('category');

  // Update budget if amount or category changed
  if (oldTransaction.type === 'expense') {
    const amountDiff = (updateData.amount || oldTransaction.amount) - oldTransaction.amount;
    await this.updateBudgetSpent(userId, oldTransaction.category, -oldTransaction.amount);
    if (updateData.amount) {
      await this.updateBudgetSpent(userId, updateData.category || oldTransaction.category, updateData.amount);
    }
  }

  return transaction;
};

exports.deleteTransaction = async (transactionId, userId) => {
  const transaction = await Transaction.findOneAndDelete({ _id: transactionId, user: userId });
  
  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  // Update budget
  if (transaction.type === 'expense') {
    await this.updateBudgetSpent(userId, transaction.category, -transaction.amount);
  }

  return transaction;
};

exports.getTransactionStats = async (userId, filters = {}) => {
  const { period = 'month' } = filters;
  let startDate, endDate;

  const now = new Date();
  if (period === 'month') {
    startDate = startOfMonth(now);
    endDate = endOfMonth(now);
  } else if (period === 'week') {
    startDate = startOfWeek(now);
    endDate = endOfWeek(now);
  }

  const stats = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    income: 0,
    expense: 0,
    balance: 0,
    transactionCount: 0
  };

  stats.forEach(stat => {
    if (stat._id === 'income') {
      result.income = stat.total;
      result.transactionCount += stat.count;
    } else if (stat._id === 'expense') {
      result.expense = stat.total;
      result.transactionCount += stat.count;
    }
  });

  result.balance = result.income - result.expense;

  return result;
};

exports.getSpendingByCategory = async (userId, filters = {}) => {
  const { period = 'month' } = filters;
  let startDate, endDate;

  const now = new Date();
  if (period === 'month') {
    startDate = startOfMonth(now);
    endDate = endOfMonth(now);
  }

  const breakdown = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: 'expense',
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $unwind: '$category'
    },
    {
      $sort: { total: -1 }
    }
  ]);

  return breakdown;
};

exports.updateBudgetSpent = async (userId, categoryId, amount) => {
  const now = new Date();
  await Budget.updateMany(
    {
      user: userId,
      category: categoryId,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    },
    {
      $inc: { spent: amount }
    }
  );
};
