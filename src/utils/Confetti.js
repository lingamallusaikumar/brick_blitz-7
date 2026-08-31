/**
 * Brick Blitz - Victory Confetti Animation Engine
 */

export class ConfettiSystem {
  constructor() {
    this.particles = [];
    this.active = false;
    this.colors = ['#00ffff', '#ff007f', '#ffe600', '#00ff66', '#a000ff', '#ffffff'];
  }

  trigger(count = 120, width = 900, height = 700) {
    this.particles = [];
    this.active = true;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 3,
        size: Math.random() * 8 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }
  }

  update() {
    if (!this.active) return;

    let aliveCount = 0;
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.vy += 0.05; // gravity

      if (p.y > 600) {
        p.opacity -= 0.02;
      }

      if (p.opacity > 0) aliveCount++;
    }

    if (aliveCount === 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    for (const p of this.particles) {
      if (p.opacity <= 0) continue;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  stop() {
    this.active = false;
    this.particles = [];
  }
}
