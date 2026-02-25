const admin = require('firebase-admin');
const config = require('../../config');

/**
 * Firebase Cloud Messaging (FCM) Client
 */
class FCMClient {
  constructor() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
      });
    }
    this.messaging = admin.messaging();
  }

  /**
   * Send push notification to a device
   * @param {string} token - Device FCM token
   * @param {Object} notification
   * @returns {Promise<string>}
   */
  async sendToDevice(token, notification) {
    try {
      const message = {
        token,
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: notification.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      const response = await this.messaging.send(message);
      console.log('Successfully sent FCM message:', response);
      return response;
    } catch (error) {
      console.error('Error sending FCM message:', error);
      throw new Error('Failed to send push notification');
    }
  }

  /**
   * Send push notification to multiple devices
   * @param {Array} tokens - Array of device FCM tokens
   * @param {Object} notification
   * @returns {Promise<Object>}
   */
  async sendToMultipleDevices(tokens, notification) {
    try {
      const message = {
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: notification.data || {},
        tokens
      };

      const response = await this.messaging.sendMulticast(message);
      console.log(`Successfully sent ${response.successCount} messages`);
      
      if (response.failureCount > 0) {
        console.error(`Failed to send ${response.failureCount} messages`);
      }

      return response;
    } catch (error) {
      console.error('Error sending FCM messages:', error);
      throw new Error('Failed to send push notifications');
    }
  }

  /**
   * Send to topic subscribers
   * @param {string} topic
   * @param {Object} notification
   * @returns {Promise<string>}
   */
  async sendToTopic(topic, notification) {
    try {
      const message = {
        topic,
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: notification.data || {}
      };

      const response = await this.messaging.send(message);
      console.log('Successfully sent topic message:', response);
      return response;
    } catch (error) {
      console.error('Error sending topic message:', error);
      throw new Error('Failed to send topic notification');
    }
  }
}

module.exports = new FCMClient();
