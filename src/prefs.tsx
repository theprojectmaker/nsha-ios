// Who is using the app (parent or student), which filters what the feed shows.
// A local choice for now; real accounts would set this from sign-in instead.
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Audience } from './data/types';

export type Role = 'everyone' | 'parent' | 'student';

const KEY = 'nsha.role';
const Ctx = createContext<{ role: Role; setRole: (r: Role) => void }>({ role: 'everyone', setRole: () => {} });

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('everyone');
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === 'parent' || v === 'student' || v === 'everyone') setRoleState(v);
    });
  }, []);
  const setRole = (r: Role) => {
    setRoleState(r);
    AsyncStorage.setItem(KEY, r).catch(() => {});
  };
  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>;
}

export const usePrefs = () => useContext(Ctx);

const AS: Record<Role, Audience> = { everyone: 'everyone', parent: 'parents', student: 'students' };
export function visibleTo(role: Role, audience: Audience) {
  return audience === 'everyone' || role === 'everyone' || AS[role] === audience;
}
