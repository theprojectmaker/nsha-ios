import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';
import { usePollVote, useReaction } from './data/interactions';
import type { Game, Post } from './data/types';
import { C, F, RADIUS, T } from './theme';

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
export const monthShort = (iso: string) => day(iso).toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
export function inDays(iso: string, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const n = Math.round((day(iso).getTime() - start) / 86400000);
  return n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`;
}

// e.g. "2 Kislev 5787". Not every phone's date library has the Hebrew calendar; then it's left out.
export function hebrewDate(d = new Date()) {
  try {
    const s = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    return /\d{4}/.test(s) && !s.includes(String(d.getFullYear())) ? s : '';
  } catch {
    return '';
  }
}

// The slanted gold bars from the bottom of the NSHA logo, used as a divider.
export function Slash({ width = 120, height = 10, color = C.gold, bars = 3, style }: { width?: number; height?: number; color?: string; bars?: number; style?: ViewStyle }) {
  const gap = 5;
  const w = (width - gap * (bars - 1)) / bars;
  const lean = height * 0.9;
  return (
    <Svg width={width} height={height} style={style}>
      {Array.from({ length: bars }, (_, i) => {
        const x = i * (w + gap);
        return <Polygon key={i} points={`${x + lean},0 ${x + w},0 ${x + w - lean},${height} ${x},${height}`} fill={color} opacity={1 - i * 0.28} />;
      })}
    </Svg>
  );
}

// Skewed label like a jersey patch.
export function Tag({ label, color = C.black, text = C.onBlack, style }: { label: string; color?: string; text?: string; style?: ViewStyle }) {
  return (
    <View style={[s.tag, { backgroundColor: color }, style]}>
      <Text style={[T.tag, s.tagText, { color: text }]}>{label}</Text>
    </View>
  );
}

export function SectionLabel({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={s.section}>
      <View style={s.sectionMark} />
      <Text style={[T.label, { flex: 1 }]}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={() => { tap(); onAction(); }} hitSlop={8} accessibilityRole="button">
          <Text style={s.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Panel({ children, style, accent }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; accent?: string }) {
  return (
    <View style={[s.panel, style]}>
      {accent ? <View style={[s.accent, { backgroundColor: accent }]} /> : null}
      {children}
    </View>
  );
}

// Inner pages: big slanted title, gold slash, content scrolls below.
export function Page({ title, back, children }: { title: string; back?: boolean; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Scroller top={insets.top + 14} bottom={insets.bottom}>
      <View style={s.pageHead}>
        {back ? (
          <Pressable onPress={() => { tap(); router.canGoBack() ? router.back() : router.replace('/'); }} hitSlop={10} accessibilityRole="button" accessibilityLabel="Back" style={s.back}>
            <Ionicons name="chevron-back" size={26} color={C.ink} />
          </Pressable>
        ) : null}
        <Text style={T.title}>{title}</Text>
      </View>
      <Slash width={96} height={9} style={{ marginBottom: 20 }} />
      {children}
    </Scroller>
  );
}

export function Scroller({ top, bottom, children, pad = true }: { top: number; bottom: number; children: React.ReactNode; pad?: boolean }) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    tap();
    setTimeout(() => setRefreshing(false), 700);
  };
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.page }}
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom + (Platform.OS === 'web' ? 100 : 36) }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.gold} colors={[C.gold]} />}
    >
      <View style={pad ? s.col : s.colFull}>{children}</View>
    </ScrollView>
  );
}

export function DateBlock({ iso, size = 58 }: { iso: string; size?: number }) {
  return (
    <View style={[s.dateBlock, { width: size, height: size }]}>
      <Text style={s.dateMonth}>{monthShort(iso)}</Text>
      <Text style={[s.dateDay, { fontSize: size * 0.5, lineHeight: size * 0.52 }]}>{day(iso).getDate()}</Text>
    </View>
  );
}

const TYPE: Record<Post['type'], { label: string; color: string; icon: IconName }> = {
  text: { label: 'News', color: C.ink, icon: 'megaphone' },
  photo: { label: 'Photos', color: C.blue, icon: 'images' },
  event: { label: 'Event', color: C.gold, icon: 'calendar' },
  poll: { label: 'Poll', color: C.blue, icon: 'stats-chart' },
  alert: { label: 'Alert', color: C.alert, icon: 'alert-circle' },
};
const PHOTO_ICON: Record<NonNullable<Post['photoIcon']>, IconName> = { trophy: 'trophy', heart: 'heart', flask: 'flask', music: 'musical-notes' };

export function PostItem({ post, full }: { post: Post; full?: boolean }) {
  const { liked, count, toggle } = useReaction(post.id, post.baseLikes);
  const poll = usePollVote(post.id, post.pollOptions ?? []);
  const t = TYPE[post.type];
  const open = full ? undefined : () => router.push(`/post/${post.id}`);

  // Only the content opens the post; poll and like buttons sit beside it, not inside it.
  const content = (
    <>
      <View style={s.postTop}>
        <Tag label={t.label} color={t.color} text={post.type === 'event' ? C.black : C.onBlack} />
        {post.pinned && post.type !== 'alert' ? <Tag label="Pinned" color={C.gold} text={C.black} /> : null}
        <Text style={[T.meta, { marginLeft: 'auto' }]}>{shortDate(post.postedAt)}</Text>
      </View>
      <Text style={[T.head, full && { fontSize: 30, lineHeight: 31, fontFamily: F.slant }]}>{post.title}</Text>
      <Text style={[T.meta, { marginTop: 2, marginBottom: 8 }]}>{post.author}</Text>
      <Text style={T.body} numberOfLines={full ? undefined : 3}>{post.body}</Text>

      {post.type === 'photo' && post.photoIcon ? (
        <View style={s.photo}>
          <Slash width={180} height={70} color={C.white} bars={3} style={{ position: 'absolute', opacity: 0.12 }} />
          <Ionicons name={PHOTO_ICON[post.photoIcon]} size={46} color={C.white} />
        </View>
      ) : null}

      {post.type === 'event' && post.eventDate ? (
        <View style={s.eventRow}>
          <DateBlock iso={post.eventDate} size={50} />
          <View style={{ flex: 1 }}>
            <Text style={[T.body, { fontWeight: '700' }]}>{longDate(post.eventDate)}</Text>
            <Text style={T.meta}>{[post.eventTime, post.eventLocation].filter(Boolean).join(' · ')}</Text>
          </View>
          <Text style={s.when}>{inDays(post.eventDate)}</Text>
        </View>
      ) : null}
    </>
  );

  return (
    <Panel accent={t.color} style={s.post}>
      {open ? (
        <Pressable onPress={() => { tap(); open(); }} accessibilityRole="link" accessibilityLabel={post.title} style={({ pressed }) => pressed && { opacity: 0.65 }}>
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
                <View style={[s.pollFill, { width: `${pct}%`, backgroundColor: mine ? C.gold : C.blue, opacity: mine ? 1 : 0.22 }]} />
                <Text style={s.pollLabel} numberOfLines={1}>{mine ? '✓ ' : ''}{o.label}</Text>
                <Text style={s.pollPct}>{pct}%</Text>
              </Pressable>
            );
          })}
          <Text style={T.meta}>{poll.total} votes{poll.votedId ? ' · tap again to undo' : ''}</Text>
        </View>
      ) : null}

      <View style={s.postFoot}>
        <Pressable onPress={() => { tap(); toggle(); }} hitSlop={8} style={s.footBtn} accessibilityRole="button" accessibilityLabel={liked ? 'Unlike' : 'Like'}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={19} color={liked ? C.alert : C.sub} />
          <Text style={[s.footText, liked && { color: C.alert }]}>{count}</Text>
        </Pressable>
        <Pressable onPress={open ? () => { tap(); open(); } : undefined} disabled={!open} hitSlop={8} style={s.footBtn} accessibilityRole="button" accessibilityLabel={`${post.comments.length} comments`}>
          <Ionicons name="chatbubble-outline" size={17} color={C.sub} />
          <Text style={s.footText}>{post.comments.length}</Text>
        </Pressable>
      </View>
    </Panel>
  );
}

// One scoreboard tile: final score with a W/L patch, or the start time for an upcoming game.
export function GameCard({ game }: { game: Game }) {
  const played = game.lions !== undefined && game.them !== undefined;
  const won = played && game.lions! > game.them!;
  return (
    <View style={s.game}>
      <View style={s.gameTop}>
        <Text style={s.gameSport}>{game.sport}</Text>
        {played ? <Tag label={won ? 'W' : 'L'} color={won ? C.win : C.loss} /> : <Tag label="Next" color={C.gold} text={C.black} />}
      </View>
      <Text style={s.gameTeam}>{game.team}</Text>
      <View style={s.scoreRow}>
        <Text style={s.scoreName}>Lions</Text>
        <Text style={[s.score, played && !won && { color: 'rgba(255,255,255,0.55)' }]}>{played ? game.lions : '-'}</Text>
      </View>
      <View style={s.scoreRow}>
        <Text style={[s.scoreName, { color: 'rgba(255,255,255,0.6)' }]} numberOfLines={1}>{game.opponent}</Text>
        <Text style={[s.score, { color: played && !won ? C.white : 'rgba(255,255,255,0.55)' }]}>{played ? game.them : '-'}</Text>
      </View>
      <Text style={s.gameMeta}>{game.home ? 'Home' : 'Away'} · {played ? shortDate(game.date) : `${shortDate(game.date)}, ${game.time ?? ''}`}</Text>
    </View>
  );
}

export function Row({ icon, title, detail, onPress, last, right }: { icon?: IconName; title: string; detail?: string; onPress?: () => void; last?: boolean; right?: React.ReactNode }) {
  const body = (
    <View style={[s.row, !last && s.rowRule]}>
      {icon ? (
        <View style={s.rowIcon}>
          <Ionicons name={icon} size={18} color={C.gold} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={[T.body, { fontWeight: '700' }]}>{title}</Text>
        {detail ? <Text style={T.meta}>{detail}</Text> : null}
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
  col: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 18 },
  colFull: { width: '100%' },
  pageHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  back: { marginLeft: -6, marginRight: 2 },
  tag: { paddingHorizontal: 9, paddingVertical: 3, transform: [{ skewX: '-12deg' }], alignSelf: 'flex-start' },
  tagText: { transform: [{ skewX: '12deg' }] },
  section: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 26, marginBottom: 12 },
  sectionMark: { width: 14, height: 14, backgroundColor: C.gold, transform: [{ skewX: '-18deg' }] },
  sectionAction: { fontSize: 14, fontWeight: '700', color: C.blueInk },
  panel: { backgroundColor: C.surface, borderRadius: RADIUS, borderWidth: StyleSheet.hairlineWidth, borderColor: C.rule, overflow: 'hidden' },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  post: { padding: 16, paddingLeft: 21, marginBottom: 12 },
  postTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  photo: { height: 130, borderRadius: RADIUS - 2, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center', marginTop: 14, overflow: 'hidden' },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.rule },
  when: { fontFamily: F.slantBold, fontSize: 15, color: C.blueInk, textTransform: 'uppercase' },
  dateBlock: { backgroundColor: C.black, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  dateMonth: { fontFamily: F.cond, fontSize: 11, letterSpacing: 1.4, color: C.gold },
  dateDay: { fontFamily: F.slant, color: C.white },
  pollRow: { flexDirection: 'row', alignItems: 'center', minHeight: 40, paddingHorizontal: 12, borderRadius: 6, backgroundColor: C.page, overflow: 'hidden' },
  pollFill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  pollLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: C.ink },
  pollPct: { fontFamily: F.slantBold, fontSize: 17, color: C.ink },
  postFoot: { flexDirection: 'row', gap: 22, marginTop: 14 },
  footBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footText: { fontSize: 14, fontWeight: '600', color: C.sub },
  game: { width: 196, backgroundColor: C.black, borderRadius: RADIUS, padding: 14, marginRight: 10 },
  gameTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gameSport: { fontFamily: F.slantBold, fontSize: 15, letterSpacing: 1, color: C.gold, textTransform: 'uppercase' },
  gameTeam: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2, marginBottom: 10 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  scoreName: { flex: 1, fontFamily: F.cond, fontSize: 20, color: C.white, textTransform: 'uppercase' },
  score: { fontFamily: F.slant, fontSize: 34, lineHeight: 36, color: C.white },
  gameMeta: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  rowRule: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.rule },
  rowIcon: { width: 32, height: 32, borderRadius: 6, backgroundColor: C.black, alignItems: 'center', justifyContent: 'center' },
});
