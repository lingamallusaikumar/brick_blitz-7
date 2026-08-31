/**
 * Brick Blitz - Master Canvas Renderer
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/Constants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Background starfield
    this.stars = [];
    this.initStars();
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.4 + 0.1
      });
    }
  }

  render(game, timestamp = 0) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw Themed Dynamic Background
    this.drawBackground(ctx, game.currentLevel ? game.currentLevel.theme : null);

    // 2. Draw Bottom Shield Barrier (if active)
    if (game.shieldActive) {
      this.drawShieldBarrier(ctx, timestamp);
    }

    // 3. Draw Bricks
    for (const brick of game.bricks) {
      brick.draw(ctx, timestamp);
    }

    // 4. Draw Power-Ups
    for (const pu of game.activePowerUps) {
      pu.draw(ctx);
    }

    // 5. Draw Lasers
    for (const laser of game.lasers) {
      laser.draw(ctx);
    }

    // 6. Draw Paddle
    game.paddle.draw(ctx);

    // 7. Draw Balls
    for (const ball of game.balls) {
      ball.draw(ctx);
    }

    // 8. Draw Particles & Floating Texts
    game.particles.draw(ctx);

    // 9. Draw Victory Confetti
    if (game.confetti) {
      game.confetti.draw(ctx);
    }
  }

  drawBackground(ctx, theme) {
    ctx.save();

    // Radial/Linear gradient background
    let bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    if (theme && theme.bgGrad) {
      bgGrad.addColorStop(0, theme.bgGrad[0]);
      bgGrad.addColorStop(1, theme.bgGrad[1]);
    } else {
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(1, '#03060a');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update and draw starfield
    ctx.fillStyle = '#ffffff';
    for (const star of this.stars) {
      star.y += star.speed;
      if (star.y > CANVAS_HEIGHT) star.y = 0;

      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Subtle Perspective Cyber Grid lines
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = theme ? theme.accent : '#00f0ff';
    ctx.lineWidth = 1;

    const gridSize = 40;
    for (let x = 0; x <= CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawShieldBarrier(ctx, timestamp) {
    ctx.save();
    const pulse = (Math.sin(timestamp * 0.01) + 1) * 0.5;

    ctx.shadowBlur = 15 + pulse * 10;
    ctx.shadowColor = '#aa00ff';
    ctx.strokeStyle = '#e699ff';
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - 20);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 20);
    ctx.stroke();

    ctx.restore();
  }
}
