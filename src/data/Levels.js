/**
 * Brick Blitz - 50+ Level Configurations and World Themes
 */

import { BRICK_TYPES } from '../utils/Constants.js';

export const WORLD_THEMES = [
  { id: 1, name: 'Cyber Grid', startLevel: 1, endLevel: 10, bgGrad: ['#090d16', '#03060a'], accent: '#00f0ff' },
  { id: 2, name: 'Synthwave Neon', startLevel: 11, endLevel: 20, bgGrad: ['#1b002c', '#080012'], accent: '#ff007f' },
  { id: 3, name: 'Solar Flare', startLevel: 21, endLevel: 30, bgGrad: ['#280b00', '#0a0300'], accent: '#ff9900' },
  { id: 4, name: 'Quantum Void', startLevel: 31, endLevel: 40, bgGrad: ['#12002b', '#05000f'], accent: '#a000ff' },
  { id: 5, name: 'Hyper Arcade', startLevel: 41, endLevel: 50, bgGrad: ['#00201a', '#000806'], accent: '#00ff66' }
];

/**
 * Generate 50 distinct level matrices (rows x cols)
 */
function generateLevelData() {
  const levels = [];

  for (let i = 1; i <= 50; i++) {
    const rows = Math.min(10, 4 + Math.floor(i / 6));
    const cols = 10;
    const grid = [];

    // Custom layout patterns based on level index
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        let brickType = BRICK_TYPES.NORMAL;

        if (i === 1) {
          // Introductory simple layout
          brickType = BRICK_TYPES.NORMAL;
        } else if (i % 5 === 0 && r === 0) {
          // Steel roof on boss/milestone levels
          brickType = (c === 0 || c === cols - 1) ? BRICK_TYPES.STEEL : BRICK_TYPES.STRONG;
        } else if ((r + c) % 4 === 0 && i > 5) {
          brickType = BRICK_TYPES.STRONG;
        } else if (c % 3 === 0 && r % 2 === 1 && i > 12) {
          brickType = BRICK_TYPES.EXPLOSIVE;
        } else if (r === Math.floor(rows / 2) && (c === 2 || c === 7) && i > 18) {
          brickType = BRICK_TYPES.MOVING;
        } else if ((r === 1 || r === rows - 2) && (c === 4 || c === 5) && i > 25) {
          brickType = BRICK_TYPES.STEEL;
        } else if (Math.random() < 0.15 && i > 8) {
          brickType = BRICK_TYPES.STRONG;
        }

        row.push(brickType);
      }
      grid.push(row);
    }

    // Ensure at least 6 breakable bricks exist per level
    let breakable = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] !== BRICK_TYPES.EMPTY && grid[r][c] !== BRICK_TYPES.STEEL) {
          breakable++;
        }
      }
    }

    if (breakable < 6) {
      grid[0][1] = BRICK_TYPES.NORMAL;
      grid[0][3] = BRICK_TYPES.NORMAL;
      grid[0][5] = BRICK_TYPES.NORMAL;
      grid[0][7] = BRICK_TYPES.NORMAL;
    }

    const worldIndex = Math.floor((i - 1) / 10);
    const theme = WORLD_THEMES[worldIndex];

    levels.push({
      levelId: i,
      title: `Level ${i}: ${theme.name} Phase ${(i - 1) % 10 + 1}`,
      worldId: theme.id,
      worldName: theme.name,
      rows,
      cols,
      grid,
      theme
    });
  }

  return levels;
}

export const LEVELS = generateLevelData();
