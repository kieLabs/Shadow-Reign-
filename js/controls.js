export class Controls {
  constructor() {
    this.keys = new Set();
    this.pressed = new Set();
    this.pointer = { left: false, right: false };
    this.bindKeyboard();
    this.bindTouch();
  }
  bindKeyboard() {
    addEventListener('keydown', e => {
      const key = e.key.toLowerCase();
      if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) e.preventDefault();
      if (!this.keys.has(key)) this.pressed.add(key);
      this.keys.add(key);
    });
    addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()));
    addEventListener('blur', () => { this.keys.clear(); this.pointer.left = this.pointer.right = false; });
  }
  bindTouch() {
    document.querySelectorAll('[data-control]').forEach(button => {
      const action = button.dataset.control;
      const down = e => { e.preventDefault(); button.setPointerCapture?.(e.pointerId); this.keys.add(action); this.pressed.add(action); };
      const up = e => { e.preventDefault(); this.keys.delete(action); };
      button.addEventListener('pointerdown', down);
      button.addEventListener('pointerup', up);
      button.addEventListener('pointercancel', up);
      button.addEventListener('lostpointercapture', up);
    });
    const stick = document.getElementById('virtual-stick');
    if (stick) {
      const knob = stick.querySelector('.stick-knob'); let activePointer = null;
      const reset = () => { activePointer = null; this.pointer.left = false; this.pointer.right = false; knob.style.transform = 'translate(0,0)'; };
      stick.addEventListener('pointerdown', e => { e.preventDefault(); activePointer = e.pointerId; stick.setPointerCapture?.(e.pointerId); move(e); });
      const move = e => {
        if (activePointer !== e.pointerId) return;
        const rect = stick.getBoundingClientRect(); const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2); const max = rect.width * .31;
        const x = Math.max(-max, Math.min(max, dx)); const y = Math.max(-max, Math.min(max, dy));
        knob.style.transform = `translate(${x}px,${y}px)`;
        this.pointer.left = x < -max * .2; this.pointer.right = x > max * .2;
      };
      stick.addEventListener('pointermove', move);
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => stick.addEventListener(type, reset));
    }
  }
  down(action) {
    const map = { left: ['a', 'arrowleft', 'left'], right: ['d', 'arrowright', 'right'], jump: ['w', 'arrowup', ' ', 'jump'], light: ['j', 'light'], heavy: ['k', 'heavy'], bow: ['l', 'bow'], dodge: ['shift', 'dodge'], special: ['q', 'special'], interact: ['e', 'interact'], pause: ['escape', 'pause'] };
    return (map[action] || [action]).some(k => this.keys.has(k)) || (action === 'left' && this.pointer.left) || (action === 'right' && this.pointer.right);
  }
  tapped(action) {
    const map = { jump: ['w', 'arrowup', ' ', 'jump'], light: ['j', 'light'], heavy: ['k', 'heavy'], bow: ['l', 'bow'], dodge: ['shift', 'dodge'], special: ['q', 'special'], interact: ['e', 'interact'], pause: ['escape', 'pause'] };
    const result = (map[action] || [action]).some(k => this.pressed.has(k));
    if (result) (map[action] || [action]).forEach(k => this.pressed.delete(k));
    return result;
  }
  endFrame() { this.pressed.clear(); }
}
