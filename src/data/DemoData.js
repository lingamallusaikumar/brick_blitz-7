/**
 * Brick Blitz - Pre-Seeded Demo User Profile
 * Username: Alex
 * Password: Demo@123
 */

export const DEMO_PROFILE = {
  username: 'Alex',
  passwordHash: 'Demo@123',
  level: 12,
  xp: 4850,
  highScore: 85400,
  maxCombo: 16,
  completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  unlockedSkins: ['neon_cyan', 'cyber_gold', 'laser_red'],
  unlockedBallThemes: ['plasma_orb', 'fireball'],
  selectedPaddleSkin: 'cyber_gold',
  selectedBallTheme: 'fireball',
  achievements: [
    'FIRST_BLOOD',
    'BRICK_DEMOLISHER',
    'COMBO_STARTER',
    'SHIELD_SAVIOR',
    'LEVEL_CONQUEROR',
    'UNTOUCHABLE',
    'FASHION_VICTIM',
    'DEMO_LEGEND'
  ],
  stats: {
    gamesPlayed: 48,
    gamesWon: 32,
    totalBricksDestroyed: 4820,
    totalScore: 420500,
    powerupsCollected: 142,
    playTimeSeconds: 14500,
    laserHits: 88,
    explosionsTriggered: 64,
    paddleHits: 3200
  },
  leaderboard: [
    { rank: 1, name: 'Alex', score: 85400, mode: 'CLASSIC', level: 14, date: '2026-08-30' },
    { rank: 2, name: 'Blaze99', score: 72100, mode: 'CLASSIC', level: 12, date: '2026-08-28' },
    { rank: 3, name: 'Alex', score: 68900, mode: 'TIME_ATTACK', level: 8, date: '2026-08-29' },
    { rank: 4, name: 'CyberPulse', score: 54300, mode: 'ENDLESS', level: 19, date: '2026-08-25' },
    { rank: 5, name: 'PixelKing', score: 41200, mode: 'CLASSIC', level: 9, date: '2026-08-22' }
  ]
};
