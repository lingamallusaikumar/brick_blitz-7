/**
 * Brick Blitz - Laser Projectile Entity
 */

import { checkAABBCollision } from '../utils/MathUtils.js';

export class Laser {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 18;
    this.speed = 14;
    this.active = true;
  }

  update() {
    if (!this.active) return;
    this.y -= this.speed;

    if (this.y + this.height < 0) {
      this.active = false;
    }
  }

  checkBrickCollision(brick) {
    if (!this.active || !brick.active) return false;

    if (checkAABBCollision(this, brick.getBounds())) {
      this.active = false;
      return true;
    }
    return false;
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff0055';

    let grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#ff0055');
    grad.addColorStop(1, '#990022');

    ctx.fillStyle = grad;
    ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    ctx.restore();
  }
}
