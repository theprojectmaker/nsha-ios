import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { AppState } from 'react-native';

// Pulls over-the-air updates. iOS keeps the app alive in the background for a long time, so a
// check only at launch would rarely run: also check every time the app comes back to the front.
export function useOtaUpdates() {
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;
    let ready = false;
    let busy = false;
    let last = 0;
    const openedAt = Date.now();
    const check = async () => {
      if (ready) { Updates.reloadAsync().catch(() => {}); return; }
      if (busy || Date.now() - last < 60_000) return;
      busy = true;
      last = Date.now();
      try {
        const r = await Updates.checkForUpdateAsync();
        if (r.isAvailable) ready = (await Updates.fetchUpdateAsync()).isNew;
        // A fresh install shows its built-in code first; if newer code arrives in the first
        // few seconds, switch to it right away instead of waiting for the next open.
        if (ready && Date.now() - openedAt < 8000) { Updates.reloadAsync().catch(() => {}); return; }
      } catch {
        // offline: try again next time
      }
      busy = false;
    };
    check();
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active') check(); });
    return () => sub.remove();
  }, []);
}
