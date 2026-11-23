import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Glass } from './glass';
import { C, IS_DARK } from './theme';
import type { IconName } from './ui';

// Browser preview only. Phones use Apple's own tab bar; this imitates its floating glass
// capsule with a lens that springs to the selected tab.
const ITEMS: Record<string, { label: string; icon: IconName; on: IconName }> = {
  index: { label: 'Home', icon: 'home-outline', on: 'home' },
  news: { label: 'News', icon: 'newspaper-outline', on: 'newspaper' },
  calendar: { label: 'Calendar', icon: 'calendar-outline', on: 'calendar' },
  school: { label: 'School', icon: 'school-outline', on: 'school' },
};

type BarProps = { state: { index: number; routes: { key: string; name: string }[] }; navigation: { navigate: (name: string) => void } };

function GlassBar({ state, navigation }: BarProps) {
  const routes = state.routes.filter((r) => ITEMS[r.name]);
  const [rowW, setRowW] = useState(0);
  const slot = rowW ? rowW / routes.length : 0;
  const x = useRef(new Animated.Value(0)).current;
  const first = useRef(true);
  useEffect(() => {
    if (!slot) return;
    const to = state.index * slot;
    if (first.current) { x.setValue(to); first.current = false; return; }
    Animated.spring(x, { toValue: to, useNativeDriver: false, damping: 16, stiffness: 190, mass: 0.9 }).start();
  }, [state.index, slot]);

  return (
    <View style={st.wrap} pointerEvents="box-none">
      <Glass style={st.bar}>
        <View style={st.row} onLayout={(e) => setRowW(e.nativeEvent.layout.width)}>
          {slot ? <Animated.View pointerEvents="none" style={[st.lens, { width: slot, transform: [{ translateX: x }] }]} /> : null}
          {routes.map((r, i) => {
            const item = ITEMS[r.name];
            const on = state.index === i;
            return (
              <Pressable key={r.key} onPress={() => navigation.navigate(r.name)} style={st.tab} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={item.label}>
                <Ionicons name={on ? item.on : item.icon} size={22} color={on ? C.blue : C.ink} />
                <Text style={[st.text, on && { color: C.blue }]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Glass>
    </View>
  );
}

export function WebTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false, animation: 'fade' }} tabBar={(p) => <GlassBar {...(p as unknown as BarProps)} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="news" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="school" />
    </Tabs>
  );
}

const st = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 14, alignItems: 'center', paddingHorizontal: 20 },
  bar: { borderRadius: 36, padding: 6, width: '100%', maxWidth: 400 },
  row: { flexDirection: 'row' },
  lens: {
    position: 'absolute', left: 0, top: -2, bottom: -2, borderRadius: 30,
    backgroundColor: IS_DARK ? 'rgba(255,255,255,0.12)' : 'rgba(62,143,208,0.10)',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, gap: 2 },
  text: { fontSize: 11, fontWeight: '700', color: C.ink },
});
