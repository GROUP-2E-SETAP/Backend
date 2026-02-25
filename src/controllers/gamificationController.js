const gamificationService = require('../services/gamificationService');
const { ApiError } = require('../utils/apiError');

exports.getUserProgress = async (req, res, next) => {
  try {
    const progress = await gamificationService.getUserProgress(req.user.id);
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

exports.getAchievements = async (req, res, next) => {
  try {
    const achievements = await gamificationService.getAchievements(req.user.id);
    res.status(200).json({
      success: true,
      data: achievements
    });
  } catch (error) {
    next(error);
  }
};

exports.getBadges = async (req, res, next) => {
  try {
    const badges = await gamificationService.getBadges(req.user.id);
    res.status(200).json({
      success: true,
      data: badges
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await gamificationService.getLeaderboard(limit);
    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};
