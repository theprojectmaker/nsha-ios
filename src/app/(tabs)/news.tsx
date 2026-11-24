import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { sortedPosts } from '@/data/seed';
import type { PostType } from '@/data/types';
import { usePrefs, visibleTo } from '@/prefs';
import { C, T } from '@/theme';
import { NewsRow, Page, tap } from '@/ui';

const FILTERS = ['All', 'Events', 'Polls'] as const;
type Filter = (typeof FILTERS)[number];
const TYPES: Record<Filter, PostType[] | null> = { All: null, Events: ['event'], Polls: ['poll'] };

export default function News() {
  const { role } = usePrefs();
  const [filter, setFilter] = useState<Filter>('All');
  const types = TYPES[filter];
  const all = sortedPosts().filter((p) => visibleTo(role, p.audience) && (!types || types.includes(p.type)));
  const posts = [...all.filter((p) => p.pinned), ...all.filter((p) => !p.pinned)];

  return (
    <Page title="News">
      <Text style={T.meta}>Sample content, not real NSHA information.</Text>
      {/* Apple-style segmented control */}
      <View style={s.segment}>
        {FILTERS.map((f) => {
          const on = f === filter;
          return (
            <Pressable key={f} onPress={() => { tap(); setFilter(f); }} accessibilityRole="tab" accessibilityState={{ selected: on }} style={[s.seg, on && s.segOn]}>
              <Text style={[s.segText, on && s.segTextOn]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>
      {posts.map((p, i) => <NewsRow key={p.id} post={p} last={i === posts.length - 1} />)}
      {posts.length === 0 ? <Text style={[T.meta, { textAlign: 'center', marginTop: 30 }]}>Nothing here yet.</Text> : null}
    </Page>
  );
}

const s = StyleSheet.create({
  segment: { flexDirection: 'row', backgroundColor: C.soft, borderRadius: 9, padding: 2, marginTop: 6, marginBottom: 6 },
  seg: { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 7 },
  segOn: { backgroundColor: C.page, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  segText: { fontSize: 14, fontWeight: '500', color: C.ink },
  segTextOn: { fontWeight: '600' },
});
