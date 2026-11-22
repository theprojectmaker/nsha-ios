import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { getPost } from "@/data/seed";
import { useReaction } from "@/data/interactions";
import { useTheme } from "@/theme/ThemeContext";
import { Card, Screen } from "@/ui/kit";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const post = getPost(id);

  // Comments added here are in-memory only for this screen visit — a real
  // app would post these to a backend and refetch; this demo keeps the data
  // layer static, so new comments don't survive leaving the screen.
  const [extraComments, setExtraComments] = useState<{ author: string; body: string }[]>([]);
  const [draft, setDraft] = useState("");
  const { liked, count, toggle } = useReaction(post?.id ?? "missing", post?.baseLikes ?? 0);

  if (!post) {
    return (
      <Screen>
        <Text style={{ color: colors.text, margin: 16 }}>Post not found.</Text>
      </Screen>
    );
  }

  const onShare = () => {
    Share.share({ message: `${post.title}\n\n${post.body}` }).catch(() => {});
  };

  const onSend = () => {
    if (!draft.trim()) return;
    Haptics.selectionAsync().catch(() => {});
    setExtraComments((c) => [...c, { author: "You", body: draft.trim() }]);
    setDraft("");
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: post.title, headerTintColor: colors.primary }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.list}>
          <Card>
            <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
            <Text style={[styles.author, { color: colors.muted }]}>
              {post.author} · {new Date(post.postedAt + "T00:00:00").toLocaleDateString()}
            </Text>
            <Text style={[styles.body, { color: colors.text }]}>{post.body}</Text>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  toggle();
                }}
                style={styles.likeRow}
              >
                <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? colors.danger : colors.muted} />
                <Text style={[styles.likeCount, { color: liked ? colors.danger : colors.muted }]}>{count} likes</Text>
              </Pressable>
              <Pressable onPress={onShare} style={styles.likeRow}>
                <Ionicons name="share-outline" size={20} color={colors.primary} />
                <Text style={[styles.likeCount, { color: colors.primary }]}>Share</Text>
              </Pressable>
            </View>
          </Card>

          <Text style={[styles.commentsHeader, { color: colors.text }]}>
            Comments ({post.comments.length + extraComments.length})
          </Text>
          {[...post.comments, ...extraComments].map((c, i) => (
            <Card key={i}>
              <Text style={[styles.commentAuthor, { color: colors.text }]}>{c.author}</Text>
              <Text style={[styles.commentBody, { color: colors.muted }]}>{c.body}</Text>
            </Card>
          ))}
        </ScrollView>

        <View style={[styles.composer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Add a comment…"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
          <Pressable onPress={onSend} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="send" size={16} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 90, gap: 12 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  author: { fontSize: 13, marginBottom: 12 },
  body: { fontSize: 15, lineHeight: 22 },
  footer: { flexDirection: "row", gap: 24, marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  likeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  likeCount: { fontSize: 14, fontWeight: "700" },
  commentsHeader: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  commentAuthor: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  commentBody: { fontSize: 14, lineHeight: 19 },
  composer: { flexDirection: "row", gap: 10, padding: 12, borderTopWidth: 1, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});
