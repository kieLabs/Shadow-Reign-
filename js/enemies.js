const ENEMY_LOOKS = {
  stalker: { color: '#80a96b', accent: '#d1e6a0', name: 'Forest Stalker', size: 1 },
  archer: { color: '#6e8caa', accent: '#d8c18e', name: 'Dark Archer', size: .94, ranged: true },
  soldier: { color: '#6a5265', accent: '#d18d88', name: 'Shadow Soldier', size: 1 },
  guard: { color: '#8b929d', accent: '#d7b77e', name: 'Iron Guard', size: 1.08 },
  beast: { color: '#936a4e', accent: '#e1a06e', name: 'Mountain Beast', size: 1.28 },
  elite: { color: '#473f57', accent: '#c67c9b', name: 'Elite Commander', size: 1.12 },
  royal: { color: '#4c465f', accent: '#d1b5e8', name: 'Royal Guard', size: 1.05 }
};

export class Enemy {
  constructor(spec, chapterId, index = 0) {
    this.type = spec.type || 'soldier'; this.look = ENEMY_LOOKS[this.type] || ENEMY_LOOKS.soldier;
    this.x = spec.x; this.y = 400; this.w = 34 * this.look.size; this.h = 52 * this.look.size;
    this.maxHp = spec.hp || 60; this.hp = this.maxHp; this.damage = spec.damage || 9; this.speed = (this.look.ranged ? 1.05 : 1.45) + chapterId * .035;
    this.facing = -1; this.cooldown = 500 + index * 70; this.attackFlash = 0; this.alive = true; this.stun = 0; this.phase = 0; this.projectiles = [];
    this.homeX = this.x; this.chapterId = chapterId; this.hitFlash = 0;
  }
  update(player, dt, level) {
    if (!this.alive) return;
    const step = Math.min(2, dt / 16.667); this.cooldown -= dt; this.attackFlash = Math.max(0, this.attackFlash - dt); this.hitFlash = Math.max(0, this.hitFlash - dt);
    if (this.stun > 0) { this.stun -= dt; return; }
    const dx = player.x - this.x, dist = Math.abs(dx); this.facing = dx < 0 ? -1 : 1;
    if (dist < 520) {
      if (this.look.ranged) {
        if (dist < 230) this.x -= this.facing * this.speed * .7 * step;
        else if (dist > 370) this.x += this.facing * this.speed * .5 * step;
        if (this.cooldown <= 0 && dist < 500) { this.projectiles.push({ x: this.x + this.w / 2, y: this.y + 22, vx: this.facing * 5.2, life: 1700, damage: this.damage }); this.cooldown = 1750; this.attackFlash = 220; }
      } else if (dist > 42) this.x += this.facing * this.speed * step;
      else if (this.cooldown <= 0) { this.attackFlash = 280; this.cooldown = 1350; }
    } else this.x += Math.sin((this.x - this.homeX) * .012) * .18 * step;
    this.x = Math.max(0, Math.min(level.width - this.w, this.x));
    for (const p of this.projectiles) { p.x += p.vx * step; p.life -= dt; }
    this.projectiles = this.projectiles.filter(p => p.life > 0);
  }
  takeDamage(amount, knock = 0) { if (!this.alive) return; this.hp = Math.max(0, this.hp - amount); this.x += knock; this.stun = 130; this.hitFlash = 120; if (this.hp <= 0) this.alive = false; }
}

export { ENEMY_LOOKS };
