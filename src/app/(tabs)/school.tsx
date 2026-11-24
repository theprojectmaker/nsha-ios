import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { DIVISIONS, OFFICES } from '@/data/seed';
import { C, T } from '@/theme';
import { Page, Row, Section, tap, type IconName } from '@/ui';

export default function School() {
  return (
    <Page title="School">
      <View style={s.crest}>
        <Image source={require('../../../assets/nsha-logo.png')} style={s.logo} resizeMode="contain" />
        <Text style={s.name}>North Shore Hebrew Academy</Text>
        <Text style={T.meta}>Great Neck, New York</Text>
      </View>

      <Section title="Contact">
        {OFFICES.map((o, i) => (
          <Row
            key={o.id}
            title={o.name}
            sub={o.detail}
            last={i === OFFICES.length - 1}
            right={
              <View style={s.actions}>
                <Action icon="mail-outline" label={`Email ${o.name}`} onPress={() => Linking.openURL(`mailto:${o.email}`)} />
                <Action icon="call-outline" label={`Call ${o.name}`} onPress={() => Linking.openURL(`tel:${o.phone.replace(/[^0-9]/g, '')}`)} />
              </View>
            }
          />
        ))}
      </Section>

      <Section title="Divisions">
        {DIVISIONS.map((d, i) => <Row key={d} title={d} last={i === DIVISIONS.length - 1} />)}
      </Section>

      <Section title="App">
        <Row title="Settings" sub="Parent or student view" onPress={() => router.push('/settings')} last />
      </Section>

      <Text style={[T.meta, { marginTop: 24 }]}>Contacts and divisions are samples until the school adds its own.</Text>
    </Page>
  );
}

function Action({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={() => { tap(); onPress(); }} hitSlop={6} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [s.action, pressed && { opacity: 0.5 }]}>
      <Ionicons name={icon} size={18} color={C.blue} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  crest: { alignItems: 'center', paddingVertical: 16 },
  logo: { width: 190, height: 129, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '700', color: C.ink, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 6 },
  action: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' },
});
