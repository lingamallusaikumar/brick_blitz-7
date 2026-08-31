import { describe, it, expect, beforeEach } from 'vitest';
import { PowerUp } from '../src/entities/PowerUp.js';
import { Paddle } from '../src/entities/Paddle.js';
import { POWERUP_TYPES } from '../src/utils/Constants.js';

describe('PowerUp Entities & Interactions', () => {
  let powerUp;
  let paddle;

  beforeEach(() => {
    powerUp = new PowerUp(450, 600, POWERUP_TYPES.EXPAND);
    paddle = new Paddle();
  });

  it('initializes with active state and correct configuration', () => {
    expect(powerUp.type).toBe(POWERUP_TYPES.EXPAND);
    expect(powerUp.active).toBe(true);
    expect(powerUp.label).toBe('Paddle Stretch');
  });

  it('moves downward when updated', () => {
    const initialY = powerUp.y;
    powerUp.update(16);
    expect(powerUp.y).toBeGreaterThan(initialY);
  });

  it('detects paddle collection collision', () => {
    powerUp.x = paddle.x + paddle.width / 2;
    powerUp.y = paddle.y + paddle.height / 2;

    const collected = powerUp.checkPaddleCollision(paddle);
    expect(collected).toBe(true);
    expect(powerUp.active).toBe(false);
  });

  it('triggers expand powerup on paddle', () => {
    const initialWidth = paddle.width;
    paddle.expand(1000);
    expect(paddle.isExpanded).toBe(true);
    expect(paddle.width).toBeGreaterThan(initialWidth);
  });
});
