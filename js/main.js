import { CHAPTERS, CHARACTERS, availableCharacters } from './data.js';
import { Controls } from './controls.js';
import { AudioDirector } from './audio.js';
import { GameRenderer } from './engine.js';
import { Player } from './player.js';
import { Enemy } from './enemies.js';
import { Boss } from './bosses.js';
import { buildLevel } from './levels.js';
import { resolveCombat, updateFloaters } from './combat.js';
import { loadSave, saveGame, resetSave, completeChapter, isChapterUnlocked } from './save.js';
import { MissionState } from './missions.js';
import { GameUI } from './ui.js';
import { StoryDirector } from './story.js';
import { isTouchDevice, shouldShowOrientationHint, requestFullscreenLandscape } from './device.js';

const canvas = document.getElementById('game-canvas');
const touchDevice = isTouchDevice({
  maxTouchPoints: navigator.maxTouchPoints || 0,
  coarsePointer: window.matchMedia?.('(pointer: coarse)').matches || false,
  hasTouchEvent: 'ontouchstart' in window
});
if (touchDevice) document.body.classList.add('touch-device');
const renderer = new GameRenderer(canvas);
const controls = new Controls();
const audio = new AudioDirector();
const ui = new GameUI();
let save = loadSave();
let story = new StoryDirector(ui, () => save.language);
let screen = 'menu';
let chapter = CHAPTERS[0], level = null, player = null, enemies = [], boss = null, mission = null;
let floaters = [], lastFrame = 0, currentBossVisible = false, resultTimer = 0, challengeMode = false;
let challengeWave = 0, challengeWaveKills = 0, challengeScore = 0;
let toastCooldown = 0;

