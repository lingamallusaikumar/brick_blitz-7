/**
 * Brick Blitz - Main Application Entrypoint
 */

import { StorageManager } from './managers/StorageManager.js';
import { AuthManager } from './managers/AuthManager.js';
import { AchievementManager } from './managers/AchievementManager.js';
import { StatsManager } from './managers/StatsManager.js';
import { Game } from './engine/Game.js';
import { UIManager } from './ui/UIManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  // Initialize Storage & Managers
  const storageManager = new StorageManager();
  const authManager = new AuthManager(storageManager);
  const statsManager = new StatsManager(storageManager);

  // Temporary UI object placeholder for AchievementManager toast binding
  let uiManager;

  const achievementManager = new AchievementManager(storageManager, {
    showToast: (msg, type) => uiManager && uiManager.showToast(msg, type)
  });

  const managers = {
    storage: storageManager,
    auth: authManager,
    achievements: achievementManager,
    stats: statsManager
  };

  // Instantiate Game Engine
  const game = new Game(canvas, managers);

  // Instantiate UI Manager
  uiManager = new UIManager(game);

  game.registerUICallbacks({
    onStateChanged: (state) => uiManager.onGameStateChanged(state)
  });

  // Request Animation Frame loop update HUD
  function gameLoopTick() {
    uiManager.updateHUD();
    requestAnimationFrame(gameLoopTick);
  }
  requestAnimationFrame(gameLoopTick);

  console.log('🧱 Brick Blitz initialized successfully! Seeded user Alex logged in.');
});
