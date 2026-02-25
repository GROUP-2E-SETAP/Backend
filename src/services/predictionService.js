const Transaction = require('../models/Transaction');
const { ApiError } = require('../utils/apiError');
const { startOfMonth, endOfMonth, subMonths } = require('../utils/dateHelpers');

exports.predictSpending = async (userId, period = 'month') => {
  // Get historical data (last 3-6 months)
  const now = new Date();
  const monthsBack = 6;
  const historicalData = [];

  for (let i = 0; i < monthsBack; i++) {
    const date = subMonths(now, i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const spending = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    historicalData.push({
      month: date.toISOString().slice(0, 7),
      amount: spending.length > 0 ? spending[0].total : 0
    });
  }

  // Simple average prediction (can be enhanced with ML)
  const avgSpending = historicalData.reduce((sum, item) => sum + item.amount, 0) / monthsBack;
  
  // Calculate trend
  const recentAvg = historicalData.slice(0, 3).reduce((sum, item) => sum + item.amount, 0) / 3;
  const olderAvg = historicalData.slice(3).reduce((sum, item) => sum + item.amount, 0) / 3;
  const trend = recentAvg > olderAvg ? 'increasing' : recentAvg < olderAvg ? 'decreasing' : 'stable';

  return {
    prediction: avgSpending,
    trend,
    historicalData,
    confidence: 'medium' // Can be calculated based on variance
  };
};

exports.getBudgetRecommendations = async (userId) => {
  const prediction = await this.predictSpending(userId);
  
  // Get spending by category
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const categoryBreakdown = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: 'expense',
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' }
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
    }
  ]);

  const recommendations = categoryBreakdown.map(item => ({
    category: item.category.name,
    currentSpending: item.total,
    recommendedBudget: Math.ceil(item.total * 1.1), // 10% buffer
    reason: 'Based on current spending patterns'
  }));

  return {
    recommendations,
    totalRecommendedBudget: Math.ceil(prediction.prediction * 1.1)
  };
};

exports.getSavingsSuggestions = async (userId) => {
  // Analyze spending patterns and suggest savings
  const now = new Date();
  const start = subMonths(now, 3);
  
  const transactions = await Transaction.find({
    user: userId,
    type: 'expense',
    date: { $gte: start }
  }).populate('category');

  // Group by category and find high spending areas
  const categorySpending = {};
  transactions.forEach(t => {
    const catName = t.category.name;
    if (!categorySpending[catName]) {
      categorySpending[catName] = { total: 0, count: 0 };
    }
    categorySpending[catName].total += t.amount;
    categorySpending[catName].count += 1;
  });

  const suggestions = [];

  // Find categories with high spending
  Object.entries(categorySpending).forEach(([category, data]) => {
    if (data.total > 500) { // Threshold
      suggestions.push({
        category,
        currentSpending: data.total,
        potentialSavings: data.total * 0.2, // Suggest 20% reduction
        tip: `Consider reducing spending on ${category} by 20%`
      });
    }
  });

  return suggestions;
};

exports.getSpendingInsights = async (userId) => {
  const now = new Date();
  const thisMonth = {
    start: startOfMonth(now),
    end: endOfMonth(now)
  };
  const lastMonth = {
    start: startOfMonth(subMonths(now, 1)),
    end: endOfMonth(subMonths(now, 1))
  };

  const [thisMonthSpending, lastMonthSpending] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: thisMonth.start, $lte: thisMonth.end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]),
    Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: lastMonth.start, $lte: lastMonth.end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ])
  ]);

  const thisTotal = thisMonthSpending.length > 0 ? thisMonthSpending[0].total : 0;
  const lastTotal = lastMonthSpending.length > 0 ? lastMonthSpending[0].total : 0;
  const change = lastTotal > 0 ? ((thisTotal - lastTotal) / lastTotal) * 100 : 0;

  return {
    thisMonthSpending: thisTotal,
    lastMonthSpending: lastTotal,
    percentageChange: change,
    insight: change > 10 
      ? 'Your spending has increased significantly this month'
      : change < -10 
      ? 'Great job! Your spending has decreased this month'
      : 'Your spending is relatively stable'
  };
};
