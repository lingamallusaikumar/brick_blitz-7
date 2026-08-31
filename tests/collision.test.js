import { describe, it, expect, beforeEach } from 'vitest';
import { Ball } from '../src/entities/Ball.js';
import { Paddle } from '../src/entities/Paddle.js';
import { PhysicsEngine } from '../src/engine/Physics.js';

describe('Physics & Collision Engine', () => {
  let physics;
  let ball;
  let paddle;

  beforeEach(() => {
    physics = new PhysicsEngine();
    ball = new Ball(450, 600);
    paddle = new Paddle();
  });

  it('correctly initializes ball speed and position', () => {
    expect(ball.radius).toBe(9);
    expect(ball.isStuck).toBe(true);
  });

  it('launches ball at expected angle vector', () => {
    ball.launch(-Math.PI / 4);
    expect(ball.isStuck).toBe(false);
    expect(ball.vx).toBeGreaterThan(0);
    expect(ball.vy).toBeLessThan(0);
  });

  it('reflects ball on normal vectors', () => {
    ball.vx = 5;
    ball.vy = 5;
    // Reflect off top wall normal (nx=0, ny=1)
    ball.reflect(0, 1);
    expect(ball.vy).toBeLessThan(0);
  });

  it('bounces ball off paddle correctly', () => {
    const mockGame = {
      balls: [ball],
      paddle: paddle,
      bricks: [],
      activePowerUps: [],
      shieldActive: false,
      audio: { playPaddleHit: () => {} },
      particles: { createSparks: () => {} },
      stats: { registerPaddleHit: () => {} }
    };

    ball.launch(Math.PI / 2); // Moving straight down
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius; // Colliding with paddle

    physics.checkBallPaddleCollision(ball, paddle, mockGame);

    // Ball should now be traveling upwards (vy < 0)
    expect(ball.vy).toBeLessThan(0);
  });
});
