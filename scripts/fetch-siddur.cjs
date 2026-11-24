// Rebuilds src/data/siddur/*.json from Sefaria's bulk export using only PD / CC0 / CC-BY text versions.
// No prayer text is written by hand. English is kept only when it has exactly as many lines as the Hebrew.
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'src', 'data', 'siddur');
fs.mkdirSync(OUT, { recursive: true });
const OK = new Set(['Public Domain', 'CC0', 'CC-BY']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(40000) });
      if (r.ok) return await r.json();
      throw new Error(`${r.status} ${url}`);
    } catch (e) {
      if (i >= 3) throw e;
      await sleep(1500 * (i + 1));
    }
  }
}

const BOOKS = {
  ashkenaz: { title: 'Siddur Ashkenaz', services: [
    ['shacharit', 'Shacharit', [['Weekday', 'Shacharit']]],
    ['mincha', 'Mincha', [['Weekday', 'Minchah']]],
    ['arvit', 'Maariv', [['Weekday', 'Maariv']]],
    ['bentching', 'Birkat Hamazon', [['Berachot', 'Birkat HaMazon']]],
    ['berachot', 'Berachot', [['Berachot']], ['Birkat HaMazon', 'Havinenu']],
    ['hallel', 'Hallel', [['Festivals', 'Rosh Chodesh', 'Hallel']]],
    ['chanukah', 'Chanukah candles', [['Festivals', 'Chanukah']]],
  ] },
  sefard: { title: 'Siddur Sefard', services: [
    ['shacharit', 'Shacharit', [['Upon Arising'], ['Weekday Shacharit']]],
    ['mincha', 'Mincha', [['Weekday Mincha']]],
    ['arvit', 'Maariv', [['Weekday Maariv']]],
    ['bentching', 'Birkat Hamazon', [['Birchat HaMazon', 'Birchat HaMazon']]],
    ['berachot', 'Berachot', [['Blessings']]],
    ['bedtime', 'Bedtime Shema', [['Bedtime Shema']]],
    ['hallel', 'Hallel', [['Rosh Chodesh', 'Hallel']]],
    ['chanukah', 'Chanukah candles', [['Chanukah', 'Menorah Lighting']]],
  ] },
  edot: { title: 'Siddur Edot HaMizrach', services: [
    ['shacharit', 'Shacharit', [['Preparatory Prayers'], ['Weekday Shacharit']]],
    ['mincha', 'Mincha', [['Weekday Mincha']]],
    ['arvit', 'Arvit', [['Weekday Arvit']]],
    ['bentching', 'Birkat Hamazon', [['Post Meal Blessing']]],
    ['berachot', 'Berachot', [['Blessings on Enjoyments'], ['Al Hamihya']]],
    ['bedtime', 'Bedtime Shema', [['Bedtime Shema']]],
    ['hallel', 'Hallel', [['Rosh Hodesh', 'Hallel']]],
    ['chanukah', 'Chanukah candles', [['Hanukkah', 'Menorah Lighting']]],
  ] },
};

const MET = 'Translation based on the Metsudah linear siddur, by Avrohom Davis, 1981';
const HE = {
  ashkenaz: ['The Metsudah siddur, 1981', 'The Metsudah siddur a new linear siddur with English translation by Avrohom Davis, 1981', 'Daat Siddur Ashkenaz'],
  sefard: ['The Metsudah siddur, 1981', 'Torat Emet 357'],
  edot: ['Torat Emet 357', ' Shaliehsaboo Edition'],
};
const EN = {
  ashkenaz: [MET, 'Sefaria Community Translation', 'The Standard Prayer Book, tr. by Simeon Singer, [1915]'],
  sefard: [MET, 'Sefaria Community Translation'],
  edot: ['Sefaria Community Translation'],
};
const dig = (t, keys) => {
  let n = t;
  for (let i = 0; i < keys.length; i++) {
    if (!n || Array.isArray(n) || typeof n === 'string') return undefined;
    // A title can itself contain ", ", so try the longest match first.
    let hit = false;
    for (let j = keys.length; j > i; j--) { const k = keys.slice(i, j).join(', '); if (k in n) { n = n[k]; i = j - 1; hit = true; break; } }
    if (!hit) return undefined;
  }
  return n && !Array.isArray(n) && typeof n === 'object' ? n[''] : n;
};
const filled = (v) => flat(v.text).filter(Boolean).length;
const titleOf = (n, lang) => (n.titles || []).find((t) => t.lang === lang && t.primary)?.text;
// Footnotes contain nested <i> tags, so match the closing tag by depth.
const noFootnotes = (h) => {
  for (let i; (i = h.search(/<i class="footnote">/)) >= 0; ) {
    const re = /<(\/?)i\b[^>]*>/g; re.lastIndex = i;
    let depth = 0, m, end = h.length;
    while ((m = re.exec(h))) { depth += m[1] ? -1 : 1; if (!depth) { end = re.lastIndex; break; } }
    h = h.slice(0, i) + h.slice(end);
  }
  return h.replace(/<sup class="footnote-marker">.*?<\/sup>/gs, '');
};
const clean = (h) => noFootnotes(String(h))
  .replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;|&thinsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&[a-z]+;|&#\d+;/gi, ' ')
  .replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim();
