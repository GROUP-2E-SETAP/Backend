import express from 'express';
import * as notificationController from '../../controllers/notificationController.js';
import { authenticate } from '../../middleware/advancedauth.js';

const router = express.Router();

// Fetch all notifications for a user
router.get('/user/:userId', authenticate, notificationController.getNotificationsByUserId);

// Create a notification
router.post('/', authenticate, notificationController.createNotification);

// Mark a notification as read
router.patch('/:id/read', authenticate, notificationController.markAsRead);

export default router;