/**
 * Brick Blitz - Master Game Engine & Loop Coordinator
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATES, GAME_MODES, POWERUP_TYPES, POWERUP_CONFIG } from '../utils/Constants.js';
import { Paddle } from '../entities/Paddle.js';
import { Ball } from '../entities/Ball.js';
import { Brick } from '../entities/Brick.js';
import { PowerUp } from '../entities/PowerUp.js';
import { Laser } from '../entities/Laser.js';
import { PhysicsEngine } from './Physics.js';
import { Renderer } from './Renderer.js';
import { ParticleSystem } from './ParticleSystem.js';
import { InputHandler } from './InputHandler.js';
import { AudioSystem } from './AudioSystem.js';
import { ConfettiSystem } from '../utils/Confetti.js';
import { LEVELS } from '../data/Levels.js';
import { randomInt } from '../utils/MathUtils.js';

export class Game {
  constructor(canvas, managers) {
    this.canvas = canvas;
    this.storage = managers.storage;
    this.achievements = managers.achievements;
    this.auth = managers.auth;
    this.stats = managers.stats;

    this.renderer = new Renderer(canvas);
    this.physics = new PhysicsEngine();
    this.particles = new ParticleSystem();
    this.audio = new AudioSystem();
    this.confetti = new ConfettiSystem();

    this.input = new InputHandler(canvas, this);

    this.state = GAME_STATES.MENU;
    this.mode = GAME_MODES.CLASSIC;

    this.currentLevelIndex = 0;
    this.currentLevel = null;

    this.paddle = new Paddle();
    this.balls = [];
    this.bricks = [];
    this.activePowerUps = [];
    this.lasers = [];

    this.score = 0;
    this.lives = 3;
    this.combo = 1;
    this.comboTimer = 0;
    this.levelTime = 0;
    this.timeAttackTimer = 60; // 60 seconds initial for Time Attack

    // Power-up status timers
    this.shieldActive = false;
    this.shieldTimer = 0;
    this.slowMoActive = false;
    this.slowMoTimer = 0;

    // Endless mode row spawn timer
    this.endlessSpawnTimer = 0;

    this.lastTime = 0;
    this.animFrameId = null;

    this.uiCallbacks = {};

    this.loadProfileCosmetics();
  }

  registerUICallbacks(callbacks) {
    this.uiCallbacks = callbacks;
  }

  loadProfileCosmetics() {
    const profile = this.storage.getCurrentProfile();
    if (profile) {
      this.paddle.setSkin(profile.selectedPaddleSkin || 'neon_cyan');
      const settings = this.storage.getSettings();
      this.audio.setVolumes(settings.sfxVolume, settings.musicVolume, settings.soundEnabled, settings.musicEnabled);
    }
  }

  startNewGame(mode = GAME_MODES.CLASSIC, startLevelId = 1) {
    this.mode = mode;
    this.currentLevelIndex = Math.max(0, startLevelId - 1);
    this.score = 0;
    this.lives = mode === GAME_MODES.TIME_ATTACK ? 1 : 3;
    this.timeAttackTimer = 60;

    this.stats.resetSession();
    this.loadLevel(this.currentLevelIndex);
    this.state = GAME_STATES.PLAYING;

    this.audio.startMusic();
    if (this.uiCallbacks.onStateChanged) {
      this.uiCallbacks.onStateChanged(this.state);
    }

    this.startLoop();
  }

  loadLevel(index) {
    this.currentLevelIndex = index % LEVELS.length;
    this.currentLevel = LEVELS[this.currentLevelIndex];

    this.paddle.reset();
    this.loadProfileCosmetics();

    // Create Main Ball
    const mainBall = new Ball(0, 0, this.storage.getCurrentProfile().selectedBallTheme || 'plasma_orb');
    mainBall.reset(this.paddle.x, this.paddle.width, this.paddle.y);
    this.balls = [mainBall];

    // Build Brick Grid
    this.bricks = [];
    const cellWidth = 82;
    const cellHeight = 24;
    const paddingX = 4;
    const paddingY = 4;
    const startX = (CANVAS_WIDTH - (this.currentLevel.cols * (cellWidth + paddingX))) / 2;
    const startY = 70;

    for (let r = 0; r < this.currentLevel.rows; r++) {
      for (let c = 0; c < this.currentLevel.cols; c++) {
        const type = this.currentLevel.grid[r][c];
        if (type !== 0) {
          const bx = startX + c * (cellWidth + paddingX);
          const by = startY + r * (cellHeight + paddingY);
          this.bricks.push(new Brick(bx, by, cellWidth, cellHeight, type));
        }
      }
    }

    this.activePowerUps = [];
    this.lasers = [];
    this.particles.reset();
    this.confetti.stop();
    this.combo = 1;
    this.comboTimer = 0;
    this.levelTime = 0;
    this.shieldActive = false;
    this.slowMoActive = false;
  }

  onActionTriggered() {
    if (this.state !== GAME_STATES.PLAYING) return;

    // 1. Launch stuck balls
    for (const ball of this.balls) {
      if (ball.isStuck) {
        ball.launch(-Math.PI / 4);
      }
    }

    // 2. Fire Laser if Laser Paddle Active
    if (this.paddle.hasLaser) {
      this.lasers.push(new Laser(this.paddle.x + 8, this.paddle.y));
      this.lasers.push(new Laser(this.paddle.x + this.paddle.width - 8, this.paddle.y));
      this.audio.playLaserShoot();
    }
  }

  addScore(points, x, y) {
    const multiplied = points * this.combo;
    this.score += multiplied;

    this.particles.addFloatingText(`+${multiplied}`, x, y, this.combo > 1 ? '#ff007f' : '#00ffff');

    // Combo streak logic
    this.combo++;
    this.comboTimer = 3000; // 3 seconds window
    this.stats.registerCombo(this.combo);
    this.achievements.checkEvent('COMBO', { combo: this.combo });
  }

  trySpawnPowerUp(x, y) {
    if (Math.random() < 0.22) { // 22% drop rate
      const types = Object.values(POWERUP_TYPES);
      const chosenType = types[randomInt(0, types.length - 1)];
      this.activePowerUps.push(new PowerUp(x, y, chosenType));
    }
  }

  applyPowerUp(type) {
    this.audio.playPowerUpCollect();
    this.stats.registerPowerupCaught();
    this.achievements.checkEvent('POWERUP', { powerupCaught: true });

    switch (type) {
      case POWERUP_TYPES.MULTI_BALL:
        const newBalls = [];
        for (const ball of this.balls) {
          if (ball.active && !ball.isStuck) {
            // Clone 2 extra balls with divergent vectors
            const b1 = new Ball(ball.x, ball.y, ball.themeKey);
            b1.launch(-Math.PI / 3);
            const b2 = new Ball(ball.x, ball.y, ball.themeKey);
            b2.launch(-Math.PI / 6);
            newBalls.push(b1, b2);
          }
        }
        this.balls.push(...newBalls);
        this.achievements.checkEvent('MULTI_BALL', { activeBallsCount: this.balls.length });
        break;

      case POWERUP_TYPES.LASER:
        this.paddle.enableLaser(12000);
        break;

      case POWERUP_TYPES.EXPAND:
        this.paddle.expand(15000);
        break;

      case POWERUP_TYPES.SLOW_MO:
        this.slowMoActive = true;
        this.slowMoTimer = 10000;
        for (const ball of this.balls) ball.setSpeed(4);
        break;

      case POWERUP_TYPES.SHIELD:
        this.shieldActive = true;
        this.shieldTimer = 20000;
        break;

      case POWERUP_TYPES.EXTRA_LIFE:
        this.lives++;
        this.particles.addFloatingText('+1 LIFE!', this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#ff3366');
        break;
    }
  }

  togglePause() {
    if (this.state === GAME_STATES.PLAYING) {
      this.state = GAME_STATES.PAUSED;
      this.audio.stopMusic();
    } else if (this.state === GAME_STATES.PAUSED) {
      this.state = GAME_STATES.PLAYING;
      this.audio.startMusic();
    }

    if (this.uiCallbacks.onStateChanged) {
      this.uiCallbacks.onStateChanged(this.state);
    }
  }

  update(dtMs) {
    if (this.state !== GAME_STATES.PLAYING) return;

    this.levelTime += dtMs / 1000;
    this.input.update();

    // 1. Combo Timer Decay
    if (this.comboTimer > 0) {
      this.comboTimer -= dtMs;
      if (this.comboTimer <= 0) {
        this.combo = 1;
      }
    }

    // 2. Time Attack Countdown
    if (this.mode === GAME_MODES.TIME_ATTACK) {
      this.timeAttackTimer -= dtMs / 1000;
      if (this.timeAttackTimer <= 0) {
        this.handleGameOver();
        return;
      }
    }

    // 3. Power-Up Timers Decay
    if (this.shieldActive) {
      this.shieldTimer -= dtMs;
      if (this.shieldTimer <= 0) this.shieldActive = false;
    }

    if (this.slowMoActive) {
      this.slowMoTimer -= dtMs;
      if (this.slowMoTimer <= 0) {
        this.slowMoActive = false;
        for (const ball of this.balls) ball.setSpeed(7);
      }
    }

    // 4. Update Paddle
    this.paddle.update(dtMs);

    // 5. Update Lasers & Brick Hits
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      laser.update();

      for (const brick of this.bricks) {
        if (laser.checkBrickCollision(brick)) {
          this.physics.damageBrick(brick, this.bricks, this);
          this.stats.registerLaserHit();
          this.achievements.checkEvent('LASER_HIT', { laserHits: 1 });
          break;
        }
      }
      if (!laser.active) this.lasers.splice(i, 1);
    }

    // 6. Update Bricks (Moving bricks)
    for (const brick of this.bricks) {
      brick.update(dtMs);
    }

    // 7. Physics Collision Updates
    this.physics.update(this, dtMs);

    // 8. Update Falling Power-Ups
    for (let i = this.activePowerUps.length - 1; i >= 0; i--) {
      const pu = this.activePowerUps[i];
      pu.update(dtMs);

      if (pu.checkPaddleCollision(this.paddle)) {
        this.applyPowerUp(pu.type);
      }
      if (!pu.active) {
        this.activePowerUps.splice(i, 1);
      }
    }

    // 9. Update Particles & Confetti
    this.particles.update();
    this.confetti.update();

    // 10. Check All Balls Out / Life Lost
    const activeBalls = this.balls.filter(b => b.active);
    if (activeBalls.length === 0) {
      this.lives--;
      this.audio.playTone(180, 'sawtooth', 0.3, 0.5);

      if (this.lives <= 0) {
        this.handleGameOver();
      } else {
        // Respawn Ball
        const newBall = new Ball(0, 0, this.storage.getCurrentProfile().selectedBallTheme || 'plasma_orb');
        newBall.reset(this.paddle.x, this.paddle.width, this.paddle.y);
        this.balls = [newBall];
      }
    }

    // 11. Check Level Victory Condition
    const breakableBricks = this.bricks.filter(b => b.active && b.type !== 3); // non-steel
    if (breakableBricks.length === 0) {
      this.handleLevelComplete();
    }
  }

  handleLevelComplete() {
    this.state = GAME_STATES.LEVEL_COMPLETE;
    this.audio.playVictory();
    this.confetti.trigger(150, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.stats.commitSession(true, this.score, this.currentLevel.levelId, this.mode);
    this.achievements.checkEvent('LEVEL_COMPLETE', { newLevelCompleted: true, runScore: this.score });

    if (this.uiCallbacks.onStateChanged) {
      this.uiCallbacks.onStateChanged(this.state);
    }
  }

  handleGameOver() {
    this.state = GAME_STATES.GAME_OVER;
    this.audio.playGameOver();
    this.audio.stopMusic();

    this.stats.commitSession(false, this.score, this.currentLevel.levelId, this.mode);

    if (this.uiCallbacks.onStateChanged) {
      this.uiCallbacks.onStateChanged(this.state);
    }
  }

  startLoop() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.lastTime = performance.now();

    const loop = (timestamp) => {
      const dt = timestamp - this.lastTime;
      this.lastTime = timestamp;

      this.update(dt);
      this.renderer.render(this, timestamp);

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.audio.stopMusic();
  }
}
