const W = 960, H = 540;

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.cameraX = 0; this.particles = [];
    this.resize(); addEventListener('resize', () => this.resize());
  }
  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(W * ratio); this.canvas.height = Math.floor(H * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  draw(level, player, enemies, boss, elapsed, floaters, screenShake = 0) {
    const ctx = this.ctx, chapter = level.chapter;
    this.cameraX = Math.max(0, Math.min(level.width - W, player.x - W * .34));
    ctx.clearRect(0, 0, W, H);
    const shake = screenShake > 0 ? (Math.random() - .5) * screenShake : 0;
    ctx.save(); ctx.translate(-this.cameraX + shake, shake * .25);
    this.drawBackdrop(ctx, chapter, elapsed, this.cameraX);
    this.drawPlatforms(ctx, level, elapsed);
    this.drawHazards(ctx, level, elapsed);
    this.drawCollectibles(ctx, level, elapsed);
    this.drawDecor(ctx, chapter, level);
    enemies.forEach(e => this.drawEnemy(ctx, e, elapsed));
    if (boss?.alive) this.drawBoss(ctx, boss, elapsed);
    this.drawPlayer(ctx, player, elapsed);
    this.drawEffects(ctx, player, enemies, boss, floaters);
    ctx.restore();
    this.drawVignette(ctx, chapter);
  }
  drawBackdrop(ctx, chapter, time, camera) {
    const grad = ctx.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, chapter.sky[0]); grad.addColorStop(1, chapter.sky[1]); ctx.fillStyle = grad; ctx.fillRect(camera, 0, W, H);
    const far = chapter.id === 1 || chapter.id === 3 ? '#333846' : '#1d3035';
    for (let i = 0; i < 8; i++) {
      const x = camera - 180 + i * 260 - camera * .18;
      const h = 120 + (i * 53 % 120);
      ctx.fillStyle = far; ctx.beginPath(); ctx.moveTo(x, 430); ctx.lineTo(x + 100, 430 - h); ctx.lineTo(x + 210, 430); ctx.fill();
    }
    // A second parallax layer gives every region a distinct silhouette without external art files.
    for (let i = 0; i < 12; i++) {
      const x = camera - 90 + i * 170 - camera * .38;
      const h = 45 + (i * 29 % 76);
      ctx.fillStyle = `rgba(12,18,28,${.22 + (i % 3) * .06})`;
      if (chapter.id === 2) { ctx.fillRect(x + 35, 365 - h, 24, h); ctx.beginPath(); ctx.arc(x + 47, 355 - h, 46, 0, Math.PI * 2); ctx.fill(); }
      else if (chapter.id === 7) { ctx.beginPath(); ctx.moveTo(x, 430); ctx.lineTo(x + 60, 365 - h); ctx.lineTo(x + 120, 430); ctx.fill(); }
      else { ctx.fillRect(x, 405 - h, 120, h + 25); }
    }
    const glow = ctx.createRadialGradient(camera + 720, 120, 5, camera + 720, 120, 280); glow.addColorStop(0, `${chapter.accent}33`); glow.addColorStop(1, `${chapter.accent}00`); ctx.fillStyle = glow; ctx.fillRect(camera, 0, W, H);
    ctx.globalAlpha = .28;
    for (let i = 0; i < 25; i++) { const x = camera + ((i * 137 + time * .025) % W), y = 60 + ((i * 71 + time * .012) % 330); ctx.fillStyle = chapter.accent; ctx.fillRect(x, y, 2, 2); }
    ctx.globalAlpha = 1;
  }
  drawPlatforms(ctx, level) {
    for (const p of level.platforms) {
      if (p.kind === 'ground') {
        ctx.fillStyle = level.chapter.ground; ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#171a23'; ctx.fillRect(p.x, p.y + 9, p.w, 7);
        for (let x = p.x; x < p.x + p.w; x += 46) { ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(x, p.y + 28, 23, 2); }
        ctx.fillStyle = level.chapter.accent; ctx.globalAlpha = .38; ctx.fillRect(p.x, p.y, p.w, 2); ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = '#30333d'; ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = level.chapter.accent; ctx.globalAlpha = .68; ctx.fillRect(p.x, p.y, p.w, 3); ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(p.x + 8, p.y + 7, p.w - 16, 2);
      }
    }
    for (const pit of level.pits) { ctx.fillStyle = '#11131c'; ctx.fillRect(pit.x, pit.y + 2, pit.w, 25); ctx.fillStyle = '#e2a15c'; ctx.globalAlpha = .25; ctx.fillRect(pit.x + 8, pit.y + 5, pit.w - 16, 2); ctx.globalAlpha = 1; }
  }
  drawHazards(ctx, level, time) {
    const palette = { sweep: '#d7b16c', thorns: '#80c18c', forge: '#e58c59', debris: '#cd806e', tide: '#7bc5d9', spike: '#d2a36a', surge: '#8ab7da', void: '#b58edc', fireline: '#f18462', shadowPulse: '#c37bb0', trialBeam: '#e7cf9d' };
    for (const h of level.hazards || []) {
      ctx.save(); ctx.translate(h.x, h.y); ctx.fillStyle = palette[h.type] || level.chapter.accent;
      ctx.globalAlpha = .42 + Math.sin(time * .009 + h.x) * .14; ctx.fillRect(0, 10, h.w, 5);
      ctx.globalAlpha = .9;
      if (['thorns','spike','trialBeam'].includes(h.type)) {
        for (let i = 0; i < h.w; i += 12) { ctx.beginPath(); ctx.moveTo(i, 12); ctx.lineTo(i + 6, -5 - Math.sin(time * .006 + i) * 2); ctx.lineTo(i + 12, 12); ctx.fill(); }
      } else if (['forge','fireline','shadowPulse','surge'].includes(h.type)) {
        for (let i = 7; i < h.w; i += 18) { const rise = Math.sin(time * .012 + i) * 5; ctx.fillRect(i, 4 - rise, 4, 9 + rise); }
      } else {
        ctx.strokeStyle = palette[h.type] || level.chapter.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 8); ctx.lineTo(h.w * .25, 2); ctx.lineTo(h.w * .5, 9); ctx.lineTo(h.w * .75, 1); ctx.lineTo(h.w, 8); ctx.stroke();
      }
      ctx.restore();
    }
  }
  drawCollectibles(ctx, level, time) {
    for (const item of level.collectibles || []) {
      if (item.taken) continue;
      const pulse = 1 + Math.sin(time * .008 + item.x) * .12;
      ctx.save(); ctx.translate(item.x, item.y); ctx.scale(pulse, pulse);
      ctx.shadowColor = '#f4d38b'; ctx.shadowBlur = 18; ctx.fillStyle = '#f1d18a';
      ctx.beginPath(); ctx.moveTo(0, -11); ctx.lineTo(8, 0); ctx.lineTo(0, 11); ctx.lineTo(-8, 0); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = '#fff4c9'; ctx.fillRect(-1, -5, 2, 10); ctx.restore();
    }
  }
  drawDecor(ctx, chapter, level) {
    for (let i = 0; i < 17; i++) {
      const x = 145 + i * 153 + ((chapter.id * 19 + i * 13) % 50);
      ctx.save(); ctx.translate(x, 458);
      if (chapter.id === 2 || chapter.id === 6) {
        ctx.fillStyle = '#263f36'; ctx.fillRect(-7, -80, 14, 80); ctx.fillStyle = '#2d5944'; ctx.beginPath(); ctx.arc(0, -90, 40 + (i % 3) * 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#52775a'; ctx.beginPath(); ctx.arc(-15, -104, 16, 0, Math.PI * 2); ctx.fill();
      } else if (chapter.id === 7) {
        ctx.fillStyle = '#34444e'; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-8, -75 - i % 3 * 12); ctx.lineTo(18, 0); ctx.fill(); ctx.fillStyle = '#7d6c67'; ctx.fillRect(-27, -3, 53, 5);
      } else {
        ctx.fillStyle = '#292e3a'; ctx.fillRect(-19, -74 - i % 4 * 14, 38, 74); ctx.fillStyle = '#555260'; ctx.fillRect(-25, -80 - i % 4 * 14, 50, 9); ctx.fillStyle = chapter.accent; ctx.globalAlpha = .4; ctx.fillRect(-2, -48, 4, 20); ctx.globalAlpha = 1;
      }
      ctx.restore();
    }
  }
  drawPlayer(ctx, p, time) {
    if (p.invulnerable > 0 && Math.floor(time / 65) % 2) return;
    const x = p.x, y = p.y, run = Math.sin(p.anim) * 4, face = p.facing;
    ctx.save(); ctx.translate(x + p.w / 2, y); ctx.scale(face, 1);
    // Cape and silhouette
    ctx.fillStyle = p.character.cape; ctx.beginPath(); ctx.moveTo(-7, 18); ctx.lineTo(-23 - Math.abs(run), 34); ctx.lineTo(-13, 51); ctx.lineTo(2, 45); ctx.closePath(); ctx.fill();
    ctx.fillStyle = p.damageFlash > 0 ? '#fff' : p.character.color;
    ctx.fillRect(-12, 19, 24, 25);
    ctx.fillStyle = '#d9c29c'; ctx.fillRect(-8, 3, 17, 17);
    ctx.fillStyle = '#252b38'; ctx.fillRect(-10, 0, 20, 7); ctx.fillRect(-8, -3, 16, 5);
    ctx.fillStyle = '#f1d39a'; ctx.fillRect(1, 10, 3, 3);
    ctx.fillStyle = '#313847'; ctx.fillRect(-12, 42, 10, 14 + run); ctx.fillRect(2, 42, 10, 14 - run);
    ctx.fillStyle = '#b6c5cd'; ctx.fillRect(-12, 55 + run, 13, 4); ctx.fillRect(1, 55 - run, 13, 4);
    ctx.strokeStyle = '#dce6e7'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
    const swing = p.attacking ? (p.attackKind === 'heavy' ? -0.9 : -0.15) : Math.sin(time * .007) * .08;
    ctx.moveTo(7, 28); ctx.lineTo(23 + (p.attacking ? 19 : 0), 23 + swing * 24); ctx.stroke();
    ctx.strokeStyle = '#74533b'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(17, 30); ctx.lineTo(24, 33); ctx.stroke();
    if (p.attackKind === 'special' && p.attackTimer > 0) { ctx.strokeStyle = '#8fe5ff'; ctx.lineWidth = 3; ctx.globalAlpha = .65; ctx.beginPath(); ctx.arc(0, 29, 63 + Math.sin(time * .02) * 7, -1.2, 1.2); ctx.stroke(); }
    ctx.restore();
    for (const a of p.arrows) { ctx.strokeStyle = '#e9d5a4'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x - Math.sign(a.vx) * 13, a.y); ctx.stroke(); }
  }
  drawEnemy(ctx, e, time) {
    const x = e.x, y = e.y, look = e.look;
    ctx.save(); ctx.translate(x + e.w / 2, y); ctx.scale(e.facing, 1);
    ctx.fillStyle = e.hitFlash > 0 ? '#fff' : look.color; ctx.fillRect(-e.w * .34, 18, e.w * .68, e.h * .58);
    ctx.fillStyle = look.accent; ctx.fillRect(-e.w * .3, 4, e.w * .6, 17); ctx.fillRect(-e.w * .36, 22, e.w * .72, 6);
    ctx.fillStyle = '#202431'; ctx.fillRect(-e.w * .35, e.h * .75, e.w * .25, e.h * .25); ctx.fillRect(e.w * .1, e.h * .75, e.w * .25, e.h * .25);
    ctx.fillStyle = '#f5d99d'; ctx.fillRect(4, 10, 4, 3);
    if (look.ranged) { ctx.strokeStyle = '#b9c6cf'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(18, 26, 12, -1.2, 1.2); ctx.stroke(); }
    if (e.attackFlash > 0) { ctx.strokeStyle = '#ffb0a0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(8, 26); ctx.lineTo(30, 16 + Math.sin(time * .03) * 8); ctx.stroke(); }
    ctx.restore();
    if (e.hp < e.maxHp) this.drawBar(ctx, e.x - 2, e.y - 8, e.w + 4, 4, e.hp / e.maxHp, '#d66f72');
    for (const p of e.projectiles) { ctx.fillStyle = '#e7b2a4'; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill(); }
  }
  drawBoss(ctx, b, time) {
    ctx.save(); ctx.translate(b.x + b.w / 2, b.y); ctx.scale(b.facing, 1);
    ctx.fillStyle = b.hitFlash > 0 ? '#fff' : b.color; ctx.fillRect(-b.w * .37, 24, b.w * .74, b.h * .63);
    ctx.fillStyle = '#252a37'; ctx.fillRect(-b.w * .32, 0, b.w * .64, 31); ctx.fillRect(-b.w * .45, 42, b.w * .9, 10);
    ctx.fillStyle = '#dac59b'; ctx.fillRect(-b.w * .2, 7, b.w * .4, 10); ctx.fillStyle = '#f8d6a0'; ctx.fillRect(8, 11, 7, 5);
    ctx.fillStyle = '#303646'; ctx.fillRect(-b.w * .36, b.h * .78, b.w * .27, b.h * .22); ctx.fillRect(b.w * .09, b.h * .78, b.w * .27, b.h * .22);
    ctx.strokeStyle = '#e4d7c4'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(18, 46); ctx.lineTo(42 + Math.sin(time * .01) * 5, 18); ctx.stroke();
    if (b.phase > 1) { ctx.strokeStyle = b.phase === 3 ? '#f39bce' : '#9fdaf5'; ctx.lineWidth = 3; ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(0, 50, b.w * .58 + Math.sin(time * .01) * 4, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
    for (const p of b.projectiles) { ctx.fillStyle = '#d8a8e7'; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius || 9, 0, Math.PI * 2); ctx.fill(); }
  }
  drawEffects(ctx, player, enemies, boss, floaters) {
    for (const f of floaters) { ctx.globalAlpha = Math.min(1, f.life / 250); ctx.fillStyle = f.color; ctx.font = 'bold 15px system-ui'; ctx.fillText(f.text, f.x, f.y); }
    ctx.globalAlpha = 1;
    if (player.dodgeTimer > 0) { ctx.strokeStyle = '#b7e5ff'; ctx.globalAlpha = .5; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(player.x + 16, player.y + 30, 25, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; }
  }
  drawBar(ctx, x, y, w, h, ratio, color) { ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(x, y, w, h); ctx.fillStyle = color; ctx.fillRect(x, y, w * Math.max(0, ratio), h); }
  drawVignette(ctx, chapter) {
    const g = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 630); g.addColorStop(.65, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.36)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
}
