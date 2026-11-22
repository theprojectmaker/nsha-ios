// The single place the app's identity gets configured: which school, which
// light/dark scheme, and — since parents and students often see different
// things — which viewer role. Persisted locally so the choice survives a
// restart. In a real deployment the school would be set once per install
// (e.g. a school picks their district at onboarding, or the backend scopes
// the install to one school) rather than switched freely, but keeping it a
// live, savable setting is exactly what proves the re-skinning layer works
// end to end — including for a school that isn't one of the presets, via
// `customSchool`, which Settings lets the viewer build live.
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buildPalette, Palette, Scheme } from "./colors";
import { CUSTOM_SCHOOL_DEFAULTS, CUSTOM_SCHOOL_ID, DEFAULT_SCHOOL_ID, getSchool, School, SchoolId } from "./schools";

export type Role = "everyone" | "parent" | "student";

interface ThemeState {
  school: School;
  colors: Palette;
  role: Role;
  scheme: Scheme;
  schoolId: SchoolId;
  customSchool: School;
  setSchoolId: (id: SchoolId) => void;
  setRole: (r: Role) => void;
  setScheme: (s: Scheme) => void;
  updateCustomSchool: (patch: Partial<School>) => void;
  ready: boolean;
}

const SCHOOL_KEY = "marquee.schoolId";
const ROLE_KEY = "marquee.role";
const SCHEME_KEY = "marquee.scheme";
const CUSTOM_SCHOOL_KEY = "marquee.customSchool";

const ThemeCtx = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [schoolId, setSchoolIdState] = useState<SchoolId>(DEFAULT_SCHOOL_ID);
  const [role, setRoleState] = useState<Role>("everyone");
  const [scheme, setSchemeState] = useState<Scheme>("light");
  const [customSchool, setCustomSchoolState] = useState<School>(CUSTOM_SCHOOL_DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [savedSchool, savedRole, savedScheme, savedCustom] = await Promise.all([
        AsyncStorage.getItem(SCHOOL_KEY),
        AsyncStorage.getItem(ROLE_KEY),
        AsyncStorage.getItem(SCHEME_KEY),
        AsyncStorage.getItem(CUSTOM_SCHOOL_KEY),
      ]);
      if (savedSchool) setSchoolIdState(savedSchool);
      if (savedRole) setRoleState(savedRole as Role);
      if (savedScheme === "light" || savedScheme === "dark") setSchemeState(savedScheme);
      if (savedCustom) {
        try {
          setCustomSchoolState({ ...CUSTOM_SCHOOL_DEFAULTS, ...JSON.parse(savedCustom) });
        } catch {
          // ignore corrupt local data, fall back to defaults
        }
      }
      setReady(true);
    })();
  }, []);

  const setSchoolId = (id: SchoolId) => {
    setSchoolIdState(id);
    AsyncStorage.setItem(SCHOOL_KEY, id).catch(() => {});
  };
  const setRole = (r: Role) => {
    setRoleState(r);
    AsyncStorage.setItem(ROLE_KEY, r).catch(() => {});
  };
  const setScheme = (s: Scheme) => {
    setSchemeState(s);
    AsyncStorage.setItem(SCHEME_KEY, s).catch(() => {});
  };
  const updateCustomSchool = (patch: Partial<School>) => {
    const next = { ...customSchool, ...patch, id: CUSTOM_SCHOOL_ID };
    setCustomSchoolState(next);
    AsyncStorage.setItem(CUSTOM_SCHOOL_KEY, JSON.stringify(next)).catch(() => {});
  };

  const school = getSchool(schoolId, customSchool);
  const colors = useMemo(() => buildPalette(school, scheme), [school, scheme]);

  return (
    <ThemeCtx.Provider
      value={{ school, colors, role, scheme, schoolId, customSchool, setSchoolId, setRole, setScheme, updateCustomSchool, ready }}
    >
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
