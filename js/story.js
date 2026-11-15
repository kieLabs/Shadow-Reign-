export class StoryDirector {
  constructor(ui, getLanguage) { this.ui = ui; this.getLanguage = getLanguage; this.queue = []; this.index = 0; this.onDone = null; this.active = false; }
  start(lines, onDone = () => {}) {
    this.queue = lines; this.index = 0; this.onDone = onDone; this.active = true; this.show();
  }
  show() {
    if (!this.active) return;
    const line = this.queue[this.index];
    if (!line) { this.finish(); return; }
    this.ui.showDialogue(line[0], line[1], this.getLanguage(), () => this.next());
  }
  next() { this.index++; if (this.index >= this.queue.length) this.finish(); else this.show(); }
  finish() { this.active = false; this.ui.hideDialogue(); const done = this.onDone; this.onDone = null; done?.(); }
  skip() { if (this.active) this.finish(); }
}
