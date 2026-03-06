import express from 'express';
import authRoutes from './v1/authRoutes.js';
import categoryRoutes from './v1/categoryRoutes.js'; 
import transactionRoutes from './v1/transactionRoutes.js';
import budgetRoutes from './v1/budgetRoutes.js';
import notificationRoutes from './v1/notificationRoutes.js';

const router = express.Router();

// Mount v1 routes
router.use('/auth', authRoutes);

router.use('/categories', categoryRoutes);

router.use('/transactions', transactionRoutes);

router.use('/budgets', budgetRoutes);

router.use('/notifications', notificationRoutes);

export default router;
