import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Text } from 'react-native';
import { usePrefs, type Role } from '@/prefs';
import { C, T } from '@/theme';
import { Card, Row, Screen, SectionHeader } from '@/ui';

const ROLES: { id: Role; title: string; detail: string }[] = [
  { id: 'parent', title: 'Parent', detail: 'Parent and school-wide posts' },
  { id: 'student', title: 'Student', detail: 'Student and school-wide posts' },
  { id: 'everyone', title: 'Show everything', detail: 'Every post' },
];

export default function Settings() {
  const { role, setRole } = usePrefs();
  return (
    <Screen title="Settings" back>
      <SectionHeader title="I am a" />
      <Card style={{ paddingVertical: 4 }}>
        {ROLES.map((r, i) => (
          <Row
            key={r.id}
            title={r.title}
            detail={r.detail}
            onPress={() => setRole(r.id)}
            last={i === ROLES.length - 1}
            right={role === r.id ? <Ionicons name="checkmark-circle" size={22} color={C.blue} /> : <Ionicons name="ellipse-outline" size={22} color={C.line} />}
          />
        ))}
      </Card>

      <SectionHeader title="Appearance" />
      <Card style={{ paddingVertical: 4 }}>
        <Row icon="contrast-outline" title="Light and dark" detail="Follows your iPhone's appearance setting" last />
      </Card>

      <Text style={[T.small, { textAlign: 'center', marginTop: 16 }]}>
        NSHA {Constants.expoConfig?.version ?? ''}
      </Text>
    </Screen>
  );
}
