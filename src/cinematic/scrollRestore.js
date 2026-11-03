const SCROLL_RESTORE_KEY = "wa-cinematic-scroll-y";

export function saveScrollPosition() {
  try {
    sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY));
  } catch {
    /* sessionStorage unavailable -- not fatal, just skip restore */
  }
}

export function consumeScrollPosition() {
  try {
    const raw = sessionStorage.getItem(SCROLL_RESTORE_KEY);
    if (raw == null) return null;
    sessionStorage.removeItem(SCROLL_RESTORE_KEY);
    return Number(raw);
  } catch {
    return null;
  }
}
