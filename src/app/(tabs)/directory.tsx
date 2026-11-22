import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { linksForSchool, staffForSchool } from "@/data/seed";
import { useTheme } from "@/theme/ThemeContext";
import { Card, Screen, SectionTitle } from "@/ui/kit";
import { SchoolHeader } from "@/ui/SchoolHeader";

export default function Directory() {
  const { school, colors } = useTheme();
  const staff = staffForSchool(school.id);
  const links = linksForSchool(school.id);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.list}>
        <SchoolHeader subtitle="Staff & quick links" />

        <SectionTitle>Quick Links</SectionTitle>
        <Card>
          {links.map((l, i) => (
            <Pressable
              key={l.id}
              onPress={() => Linking.openURL(l.url)}
              style={[styles.linkRow, i < links.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <Ionicons name="link" size={18} color={colors.primary} />
              <Text style={[styles.linkLabel, { color: colors.text }]}>{l.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </Pressable>
          ))}
        </Card>

        <SectionTitle>Staff Directory</SectionTitle>
        {staff.map((person) => (
          <Card key={person.id}>
            <Text style={[styles.staffName, { color: colors.text }]}>{person.name}</Text>
            <Text style={[styles.staffRole, { color: colors.muted }]}>
              {person.role} · {person.department}
            </Text>
            <Pressable onPress={() => Linking.openURL(`mailto:${person.email}`)} style={styles.contactRow}>
              <Ionicons name="mail-outline" size={15} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.primary }]}>{person.email}</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(`tel:${person.phone}`)} style={styles.contactRow}>
              <Ionicons name="call-outline" size={15} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.primary }]}>{person.phone}</Text>
            </Pressable>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 24 },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  linkLabel: { flex: 1, fontSize: 15, fontWeight: "600" },
  staffName: { fontSize: 16, fontWeight: "700" },
  staffRole: { fontSize: 13, marginTop: 2, marginBottom: 8 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 3 },
  contactText: { fontSize: 13, fontWeight: "600" },
});
