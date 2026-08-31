/**
 * Brick Blitz - LocalStorage Persistence Engine
 */

import { DEFAULT_SETTINGS } from '../utils/Constants.js';
import { DEMO_PROFILE } from '../data/DemoData.js';

const STORAGE_KEY = 'brick_blitz_save_v1';

export class StorageManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('LocalStorage load failed, initializing default state.');
    }
    return this.createInitialData();
  }

  createInitialData() {
    const initial = {
      settings: { ...DEFAULT_SETTINGS },
      currentUser: 'Alex',
      profiles: {
        'Alex': { ...DEMO_PROFILE }
      },
      leaderboards: [...DEMO_PROFILE.leaderboard]
    };
    this.saveData(initial);
    return initial;
  }

  saveData(dataToSave = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }

  getSettings() {
    return this.data.settings || { ...DEFAULT_SETTINGS };
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
  }

  getCurrentProfile() {
    const username = this.data.currentUser || 'Alex';
    if (!this.data.profiles[username]) {
      this.data.profiles[username] = this.createEmptyProfile(username);
    }
    return this.data.profiles[username];
  }

  saveCurrentProfile(profileData) {
    const username = this.data.currentUser || 'Alex';
    this.data.profiles[username] = { ...this.data.profiles[username], ...profileData };
    this.saveData();
  }

  createEmptyProfile(username) {
    return {
      username,
      passwordHash: 'Demo@123',
      level: 1,
      xp: 0,
      highScore: 0,
      maxCombo: 0,
      completedLevels: [],
      unlockedSkins: ['neon_cyan'],
      unlockedBallThemes: ['plasma_orb'],
      selectedPaddleSkin: 'neon_cyan',
      selectedBallTheme: 'plasma_orb',
      achievements: [],
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        totalBricksDestroyed: 0,
        totalScore: 0,
        powerupsCollected: 0,
        playTimeSeconds: 0,
        laserHits: 0,
        explosionsTriggered: 0,
        paddleHits: 0
      }
    };
  }

  addLeaderboardEntry(entry) {
    if (!this.data.leaderboards) {
      this.data.leaderboards = [];
    }

    this.data.leaderboards.push({
      name: entry.name || 'Anonymous',
      score: entry.score || 0,
      mode: entry.mode || 'CLASSIC',
      level: entry.level || 1,
      date: new Date().toISOString().split('T')[0]
    });

    // Sort descending by score
    this.data.leaderboards.sort((a, b) => b.score - a.score);

    // Retain top 50
    if (this.data.leaderboards.length > 50) {
      this.data.leaderboards = this.data.leaderboards.slice(0, 50);
    }

    // Assign rank
    this.data.leaderboards.forEach((item, index) => {
      item.rank = index + 1;
    });

    this.saveData();
  }

  getLeaderboards(modeFilter = 'ALL') {
    const list = this.data.leaderboards || [];
    if (modeFilter === 'ALL') return list;
    return list.filter(item => item.mode === modeFilter);
  }

  exportSaveData() {
    return JSON.stringify(this.data, null, 2);
  }

  importSaveData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.profiles) {
        this.data = parsed;
        this.saveData();
        return true;
      }
    } catch (e) {}
    return false;
  }
}
