import { describe, it, expect } from 'vitest';
import { LEVELS, WORLD_THEMES } from '../src/data/Levels.js';
import { Brick } from '../src/entities/Brick.js';
import { BRICK_TYPES } from '../src/utils/Constants.js';

describe('Level Loader & Grid Logic', () => {
  it('contains exactly 50 distinct levels', () => {
    expect(LEVELS.length).toBe(50);
  });

  it('contains 5 world themes with valid bounds', () => {
    expect(WORLD_THEMES.length).toBe(5);
    expect(WORLD_THEMES[0].name).toBe('Cyber Grid');
    expect(WORLD_THEMES[4].name).toBe('Hyper Arcade');
  });

  it('validates every level has a non-empty grid and breakable bricks', () => {
    for (const lvl of LEVELS) {
      expect(lvl.grid.length).toBeGreaterThan(0);
      expect(lvl.cols).toBe(10);
      
      let breakableCount = 0;
      for (let r = 0; r < lvl.grid.length; r++) {
        for (let c = 0; c < lvl.grid[r].length; c++) {
          const type = lvl.grid[r][c];
          if (type !== BRICK_TYPES.EMPTY && type !== BRICK_TYPES.STEEL) {
            breakableCount++;
          }
        }
      }
      expect(breakableCount).toBeGreaterThan(0);
    }
  });

  it('instantiates Brick entities properly from grid matrix', () => {
    const brick = new Brick(100, 50, 80, 24, BRICK_TYPES.STRONG);
    expect(brick.type).toBe(BRICK_TYPES.STRONG);
    expect(brick.hp).toBe(2);
    expect(brick.maxHp).toBe(2);
    expect(brick.active).toBe(true);

    const bounds = brick.getBounds();
    expect(bounds.width).toBe(80);
    expect(bounds.height).toBe(24);
  });
});
