/**
 * Brick Blitz - Paddle Entity
 */

import { PADDLE_DEFAULTS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/Constants.js';
import { clamp } from '../utils/MathUtils.js';

export class Paddle {
  constructor(skinKey = 'neon_cyan') {
    this.width = PADDLE_DEFAULTS.WIDTH;
    this.height = PADDLE_DEFAULTS.HEIGHT;
    this.x = (CANVAS_WIDTH - this.width) / 2;
    this.y = CANVAS_HEIGHT - PADDLE_DEFAULTS.Y_OFFSET;
    this.speed = PADDLE_DEFAULTS.SPEED;
    this.skinKey = skinKey;

    // Power-up states
    this.hasLaser = false;
    this.laserTimer = 0;
    this.isExpanded = false;
    this.expandTimer = 0;

    // Smooth movement
    this.targetX = this.x;
    this.velocity = 0;
    this.lastX = this.x;
  }

  reset() {
    this.width = PADDLE_DEFAULTS.WIDTH;
    this.x = (CANVAS_WIDTH - this.width) / 2;
    this.y = CANVAS_HEIGHT - PADDLE_DEFAULTS.Y_OFFSET;
    this.targetX = this.x;
    this.hasLaser = false;
    this.laserTimer = 0;
    this.isExpanded = false;
    this.expandTimer = 0;
    this.velocity = 0;
  }

  setSkin(skinKey) {
    this.skinKey = skinKey;
  }

  expand(durationMs = 15000) {
    this.isExpanded = true;
    this.expandTimer = durationMs;
    this.width = Math.min(PADDLE_DEFAULTS.MAX_WIDTH, PADDLE_DEFAULTS.WIDTH * 1.5);
  }

  enableLaser(durationMs = 12000) {
    this.hasLaser = true;
    this.laserTimer = durationMs;
  }

  update(dtMs) {
    // Handle timer decays
    if (this.isExpanded) {
      this.expandTimer -= dtMs;
      if (this.expandTimer <= 0) {
        this.isExpanded = false;
        this.width = PADDLE_DEFAULTS.WIDTH;
      }
    }

    if (this.hasLaser) {
      this.laserTimer -= dtMs;
      if (this.laserTimer <= 0) {
        this.hasLaser = false;
      }
    }

    // Smooth lerping to target position
    this.lastX = this.x;
    this.x += (this.targetX - this.x) * 0.35;
    this.x = clamp(this.x, 0, CANVAS_WIDTH - this.width);
    this.velocity = this.x - this.lastX;
  }

  moveLeft() {
    this.targetX = Math.max(0, this.targetX - this.speed * 2);
  }

  moveRight() {
    this.targetX = Math.min(CANVAS_WIDTH - this.width, this.targetX + this.speed * 2);
  }

  moveTo(targetCenterX) {
    this.targetX = clamp(targetCenterX - this.width / 2, 0, CANVAS_WIDTH - this.width);
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  draw(ctx) {
    ctx.save();

    // Render glow depending on active skin & powerups
    ctx.shadowBlur = this.hasLaser ? 20 : 12;
    ctx.shadowColor = this.hasLaser ? '#ff0055' : '#00ffff';

    const radius = this.height / 2;

    // Skin visual themes
    let grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);

    switch (this.skinKey) {
      case 'cyber_gold':
        grad.addColorStop(0, '#ffeeaa');
        grad.addColorStop(0.5, '#ffaa00');
        grad.addColorStop(1, '#995500');
        break;

      case 'laser_red':
        grad.addColorStop(0, '#ff99aa');
        grad.addColorStop(0.5, '#ff0055');
        grad.addColorStop(1, '#880022');
        break;

      case 'retro_synth':
        grad.addColorStop(0, '#ff88ff');
        grad.addColorStop(0.5, '#ff00aa');
        grad.addColorStop(1, '#4400aa');
        break;

      case 'emerald_shield':
        grad.addColorStop(0, '#aaffcc');
        grad.addColorStop(0.5, '#00ff66');
        grad.addColorStop(1, '#006622');
        break;

      case 'neon_cyan':
      default:
        grad.addColorStop(0, '#aaffff');
        grad.addColorStop(0.5, '#00e5ff');
        grad.addColorStop(1, '#0066aa');
        break;
    }

    ctx.fillStyle = grad;

    // Rounded rectangle path for smooth modern paddle
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, radius);
    ctx.fill();

    // Metallic / Glass highlight stripe
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.roundRect(this.x + 4, this.y + 2, this.width - 8, this.height / 3, radius / 2);
    ctx.fill();

    // Render Laser Cannons if Laser Powerup Active
    if (this.hasLaser) {
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 10;

      // Left cannon node
      ctx.fillRect(this.x - 2, this.y - 6, 6, 12);
      // Right cannon node
      ctx.fillRect(this.x + this.width - 4, this.y - 6, 6, 12);
    }

    ctx.restore();
  }
}
