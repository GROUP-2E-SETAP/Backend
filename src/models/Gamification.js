const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  points: Number,
  unlockedAt: Date
});

const gamificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  achievements: [achievementSchema],
  badges: [{
    type: String
  }],
  streaks: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivityDate: {
      type: Date,
      default: null
    }
  },
  statistics: {
    transactionsLogged: {
      type: Number,
      default: 0
    },
    budgetsCreated: {
      type: Number,
      default: 0
    },
    savingsGoalsAchieved: {
      type: Number,
      default: 0
    }
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

module.exports = mongoose.model('Gamification', gamificationSchema);
