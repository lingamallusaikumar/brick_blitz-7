/**
 * Brick Blitz - Core Physics & Collision Engine
 */

import { checkCircleAABBCollision, distance } from '../utils/MathUtils.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, BRICK_TYPES, BRICK_CONFIG } from '../utils/Constants.js';

export class PhysicsEngine {
  constructor() {
    this.subSteps = 3; // Sub-stepping iterations for high speed physics stability
  }

  update(game, dtMs) {
    const { balls, paddle, bricks, activePowerUps } = game;

    // Process each ball with sub-stepping
    for (const ball of balls) {
      if (!ball.active || ball.isStuck) continue;

      for (let s = 0; s < this.subSteps; s++) {
        ball.update(dtMs / this.subSteps, paddle);

        // 1. Paddle Collision
        this.checkBallPaddleCollision(ball, paddle, game);

        // 2. Shield Barrier (Bottom Wall)
        if (game.shieldActive && ball.y + ball.radius >= CANVAS_HEIGHT - 35) {
          ball.y = CANVAS_HEIGHT - 35 - ball.radius;
          ball.vy = -Math.abs(ball.vy);
          game.audio.playShieldHit();
        }

        // 3. Brick Grid Collision
        this.checkBallBricksCollision(ball, bricks, game);

        // 4. Check Bottom Out / Death
        if (ball.y - ball.radius > CANVAS_HEIGHT) {
          ball.active = false;
          break;
        }
      }
    }
  }

  checkBallPaddleCollision(ball, paddle, game) {
    const paddleBounds = paddle.getBounds();
    const collision = checkCircleAABBCollision(ball, paddleBounds);

    if (collision && ball.vy > 0) {
      // Reposition ball out of paddle overlap
      ball.y = paddle.y - ball.radius - 1;

      // Calculate relative hit position on paddle (-1 to 1)
      const paddleCenter = paddle.x + paddle.width / 2;
      const hitPos = (ball.x - paddleCenter) / (paddle.width / 2);

      // Map hit position to bounce angle (-60 deg to +60 deg)
      const maxBounceAngle = (5 * Math.PI) / 12; // 75 degrees
      const bounceAngle = hitPos * maxBounceAngle;

      // Maintain ball speed + apply paddle velocity boost
      const paddleBoost = Math.abs(paddle.velocity) * 0.15;
      const newSpeed = ball.speed + paddleBoost;

      ball.vx = newSpeed * Math.sin(bounceAngle);
      ball.vy = -newSpeed * Math.cos(bounceAngle);

      game.audio.playPaddleHit();
      game.particles.createSparks(ball.x, ball.y, '#00ffff', 8);

      // Reset combo when hitting paddle if desired or count paddle hits
      game.stats.registerPaddleHit();
    }
  }

  checkBallBricksCollision(ball, bricks, game) {
    for (const brick of bricks) {
      if (!brick.active) continue;

      const brickBounds = brick.getBounds();
      const collision = checkCircleAABBCollision(ball, brickBounds);

      if (collision) {
        // Bounce ball along impact normal vector
        ball.reflect(collision.normalX, collision.normalY);

        // Resolve overlap to avoid sticking
        ball.x += collision.normalX * (collision.overlap + 0.5);
        ball.y += collision.normalY * (collision.overlap + 0.5);

        // Process Brick Damage
        this.damageBrick(brick, bricks, game, ball);
        break; // Process one brick hit per sub-step for accurate reflection
      }
    }
  }

  damageBrick(brick, allBricks, game, sourceBall = null) {
    if (!brick.active) return;

    if (brick.type === BRICK_TYPES.STEEL) {
      game.audio.playSteelHit();
      game.particles.createSparks(brick.x + brick.width / 2, brick.y + brick.height / 2, '#8a99ad', 6);
      return;
    }

    brick.hp--;

    if (brick.hp <= 0) {
      brick.active = false;

      // Score and Combo Update
      const config = BRICK_CONFIG[brick.type];
      const points = config ? config.score : 100;
      game.addScore(points, brick.x + brick.width / 2, brick.y + brick.height / 2);

      game.audio.playBrickBreak(brick.type);
      game.particles.createBrickExplosion(brick);

      // Handle Explosive Brick AOE Blast
      if (brick.type === BRICK_TYPES.EXPLOSIVE) {
        this.triggerExplosion(brick, allBricks, game);
      }

      // Roll for Power-up Drop
      game.trySpawnPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2);
    } else {
      // Brick hit, still alive (e.g. Strong Brick 2-hit)
      game.audio.playStrongHit();
      game.particles.createSparks(brick.x + brick.width / 2, brick.y + brick.height / 2, '#ff007f', 10);
    }
  }

  triggerExplosion(centerBrick, allBricks, game) {
    game.audio.playExplosion();
    const blastRadius = BRICK_CONFIG[BRICK_TYPES.EXPLOSIVE].radius;
    const cx = centerBrick.x + centerBrick.width / 2;
    const cy = centerBrick.y + centerBrick.height / 2;

    game.particles.createExplosionRing(cx, cy, blastRadius, '#ff9900');

    for (const brick of allBricks) {
      if (!brick.active || brick === centerBrick) continue;
      const bx = brick.x + brick.width / 2;
      const by = brick.y + brick.height / 2;

      if (distance(cx, cy, bx, by) <= blastRadius) {
        this.damageBrick(brick, allBricks, game);
      }
    }
  }
}
