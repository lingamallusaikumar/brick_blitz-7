/**
 * Brick Blitz - User Profile & Account Authentication View Component
 */

export class ProfileView {
  constructor(storageManager, authManager, containerEl) {
    this.storage = storageManager;
    this.auth = authManager;
    this.container = containerEl;
  }

  render() {
    const profile = this.storage.getCurrentProfile();
    const requiredXp = profile.level * 500;
    const xpPercent = Math.min(100, Math.floor((profile.xp / requiredXp) * 100));

    this.container.innerHTML = `
      <div class="view-card glassmorphism">
        <h2 class="view-title neon-blue">👤 PLAYER PROFILE & ACCOUNT</h2>

        <div class="profile-header">
          <div class="avatar-box">
            <span class="avatar-icon">🚀</span>
          </div>
          <div class="profile-details">
            <h3>${profile.username} ${profile.username === 'Alex' ? '<span class="badge-demo">DEMO PLAYER</span>' : ''}</h3>
            <p>High Score: <strong class="neon-cyan">${profile.highScore.toLocaleString()}</strong></p>

            <div class="xp-container">
              <div class="xp-bar-label">
                <span>Level ${profile.level}</span>
                <span>${profile.xp} / ${requiredXp} XP (${xpPercent}%)</span>
              </div>
              <div class="xp-bar-outer">
                <div class="xp-bar-inner" style="width: ${xpPercent}%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-actions-grid">
          <div class="action-box">
            <h4>Account Management</h4>
            <p class="text-muted">Logged in as <strong>${profile.username}</strong>.</p>
            <div class="btn-group">
              <button id="btn-login-demo" class="arcade-btn small secondary">SWITCH TO ALEX (DEMO)</button>
              <button id="btn-create-account" class="arcade-btn small primary">CREATE NEW ACCOUNT</button>
            </div>
          </div>

          <div class="action-box">
            <h4>Save Data Backup</h4>
            <p class="text-muted">Export or import your offline progress JSON.</p>
            <div class="btn-group">
              <button id="btn-export-save" class="arcade-btn small secondary">EXPORT SAVE DATA</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Bindings
    this.container.querySelector('#btn-login-demo').onclick = () => {
      this.auth.login('Alex', 'Demo@123');
      this.render();
    };

    this.container.querySelector('#btn-create-account').onclick = () => {
      const name = prompt('Enter new player username:');
      if (name) {
        this.auth.register(name, 'Demo@123');
        this.render();
      }
    };

    this.container.querySelector('#btn-export-save').onclick = () => {
      const jsonStr = this.storage.exportSaveData();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brick_blitz_save_${profile.username}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };
  }
}
