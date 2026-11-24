import React from 'react';
import { Text } from 'react-native';
import { GAMES, upcomingEvents } from '@/data/seed';
import type { Game, Post } from '@/data/types';
import { usePrefs, visibleTo } from '@/prefs';
import { T } from '@/theme';
import { DateMark, EventRow, Page, Row, Section, inDays } from '@/ui';

type Item = { kind: 'event'; post: Post; date: string } | { kind: 'game'; game: Game; date: string };

export default function Calendar() {
  const { role } = usePrefs();
  const today = new Date().toISOString().slice(0, 10);
  const items: Item[] = [
    ...upcomingEvents().filter((p) => visibleTo(role, p.audience)).map((p) => ({ kind: 'event' as const, post: p, date: p.eventDate! })),
    ...GAMES.filter((g) => g.lions === undefined && g.date >= today).map((g) => ({ kind: 'game' as const, game: g, date: g.date })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const months = new Map<string, Item[]>();
  for (const it of items) {
    const key = new Date(it.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    months.set(key, [...(months.get(key) ?? []), it]);
  }

  return (
    <Page title="Calendar">
      <Text style={T.meta}>Sample content, not real NSHA information.</Text>
      {[...months.entries()].map(([month, list], mi) => (
        <Section key={month} title={month} first={mi === 0}>
          {list.map((it, i) =>
            it.kind === 'event' ? (
              <EventRow key={it.post.id} post={it.post} last={i === list.length - 1} />
            ) : (
              <Row
                key={it.game.id}
                left={<DateMark iso={it.date} />}
                title={`${it.game.team} ${it.game.sport}`}
                sub={`Game · ${it.game.home ? 'vs.' : 'at'} ${it.game.opponent}${it.game.time ? ` · ${it.game.time}` : ''}`}
                right={<Text style={T.meta}>{inDays(it.date)}</Text>}
                last={i === list.length - 1}
              />
            ),
          )}
        </Section>
      ))}
      {items.length === 0 ? <Text style={[T.meta, { textAlign: 'center', marginTop: 30 }]}>Nothing coming up.</Text> : null}
    </Page>
  );
}
