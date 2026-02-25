const express = require('express');
const router = express.Router();
const gamificationController = require('../../controllers/gamificationController');
const { protect } = require('../../middleware/auth');

router.use(protect);

router.get('/progress', gamificationController.getUserProgress);
router.get('/achievements', gamificationController.getAchievements);
router.get('/badges', gamificationController.getBadges);
router.get('/leaderboard', gamificationController.getLeaderboard);

module.exports = router;
