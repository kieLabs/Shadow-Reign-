const KEY = 'shadowReignGamerkie.save.v1';
const DEFAULT = Object.freeze({ completed: [], selectedCharacter: 'arin', shards: 0, collectibles: [], upgrades: { health: 0, blade: 0, bow: 0 }, achievements: [], language: 'en', difficulty: 'normal', bestTimes: {}, challengeBest: 0 });

export function loadSave(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT), ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter(Number.isInteger) : [],
      collectibles: Array.isArray(parsed.collectibles) ? parsed.collectibles.filter(x => typeof x === 'string') : [],
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      upgrades: { ...DEFAULT.upgrades, ...(parsed.upgrades || {}) }
    };
  } catch { return structuredClone(DEFAULT); }
}

export function saveGame(state, storage = globalThis.localStorage) {
  try { storage?.setItem(KEY, JSON.stringify(state)); return true; }
  catch { return false; }
}

export function resetSave(storage = globalThis.localStorage) {
  try { storage?.removeItem(KEY); } catch { /* storage may be blocked */ }
  return structuredClone(DEFAULT);
}

export function isChapterUnlocked(chapterId, completed = []) {
  return chapterId === 1 || completed.includes(chapterId - 1) || completed.includes(chapterId);
}

export function completeChapter(state, chapterId, elapsedSeconds = 0) {
  const firstClear = !state.completed.includes(chapterId);
  if (firstClear) state.completed.push(chapterId);
  state.completed.sort((a, b) => a - b);
  if (firstClear) state.shards += 2 + Math.min(3, Math.floor(chapterId / 3));
  state.bestTimes[chapterId] = Math.min(state.bestTimes[chapterId] ?? Infinity, elapsedSeconds);
  if (chapterId === 11 && !state.achievements.includes('full_campaign')) state.achievements.push('full_campaign');
  if ([4, 6, 7].every(id => state.completed.includes(id)) && !state.achievements.includes('allies')) state.achievements.push('allies');
  return state;
}
