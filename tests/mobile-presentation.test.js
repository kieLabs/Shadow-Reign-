import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isTouchDevice, shouldShowOrientationHint, requestFullscreenLandscape } from '../js/device.js';

const read = path => readFile(new URL(path, import.meta.url), 'utf8');

test('touch control layer contains movement and every combat action button', async () => {
  const html = await read('../index.html');
  for (const action of ['left', 'right', 'jump', 'light', 'heavy', 'bow', 'dodge', 'special']) {
    assert.match(html, new RegExp(`data-control="${action}"`), `missing ${action} touch control`);
  }
});

test('touch-capable devices are detected even when the primary pointer is fine', () => {
  assert.equal(isTouchDevice({ maxTouchPoints: 5, coarsePointer: false }), true);
  assert.equal(isTouchDevice({ maxTouchPoints: 0, coarsePointer: true }), true);
  assert.equal(isTouchDevice({ maxTouchPoints: 0, coarsePointer: false }), false);
});

test('rotate hint appears only during touch gameplay in portrait orientation', () => {
  assert.equal(shouldShowOrientationHint({ touchDevice: true, gameActive: true, portrait: true }), true);
  assert.equal(shouldShowOrientationHint({ touchDevice: true, gameActive: false, portrait: true }), false);
  assert.equal(shouldShowOrientationHint({ touchDevice: true, gameActive: true, portrait: false }), false);
  assert.equal(shouldShowOrientationHint({ touchDevice: false, gameActive: true, portrait: true }), false);
});

test('fullscreen is requested before landscape orientation is locked', async () => {
  const calls = [];
  const doc = { fullscreenElement: null };
  const element = {
    ownerDocument: doc,
    async requestFullscreen() { calls.push('fullscreen'); doc.fullscreenElement = this; }
  };
  const orientation = { async lock(mode) { calls.push(`orientation:${mode}`); } };
  const result = await requestFullscreenLandscape({ element, orientation, enabled: true });
  assert.deepEqual(calls, ['fullscreen', 'orientation:landscape']);
  assert.deepEqual(result, { fullscreen: true, landscape: true });
});

test('fullscreen and orientation failures are handled without breaking gameplay', async () => {
  const element = { ownerDocument: {}, async requestFullscreen() { throw new Error('denied'); } };
  const orientation = { async lock() { throw new Error('unsupported'); } };
  const result = await requestFullscreenLandscape({ element, orientation, enabled: true });
  assert.deepEqual(result, { fullscreen: false, landscape: false });
});

test('direction buttons feed the player left and right movement states', async () => {
  const controls = await read('../js/controls.js');
  assert.match(controls, /left:\s*\['a',\s*'arrowleft',\s*'left'\]/);
  assert.match(controls, /right:\s*\['d',\s*'arrowright',\s*'right'\]/);
});

test('game start requests immersive mode from the Begin Mission user gesture', async () => {
  const main = await read('../js/main.js');
  assert.match(main, /case 'intro-start':\s*void enterGameFullscreen\(\);\s*ui\.beginDialogue\(\)/);
  assert.match(main, /orientation:\s*globalThis\.screen\?\.orientation/);
});

test('mobile controls are not hidden solely because a device reports a fine pointer', async () => {
  const css = await read('../css/mobile.css');
  assert.match(css, /body\.touch-device\s+#touch-controls:not\(\.hidden\)/);
  assert.doesNotMatch(css, /@media\s*\(pointer:\s*fine\)[^{]*\{\s*#touch-controls\s*\{\s*display:\s*none\s*!important/s);
});
