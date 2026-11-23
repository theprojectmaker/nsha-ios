import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPost } from '@/data/seed';
import { C, R, T } from '@/theme';
import { Card, PostCard, tap } from '@/ui';

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

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.grabber} />
      <View style={s.top}>
        <Pressable onPress={() => { tap(); Share.share({ message: `${post.title}\n\n${post.body}` }).catch(() => {}); }} hitSlop={8} style={s.circle} accessibilityRole="button" accessibilityLabel="Share">
          <Ionicons name="share-outline" size={18} color={C.ink} />
        </Pressable>
        <Pressable onPress={close} hitSlop={8} style={s.circle} accessibilityRole="button" accessibilityLabel="Close">
          <Ionicons name="close" size={20} color={C.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.col} keyboardDismissMode="interactive">
        <PostCard post={post} full />
        <Text style={[T.h2, { marginTop: 10, marginBottom: 12 }]}>Comments</Text>
        {post.comments.map((c, i) => (
          <Card key={i} style={s.comment}>
            <Text style={T.h3}>{c.author}</Text>
            <Text style={[T.body, { color: C.sub }]}>{c.body}</Text>
          </Card>
        ))}
        {mine.map((c, i) => (
          <Card key={`m${i}`} style={s.comment}>
            <Text style={T.h3}>You</Text>
            <Text style={[T.body, { color: C.sub }]}>{c}</Text>
          </Card>
        ))}
      </ScrollView>

      <View style={[s.composer, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={send} placeholder="Add a comment" placeholderTextColor={C.faint} style={s.input} returnKeyType="send" accessibilityLabel="Add a comment" />
        <Pressable onPress={send} disabled={!draft.trim()} style={[s.send, !draft.trim() && { opacity: 0.4 }]} accessibilityRole="button" accessibilityLabel="Send comment">
          <Ionicons name="arrow-up" size={19} color={C.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  grabber: { alignSelf: 'center', width: 38, height: 5, borderRadius: 3, backgroundColor: C.line, marginTop: 8 },
  top: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, paddingHorizontal: 16, paddingTop: 6 },
  circle: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  col: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 },
  comment: { padding: 14, marginBottom: 10 },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line, backgroundColor: C.card },
  input: { flex: 1, height: 42, borderRadius: R.pill, backgroundColor: C.bg, paddingHorizontal: 16, fontSize: 15, color: C.ink },
  send: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' },
});
