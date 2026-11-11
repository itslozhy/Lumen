class Input {
  constructor() {
    this.keys = {};
    this.prevKeys = {};
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => { this.keys = {}; this.prevKeys = {}; });
  }
  update() { this.prevKeys = { ...this.keys }; }
  isDown(code) { return !!this.keys[code]; }
  wasPressed(code) { return !!this.keys[code] && !this.prevKeys[code]; }
  left() { return this.isDown('ArrowLeft') || this.isDown('KeyA'); }
  right() { return this.isDown('ArrowRight') || this.isDown('KeyD'); }
  up() { return this.isDown('ArrowUp') || this.isDown('KeyW'); }
  down() { return this.isDown('ArrowDown') || this.isDown('KeyS'); }
  jump() { return this.wasPressed('Space') || this.wasPressed('KeyZ') || this.wasPressed('ArrowUp') || this.wasPressed('KeyW'); }
  attack() { return this.wasPressed('KeyX') || this.wasPressed('KeyJ'); }
  interact() { return this.wasPressed('KeyE'); }
  dash() { return this.wasPressed('KeyC') || this.wasPressed('ShiftLeft'); }
  map() { return this.wasPressed('KeyM'); }
  pause() { return this.wasPressed('Escape') || this.wasPressed('KeyP'); }
  heal() { return this.wasPressed('KeyH')||this.wasPressed('Digit1')||this.wasPressed('Numpad1'); }
  mana() { return this.wasPressed('Digit2')||this.wasPressed('Numpad2'); }
  confirm() { return this.wasPressed('Enter') || this.wasPressed('Space') || this.wasPressed('KeyZ'); }
}
