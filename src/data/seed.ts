// Demo content for both seeded schools. A real backend would serve this
// (scoped by the install's school) instead of a static file, but the shape
// — posts/staff/links all keyed by schoolId — is what the rest of the app
// is written against, so swapping in a real API later doesn't touch the UI.
import type { Post, QuickLink, StaffMember } from "./types";

export const POSTS: Post[] = [
  // --- Lincoln Park Middle School ---
  {
    id: "lp-1",
    schoolId: "lincoln-park",
    type: "text",
    pinned: true,
    audience: "everyone",
    author: "Principal Diaz",
    title: "Early dismissal this Wednesday",
    body: "All students are dismissed at 12:15pm on Wednesday for staff professional development. Buses will run on the early schedule.",
    postedAt: "2026-11-20",
  },
  {
    id: "lp-2",
    schoolId: "lincoln-park",
    type: "event",
    pinned: false,
    audience: "everyone",
    author: "Lincoln Park PTA",
    title: "Fall Book Fair",
    body: "The library is hosting our annual book fair all week. Volunteers welcome at the front desk.",
    postedAt: "2026-11-18",
    eventDate: "2026-11-24",
    eventLocation: "Main Library",
  },
  {
    id: "lp-3",
    schoolId: "lincoln-park",
    type: "photo",
    pinned: false,
    audience: "everyone",
    author: "Athletics Dept.",
    title: "Panthers take the regional title!",
    body: "Congratulations to the 7th grade volleyball team on a hard-fought win Saturday, 3 sets to 1.",
    postedAt: "2026-11-16",
    photoIcon: "trophy",
  },
  {
    id: "lp-4",
    schoolId: "lincoln-park",
    type: "text",
    pinned: false,
    audience: "parents",
    author: "Front Office",
    title: "Picture retake day scheduling",
    body: "Retake forms went home with students today. Return the signed form by Friday to reserve a slot.",
    postedAt: "2026-11-15",
  },
  {
    id: "lp-5",
    schoolId: "lincoln-park",
    type: "text",
    pinned: false,
    audience: "students",
    author: "Ms. Oyelaran, Counselor",
    title: "Elective sign-ups open Monday",
    body: "Pick your spring electives in the student portal starting Monday morning. Lunch-time help sessions in Room 112 all week.",
    postedAt: "2026-11-14",
  },
  {
    id: "lp-6",
    schoolId: "lincoln-park",
    type: "event",
    pinned: false,
    audience: "everyone",
    author: "Lincoln Park Middle School",
    title: "Winter Concert",
    body: "Band, choir, and orchestra perform together. Doors open 6:30pm, concert starts 7pm in the auditorium.",
    postedAt: "2026-11-10",
    eventDate: "2026-12-11",
    eventLocation: "Auditorium",
  },
  {
    id: "lp-7",
    schoolId: "lincoln-park",
    type: "photo",
    pinned: false,
    audience: "everyone",
    author: "Art Dept.",
    title: "Student art on display downtown",
    body: "Twelve Lincoln Park students have work featured at the Town Hall gallery through the end of the month.",
    postedAt: "2026-11-05",
    photoIcon: "art",
  },

  // --- Riverdale High School ---
  {
    id: "rd-1",
    schoolId: "riverdale",
    type: "text",
    pinned: true,
    audience: "everyone",
    author: "Principal Keane",
    title: "Parent-teacher conferences next week",
    body: "Sign up for a 15-minute slot through the parent portal. Conferences run Tuesday and Thursday evening, 4-8pm.",
    postedAt: "2026-11-19",
  },
  {
    id: "rd-2",
    schoolId: "riverdale",
    type: "event",
    pinned: false,
    audience: "everyone",
    author: "Riverdale Athletics",
    title: "Hawks vs. Central — Senior Night",
    body: "Come celebrate our senior athletes before the final home game of the season. Concessions open at 6pm.",
    postedAt: "2026-11-17",
    eventDate: "2026-11-25",
    eventLocation: "Hawks Stadium",
  },
  {
    id: "rd-3",
    schoolId: "riverdale",
    type: "photo",
    pinned: false,
    audience: "everyone",
    author: "Riverdale Robotics",
    title: "Robotics team advances to states",
    body: "Team 4471 placed 2nd at regionals and is headed to the state championship next month.",
    postedAt: "2026-11-13",
    photoIcon: "trophy",
  },
  {
    id: "rd-4",
    schoolId: "riverdale",
    type: "text",
    pinned: false,
    audience: "students",
    author: "Registrar",
    title: "Course request window closes Friday",
    body: "Submit next semester's course requests in the student portal before 5pm Friday. See your counselor with questions.",
    postedAt: "2026-11-12",
  },
  {
    id: "rd-5",
    schoolId: "riverdale",
    type: "text",
    pinned: false,
    audience: "parents",
    author: "Transportation Office",
    title: "Bus route 14 temporary detour",
    body: "Route 14 will detour around Maple St. construction through December. Pickup times may shift by up to 10 minutes.",
    postedAt: "2026-11-09",
  },
  {
    id: "rd-6",
    schoolId: "riverdale",
    type: "event",
    pinned: false,
    audience: "everyone",
    author: "Riverdale High School",
    title: "Fall Play: \"Our Town\"",
    body: "The drama department presents Thornton Wilder's classic. Tickets at the door or online.",
    postedAt: "2026-11-07",
    eventDate: "2026-12-05",
    eventLocation: "Riverdale Theater",
  },
  {
    id: "rd-7",
    schoolId: "riverdale",
    type: "photo",
    pinned: false,
    audience: "everyone",
    author: "Riverdale High School",
    title: "New science wing nears completion",
    body: "Construction on the new science wing is ahead of schedule — labs open for the spring semester.",
    postedAt: "2026-11-02",
    photoIcon: "building",
  },
];

