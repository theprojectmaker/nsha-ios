import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { DIVISIONS, OFFICES } from '@/data/seed';
import { C, F, T } from '@/theme';
import { Card, Row, Screen, SectionHeader, tap, type IconName } from '@/ui';

const DIVISION_ICONS: IconName[] = ['flower-outline', 'pencil-outline', 'book-outline', 'school-outline'];

export default function School() {
  return (
    <Screen>
      <Card style={s.hero}>
        <Image source={require('../../../assets/nsha-logo.png')} style={s.logo} resizeMode="contain" />
        <Text style={s.name}>North Shore Hebrew Academy</Text>
        <Text style={T.small}>Great Neck, New York · Home of the Lions</Text>
      </Card>

      <SectionHeader title="Contact" />
      <Card style={s.list}>
        {OFFICES.map((o, i) => (
          <Row
            key={o.id}
            title={o.name}
            detail={o.detail}
            last={i === OFFICES.length - 1}
            right={
              <View style={s.actions}>
                <Action icon="mail-outline" label={`Email ${o.name}`} onPress={() => Linking.openURL(`mailto:${o.email}`)} />
                <Action icon="call" label={`Call ${o.name}`} onPress={() => Linking.openURL(`tel:${o.phone.replace(/[^0-9]/g, '')}`)} />
              </View>
            }
          />
        ))}
      </Card>

      <SectionHeader title="Divisions" />
      <Card style={s.list}>
        {DIVISIONS.map((d, i) => (
          <Row key={d} icon={DIVISION_ICONS[i]} title={d} last={i === DIVISIONS.length - 1} />
        ))}
      </Card>

      <Card style={s.list}>
        <Row icon="settings-outline" title="Settings" detail="Parent or student view" onPress={() => router.push('/settings')} last />
      </Card>

      <Text style={[T.small, s.note]}>Contact details shown here are samples until the school adds its own.</Text>
    </Screen>
  );
}

function Action({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={() => { tap(); onPress(); }} hitSlop={6} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [s.action, pressed && { opacity: 0.6 }]}>
      <Ionicons name={icon} size={17} color={C.blue} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 28, marginBottom: 12 },
  logo: { width: 200, height: 136, marginBottom: 14 },
  name: { fontSize: 22, fontFamily: F.display, color: C.ink, letterSpacing: -0.4, textAlign: 'center', marginBottom: 4 },
  list: { paddingVertical: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  action: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.bluePale, alignItems: 'center', justifyContent: 'center' },
  note: { textAlign: 'center', marginTop: 6 },
});
