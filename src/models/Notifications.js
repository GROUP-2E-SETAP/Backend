const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: Number, // matches your PostgreSQL users.id
    required: true
  },
  type: {
    type: String,
    enum: ['budget_alert', 'achievement', 'reminder', 'tip', 'system', 'transaction'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  is_read: {
    type: Boolean,
    default: false
  },
  read_at: {
    type: Date,
    default: null
  },
  data: {
    type: Object,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);