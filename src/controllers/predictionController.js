const predictionService = require('../services/predictionService');
const { ApiError } = require('../utils/apiError');

exports.getSpendingPrediction = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    const prediction = await predictionService.predictSpending(req.user.id, period);
    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
};

exports.getBudgetRecommendations = async (req, res, next) => {
  try {
    const recommendations = await predictionService.getBudgetRecommendations(req.user.id);
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

exports.getSavingsSuggestions = async (req, res, next) => {
  try {
    const suggestions = await predictionService.getSavingsSuggestions(req.user.id);
    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};

exports.getSpendingInsights = async (req, res, next) => {
  try {
    const insights = await predictionService.getSpendingInsights(req.user.id);
    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
};
