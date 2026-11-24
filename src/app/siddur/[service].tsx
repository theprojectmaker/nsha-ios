import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { specialDay } from '@/jewish';
import { book, useSiddur } from '@/siddur';
import { T } from '@/theme';
import { Page, Row, Section } from '@/ui';

// Contents of one service.
export default function ServicePage() {
  const { service } = useLocalSearchParams<{ service: string }>();
  const { nusach, place } = useSiddur();
  const s = book(nusach).services.find((x) => x.id === service);
  if (!s) return <Page title="Siddur" back><Text style={T.body}>Not available in this nusach.</Text></Page>;
  const open = (i: number) => router.push(`/siddur/read?service=${s.id}&part=${i}`);
  const at = place[`${nusach}.${s.id}`];
  const special = specialDay();
  const sources = [...new Set(s.parts.flatMap((p) => [p.hs, p.es]))].filter(Boolean);
  return (
    <Page title={s.label} back>
      {special ? <Text style={T.meta}>Today: {special}. Additions are not inserted automatically; check the text for them.</Text> : null}
      <Section title="Contents" first>
        {at && s.parts[at] ? <Row title="Continue" sub={s.parts[at].t} onPress={() => open(at)} /> : null}
        {s.parts.map((p, i) => <Row key={i} title={p.t} right={<Text style={[T.meta, { maxWidth: 150, textAlign: "right" }]}>{p.ht}</Text>} onPress={() => open(i)} last={i === s.parts.length - 1} />)}
      </Section>
      {s.missing.length ? <Text style={[T.meta, { marginTop: 20 }]}>Not included (no openly licensed text): {s.missing.join(', ')}.</Text> : null}
      <Text style={[T.meta, { marginTop: 20 }]}>Text from Sefaria: {sources.join('; ')}. CC-BY: creativecommons.org/licenses/by/4.0. Formatting was removed for this app.</Text>
      <Text style={[T.meta, { marginTop: 8 }]}>Not yet reviewed by a rabbi.</Text>
    </Page>
  );
}
