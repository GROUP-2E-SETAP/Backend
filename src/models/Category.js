const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify category type']
  },
  icon: {
    type: String,
    default: 'default'
  },
  color: {
    type: String,
    default: '#000000'
  },
  isDefault: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Category', categorySchema);
