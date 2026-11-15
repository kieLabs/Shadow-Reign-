# SHADOW REIGN – GAMERKIE EDITION

**ONE WARRIOR. ONE LOST KINGDOM. AN EPIC JOURNEY.**

An original, self-contained browser fantasy action-adventure built with HTML5 Canvas, CSS and vanilla JavaScript modules. It has no required backend, game engine, paid API, or external game-asset dependency. The visual effects and ambient audio are generated in-browser.

## Included in this release

- 11 sequential story chapters across the fictional continent of Eldoria.
- Original characters: Arin, Kael, Ryden and Toran, unlocked through campaign progress.
- Sword attacks, heavy attacks, bow shots, dodge, special ability, combo feedback and health systems.
- Enemy types with patrol/chase/ranged behaviours and projectile attacks.
- 11 multi-phase boss encounters, with phase changes at health thresholds.
- Cinematic chapter introductions, dialogue sequences, boss entrances and chapter endings.
- English and Hindi UI/story dialogue support.
- Chapter selection, continue, character selection, permanent upgrades, difficulty settings and achievements.
- Local device save using `localStorage`.
- Five-wave challenge mode after the campaign is complete.
- Keyboard and mobile touch controls; phones request fullscreen + landscape when gameplay begins (browser support permitting).
- Static hosting support for GitHub Pages and Blogger iframe embeds.

## Run locally

This is a browser ES-module project. Do not open `index.html` using a `file://` URL. Start a small static server from this folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

Or use the included command:

```bash
npm run serve
```

No `npm install` is required. The tests use Node's built-in test runner:

```bash
npm test
```

## GitHub Pages deployment

1. Create a repository, for example `Shadow-Reign`.
2. Upload the **contents** of this folder (so `index.html` is at the repository root).
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish. The game URL will look like `https://YOUR-USERNAME.github.io/Shadow-Reign/`.

Keep the folder names and capitalization unchanged. GitHub Pages hosting is static; no backend or server configuration is required.

## Blogger iframe embed

Replace the URL with your actual GitHub Pages URL, then paste this into a Blogger HTML view:

```html
<div style="width:100%;max-width:1100px;margin:0 auto;aspect-ratio:16/9;background:#090d15;overflow:hidden;border-radius:12px;">
  <iframe
    src="https://YOUR-USERNAME.github.io/Shadow-Reign/"
    title="Shadow Reign – GamerKie Edition"
    loading="lazy"
    allow="fullscreen; autoplay"
    allowfullscreen
    referrerpolicy="strict-origin-when-cross-origin"
    style="width:100%;height:100%;border:0;display:block;">
  </iframe>
</div>
```

On a touch device, tapping BEGIN MISSION requests fullscreen and landscape orientation. This works where the browser and iframe permit it; otherwise a rotate-device notice appears. The Blogger iframe includes fullscreen permission.

## Controls

| Action | Desktop | Mobile |
|---|---|---|
| Move | A / D or ← / → | Left / right arrow buttons |
| Jump | W / ↑ | JUMP |
| Light attack | J | HIT |
| Heavy attack | K | HEAVY |
| Bow | L | BOW |
| Dodge | SHIFT | DODGE |
| Special | Q | SPECIAL |
| Interact | E | — |
| Pause | ESC | Pause icon at the top | 

On phones/tablets, the mobile controls appear while a mission is active. Tapping **BEGIN MISSION** requests fullscreen and locks landscape when supported. If the browser or Blogger iframe blocks either feature, the game remains usable and shows a rotate-device notice while in portrait mode.

## Save data

Campaign progress, selected character, upgrades, language, difficulty, achievements and best scores are stored in the browser's local storage for the current site origin. Clearing browser/site data or changing the site URL/origin can reset progress. This release does not sync saves between devices.

## Project map

```text
index.html
css/
  style.css
  menu.css
  gameplay.css
  mobile.css
js/
  main.js
  data.js
  engine.js
  player.js
  characters.js
  enemies.js
  combat.js
  bosses.js
  levels.js
  story.js
  missions.js
  controls.js
  audio.js
  save.js
  ui.js
assets/
  characters/ enemies/ bosses/ backgrounds/ environments/
  animations/ effects/ audio/ ui/ logo/
tests/
  game-data.test.js
README.md
package.json
```

`data.js` is the single source of character stats and unlock rules; `characters.js` exposes the small selection helper API. All listed asset subfolders contain notes explaining that the initial build uses original procedural Canvas art and Web Audio tones.

## Scope and honest status

This is a complete playable **independent browser-game release** with a full 11-chapter campaign loop and working core systems. It is not a large-budget AAA production: its current character animation, environments, cinematic sequences and soundtrack are original procedural 2D presentations rather than hand-authored 3D models, motion-capture animation, voice acting or a full orchestral score. The chapters are playable combat-platformer stages with story beats and distinct palettes/mechanics, not a sprawling open world. A device/browser QA pass is still recommended before public launch.

## Copyright and creative direction

All names, regions, story material and game visuals in this project are original fictional content created for this game. No third-party commercial game characters, logos, environments, music or sound files are included.
