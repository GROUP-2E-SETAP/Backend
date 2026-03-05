import express from 'express';
import authRoutes from './v1/authRoutes.js';
import categoryRoutes from './v1/categoryRoutes.js'; 

const router = express.Router();

// Mount v1 routes
router.use('/auth', authRoutes);

router.use('/categories',categoryRoutes) ;

export default router;
