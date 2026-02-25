const mongoose = require('mongoose');

const productQuerySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  results: [{
    store: String,
    price: Number,
    currency: String,
    availability: Boolean,
    distance: Number,
    url: String,
    lastUpdated: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Document expires after 24 hours
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProductQuery', productQuerySchema);
