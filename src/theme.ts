// Varsity look built from the NSHA lion logo: sky blue, gold, black, and heavy
// slanted lettering like the NSHA wordmark. Flat surfaces, no drop shadows.
// Light/dark follows the phone, picked once at startup.
import { Appearance } from 'react-native';

const LIGHT = {
  page: '#F4F5F7',
  surface: '#FFFFFF',
  ink: '#0B0C0F',
  sub: '#5E6570',
  faint: '#A2A8B0',
  rule: '#E2E5EA',
  blue: '#56A1DA', // logo blue
  blueDark: '#1F5F96',
  blueInk: '#2C7BBE', // links, active tab
  gold: '#F2C14E',
  goldDark: '#B8861B',
  black: '#0B0C0F',
  onBlack: '#FFFFFF',
  win: '#1E8E5A',
  loss: '#C63B3B',
  alert: '#C63B3B',
  white: '#FFFFFF',
};

const DARK: typeof LIGHT = {
  page: '#08090B',
  surface: '#14161A',
  ink: '#F2F3F5',
  sub: '#9AA1AB',
  faint: '#5E6570',
  rule: '#24272D',
  blue: '#56A1DA',
  blueDark: '#1A4E7C',
  blueInk: '#7CB9E8',
  gold: '#F2C14E',
  goldDark: '#F2C14E',
  black: '#000000',
  onBlack: '#FFFFFF',
  win: '#4CC98C',
  loss: '#F06A6A',
  alert: '#F06A6A',
  white: '#FFFFFF',
};

export const IS_DARK = Appearance.getColorScheme() === 'dark';
export const C = IS_DARK ? DARK : LIGHT;

// Barlow Condensed, loaded in src/app/_layout.tsx. Body text stays Apple's system font.
export const F = {
  slant: 'BarlowCondensed_900Black_Italic',
  slantBold: 'BarlowCondensed_800ExtraBold_Italic',
  cond: 'BarlowCondensed_800ExtraBold',
} as const;

export const T = {
  display: { fontFamily: F.slant, fontSize: 52, lineHeight: 50, color: C.ink, textTransform: 'uppercase', letterSpacing: -0.5 },
  title: { fontFamily: F.slant, fontSize: 40, lineHeight: 42, color: C.ink, textTransform: 'uppercase' },
  label: { fontFamily: F.slantBold, fontSize: 17, letterSpacing: 1.2, color: C.ink, textTransform: 'uppercase' },
  head: { fontFamily: F.cond, fontSize: 21, lineHeight: 23, color: C.ink, textTransform: 'uppercase', letterSpacing: 0.2 },
  body: { fontSize: 15, lineHeight: 21, color: C.ink },
  meta: { fontSize: 13, lineHeight: 18, color: C.sub },
  tag: { fontFamily: F.slantBold, fontSize: 13, letterSpacing: 1.4, textTransform: 'uppercase' },
} as const;

export const RADIUS = 10;
