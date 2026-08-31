/**
 * Brick Blitz - Power-Up Entity
 */

import { POWERUP_TYPES, POWERUP_CONFIG, CANVAS_HEIGHT } from '../utils/Constants.js';
import { checkAABBCollision } from '../utils/MathUtils.js';

export class PowerUp {
  constructor(x, y, type = POWERUP_TYPES.MULTI_BALL) {
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 28;
    this.type = type;
    this.speed = 2.5;
    this.active = true;

    const config = POWERUP_CONFIG[type] || POWERUP_CONFIG[POWERUP_TYPES.MULTI_BALL];
    this.color = config.color;
    this.icon = config.icon;
    this.label = config.label;
    this.rotation = 0;
  }

  update(dtMs) {
    if (!this.active) return;
    this.y += this.speed;
    this.rotation += 0.04;

    if (this.y > CANVAS_HEIGHT) {
      this.active = false;
    }
  }

  checkPaddleCollision(paddle) {
    if (!this.active) return false;

    const bounds = {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };

    if (checkAABBCollision(bounds, paddle.getBounds())) {
      this.active = false;
      return true;
    }
    return false;
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Glowing capsule pill shape
    let grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 14);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.6, this.color);
    grad.addColorStop(1, '#000000');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Icon symbol render
    ctx.rotate(-this.rotation); // Keep icon right-side up
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.icon, 0, 1);

    ctx.restore();
  }
}
