import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { GAMES, sortedPosts, upcomingEvents } from '@/data/seed';
import { usePrefs, visibleTo } from '@/prefs';
import { C, F, GUTTER, T } from '@/theme';
import { EventRow, NewsRow, ScoreRow, Scroller, Section, greeting, hebrewDate, tap } from '@/ui';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { role } = usePrefs();
  const posts = sortedPosts().filter((p) => visibleTo(role, p.audience));
  const alert = posts.find((p) => p.type === 'alert');
  const events = upcomingEvents().filter((p) => visibleTo(role, p.audience)).slice(0, 2);
  const latest = posts.filter((p) => p.type !== 'alert').slice(0, 3);
  const games = [...GAMES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const now = new Date();
  const heb = hebrewDate(now);
  const lionW = Math.min(width * 0.62, 300);

  return (
    <Scroller top={0} bottom={insets.bottom}>
      <View style={[s.hero, { paddingTop: insets.top + 10 }]}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#2C78B8" />
              <Stop offset="1" stopColor={C.blueLogo} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#hero)" />
        </Svg>
        <View style={s.col}>
          <View style={s.heroTop}>
            <Text style={s.brand}>NSHA</Text>
            <Pressable onPress={() => { tap(); router.push('/settings'); }} hitSlop={10} accessibilityRole="button" accessibilityLabel="Settings">
              <Ionicons name="person-circle" size={32} color={C.white} />
            </Pressable>
          </View>
          <Text style={s.hello}>{greeting(now)}</Text>
          <Text style={s.lions}>Lions</Text>
          <Text style={s.today}>
            {now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            {heb ? `  ·  ${heb}` : ''}
          </Text>
          <Animated.Image entering={FadeIn.duration(500)} source={require('../../../assets/lion.png')} style={[s.lion, { width: lionW, height: lionW * (452 / 1024) }]} resizeMode="contain" accessibilityLabel="NSHA lion" />
        </View>
      </View>
      <View style={s.goldLine} />

      <View style={s.col}>
        {alert ? (
          <Pressable onPress={() => { tap(); router.push(`/post/${alert.id}`); }} accessibilityRole="button" accessibilityLabel={alert.title} style={({ pressed }) => [s.alert, pressed && { opacity: 0.7 }]}>
            <Ionicons name="alert-circle" size={22} color={C.red} />
            <View style={{ flex: 1 }}>
              <Text style={T.rowTitle}>{alert.title}</Text>
              <Text style={T.meta} numberOfLines={1}>{alert.body}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.faint} />
          </Pressable>
        ) : null}

        {events.length ? (
          <Section title="Coming up" action="Calendar" onAction={() => router.navigate('/calendar')} first={!alert}>
            {events.map((e, i) => <EventRow key={e.id} post={e} last={i === events.length - 1} />)}
          </Section>
        ) : null}

        <Section title="Scores">
          {games.map((g, i) => <ScoreRow key={g.id} game={g} last={i === games.length - 1} />)}
        </Section>

        <Section title="Latest news" action="See all" onAction={() => router.navigate('/news')}>
          {latest.map((p, i) => <NewsRow key={p.id} post={p} last={i === latest.length - 1} />)}
        </Section>
      </View>
    </Scroller>
  );
}

const s = StyleSheet.create({
  col: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: GUTTER },
  hero: { overflow: 'hidden' },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  brand: { fontFamily: F.slant, fontSize: 22, color: C.white, letterSpacing: 1 },
  hello: { fontSize: 17, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  lions: { fontFamily: F.slant, fontSize: 68, lineHeight: 66, color: C.white, textTransform: 'uppercase', marginTop: 2 },
  today: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  lion: { alignSelf: 'flex-end', marginTop: -6, marginBottom: -2 },
  goldLine: { height: 4, backgroundColor: C.gold },
  alert: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, backgroundColor: C.redSoft, marginTop: 20 },
});
