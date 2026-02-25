const cron = require('node-cron');
const recurringService = require('../services/recurringService');

/**
 * Job to process recurring transactions
 * Runs daily at midnight
 */
const processRecurringTransactions = cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running recurring transactions job...');
    const processedTransactions = await recurringService.processRecurringTransactions();
    console.log(`Processed ${processedTransactions.length} recurring transactions`);
  } catch (error) {
    console.error('Error processing recurring transactions:', error);
  }
});

module.exports = {
  start: () => {
    processRecurringTransactions.start();
    console.log('Recurring transactions job started');
  },
  stop: () => {
    processRecurringTransactions.stop();
    console.log('Recurring transactions job stopped');
  }
};
