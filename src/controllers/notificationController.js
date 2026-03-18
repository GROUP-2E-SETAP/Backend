import { getNoSql } from '../config/mongoDb.js';
import { ObjectId } from 'mongodb';

// Create a notification
async function createNotification(req, res, next) {
    try {
        const db = getNoSql();
        const { user_id, type, title, message, priority = 'medium', data = null } = req.body;

        const notification = {
            user_id,
            type,
            title,
            message,
            priority,
            is_read: false,
            read_at: null,
            data,
            created_at: new Date()
        };

        const result = await db.collection('notifications').insertOne(notification);
        return res.status(201).json({ success: true, data: { ...notification, _id: result.insertedId } });
    } catch (error) {
        next(error);
    }
}

// Fetch all notifications for a user
async function getNotificationsByUserId(req, res, next) {
    try {
        const db = getNoSql();
        const { userId } = req.params;

        const notifications = await db.collection('notifications')
            .find({ user_id: parseInt(userId) })
            .sort({ created_at: -1 }) // newest first
            .toArray();

        return res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
}

// Mark a notification as read
async function markAsRead(req, res, next) {
    try {
        const db = getNoSql();
        const { id } = req.params;

        const result = await db.collection('notifications').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { is_read: true, read_at: new Date() } },
            { returnDocument: 'after' }
        );

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export { createNotification, getNotificationsByUserId, markAsRead };