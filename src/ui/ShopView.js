/**
 * Brick Blitz - Cosmetics Shop & Equipping View Component
 */

import { PADDLE_SKINS, BALL_THEMES } from '../data/Skins.js';

export class ShopView {
  constructor(storageManager, containerEl) {
    this.storage = storageManager;
    this.container = containerEl;
  }

  render() {
    const profile = this.storage.getCurrentProfile();
    const unlockedSkins = new Set(profile.unlockedSkins || ['neon_cyan']);
    const unlockedThemes = new Set(profile.unlockedBallThemes || ['plasma_orb']);

    this.container.innerHTML = `
      <div class="view-card glassmorphism">
        <h2 class="view-title neon-green">🛍️ ARCADE COSMETICS SHOP</h2>
        <p class="view-desc">Unlock radiant skins using your earned player XP!</p>

        <h3 class="section-subtitle neon-cyan">PADDLE SKINS</h3>
        <div class="shop-grid">
          ${PADDLE_SKINS.map(skin => {
            const isUnlocked = unlockedSkins.has(skin.id);
            const isEquipped = profile.selectedPaddleSkin === skin.id;

            return `
              <div class="shop-card ${isEquipped ? 'equipped' : isUnlocked ? 'unlocked' : ''}">
                <div class="skin-preview paddle-preview-${skin.id}"></div>
                <strong>${skin.name}</strong>
                <p class="skin-desc">${skin.desc}</p>
                <div class="shop-action">
                  ${isEquipped ? `
                    <span class="badge-equipped">EQUIPPED</span>
                  ` : isUnlocked ? `
                    <button class="arcade-btn small secondary btn-equip-paddle" data-id="${skin.id}">EQUIP</button>
                  ` : `
                    <button class="arcade-btn small primary btn-buy-paddle" data-id="${skin.id}" data-cost="${skin.cost}">
                      UNLOCK (${skin.cost} XP)
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <h3 class="section-subtitle neon-pink">BALL VISUAL THEMES</h3>
        <div class="shop-grid">
          ${BALL_THEMES.map(theme => {
            const isUnlocked = unlockedThemes.has(theme.id);
            const isEquipped = profile.selectedBallTheme === theme.id;

            return `
              <div class="shop-card ${isEquipped ? 'equipped' : isUnlocked ? 'unlocked' : ''}">
                <div class="ball-preview ball-preview-${theme.id}"></div>
                <strong>${theme.name}</strong>
                <p class="skin-desc">${theme.desc}</p>
                <div class="shop-action">
                  ${isEquipped ? `
                    <span class="badge-equipped">EQUIPPED</span>
                  ` : isUnlocked ? `
                    <button class="arcade-btn small secondary btn-equip-ball" data-id="${theme.id}">EQUIP</button>
                  ` : `
                    <button class="arcade-btn small primary btn-buy-ball" data-id="${theme.id}" data-cost="${theme.cost}">
                      UNLOCK (${theme.cost} XP)
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Bind equip & buy event listeners
    this.container.querySelectorAll('.btn-equip-paddle').forEach(btn => {
      btn.onclick = () => {
        profile.selectedPaddleSkin = btn.dataset.id;
        this.storage.saveCurrentProfile(profile);
        this.render();
      };
    });

    this.container.querySelectorAll('.btn-equip-ball').forEach(btn => {
      btn.onclick = () => {
        profile.selectedBallTheme = btn.dataset.id;
        this.storage.saveCurrentProfile(profile);
        this.render();
      };
    });

    this.container.querySelectorAll('.btn-buy-paddle').forEach(btn => {
      btn.onclick = () => {
        const cost = parseInt(btn.dataset.cost, 10);
        if (profile.xp >= cost) {
          profile.xp -= cost;
          profile.unlockedSkins.push(btn.dataset.id);
          profile.selectedPaddleSkin = btn.dataset.id;
          this.storage.saveCurrentProfile(profile);
          this.render();
        } else {
          alert(`Insufficient XP! You need ${cost} XP to unlock this paddle.`);
        }
      };
    });

    this.container.querySelectorAll('.btn-buy-ball').forEach(btn => {
      btn.onclick = () => {
        const cost = parseInt(btn.dataset.cost, 10);
        if (profile.xp >= cost) {
          profile.xp -= cost;
          profile.unlockedBallThemes.push(btn.dataset.id);
          profile.selectedBallTheme = btn.dataset.id;
          this.storage.saveCurrentProfile(profile);
          this.render();
        } else {
          alert(`Insufficient XP! You need ${cost} XP to unlock this theme.`);
        }
      };
    });
  }
}
