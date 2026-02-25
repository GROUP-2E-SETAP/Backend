import express from 'express';
const router = express.Router();

// Import v1 routes
import authRoutes from './v1/authRoutes.js';

// Mount v1 routes
router.use('/auth', authRoutes);

// Placeholder for other routes - these need to be converted to ES6
// TODO: Convert all route files to ES6 modules
router.get('/categories', (req, res) => {
  res.json({ message: 'Categories endpoint - under construction' });
});

router.get('/transactions', (req, res) => {
  res.json({ message: 'Transactions endpoint - under construction' });
});

router.get('/budgets', (req, res) => {
  res.json({ message: 'Budgets endpoint - under construction' });
});

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Dashboard endpoint - under construction' });
});

router.get('/gamification', (req, res) => {
  res.json({ message: 'Gamification endpoint - under construction' });
});

router.get('/notifications', (req, res) => {
  res.json({ message: 'Notifications endpoint - under construction' });
});

router.get('/predictions', (req, res) => {
  res.json({ message: 'Predictions endpoint - under construction' });
});

router.get('/price-comparison', (req, res) => {
  res.json({ message: 'Price comparison endpoint - under construction' });
});

export default router;
