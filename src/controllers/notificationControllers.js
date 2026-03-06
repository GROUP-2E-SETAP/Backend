import { 
  createNotification,
  getNotificationsByUserId,
  markAsRead,
  deleteNotification
} from '../services/notificationServices.js';
import ResponseHandler from '../utils/responseHandler.js';

export async function addNotification(req, res) {
  try {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      return ResponseHandler.badRequest(res, "userId, type, and message are required fields");
    }

    const newNotification = await createNotification(userId, type, message);

    if (newNotification) return ResponseHandler.success(res, newNotification);
    return ResponseHandler.error(res);

  } catch (error) {
    console.log("Error creating notification: ", error);
    return ResponseHandler.serverError(res, error);
  }
}

export async function getNotifications(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return ResponseHandler.badRequest(res, "userId is required");
    }

    const notifications = await getNotificationsByUserId(userId);

    if (notifications) return ResponseHandler.success(res, notifications);
    return res.status(400).json({ message: "Error fetching notifications" });

  } catch (error) {
    console.log("Error fetching notifications: ", error);
    return ResponseHandler.serverError(res, error);
  }
}

export async function markNotificationRead(req, res) {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
        return ResponseHandler.badRequest(res, "notificationId is required");
    }

    const updatedNotification = await markAsRead(notificationId);

    if (updatedNotification) return ResponseHandler.success(res, updatedNotification);
    return ResponseHandler.error(res, "Notification not found or could not be updated");

  } catch (error) {
    console.log("Error updating notification: ", error);
    return ResponseHandler.serverError(res, error);
  }
}

export async function removeNotification(req, res) {
  try {
    const { notificationId } = req.params;

    if (!notificationId) return ResponseHandler.badRequest(res, "notificationId is required");
    
    const deletedNotification = await deleteNotification(notificationId);

    if (deletedNotification) return ResponseHandler.success(res, deletedNotification);
   
    return ResponseHandler.error(res, "Notification not found or could not be deleted");
  } catch (error) {
    console.log("Error deleting notification: ", error);
    return ResponseHandler.serverError(res, error);
  }
}
