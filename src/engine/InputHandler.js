/**
 * Brick Blitz - Comprehensive Input Handler
 */

import { CANVAS_WIDTH } from '../utils/Constants.js';

export class InputHandler {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;

    this.keys = {
      left: false,
      right: false,
      space: false,
      pause: false
    };

    this.mouse = {
      x: 0,
      y: 0,
      active: false
    };

    this.touch = {
      active: false,
      startX: 0,
      paddleStartX: 0
    };

    this.bindEvents();
  }

  bindEvents() {
    // Keyboard Event Listeners
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        this.keys.left = true;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        this.keys.right = true;
      } else if (['Space', 'KeyW', 'ArrowUp'].includes(e.code)) {
        this.keys.space = true;
        this.game.onActionTriggered();
      } else if (['KeyP', 'Escape'].includes(e.code)) {
        this.game.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        this.keys.left = false;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        this.keys.right = false;
      } else if (['Space', 'KeyW', 'ArrowUp'].includes(e.code)) {
        this.keys.space = false;
      }
    });

    // Mouse Navigation
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleX;
      this.mouse.active = true;

      this.game.paddle.moveTo(this.mouse.x);
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.game.onActionTriggered();
      }
    });

    // Touch Navigation (Mobile / Tablet)
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const touchX = (e.touches[0].clientX - rect.left) * scaleX;

        this.touch.active = true;
        this.touch.startX = touchX;
        this.touch.paddleStartX = this.game.paddle.x;

        this.game.onActionTriggered();
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.touch.active && e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const currentTouchX = (e.touches[0].clientX - rect.left) * scaleX;
        const deltaX = currentTouchX - this.touch.startX;

        this.game.paddle.moveTo(this.touch.paddleStartX + deltaX + this.game.paddle.width / 2);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.touch.active = false;
    });
  }

  update() {
    // Keyboard continuous movement fallback if mouse not recently moved
    if (this.keys.left) {
      this.game.paddle.moveLeft();
    }
    if (this.keys.right) {
      this.game.paddle.moveRight();
    }
  }
}
