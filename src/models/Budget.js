const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a budget amount'],
    min: 0
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  alertThreshold: {
    type: Number,
    default: 80, // Alert when 80% of budget is spent
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual field for remaining budget
budgetSchema.virtual('remaining').get(function() {
  return this.amount - this.spent;
});

// Virtual field for percentage used
budgetSchema.virtual('percentageUsed').get(function() {
  return (this.spent / this.amount) * 100;
});

module.exports = mongoose.model('Budget', budgetSchema);
