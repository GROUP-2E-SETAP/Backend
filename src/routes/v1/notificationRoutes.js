import express from 'express';
import {
  addNotification,
  getNotifications,
  markNotificationRead,
  removeNotification
} from '../../controllers/notificationControllers.js';
import { authenticate } from '../../middleware/advancedauth.js';

const router = express.Router();

router.post('/', addNotification);
router.get('/:userId', getNotifications);
router.put('/:notificationId/read', markNotificationRead);
router.delete('/:notificationId', removeNotification);

export default router;
