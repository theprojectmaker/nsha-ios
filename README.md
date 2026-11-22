# Pennant

A school-community app in the spirit of ParentSquare / StudentSquare — an announcements
feed, a calendar, a staff directory, and quick links — built from the ground up to be
**re-skinned per school** instead of locked to one school's branding.

## Content

- **Feed** — pinned + chronological announcements. Posts can be plain text, a
  "photo" post (an icon tile standing in for a real photo), or an event post
  with a date/location. Each post has an audience (`everyone` / `parents` /
  `students`).
- **Calendar** — every event-type post, pulled automatically from the feed and
  sorted chronologically.
- **Directory** — staff contacts (tap to email or call) and a short list of
  quick links (portal, menu, bus routes, etc).
- **Settings** — the school switcher and the "viewing as" role switcher (see
  below).

## How theming actually works

Everything the app looks like comes from one object per school, in
[`src/theme/schools.ts`](src/theme/schools.ts): a name, mascot, two brand
colors (`primary`/`accent`), and crest initials. [`src/theme/colors.ts`](src/theme/colors.ts)
derives a full palette (tints, borders) from those two colors, and
[`src/theme/ThemeContext.tsx`](src/theme/ThemeContext.tsx) exposes the active
school + derived palette to every screen through `useTheme()`. No screen ever
hardcodes a color, a name, or an image — they all read off whichever school is
active.

The app ships seeded with two example schools ("Lincoln Park Middle School"
and "Riverdale High School") so the re-skinning actually has something to
switch between. **Settings → School** is the live mechanism for *this*
instance: picking a school updates the whole app's colors, name, mascot, and
crest instantly, and the choice is persisted with `AsyncStorage`. For a real
deployment, re-skinning for an actual school means either (a) adding one more
entry to `SCHOOLS` with that school's real colors/name and shipping an update,
or (b) — the more realistic path for multiple live schools — loading the
active school's config from a backend instead of a local array, with
everything downstream unchanged. Either way, the theming layer itself doesn't
need to change.

The "logo" is a generated crest (`src/theme/Crest.tsx`, an SVG circle with the
school's colors and initials) rather than a real image, since there's no real
school artwork to use for a demo. A real school's logo would just be an image
asset referenced from its `School` entry instead — the rest of the app
(headers, the Settings school picker) doesn't care whether the mark is drawn
or an `<Image>`.

### The app icon is the one piece that *can't* work this way

iOS bakes the home-screen icon into the compiled app — there's no runtime
config that can change it after install, and no per-school icon can be
generated on the fly. The realistic version of "a school-themed icon":

- Ship with one generic icon for now (a plain pennant-flag mark, not tied to
  any school's colors — see `scripts/make-icon.cjs`).
- When a specific school wants its own icon, add it as an **alternate icon**
  via [`expo-alternate-app-icons`](https://www.npmjs.com/package/expo-alternate-app-icons)
  (the same pattern already used for Studento's icon pack — see
  `tests/studento-native/plugins/alternate-icons.js`) and set it as the active
  icon for that school's build. This still requires one rebuild per new icon;
  it is not something a settings screen can do by itself.

## Roles

Posts carry an `audience` field (`everyone` / `parents` / `students`).
Settings has a "Viewing as" switch that filters the feed accordingly. There's
no real account system in v1 — the role is just a local preference — but the
data model and every screen are already written against `audience`, so
plugging in real accounts (parents linked to their kid's audience, students
to their own) later is a matter of setting `role` from auth instead of a
switch, not a rewrite.

## Development

```bash
npm install
npm run web        # Expo web preview
npm run typecheck
npm run validate   # checks all expo-* deps match the SDK version
```

See [SHIP.md](SHIP.md) for the one manual step (Apple/EAS sign-in) needed
before this can ship to TestFlight over GitHub Actions.
