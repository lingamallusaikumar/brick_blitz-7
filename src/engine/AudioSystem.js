/**
 * Brick Blitz - Web Audio API Synthesizer
 * Pure procedural audio generation with zero external audio assets.
 */

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.5;

    this.musicInterval = null;
    this.musicStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolumes(sfxVol, musicVol, sfxOn, musicOn) {
    this.sfxVolume = sfxVol;
    this.musicVolume = musicVol;
    this.soundEnabled = sfxOn;
    this.musicEnabled = musicOn;

    if (!this.musicEnabled) {
      this.stopMusic();
    }
  }

  playTone(freq, type = 'sine', durationSec = 0.1, gainVal = 0.3) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const actualGain = gainVal * this.sfxVolume;
      gain.gain.setValueAtTime(actualGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + durationSec);
    } catch (e) {
      // Audio context safety catch
    }
  }

  playNoise(durationSec = 0.2, gainVal = 0.4) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * durationSec;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const gain = this.ctx.createGain();
      const actualGain = gainVal * this.sfxVolume;
      gain.gain.setValueAtTime(actualGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + durationSec);

      whiteNoise.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {
      // Audio safety
    }
  }

  playPaddleHit() {
    this.playTone(320, 'triangle', 0.08, 0.4);
  }

  playBrickBreak(type = 1) {
    this.playTone(520 + type * 100, 'square', 0.1, 0.35);
  }

  playStrongHit() {
    this.playTone(220, 'sawtooth', 0.08, 0.4);
  }

  playSteelHit() {
    this.playTone(180, 'square', 0.06, 0.5);
  }

  playExplosion() {
    this.playNoise(0.35, 0.6);
  }

  playLaserShoot() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playPowerUpCollect() {
    this.playTone(523.25, 'sine', 0.08, 0.4); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.4), 70); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.4), 140); // G5
  }

  playShieldHit() {
    this.playTone(150, 'sine', 0.2, 0.5);
  }

  playGameOver() {
    this.playTone(400, 'sawtooth', 0.2, 0.5);
    setTimeout(() => this.playTone(300, 'sawtooth', 0.2, 0.5), 180);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.35, 0.5), 360);
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.5), idx * 100);
    });
  }

  startMusic() {
    if (!this.musicEnabled || this.musicInterval) return;
    this.init();

    const synthScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    this.musicStep = 0;

    this.musicInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      const freq = synthScale[this.musicStep % synthScale.length];
      this.playTone(freq * 0.5, 'sine', 0.15, 0.15 * this.musicVolume);
      this.musicStep++;
    }, 350);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}
