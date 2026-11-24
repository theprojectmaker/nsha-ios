import { ComplexZmanimCalendar, GeoLocation, HebrewDateFormatter, JewishCalendar, YomiCalculator } from 'kosher-zmanim';
import { DateTime } from 'luxon';

// Great Neck, NY. Everything is computed on the phone, so it works offline.
const ZONE = 'America/New_York';
const PLACE = new GeoLocation('Great Neck', 40.8007, -73.7285, 0, ZONE);
const fmt = new HebrewDateFormatter();

const local = (d: Date) => DateTime.fromJSDate(d).setZone(ZONE);
const time = (t: DateTime | null) => (t && t.isValid ? t.setZone(ZONE).toFormat('h:mm a') : '');

// For times you wait until: never show a minute that has not fully arrived.
const timeUp = (t: DateTime | null) => time(t && t.plus({ seconds: 59 }));

function zmanimFor(day: DateTime) {
  const z = new ComplexZmanimCalendar(PLACE);
  z.setDate(day);
  z.setCandleLightingOffset(18);
  return z;
}

// The Hebrew day begins at sunset.
function hebrewDay(now: Date) {
  const d = local(now);
  const sunset = zmanimFor(d).getSunset();
  return sunset && d.toMillis() >= sunset.toMillis() ? d.plus({ days: 1 }) : d;
}

export const hebrewDateNow = (now = new Date()) => fmt.format(new JewishCalendar(hebrewDay(now))).replace(',', '');

export function zmanim(now = new Date()) {
  const z = zmanimFor(local(now));
  const rows: [string, DateTime | null][] = [
    ['Dawn (Alot HaShachar)', z.getAlosHashachar()],
    ['Sunrise', z.getSunrise()],
    ['Latest Shema (GRA)', z.getSofZmanShmaGRA()],
    ['Latest Shacharit (GRA)', z.getSofZmanTfilaGRA()],
    ['Midday (Chatzot)', z.getChatzos()],
    ['Earliest Mincha', z.getMinchaGedola()],
    ['Plag HaMincha', z.getPlagHamincha(z.getSunrise(), z.getSunset())],
    ['Sunset', z.getSunset()],
    ['Nightfall (8.5 degrees)', z.getTzais()],
  ];
  return rows.map(([name, t]) => ({ name, time: /^(Earliest|Nightfall|Dawn|Plag|Sunrise)/.test(name) ? timeUp(t) : time(t) }));
}

export function shabbat(now = new Date()) {
  const d = local(now);
  let sat = d.plus({ days: (6 - d.weekday + 7) % 7 });
  const ends = zmanimFor(sat).getTzais();
  if (ends && d.toMillis() > ends.toMillis()) sat = sat.plus({ days: 7 });
  const fri = sat.minus({ days: 1 });
  return {
    parasha: fmt.formatParsha(new JewishCalendar(sat)),
    candles: time(zmanimFor(fri).getCandleLighting()),
    ends: timeUp(zmanimFor(sat).getTzais()),
    friday: fri.toFormat('EEE, MMM d'),
  };
}

// What is special about today, so the reader knows to look for that day's additions.
export function specialDay(now = new Date()) {
  const j = new JewishCalendar(hebrewDay(now));
  const out: string[] = [];
  if (j.isRoshChodesh()) out.push('Rosh Chodesh');
  const yt = fmt.formatYomTov(j);
  if (yt) out.push(yt);
  const omer = j.getDayOfOmer();
  if (omer > 0) out.push(`Omer day ${omer}`);
  return [...new Set(out)].join(' · ');
}

export function dafYomi(now = new Date()) {
  const daf = YomiCalculator.getDafYomiBavli(new JewishCalendar(local(now)));
  return daf ? `${daf.getMasechtaTransliterated()} ${daf.getDaf()}` : '';
}
