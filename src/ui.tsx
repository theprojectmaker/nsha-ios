import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePollVote, useReaction } from './data/interactions';
import type { Game, Post } from './data/types';
import { C, GUTTER, T } from './theme';

export type IconName = keyof typeof Ionicons.glyphMap;

export function tap() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  return h >= 5 && h < 12 ? 'Good morning' : h >= 12 && h < 17 ? 'Good afternoon' : 'Good evening';
}

const day = (iso: string) => new Date(iso + 'T00:00:00');
export const shortDate = (iso: string) => day(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
export const longDate = (iso: string) => day(iso).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
export function inDays(iso: string, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const n = Math.round((day(iso).getTime() - start) / 86400000);
  return n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`;
}

// e.g. "12 Kislev 5787". Not every phone's date library has the Hebrew calendar; then it's left out.
export function hebrewDate(d = new Date()) {
  try {
    const s = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    return /\d{4}/.test(s) && !s.includes(String(d.getFullYear())) ? s : '';
  } catch {
    return '';
  }
}

export function Scroller({ top, bottom, children }: { top: number; bottom: number; children: React.ReactNode }) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    tap();
    setTimeout(() => setRefreshing(false), 700);
  };
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.page }}
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom + (Platform.OS === 'web' ? 90 : 30) }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.blue} colors={[C.blue]} />}
    >
      {children}
    </ScrollView>
  );
}

// Inner pages: title, then content, all on the same left edge.
export function Page({ title, back, children }: { title: string; back?: boolean; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Scroller top={insets.top + 12} bottom={insets.bottom}>
      <View style={s.col}>
        {back ? (
          <Pressable onPress={() => { tap(); router.canGoBack() ? router.back() : router.replace('/'); }} hitSlop={10} accessibilityRole="button" accessibilityLabel="Back" style={s.back}>
            <Ionicons name="chevron-back" size={22} color={C.blue} />
            <Text style={s.backText}>Back</Text>
          </Pressable>
        ) : null}
        <Text style={[T.title, { marginBottom: 8 }]}>{title}</Text>
        {children}
      </View>
    </Scroller>
  );
}

export function Section({ title, action, onAction, children, first }: { title: string; action?: string; onAction?: () => void; children: React.ReactNode; first?: boolean }) {
  return (
    <View style={{ marginTop: first ? 8 : 30 }}>
      <View style={s.sectionHead}>
        <Text style={T.section}>{title}</Text>
        {action && onAction ? (
          <Pressable onPress={() => { tap(); onAction(); }} hitSlop={10} accessibilityRole="button">
            <Text style={s.action}>{action}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

// One line in a list. Every row shares the same left edge; a thin rule separates rows.
export function Row({ left, title, sub, right, onPress, last, style }: { left?: React.ReactNode; title: string; sub?: string; right?: React.ReactNode; onPress?: () => void; last?: boolean; style?: StyleProp<ViewStyle> }) {
  const body = (pressed: boolean) => (
    <View style={[s.row, pressed && { opacity: 0.5 }, style]}>
      {left}
      <View style={[s.rowText, !last && s.rule]}>
        <View style={{ flex: 1 }}>
          <Text style={T.rowTitle} numberOfLines={2}>{title}</Text>
          {sub ? <Text style={[T.meta, { marginTop: 2 }]} numberOfLines={2}>{sub}</Text> : null}
        </View>
        {right ?? (onPress ? <Ionicons name="chevron-forward" size={16} color={C.faint} /> : null)}
      </View>
    </View>
  );
  if (!onPress) return body(false);
  return (
    <Pressable onPress={() => { tap(); onPress(); }} accessibilityRole="button" accessibilityLabel={title}>
      {({ pressed }) => body(pressed)}
    </Pressable>
  );
}

// Small date mark: month in blue, day number under it.
export function DateMark({ iso }: { iso: string }) {
  return (
    <View style={s.date}>
      <Text style={s.dateMonth}>{day(iso).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</Text>
      <Text style={s.dateDay}>{day(iso).getDate()}</Text>
    </View>
  );
}

export function EventRow({ post, last }: { post: Post; last?: boolean }) {
  return (
    <Row
      left={<DateMark iso={post.eventDate!} />}
      title={post.title}
      sub={[post.eventTime, post.eventLocation].filter(Boolean).join(' · ')}
      right={<Text style={s.when}>{inDays(post.eventDate!)}</Text>}
      onPress={() => router.push(`/post/${post.id}`)}
      last={last}
    />
  );
}

export function NewsRow({ post, last }: { post: Post; last?: boolean }) {
  const label = post.type === 'alert' ? 'Important' : post.type === 'poll' ? 'Poll' : post.type === 'event' ? 'Event' : null;
  return (
    <Row
      title={post.title}
      sub={`${label ? label + ' · ' : ''}${post.author} · ${shortDate(post.postedAt)}`}
      onPress={() => router.push(`/post/${post.id}`)}
      last={last}
    />
  );
}

export function ScoreRow({ game, last }: { game: Game; last?: boolean }) {
  const played = game.lions !== undefined && game.them !== undefined;
  const won = played && game.lions! > game.them!;
  return (
    <Row
      left={<View style={[s.result, { backgroundColor: !played ? C.goldSoft : won ? C.win : C.loss }]}><Text style={[s.resultText, !played && { color: C.gold }]}>{!played ? 'NEXT' : won ? 'W' : 'L'}</Text></View>}
      title={`${game.team} ${game.sport}`}
      sub={`${game.home ? 'vs.' : 'at'} ${game.opponent} · ${shortDate(game.date)}${!played && game.time ? `, ${game.time}` : ''}`}
      right={played ? <Text style={s.score}>{game.lions}–{game.them}</Text> : null}
      last={last}
    />
  );
}

// Full post, for the detail page.
export function PostBody({ post }: { post: Post }) {
  const { liked, count, toggle } = useReaction(post.id, post.baseLikes);
  const poll = usePollVote(post.id, post.pollOptions ?? []);
  return (
    <View>
      {post.type === 'alert' ? <Text style={[T.small, { color: C.red, marginBottom: 6 }]}>Important</Text> : null}
      <Text style={s.postTitle}>{post.title}</Text>
      <Text style={[T.meta, { marginBottom: 16 }]}>{post.author} · {shortDate(post.postedAt)}</Text>

      {post.type === 'event' && post.eventDate ? (
        <View style={s.eventBox}>
          <DateMark iso={post.eventDate} />
          <View style={{ flex: 1 }}>
            <Text style={T.rowTitle}>{longDate(post.eventDate)}</Text>
            <Text style={T.meta}>{[post.eventTime, post.eventLocation].filter(Boolean).join(' · ')}</Text>
          </View>
          <Text style={s.when}>{inDays(post.eventDate)}</Text>
        </View>
      ) : null}

      <Text style={T.body}>{post.body}</Text>

      {post.type === 'poll' && post.pollOptions ? (
        <View style={{ marginTop: 18, gap: 8 }}>
          {poll.counts.map((o) => {
            const pct = poll.total ? Math.round((o.votes / poll.total) * 100) : 0;
            const mine = poll.votedId === o.id;
            return (
              <Pressable key={o.id} onPress={() => { tap(); poll.vote(o.id); }} accessibilityRole="button" accessibilityLabel={`${o.label}, ${pct} percent`} style={[s.pollRow, mine && { borderColor: C.blue }]}>
                <View style={[s.pollFill, { width: `${pct}%` }]} />
                <Text style={s.pollLabel} numberOfLines={1}>{o.label}</Text>
                {mine ? <Ionicons name="checkmark-circle" size={17} color={C.blue} style={{ marginRight: 6 }} /> : null}
                <Text style={s.pollPct}>{pct}%</Text>
              </Pressable>
            );
          })}
          <Text style={T.meta}>{poll.total} votes{poll.votedId ? ' · tap your choice again to undo' : ''}</Text>
        </View>
      ) : null}

      <Pressable onPress={() => { tap(); toggle(); }} hitSlop={8} style={s.like} accessibilityRole="button" accessibilityLabel={liked ? 'Unlike' : 'Like'}>
        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? C.red : C.sub} />
        <Text style={[T.meta, { fontWeight: '600' }, liked && { color: C.red }]}>{count}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  col: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: GUTTER },
  back: { flexDirection: 'row', alignItems: 'center', marginLeft: -6, marginBottom: 6, alignSelf: 'flex-start' },
  backText: { fontSize: 17, color: C.blue },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 },
  action: { fontSize: 15, color: C.blue },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowText: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 },
  rule: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.rule },
  date: { width: 40, alignItems: 'center' },
  dateMonth: { fontSize: 11, fontWeight: '700', color: C.blue, letterSpacing: 0.6 },
  dateDay: { fontSize: 22, fontWeight: '700', color: C.ink, marginTop: -1 },
  when: { fontSize: 13, color: C.sub },
  result: { width: 40, height: 26, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  resultText: { fontSize: 12, fontWeight: '800', color: C.white, letterSpacing: 0.4 },
  score: { fontSize: 17, fontWeight: '700', color: C.ink, fontVariant: ['tabular-nums'] },
  postTitle: { fontSize: 28, lineHeight: 33, fontWeight: '800', color: C.ink, letterSpacing: -0.6, marginBottom: 6 },
  eventBox: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 12, backgroundColor: C.soft, marginBottom: 16 },
  pollRow: { flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: C.rule, overflow: 'hidden' },
  pollFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: C.soft },
  pollLabel: { flex: 1, fontSize: 15, color: C.ink },
  pollPct: { fontSize: 15, fontWeight: '600', color: C.sub, fontVariant: ['tabular-nums'] },
  like: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20, alignSelf: 'flex-start' },
});
