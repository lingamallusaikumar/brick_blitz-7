import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from '../src/managers/StorageManager.js';
import { AchievementManager } from '../src/managers/AchievementManager.js';

describe('Achievement Engine', () => {
  let storage;
  let achievementManager;

  beforeEach(() => {
    localStorage.clear();
    storage = new StorageManager();
    achievementManager = new AchievementManager(storage, { showToast: () => {} });
  });

  it('triggers First Blood achievement when brick destroyed', () => {
    const profile = storage.getCurrentProfile();
    profile.stats.totalBricksDestroyed = 0;
    profile.achievements = [];
    storage.saveCurrentProfile(profile);

    achievementManager.checkEvent('BRICK_DESTROYED', { bricksCount: 1 });

    const updatedProfile = storage.getCurrentProfile();
    expect(updatedProfile.achievements).toContain('FIRST_BLOOD');
  });

  it('triggers Combo God achievement when 20x combo reached', () => {
    const profile = storage.getCurrentProfile();
    profile.achievements = [];
    storage.saveCurrentProfile(profile);

    achievementManager.checkEvent('COMBO', { combo: 20 });

    const updatedProfile = storage.getCurrentProfile();
    expect(updatedProfile.achievements).toContain('COMBO_GOD');
  });
});
