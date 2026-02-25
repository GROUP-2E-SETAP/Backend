// PostgreSQL Models (User class for structured queries)
export class User {
  static async findById(id) {
    const { pool } = await import('../database/index.js');
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email) {
    const { pool } = await import('../database/index.js');
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async create(userData) {
    const { pool } = await import('../database/index.js');
    const { email, password, name } = userData;
    const result = await pool.query(
      'INSERT INTO users (email, password, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [email, password, name]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const { pool } = await import('../database/index.js');
    const fields = Object.keys(updates).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    const result = await pool.query(
      `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  }
}

// MongoDB Models (Mongoose schemas for transactions)
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: String, // PostgreSQL user ID
    required: true,
    index: true
  },
  category_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  payment_method: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'mobile_payment', 'other'],
    default: 'cash'
  },
  is_recurring: {
    type: Boolean,
    default: false
  },
  recurring_frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', null],
    default: null
  },
  receipt_url: {
    type: String,
    default: null
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  tags: [String],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'transactions'
});

// Indexes for ML queries
transactionSchema.index({ user_id: 1, date: -1 });
transactionSchema.index({ user_id: 1, type: 1, date: -1 });
transactionSchema.index({ user_id: 1, category_id: 1, date: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);

// Product Query Model (MongoDB - for price comparison cache)
const productQuerySchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  category: String,
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
    last_updated: Date
  }],
  created_at: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  }
}, {
  timestamps: true
});

export const ProductQuery = mongoose.model('ProductQuery', productQuerySchema);
