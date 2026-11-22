// Derives a full palette from a School's two brand colors, so every screen
// gets consistent tints without hardcoding anything beyond primary/accent.
// Also takes a light/dark scheme — the same config renders as a completely
// different-feeling app with one extra flag, which is the point: nothing
// below is a per-school override, it's all derived.
import type { School } from "./schools";

export type Scheme = "light" | "dark";

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
  scheme: Scheme;
  primary: string;
  primaryTint: string; // light/dark wash of primary, for cards/badges
  accent: string;
  accentTint: string;
  text: string;
  muted: string;
  background: string;
  surface: string;
  border: string;
  // Semantic colors stay fixed across schools on purpose — "urgent" should
  // read as urgent no matter whose brand colors are active.
  danger: string;
  dangerTint: string;
  success: string;
}

export function buildPalette(school: School, scheme: Scheme = "light"): Palette {
  const dark = scheme === "dark";
  return {
    scheme,
    primary: school.primary,
    primaryTint: dark ? mix(school.primary, 0, 0.72) : mix(school.primary, 255, 0.92),
    accent: school.accent,
    accentTint: dark ? mix(school.accent, 0, 0.65) : mix(school.accent, 255, 0.85),
    text: dark ? "#F2F2F2" : "#1A1A1A",
    muted: dark ? "#9AA1A9" : "#6B7280",
    background: dark ? "#0B0D10" : "#F7F7F5",
    surface: dark ? "#1A1E23" : "#FFFFFF",
    border: dark ? mix(school.primary, 255, 0.3) : mix(school.primary, 255, 0.82),
    danger: "#DC2626",
    dangerTint: dark ? "rgba(220, 38, 38, 0.22)" : "#FEE2E2",
    success: "#16A34A",
  };
}
