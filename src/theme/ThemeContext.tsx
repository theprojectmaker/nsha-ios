// The single place the app's identity gets configured: which school, and —
// since parents and students often see different things — which viewer role.
// Persisted locally so the choice survives a restart. In a real deployment
// this would be set once per install (e.g. a school picks their district at
// onboarding, or the backend scopes the install to one school) rather than
// switched freely, but keeping it a live, savable setting is exactly what
// proves the re-skinning layer actually works end to end.
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buildPalette, Palette } from "./colors";
import { DEFAULT_SCHOOL_ID, getSchool, School, SchoolId } from "./schools";

export type Role = "everyone" | "parent" | "student";

interface ThemeState {
  school: School;
  colors: Palette;
  role: Role;
  setSchoolId: (id: SchoolId) => void;
  setRole: (r: Role) => void;
  ready: boolean;
}

const SCHOOL_KEY = "pennant.schoolId";
const ROLE_KEY = "pennant.role";

const ThemeCtx = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [schoolId, setSchoolIdState] = useState<SchoolId>(DEFAULT_SCHOOL_ID);
  const [role, setRoleState] = useState<Role>("everyone");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [savedSchool, savedRole] = await Promise.all([
        AsyncStorage.getItem(SCHOOL_KEY),
        AsyncStorage.getItem(ROLE_KEY),
      ]);
      if (savedSchool) setSchoolIdState(savedSchool);
      if (savedRole) setRoleState(savedRole as Role);
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

  const school = getSchool(schoolId);
  const colors = useMemo(() => buildPalette(school), [school]);

  return (
    <ThemeCtx.Provider value={{ school, colors, role, setSchoolId, setRole, ready }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
