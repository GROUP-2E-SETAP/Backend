import express from 'express'
import authRoutes from './v1/authRoutes.js'
import categoryRoutes from './v1/categoryRoutes.js'
import users from './v1/userRoutes.js'

const router = express.Router();

// Mount v1 routes
router.use('/auth', authRoutes);
router.use('/categories',categoryRoutes) ;
router.use('/users',users);

export default router;
