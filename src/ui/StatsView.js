/**
 * Brick Blitz - Player Statistics & Achievement Dashboard Component
 */

import { ACHIEVEMENTS } from '../data/Achievements.js';

export class StatsView {
  constructor(storageManager, containerEl) {
    this.storage = storageManager;
    this.container = containerEl;
  }

  render() {
    const profile = this.storage.getCurrentProfile();
    const stats = profile.stats || {};
    const winRate = stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1) : 0;
    const playTimeMinutes = Math.floor((stats.playTimeSeconds || 0) / 60);

    const unlockedAchSet = new Set(profile.achievements || []);

    this.container.innerHTML = `
      <div class="view-card glassmorphism">
        <h2 class="view-title neon-pink">📊 PLAYER ANALYTICS DASHBOARD</h2>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">🎮</span>
            <div class="stat-info">
              <span class="stat-val">${stats.gamesPlayed || 0}</span>
              <span class="stat-lbl">Games Played</span>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-icon">🏆</span>
            <div class="stat-info">
              <span class="stat-val neon-green">${winRate}%</span>
              <span class="stat-lbl">Win Rate</span>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-icon">🧱</span>
            <div class="stat-info">
              <span class="stat-val neon-blue">${(stats.totalBricksDestroyed || 0).toLocaleString()}</span>
              <span class="stat-lbl">Bricks Smashed</span>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-icon">⏱️</span>
            <div class="stat-info">
              <span class="stat-val">${playTimeMinutes} mins</span>
              <span class="stat-lbl">Total Play Time</span>
            </div>
          </div>
        </div>

        <h3 class="section-subtitle neon-blue">🏆 ACHIEVEMENTS (${unlockedAchSet.size}/${ACHIEVEMENTS.length})</h3>

        <div class="achievements-grid">
          ${ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlockedAchSet.has(ach.id);
            return `
              <div class="ach-badge ${isUnlocked ? 'unlocked' : 'locked'}">
                <span class="ach-icon">${ach.icon}</span>
                <div class="ach-text">
                  <strong>${ach.title}</strong>
                  <p>${ach.desc}</p>
                </div>
                <span class="ach-xp">+${ach.xp} XP</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}
