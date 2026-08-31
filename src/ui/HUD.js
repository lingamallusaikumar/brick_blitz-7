/**
 * Brick Blitz - Heads-Up Display (HUD) Interface Component
 */

export class HUD {
  constructor(game, containerEl) {
    this.game = game;
    this.container = containerEl;
  }

  update() {
    if (!this.container) return;

    const livesHeart = '❤️'.repeat(Math.max(0, this.game.lives));
    const activePups = [];

    if (this.game.paddle.hasLaser) activePups.push('⚡ Laser');
    if (this.game.paddle.isExpanded) activePups.push('↔️ Expand');
    if (this.game.slowMoActive) activePups.push('⏱️ Slow-Mo');
    if (this.game.shieldActive) activePups.push('🛡️ Shield');

    this.container.innerHTML = `
      <div class="hud-top-bar">
        <div class="hud-item score-box">
          <span class="hud-label">SCORE</span>
          <span class="hud-value neon-blue">${this.game.score.toLocaleString()}</span>
        </div>

        <div class="hud-item level-box">
          <span class="hud-label">LEVEL ${this.game.currentLevel ? this.game.currentLevel.levelId : 1}</span>
          <span class="hud-value-sub">${this.game.currentLevel ? this.game.currentLevel.title : ''}</span>
        </div>

        <div class="hud-item combo-box ${this.game.combo > 1 ? 'active-combo' : ''}">
          <span class="hud-label">COMBO</span>
          <span class="hud-value neon-pink">x${this.game.combo}</span>
        </div>

        <div class="hud-item lives-box">
          <span class="hud-label">LIVES</span>
          <span class="hud-value lives-hearts">${livesHeart}</span>
        </div>

        <button id="btn-pause-hud" class="hud-btn-pause" title="Pause Game">⏸️</button>
      </div>

      ${activePups.length > 0 ? `
        <div class="hud-powerups-bar">
          ${activePups.map(p => `<span class="pup-tag">${p}</span>`).join('')}
        </div>
      ` : ''}
    `;

    const pauseBtn = this.container.querySelector('#btn-pause-hud');
    if (pauseBtn) {
      pauseBtn.onclick = () => this.game.togglePause();
    }
  }
}