export const STAFF: StaffMember[] = [
  { id: "lp-s1", schoolId: "lincoln-park", name: "Carla Diaz", role: "Principal", department: "Administration", email: "cdiaz@lincolnpark.edu", phone: "(555) 010-2210" },
  { id: "lp-s2", schoolId: "lincoln-park", name: "Theo Marsh", role: "Assistant Principal", department: "Administration", email: "tmarsh@lincolnpark.edu", phone: "(555) 010-2211" },
  { id: "lp-s3", schoolId: "lincoln-park", name: "Amara Oyelaran", role: "School Counselor", department: "Counseling", email: "aoyelaran@lincolnpark.edu", phone: "(555) 010-2240" },
  { id: "lp-s4", schoolId: "lincoln-park", name: "Front Office", role: "Main Office", department: "Administration", email: "office@lincolnpark.edu", phone: "(555) 010-2200" },

  { id: "rd-s1", schoolId: "riverdale", name: "Daniel Keane", role: "Principal", department: "Administration", email: "dkeane@riverdale.edu", phone: "(555) 040-1100" },
  { id: "rd-s2", schoolId: "riverdale", name: "Priya Nair", role: "Assistant Principal", department: "Administration", email: "pnair@riverdale.edu", phone: "(555) 040-1101" },
  { id: "rd-s3", schoolId: "riverdale", name: "Jordan Lee", role: "Athletic Director", department: "Athletics", email: "jlee@riverdale.edu", phone: "(555) 040-1150" },
  { id: "rd-s4", schoolId: "riverdale", name: "Front Office", role: "Main Office", department: "Administration", email: "office@riverdale.edu", phone: "(555) 040-1100" },
];

export const LINKS: QuickLink[] = [
  { id: "lp-l1", schoolId: "lincoln-park", label: "Parent Portal", url: "https://example.com/lincoln-park/portal" },
  { id: "lp-l2", schoolId: "lincoln-park", label: "Lunch Menu", url: "https://example.com/lincoln-park/menu" },
  { id: "lp-l3", schoolId: "lincoln-park", label: "Bus Routes", url: "https://example.com/lincoln-park/buses" },
  { id: "lp-l4", schoolId: "lincoln-park", label: "School Calendar (PDF)", url: "https://example.com/lincoln-park/calendar.pdf" },

  { id: "rd-l1", schoolId: "riverdale", label: "Student Portal", url: "https://example.com/riverdale/portal" },
  { id: "rd-l2", schoolId: "riverdale", label: "Athletics Schedule", url: "https://example.com/riverdale/athletics" },
  { id: "rd-l3", schoolId: "riverdale", label: "Cafeteria Menu", url: "https://example.com/riverdale/menu" },
  { id: "rd-l4", schoolId: "riverdale", label: "Course Catalog (PDF)", url: "https://example.com/riverdale/catalog.pdf" },
];

export function postsForSchool(schoolId: string) {
  return POSTS.filter((p) => p.schoolId === schoolId).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export function staffForSchool(schoolId: string) {
  return STAFF.filter((s) => s.schoolId === schoolId);
}

export function linksForSchool(schoolId: string) {
  return LINKS.filter((l) => l.schoolId === schoolId);
}
