/**
 * Brick Blitz - Ball Entity
 */

import { BALL_DEFAULTS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/Constants.js';
import { clamp } from '../utils/MathUtils.js';

export class Ball {
  constructor(x, y, themeKey = 'plasma_orb') {
    this.radius = BALL_DEFAULTS.RADIUS;
    this.x = x || CANVAS_WIDTH / 2;
    this.y = y || CANVAS_HEIGHT - 60;
    this.vx = 0;
    this.vy = 0;
    this.speed = BALL_DEFAULTS.BASE_SPEED;
    this.themeKey = themeKey;

    this.isStuck = true; // Attached to paddle at level launch
    this.paddleOffset = 0;
    this.active = true;

    // Trail particle history for tail effect
    this.trail = [];
    this.maxTrailLength = 12;
  }

  setTheme(themeKey) {
    this.themeKey = themeKey;
  }

  launch(angleRad = -Math.PI / 4) {
    this.isStuck = false;
    this.vx = Math.cos(angleRad) * this.speed;
    this.vy = Math.sin(angleRad) * this.speed;
  }

  reset(paddleX, paddleWidth, paddleY) {
    this.radius = BALL_DEFAULTS.RADIUS;
    this.speed = BALL_DEFAULTS.BASE_SPEED;
    this.isStuck = true;
    this.paddleOffset = paddleWidth / 2;
    this.x = paddleX + this.paddleOffset;
    this.y = paddleY - this.radius;
    this.vx = 0;
    this.vy = 0;
    this.trail = [];
    this.active = true;
  }

  setSpeed(newSpeed) {
    this.speed = clamp(newSpeed, BALL_DEFAULTS.MIN_SPEED, BALL_DEFAULTS.MAX_SPEED);
    const currentSpeed = Math.hypot(this.vx, this.vy);
    if (currentSpeed > 0) {
      this.vx = (this.vx / currentSpeed) * this.speed;
      this.vy = (this.vy / currentSpeed) * this.speed;
    }
  }

  update(dtMs, paddle) {
    if (!this.active) return;

    if (this.isStuck) {
      if (paddle) {
        this.x = paddle.x + this.paddleOffset;
        this.y = paddle.y - this.radius - 1;
      }
      return;
    }

    // Append position to particle trail
    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.pop();
    }

    // Move ball
    this.x += this.vx;
    this.y += this.vy;

    // Wall bounce logic
    if (this.x - this.radius <= 0) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    } else if (this.x + this.radius >= CANVAS_WIDTH) {
      this.x = CANVAS_WIDTH - this.radius;
      this.vx = -Math.abs(this.vx);
    }

    if (this.y - this.radius <= 0) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
    }
  }

  reflect(nx, ny) {
    // Dot product reflection: v' = v - 2*(v . n)*n
    const dot = this.vx * nx + this.vy * ny;
    this.vx = this.vx - 2 * dot * nx;
    this.vy = this.vy - 2 * dot * ny;

    // Prevent near horizontal angles from causing endless side bouncing
    if (Math.abs(this.vy) < 1.5) {
      this.vy = this.vy < 0 ? -2.5 : 2.5;
    }
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();

    // Render motion trail
    for (let i = 0; i < this.trail.length; i++) {
      const pos = this.trail[i];
      const opacity = (1 - i / this.trail.length) * 0.4;
      const size = this.radius * (1 - i / (this.trail.length * 1.5));

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, Math.max(1, size), 0, Math.PI * 2);
      ctx.fillStyle = this.getTrailColor(opacity);
      ctx.fill();
    }

    // Render Ball Core
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.getGlowColor();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    let grad = ctx.createRadialGradient(
      this.x - this.radius * 0.3,
      this.y - this.radius * 0.3,
      1,
      this.x,
      this.y,
      this.radius
    );

    this.applyThemeGradient(grad);

    ctx.fillStyle = grad;
    ctx.fill();

    // Core bright point
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  getGlowColor() {
    switch (this.themeKey) {
      case 'fireball': return '#ff6600';
      case 'chrome': return '#ffffff';
      case 'energy_core': return '#00ff66';
      case 'purple_void': return '#aa00ff';
      case 'plasma_orb':
      default: return '#00ffff';
    }
  }

  getTrailColor(opacity) {
    switch (this.themeKey) {
      case 'fireball': return `rgba(255, 100, 0, ${opacity})`;
      case 'chrome': return `rgba(220, 220, 255, ${opacity})`;
      case 'energy_core': return `rgba(0, 255, 100, ${opacity})`;
      case 'purple_void': return `rgba(170, 0, 255, ${opacity})`;
      case 'plasma_orb':
      default: return `rgba(0, 240, 255, ${opacity})`;
    }
  }

  applyThemeGradient(grad) {
    switch (this.themeKey) {
      case 'fireball':
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#ff9900');
        grad.addColorStop(1, '#cc0000');
        break;
      case 'chrome':
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#bbccdd');
        grad.addColorStop(1, '#556677');
        break;
      case 'energy_core':
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#00ff88');
        grad.addColorStop(1, '#008844');
        break;
      case 'purple_void':
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#d066ff');
        grad.addColorStop(1, '#6600cc');
        break;
      case 'plasma_orb':
      default:
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#00f0ff');
        grad.addColorStop(1, '#0066cc');
        break;
    }
  }
}
