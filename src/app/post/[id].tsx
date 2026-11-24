import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPost } from '@/data/seed';
import { C, GUTTER, T } from '@/theme';
import { PostBody, Row, Section, tap } from '@/ui';

// Opens as Apple's card pop-up (drag down to close).
export default function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = getPost(id);
  const insets = useSafeAreaInsets();
  // New comments live only while this card is open; a real server would save them.
  const [mine, setMine] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!post) {
    return (
      <View style={[s.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={T.body}>This post is no longer available.</Text>
      </View>
    );
  }

  const send = () => {
    if (!draft.trim()) return;
    tap();
    setMine((m) => [...m, draft.trim()]);
    setDraft('');
  };
  const comments = [...post.comments, ...mine.map((body) => ({ author: 'You', body }))];

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.bar}>
        <Pressable onPress={() => { tap(); Share.share({ message: `${post.title}\n\n${post.body}` }).catch(() => {}); }} hitSlop={10} accessibilityRole="button" accessibilityLabel="Share">
          <Ionicons name="share-outline" size={22} color={C.blue} />
        </Pressable>
        <Pressable onPress={close} hitSlop={10} accessibilityRole="button" accessibilityLabel="Done">
          <Text style={s.done}>Done</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.col} keyboardDismissMode="interactive">
        <Text style={[T.meta, { marginBottom: 10 }]}>Sample post, not real NSHA information.</Text>
        <PostBody post={post} />
        <Section title={`Comments (${comments.length})`}>
          {comments.map((c, i) => <Row key={i} title={c.author} sub={c.body} last={i === comments.length - 1} />)}
        </Section>
      </ScrollView>

      <View style={[s.composer, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={send} placeholder="Add a comment" placeholderTextColor={C.faint} style={s.input} returnKeyType="send" accessibilityLabel="Add a comment" />
        <Pressable onPress={send} disabled={!draft.trim()} style={[s.send, !draft.trim() && { opacity: 0.35 }]} accessibilityRole="button" accessibilityLabel="Send comment">
          <Ionicons name="arrow-up" size={18} color={C.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: GUTTER, paddingTop: 16, paddingBottom: 8 },
  done: { fontSize: 17, fontWeight: '600', color: C.blue },
  col: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: GUTTER, paddingTop: 8, paddingBottom: 30 },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: GUTTER, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.rule, backgroundColor: C.page },
  input: { flex: 1, height: 40, borderRadius: 20, backgroundColor: C.soft, paddingHorizontal: 16, fontSize: 16, color: C.ink },
  send: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' },
});