function persist() { saveGame(save); }
function syncOrientationHint() {
  const portrait = window.matchMedia?.('(orientation: portrait)').matches || false;
  const gameActive = ['game', 'pause'].includes(screen);
  const hint = document.getElementById('orientation-hint');
  hint.classList.toggle('active', shouldShowOrientationHint({ touchDevice, gameActive, portrait }));
}
async function enterGameFullscreen() {
  if (!touchDevice) return;
  await requestFullscreenLandscape({
    element: document.documentElement,
    orientation: globalThis.screen?.orientation,
    enabled: true
  });
  syncOrientationHint();
}
function exitGameFullscreen() {
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  if ((document.fullscreenElement || document.webkitFullscreenElement) && typeof exit === 'function') {
    try { const result = exit.call(document); result?.catch?.(() => {}); } catch { /* optional browser feature */ }
  }
}
function showMenu() { story.skip(); screen = 'menu'; audio.stopAmbient(); exitGameFullscreen(); ui.showMenu(save); syncOrientationHint(); }
function startChapter(id) {
  const ch = CHAPTERS[id - 1];
  if (!ch || !isChapterUnlocked(id, save.completed)) { ui.showToast('Complete the previous chapter to unlock this one.'); return; }
  const canUse = availableCharacters(save.completed).some(c => c.id === save.selectedCharacter);
  if (!canUse) save.selectedCharacter = 'arin';
  chapter = ch; level = buildLevel(id); level.collectibles.forEach(item => { item.taken = save.collectibles.includes(item.id); }); player = new Player(save.selectedCharacter, save.upgrades);
  enemies = level.enemies.map((e, i) => new Enemy(e, id, i));
  boss = new Boss(ch.bossType, level.bossX, id, difficultyScale());
  mission = new MissionState(ch); mission.damageScale = difficultyScale();
  floaters = []; currentBossVisible = false; challengeMode = false;
  screen = 'intro'; audio.unlock(); audio.stopAmbient();
  ui.showIntro(chapter, save.language, () => {
    ui.hideScreen();
    screen = 'game';
    story.start(chapter.dialogue, () => { screen = 'game'; audio.startAmbient(chapter.id); });
  });
  persist();
}
function startChallenge() {
  if (!save.completed.includes(11)) return;
  chapter = CHAPTERS[10]; level = buildLevel(11); level.collectibles.forEach(item => { item.taken = save.collectibles.includes(item.id); }); level.width = 2500;
  const floor = level.platforms.find(p => p.kind === 'ground'); if (floor) floor.w = level.width;
  player = new Player(save.selectedCharacter, save.upgrades); enemies = [];
  boss = null; mission = new MissionState(chapter); mission.damageScale = difficultyScale();
  floaters = []; currentBossVisible = false; challengeMode = true; challengeWave = 1; challengeWaveKills = 0; challengeScore = 0;
  spawnChallengeWave(); screen = 'game'; audio.unlock(); audio.startAmbient(11);
  ui.hideScreen(); ui.showToast('CHALLENGE MODE · WAVE 1'); syncOrientationHint();
}
function spawnChallengeWave() {
  const count = 3 + challengeWave * 2;
  for (let i = 0; i < count; i++) {
    const type = ['guard', 'archer', 'elite'][(i + challengeWave) % 3];
    enemies.push(new Enemy({ x: 520 + i * 190, type, hp: 54 + challengeWave * 18, damage: 10 + challengeWave * 2 }, 11, i));
  }
}
function difficultyScale() { return save.difficulty === 'story' ? .78 : save.difficulty === 'veteran' ? 1.35 : 1; }
function finishChapter(won) {
  if (mission.complete || mission.failed) return;
  if (won) {
    mission.complete = true; mission.tick();
    const firstClear = !save.completed.includes(chapter.id);
    mission.shardsEarned = firstClear ? 2 + Math.min(3, Math.floor(chapter.id / 3)) : 0;
    save = completeChapter(save, chapter.id, mission.elapsed);
    save.achievements = [...new Set([...save.achievements, ...mission.achievements, ...missionAchievementIds()])];
    persist(); audio.stopAmbient(); audio.play('victory');
    screen = 'story-result';
    const outro = save.language === 'hi' ? 'अरिन और उसके साथी इस यात्रा से पहले से अधिक मजबूत होकर लौटे।' : chapter.outro;
    story.start([[save.language === 'hi' ? 'वृत्तांत' : 'CHRONICLE', outro]], () => {
      screen = 'result'; ui.showResult(true, chapter, save, chapter.id < 11, { elapsed: mission.elapsed, health: player.hp, shardsEarned: mission.shardsEarned, healthRatio: player.hp / player.maxHp });
    });
  } else {
    mission.failed = true; audio.stopAmbient(); audio.play('defeat'); screen = 'result';
    setTimeout(() => { if (screen === 'result') ui.showResult(false, chapter, save, false, { elapsed: mission.elapsed, health: player.hp }); }, 350);
  }
}
function missionAchievementIds() {
  const ids = [];
  if (mission.kills > 0) ids.push('first_blood');
  if (mission.kills > 1) ids.push('marksman');
  if (boss && !boss.alive) ids.push('boss_slayer');
  return ids;
}
function updateGame(dt) {
  if (!player || screen !== 'game' || story.active) return;
  if (controls.tapped('pause')) { screen = 'pause'; audio.stopAmbient(); ui.showPause(save.language); controls.endFrame(); return; }
  if (controls.tapped('interact') && toastCooldown <= 0) { ui.showToast(save.language === 'hi' ? 'आसपास खोजें और आगे बढ़ें।' : 'Keep moving. Your objective is marked above.'); toastCooldown = 2200; }
  toastCooldown = Math.max(0, toastCooldown - dt);
  mission?.tick();
  mission.hazardCooldown = Math.max(0, mission.hazardCooldown - dt);
  player.update(controls, level, dt, audio, null, mission.damageScale);
  enemies.forEach(e => e.update(player, dt, level));
  for (const item of level.collectibles || []) {
    if (!item.taken && !save.collectibles.includes(item.id) && Math.abs((player.x + player.w / 2) - item.x) < 30 && Math.abs((player.y + player.h / 2) - item.y) < 42) {
      item.taken = true; save.collectibles.push(item.id); save.shards += 1; mission.collectibles++;
      if (save.collectibles.length >= 10 && !save.achievements.includes('treasure_hunter')) save.achievements.push('treasure_hunter');
      persist(); audio.play('special'); ui.showToast(save.language === 'hi' ? 'संग्रहित क्रिस्टल +1 शार्ड' : 'RELIC CRYSTAL · +1 SHARD');
    }
  }
  if (mission.hazardCooldown <= 0) {
    const hazard = (level.hazards || []).find(h => player.x + player.w > h.x && player.x < h.x + h.w && player.y + player.h > h.y && player.y < h.y + h.h);
    if (hazard && player.takeDamage(hazard.damage * mission.damageScale)) { mission.hazardCooldown = 1050; audio.play('hurt'); floaters.push({ x: player.x, y: player.y - 5, text: 'HAZARD', life: 650, color: '#ffb27e' }); }
  }

  if (!challengeMode && boss && player.x >= level.bossX - 480) {
    currentBossVisible = true;
    if (!mission.bossIntroShown) {
      mission.bossIntroShown = true;
      story.start([[chapter.boss, chapter.bossIntro]], () => { screen = 'game'; });
    }
    boss.update(player, dt, level);
  }
  const combat = resolveCombat(player, enemies, challengeMode ? null : (currentBossVisible ? boss : null), level, floaters, audio, mission);
  floaters = updateFloaters(floaters, dt);

  if (challengeMode) {
    const deadThisFrame = enemies.filter(e => !e.alive).length;
    challengeWaveKills += deadThisFrame;
    challengeScore += deadThisFrame * 100;
    enemies = enemies.filter(e => e.alive);
    if (!enemies.length) {
      if (challengeWave >= 5) {
        save.challengeBest = Math.max(save.challengeBest, challengeScore); persist(); screen = 'result'; audio.stopAmbient(); audio.play('victory');
        document.getElementById('hud').classList.add('hidden'); document.getElementById('touch-controls').classList.add('hidden');
        ui.showScreen(`<section class="result-card"><span class="eyebrow">GAMERKIE CHALLENGE</span><h2>FIVE WAVES SURVIVED</h2><h3>THE LAST STAND</h3><p>Your defence score is ${challengeScore}. Your best score on this device is ${save.challengeBest}.</p><div class="result-actions"><button class="primary" data-action="challenge">PLAY AGAIN</button><button class="secondary" data-action="menu">MAIN MENU</button></div></section>`);
      } else { challengeWave++; challengeWaveKills = 0; spawnChallengeWave(); ui.showToast(`WAVE ${challengeWave} · INCOMING`); }
    }
    if (!player.alive) finishChallenge(false);
    if (screen === 'game') ui.showHud(chapter, player, null, false, `CHALLENGE MODE · WAVE ${challengeWave}/5 · SCORE ${challengeScore}`, save);
  } else {
    enemies = enemies.filter(e => e.alive);
    if (combat.bossDefeated) finishChapter(true);
    if (combat.playerDefeated) finishChapter(false);
    const objective = save.language === 'hi' ? 'बॉस तक पहुँचें और उसे हराएँ।' : (currentBossVisible ? `Defeat ${chapter.boss}.` : chapter.objective);
    if (screen === 'game') ui.showHud(chapter, player, boss, currentBossVisible, objective, save);
  }
  controls.endFrame();
}
function finishChallenge(won) {
  if (screen !== 'game') return;
  screen = 'result'; audio.stopAmbient(); audio.play(won ? 'victory' : 'defeat');
  document.getElementById('hud').classList.add('hidden'); document.getElementById('touch-controls').classList.add('hidden');
  ui.showScreen(`<section class="result-card"><span class="eyebrow">GAMERKIE CHALLENGE</span><h2>${won ? 'FIVE WAVES SURVIVED' : 'DEFENCE BROKEN'}</h2><p>Score: ${challengeScore} · Wave: ${challengeWave}/5</p><div class="result-actions"><button class="primary" data-action="challenge">TRY AGAIN</button><button class="secondary" data-action="menu">MAIN MENU</button></div></section>`);
}
function buyUpgrade(key) {
  const cost = 2 + save.upgrades[key] * 2;
  if (save.shards < cost || save.upgrades[key] >= 5) { ui.showToast(save.language === 'hi' ? 'पर्याप्त शार्ड नहीं हैं।' : 'Not enough shards.'); return; }
  save.shards -= cost; save.upgrades[key]++; persist(); ui.showUpgrades(save);
}
function showAchievements() {
  const cards = CHAPTERS.length;
  const markup = [
    ['first_blood','FIRST SPARK','Defeat your first enemy.'], ['marksman','TRUE AIM','Hit an enemy with an arrow.'], ['boss_slayer','GIANT FALLEN','Defeat a chapter boss.'], ['treasure_hunter','RELIC HUNTER','Collect 10 relic crystals.'], ['allies','ALLIES OF ELDORIA','Unlock Kael, Ryden and Toran.'], ['full_campaign','AURELIA RESTORED','Complete all 11 chapters.']
  ].map(([id, name, desc]) => `<div class="achievement-row ${save.achievements.includes(id) ? 'earned' : ''}"><b>${save.achievements.includes(id) ? '✦' : '◇'}</b><div><strong>${name}</strong><small>${desc}</small></div><em>${save.achievements.includes(id) ? 'UNLOCKED' : 'INCOMPLETE'}</em></div>`).join('');
  ui.showScreen(`<section class="panel compact"><header><div><span class="eyebrow">${save.completed.length}/${cards} CHAPTERS CLEARED</span><h2>ACHIEVEMENTS</h2></div><button class="icon-button" data-action="menu">✕</button></header>${markup}<footer><button class="secondary" data-action="menu">BACK</button></footer></section>`);
}

