import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { postsForSchool } from "@/data/seed";
import { useTheme } from "@/theme/ThemeContext";
import { Card, Screen, SectionTitle } from "@/ui/kit";
import { SchoolHeader } from "@/ui/SchoolHeader";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function CalendarScreen() {
  const { school, colors } = useTheme();

  const events = useMemo(
    () =>
      postsForSchool(school.id)
        .filter((p) => p.type === "event" && p.eventDate)
        .sort((a, b) => a.eventDate!.localeCompare(b.eventDate!)),
    [school.id]
  );

  return (
    <Screen>
      <FlatList
        data={events}
        keyExtractor={(e) => e.id}
        ListHeaderComponent={
          <>
            <SchoolHeader subtitle="Upcoming events" />
            <SectionTitle>Calendar</SectionTitle>
          </>
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <View style={[styles.dateBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.dateBadgeDay}>{new Date(item.eventDate! + "T00:00:00").getDate()}</Text>
                <Text style={styles.dateBadgeMonth}>
                  {new Date(item.eventDate! + "T00:00:00").toLocaleDateString(undefined, { month: "short" })}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.meta, { color: colors.muted }]}>
                  {formatDate(item.eventDate!)} · {item.eventLocation}
                </Text>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={28} color={colors.muted} />
            <Text style={{ color: colors.muted, marginTop: 8 }}>No upcoming events.</Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 24 },
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  dateBadge: { width: 52, height: 52, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  dateBadgeDay: { color: "#fff", fontSize: 18, fontWeight: "700" },
  dateBadgeMonth: { color: "#ffffffcc", fontSize: 11, textTransform: "uppercase" },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700" },
  meta: { fontSize: 13, marginTop: 2 },
  empty: { alignItems: "center", marginTop: 40 },
});
