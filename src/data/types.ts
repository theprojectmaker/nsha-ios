import type { SchoolId } from "@/theme/schools";

export type Audience = "everyone" | "parents" | "students";
export type PostType = "text" | "photo" | "event" | "poll" | "alert";

export interface PollOption {
  id: string;
  label: string;
  /** Seeded base votes, so a poll doesn't look empty before anyone taps it. */
  baseVotes: number;
}

export interface Post {
  id: string;
  schoolId: SchoolId;
  type: PostType;
  pinned: boolean;
  audience: Audience;
  author: string;
  title: string;
  body: string;
  postedAt: string; // ISO date
  // Only present on type "event" (and may also appear on the Calendar screen).
  eventDate?: string; // ISO date
  eventLocation?: string;
  // Only present on type "photo" — a tint + icon stand in for a real photo.
  photoIcon?: "trophy" | "building" | "book" | "art";
  // Only present on type "poll".
  pollOptions?: PollOption[];
  // Seeded like count, so Feed doesn't look brand new.
  baseLikes: number;
  // Seeded mock comments shown on the detail screen.
  comments: { author: string; body: string }[];
}

export interface StaffMember {
  id: string;
  schoolId: SchoolId;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
}

export interface QuickLink {
  id: string;
  schoolId: SchoolId;
  label: string;
  url: string;
}
