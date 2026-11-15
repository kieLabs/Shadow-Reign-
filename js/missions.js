export class MissionState {
  constructor(chapter) {
    this.chapter = chapter; this.startedAt = performance.now(); this.kills = 0; this.damageScale = 1; this.achievements = []; this.collectibles = 0; this.hazardCooldown = 0;
    this.bossEntered = false; this.bossIntroShown = false; this.complete = false; this.failed = false; this.elapsed = 0;
  }
  tick(now = performance.now()) { this.elapsed = (now - this.startedAt) / 1000; }
}
