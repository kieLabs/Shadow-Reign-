import { CHAPTERS } from './data.js';

export function buildLevel(chapterId) {
  const chapter = CHAPTERS[chapterId - 1];
  const platforms = [{ x: 0, y: 458, w: chapter.length, h: 110, kind: 'ground' }];
  const count = 7 + chapterId % 3;
  for (let i = 0; i < count; i++) {
    const x = 260 + i * 285 + ((i * 47 + chapterId * 31) % 75);
    const y = 365 - ((i * 53 + chapterId * 17) % 95);
    const w = 110 + ((i * 31 + chapterId * 19) % 80);
    platforms.push({ x, y, w, h: 18, kind: 'ledge' });
  }
  const pits = [];
  // Scenic hazard strips: they slow the hero but never create an unavoidable fall.
  for (let i = 0; i < 3; i++) pits.push({ x: 520 + i * 690 + chapterId * 13, w: 68 + (i * 11), y: 454 });
  const collectibleStep = (chapter.length - 560) / 4;
  const collectibles = Array.from({ length: 5 }, (_, i) => ({ id: `${chapterId}-${i + 1}`, x: 260 + i * collectibleStep + ((chapterId * 17 + i * 29) % 24), y: 407 - (i % 2) * 32, taken: false }));
  const hazardTypes = ['sweep','thorns','forge','debris','tide','spike','surge','void','fireline','shadowPulse','trialBeam'];
  const hazardType = hazardTypes[chapterId - 1];
  const hazards = [0, 1, 2].map(i => ({ x: 610 + i * 640 + ((chapterId * 23 + i * 17) % 80), y: 438, w: 62 + (i % 2) * 14, h: 22, type: hazardType, damage: 8 + chapterId * 1.1 }));
  const enemyTypes = chapterId < 3 ? ['stalker','archer'] : chapterId < 6 ? ['soldier','guard','archer'] : ['guard','beast','archer','elite'];
  const enemies = [];
  for (let i = 0; i < 6 + Math.min(3, Math.floor(chapterId / 3)); i++) {
    enemies.push({ x: 420 + i * 300 + ((i * 37 + chapterId * 21) % 110), type: enemyTypes[(i + chapterId) % enemyTypes.length], hp: 48 + chapterId * 7, damage: 8 + chapterId * 1.1 });
  }
  return { chapter, platforms, pits, hazards, collectibles, enemies, bossX: chapter.length - 420, width: chapter.length, height: 540 };
}
