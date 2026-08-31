/**
 * Brick Blitz - Telemetry & Gameplay Statistics Manager
 */

export class StatsManager {
  constructor(storageManager) {
    this.storage = storageManager;
    this.sessionStats = this.resetSession();
  }

  resetSession() {
    this.sessionStats = {
      bricksDestroyed: 0,
      paddleHits: 0,
      laserHits: 0,
      explosions: 0,
      powerupsCaught: 0,
      maxCombo: 0,
      score: 0,
      startTime: Date.now()
    };
    return this.sessionStats;
  }

  registerBrickDestroyed() {
    this.sessionStats.bricksDestroyed++;
  }

  registerPaddleHit() {
    this.sessionStats.paddleHits++;
  }

  registerLaserHit() {
    this.sessionStats.laserHits++;
  }

  registerExplosion() {
    this.sessionStats.explosions++;
  }

  registerPowerupCaught() {
    this.sessionStats.powerupsCaught++;
  }

  registerCombo(comboVal) {
    if (comboVal > this.sessionStats.maxCombo) {
      this.sessionStats.maxCombo = comboVal;
    }
  }

  commitSession(won = false, finalScore = 0, levelId = 1, mode = 'CLASSIC') {
    const profile = this.storage.getCurrentProfile();
    const elapsedSeconds = Math.floor((Date.now() - this.sessionStats.startTime) / 1000);

    profile.stats.gamesPlayed++;
    if (won) profile.stats.gamesWon++;

    profile.stats.totalBricksDestroyed += this.sessionStats.bricksDestroyed;
    profile.stats.totalScore += finalScore;
    profile.stats.powerupsCollected += this.sessionStats.powerupsCaught;
    profile.stats.playTimeSeconds += elapsedSeconds;
    profile.stats.laserHits += this.sessionStats.laserHits;
    profile.stats.explosionsTriggered += this.sessionStats.explosions;
    profile.stats.paddleHits += this.sessionStats.paddleHits;

    if (finalScore > profile.highScore) {
      profile.highScore = finalScore;
    }
    if (this.sessionStats.maxCombo > profile.maxCombo) {
      profile.maxCombo = this.sessionStats.maxCombo;
    }

    if (won && !profile.completedLevels.includes(levelId)) {
      profile.completedLevels.push(levelId);
    }

    this.storage.saveCurrentProfile(profile);

    // Save to Leaderboard
    if (finalScore > 0) {
      this.storage.addLeaderboardEntry({
        name: profile.username,
        score: finalScore,
        mode,
        level: levelId
      });
    }

    return profile;
  }
}
