/** True when the current browser/device can reasonably use touch controls. */
export function isTouchDevice({ maxTouchPoints = 0, coarsePointer = false, hasTouchEvent = false } = {}) {
  return Number(maxTouchPoints) > 0 || Boolean(coarsePointer) || Boolean(hasTouchEvent);
}

/** Keep the rotate prompt out of menus and desktop layouts. */
export function shouldShowOrientationHint({ touchDevice, gameActive, portrait }) {
  return Boolean(touchDevice && gameActive && portrait);
}

/** Request immersive play after a real user gesture; unsupported APIs fail safely. */
export async function requestFullscreenLandscape({ element, orientation, enabled = true } = {}) {
  if (!enabled) return { fullscreen: false, landscape: false };

  const doc = element?.ownerDocument || globalThis.document;
  let fullscreen = Boolean(doc?.fullscreenElement || doc?.webkitFullscreenElement);
  let landscape = false;
  const request = element?.requestFullscreen || element?.webkitRequestFullscreen;

  if (!fullscreen && typeof request === 'function') {
    try {
      await request.call(element, { navigationUI: 'hide' });
      fullscreen = true;
    } catch {
      // The game must remain playable when fullscreen is denied by the browser or iframe.
    }
  }

  if (typeof orientation?.lock === 'function') {
    try {
      await orientation.lock('landscape');
      landscape = true;
    } catch {
      // iOS and some embedded browsers do not support orientation locking.
    }
  }

  return { fullscreen, landscape };
}
