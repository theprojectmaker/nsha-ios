import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Text } from 'react-native';
import { usePrefs, type Role } from '@/prefs';
import { C, T } from '@/theme';
import { Page, Row, Section } from '@/ui';

const ROLES: { id: Role; title: string; detail: string }[] = [
  { id: 'parent', title: 'Parent', detail: 'Parent and school-wide posts' },
  { id: 'student', title: 'Student', detail: 'Student and school-wide posts' },
  { id: 'everyone', title: 'Show everything', detail: 'Every post' },
];

export default function Settings() {
  const { role, setRole } = usePrefs();
  return (
    <Page title="Settings" back>
      <Section title="I am a" first>
        {ROLES.map((r, i) => (
          <Row
            key={r.id}
            title={r.title}
            sub={r.detail}
            onPress={() => setRole(r.id)}
            last={i === ROLES.length - 1}
            right={role === r.id ? <Ionicons name="checkmark" size={20} color={C.blue} /> : <Text> </Text>}
          />
        ))}
      </Section>
      <Section title="Appearance">
        <Row title="Light and dark" sub="Follows your iPhone's appearance setting" last />
      </Section>
      <Text style={[T.meta, { marginTop: 24 }]}>NSHA {Constants.expoConfig?.version ?? ''}</Text>
    </Page>
  );
}
