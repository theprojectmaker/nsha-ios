// NSHA colors, sampled from the lion logo: sky blue, gold, and black ink.
// The palette follows the phone's light/dark setting, picked once at startup.
import { Appearance } from 'react-native';

const LIGHT = {
  bg: '#F3F6FA',
  card: '#FFFFFF',
  ink: '#0E1520',
  sub: '#5B6573',
  faint: '#9AA3AE',
  line: '#E3E9F0',
  blue: '#3E8FD0', // NSHA blue, a touch deeper than the logo so text and buttons read well
  blueLogo: '#56A1DA',
  blueDeep: '#215F94',
  bluePale: '#E4F0FA',
  gold: '#D9A436',
  goldLogo: '#FDD18A',
  goldDeep: '#8A6212',
  goldPale: '#FCF2DC',
  red: '#D23B3B',
  redPale: '#FBE5E5',
  green: '#1E8A5A',
  white: '#FFFFFF',
  inverse: '#0E1520',
  onInverse: '#FFFFFF',
};

const DARK: typeof LIGHT = {
  bg: '#0A0F16',
  card: '#151C26',
  ink: '#EEF2F7',
  sub: '#9DA8B5',
  faint: '#6B7684',
  line: '#232D3A',
  blue: '#5DAAE4',
  blueLogo: '#56A1DA',
  blueDeep: '#9CCBF0',
  bluePale: '#122A40',
  gold: '#F0C266',
  goldLogo: '#FDD18A',
  goldDeep: '#F7DDA4',
  goldPale: '#33270F',
  red: '#F06464',
  redPale: '#3A1717',
  green: '#5CCB97',
  white: '#FFFFFF',
  inverse: '#EEF2F7',
  onInverse: '#0A0F16',
};

export const IS_DARK = Appearance.getColorScheme() === 'dark';
export const C = IS_DARK ? DARK : LIGHT;

export const R = { card: 22, tile: 14, pill: 999 };

// Bricolage Grotesque for headlines (loaded in src/app/_layout.tsx), Apple's system font for everything else.
export const F = { display: 'BricolageGrotesque_800ExtraBold', bold: 'BricolageGrotesque_700Bold' } as const;

export const shadow = {
  shadowColor: '#0B1A2B',
  shadowOpacity: IS_DARK ? 0.35 : 0.06,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },
  elevation: 2,
} as const;

export const T = {
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 0.9, color: C.sub, textTransform: 'uppercase' },
  h1: { fontSize: 32, lineHeight: 36, fontFamily: F.display, color: C.ink, letterSpacing: -0.8 },
  h2: { fontSize: 21, fontFamily: F.display, color: C.ink, letterSpacing: -0.3 },
  h3: { fontSize: 16, fontWeight: '700', color: C.ink },
  body: { fontSize: 15, lineHeight: 22, color: C.ink },
  small: { fontSize: 13, lineHeight: 18, color: C.sub },
} as const;
