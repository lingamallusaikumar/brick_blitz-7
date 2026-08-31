import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from '../src/managers/StorageManager.js';
import { AuthManager } from '../src/managers/AuthManager.js';
import { DEMO_PROFILE } from '../src/data/DemoData.js';

describe('StorageManager & AuthManager', () => {
  let storage;
  let auth;

  beforeEach(() => {
    localStorage.clear();
    storage = new StorageManager();
    auth = new AuthManager(storage);
  });

  it('loads pre-seeded demo user profile Alex', () => {
    const profile = storage.getCurrentProfile();
    expect(profile.username).toBe('Alex');
    expect(profile.level).toBe(12);
    expect(profile.completedLevels.length).toBe(14);
    expect(profile.highScore).toBe(85400);
  });

  it('authenticates demo user Alex with Demo@123', () => {
    const resSuccess = auth.login('Alex', 'Demo@123');
    expect(resSuccess.success).toBe(true);
    expect(resSuccess.profile.username).toBe('Alex');

    const resWrongPass = auth.login('Alex', 'WrongPass');
    expect(resWrongPass.success).toBe(false);
  });

  it('creates new player profiles correctly', () => {
    const res = auth.register('NewPlayer', 'Pass123');
    expect(res.success).toBe(true);
    expect(res.profile.username).toBe('NewPlayer');
    expect(res.profile.level).toBe(1);

    const current = storage.getCurrentProfile();
    expect(current.username).toBe('NewPlayer');
  });

  it('adds leaderboard entries and maintains sorting', () => {
    storage.addLeaderboardEntry({ name: 'ProGamer', score: 99999, mode: 'CLASSIC', level: 20 });
    const leaderboards = storage.getLeaderboards();
    expect(leaderboards.length).toBeGreaterThan(0);
    expect(leaderboards[0].score).toBe(99999);
    expect(leaderboards[0].name).toBe('ProGamer');
  });
});
