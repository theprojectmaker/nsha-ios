import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
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

  const posts = useMemo(() => {
    const all = postsForSchool(school.id).filter((p) => visibleTo(role, p.audience));
    const pinned = all.filter((p) => p.pinned);
    const rest = all.filter((p) => !p.pinned);
    return [...pinned, ...rest];
  }, [school.id, role]);

  return (
    <Screen>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={<SchoolHeader />}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.muted }]}>No announcements yet.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 24 },
  empty: { textAlign: "center", marginTop: 40 },
});
