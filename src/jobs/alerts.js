const cron = require('node-cron');
const budgetService = require('../services/budgetService');
const notificationService = require('../services/notificationService');
const User = require('../models/User');

/**
 * Job to check budget alerts
 * Runs every hour
 */
const checkBudgetAlerts = cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running budget alerts job...');
    
    const users = await User.find({ isVerified: true });

    for (const user of users) {
      const alerts = await budgetService.checkBudgetAlerts(user._id);

      for (const alert of alerts) {
        await notificationService.createNotification(user._id, {
          type: 'budget_alert',
          title: 'Budget Alert',
          message: alert.message,
          priority: 'high',
          data: {
            budgetId: alert.budget._id,
            percentageUsed: alert.percentageUsed
          }
        });
      }
    }

    console.log(`Checked budget alerts for ${users.length} users`);
  } catch (error) {
    console.error('Error checking budget alerts:', error);
  }
});

module.exports = {
  start: () => {
    checkBudgetAlerts.start();
    console.log('Budget alerts job started');
  },
  stop: () => {
    checkBudgetAlerts.stop();
    console.log('Budget alerts job stopped');
  }
};
