const express = require('express');
const router = express.Router();
const priceComparisonController = require('../../controllers/priceComparisonController');
const { protect } = require('../../middleware/auth');

router.use(protect);

router.get('/search', priceComparisonController.searchProduct);
router.post('/compare', priceComparisonController.compareProducts);
router.get('/nearby-stores', priceComparisonController.getNearbyStores);

module.exports = router;
