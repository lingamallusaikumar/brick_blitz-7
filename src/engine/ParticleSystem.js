/**
 * Brick Blitz - High Performance Particle & Floating Text System
 */

import { randomRange } from '../utils/MathUtils.js';

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
    this.rings = [];
  }

  reset() {
    this.particles = [];
    this.floatingTexts = [];
    this.rings = [];
  }

  createBrickExplosion(brick) {
    const count = 12;
    const cx = brick.x + brick.width / 2;
    const cy = brick.y + brick.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomRange(2, 6);

      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: randomRange(3, 7),
        color: brick.color,
        opacity: 1,
        life: 1.0,
        decay: randomRange(0.02, 0.04)
      });
    }
  }

  createSparks(x, y, color = '#00ffff', count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomRange(1.5, 4.5);

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: randomRange(2, 4),
        color,
        opacity: 1,
        life: 1.0,
        decay: randomRange(0.03, 0.06)
      });
    }
  }

  createExplosionRing(x, y, maxRadius = 100, color = '#ff9900') {
    this.rings.push({
      x,
      y,
      radius: 5,
      maxRadius,
      color,
      opacity: 1,
      speed: 4
    });
  }

  addFloatingText(text, x, y, color = '#ffffff', fontSize = 16) {
    this.floatingTexts.push({
      text,
      x,
      y,
      color,
      fontSize,
      opacity: 1,
      vy: -1.2,
      life: 1.0
    });
  }

  update() {
    // Update Debris & Sparks
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // Slight gravity
      p.life -= p.decay;
      p.opacity = Math.max(0, p.life);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Shockwave Rings
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.radius += r.speed;
      r.opacity = 1 - r.radius / r.maxRadius;

      if (r.radius >= r.maxRadius) {
        this.rings.splice(i, 1);
      }
    }

    // Update Floating Text (+100)
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life -= 0.02;
      ft.opacity = Math.max(0, ft.life);

      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();

    // Draw Shockwave Rings
    for (const r of this.rings) {
      if (r.opacity <= 0) continue;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = r.opacity;
      ctx.stroke();
    }

    // Draw Debris Particles
    for (const p of this.particles) {
      if (p.opacity <= 0) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }

    // Draw Floating Text
    for (const ft of this.floatingTexts) {
      if (ft.opacity <= 0) continue;
      ctx.font = `bold ${ft.fontSize}px 'Outfit', sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.opacity;
      ctx.textAlign = 'center';
      ctx.shadowBlur = 6;
      ctx.shadowColor = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
    }

    ctx.restore();
  }
}
