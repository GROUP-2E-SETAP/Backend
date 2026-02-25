const budgetService = require('../services/budgetService');
const { ApiError } = require('../utils/apiError');

exports.createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetService.getUserBudgets(req.user.id, req.query);
    res.status(200).json({
      success: true,
      data: budgets
    });
  } catch (error) {
    next(error);
  }
};

exports.getBudgetById = async (req, res, next) => {
  try {
    const budget = await budgetService.getBudgetById(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.updateBudget(req.params.id, req.user.id, req.body);
    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
