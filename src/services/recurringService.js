const Transaction = require('../models/Transaction');
const { ApiError } = require('../utils/apiError');

exports.createRecurringTransaction = async (userId, transactionData) => {
  if (!transactionData.isRecurring || !transactionData.recurringFrequency) {
    throw new ApiError(400, 'Transaction must be marked as recurring with a frequency');
  }

  const transaction = await Transaction.create({
    user: userId,
    ...transactionData
  });

  return transaction;
};

exports.getRecurringTransactions = async (userId) => {
  const transactions = await Transaction.find({
    user: userId,
    isRecurring: true
  }).populate('category');

  return transactions;
};

exports.processRecurringTransactions = async () => {
  // This function should be called by a cron job
  const recurringTransactions = await Transaction.find({
    isRecurring: true
  });

  const now = new Date();
  const processedTransactions = [];

  for (const transaction of recurringTransactions) {
    const shouldCreate = this.shouldCreateRecurringTransaction(transaction, now);
    
    if (shouldCreate) {
      const newTransaction = await Transaction.create({
        user: transaction.user,
        category: transaction.category,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        paymentMethod: transaction.paymentMethod,
        isRecurring: false, // The created instance is not recurring
        date: now
      });

      processedTransactions.push(newTransaction);
    }
  }

  return processedTransactions;
};

exports.shouldCreateRecurringTransaction = (transaction, currentDate) => {
  const lastDate = new Date(transaction.date);
  const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

  switch (transaction.recurringFrequency) {
    case 'daily':
      return daysDiff >= 1;
    case 'weekly':
      return daysDiff >= 7;
    case 'monthly':
      return daysDiff >= 30;
    case 'yearly':
      return daysDiff >= 365;
    default:
      return false;
  }
};

exports.updateRecurringTransaction = async (transactionId, userId, updateData) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId,
    isRecurring: true
  });

  if (!transaction) {
    throw new ApiError(404, 'Recurring transaction not found');
  }

  Object.assign(transaction, updateData);
  await transaction.save();

  return transaction;
};

exports.deleteRecurringTransaction = async (transactionId, userId) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: transactionId,
    user: userId,
    isRecurring: true
  });

  if (!transaction) {
    throw new ApiError(404, 'Recurring transaction not found');
  }

  return transaction;
};