// Prayers are printed with nikud; a line without any vowel points is an instruction or heading.
const isNote = (h) => !/[\u05B0-\u05BC]/.test(clean(h));
const flat = (t) => (Array.isArray(t) ? t.flatMap(flat) : [t ?? '']);

(async () => {
  const report = [];
  for (const [nusach, book] of Object.entries(BOOKS)) {
    const idx = await get('https://www.sefaria.org/api/v2/raw/index/' + encodeURIComponent(book.title.replace(/ /g, '_')));
    const versions = [];
    for (const [lang, dir, names] of [['he', 'Hebrew', HE[nusach]], ['en', 'English', EN[nusach]]]) for (const n of names) {
      const d = await get(`https://storage.googleapis.com/sefaria-export/json/Liturgy/Siddur/${encodeURIComponent(book.title)}/${dir}/${encodeURIComponent(n)}.json`);
      if (!OK.has(d.license)) { report.push(`SKIPPED ${nusach} ${n}: license ${d.license}`); continue; }
      versions.push({ lang, versionTitle: d.versionTitle, license: d.license, text: d.text });
    }
    const services = [];
    for (const [id, label, roots, skip = []] of book.services) {
      const parts = [], missing = [];
      const leaf = async (node, ref) => {
        const keys = ref.slice(book.title.length + 2).split(', ');
        const usable = (lang) => versions.filter((v) => v.lang === lang).map((v) => ({ ...v, text: dig(v.text, keys) })).filter((v) => flat(v.text).some(Boolean));
        const he = usable('he').sort((a, b) => filled(b) - filled(a))[0];
        if (!he) { missing.push(titleOf(node, 'en')); report.push(`${nusach}/${id}: NO LICENSED HEBREW ${ref}`); return; }
        const heT = flat(he.text);
        const en = usable('en').filter((v) => flat(v.text).length === heT.length).sort((a, b) => filled(b) - filled(a))[0];
        const enT = en ? flat(en.text) : [];
        const lines = heT.map((h, i) => ({ h: clean(h), e: clean(enT[i] || ''), n: isNote(h) })).filter((l) => l.h)
          .map((l) => ({ h: l.h, ...(l.e ? { e: l.e } : {}), ...(l.n ? { n: 1 } : {}) }));
        parts.push({ t: titleOf(node, 'en') || ref.split(', ').pop(), ht: titleOf(node, 'he') || '', hs: `${he.versionTitle} (${he.license})`, es: en ? `${en.versionTitle} (${en.license})` : '', lines });
      };
      const walk = async (node, ref) => {
        if (skip.includes(titleOf(node, 'en'))) return;
        if (!node.nodes) return leaf(node, ref);
        for (const c of node.nodes) await walk(c, c.default ? ref : `${ref}, ${titleOf(c, 'en')}`);
      };
      for (const p of roots) {
        let node = idx.schema, ref = book.title;
        for (const k of p) {
          node = node.nodes.find((c) => titleOf(c, 'en') === k);
          if (!node) throw new Error(`${nusach}: no node ${k}`);
          ref += ', ' + k;
        }
        await walk(node, ref);
      }
      const L = parts.flatMap((p) => p.lines);
      report.push(`${nusach}/${id}: ${parts.length} parts, ${L.length} lines, English on ${Math.round(100 * L.filter((l) => l.e).length / (L.length || 1))}%`);
      services.push({ id, label, parts, missing });
    }
    fs.writeFileSync(path.join(OUT, nusach + '.json'), JSON.stringify({ nusach, source: book.title, services }));
    report.push(`${nusach}: ${Math.round(fs.statSync(path.join(OUT, nusach + '.json')).size / 1024)} KB`);
  }
  console.log(report.join('\n'));
})().catch((e) => { console.error(e); process.exit(1); });
