import { useEffect } from 'react';

/**
 * Keeps the phone's screen on while `active` is true (the Screen Wake Lock API).
 *
 * The game is played by watching and listening, often with no touch for a minute while a line is narrated,
 * so without this Android dims and locks the screen mid-mission.
 * The browser drops the lock whenever the page is hidden, so it is taken again when the page comes back.
 * If a request is refused (battery saver, or a browser that wants a tap first), the next tap tries again.
 * Browsers without the API simply keep their normal screen timeout.
 */
export function useScreenWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;

    let lock: WakeLockSentinel | null = null;
    let pending = false;
    let stopped = false;

    const acquire = async () => {
      if (stopped || pending || lock || document.visibilityState !== 'visible') return;
      pending = true;
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        if (stopped) {
          sentinel.release().catch(() => {});
          return;
        }
        lock = sentinel;
        sentinel.addEventListener('release', () => {
          if (lock === sentinel) lock = null;
        });
      } catch {
        // Refused for now; the next tap or return to the page tries again.
      } finally {
        pending = false;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') acquire();
    };

    acquire();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointerdown', acquire, true);

    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointerdown', acquire, true);
      lock?.release().catch(() => {});
      lock = null;
    };
  }, [active]);
}
