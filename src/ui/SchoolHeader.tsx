import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Crest } from "@/theme/Crest";
import { useTheme } from "@/theme/ThemeContext";

export function SchoolHeader({ subtitle }: { subtitle?: string }) {
  const { school, colors } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.primary }]}>
      <Crest school={school} size={52} />
      <View style={styles.text}>
        <Text style={styles.name}>{school.shortName}</Text>
        <Text style={styles.subtitle}>{subtitle ?? `${school.mascot} · ${school.district}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 56,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  text: { flex: 1 },
  name: { color: "#fff", fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#ffffffcc", fontSize: 13, marginTop: 2 },
});
