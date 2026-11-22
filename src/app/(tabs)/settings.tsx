import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CUSTOM_SCHOOL_ID, SCHOOLS } from "@/theme/schools";
import { Role, useTheme } from "@/theme/ThemeContext";
import { Crest } from "@/theme/Crest";
import { Card, Screen, SectionTitle } from "@/ui/kit";
import { SchoolHeader } from "@/ui/SchoolHeader";

const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: "everyone", label: "Everyone", hint: "see every post" },
  { id: "parent", label: "Parent", hint: "see parent + everyone posts" },
  { id: "student", label: "Student", hint: "see student + everyone posts" },
];

const PRIMARY_SWATCHES = ["#1B4332", "#1D3557", "#4338CA", "#9D174D", "#334155", "#0F766E", "#B45309", "#111827"];
const ACCENT_SWATCHES = ["#D4A017", "#E76F51", "#F59E0B", "#38BDF8", "#FB7185", "#DC2626", "#22C55E", "#A78BFA"];

export default function Settings() {
  const { school, schoolId, colors, scheme, role, customSchool, setSchoolId, setRole, setScheme, updateCustomSchool } =
    useTheme();

  const pickSchool = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setSchoolId(id);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.list}>
        <SchoolHeader subtitle="Settings" />

        <SectionTitle>Appearance</SectionTitle>
        <View style={styles.segmentRow}>
          {(["light", "dark"] as const).map((s) => {
            const active = scheme === s;
            return (
              <Pressable
                key={s}
                onPress={() => setScheme(s)}
                style={[
                  styles.segment,
                  { borderColor: colors.border },
                  active && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <Ionicons name={s === "light" ? "sunny" : "moon"} size={16} color={active ? "#fff" : colors.text} />
                <Text style={[styles.segmentText, { color: active ? "#fff" : colors.text }]}>
                  {s === "light" ? "Light" : "Dark"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionTitle>School</SectionTitle>
        <Text style={[styles.hint, { color: colors.muted }]}>
          This is the whole re-skinning mechanism: pick a school and every color, name, and crest in the app
          updates — nothing elsewhere is hardcoded. "Design your own" proves it works for a school that isn't
          even a preset.
        </Text>
        {SCHOOLS.map((s) => {
          const active = s.id === school.id;
          return (
            <Pressable key={s.id} onPress={() => pickSchool(s.id)}>
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

        <Pressable onPress={() => pickSchool(CUSTOM_SCHOOL_ID)}>
          <Card style={schoolId === CUSTOM_SCHOOL_ID ? { borderColor: customSchool.primary, borderWidth: 2 } : undefined}>
            <View style={styles.schoolRow}>
              <Crest school={customSchool} size={44} />
              <View style={styles.schoolInfo}>
                <Text style={[styles.schoolName, { color: colors.text }]}>Design your own</Text>
                <Text style={[styles.schoolMeta, { color: colors.muted }]}>Build a live custom skin</Text>
              </View>
              {schoolId === CUSTOM_SCHOOL_ID && <Ionicons name="checkmark-circle" size={22} color={customSchool.primary} />}
            </View>
          </Card>
        </Pressable>

        {schoolId === CUSTOM_SCHOOL_ID && (
          <Card>
            <Text style={[styles.builderLabel, { color: colors.text }]}>School name</Text>
            <TextInput
              value={customSchool.name}
              onChangeText={(v) => updateCustomSchool({ name: v, shortName: v })}
              placeholder="Your School Name"
              placeholderTextColor={colors.muted}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            />

            <Text style={[styles.builderLabel, { color: colors.text, marginTop: 14 }]}>Mascot</Text>
            <TextInput
              value={customSchool.mascot}
              onChangeText={(v) => updateCustomSchool({ mascot: v })}
              placeholder="Mascots"
              placeholderTextColor={colors.muted}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            />

            <Text style={[styles.builderLabel, { color: colors.text, marginTop: 14 }]}>Crest initials</Text>
            <TextInput
              value={customSchool.crestInitials}
              onChangeText={(v) => updateCustomSchool({ crestInitials: v.toUpperCase().slice(0, 3) })}
              placeholder="YS"
              placeholderTextColor={colors.muted}
              maxLength={3}
              style={[styles.input, { color: colors.text, borderColor: colors.border, width: 90 }]}
            />

            <Text style={[styles.builderLabel, { color: colors.text, marginTop: 14 }]}>Primary color</Text>
            <View style={styles.swatchRow}>
              {PRIMARY_SWATCHES.map((hex) => (
                <Pressable
                  key={hex}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    updateCustomSchool({ primary: hex });
                  }}
                  style={[
                    styles.swatch,
                    { backgroundColor: hex },
                    customSchool.primary === hex && styles.swatchActive,
                  ]}
                />
              ))}
            </View>

            <Text style={[styles.builderLabel, { color: colors.text, marginTop: 14 }]}>Accent color</Text>
            <View style={styles.swatchRow}>
              {ACCENT_SWATCHES.map((hex) => (
                <Pressable
                  key={hex}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    updateCustomSchool({ accent: hex });
                  }}
                  style={[
                    styles.swatch,
                    { backgroundColor: hex },
                    customSchool.accent === hex && styles.swatchActive,
                  ]}
                />
              ))}
            </View>
          </Card>
        )}

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
            Marquee is built to be re-skinned per school. Colors, name, mascot, and crest all come from one config
            object (src/theme/schools.ts) — a real deployment adds a school there (or loads it from a backend) and
            swaps nothing else. "Design your own" above drives the exact same config live, from color swatches
            instead of code, and light/dark mode re-derives every surface from the same two brand colors.
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
  segmentRow: { flexDirection: "row", gap: 10, marginHorizontal: 16, marginBottom: 12 },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  segmentText: { fontSize: 13, fontWeight: "700" },
  schoolRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  schoolInfo: { flex: 1 },
  schoolName: { fontSize: 16, fontWeight: "700" },
  schoolMeta: { fontSize: 13, marginTop: 2 },
  builderLabel: { fontSize: 13, fontWeight: "700" },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, marginTop: 6 },
  swatchRow: { flexDirection: "row", gap: 10, marginTop: 8, flexWrap: "wrap" },
  swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "transparent" },
  swatchActive: { borderColor: "#111827" },
  roleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  roleLabel: { fontSize: 15, fontWeight: "600" },
  roleHint: { fontSize: 12, marginTop: 2 },
  about: { fontSize: 14, lineHeight: 20 },
});
