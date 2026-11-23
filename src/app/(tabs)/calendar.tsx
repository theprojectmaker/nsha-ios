import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { upcomingEvents } from '@/data/seed';
import type { Post } from '@/data/types';
import { usePrefs, visibleTo } from '@/prefs';
import { C, T } from '@/theme';
import { Card, DateTile, Screen, inDays } from '@/ui';

export default function Calendar() {
  const { role } = usePrefs();
  const events = upcomingEvents().filter((p) => visibleTo(role, p.audience));
  const months = new Map<string, Post[]>();
  for (const e of events) {
    const key = new Date(e.eventDate! + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    months.set(key, [...(months.get(key) ?? []), e]);
  }

  return (
    <Screen title="Calendar">
      {[...months.entries()].map(([month, list]) => (
        <View key={month} style={{ marginBottom: 10 }}>
          <Text style={[T.eyebrow, { marginBottom: 10 }]}>{month}</Text>
          {list.map((e) => (
            <Card key={e.id} onPress={() => router.push(`/post/${e.id}`)} label={e.title} style={s.row}>
              <DateTile iso={e.eventDate!} />
              <View style={{ flex: 1 }}>
                <Text style={T.h3}>{e.title}</Text>
                <Text style={T.small}>{[e.eventTime, e.eventLocation].filter(Boolean).join(' · ')}</Text>
              </View>
              <Text style={s.when}>{inDays(e.eventDate!)}</Text>
            </Card>
          ))}
        </View>
      ))}
      {events.length === 0 ? <Text style={[T.small, { textAlign: 'center', marginTop: 30 }]}>No upcoming events.</Text> : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  when: { fontSize: 12, fontWeight: '700', color: C.blue },
});
