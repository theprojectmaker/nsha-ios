// Each school's entire look lives in one of these objects: name, mascot, two
// brand colors, and a crest glyph. No screen reaches for a hardcoded color or
// name — everything reads from whichever School is active (see ThemeContext).
// Re-skinning the app for a real school means adding one entry here (or
// loading one from a backend) and nothing else.
//
// "custom" is special: it's not a fixed preset but a live, user-editable slot
// (see ThemeContext's customSchool) that proves the config layer works for a
// school that doesn't exist yet, not just for switching between two demos.
import type { Ionicons } from "@expo/vector-icons";

export type SchoolId = string;

export const CUSTOM_SCHOOL_ID = "custom";

export interface School {
  id: SchoolId;
  name: string;
  shortName: string;
  mascot: string;
  district: string;
  /** Deep brand color: tab bar, headers, primary buttons. */
  primary: string;
  /** Bright accent: pinned badges, highlights, the crest ring. */
  accent: string;
  /** Initials shown on the generated crest (swap for a real logo image later — see Crest.tsx). */
  crestInitials: string;
  /** Small thematic glyph layered on the crest and used as a mascot flourish. */
  mascotIcon: keyof typeof Ionicons.glyphMap;
}

export const SCHOOLS: School[] = [
  {
    id: "lincoln-park",
    name: "Lincoln Park Middle School",
    shortName: "Lincoln Park",
    mascot: "Panthers",
    district: "Lincoln Park School District",
    primary: "#1B4332",
    accent: "#D4A017",
    crestInitials: "LP",
    mascotIcon: "paw",
  },
  {
    id: "riverdale",
    name: "Riverdale High School",
    shortName: "Riverdale",
    mascot: "Hawks",
    district: "Riverdale Unified",
    primary: "#1D3557",
    accent: "#E76F51",
    crestInitials: "RH",
    mascotIcon: "flash",
  },
  {
    id: "sunridge",
    name: "Sunridge Elementary",
    shortName: "Sunridge",
    mascot: "Suns",
    district: "Sunridge School District",
    primary: "#B45309",
    accent: "#38BDF8",
    crestInitials: "SE",
    mascotIcon: "sunny",
  },
  {
    id: "ironwood",
    name: "Ironwood High School",
    shortName: "Ironwood",
    mascot: "Titans",
    district: "Ironwood Unified",
    primary: "#334155",
    accent: "#DC2626",
    crestInitials: "IW",
    mascotIcon: "shield",
  },
  {
    id: "bayview",
    name: "Bayview Academy",
    shortName: "Bayview",
    mascot: "Dolphins",
    district: "Bayview School District",
    primary: "#0F766E",
    accent: "#FB7185",
    crestInitials: "BA",
    mascotIcon: "water",
  },
];

export const DEFAULT_SCHOOL_ID = SCHOOLS[0].id;

export const CUSTOM_SCHOOL_DEFAULTS: School = {
  id: CUSTOM_SCHOOL_ID,
  name: "Your School Name",
  shortName: "Your School",
  mascot: "Mascots",
  district: "Your District",
  primary: "#4338CA",
  accent: "#F59E0B",
  crestInitials: "YS",
  mascotIcon: "star",
};

export function getSchool(id: SchoolId, customSchool?: School | null): School {
  if (id === CUSTOM_SCHOOL_ID) return customSchool ?? CUSTOM_SCHOOL_DEFAULTS;
  return SCHOOLS.find((s) => s.id === id) ?? SCHOOLS[0];
}
