/**
 * Brick Blitz - Achievement Engine & Toast Triggers
 */

import { ACHIEVEMENTS } from '../data/Achievements.js';

export class AchievementManager {
  constructor(storageManager, uiManager) {
    this.storage = storageManager;
    this.ui = uiManager;
  }

  checkEvent(eventType, payload = {}) {
    const profile = this.storage.getCurrentProfile();
    const unlockedSet = new Set(profile.achievements || []);
    let newUnlocks = [];

    for (const ach of ACHIEVEMENTS) {
      if (unlockedSet.has(ach.id)) continue;

      let conditionMet = false;

      switch (ach.id) {
        case 'FIRST_BLOOD':
          conditionMet = (profile.stats.totalBricksDestroyed + (payload.bricksCount || 0)) >= 1;
          break;

        case 'BRICK_DEMOLISHER':
          conditionMet = (profile.stats.totalBricksDestroyed + (payload.bricksCount || 0)) >= 100;
          break;

        case 'BRICK_MASTER':
          conditionMet = (profile.stats.totalBricksDestroyed + (payload.bricksCount || 0)) >= 1000;
          break;

        case 'COMBO_STARTER':
          conditionMet = (payload.combo || 0) >= 5;
          break;

        case 'COMBO_GOD':
          conditionMet = (payload.combo || 0) >= 20;
          break;

        case 'MULTI_BALL_MANIA':
          conditionMet = (payload.activeBallsCount || 0) >= 4;
          break;

        case 'LASER_SURGEON':
          conditionMet = (profile.stats.laserHits + (payload.laserHits || 0)) >= 50;
          break;

        case 'SHIELD_SAVIOR':
          conditionMet = eventType === 'SHIELD_HIT';
          break;

        case 'LEVEL_CONQUEROR':
          conditionMet = (profile.completedLevels.length + (payload.newLevelCompleted ? 1 : 0)) >= 5;
          break;

        case 'WORLD_CHAMPION':
          conditionMet = (profile.completedLevels.length + (payload.newLevelCompleted ? 1 : 0)) >= 25;
          break;

        case 'HIGH_SCORER':
          conditionMet = (payload.runScore || 0) >= 50000 || profile.highScore >= 50000;
          break;

        case 'UNTOUCHABLE':
          conditionMet = eventType === 'LEVEL_COMPLETE_NO_DEATH';
          break;

        case 'POWERUP_COLLECTOR':
          conditionMet = (profile.stats.powerupsCollected + (payload.powerupCaught ? 1 : 0)) >= 30;
          break;

        case 'FASHION_VICTIM':
          conditionMet = profile.unlockedSkins.length >= 3;
          break;

        case 'COSMIC_ORB':
          conditionMet = profile.unlockedBallThemes.length >= 3;
          break;

        case 'CENTURION':
          conditionMet = profile.level >= 10;
          break;

        case 'DEMO_LEGEND':
          conditionMet = profile.username === 'Alex' && profile.completedLevels.length >= 5;
          break;

        default:
          break;
      }

      if (conditionMet) {
        unlockedSet.add(ach.id);
        newUnlocks.push(ach);
      }
    }

    if (newUnlocks.length > 0) {
      profile.achievements = Array.from(unlockedSet);

      // Award XP for each achievement
      let totalXpEarned = 0;
      for (const item of newUnlocks) {
        totalXpEarned += item.xp;
        if (this.ui && this.ui.showToast) {
          this.ui.showToast(`🏆 Achievement Unlocked: ${item.title} (+${item.xp} XP)`, 'achievement');
        }
      }

      this.addXP(profile, totalXpEarned);
      this.storage.saveCurrentProfile(profile);
    }
  }

  addXP(profile, xpAmount) {
    profile.xp += xpAmount;
    // Level up threshold equation: Level * 500 XP
    const requiredXp = profile.level * 500;
    if (profile.xp >= requiredXp) {
      profile.level++;
      profile.xp -= requiredXp;
      if (this.ui && this.ui.showToast) {
        this.ui.showToast(`🌟 LEVEL UP! You reached Level ${profile.level}!`, 'levelup');
      }
    }
  }
}
