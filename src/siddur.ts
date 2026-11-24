import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface Line { h: string; e?: string; n?: 1 }
export interface Part { t: string; ht: string; hs: string; es: string; lines: Line[] }
export interface Service { id: string; label: string; parts: Part[]; missing: string[] }
export interface Book { services: Service[] }
export type Nusach = 'ashkenaz' | 'sefard' | 'edot';

export const NUSACHOT: { id: Nusach; label: string }[] = [
  { id: 'ashkenaz', label: 'Ashkenaz' },
  { id: 'sefard', label: 'Sefard' },
  { id: 'edot', label: 'Edot HaMizrach' },
];

// Each book is close to 1 MB, so load only the one in use.
export function book(n: Nusach): Book {
  if (n === 'sefard') return require('./data/siddur/sefard.json');
  if (n === 'edot') return require('./data/siddur/edot.json');
  return require('./data/siddur/ashkenaz.json');
}

export interface SiddurPrefs { nusach: Nusach; size: number; english: boolean; place: Record<string, number> }
const KEY = 'nsha.siddur';
let state: SiddurPrefs = { nusach: 'ashkenaz', size: 24, english: true, place: {} };
const subs = new Set<(s: SiddurPrefs) => void>();
const loading = AsyncStorage.getItem(KEY)
  .then((v) => { if (v) { state = { ...state, ...JSON.parse(v) }; subs.forEach((f) => f(state)); } })
  .catch(() => {});

export function setSiddur(patch: Partial<SiddurPrefs>) {
  state = { ...state, ...patch };
  subs.forEach((f) => f(state));
  AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
}

// Waits for saved data first, so opening a page right at launch can't wipe older bookmarks.
export const savePlace = (key: string, part: number) => loading.then(() => setSiddur({ place: { ...state.place, [key]: part } }));

export function useSiddur() {
  const [s, set] = useState(state);
  useEffect(() => {
    set(state);
    subs.add(set);
    return () => { subs.delete(set); };
  }, []);
  return s;
}
