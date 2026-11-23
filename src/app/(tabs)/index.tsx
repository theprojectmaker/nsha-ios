import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { sortedPosts, upcomingEvents } from '@/data/seed';
import { usePrefs, visibleTo } from '@/prefs';
import { C, F, R, T, shadow } from '@/theme';
import { Card, DateTile, IconTile, PostCard, Screen, SectionHeader, inDays, longDate, tap, type IconName } from '@/ui';

export default function Home() {
  const { role } = usePrefs();
  const posts = sortedPosts().filter((p) => visibleTo(role, p.audience));
  const alert = posts.find((p) => p.type === 'alert');
  const next = upcomingEvents().filter((p) => visibleTo(role, p.audience))[0];
  const latest = posts.filter((p) => p.type !== 'alert').slice(0, 2);

  return (
    <Screen>
      {alert ? (
        <Pressable onPress={() => { tap(); router.push(`/post/${alert.id}`); }} accessibilityRole="button" style={({ pressed }) => [s.alert, pressed && { opacity: 0.8 }]}>
          <Ionicons name="alert-circle" size={22} color={C.red} />
          <View style={{ flex: 1 }}>
            <Text style={s.alertTitle}>{alert.title}</Text>
            <Text style={s.alertBody} numberOfLines={2}>{alert.body}</Text>
          </View>
          <Ionicons name="chevron-forward" size={17} color={C.red} />
        </Pressable>
      ) : null}

      {next ? (
        <>
          <Text style={[T.eyebrow, { marginBottom: 10 }]}>Up next</Text>
          <Card onPress={() => router.push(`/post/${next.id}`)} label={next.title} style={s.next}>
            <View style={s.nextTop}>
              <DateTile iso={next.eventDate!} size={64} />
              <View style={s.nextWhen}>
                <Text style={s.nextWhenText}>{inDays(next.eventDate!)}</Text>
              </View>
            </View>
            <Text style={s.nextTitle}>{next.title}</Text>
            <Text style={T.small}>{longDate(next.eventDate!)}{next.eventTime ? ` · ${next.eventTime}` : ''}</Text>
            {next.eventLocation ? (
              <View style={s.nextPlace}>
                <Ionicons name="location-outline" size={15} color={C.sub} />
                <Text style={T.small}>{next.eventLocation}</Text>
              </View>
            ) : null}
          </Card>
        </>
      ) : null}

      <View style={s.quick}>
        <Quick icon="calendar-outline" label="Calendar" onPress={() => router.navigate('/calendar')} />
        <Quick icon="newspaper-outline" label="News" onPress={() => router.navigate('/news')} />
        <Quick icon="call-outline" label="Contact" onPress={() => router.navigate('/school')} />
      </View>

      <SectionHeader title="Latest news" action="See all" onAction={() => router.navigate('/news')} />
      {latest.map((p) => <PostCard key={p.id} post={p} />)}

      <View style={s.footer}>
        <Image source={require('../../../assets/nsha-logo.png')} style={s.footLogo} resizeMode="contain" />
        <Text style={s.footText}>Go Lions</Text>
      </View>
    </Screen>
  );
}

function Quick({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={() => { tap(); onPress(); }} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [s.quickTile, pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}>
      <IconTile icon={icon} size={40} />
      <Text style={s.quickText}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  alert: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: R.card, backgroundColor: C.redPale, marginBottom: 24 },
  alertTitle: { fontSize: 15, fontWeight: '700', color: C.ink },
  alertBody: { fontSize: 13, lineHeight: 18, color: C.sub, marginTop: 2 },
  next: { padding: 20, marginBottom: 24 },
  nextTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  nextWhen: { backgroundColor: C.goldPale, paddingHorizontal: 12, paddingVertical: 6, borderRadius: R.pill },
  nextWhenText: { fontSize: 13, fontWeight: '700', color: C.goldDeep },
  nextTitle: { fontSize: 26, lineHeight: 30, fontFamily: F.display, color: C.ink, letterSpacing: -0.5, marginBottom: 4 },
  nextPlace: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  quick: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  quickTile: { flex: 1, alignItems: 'center', gap: 8, paddingVertical: 16, borderRadius: R.card, backgroundColor: C.card, ...shadow },
  quickText: { fontSize: 13, fontWeight: '600', color: C.ink },
  footer: { alignItems: 'center', marginTop: 24, opacity: 0.55 },
  footLogo: { width: 90, height: 62 },
  footText: { ...T.eyebrow, marginTop: 6 },
});
