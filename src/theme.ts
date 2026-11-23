// NSHA colors from the lion logo (sky blue, gold, black), used sparingly on a plain page.
// Light/dark follows the phone, picked once at startup.
import { Appearance } from 'react-native';

const LIGHT = {
  page: '#FFFFFF',
  soft: '#F3F5F8', // subtle fills: alert banner, poll bars, inputs
  ink: '#0D0F12',
  sub: '#6B7280',
  faint: '#A3A9B1',
  rule: '#E6E8EC',
  blue: '#2F86C9', // NSHA blue, deep enough for text and buttons
  blueLogo: '#56A1DA',
  gold: '#E2AA2C',
  goldSoft: '#FBF1D9',
  red: '#D23B3B',
  redSoft: '#FCEBEB',
  win: '#1E8E5A',
  loss: '#C63B3B',
  white: '#FFFFFF',
};

const DARK: typeof LIGHT = {
  page: '#000000',
  soft: '#15171B',
  ink: '#F2F3F5',
  sub: '#9AA1AB',
  faint: '#5E6570',
  rule: '#24272D',
  blue: '#6AB4EC',
  blueLogo: '#56A1DA',
  gold: '#F2C14E',
  goldSoft: '#2E2510',
  red: '#F06A6A',
  redSoft: '#2E1515',
  win: '#4CC98C',
  loss: '#F06A6A',
  white: '#FFFFFF',
};

export const IS_DARK = Appearance.getColorScheme() === 'dark';
export const C = IS_DARK ? DARK : LIGHT;

// The slanted Barlow Condensed is only for screen titles and the Home "LIONS".
export const F = { slant: 'BarlowCondensed_900Black_Italic', slantBold: 'BarlowCondensed_800ExtraBold_Italic' } as const;

export const GUTTER = 20;

export const T = {
  title: { fontFamily: F.slant, fontSize: 40, lineHeight: 42, color: C.ink, textTransform: 'uppercase' },
  section: { fontSize: 20, fontWeight: '700', color: C.ink, letterSpacing: -0.3 },
  rowTitle: { fontSize: 16, fontWeight: '600', color: C.ink, letterSpacing: -0.2 },
  body: { fontSize: 16, lineHeight: 23, color: C.ink },
  meta: { fontSize: 14, lineHeight: 19, color: C.sub },
  small: { fontSize: 12, fontWeight: '600', color: C.sub, letterSpacing: 0.3, textTransform: 'uppercase' },
} as const;
