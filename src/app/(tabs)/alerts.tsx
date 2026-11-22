import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { postsForSchool } from "@/data/seed";
import type { Audience } from "@/data/types";
import { Role, useTheme } from "@/theme/ThemeContext";
import { Screen, SectionTitle } from "@/ui/kit";
import { PostCard } from "@/ui/PostCard";
import { SchoolHeader } from "@/ui/SchoolHeader";

const ROLE_TO_AUDIENCE: Record<Role, Audience> = { everyone: "everyone", parent: "parents", student: "students" };
function visibleTo(role: Role, postAudience: Audience) {
  const asAudience = ROLE_TO_AUDIENCE[role];
  return postAudience === "everyone" || asAudience === "everyone" || postAudience === asAudience;
}

// Urgent/time-sensitive notices and pinned posts, pulled out of the general
// feed so they can't get buried under routine announcements.
export default function Alerts() {
  const { school, role, colors } = useTheme();

  const items = useMemo(() => {
    return postsForSchool(school.id)
      .filter((p) => visibleTo(role, p.audience))
      .filter((p) => p.type === "alert" || p.pinned);
  }, [school.id, role]);

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <>
            <SchoolHeader subtitle="Urgent & pinned" />
            <SectionTitle>Alerts</SectionTitle>
          </>
        }
        renderItem={({ item, index }) => <PostCard post={item} index={index} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle-outline" size={28} color={colors.muted} />
            <Text style={{ color: colors.muted, marginTop: 8 }}>Nothing urgent right now.</Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 24 },
  empty: { alignItems: "center", marginTop: 40 },
});
