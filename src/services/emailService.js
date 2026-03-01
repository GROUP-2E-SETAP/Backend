import nodemailer from 'nodemailer';
import config from "../config/index.js"

// Create transporter
const transporter = nodemailer.createTransport({
  service: config.EMAIL_SERVICE || 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ Email service not configured:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"SETAP Finance" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to SETAP Finance! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Welcome, ${name}!</h1>
        <p>Thank you for joining SETAP Finance. We're excited to help you manage your finances better.</p>
        <p>Get started by:</p>
        <ul>
          <li>Creating your first budget</li>
          <li>Logging your transactions</li>
          <li>Exploring our financial insights</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p style="color: #666; font-size: 12px;">© 2026 SETAP Finance. All rights reserved.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"SETAP Finance" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request 🔐',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666;">This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        <p style="color: #666; font-size: 12px;">© 2026 SETAP Finance. All rights reserved.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    throw error;
  }
};

// Send email verification
export const sendEmailVerification = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: `"SETAP Finance" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email Address ✉️',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Verify Your Email</h1>
        <p>Please verify your email address to activate your SETAP Finance account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666;">This link will expire in 24 hours.</p>
        <p style="color: #666; font-size: 12px;">© 2026 SETAP Finance. All rights reserved.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    throw error;
  }
};

// Send budget alert
export const sendBudgetAlert = async (email, name, budgetName, percentageUsed) => {
  const mailOptions = {
    from: `"SETAP Finance" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '⚠️ Budget Alert - SETAP Finance',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF9800;">Budget Alert</h1>
        <p>Hi ${name},</p>
        <p>You've used <strong>${percentageUsed.toFixed(1)}%</strong> of your <strong>${budgetName}</strong> budget.</p>
        <p>Consider reviewing your spending to stay within your budget.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/budgets" 
             style="background-color: #FF9800; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            View Budget
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">© 2026 SETAP Finance. All rights reserved.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Budget alert email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send budget alert:', error.message);
  }
};

export default {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendBudgetAlert
};
