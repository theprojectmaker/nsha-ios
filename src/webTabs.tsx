import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './theme';
import type { IconName } from './ui';

// Browser preview only (phones use Apple's own tab bar): a plain bar like iOS draws.
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
    <View style={[st.bar, { paddingBottom: insets.bottom + 4 }]}>
      {state.routes.filter((r) => ITEMS[r.name]).map((r, i) => {
        const item = ITEMS[r.name];
        const on = state.index === i;
        return (
          <Pressable key={r.key} onPress={() => navigation.navigate(r.name)} style={st.tab} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={item.label}>
            <Ionicons name={on ? item.on : item.icon} size={24} color={on ? C.blue : C.faint} />
            <Text style={[st.text, { color: on ? C.blue : C.faint }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function WebTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p) => <Bar {...(p as unknown as BarProps)} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="news" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="school" />
    </Tabs>
  );
}

const st = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: C.page, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.rule, paddingTop: 6 },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  text: { fontSize: 10, fontWeight: '500' },
});
