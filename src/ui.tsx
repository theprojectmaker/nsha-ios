import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePollVote, useReaction } from './data/interactions';
import type { Post } from './data/types';
import { Glass } from './glass';
import { C, F, R, T, shadow } from './theme';

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
export function daysUntil(iso: string, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((day(iso).getTime() - start) / 86400000);
}
export function inDays(iso: string) {
  const n = daysUntil(iso);
  return n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`;
}

// Page wrapper: content scrolls under one floating glass bar (logo, school name, profile button).
export function Screen({ title, back, children }: { title?: string; back?: boolean; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    tap();
    setTimeout(() => setRefreshing(false), 700);
  };
  const barH = 64;
  return (
    <View style={s.root}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8 + barH + 18, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 120 : 40) }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.blue} colors={[C.blue]} progressViewOffset={insets.top + barH + 8} />}
      >
        <Animated.View entering={FadeIn.duration(260)} style={s.col}>
          {title ? <Text style={[T.h1, { marginBottom: 14 }]}>{title}</Text> : null}
          {children}
        </Animated.View>
      </ScrollView>
      <View pointerEvents="box-none" style={[s.pinned, { paddingTop: insets.top + 8 }]}>
        <View style={s.col} pointerEvents="box-none">
          <Header back={back} />
        </View>
      </View>
    </View>
  );
}

function Header({ back }: { back?: boolean }) {
  return (
    <Glass style={s.header}>
      {back ? (
        <Pressable onPress={() => { tap(); router.canGoBack() ? router.back() : router.replace('/'); }} hitSlop={8} accessibilityRole="button" accessibilityLabel="Back" style={({ pressed }) => [s.back, pressed && { opacity: 0.6 }]}>
          <Ionicons name="chevron-back" size={22} color={C.ink} />
        </Pressable>
      ) : null}
      <Image source={require('../assets/nsha-logo.png')} style={s.logo} resizeMode="contain" />
      <View style={{ flex: 1 }}>
        <Text style={s.eyebrow} numberOfLines={1}>North Shore Hebrew Academy</Text>
        <Text style={s.headName} numberOfLines={1}>{greeting()}</Text>
      </View>
      {back ? null : (
        <Pressable
          onPress={() => { tap(); router.push('/settings'); }}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          style={({ pressed }) => [s.avatar, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="person" size={17} color={C.white} />
        </Pressable>
      )}
    </Glass>
  );
}

export function Card({ children, style, onPress, label }: { children: React.ReactNode; style?: ViewStyle | ViewStyle[]; onPress?: () => void; label?: string }) {
  if (!onPress) return <View style={[s.card, style]}>{children}</View>;
  return (
    <Pressable onPress={() => { tap(); onPress(); }} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [s.card, style, pressed && s.pressed]}>
      {children}
    </Pressable>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={s.section}>
      <Text style={T.h2}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={() => { tap(); onAction(); }} hitSlop={8} accessibilityRole="button">
          <Text style={s.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function IconTile({ icon, tone = 'blue', size = 40 }: { icon: IconName; tone?: 'blue' | 'gold' | 'red'; size?: number }) {
  const bg = tone === 'gold' ? C.goldPale : tone === 'red' ? C.redPale : C.bluePale;
  const fg = tone === 'gold' ? C.goldDeep : tone === 'red' ? C.red : C.blueDeep;
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={size * 0.5} color={fg} />
    </View>
  );
}

export function DateTile({ iso, size = 54 }: { iso: string; size?: number }) {
  const d = day(iso);
  return (
    <View style={[s.dateTile, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Text style={s.dateMonth}>{d.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</Text>
      <Text style={s.dateDay}>{d.getDate()}</Text>
    </View>
  );
}

export function Pill({ label, tone = 'blue' }: { label: string; tone?: 'blue' | 'gold' | 'red' }) {
  const bg = tone === 'gold' ? C.goldPale : tone === 'red' ? C.redPale : C.bluePale;
  const fg = tone === 'gold' ? C.goldDeep : tone === 'red' ? C.red : C.blueDeep;
  return (
    <View style={[s.pill, { backgroundColor: bg }]}>
      <Text style={[s.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function Chips<V extends string>({ options, value, onChange }: { options: readonly V[]; value: V; onChange: (v: V) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips} style={{ marginBottom: 16, marginHorizontal: -20 }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable key={o} onPress={() => { tap(); onChange(o); }} style={[s.chip, on && s.chipOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
            <Text style={[s.chipText, on && s.chipTextOn]}>{o}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const TYPE_ICON: Record<Post['type'], IconName> = {
  text: 'megaphone-outline',
  photo: 'images-outline',
  event: 'calendar-outline',
  poll: 'stats-chart-outline',
  alert: 'alert-circle',
};
const PHOTO_ICON: Record<NonNullable<Post['photoIcon']>, IconName> = {
  trophy: 'trophy',
  heart: 'heart',
  flask: 'flask',
  music: 'musical-notes',
};

export function PostCard({ post, full }: { post: Post; full?: boolean }) {
  const { liked, count, toggle } = useReaction(post.id, post.baseLikes);
  const poll = usePollVote(post.id, post.pollOptions ?? []);
  const alert = post.type === 'alert';
  const open = full ? undefined : () => router.push(`/post/${post.id}`);

  // Only the content area opens the post; the poll and like buttons sit beside it, not inside it.
  const content = (
    <>
      <View style={s.postTop}>
        <IconTile icon={TYPE_ICON[post.type]} tone={alert ? 'red' : post.type === 'event' ? 'gold' : 'blue'} size={34} />
        <View style={{ flex: 1 }}>
          <Text style={s.author} numberOfLines={1}>{post.author}</Text>
          <Text style={T.small}>{shortDate(post.postedAt)}</Text>
        </View>
        {alert ? <Pill label="Important" tone="red" /> : post.pinned ? <Pill label="Pinned" tone="gold" /> : null}
      </View>

      <Text style={[s.postTitle, full && { fontSize: 22, lineHeight: 28 }]}>{post.title}</Text>
      <Text style={[T.body, { color: full ? C.ink : C.sub }]} numberOfLines={full ? undefined : 3}>{post.body}</Text>

      {post.type === 'photo' && post.photoIcon ? (
        <View style={s.photo}>
          <Ionicons name={PHOTO_ICON[post.photoIcon]} size={44} color={C.blue} />
        </View>
      ) : null}

      {post.type === 'event' && post.eventDate ? (
        <View style={s.eventRow}>
          <DateTile iso={post.eventDate} size={46} />
          <View style={{ flex: 1 }}>
            <Text style={T.h3}>{longDate(post.eventDate)}</Text>
            <Text style={T.small}>{[post.eventTime, post.eventLocation].filter(Boolean).join(' · ')}</Text>
          </View>
          <Text style={s.when}>{inDays(post.eventDate)}</Text>
        </View>
      ) : null}
    </>
  );

  return (
    <Card style={alert ? { borderWidth: 1.5, borderColor: C.red } : undefined}>
      {open ? (
        <Pressable onPress={() => { tap(); open(); }} accessibilityRole="link" accessibilityLabel={post.title} style={({ pressed }) => pressed && { opacity: 0.7 }}>
          {content}
        </Pressable>
      ) : content}

      {post.type === 'poll' && post.pollOptions ? (
        <View style={{ marginTop: 14, gap: 8 }}>
          {poll.counts.map((o) => {
            const pct = poll.total ? Math.round((o.votes / poll.total) * 100) : 0;
            const mine = poll.votedId === o.id;
            return (
              <Pressable key={o.id} onPress={() => { tap(); poll.vote(o.id); }} accessibilityRole="button" accessibilityLabel={`${o.label}, ${pct} percent`} style={s.pollRow}>
                <View style={[s.pollFill, { width: `${pct}%`, backgroundColor: mine ? C.goldPale : C.bluePale }]} />
                <View style={s.pollLabelRow}>
                  {mine ? <Ionicons name="checkmark-circle" size={16} color={C.gold} /> : null}
                  <Text style={[s.pollLabel, mine && { color: C.goldDeep }]} numberOfLines={1}>{o.label}</Text>
                  <Text style={s.pollPct}>{pct}%</Text>
                </View>
              </Pressable>
            );
          })}
          <Text style={T.small}>{poll.total} votes{poll.votedId ? ' · tap again to undo' : ''}</Text>
        </View>
      ) : null}

      <View style={s.postFoot}>
        <Pressable onPress={() => { tap(); toggle(); }} hitSlop={8} style={s.footBtn} accessibilityRole="button" accessibilityLabel={liked ? 'Unlike' : 'Like'}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={19} color={liked ? C.red : C.sub} />
          <Text style={[s.footText, liked && { color: C.red }]}>{count}</Text>
        </Pressable>
        <Pressable onPress={open ? () => { tap(); open(); } : undefined} disabled={!open} hitSlop={8} style={s.footBtn} accessibilityRole="button" accessibilityLabel={`${post.comments.length} comments`}>
          <Ionicons name="chatbubble-outline" size={17} color={C.sub} />
          <Text style={s.footText}>{post.comments.length}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

export function Row({ icon, title, detail, onPress, last, right }: { icon?: IconName; title: string; detail?: string; onPress?: () => void; last?: boolean; right?: React.ReactNode }) {
  const body = (
    <View style={[s.row, !last && s.rowLine]}>
      {icon ? <IconTile icon={icon} size={34} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={T.h3}>{title}</Text>
        {detail ? <Text style={T.small}>{detail}</Text> : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={17} color={C.faint} /> : null)}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable onPress={() => { tap(); onPress(); }} accessibilityRole="button" style={({ pressed }) => pressed && { opacity: 0.55 }}>
      {body}
    </Pressable>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  col: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20 },
  pinned: { position: 'absolute', top: 0, left: 0, right: 0 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 12, paddingRight: 10, borderRadius: 26 },
  logo: { width: 58, height: 40 },
  eyebrow: { ...T.eyebrow, fontSize: 10 },
  headName: { fontSize: 17, fontFamily: F.bold, color: C.ink, marginTop: 1 },
  back: { width: 32, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: -6 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: C.card, borderRadius: R.card, padding: 18, marginBottom: 14, ...shadow },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  section: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 12, marginBottom: 12 },
  sectionAction: { fontSize: 15, fontWeight: '600', color: C.blue },
  dateTile: { backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' },
  dateMonth: { color: C.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.8, opacity: 0.9 },
  dateDay: { color: C.white, fontSize: 21, fontFamily: F.display, marginTop: -2 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: R.pill },
  pillText: { fontSize: 12, fontWeight: '700' },
  chips: { gap: 8, paddingHorizontal: 20 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: R.pill, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  chipOn: { backgroundColor: C.inverse, borderColor: C.inverse },
  chipText: { fontSize: 14, fontWeight: '600', color: C.ink },
  chipTextOn: { color: C.onInverse },
  postTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  author: { fontSize: 14, fontWeight: '700', color: C.ink },
  postTitle: { fontSize: 18, lineHeight: 23, fontWeight: '700', color: C.ink, marginBottom: 6, letterSpacing: -0.2 },
  photo: { height: 120, borderRadius: R.tile, backgroundColor: C.bluePale, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, padding: 10, borderRadius: R.tile, backgroundColor: C.bg },
  when: { fontSize: 13, fontWeight: '700', color: C.blue },
  pollRow: { minHeight: 42, borderRadius: 12, borderWidth: 1, borderColor: C.line, overflow: 'hidden', justifyContent: 'center' },
  pollFill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  pollLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 },
  pollLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: C.ink },
  pollPct: { fontSize: 14, fontWeight: '700', color: C.sub },
  postFoot: { flexDirection: 'row', gap: 22, marginTop: 14 },
  footBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footText: { fontSize: 14, fontWeight: '600', color: C.sub },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
});
