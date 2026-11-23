import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Text } from 'react-native';
import { usePrefs, type Role } from '@/prefs';
import { C, T } from '@/theme';
import { Page, Panel, Row, SectionLabel } from '@/ui';

const ROLES: { id: Role; title: string; detail: string }[] = [
  { id: 'parent', title: 'Parent', detail: 'Parent and school-wide posts' },
  { id: 'student', title: 'Student', detail: 'Student and school-wide posts' },
  { id: 'everyone', title: 'Show everything', detail: 'Every post' },
];

export default function Settings() {
  const { role, setRole } = usePrefs();
  return (
    <Page title="Settings" back>
      <SectionLabel title="I am a" />
      <Panel>
        {ROLES.map((r, i) => (
          <Row
            key={r.id}
            title={r.title}
            detail={r.detail}
            onPress={() => setRole(r.id)}
            last={i === ROLES.length - 1}
            right={<Ionicons name={role === r.id ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={role === r.id ? C.gold : C.faint} />}
          />
        ))}
      </Panel>

      <SectionLabel title="Appearance" />
      <Panel>
        <Row icon="contrast" title="Light and dark" detail="Follows your iPhone's appearance setting" last />
      </Panel>

      <Text style={[T.meta, { textAlign: 'center', marginTop: 18 }]}>NSHA {Constants.expoConfig?.version ?? ''}</Text>
    </Page>
  );
}
