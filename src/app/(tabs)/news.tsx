import React, { useState } from 'react';
import { Text } from 'react-native';
import { sortedPosts } from '@/data/seed';
import type { PostType } from '@/data/types';
import { usePrefs, visibleTo } from '@/prefs';
import { T } from '@/theme';
import { Chips, PostCard, Screen } from '@/ui';

const FILTERS = ['All', 'Announcements', 'Events', 'Polls', 'Photos'] as const;
type Filter = (typeof FILTERS)[number];
const TYPES: Record<Filter, PostType[] | null> = {
  All: null,
  Announcements: ['text', 'alert'],
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
    <Screen title="News">
      <Chips options={FILTERS} value={filter} onChange={setFilter} />
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
      {posts.length === 0 ? <Text style={[T.small, { textAlign: 'center', marginTop: 30 }]}>Nothing here yet.</Text> : null}
    </Screen>
  );
}
