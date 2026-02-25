module.exports = {
  // Transaction types
  TRANSACTION_TYPES: {
    INCOME: 'income',
    EXPENSE: 'expense'
  },

  // Payment methods
  PAYMENT_METHODS: {
    CASH: 'cash',
    CARD: 'card',
    BANK_TRANSFER: 'bank_transfer',
    MOBILE_PAYMENT: 'mobile_payment',
    OTHER: 'other'
  },

  // Recurring frequencies
  RECURRING_FREQUENCIES: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
  },

  // Budget periods
  BUDGET_PERIODS: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
  },

  // Notification types
  NOTIFICATION_TYPES: {
    BUDGET_ALERT: 'budget_alert',
    ACHIEVEMENT: 'achievement',
    REMINDER: 'reminder',
    TIP: 'tip',
    SYSTEM: 'system',
    TRANSACTION: 'transaction'
  },

  // Notification priorities
  NOTIFICATION_PRIORITIES: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },

  // User roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },

  // Gamification
  POINTS_PER_LEVEL: 100,
  POINTS_FOR_TRANSACTION: 5,
  POINTS_FOR_BUDGET_CREATION: 10,
  POINTS_FOR_GOAL_ACHIEVED: 50,

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};
