/**
 * Brick Blitz - Brick Entity
 */

import { BRICK_TYPES, BRICK_CONFIG } from '../utils/Constants.js';

export class Brick {
  constructor(x, y, width, height, type = BRICK_TYPES.NORMAL, options = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.active = true;

    const config = BRICK_CONFIG[type] || BRICK_CONFIG[BRICK_TYPES.NORMAL];
    this.maxHp = config.hp;
    this.hp = config.hp;
    this.color = config.color;
    this.stroke = config.stroke;

    // Moving brick options
    if (type === BRICK_TYPES.MOVING) {
      this.moveSpeed = options.moveSpeed || 1.5;
      this.minX = options.minX || Math.max(10, x - 100);
      this.maxX = options.maxX || Math.min(890 - width, x + 100);
      this.direction = 1;
    }
  }

  update(dtMs) {
    if (!this.active) return;

    if (this.type === BRICK_TYPES.MOVING) {
      this.x += this.moveSpeed * this.direction;
      if (this.x <= this.minX) {
        this.x = this.minX;
        this.direction = 1;
      } else if (this.x >= this.maxX) {
        this.x = this.maxX;
        this.direction = -1;
      }
    }
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  draw(ctx, timestamp = 0) {
    if (!this.active) return;

    ctx.save();
    const cornerRadius = 4;

    // Custom visuals per brick type
    if (this.type === BRICK_TYPES.STEEL) {
      this.drawSteel(ctx);
    } else if (this.type === BRICK_TYPES.EXPLOSIVE) {
      this.drawExplosive(ctx, timestamp);
    } else {
      this.drawStandard(ctx);
    }

    // Render cracks on damaged bricks (e.g. Strong brick after 1 hit)
    if (this.hp < this.maxHp && this.maxHp > 1) {
      this.drawCracks(ctx);
    }

    ctx.restore();
  }

  drawStandard(ctx) {
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;

    let grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, this.stroke);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 4);
    ctx.fill();

    // Top bevel highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.roundRect(this.x + 2, this.y + 2, this.width - 4, this.height * 0.35, 2);
    ctx.fill();
  }

  drawSteel(ctx) {
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#5c6b7e';

    let grad = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
    grad.addColorStop(0, '#bcc9d8');
    grad.addColorStop(0.5, '#78899a');
    grad.addColorStop(1, '#3b4856');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 4);
    ctx.fill();

    // Steel rivets/bolts in corners
    ctx.fillStyle = '#223344';
    ctx.beginPath();
    ctx.arc(this.x + 5, this.y + 5, 2, 0, Math.PI * 2);
    ctx.arc(this.x + this.width - 5, this.y + 5, 2, 0, Math.PI * 2);
    ctx.arc(this.x + 5, this.y + this.height - 5, 2, 0, Math.PI * 2);
    ctx.arc(this.x + this.width - 5, this.y + this.height - 5, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawExplosive(ctx, timestamp) {
    const pulse = (Math.sin(timestamp * 0.008) + 1) * 0.5; // 0 to 1
    ctx.shadowBlur = 12 + pulse * 10;
    ctx.shadowColor = '#ff5500';

    let grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    grad.addColorStop(0, '#ff9900');
    grad.addColorStop(0.5, '#ff3300');
    grad.addColorStop(1, '#990000');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 4);
    ctx.fill();

    // Explosive Warning Icon (Hazard lines)
    ctx.fillStyle = 'rgba(255, 230, 0, 0.85)';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💣', this.x + this.width / 2, this.y + this.height / 2);
  }

  drawCracks(ctx) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width * 0.2, this.y + 2);
    ctx.lineTo(this.x + this.width * 0.4, this.y + this.height * 0.6);
    ctx.lineTo(this.x + this.width * 0.8, this.y + this.height - 2);
    ctx.stroke();
  }
}
