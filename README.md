# Marquee

A school-community app in the spirit of ParentSquare / StudentSquare — an announcements
feed, alerts, a calendar, a staff directory, and quick links — built from the ground up to
be **re-skinned per school** instead of locked to one school's branding, and with the
theming layer pushed hard enough to actually prove it: five seeded demo schools, a live
in-app theme builder for a school that isn't even a preset, and light/dark mode, all
derived from the same two config colors.

## Content

- **Feed** — pinned + chronological announcements, pull-to-refresh, animated entrance.
  Posts can be plain text, a "photo" post (an icon tile standing in for a real photo), an
  **event** post with a date/location, a **poll** (tap to vote, live percentage bars,
  persisted locally), or an **alert** (urgent, visually distinct). Every post has an
  audience (`everyone` / `parents` / `students`), a like button, and a comment count that
  opens a full detail screen.
- **Alerts** — urgent + pinned posts pulled out of the general feed so they can't get
  buried under routine announcements.
- **Post detail** — full post, like/share, seeded comments plus an in-session "add a
  comment" box.
- **Calendar** — every event-type post, pulled automatically from the feed and sorted
  chronologically.
- **Directory** — staff contacts (tap to email or call) and a short list of quick links
  (portal, menu, bus routes, etc).
- **Settings** — appearance (light/dark), the school switcher, a live custom-theme
  builder, and the "viewing as" role switcher (see below).

## How theming actually works

Everything the app looks like comes from one object per school, in
[`src/theme/schools.ts`](src/theme/schools.ts): a name, mascot, two brand colors
(`primary`/`accent`), crest initials, and a small mascot glyph.
[`src/theme/colors.ts`](src/theme/colors.ts) derives a full palette (tints, borders,
fixed semantic colors for alerts) from those two colors *and* a light/dark scheme flag,
and [`src/theme/ThemeContext.tsx`](src/theme/ThemeContext.tsx) exposes the active school +
scheme + derived palette to every screen through `useTheme()`. No screen ever hardcodes a
color, a name, or an image — they all read off whichever school and scheme are active.

The app ships seeded with **five** example schools (Lincoln Park Middle School, Riverdale
High School, Sunridge Elementary, Ironwood High School, Bayview Academy) with distinct
colors, mascots, and a full matching set of posts/staff/links each, so switching schools
in Settings proves every feature re-themes, not just the header. **Settings → School** is
the live mechanism for *this* instance: picking a school updates the whole app's colors,
name, mascot, and crest instantly, and the choice is persisted with `AsyncStorage`.

**"Design your own"** goes one step further: Settings includes a live theme builder —
name, mascot, crest initials, and primary/accent color swatches — that edits a 6th,
fully custom `School` entry in real time, with no rebuild. That's the actual proof the
config layer is general: it works for a school that was never hardcoded, built entirely
from a settings screen. For a real deployment, re-skinning for an actual school means
either (a) adding one more entry to `SCHOOLS` with that school's real colors/name and
shipping an update, or (b) — the more realistic path for multiple live schools — loading
the active school's config from a backend instead of a local array, with everything
downstream unchanged. Either way, the theming layer itself doesn't need to change.

The "logo" is a generated crest (`src/theme/Crest.tsx`, an SVG circle with the school's
colors, initials, and a small mascot-icon badge) rather than a real image, since there's
no real school artwork to use for a demo. A real school's logo would just be an image
asset referenced from its `School` entry instead — the rest of the app (headers, the
Settings school picker) doesn't care whether the mark is drawn or an `<Image>`.

### The app icon is the one piece that *can't* work this way

iOS bakes the home-screen icon into the compiled app — there's no runtime config that
can change it after install, and no per-school icon can be generated on the fly. The
realistic version of "a school-themed icon":

- Ship with one generic icon for now (a marquee sign with a star, in a neutral
  navy/gold not tied to any school's colors — see `scripts/make-icon.cjs`).
- When a specific school wants its own icon, add it as an **alternate icon** via
  [`expo-alternate-app-icons`](https://www.npmjs.com/package/expo-alternate-app-icons)
  (the same pattern already used for Studento's icon pack — see
  `tests/studento-native/plugins/alternate-icons.js`) and set it as the active icon for
  that school's build. This still requires one rebuild per new icon; it is not something
  a settings screen can do by itself.

## Roles

Posts carry an `audience` field (`everyone` / `parents` / `students`). Settings has a
"Viewing as" switch that filters the feed and alerts accordingly. There's no real account
system in v1 — the role is just a local preference — but the data model and every screen
are already written against `audience`, so plugging in real accounts (parents linked to
their kid's audience, students to their own) later is a matter of setting `role` from auth
instead of a switch, not a rewrite.

## Interactions

Likes and poll votes are local-only (`src/data/interactions.ts`, `AsyncStorage`-backed) —
enough to make the feed feel alive without standing up a backend for a demo. Comments
added on the post-detail screen are in-memory for that screen visit only. A real backend
would own all three and sync across devices; the UI is already written against that
shape, so swapping a local store for API calls later doesn't touch any screen.

## Development

```bash
npm install
npm run web        # Expo web preview
npm run typecheck
npm run validate   # checks all expo-* deps match the SDK version
```

See [SHIP.md](SHIP.md) for the one manual step (Apple/EAS sign-in) needed before this can
ship to TestFlight over GitHub Actions.
