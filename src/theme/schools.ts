// Each school's entire look lives in one of these objects: name, mascot, two
// brand colors, and a crest glyph. No screen reaches for a hardcoded color or
// name — everything reads from whichever School is active (see ThemeContext).
// Re-skinning the app for a real school means adding one entry here (or
// loading one from a backend later) and nothing else.
export type SchoolId = string;

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
  },
];

export const DEFAULT_SCHOOL_ID = SCHOOLS[0].id;

export function getSchool(id: SchoolId): School {
  return SCHOOLS.find((s) => s.id === id) ?? SCHOOLS[0];
}
