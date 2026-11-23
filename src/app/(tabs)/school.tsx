import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { DIVISIONS, OFFICES } from '@/data/seed';
import { C, F, T } from '@/theme';
import { Page, Panel, Row, SectionLabel, Slash, tap, type IconName } from '@/ui';

const DIVISION_ICONS: IconName[] = ['flower', 'pencil', 'book', 'school'];

export default function School() {
  return (
    <Page title="School">
      <View style={s.crest}>
        <Image source={require('../../../assets/nsha-logo.png')} style={s.logo} resizeMode="contain" />
        <Text style={s.name}>North Shore Hebrew Academy</Text>
        <Text style={[T.meta, { color: 'rgba(255,255,255,0.7)' }]}>Great Neck, New York</Text>
        <Slash width={110} height={10} style={{ marginTop: 14 }} />
      </View>

      <SectionLabel title="Contact" />
      <Panel>
        {OFFICES.map((o, i) => (
          <Row
            key={o.id}
            title={o.name}
            detail={o.detail}
            last={i === OFFICES.length - 1}
            right={
              <View style={s.actions}>
                <Action icon="mail" label={`Email ${o.name}`} onPress={() => Linking.openURL(`mailto:${o.email}`)} />
                <Action icon="call" label={`Call ${o.name}`} onPress={() => Linking.openURL(`tel:${o.phone.replace(/[^0-9]/g, '')}`)} />
              </View>
            }
          />
        ))}
      </Panel>

      <SectionLabel title="Divisions" />
      <Panel>
        {DIVISIONS.map((d, i) => <Row key={d} icon={DIVISION_ICONS[i]} title={d} last={i === DIVISIONS.length - 1} />)}
      </Panel>

      <SectionLabel title="App" />
      <Panel>
        <Row icon="settings" title="Settings" detail="Parent or student view" onPress={() => router.push('/settings')} last />
      </Panel>

      <Text style={[T.meta, { textAlign: 'center', marginTop: 18 }]}>Contact details are samples until the school adds its own.</Text>
    </Page>
  );
}

function Action({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={() => { tap(); onPress(); }} hitSlop={6} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [s.action, pressed && { opacity: 0.6 }]}>
      <Ionicons name={icon} size={16} color={C.black} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  crest: { backgroundColor: C.black, borderRadius: 10, alignItems: 'center', paddingVertical: 26, paddingHorizontal: 16 },
  logo: { width: 210, height: 143, marginBottom: 12 },
  name: { fontFamily: F.slant, fontSize: 28, lineHeight: 29, color: C.white, textTransform: 'uppercase', textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 8 },
  action: { width: 36, height: 36, borderRadius: 6, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
});
