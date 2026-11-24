import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AppState, Text } from 'react-native';
import { dafYomi, hebrewDateNow, shabbat, specialDay, zmanim } from '@/jewish';
import { NUSACHOT, book, setSiddur, useSiddur } from '@/siddur';
import { T } from '@/theme';
import { Page, Row, Section, Segments } from '@/ui';

export default function Jewish() {
  const { nusach, place } = useSiddur();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const t = setInterval(refresh, 60_000);
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active') refresh(); });
    return () => { clearInterval(t); sub.remove(); };
  }, []);
  const sh = shabbat(now);
  const services = book(nusach).services;
  const times = zmanim(now);

  return (
    <Page title="Siddur">
      <Text style={T.meta}>{[hebrewDateNow(now), specialDay(now)].filter(Boolean).join(' · ')}</Text>

      <Section title="Tefillah" first>
        <Segments options={NUSACHOT.map((n) => n.label)} value={NUSACHOT.find((n) => n.id === nusach)!.label} onChange={(l) => setSiddur({ nusach: NUSACHOT.find((n) => n.label === l)!.id })} />
        {services.map((s, i) => {
          const at = place[`${nusach}.${s.id}`];
          return <Row key={s.id} title={s.label} sub={at && s.parts[at] ? `Last read: ${s.parts[at].t}` : undefined} onPress={() => router.push(`/siddur/${s.id}`)} last={i === services.length - 1} />;
        })}
      </Section>

      <Section title="Shabbat">
        {sh.parasha ? <Row title="Parasha" right={<Text style={T.body}>{sh.parasha}</Text>} /> : null}
        <Row title="Candle lighting" sub={`${sh.friday}, 18 minutes before sunset`} right={<Text style={T.body}>{sh.candles}</Text>} />
        <Row title="Shabbat ends" sub="Nightfall, 8.5 degrees" right={<Text style={T.body}>{sh.ends}</Text>} last />
      </Section>

      <Section title="Zmanim today">
        {times.map((z, i) => <Row key={z.name} title={z.name} right={<Text style={T.body}>{z.time}</Text>} last={i === times.length - 1} />)}
      </Section>

      <Section title="Learning">
        <Row title="Daf Yomi" right={<Text style={T.body}>{dafYomi(now)}</Text>} last />
      </Section>
      <Text style={[T.meta, { marginTop: 24 }]}>Calculated for Great Neck, NY. Not yet reviewed by a rabbi; follow your own rabbi for practice.</Text>
    </Page>
  );
}
