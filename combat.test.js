import test from 'node:test';
import assert from 'node:assert/strict';
import { Player } from '../js/player.js';
import { Enemy } from '../js/enemies.js';
import { Boss } from '../js/bosses.js';
import { resolveCombat } from '../js/combat.js';
import { buildLevel } from '../js/levels.js';
import { MissionState } from '../js/missions.js';

const audio = { play() {} };

test('a forward light strike damages an enemy once per swing', () => {
  const level = buildLevel(1);
  const player = new Player('arin'); player.x = 100; player.y = 400; player.facing = 1;
  const enemy = new Enemy({ x: 150, type: 'stalker', hp: 70, damage: 8 }, 1);
  const mission = new MissionState(level.chapter);
  player.attack('light', audio);
  resolveCombat(player, [enemy], null, level, [], audio, mission);
  const afterFirstHit = enemy.hp;
  resolveCombat(player, [enemy], null, level, [], audio, mission);
  assert.equal(afterFirstHit, 50);
  assert.equal(enemy.hp, afterFirstHit);
  assert.equal(mission.kills, 0);
});

test('a lethal strike records a kill and first-blood achievement', () => {
  const level = buildLevel(1);
  const player = new Player('arin'); player.x = 100; player.y = 400; player.facing = 1;
  const enemy = new Enemy({ x: 150, type: 'stalker', hp: 10, damage: 8 }, 1);
  const mission = new MissionState(level.chapter);
  player.attack('heavy', audio);
  resolveCombat(player, [enemy], null, level, [], audio, mission);
  assert.equal(enemy.alive, false);
  assert.equal(mission.kills, 1);
  assert.ok(mission.achievements.includes('first_blood'));
});

test('boss combat phases escalate as its health falls', () => {
  const level = buildLevel(10);
  const player = new Player('arin'); player.x = 100; player.y = 400;
  const boss = new Boss('malgrav', 180, 10, 1);
  boss.hp = boss.maxHp * .3;
  boss.update(player, 16, level);
  assert.equal(boss.phase, 3);
});
