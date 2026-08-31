# Brick Blitz — 2D Brick Breaker Arcade Game 🧱⚡

> A commercial-quality, responsive 2D Brick Breaker Arcade Game built with **JavaScript (ES6+), HTML5 Canvas, modern CSS3, and Python 3.10+**.

![License](https://img.shields.io/badge/License-Proprietary-red.svg)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)
![Tests](https://img.shields.io/badge/Tests-5%20Suites%20Passing-success.svg)

---

## 🌟 Key Features

* **Sub-stepped 2D Physics Engine**: Precision AABB circle-box collision detection, angular paddle bounce mechanics, reflection vector math, magnetic paddle attachment, and zero tunneling.
* **5 Brick Types**:
  * **Normal**: 1-hit colorful bricks.
  * **Strong**: 2-hit reinforced bricks with visual crack states.
  * **Steel**: Unbreakable obstacle bricks with metallic sheen.
  * **Explosive**: Radial AOE detonation destroying adjacent bricks.
  * **Moving**: Horizontal patrolling bricks.
* **6 Power-ups**:
  * ⚽ **Multi Ball**: Spawns 3 active balls simultaneously.
  * ⚡ **Laser Paddle**: Enables dual laser cannons to shoot bricks.
  * ↔️ **Expand Paddle**: Stretches paddle width for easier control.
  * ⏱️ **Slow Motion**: Decelerates ball velocity.
  * 🛡️ **Shield Wall**: Deploys bottom energy barrier to save lost balls.
  * ❤️ **Extra Life**: Adds +1 heart.
* **4 Game Modes**:
  1. **Classic Mode**: 50+ progressive levels across 5 unique world themes.
  2. **Time Attack**: Ticking countdown timer with +5s time extensions on brick breaks.
  3. **Endless Survival**: Continuous descending brick wave rows.
  4. **Challenge Mode**: Gameplay modifiers (Speed surge, mini paddle, low vision).
* **Player Progression & Pre-seeded Demo Profile**:
  * **Demo Account**: `Username: Alex` | `Password: Demo@123`
  * Pre-seeded high scores, completed levels (1-14), unlocked cosmetics, statistics, and 8 unlocked achievements.
  * **20+ Achievements** with XP rewards and real-time toast notifications.
  * **Cosmetics Shop**: Unlockable paddle skins (Neon Cyan, Cyber Gold, Laser Red, Retro Synth, Emerald) & ball themes (Plasma Orb, Solar Fireball, Chrome, Energy Core, Quantum Void).
  * **Analytics Dashboard**: Game statistics, win rate calculations, bricks destroyed, and play duration.
* **Synthesized Web Audio API Engine**: Zero external audio asset dependencies — pure procedural oscillators for retro 8-bit sound effects & chiptune background music.
* **DevOps & Testing**:
  * Vitest automated test suite (5 test files covering math, physics, collision, storage, achievements, and level loading).
  * Python 3.10+ CLI utilities (`python/level_generator.py`, `python/analytics_cli.py`, `python/validator.py`).
  * `Dockerfile`, `docker-compose.yml`, and `Makefile`.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Python**: v3.10 or higher (optional, for CLI utilities)
* **Docker**: Optional, for containerized execution

### Installation & Local Run

```bash
# 1. Clone repository
git clone https://github.com/user/brick-blitz.git
cd brick-blitz

# 2. Install dependencies
npm install

# 3. Start local Vite development server
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🧪 Automated Testing

Run the Vitest test suite covering core math, collision physics, local storage, achievements, and level dataset loading:

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🐍 Python 3.10+ Utilities

```bash
# Generate 50 level datasets JSON
python python/level_generator.py

# Validate level playability and grid matrix integrity
python python/validator.py

# Analyze save file telemetry report
python python/analytics_cli.py
```

---

## 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t brick-blitz .

# Run Docker container
docker run -d -p 8080:80 --name brick_blitz_app brick-blitz

# Alternatively, using docker-compose
docker-compose up -d
```

Access the game at `http://localhost:8080`.

---

## 🛠️ Makefile Commands

```bash
make install      # Install dependencies
make dev          # Start local dev server
make test         # Run test suite
make build        # Build production bundle
make python-gen   # Generate python levels
make python-val   # Run python level validator
make docker-build # Build Docker container
make docker-run   # Run container on port 8080
make clean        # Clean build artifacts
```

---

## 🔀 5 Feature Phases & Git Pull Request Breakdown

The project development is structured into **5 distinct feature phases**, serving as Git commits and Pull Requests:

### Phase 1: Engine Foundation & Physics Core
* **Commit/PR 1**: `feat(engine): core canvas rendering, AABB math, sub-step collision engine & inputs`
* Implemented Vite setup, canvas loop, vector math (`MathUtils.js`), paddle & ball entities, and Vitest physics tests (`tests/math.test.js`, `tests/collision.test.js`).

### Phase 2: Bricks, Level System & Particle FX
* **Commit/PR 2**: `feat(level): 5 brick types, 50 levels dataset, particle explosion system & python level tool`
* Added Normal, Strong (cracked state), Steel, Explosive, and Moving brick types. Created 50 levels across 5 world themes (`data/Levels.js`), `ParticleSystem.js`, and `python/level_generator.py`.

### Phase 3: Power-ups, Game Modes & Web Audio Engine
* **Commit/PR 3**: `feat(gameplay): 6 falling power-ups, 4 game modes & Web Audio synthesizer`
* Implemented Multi-ball, Laser paddle, Expand, Slow-mo, Shield, and Extra life power-ups. Created Classic, Time Attack, Endless, and Challenge game modes. Built `AudioSystem.js` retro audio synthesizer.

### Phase 4: Player Progress, Storage, Achievements & Demo Account
* **Commit/PR 4**: `feat(progress): LocalStorage persistence, Alex demo profile, 20+ achievements & cosmetics shop`
* Implemented `StorageManager.js`, pre-seeded `DEMO_PROFILE` for `Alex` (`Demo@123`), `AchievementManager.js` with 21 achievements, `StatsManager.js`, and cosmetics catalog (`Skins.js`).

### Phase 5: Arcade UI/UX, Responsive Design, DevOps & Documentation
* **Commit/PR 5**: `feat(ui-devops): modern glassmorphism UI, CRT overlay, Dockerfile, Makefile & documentation`
* Built polished HUD, Modals, Leaderboard, Stats Dashboard, Shop UI, Profile View, Python CLI tools, Docker configuration, and comprehensive documentation.

---

## 📄 License
Proprietary License © 2026 Antigravity Team. All Rights Reserved.
