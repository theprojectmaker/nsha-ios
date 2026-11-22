// Derives a full palette from a School's two brand colors, so every screen
// gets consistent tints without hardcoding anything beyond primary/accent.
import type { School } from "./schools";

function hexToRgb(hex: string) {
  const v = hex.replace("#", "");
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

function mix(hex: string, towards: number, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const m = (c: number) => Math.round(c + (towards - c) * amount);
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}

export interface Palette {
  primary: string;
  primaryTint: string; // light wash of primary, for cards/badges
  accent: string;
  accentTint: string;
  text: string;
  muted: string;
  background: string;
  surface: string;
  border: string;
}

export function buildPalette(school: School): Palette {
  return {
    primary: school.primary,
    primaryTint: mix(school.primary, 255, 0.92),
    accent: school.accent,
    accentTint: mix(school.accent, 255, 0.85),
    text: "#1A1A1A",
    muted: "#6B7280",
    background: "#F7F7F5",
    surface: "#FFFFFF",
    border: mix(school.primary, 255, 0.82),
  };
}
