export type Audience = 'everyone' | 'parents' | 'students';
export type PostType = 'text' | 'photo' | 'event' | 'poll' | 'alert';

export interface PollOption {
  id: string;
  label: string;
  /** Seeded base votes, so a poll doesn't look empty before anyone taps it. */
  baseVotes: number;
}

export interface Post {
  id: string;
  type: PostType;
  pinned: boolean;
  audience: Audience;
  author: string;
  title: string;
  body: string;
  postedAt: string; // ISO date
  eventDate?: string; // ISO date, type "event"
  eventTime?: string; // e.g. "7:00 PM"
  eventLocation?: string;
  photoIcon?: 'trophy' | 'heart' | 'flask' | 'music';
  pollOptions?: PollOption[];
  baseLikes: number;
  comments: { author: string; body: string }[];
}

export interface Game {
  id: string;
  sport: string;
  team: string; // e.g. "Varsity Boys"
  opponent: string;
  home: boolean;
  date: string; // ISO date
  lions?: number; // scores only once played
  them?: number;
  time?: string; // for upcoming games
}

export interface Office {
  id: string;
  name: string;
  detail: string;
  phone: string;
  email: string;
}
