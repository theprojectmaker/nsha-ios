import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SCHOOLS } from "@/theme/schools";
import { Role, useTheme } from "@/theme/ThemeContext";
import { Crest } from "@/theme/Crest";
import { Card, Screen, SectionTitle } from "@/ui/kit";
import { SchoolHeader } from "@/ui/SchoolHeader";

const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: "everyone", label: "Everyone", hint: "see every post" },
  { id: "parent", label: "Parent", hint: "see parent + everyone posts" },
  { id: "student", label: "Student", hint: "see student + everyone posts" },
];

export default function Settings() {
  const { school, colors, role, setSchoolId, setRole } = useTheme();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.list}>
        <SchoolHeader subtitle="Settings" />

        <SectionTitle>School</SectionTitle>
        <Text style={[styles.hint, { color: colors.muted }]}>
          This is the whole re-skinning mechanism: pick a school and every color, name, and crest in the app
          updates — nothing elsewhere is hardcoded.
        </Text>
        {SCHOOLS.map((s) => {
          const active = s.id === school.id;
          return (
            <Pressable key={s.id} onPress={() => setSchoolId(s.id)}>
              <Card style={active ? { borderColor: s.primary, borderWidth: 2 } : undefined}>
                <View style={styles.schoolRow}>
                  <Crest school={s} size={44} />
                  <View style={styles.schoolInfo}>
                    <Text style={[styles.schoolName, { color: colors.text }]}>{s.shortName}</Text>
                    <Text style={[styles.schoolMeta, { color: colors.muted }]}>{s.mascot} · {s.district}</Text>
                  </View>
                  {active && <Ionicons name="checkmark-circle" size={22} color={s.primary} />}
                </View>
              </Card>
            </Pressable>
          );
        })}

        <SectionTitle>Viewing as</SectionTitle>
        <Card>
          {ROLES.map((r, i) => (
            <Pressable
              key={r.id}
              onPress={() => setRole(r.id)}
              style={[styles.roleRow, i < ROLES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <View>
                <Text style={[styles.roleLabel, { color: colors.text }]}>{r.label}</Text>
                <Text style={[styles.roleHint, { color: colors.muted }]}>{r.hint}</Text>
              </View>
              {role === r.id && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
            </Pressable>
          ))}
        </Card>

        <SectionTitle>About this app</SectionTitle>
        <Card>
          <Text style={[styles.about, { color: colors.text }]}>
            Pennant is built to be re-skinned per school. Colors, name, mascot, and crest all come from one config
            object (src/theme/schools.ts) — a real deployment adds a school there (or loads it from a backend) and
            swaps nothing else.
          </Text>
          <Text style={[styles.about, { color: colors.muted, marginTop: 10 }]}>
            The one thing this screen can't change is the home-screen app icon — iOS bakes that into the build.
            Adding a school-specific icon is a one-time rebuild with a new image, not a runtime setting.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 24 },
  hint: { fontSize: 13, marginHorizontal: 16, marginBottom: 10, lineHeight: 18 },
  schoolRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  schoolInfo: { flex: 1 },
  schoolName: { fontSize: 16, fontWeight: "700" },
  schoolMeta: { fontSize: 13, marginTop: 2 },
  roleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  roleLabel: { fontSize: 15, fontWeight: "600" },
  roleHint: { fontSize: 12, marginTop: 2 },
  about: { fontSize: 14, lineHeight: 20 },
});
