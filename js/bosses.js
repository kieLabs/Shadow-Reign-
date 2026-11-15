const BOSSES = {
  sentinel: ['ARENA CHAMPION','#b98b56',1.0], beast: ['BEAST KING','#9c744e',1.2], warden: ['IRON WARDEN','#8d9aa8',1.15], captain: ['ASHEN CAPTAIN','#a85e61',1.25], commander: ['IRON COMMANDER','#8a9aad',1.35], warlord: ['BROKEN WARLORD','#b06b4d',1.45], breaker: ['TIDEBREAKER','#56899b',1.4], sentinelDark: ['VEIL SENTINEL','#8c79b2',1.35], colossus: ['THE COLOSSUS','#9d8370',1.75], malgrav: ['MALGRAV','#a75d83',1.65], echo: ['THE LAST TRIAL','#d1b278',1.0]
};

export class Boss {
  constructor(type, x, chapterId, difficulty = 1) {
    const [name, color, scale] = BOSSES[type] || BOSSES.sentinel;
    this.type = type; this.name = name; this.color = color; this.x = x; this.y = 355; this.w = 60 * scale; this.h = 98 * scale;
    this.maxHp = (250 + chapterId * 34) * difficulty; this.hp = this.maxHp; this.damage = (13 + chapterId * 1.3) * difficulty;
    this.speed = 1.05 + chapterId * .035; this.facing = -1; this.cooldown = 1200; this.attackFlash = 0; this.alive = true;
    this.stun = 0; this.hitFlash = 0; this.phase = 1; this.projectiles = []; this.entered = false; this.specialTimer = 0;
  }
  update(player, dt, level) {
    if (!this.alive) return;
    const step = Math.min(2, dt / 16.667); const dx = player.x - this.x, dist = Math.abs(dx); this.facing = dx < 0 ? -1 : 1;
    this.phase = this.hp < this.maxHp * .33 ? 3 : this.hp < this.maxHp * .68 ? 2 : 1;
    this.cooldown -= dt; this.attackFlash = Math.max(0, this.attackFlash - dt); this.hitFlash = Math.max(0, this.hitFlash - dt); this.stun = Math.max(0, this.stun - dt);
    if (dist > 86 && this.stun <= 0) this.x += this.facing * this.speed * (this.phase === 3 ? 1.55 : 1) * step;
    if (this.cooldown <= 0 && dist < 590) {
      this.attackFlash = 420;
      if (this.phase === 1) this.specialTimer = 0;
      if (this.phase === 2 || this.type === 'malgrav' || this.type === 'breaker' || this.type === 'sentinelDark') {
        this.projectiles.push({ x: this.x + this.w / 2, y: this.y + 35, vx: this.facing * (this.phase === 3 ? 7.1 : 5.4), life: 1600, damage: this.damage * .72, radius: 9 });
      }
      this.cooldown = this.phase === 3 ? 830 : this.phase === 2 ? 1120 : 1450;
    }
    this.x = Math.max(0, Math.min(level.width - this.w, this.x));
    for (const p of this.projectiles) { p.x += p.vx * step; p.life -= dt; }
    this.projectiles = this.projectiles.filter(p => p.life > 0);
  }
  takeDamage(amount, knock = 0) { if (!this.alive) return; this.hp = Math.max(0, this.hp - amount); this.x += knock; this.hitFlash = 140; this.stun = 110; if (this.hp <= 0) this.alive = false; }
}
