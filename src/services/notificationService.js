const Notification = require('../models/Notification');
const { ApiError } = require('../utils/apiError');

exports.createNotification = async (userId, notificationData) => {
  const notification = await Notification.create({
    user: userId,
    ...notificationData
  });

  // TODO: Send notification through appropriate channels (push, email, SMS)
  await this.sendNotification(notification);

  return notification;
};

exports.getUserNotifications = async (userId, filters = {}) => {
  const query = { user: userId };
  const { page = 1, limit = 20, isRead, type } = filters;

  if (isRead !== undefined) {
    query.isRead = isRead;
  }

  if (type) {
    query.type = type;
  }

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Notification.countDocuments(query)
  ]);

  return {
    data: notifications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

exports.markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  return notification;
};

exports.markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

exports.deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  return notification;
};

exports.getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({
    user: userId,
    isRead: false
  });

  return count;
};

exports.sendNotification = async (notification) => {
  // TODO: Implement actual notification sending logic
  // This would integrate with FCM, email service, SMS service, etc.
  
  if (notification.channels.push) {
    // Send push notification
  }

  if (notification.channels.email) {
    // Send email
  }

  if (notification.channels.sms) {
    // Send SMS
  }

  notification.sentAt = new Date();
  await notification.save();
};
