import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text } from "react-native";
import { postsForSchool } from "@/data/seed";
import type { Audience } from "@/data/types";
import { Role, useTheme } from "@/theme/ThemeContext";
import { Screen } from "@/ui/kit";
import { PostCard } from "@/ui/PostCard";
import { SchoolHeader } from "@/ui/SchoolHeader";

const ROLE_TO_AUDIENCE: Record<Role, Audience> = {
  everyone: "everyone",
  parent: "parents",
  student: "students",
};

// A real app would resolve audience from the signed-in account's role; here
// it's whatever the viewer picked in Settings. "everyone" sees it all.
function visibleTo(role: Role, postAudience: Audience) {
  const asAudience = ROLE_TO_AUDIENCE[role];
  return postAudience === "everyone" || asAudience === "everyone" || postAudience === asAudience;
}

export default function Feed() {
  const { school, role, colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const posts = useMemo(() => {
    const all = postsForSchool(school.id).filter((p) => visibleTo(role, p.audience));
    const pinned = all.filter((p) => p.pinned);
    const rest = all.filter((p) => !p.pinned);
    return [...pinned, ...rest];
  }, [school.id, role]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setTimeout(() => setRefreshing(false), 650);
  }, []);

  return (
    <Screen>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={<SchoolHeader />}
        renderItem={({ item, index }) => <PostCard post={item} index={index} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.muted }]}>No announcements yet.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 24 },
  empty: { textAlign: "center", marginTop: 40 },
});
