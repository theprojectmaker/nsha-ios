import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GAMES, upcomingEvents } from '@/data/seed';
import type { Post } from '@/data/types';
import { usePrefs, visibleTo } from '@/prefs';
import { C, F, T } from '@/theme';
import { DateBlock, Page, Panel, Tag, inDays, tap } from '@/ui';

type Item = { kind: 'event'; post: Post; date: string } | { kind: 'game'; id: string; title: string; meta: string; date: string };

export default function Calendar() {
  const { role } = usePrefs();
  const today = new Date().toISOString().slice(0, 10);
  const items: Item[] = [
    ...upcomingEvents().filter((p) => visibleTo(role, p.audience)).map((p) => ({ kind: 'event' as const, post: p, date: p.eventDate! })),
    ...GAMES.filter((g) => g.lions === undefined && g.date >= today).map((g) => ({
      kind: 'game' as const,
      id: g.id,
      title: `${g.team} ${g.sport}`,
      meta: `${g.home ? 'Home' : 'Away'} vs. ${g.opponent}${g.time ? ` · ${g.time}` : ''}`,
      date: g.date,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const months = new Map<string, Item[]>();
  for (const it of items) {
    const key = new Date(it.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    months.set(key, [...(months.get(key) ?? []), it]);
  }

  return (
    <Page title="Calendar">
      {[...months.entries()].map(([month, list]) => (
        <View key={month} style={{ marginBottom: 14 }}>
          <Text style={s.month}>{month}</Text>
          {list.map((it) => {
            const key = it.kind === 'event' ? it.post.id : it.id;
            const title = it.kind === 'event' ? it.post.title : it.title;
            const meta = it.kind === 'event' ? [it.post.eventTime, it.post.eventLocation].filter(Boolean).join(' · ') : it.meta;
            const row = (pressed: boolean) => (
              <Panel accent={it.kind === 'game' ? C.blue : C.gold} style={[s.row, pressed && { opacity: 0.7 }]}>
                <DateBlock iso={it.date} />
                <View style={{ flex: 1 }}>
                  {it.kind === 'game' ? <Tag label="Game" color={C.blue} style={{ marginBottom: 4 }} /> : null}
                  <Text style={T.head}>{title}</Text>
                  <Text style={T.meta}>{meta}</Text>
                </View>
                <Text style={s.when}>{inDays(it.date)}</Text>
              </Panel>
            );
            if (it.kind !== 'event') return <View key={key}>{row(false)}</View>;
            return (
              <Pressable key={key} onPress={() => { tap(); router.push(`/post/${it.post.id}`); }} accessibilityRole="button" accessibilityLabel={title}>
                {({ pressed }) => row(pressed)}
              </Pressable>
            );
          })}
        </View>
      ))}
      {items.length === 0 ? <Text style={[T.meta, { textAlign: 'center', marginTop: 30 }]}>Nothing coming up.</Text> : null}
    </Page>
  );
}

const s = StyleSheet.create({
  month: { fontFamily: F.slantBold, fontSize: 22, letterSpacing: 0.8, color: C.sub, textTransform: 'uppercase', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, paddingLeft: 17, marginBottom: 10 },
  when: { fontFamily: F.slantBold, fontSize: 14, color: C.blueInk, textTransform: 'uppercase' },
});
