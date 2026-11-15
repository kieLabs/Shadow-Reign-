import { CHARACTERS } from './data.js';

export class Player {
  constructor(characterId = 'arin', upgrades = {}) { this.setCharacter(characterId, upgrades); this.reset(); }
  setCharacter(characterId, upgrades = {}) {
    const base = CHARACTERS[characterId] || CHARACTERS.arin;
    this.character = base; this.upgrades = upgrades;
    this.maxHp = base.hp + (upgrades.health || 0) * 16; this.damageBonus = (upgrades.blade || 0) * 5; this.bowBonus = (upgrades.bow || 0) * 5;
  }
  reset() {
    this.x = 90; this.y = 360; this.w = 34; this.h = 58; this.vx = 0; this.vy = 0; this.hp = this.maxHp; this.facing = 1;
    this.grounded = false; this.attackTimer = 0; this.attackCooldown = 0; this.attackKind = 'light'; this.attackHits = new Set();
    this.dodgeTimer = 0; this.invulnerable = 0; this.specialCooldown = 0; this.bowCooldown = 0; this.combo = 0; this.comboTimer = 0;
    this.arrows = []; this.dead = false; this.anim = 0; this.damageFlash = 0;
  }
  get alive() { return this.hp > 0; }
  update(input, level, dt, audio, onShoot, difficulty = 1) {
    const step = Math.min(2.2, dt / 16.667);
    const left = input.down('left'), right = input.down('right');
    if (this.dodgeTimer > 0) this.dodgeTimer -= dt;
    if (this.invulnerable > 0) this.invulnerable -= dt;
    if (this.attackTimer > 0) this.attackTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.specialCooldown > 0) this.specialCooldown -= dt;
    if (this.bowCooldown > 0) this.bowCooldown -= dt;
    if (this.comboTimer > 0) this.comboTimer -= dt; else this.combo = 0;
    if (this.damageFlash > 0) this.damageFlash -= dt;

    const move = (right ? 1 : 0) - (left ? 1 : 0);
    if (this.dodgeTimer <= 0) this.vx = move * this.character.speed * step;
    if (move) this.facing = move;
    if (input.tapped('jump') && this.grounded) { this.vy = -this.character.jump; this.grounded = false; audio.play('jump'); }
    if (input.tapped('dodge') && this.dodgeTimer <= 0) { this.dodgeTimer = 220; this.invulnerable = 330; this.vx = this.facing * 10.5 * step; audio.play('dodge'); }
    if (input.tapped('light')) this.attack('light', audio);
    if (input.tapped('heavy')) this.attack('heavy', audio);
    if (input.tapped('bow') && this.bowCooldown <= 0 && this.character.id !== 'toran') {
      this.bowCooldown = 620; const arrow = { x: this.x + this.w / 2 + this.facing * 22, y: this.y + 23, vx: this.facing * 10.5, damage: this.character.bow + this.bowBonus, life: 1200 };
      this.arrows.push(arrow); onShoot?.(arrow); audio.play('arrow');
    }
    if (input.tapped('special') && this.specialCooldown <= 0) {
      this.specialCooldown = 6900; this.attack('special', audio); this.attackTimer = 420; this.invulnerable = 520;
    }
    this.anim += Math.abs(this.vx) * .08 + .04;
    this.x += this.vx;
    this.x = Math.max(0, Math.min(level.width - this.w, this.x));
    this.vy += 0.58 * step; this.vy = Math.min(14, this.vy); this.y += this.vy * step;
    this.grounded = false;
    for (const p of level.platforms) {
      const overlaps = this.x + this.w > p.x && this.x < p.x + p.w;
      const prevBottom = this.y + this.h - this.vy * step;
      if (overlaps && this.vy >= 0 && prevBottom <= p.y + 7 && this.y + this.h >= p.y) { this.y = p.y - this.h; this.vy = 0; this.grounded = true; }
    }
    if (this.y > 650) { this.y = 365; this.vy = 0; this.takeDamage(16 * difficulty); }
    for (const a of this.arrows) { a.x += a.vx * step; a.life -= dt; }
    this.arrows = this.arrows.filter(a => a.life > 0 && a.x > -20 && a.x < level.width + 20);
    if (this.attackTimer <= 0 && this.attackKind === 'special') this.attackHits.clear();
  }
  attack(kind, audio) {
    if (kind !== 'special' && this.attackCooldown > 0) return;
    this.attackKind = kind; this.attackTimer = kind === 'light' ? 190 : kind === 'heavy' ? 310 : 430;
    this.attackCooldown = kind === 'light' ? 260 : kind === 'heavy' ? 560 : 690;
    this.attackHits.clear();
    if (kind === 'light') { this.combo = Math.min(3, this.combo + 1); this.comboTimer = 900; audio.play('hit'); }
    else audio.play(kind === 'special' ? 'special' : 'heavy');
  }
  getAttackDamage() {
    const base = this.attackKind === 'light' ? this.character.damage : this.attackKind === 'heavy' ? this.character.heavy : this.character.special;
    return base + this.damageBonus + (this.attackKind === 'light' ? this.combo * 2 : 0);
  }
  get attacking() { return this.attackTimer > 55; }
  get attackRange() { return this.attackKind === 'special' ? 118 : this.attackKind === 'heavy' ? 75 : 60; }
  takeDamage(amount) {
    if (this.invulnerable > 0 || !this.alive) return false;
    this.hp = Math.max(0, this.hp - amount); this.invulnerable = 760; this.damageFlash = 190; this.vx = -this.facing * 4.2; this.vy = -3.3;
    if (this.hp <= 0) this.dead = true;
    return true;
  }
  heal(amount) { this.hp = Math.min(this.maxHp, this.hp + amount); }
}
