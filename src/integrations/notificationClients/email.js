const nodemailer = require('nodemailer');
const config = require('../../config');

/**
 * Email Client for sending notifications
 */
class EmailClient {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.emailService || 'gmail',
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });
  }

  /**
   * Send email notification
   * @param {string} to - Recipient email
   * @param {Object} notification
   * @returns {Promise<Object>}
   */
  async send(to, notification) {
    try {
      const mailOptions = {
        from: `"SETAP Finance" <${config.emailUser}>`,
        to,
        subject: notification.title,
        html: this.generateEmailTemplate(notification)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  /**
   * Generate email HTML template
   * @param {Object} notification
   * @returns {string}
   */
  generateEmailTemplate(notification) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${notification.title}</h1>
            </div>
            <div class="content">
              <p>${notification.message}</p>
              ${notification.data && notification.data.action ? 
                `<p><a href="${notification.data.action}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Take Action</a></p>` 
                : ''}
            </div>
            <div class="footer">
              <p>© 2026 SETAP Finance. All rights reserved.</p>
              <p><a href="#">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Send welcome email
   * @param {string} to
   * @param {string} name
   * @returns {Promise<Object>}
   */
  async sendWelcomeEmail(to, name) {
    const notification = {
      title: 'Welcome to SETAP Finance!',
      message: `Hi ${name},\n\nThank you for joining SETAP Finance. We're excited to help you manage your finances better.\n\nGet started by creating your first budget or logging a transaction.`,
      data: {
        action: process.env.APP_URL || 'https://app.setapfinance.com'
      }
    };

    return this.send(to, notification);
  }

  /**
   * Send password reset email
   * @param {string} to
   * @param {string} resetToken
   * @returns {Promise<Object>}
   */
  async sendPasswordReset(to, resetToken) {
    const notification = {
      title: 'Password Reset Request',
      message: 'You requested to reset your password. Click the button below to proceed.',
      data: {
        action: `${process.env.APP_URL}/reset-password?token=${resetToken}`
      }
    };

    return this.send(to, notification);
  }
}

module.exports = new EmailClient();
