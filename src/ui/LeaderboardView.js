/**
 * Brick Blitz - High Score Leaderboard View Component
 */

export class LeaderboardView {
  constructor(storageManager, containerEl) {
    this.storage = storageManager;
    this.container = containerEl;
    this.currentFilter = 'ALL';
  }

  render() {
    const list = this.storage.getLeaderboards(this.currentFilter);

    this.container.innerHTML = `
      <div class="view-card glassmorphism">
        <h2 class="view-title neon-blue">🏆 GLOBAL LEADERBOARDS</h2>

        <div class="tab-filters">
          <button class="filter-btn ${this.currentFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">ALL MODES</button>
          <button class="filter-btn ${this.currentFilter === 'CLASSIC' ? 'active' : ''}" data-filter="CLASSIC">CLASSIC</button>
          <button class="filter-btn ${this.currentFilter === 'TIME_ATTACK' ? 'active' : ''}" data-filter="TIME_ATTACK">TIME ATTACK</button>
          <button class="filter-btn ${this.currentFilter === 'ENDLESS' ? 'active' : ''}" data-filter="ENDLESS">ENDLESS</button>
        </div>

        <div class="table-scroll-container">
          <table class="arcade-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>PLAYER</th>
                <th>MODE</th>
                <th>LEVEL</th>
                <th>SCORE</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              ${list.length > 0 ? list.map((item, idx) => `
                <tr class="${idx === 0 ? 'gold-rank' : idx === 1 ? 'silver-rank' : idx === 2 ? 'bronze-rank' : ''}">
                  <td>#${idx + 1}</td>
                  <td><strong>${item.name}</strong></td>
                  <td><span class="mode-badge">${item.mode}</span></td>
                  <td>${item.level}</td>
                  <td class="neon-cyan">${item.score.toLocaleString()}</td>
                  <td>${item.date || '2026-08-31'}</td>
                </tr>
              `).join('') : `
                <tr><td colspan="6" class="text-muted">No high scores recorded yet. Play a game to claim #1!</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.onclick = () => {
        this.currentFilter = btn.dataset.filter;
        this.render();
      };
    });
  }
}
