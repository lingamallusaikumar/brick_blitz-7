import { describe, it, expect } from 'vitest';
import { clamp, lerp, distance, checkCircleAABBCollision, checkAABBCollision } from '../src/utils/MathUtils.js';

describe('MathUtils', () => {
  it('correctly clamps values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('calculates linear interpolation correctly', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0.25)).toBe(12.5);
  });

  it('calculates Euclidean distance correctly', () => {
    expect(distance(0, 0, 3, 4)).toBe(5);
  });

  it('detects Circle to AABB collisions accurately', () => {
    const rect = { x: 100, y: 100, width: 60, height: 20 };
    
    // Circle intersecting top edge
    const circle1 = { x: 130, y: 95, radius: 10 };
    const res1 = checkCircleAABBCollision(circle1, rect);
    expect(res1).not.toBeNull();
    expect(res1.collided).toBe(true);

    // Circle far away
    const circle2 = { x: 130, y: 50, radius: 10 };
    const res2 = checkCircleAABBCollision(circle2, rect);
    expect(res2).toBeNull();
  });

  it('detects AABB to AABB collisions accurately', () => {
    const boxA = { x: 0, y: 0, width: 50, height: 50 };
    const boxB = { x: 25, y: 25, width: 50, height: 50 };
    const boxC = { x: 100, y: 100, width: 50, height: 50 };

    expect(checkAABBCollision(boxA, boxB)).toBe(true);
    expect(checkAABBCollision(boxA, boxC)).toBe(false);
  });
});
