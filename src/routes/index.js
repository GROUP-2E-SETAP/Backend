import express from 'express';
const router = express.Router();
// Import v1 routes
import authRoutes from './v1/authRoutes.js';

// Mount v1 routes
router.use('/auth', authRoutes);

// Placeholder for other routes - these need to be converted to ES6

export default router;
