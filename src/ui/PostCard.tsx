import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Post } from "@/data/types";
import { useTheme } from "@/theme/ThemeContext";
import { Card, Pill } from "./kit";

const PHOTO_ICONS: Record<NonNullable<Post["photoIcon"]>, keyof typeof Ionicons.glyphMap> = {
  trophy: "trophy",
  building: "business",
  book: "book",
  art: "color-palette",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function PostCard({ post }: { post: Post }) {
  const { colors } = useTheme();
  return (
    <Card>
      <View style={styles.topRow}>
        <View style={styles.badges}>
          {post.pinned && <Pill label="PINNED" tone="accent" />}
          {post.type === "event" && <Pill label="EVENT" tone="primary" />}
        </View>
        <Text style={[styles.date, { color: colors.muted }]}>{formatDate(post.postedAt)}</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
      <Text style={[styles.author, { color: colors.muted }]}>{post.author}</Text>

      {post.type === "photo" && post.photoIcon && (
        <View style={[styles.photoTile, { backgroundColor: colors.primaryTint }]}>
          <Ionicons name={PHOTO_ICONS[post.photoIcon]} size={40} color={colors.primary} />
        </View>
      )}

      <Text style={[styles.body, { color: colors.text }]}>{post.body}</Text>

      {post.type === "event" && post.eventDate && (
        <View style={[styles.eventRow, { backgroundColor: colors.accentTint }]}>
          <Ionicons name="time" size={16} color={colors.primary} />
          <Text style={[styles.eventText, { color: colors.text }]}>
            {formatDate(post.eventDate)} · {post.eventLocation}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badges: { flexDirection: "row", gap: 6 },
  date: { fontSize: 12, fontWeight: "600" },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 2 },
  author: { fontSize: 13, marginBottom: 10 },
  body: { fontSize: 15, lineHeight: 21 },
  photoTile: { height: 90, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  eventRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10, padding: 8, borderRadius: 8 },
  eventText: { fontSize: 13, fontWeight: "600" },
});
