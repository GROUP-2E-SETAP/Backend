const axios = require('axios');
const config = require('../../config');

/**
 * SMS Client for sending text notifications
 */
class SMSClient {
  constructor() {
    this.apiKey = config.smsApiKey;
    this.baseUrl = process.env.SMS_API_URL || 'https://api.twilio.com';
    this.from = process.env.SMS_FROM_NUMBER;
  }

  /**
   * Send SMS notification
   * @param {string} to - Phone number
   * @param {Object} notification
   * @returns {Promise<Object>}
   */
  async send(to, notification) {
    try {
      // Example using Twilio API structure
      const response = await axios.post(
        `${this.baseUrl}/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        new URLSearchParams({
          To: to,
          From: this.from,
          Body: `${notification.title}: ${notification.message}`
        }),
        {
          auth: {
            username: process.env.TWILIO_ACCOUNT_SID,
            password: this.apiKey
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      console.log('SMS sent:', response.data.sid);
      return response.data;
    } catch (error) {
      console.error('Error sending SMS:', error.message);
      throw new Error('Failed to send SMS notification');
    }
  }

  /**
   * Send budget alert SMS
   * @param {string} to
   * @param {string} budgetName
   * @param {number} percentage
   * @returns {Promise<Object>}
   */
  async sendBudgetAlert(to, budgetName, percentage) {
    const notification = {
      title: 'Budget Alert',
      message: `You've used ${percentage}% of your ${budgetName} budget.`
    };

    return this.send(to, notification);
  }

  /**
   * Send verification code
   * @param {string} to
   * @param {string} code
   * @returns {Promise<Object>}
   */
  async sendVerificationCode(to, code) {
    const notification = {
      title: 'Verification Code',
      message: `Your SETAP Finance verification code is: ${code}`
    };

    return this.send(to, notification);
  }
}

module.exports = new SMSClient();
