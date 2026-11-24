import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { book, savePlace, setSiddur, useSiddur, type Line } from '@/siddur';
import { C, GUTTER, T } from '@/theme';
import { Segments, tap } from '@/ui';

type Item = { key: string; title: string; ht: string } | { key: string; line: Line };

// Continuous reading from the chosen section to the end of the service.
export default function Read() {
  const { service, part } = useLocalSearchParams<{ service: string; part: string }>();
  const { nusach, size, english } = useSiddur();
  const insets = useSafeAreaInsets();
  const s = book(nusach).services.find((x) => x.id === service);
  const from = Math.max(0, Math.min(Number(part) || 0, (s?.parts.length ?? 1) - 1));

  useEffect(() => {
    if (s) savePlace(`${nusach}.${s.id}`, from);
  }, [nusach, service, from]);

  const items = useMemo<Item[]>(() => (s?.parts ?? []).slice(from).flatMap((p, pi) => [
    { key: `t${pi}`, title: p.t, ht: p.ht },
    ...p.lines.map((line, i) => ({ key: `${pi}.${i}`, line })),
  ]), [s, from]);

  return (
    <View style={[st.root, { paddingTop: insets.top + 8 }]}>
      <View style={st.bar}>
        <Pressable onPress={() => { tap(); router.canGoBack() ? router.back() : router.replace('/jewish'); }} hitSlop={10} accessibilityRole="button" accessibilityLabel="Back">
          <Text style={st.link}>Back</Text>
        </Pressable>
        <View style={st.tools}>
          <Pressable onPress={() => { tap(); setSiddur({ size: Math.max(18, size - 2) }); }} hitSlop={10} accessibilityRole="button" accessibilityLabel="Smaller text"><Text style={st.link}>A-</Text></Pressable>
          <Pressable onPress={() => { tap(); setSiddur({ size: Math.min(44, size + 2) }); }} hitSlop={10} accessibilityRole="button" accessibilityLabel="Larger text"><Text style={st.link}>A+</Text></Pressable>
          <View style={{ width: 170 }}>
            <Segments options={['Hebrew', '+ English']} value={english ? '+ English' : 'Hebrew'} onChange={(v) => setSiddur({ english: v !== 'Hebrew' })} />
          </View>
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.key}
        initialNumToRender={12}
        contentContainerStyle={{ paddingHorizontal: GUTTER, paddingBottom: insets.bottom + 60, width: '100%', maxWidth: 640, alignSelf: 'center' }}
        renderItem={({ item }) => 'title' in item ? (
          <View style={st.head}>
            <Text style={[T.section, { flex: 1 }]}>{item.title}</Text>
            <Text style={[T.section, st.he, { flexShrink: 1 }]}>{item.ht}</Text>
          </View>
        ) : (
          <View style={{ marginBottom: 16 }}>
            <Text selectable style={[st.he, item.line.n ? { fontSize: 15, lineHeight: 22, color: C.sub } : { fontSize: size, lineHeight: size * 1.6, color: C.ink }]}>{item.line.h}</Text>
            {english && item.line.e ? <Text selectable style={[T.meta, { marginTop: 6, fontSize: Math.max(14, size * 0.65), lineHeight: Math.max(20, size * 0.95) }]}>{item.line.e}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: GUTTER },
  tools: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  link: { fontSize: 17, color: C.blue },
  head: { flexDirection: 'row', gap: 12, marginTop: 22, marginBottom: 12 },
  he: { textAlign: 'right', writingDirection: 'rtl' },
});
