import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS, CHARACTERS, availableCharacters } from '../js/data.js';
import { buildLevel } from '../js/levels.js';
import { completeChapter, isChapterUnlocked, loadSave, saveGame } from '../js/save.js';

test('campaign contains eleven ordered chapters with distinct boss encounters', () => {
  assert.equal(CHAPTERS.length, 11);
  assert.deepEqual(CHAPTERS.map(c => c.id), Array.from({ length: 11 }, (_, i) => i + 1));
  assert.equal(new Set(CHAPTERS.map(c => c.bossType)).size, 11);
  assert.ok(CHAPTERS.every(c => c.objective && c.intro && c.outro && c.dialogue.length >= 2));
});

test('all playable characters have valid progression gates and combat stats', () => {
  assert.deepEqual(Object.keys(CHARACTERS), ['arin', 'kael', 'ryden', 'toran']);
  for (const character of Object.values(CHARACTERS)) {
    assert.ok(character.hp > 0 && character.damage > 0 && character.jump > 0);
    assert.ok(character.unlockedAt >= 1 && character.unlockedAt <= 11);
  }
  assert.deepEqual(availableCharacters([]).map(c => c.id), ['arin']);
  assert.deepEqual(availableCharacters([1, 2, 3]).map(c => c.id), ['arin', 'kael']);
  assert.deepEqual(availableCharacters([1, 2, 3, 4, 5]).map(c => c.id), ['arin', 'kael', 'ryden']);
  assert.deepEqual(availableCharacters([1, 2, 3, 4, 5, 6]).map(c => c.id), ['arin', 'kael', 'ryden', 'toran']);
});

test('chapter unlocks remain sequential and completed chapter can be replayed', () => {
  assert.equal(isChapterUnlocked(1, []), true);
  assert.equal(isChapterUnlocked(2, []), false);
  assert.equal(isChapterUnlocked(2, [1]), true);
  assert.equal(isChapterUnlocked(1, [1]), true);
});

test('completing a chapter records progress, awards shards and campaign achievement', () => {
  const state = loadSave({ getItem: () => null });
  completeChapter(state, 1, 72);
  assert.deepEqual(state.completed, [1]);
  assert.equal(state.shards, 2);
  assert.equal(state.bestTimes[1], 72);
  completeChapter(state, 1, 65);
  assert.equal(state.shards, 2, 'replays must not award duplicate first-clear shards');
  completeChapter(state, 11, 180);
  assert.ok(state.achievements.includes('full_campaign'));
});

test('save adapter tolerates malformed data and persists valid JSON', () => {
  const broken = loadSave({ getItem: () => '{oops' });
  assert.deepEqual(broken.completed, []);
  let stored = null;
  const storage = { setItem: (key, value) => { stored = { key, value }; } };
  assert.equal(saveGame(broken, storage), true);
  assert.equal(JSON.parse(stored.value).selectedCharacter, 'arin');
});

test('every chapter creates a traversable canvas level with boss at the far end', () => {
  for (let id = 1; id <= 11; id++) {
    const level = buildLevel(id);
    assert.ok(level.width >= 1700);
    assert.ok(level.platforms.length >= 8);
    assert.ok(level.bossX > 1000 && level.bossX < level.width);
    assert.ok(level.enemies.length >= 6);
    assert.equal(level.hazards.length, 3);
    assert.equal(level.collectibles.length, 5);
    assert.ok(level.collectibles.every(item => item.x > 0 && item.x < level.width));
  }
});
