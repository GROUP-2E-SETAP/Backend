const cron = require('node-cron');
const predictionService = require('../services/predictionService');

/**
 * Job to update predictions
 * Runs daily at 2 AM
 */
const updatePredictions = cron.schedule('0 2 * * *', async () => {
  try {
    console.log('Running predictions update job...');
    // TODO: Implement prediction update logic
    // This could cache predictions for all users to improve performance
    console.log('Predictions updated successfully');
  } catch (error) {
    console.error('Error updating predictions:', error);
  }
});

module.exports = {
  start: () => {
    updatePredictions.start();
    console.log('Predictions update job started');
  },
  stop: () => {
    updatePredictions.stop();
    console.log('Predictions update job stopped');
  }
};
