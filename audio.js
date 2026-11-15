export class AudioDirector {
  constructor() { this.ctx = null; this.enabled = true; this.musicTimer = null; this.musicStep = 0; this.volume = 0.12; }
  unlock() { if (!this.ctx) { const Ctx = window.AudioContext || window.webkitAudioContext; if (Ctx) this.ctx = new Ctx(); } if (this.ctx?.state === 'suspended') this.ctx.resume(); }
  tone(freq = 220, duration = 0.12, type = 'sine', gain = 0.08, slide = 0) {
    if (!this.enabled) return;
    this.unlock(); if (!this.ctx) return;
    const osc = this.ctx.createOscillator(), amp = this.ctx.createGain(), now = this.ctx.currentTime;
    osc.type = type; osc.frequency.setValueAtTime(freq, now); if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(25, freq + slide), now + duration);
    amp.gain.setValueAtTime(gain, now); amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(amp); amp.connect(this.ctx.destination); osc.start(now); osc.stop(now + duration + 0.02);
  }
  play(name) {
    const sounds = { hit: [125, .09, 'sawtooth', .07, -55], heavy: [85, .19, 'square', .08, -30], arrow: [610, .1, 'triangle', .045, -260], jump: [320, .11, 'sine', .04, 170], hurt: [95, .18, 'sawtooth', .07, -35], dodge: [420, .1, 'triangle', .035, 300], special: [170, .3, 'sawtooth', .07, 550], victory: [520, .45, 'sine', .07, 400], defeat: [190, .45, 'triangle', .06, -100], click: [430, .05, 'sine', .025, 80] };
    const args = sounds[name]; if (args) this.tone(...args);
  }
  startAmbient(chapter = 1) {
    this.stopAmbient(); if (!this.enabled) return;
    const notes = [110, 146.8, 164.8, 130.8, 196, 164.8, 146.8, 123.5];
    this.musicTimer = setInterval(() => { if (this.enabled && this.ctx) this.tone(notes[(this.musicStep++ + chapter) % notes.length], 1.0, 'triangle', this.volume * .18); }, 1150);
  }
  stopAmbient() { if (this.musicTimer) clearInterval(this.musicTimer); this.musicTimer = null; }
  setEnabled(value) { this.enabled = value; if (!value) this.stopAmbient(); }
}
