import { getNoSql } from '../config/mongoDb.js';
import { ObjectId } from 'mongodb';

const COLLECTION = 'notifications';

export async function createNotification(userId, type, message) {
  try {
    const db = getNoSql();
    const notification = {
      userId,
      type,
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    const result = await db.collection(COLLECTION).insertOne(notification);
    
    return { _id: result.insertedId, ...notification };
  } catch (error) {
    console.error("Error inserting notification into database", error);
    throw error;
  }
}

export async function getNotificationsByUserId(userId) {
  try {
    const db = getNoSql();
    
    const notifications = await db.collection(COLLECTION)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
      
    return notifications;
  } catch (error) {
    console.error("Error selecting notifications from database", error);
    throw error;
  }
}

export async function markAsRead(notificationId) {
  try {
    const db = getNoSql();
    
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(notificationId) },
      { $set: { isRead: true } },
      { returnDocument: 'after' }
    );
    
    return result;
  } catch (error) {
    console.error("Error updating notification in database", error);
    throw error;
  }
}

export async function deleteNotification(notificationId) {
  try {
    const db = getNoSql();
    
    const result = await db.collection(COLLECTION).findOneAndDelete({
      _id: new ObjectId(notificationId)
    });
    
    return result;
  } catch (error) {
    console.error("Error deleting notification from database", error);
    throw error;
  }
}
