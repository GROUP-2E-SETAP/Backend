const express = require('express');
const router = express.Router();
const predictionController = require('../../controllers/predictionController');
const { protect } = require('../../middleware/auth');

router.use(protect);

router.get('/spending', predictionController.getSpendingPrediction);
router.get('/budget-recommendations', predictionController.getBudgetRecommendations);
router.get('/savings-suggestions', predictionController.getSavingsSuggestions);
router.get('/insights', predictionController.getSpendingInsights);

module.exports = router;
