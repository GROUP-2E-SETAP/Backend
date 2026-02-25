const Gamification = require('../models/Gamification');
const User = require('../models/User');
const { ApiError } = require('../utils/apiError');

exports.getUserProgress = async (userId) => {
  let gamification = await Gamification.findOne({ user: userId });
  
  if (!gamification) {
    gamification = await Gamification.create({ user: userId });
  }
  
  return gamification;
};

exports.addPoints = async (userId, points, reason) => {
  let gamification = await Gamification.findOne({ user: userId });
  
  if (!gamification) {
    gamification = await Gamification.create({ user: userId });
  }

  gamification.totalPoints += points;
  
  // Check for level up (e.g., 100 points per level)
  const newLevel = Math.floor(gamification.totalPoints / 100) + 1;
  if (newLevel > gamification.level) {
    gamification.level = newLevel;
  }

  await gamification.save();

  // Update user's gamification stats
  await User.findByIdAndUpdate(userId, {
    gamificationLevel: gamification.level,
    gamificationPoints: gamification.totalPoints
  });

  return gamification;
};

exports.updateStreak = async (userId) => {
  let gamification = await Gamification.findOne({ user: userId });
  
  if (!gamification) {
    gamification = await Gamification.create({ user: userId });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = gamification.streaks.lastActivityDate;
  
  if (!lastActivity) {
    // First activity
    gamification.streaks.current = 1;
    gamification.streaks.longest = 1;
    gamification.streaks.lastActivityDate = today;
  } else {
    const lastActivityDate = new Date(lastActivity);
    lastActivityDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - lastActivityDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      gamification.streaks.current += 1;
      if (gamification.streaks.current > gamification.streaks.longest) {
        gamification.streaks.longest = gamification.streaks.current;
      }
      gamification.streaks.lastActivityDate = today;
    } else if (daysDiff > 1) {
      // Streak broken
      gamification.streaks.current = 1;
      gamification.streaks.lastActivityDate = today;
    }
    // If daysDiff === 0, same day, no change
  }

  await gamification.save();
  return gamification;
};

exports.unlockAchievement = async (userId, achievementData) => {
  const gamification = await Gamification.findOne({ user: userId });
  
  if (!gamification) {
    throw new ApiError(404, 'Gamification profile not found');
  }

  // Check if achievement already unlocked
  const exists = gamification.achievements.some(a => a.name === achievementData.name);
  
  if (!exists) {
    gamification.achievements.push({
      ...achievementData,
      unlockedAt: new Date()
    });
    
    // Add points for achievement
    gamification.totalPoints += achievementData.points;
    
    await gamification.save();
  }

  return gamification;
};

exports.getAchievements = async (userId) => {
  const gamification = await Gamification.findOne({ user: userId });
  
  if (!gamification) {
    return [];
  }
  
  return gamification.achievements;
};

exports.getBadges = async (userId) => {
  const gamification = await Gamification.findOne({ user: userId });
  
  if (!gamification) {
    return [];
  }
  
  return gamification.badges;
};

exports.getLeaderboard = async (limit = 10) => {
  const topUsers = await Gamification.find()
    .sort({ totalPoints: -1 })
    .limit(limit)
    .populate('user', 'name avatar');

  return topUsers;
};
