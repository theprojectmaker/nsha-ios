import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { GAMES, sortedPosts, upcomingEvents } from '@/data/seed';
import { usePrefs, visibleTo } from '@/prefs';
import { C, F, T } from '@/theme';
import { DateBlock, GameCard, Panel, PostItem, Scroller, SectionLabel, Slash, Tag, greeting, hebrewDate, inDays, longDate, tap } from '@/ui';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { role } = usePrefs();
  const posts = sortedPosts().filter((p) => visibleTo(role, p.audience));
  const alert = posts.find((p) => p.type === 'alert');
  const next = upcomingEvents().filter((p) => visibleTo(role, p.audience))[0];
  const latest = posts.filter((p) => p.type !== 'alert').slice(0, 3);
  const games = [...GAMES].sort((a, b) => b.date.localeCompare(a.date));
  const now = new Date();
  const heb = hebrewDate(now);

  return (
    <Scroller top={0} bottom={insets.bottom} pad={false}>
      {/* Hero */}
      <View style={[s.hero, { paddingTop: insets.top + 12 }]}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#2F7DC0" />
              <Stop offset="1" stopColor={C.blue} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#hero)" />
        </Svg>
        <Image source={require('../../../assets/lion.png')} style={s.lion} resizeMode="contain" accessibilityIgnoresInvertColors />
        <View style={s.heroCol}>
          <View style={s.heroTop}>
            <Text style={s.brand}>NSHA</Text>
            <Pressable onPress={() => { tap(); router.push('/settings'); }} hitSlop={8} accessibilityRole="button" accessibilityLabel="Settings" style={({ pressed }) => [s.gear, pressed && { opacity: 0.6 }]}>
              <Ionicons name="person" size={17} color={C.blueDark} />
            </Pressable>
          </View>
          <Text style={s.hello}>{greeting(now)},</Text>
          <Text style={s.lions}>Lions</Text>
          <Text style={s.today}>
            {now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            {heb ? `  ·  ${heb}` : ''}
          </Text>
        </View>
      </View>
      <View style={s.band}>
        <Slash width={150} height={12} color={C.gold} bars={4} />
      </View>

      <View style={s.col}>
        {alert ? (
          <Pressable onPress={() => { tap(); router.push(`/post/${alert.id}`); }} accessibilityRole="button" accessibilityLabel={alert.title} style={({ pressed }) => [s.alert, pressed && { opacity: 0.8 }]}>
            <Tag label="Alert" color={C.alert} />
            <Text style={s.alertTitle}>{alert.title}</Text>
            <Text style={s.alertBody} numberOfLines={2}>{alert.body}</Text>
          </Pressable>
        ) : null}

        {next ? (
          <>
            <SectionLabel title="Next up" action="Calendar" onAction={() => router.navigate('/calendar')} />
            <Pressable onPress={() => { tap(); router.push(`/post/${next.id}`); }} accessibilityRole="button" accessibilityLabel={next.title}>
              {({ pressed }) => (
                <Panel accent={C.gold} style={[s.next, pressed && { opacity: 0.7 }]}>
                  <DateBlock iso={next.eventDate!} size={74} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.nextTitle}>{next.title}</Text>
                    <Text style={T.meta}>{longDate(next.eventDate!)}{next.eventTime ? ` · ${next.eventTime}` : ''}</Text>
                    {next.eventLocation ? <Text style={T.meta}>{next.eventLocation}</Text> : null}
                    <Tag label={inDays(next.eventDate!)} color={C.gold} text={C.black} style={{ marginTop: 8 }} />
                  </View>
                </Panel>
              )}
            </Pressable>
          </>
        ) : null}

        <SectionLabel title="Scoreboard" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.games}>
        {games.map((g) => <GameCard key={g.id} game={g} />)}
      </ScrollView>

      <View style={s.col}>
        <SectionLabel title="Latest" action="All news" onAction={() => router.navigate('/news')} />
        {latest.map((p) => <PostItem key={p.id} post={p} />)}

        <View style={s.footer}>
          <Slash width={84} height={9} />
          <Text style={s.go}>Go Lions</Text>
        </View>
      </View>
    </Scroller>
  );
}

const s = StyleSheet.create({
  hero: { overflow: 'hidden', paddingBottom: 26, minHeight: 300 },
  heroCol: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 18 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  brand: { fontFamily: F.slant, fontSize: 24, color: C.white, letterSpacing: 1 },
  gear: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  lion: { position: 'absolute', right: -70, bottom: -4, width: 360, height: 159, opacity: 0.95 },
  hello: { fontFamily: F.slantBold, fontSize: 22, color: C.white, textTransform: 'uppercase', letterSpacing: 0.8 },
  lions: { fontFamily: F.slant, fontSize: 92, lineHeight: 88, color: C.white, textTransform: 'uppercase', marginTop: 2, textShadowColor: 'rgba(0,0,0,0.18)', textShadowOffset: { width: 2, height: 3 }, textShadowRadius: 0 },
  today: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.88)', marginTop: 6, maxWidth: 230 },
  band: { height: 12, backgroundColor: C.black, justifyContent: 'center', paddingLeft: 18 },
  col: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 18 },
  alert: { backgroundColor: C.black, borderRadius: 10, padding: 16, marginTop: 20, gap: 6 },
  alertTitle: { fontFamily: F.cond, fontSize: 22, lineHeight: 24, color: C.white, textTransform: 'uppercase' },
  alertBody: { fontSize: 14, lineHeight: 19, color: 'rgba(255,255,255,0.7)' },
  next: { flexDirection: 'row', gap: 14, padding: 16, paddingLeft: 21 },
  nextTitle: { fontFamily: F.slant, fontSize: 30, lineHeight: 30, color: C.ink, textTransform: 'uppercase', marginBottom: 4 },
  games: { paddingHorizontal: 18 },
  footer: { alignItems: 'center', gap: 8, marginTop: 28 },
  go: { fontFamily: F.slant, fontSize: 26, color: C.faint, textTransform: 'uppercase', letterSpacing: 1 },
});
