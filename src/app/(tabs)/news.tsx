import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { sortedPosts } from '@/data/seed';
import type { PostType } from '@/data/types';
import { usePrefs, visibleTo } from '@/prefs';
import { C, F, T } from '@/theme';
import { Page, PostItem, tap } from '@/ui';

const FILTERS = ['All', 'News', 'Events', 'Polls', 'Photos'] as const;
type Filter = (typeof FILTERS)[number];
const TYPES: Record<Filter, PostType[] | null> = {
  All: null,
  News: ['text', 'alert'],
  Events: ['event'],
  Polls: ['poll'],
  Photos: ['photo'],
};

export default function News() {
  const { role } = usePrefs();
  const [filter, setFilter] = useState<Filter>('All');
  const types = TYPES[filter];
  const all = sortedPosts().filter((p) => visibleTo(role, p.audience) && (!types || types.includes(p.type)));
  const posts = [...all.filter((p) => p.pinned), ...all.filter((p) => !p.pinned)];

  return (
    <Page title="News">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsWrap} contentContainerStyle={s.tabs}>
        {FILTERS.map((f) => {
          const on = f === filter;
          return (
            <Pressable key={f} onPress={() => { tap(); setFilter(f); }} accessibilityRole="tab" accessibilityState={{ selected: on }} style={s.tab}>
              <Text style={[s.tabText, on && { color: C.ink }]}>{f}</Text>
              <View style={[s.under, on && { backgroundColor: C.gold }]} />
            </Pressable>
          );
        })}
      </ScrollView>
      {posts.map((p) => <PostItem key={p.id} post={p} />)}
      {posts.length === 0 ? <Text style={[T.meta, { textAlign: 'center', marginTop: 30 }]}>Nothing here yet.</Text> : null}
    </Page>
  );
}

const s = StyleSheet.create({
  tabsWrap: { marginHorizontal: -18, marginBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.rule },
  tabs: { paddingHorizontal: 18, gap: 22 },
  tab: { paddingBottom: 0 },
  tabText: { fontFamily: F.slantBold, fontSize: 19, letterSpacing: 0.8, color: C.faint, textTransform: 'uppercase', paddingBottom: 8 },
  under: { height: 4, backgroundColor: 'transparent', transform: [{ skewX: '-18deg' }] },
});
