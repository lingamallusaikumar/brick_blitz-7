/**
 * Brick Blitz - Core Game Constants
 */

export const CANVAS_WIDTH = 900;
export const CANVAS_HEIGHT = 700;

export const PADDLE_DEFAULTS = {
  WIDTH: 120,
  HEIGHT: 18,
  SPEED: 10,
  Y_OFFSET: 40, // Distance from bottom
  MIN_WIDTH: 60,
  MAX_WIDTH: 220
};

export const BALL_DEFAULTS = {
  RADIUS: 9,
  BASE_SPEED: 7,
  MAX_SPEED: 14,
  MIN_SPEED: 4
};

export const GAME_MODES = {
  CLASSIC: 'CLASSIC',
  TIME_ATTACK: 'TIME_ATTACK',
  ENDLESS: 'ENDLESS',
  CHALLENGE: 'CHALLENGE'
};

export const BRICK_TYPES = {
  EMPTY: 0,
  NORMAL: 1,
  STRONG: 2,
  STEEL: 3,
  EXPLOSIVE: 4,
  MOVING: 5
};

export const BRICK_CONFIG = {
  [BRICK_TYPES.NORMAL]: { hp: 1, score: 100, color: '#00f0ff', stroke: '#00a0cc', label: 'Normal' },
  [BRICK_TYPES.STRONG]: { hp: 2, score: 250, color: '#ff007f', stroke: '#cc0066', label: 'Strong' },
  [BRICK_TYPES.STEEL]: { hp: Infinity, score: 0, color: '#8a99ad', stroke: '#5c6b7e', label: 'Steel' },
  [BRICK_TYPES.EXPLOSIVE]: { hp: 1, score: 300, color: '#ff9900', stroke: '#cc7700', label: 'Explosive', radius: 110 },
  [BRICK_TYPES.MOVING]: { hp: 1, score: 200, color: '#a000ff', stroke: '#7000cc', label: 'Moving' }
};

export const POWERUP_TYPES = {
  MULTI_BALL: 'MULTI_BALL',
  LASER: 'LASER',
  EXPAND: 'EXPAND',
  SLOW_MO: 'SLOW_MO',
  SHIELD: 'SHIELD',
  EXTRA_LIFE: 'EXTRA_LIFE'
};

export const POWERUP_CONFIG = {
  [POWERUP_TYPES.MULTI_BALL]: { label: 'Multi-Ball', color: '#00ffff', icon: '⚽', duration: 0 },
  [POWERUP_TYPES.LASER]: { label: 'Laser Paddle', color: '#ff0055', icon: '⚡', duration: 12000 },
  [POWERUP_TYPES.EXPAND]: { label: 'Paddle Stretch', color: '#00ff66', icon: '↔️', duration: 15000 },
  [POWERUP_TYPES.SLOW_MO]: { label: 'Slow Motion', color: '#ffaa00', icon: '⏱️', duration: 10000 },
  [POWERUP_TYPES.SHIELD]: { label: 'Bottom Barrier', color: '#aa00ff', icon: '🛡️', duration: 20000 },
  [POWERUP_TYPES.EXTRA_LIFE]: { label: 'Extra Life', color: '#ff3366', icon: '❤️', duration: 0 }
};

export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY'
};

export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  crtOverlay: true,
  particleDensity: 'HIGH', // 'LOW', 'MEDIUM', 'HIGH'
  controlMode: 'KBD_MOUSE', // 'KBD_MOUSE', 'TOUCH', 'BUTTONS'
  selectedPaddleSkin: 'neon_cyan',
  selectedBallTheme: 'plasma_orb'
};
