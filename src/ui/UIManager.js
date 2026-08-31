/**
 * Brick Blitz - Master UI Manager & View Router
 */

import { HUD } from './HUD.js';
import { ModalsManager } from './Modals.js';
import { LeaderboardView } from './LeaderboardView.js';
import { StatsView } from './StatsView.js';
import { ShopView } from './ShopView.js';
import { ProfileView } from './ProfileView.js';
import { GAME_STATES, GAME_MODES } from '../utils/Constants.js';
import { LEVELS } from '../data/Levels.js';

export class UIManager {
  constructor(game) {
    this.game = game;
    this.storage = game.storage;

    this.hud = new HUD(game, document.getElementById('hud-overlay'));
    this.modals = new ModalsManager(game, document.getElementById('modal-container'));

    this.leaderboardView = new LeaderboardView(this.storage, document.getElementById('view-leaderboard'));
    this.statsView = new StatsView(this.storage, document.getElementById('view-stats'));
    this.shopView = new ShopView(this.storage, document.getElementById('view-shop'));
    this.profileView = new ProfileView(this.storage, game.auth, document.getElementById('view-profile'));

    this.activeTab = 'play';
    this.bindEvents();
    this.renderActiveTab();
  }

  bindEvents() {
    // Navigation Tabs
    const navButtons = document.querySelectorAll('.nav-tab');
    navButtons.forEach(btn => {
      btn.onclick = () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = btn.dataset.tab;
        this.renderActiveTab();
      };
    });

    // Main Menu Action Buttons
    const btnPlayClassic = document.getElementById('btn-play-classic');
    if (btnPlayClassic) {
      btnPlayClassic.onclick = () => this.game.startNewGame(GAME_MODES.CLASSIC, 1);
    }

    const btnPlayTimeAttack = document.getElementById('btn-play-timeattack');
    if (btnPlayTimeAttack) {
      btnPlayTimeAttack.onclick = () => this.game.startNewGame(GAME_MODES.TIME_ATTACK, 1);
    }

    const btnPlayEndless = document.getElementById('btn-play-endless');
    if (btnPlayEndless) {
      btnPlayEndless.onclick = () => this.game.startNewGame(GAME_MODES.ENDLESS, 1);
    }

    // Audio & CRT Toggle Settings
    const soundToggle = document.getElementById('toggle-sound');
    if (soundToggle) {
      soundToggle.onchange = (e) => {
        const settings = this.storage.getSettings();
        settings.soundEnabled = e.target.checked;
        settings.musicEnabled = e.target.checked;
        this.storage.updateSettings(settings);
        this.game.audio.setVolumes(settings.sfxVolume, settings.musicVolume, settings.soundEnabled, settings.musicEnabled);
      };
    }
  }

  renderLevelSelectGrid() {
    const gridEl = document.getElementById('level-select-grid');
    if (!gridEl) return;

    const profile = this.storage.getCurrentProfile();
    const completedSet = new Set(profile.completedLevels || []);

    gridEl.innerHTML = LEVELS.map(lvl => {
      const isCompleted = completedSet.has(lvl.levelId);
      const isUnlocked = lvl.levelId === 1 || completedSet.has(lvl.levelId - 1) || isCompleted;

      return `
        <button class="level-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}"
          ${!isUnlocked ? 'disabled' : ''} data-level="${lvl.levelId}">
          <span class="lvl-num">${lvl.levelId}</span>
          <span class="lvl-name">${lvl.worldName}</span>
          ${isCompleted ? '<span class="lvl-star">⭐</span>' : !isUnlocked ? '<span class="lvl-lock">🔒</span>' : ''}
        </button>
      `;
    }).join('');

    gridEl.querySelectorAll('.level-card').forEach(card => {
      card.onclick = () => {
        const levelId = parseInt(card.dataset.level, 10);
        this.game.startNewGame(GAME_MODES.CLASSIC, levelId);
      };
    });
  }

  renderActiveTab() {
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.style.display = 'none');

    const target = document.getElementById(`view-${this.activeTab}`);
    if (target) {
      target.style.display = 'block';
    }

    if (this.activeTab === 'levels') {
      this.renderLevelSelectGrid();
    } else if (this.activeTab === 'leaderboard') {
      this.leaderboardView.render();
    } else if (this.activeTab === 'stats') {
      this.statsView.render();
    } else if (this.activeTab === 'shop') {
      this.shopView.render();
    } else if (this.activeTab === 'profile') {
      this.profileView.render();
    }
  }

  onGameStateChanged(state) {
    const mainUI = document.getElementById('main-arcade-interface');

    if (state === GAME_STATES.PLAYING) {
      if (mainUI) mainUI.style.display = 'none';
      this.modals.hide();
    } else if (state === GAME_STATES.PAUSED) {
      this.modals.showPauseModal(
        () => this.game.togglePause(),
        () => this.game.startNewGame(this.game.mode, this.game.currentLevel.levelId),
        () => this.showMenu()
      );
    } else if (state === GAME_STATES.GAME_OVER) {
      this.modals.showGameOverModal(
        this.game.score,
        this.game.currentLevel.levelId,
        () => this.game.startNewGame(this.game.mode, this.game.currentLevel.levelId),
        () => this.showMenu()
      );
    } else if (state === GAME_STATES.LEVEL_COMPLETE) {
      this.modals.showLevelCompleteModal(
        this.game.score,
        this.game.currentLevel.levelId,
        () => this.game.loadLevel(this.game.currentLevelIndex + 1),
        () => this.showMenu()
      );
    }
  }

  showMenu() {
    this.game.state = GAME_STATES.MENU;
    this.game.destroy();
    this.modals.hide();

    const mainUI = document.getElementById('main-arcade-interface');
    if (mainUI) mainUI.style.display = 'block';

    this.renderActiveTab();
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `arcade-toast toast-${type} glassmorphism`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  updateHUD() {
    if (this.game.state === GAME_STATES.PLAYING) {
      this.hud.update();
    }
  }
}
