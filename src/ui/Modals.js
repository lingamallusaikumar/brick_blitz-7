/**
 * Brick Blitz - Interactive Modals (Pause, Game Over, Level Complete, Settings)
 */

export class ModalsManager {
  constructor(game, modalContainerEl) {
    this.game = game;
    this.container = modalContainerEl;
  }

  showPauseModal(onResume, onRestart, onMainMenu) {
    this.container.innerHTML = `
      <div class="arcade-modal-backdrop">
        <div class="arcade-modal-box glassmorphism glow-cyan">
          <h2 class="modal-title neon-blue">GAME PAUSED</h2>
          <p class="modal-sub">Take a breather, brick breaker!</p>
          
          <div class="modal-actions">
            <button id="modal-resume-btn" class="arcade-btn primary">RESUME GAME</button>
            <button id="modal-restart-btn" class="arcade-btn secondary">RESTART LEVEL</button>
            <button id="modal-menu-btn" class="arcade-btn danger">MAIN MENU</button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#modal-resume-btn').onclick = onResume;
    this.container.querySelector('#modal-restart-btn').onclick = onRestart;
    this.container.querySelector('#modal-menu-btn').onclick = onMainMenu;
  }

  showGameOverModal(score, levelId, onRestart, onMainMenu) {
    this.container.innerHTML = `
      <div class="arcade-modal-backdrop">
        <div class="arcade-modal-box glassmorphism glow-pink">
          <h2 class="modal-title neon-pink">GAME OVER</h2>
          <p class="modal-sub">Level ${levelId} Defeated You</p>

          <div class="score-summary-card">
            <div class="stat-row"><span>Final Score</span><strong class="neon-blue">${score.toLocaleString()}</strong></div>
            <div class="stat-row"><span>High Score</span><strong>${this.game.storage.getCurrentProfile().highScore.toLocaleString()}</strong></div>
          </div>

          <div class="modal-actions">
            <button id="modal-retry-btn" class="arcade-btn primary">TRY AGAIN</button>
            <button id="modal-menu-btn" class="arcade-btn secondary">MAIN MENU</button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#modal-retry-btn').onclick = onRestart;
    this.container.querySelector('#modal-menu-btn').onclick = onMainMenu;
  }

  showLevelCompleteModal(score, levelId, onNextLevel, onMainMenu) {
    this.container.innerHTML = `
      <div class="arcade-modal-backdrop">
        <div class="arcade-modal-box glassmorphism glow-green">
          <h2 class="modal-title neon-green">LEVEL CLEARED!</h2>
          <p class="modal-sub">Level ${levelId} Complete</p>

          <div class="score-summary-card">
            <div class="stat-row"><span>Level Score</span><strong class="neon-green">${score.toLocaleString()}</strong></div>
            <div class="stat-row"><span>Total Bricks Smashed</span><strong>${this.game.stats.sessionStats.bricksDestroyed}</strong></div>
          </div>

          <div class="modal-actions">
            <button id="modal-next-btn" class="arcade-btn primary">NEXT LEVEL ➔</button>
            <button id="modal-menu-btn" class="arcade-btn secondary">MAIN MENU</button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#modal-next-btn').onclick = onNextLevel;
    this.container.querySelector('#modal-menu-btn').onclick = onMainMenu;
  }

  hide() {
    this.container.innerHTML = '';
  }
}
