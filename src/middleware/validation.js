import { ApiError } from "../utils/apiError.js"

export const validateCategory = (req, res, next) => {
  const { name, type } = req.body;

  if (!name || !type) {
    throw new ApiError(400, 'Please provide name and type');
  }

  if (!['income', 'expense'].includes(type)) {
    throw new ApiError(400, 'Type must be either income or expense');
  }

  next();
};

export const validateTransaction = (req, res, next) => {
  const { category, amount, type } = req.body;

  if (!category || !amount || !type) {
    throw new ApiError(400, 'Please provide category, amount, and type');
  }

  if (!['income', 'expense'].includes(type)) {
    throw new ApiError(400, 'Type must be either income or expense');
  }

  if (amount < 0) {
    throw new ApiError(400, 'Amount must be positive');
  }

  next();
};

export const validateBudget = (req, res, next) => {
  const { category, amount, startDate, endDate } = req.body;

  if (!category || !amount || !startDate || !endDate) {
    throw new ApiError(400, 'Please provide category, amount, startDate, and endDate');
  }

  if (amount < 0) {
    throw new ApiError(400, 'Amount must be positive');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    throw new ApiError(400, 'End date must be after start date');
  }

  next();
};

export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and password');
  }

  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Please provide a valid email');
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  next();
};
