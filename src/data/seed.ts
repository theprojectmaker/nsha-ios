// SAMPLE content so the app has something to show. None of it is official NSHA
// information: names, phone numbers and events are placeholders for the school
// to replace (a real version would load this from a server the office edits).
import type { Game, Office, Post } from './types';

// Opponents are left generic on purpose: these are sample results, not real games.
export const GAMES: Game[] = [
  { id: 'g1', sport: 'Basketball', team: 'Varsity Boys', opponent: 'Opponent A', home: true, date: '2026-11-18', lions: 58, them: 51 },
  { id: 'g2', sport: 'Volleyball', team: 'Varsity Girls', opponent: 'Opponent B', home: false, date: '2026-11-16', lions: 3, them: 1 },
  { id: 'g3', sport: 'Hockey', team: 'Varsity Boys', opponent: 'Opponent C', home: false, date: '2026-11-13', lions: 2, them: 4 },
  { id: 'g4', sport: 'Basketball', team: 'Varsity Girls', opponent: 'Opponent D', home: true, date: '2026-11-24', time: '6:00 PM' },
];

export const POSTS: Post[] = [
  {
    id: 'p1',
    type: 'alert',
    pinned: true,
    audience: 'everyone',
    author: 'Main Office',
    title: 'Early dismissal Friday for Shabbat',
    body: 'With early candle lighting, all divisions dismiss early this Friday. Buses run on the early schedule. Shabbat Shalom!',
    postedAt: '2026-11-21',
    baseLikes: 64,
    comments: [
      { author: 'A parent', body: 'Thank you for the reminder.' },
      { author: 'A parent', body: 'Does after-school care still run?' },
    ],
  },
  {
    id: 'p2',
    type: 'event',
    pinned: false,
    audience: 'everyone',
    author: 'Music Department',
    title: 'Chanukah Concert',
    body: 'Lower and Middle School choirs and the High School band perform together. Latkes and sufganiyot in the lobby after the show.',
    postedAt: '2026-11-20',
    eventDate: '2026-12-08',
    eventTime: '7:00 PM',
    eventLocation: 'Auditorium',
    baseLikes: 88,
    comments: [{ author: 'A parent', body: 'Our whole family is coming!' }],
  },
  {
    id: 'p3',
    type: 'poll',
    pinned: false,
    audience: 'students',
    author: 'Student Council',
    title: 'Vote: Spirit Week theme',
    body: 'Pick the theme for Lions Spirit Week. Voting closes Thursday.',
    postedAt: '2026-11-19',
    pollOptions: [
      { id: 'a', label: 'Blue & Gold Day every day', baseVotes: 61 },
      { id: 'b', label: 'Decades week', baseVotes: 84 },
      { id: 'c', label: 'Color wars by grade', baseVotes: 72 },
    ],
    baseLikes: 23,
    comments: [{ author: 'A student', body: 'Color wars, obviously.' }],
  },
  {
    id: 'p4',
    type: 'photo',
    pinned: false,
    audience: 'everyone',
    author: 'Athletics',
    title: 'Lions win the season opener',
    body: 'Varsity basketball took the home opener in a close one. Come cheer the Lions at the next home game!',
    postedAt: '2026-11-18',
    photoIcon: 'trophy',
    baseLikes: 131,
    comments: [{ author: 'A student', body: 'What a finish!' }],
  },
  {
    id: 'p5',
    type: 'text',
    pinned: false,
    audience: 'parents',
    author: 'Main Office',
    title: 'Parent-teacher conference sign-ups',
    body: 'Sign-ups for winter conferences are open. Choose a time with each of your child’s teachers through the parent portal.',
    postedAt: '2026-11-17',
    baseLikes: 19,
    comments: [{ author: 'A parent', body: 'Signed up, easy process.' }],
  },
  {
    id: 'p6',
    type: 'event',
    pinned: false,
    audience: 'students',
    author: 'Student Activities',
    title: 'Grade 9 Shabbaton',
    body: 'A Shabbat together with davening, ruach, and a Motzei Shabbat activity. Permission forms are due to the High School office.',
    postedAt: '2026-11-16',
    eventDate: '2026-12-18',
    eventTime: 'Friday afternoon',
    eventLocation: 'Details from the High School office',
    baseLikes: 42,
    comments: [{ author: 'A student', body: 'Can’t wait.' }],
  },
  {
    id: 'p7',
    type: 'text',
    pinned: false,
    audience: 'students',
    author: 'High School Office',
    title: 'Midterm schedule posted',
    body: 'The midterm schedule is up in the student portal. Review sessions run during lunch the week before.',
    postedAt: '2026-11-14',
    baseLikes: 27,
    comments: [{ author: 'A student', body: 'Thanks for posting early.' }],
  },
  {
    id: 'p8',
    type: 'event',
    pinned: false,
    audience: 'everyone',
    author: 'Science Department',
    title: 'Science Fair',
    body: 'Middle School students present their projects. Families are welcome to walk through and vote for the people’s choice award.',
    postedAt: '2026-11-12',
    eventDate: '2027-01-14',
    eventTime: '6:30 PM',
    eventLocation: 'Gym',
    baseLikes: 35,
    comments: [{ author: 'A parent', body: 'Looking forward to it.' }],
  },
  {
    id: 'p9',
    type: 'photo',
    pinned: false,
    audience: 'everyone',
    author: 'Chesed Committee',
    title: 'Mitzvah Day thank you',
    body: 'Students packed hundreds of care packages for families in our community. Thank you to every volunteer who helped.',
    postedAt: '2026-11-10',
    photoIcon: 'heart',
    baseLikes: 97,
    comments: [{ author: 'A parent', body: 'So proud of these kids.' }],
  },
];

export const OFFICES: Office[] = [
  { id: 'o1', name: 'Main Office', detail: 'General questions', phone: '(516) 555-0100', email: 'office@example.org' },
  { id: 'o2', name: 'Attendance', detail: 'Absences and late arrivals', phone: '(516) 555-0101', email: 'attendance@example.org' },
  { id: 'o3', name: 'Nurse', detail: 'Health office', phone: '(516) 555-0102', email: 'nurse@example.org' },
  { id: 'o4', name: 'Transportation', detail: 'Buses and pickup', phone: '(516) 555-0103', email: 'buses@example.org' },
  { id: 'o5', name: 'Athletics', detail: 'Lions teams and schedules', phone: '(516) 555-0104', email: 'athletics@example.org' },
];

export const DIVISIONS = ['Early Childhood', 'Lower School', 'Middle School', 'High School'] as const;

export function sortedPosts() {
  return [...POSTS].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export function upcomingEvents(today = new Date()) {
  const iso = today.toISOString().slice(0, 10);
  return POSTS.filter((p) => p.type === 'event' && p.eventDate && p.eventDate >= iso).sort((a, b) => a.eventDate!.localeCompare(b.eventDate!));
}

export function getPost(id: string) {
  return POSTS.find((p) => p.id === id);
}
