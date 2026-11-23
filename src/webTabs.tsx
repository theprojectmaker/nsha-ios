import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from './theme';
import type { IconName } from './ui';

// Browser preview only (phones use Apple's own tab bar): a flat black bar, gold marker on the open tab.
const ITEMS: Record<string, { label: string; icon: IconName; on: IconName }> = {
  index: { label: 'Home', icon: 'home-outline', on: 'home' },
  news: { label: 'News', icon: 'newspaper-outline', on: 'newspaper' },
  calendar: { label: 'Calendar', icon: 'calendar-outline', on: 'calendar' },
  school: { label: 'School', icon: 'school-outline', on: 'school' },
};

type BarProps = { state: { index: number; routes: { key: string; name: string }[] }; navigation: { navigate: (name: string) => void } };

function Bar({ state, navigation }: BarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[st.bar, { paddingBottom: insets.bottom + 6 }]}>
      {state.routes.filter((r) => ITEMS[r.name]).map((r, i) => {
        const item = ITEMS[r.name];
        const on = state.index === i;
        return (
          <Pressable key={r.key} onPress={() => navigation.navigate(r.name)} style={st.tab} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={item.label}>
            <View style={[st.mark, on && { backgroundColor: C.gold }]} />
            <Ionicons name={on ? item.on : item.icon} size={22} color={on ? C.gold : 'rgba(255,255,255,0.6)'} />
            <Text style={[st.text, on && { color: C.white }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function WebTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false, animation: 'fade' }} tabBar={(p) => <Bar {...(p as unknown as BarProps)} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="news" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="school" />
    </Tabs>
  );
}

const st = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: C.black },
  tab: { flex: 1, alignItems: 'center', gap: 2, paddingTop: 0 },
  mark: { width: 36, height: 4, marginBottom: 7, backgroundColor: 'transparent', transform: [{ skewX: '-20deg' }] },
  text: { fontFamily: F.slantBold, fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' },
});