ui.onAction = (action, button) => {
  audio.unlock(); audio.play('click');
  const id = button?.dataset?.id;
  switch (action) {
    case 'new':
      if (save.completed.length && !confirm('Start a new journey? Your current campaign save will be replaced.')) return;
      save = resetSave(); persist(); startChapter(1); break;
    case 'continue': {
      let next = 1; while (save.completed.includes(next) && next <= 11) next++;
      if (next > 11) { ui.showChapters(save); } else startChapter(next); break;
    }
    case 'chapters': ui.showChapters(save); break;
    case 'play-chapter': startChapter(Number(id)); break;
    case 'characters': ui.showCharacters(save); break;
    case 'select-character':
      if (availableCharacters(save.completed).some(c => c.id === id)) { save.selectedCharacter = id; persist(); ui.showCharacters(save); } break;
    case 'upgrades': ui.showUpgrades(save); break;
    case 'upgrade': buyUpgrade(id); break;
    case 'settings': ui.showSettings(save, audio.enabled); break;
    case 'language': save.language = id === 'hi' ? 'hi' : 'en'; persist(); ui.showSettings(save, audio.enabled); break;
    case 'difficulty': save.difficulty = ['story','normal','veteran'].includes(id) ? id : 'normal'; persist(); ui.showSettings(save, audio.enabled); break;
    case 'sound': audio.setEnabled(!audio.enabled); ui.showSettings(save, audio.enabled); break;
    case 'how': ui.showHow(save); break;
    case 'menu': showMenu(); break;
    case 'intro-start': void enterGameFullscreen(); ui.beginDialogue(); break;
    case 'dialogue-next': story.next(); break;
    case 'resume': void enterGameFullscreen(); screen = 'game'; audio.startAmbient(chapter.id); ui.hideScreen(); syncOrientationHint(); break;
    case 'pause':
      if (story.active) story.skip(); else if (screen === 'game') { screen = 'pause'; audio.stopAmbient(); ui.showPause(save.language); syncOrientationHint(); }
      break;
    case 'restart': void enterGameFullscreen(); startChapter(chapter.id); break;
    case 'retry':
      if (mission?.complete) ui.showChapters(save); else { void enterGameFullscreen(); startChapter(chapter.id); } break;
    case 'next': void enterGameFullscreen(); startChapter(chapter.id + 1); break;
    case 'challenge': void enterGameFullscreen(); startChallenge(); break;
    case 'achievements': showAchievements(); break;
    default: break;
  }
};

function frame(now) {
  const dt = Math.min(40, now - (lastFrame || now)); lastFrame = now;
  if (level && player && ['game','pause','result','story-result'].includes(screen)) renderer.draw(level, player, enemies, boss, now, floaters, player.damageFlash > 0 ? 2.2 : 0);
  if (screen === 'game') updateGame(dt);
  if (story.active) { if (controls.tapped('pause')) story.skip(); controls.endFrame(); }
  else if (screen !== 'game') controls.endFrame();
  requestAnimationFrame(frame);
}

// Initial screen and device orientation hint.
showMenu();
syncOrientationHint();
window.addEventListener('resize', syncOrientationHint);
window.addEventListener('orientationchange', () => setTimeout(syncOrientationHint, 150));
document.addEventListener('fullscreenchange', syncOrientationHint);
document.addEventListener('webkitfullscreenchange', syncOrientationHint);
requestAnimationFrame(frame);

// Make a clean fallback on storage-restricted/private browsing contexts.
window.addEventListener('error', e => { console.error('Shadow Reign runtime error:', e.message); ui.showToast('A game error occurred. Refresh the page to restart.'); });
