import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPost } from '@/data/seed';
import { C, T } from '@/theme';
import { Panel, PostItem, SectionLabel, Slash, tap } from '@/ui';

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
      <View style={s.bar}>
        <Slash width={70} height={9} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable onPress={() => { tap(); Share.share({ message: `${post.title}\n\n${post.body}` }).catch(() => {}); }} hitSlop={8} style={s.circle} accessibilityRole="button" accessibilityLabel="Share">
            <Ionicons name="share-outline" size={18} color={C.white} />
          </Pressable>
          <Pressable onPress={close} hitSlop={8} style={s.circle} accessibilityRole="button" accessibilityLabel="Close">
            <Ionicons name="close" size={20} color={C.white} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.col} keyboardDismissMode="interactive">
        <PostItem post={post} full />
        <SectionLabel title={`Comments (${post.comments.length + mine.length})`} />
        {[...post.comments, ...mine.map((body) => ({ author: 'You', body }))].map((c, i) => (
          <Panel key={i} style={s.comment}>
            <Text style={[T.body, { fontWeight: '700' }]}>{c.author}</Text>
            <Text style={[T.body, { color: C.sub }]}>{c.body}</Text>
          </Panel>
        ))}
      </ScrollView>

      <View style={[s.composer, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={send} placeholder="Add a comment" placeholderTextColor={C.faint} style={s.input} returnKeyType="send" accessibilityLabel="Add a comment" />
        <Pressable onPress={send} disabled={!draft.trim()} style={[s.send, !draft.trim() && { opacity: 0.4 }]} accessibilityRole="button" accessibilityLabel="Send comment">
          <Ionicons name="arrow-up" size={19} color={C.black} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14, backgroundColor: C.black },
  circle: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  col: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 16, paddingBottom: 30 },
  comment: { padding: 14, marginBottom: 8 },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.rule, backgroundColor: C.surface },
  input: { flex: 1, height: 42, borderRadius: 8, backgroundColor: C.page, paddingHorizontal: 14, fontSize: 15, color: C.ink },
  send: { width: 40, height: 40, borderRadius: 8, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
});
