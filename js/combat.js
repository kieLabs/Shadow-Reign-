function overlap(a, b, pad = 0) {
  return a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function resolveCombat(player, enemies, boss, level, floaters, audio, state) {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    if (player.attacking && !player.attackHits.has(enemy)) {
      const reach = player.attackRange;
      const targetX = player.facing > 0 ? enemy.x - (player.x + player.w) : player.x - (enemy.x + enemy.w);
      const vertical = player.y < enemy.y + enemy.h && player.y + player.h > enemy.y;
      if (vertical && targetX < reach && targetX > -14) {
        const damage = player.getAttackDamage(); enemy.takeDamage(damage, player.facing * (player.attackKind === 'heavy' ? 18 : 9));
        player.attackHits.add(enemy); floaters.push({ x: enemy.x, y: enemy.y - 8, text: `-${Math.round(damage)}`, life: 700, color: '#ffe4ad' });
        if (!enemy.alive) { state.kills++; if (!state.achievements.includes('first_blood')) state.achievements.push('first_blood'); }
      }
    }
    for (const arrow of player.arrows) {
      if (!arrow.hit && overlap({ x: arrow.x - 4, y: arrow.y - 3, w: 12, h: 7 }, enemy)) {
        enemy.takeDamage(arrow.damage, Math.sign(arrow.vx) * 6); arrow.hit = true;
        floaters.push({ x: enemy.x, y: enemy.y - 10, text: `-${Math.round(arrow.damage)}`, life: 620, color: '#9be4ff' });
        if (!state.achievements.includes('marksman')) state.achievements.push('marksman');
      }
    }
    if (enemy.attackFlash > 0 && overlap(player, enemy, 3)) {
      if (player.takeDamage(enemy.damage * state.damageScale)) { audio.play('hurt'); floaters.push({ x: player.x, y: player.y - 4, text: 'HIT', life: 500, color: '#ff8989' }); }
    }
    for (const p of enemy.projectiles) {
      if (!p.hit && Math.abs(p.x - (player.x + player.w / 2)) < 22 && Math.abs(p.y - (player.y + 24)) < 34) {
        p.hit = true; if (player.takeDamage(p.damage * state.damageScale)) audio.play('hurt');
      }
    }
  }
  if (boss?.alive) {
    if (player.attacking && !player.attackHits.has(boss)) {
      const reach = player.attackRange + (boss.w - 60) * .35;
      const targetX = player.facing > 0 ? boss.x - (player.x + player.w) : player.x - (boss.x + boss.w);
      if (targetX < reach && targetX > -20 && player.y < boss.y + boss.h && player.y + player.h > boss.y) {
        const damage = player.getAttackDamage() * (player.attackKind === 'special' ? 1.05 : 1);
        boss.takeDamage(damage, player.facing * 6); player.attackHits.add(boss);
        floaters.push({ x: boss.x + boss.w / 2, y: boss.y - 9, text: `-${Math.round(damage)}`, life: 700, color: '#ffe4ad' });
      }
    }
    for (const arrow of player.arrows) {
      if (!arrow.hit && overlap({ x: arrow.x - 4, y: arrow.y - 3, w: 12, h: 7 }, boss)) { boss.takeDamage(arrow.damage, Math.sign(arrow.vx) * 4); arrow.hit = true; }
    }
    if (boss.attackFlash > 0 && overlap(player, boss, 4)) {
      if (player.takeDamage(boss.damage * state.damageScale)) audio.play('hurt');
    }
    for (const p of boss.projectiles) {
      if (!p.hit && Math.abs(p.x - (player.x + player.w / 2)) < (p.radius || 10) + 14 && Math.abs(p.y - (player.y + 26)) < 38) {
        p.hit = true; if (player.takeDamage(p.damage * state.damageScale)) audio.play('hurt');
      }
    }
    if (!boss.alive && !state.achievements.includes('boss_slayer')) state.achievements.push('boss_slayer');
  }
  for (const a of player.arrows) {
    if (!a.hit) {
      const platform = level.platforms.find(p => a.x > p.x && a.x < p.x + p.w && a.y > p.y && a.y < p.y + p.h);
      if (platform) a.hit = true;
    }
  }
  player.arrows = player.arrows.filter(a => !a.hit);
  return { bossDefeated: Boolean(boss && !boss.alive), playerDefeated: !player.alive };
}

export function updateFloaters(floaters, dt) {
  for (const f of floaters) { f.y -= dt * .025; f.life -= dt; }
  return floaters.filter(f => f.life > 0);
}
