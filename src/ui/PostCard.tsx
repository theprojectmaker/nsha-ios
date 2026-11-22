import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { usePollVote, useReaction } from "@/data/interactions";
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

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const { colors } = useTheme();
  const { liked, count, toggle } = useReaction(post.id, post.baseLikes);
  const poll = usePollVote(post.id, post.pollOptions ?? []);
  const isAlert = post.type === "alert";

  const onLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    toggle();
  };

  const onVote = (optionId: string) => {
    Haptics.selectionAsync().catch(() => {});
    poll.vote(optionId);
  };

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 55).springify().damping(16)}>
      <Card style={isAlert ? { borderColor: colors.danger, borderWidth: 1.5 } : undefined}>
        <Pressable onPress={() => router.push(`/post/${post.id}`)}>
          <View style={styles.topRow}>
            <View style={styles.badges}>
              {isAlert && <Pill label="URGENT" tone="danger" />}
              {post.pinned && <Pill label="PINNED" tone="accent" />}
              {post.type === "event" && <Pill label="EVENT" tone="primary" />}
              {post.type === "poll" && <Pill label="POLL" tone="primary" />}
            </View>
            <Text style={[styles.date, { color: colors.muted }]}>{formatDate(post.postedAt)}</Text>
          </View>

          {isAlert && (
            <View style={[styles.alertBanner, { backgroundColor: colors.dangerTint }]}>
              <Ionicons name="warning" size={16} color={colors.danger} />
              <Text style={[styles.alertBannerText, { color: colors.danger }]}>Time-sensitive notice</Text>
            </View>
          )}

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
        </Pressable>

        {post.type === "poll" && post.pollOptions && (
          <View style={styles.pollWrap}>
            {poll.counts.map((opt) => {
              const pct = poll.total > 0 ? Math.round((opt.votes / poll.total) * 100) : 0;
              const picked = poll.votedId === opt.id;
              return (
                <Pressable key={opt.id} onPress={() => onVote(opt.id)} style={styles.pollOption}>
                  <View style={[styles.pollBarBg, { backgroundColor: colors.primaryTint }]}>
                    <View
                      style={[
                        styles.pollBarFill,
                        { width: `${pct}%`, backgroundColor: picked ? colors.accent : colors.primary },
                      ]}
                    />
                    <View style={styles.pollLabelRow}>
                      <Text style={[styles.pollLabel, { color: colors.text }]} numberOfLines={1}>
                        {picked ? "✓ " : ""}
                        {opt.label}
                      </Text>
                      <Text style={[styles.pollPct, { color: colors.text }]}>{pct}%</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
            <Text style={[styles.pollTotal, { color: colors.muted }]}>
              {poll.total} vote{poll.total === 1 ? "" : "s"} · tap to {poll.votedId ? "change your vote" : "vote"}
            </Text>
          </View>
        )}

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Pressable onPress={onLike} style={styles.likeRow}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? colors.danger : colors.muted} />
            <Text style={[styles.likeCount, { color: liked ? colors.danger : colors.muted }]}>{count}</Text>
          </Pressable>
          <Pressable onPress={() => router.push(`/post/${post.id}`)} style={styles.commentRow}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.muted} />
            <Text style={[styles.commentCount, { color: colors.muted }]}>{post.comments.length}</Text>
          </Pressable>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badges: { flexDirection: "row", gap: 6 },
  date: { fontSize: 12, fontWeight: "600" },
  alertBanner: { flexDirection: "row", alignItems: "center", gap: 6, padding: 8, borderRadius: 8, marginBottom: 10 },
  alertBannerText: { fontSize: 12, fontWeight: "700" },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 2 },
  author: { fontSize: 13, marginBottom: 10 },
  body: { fontSize: 15, lineHeight: 21 },
  photoTile: { height: 90, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  eventRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10, padding: 8, borderRadius: 8 },
  eventText: { fontSize: 13, fontWeight: "600" },
  pollWrap: { marginTop: 10, gap: 8 },
  pollOption: {},
  pollBarBg: { borderRadius: 8, overflow: "hidden", position: "relative", minHeight: 36, justifyContent: "center" },
  pollBarFill: { position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 8 },
  pollLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pollLabel: { fontSize: 13, fontWeight: "600", flex: 1, marginRight: 8 },
  pollPct: { fontSize: 13, fontWeight: "700" },
  pollTotal: { fontSize: 12, marginTop: 2 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  likeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  likeCount: { fontSize: 13, fontWeight: "700" },
  commentRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  commentCount: { fontSize: 13, fontWeight: "700" },
});
