# NSHA

iPhone app for **North Shore Hebrew Academy** (Great Neck, NY): school news, important alerts,
an events calendar, a Lions scoreboard, and office contacts, for parents and students.

Design ("Varsity Lions"): built from the logo itself. Heavy slanted Barlow Condensed headlines
like the NSHA lettering, a blue hero on Home with the lion and a giant "LIONS", the slanted gold
bars from the logo as dividers and markers, black date blocks and scoreboard tiles, flat panels
with a colored side bar per post type, jersey-patch tags. Apple's own tab bar on iPhone; light
and dark follow the phone.

## Screens

- **Home**: hero with greeting and the Hebrew date, the current alert, the next event with a
  countdown, the scoreboard (recent results and the next game), and the latest news.
- **News**: every post with filters (Announcements, Events, Polls, Photos). Polls can be voted
  on, posts can be liked, and tapping one opens it as an Apple card pop-up with comments.
- **Calendar**: upcoming events and games grouped by month.
- **School**: the logo, office contacts (tap to email or call), divisions, and Settings.
- **Settings**: Parent / Student / Show everything (filters what the feed shows).

## Content is sample data

Everything in `src/data/seed.ts` (posts, events, game scores with generic opponents, office
phone numbers and emails) is a
placeholder so the app has something to show. It is not official NSHA information. Before a
real release the school's actual content needs to come from the school, ideally through a small
server the office can post to (the CTeen GN app's Cloudflare backend is the model for that).

## Brand

Colors were sampled from the logo (`assets/nsha-logo.png`): sky blue `#56A1DA` (used a little
deeper, `#3E8FD0`, for text and buttons), gold `#FDD18A` / `#D9A436`, and black. All colors live
in `src/theme.ts`. The app icon (`assets/icon.png`) is the full logo on a white-to-pale-blue
square. The logo is the school's; App Store release should have the school's OK.

## Development

```bash
npm install
npm run web        # browser preview
npx tsc --noEmit
node scripts/check-sdk.cjs
npx expo export --platform ios --output-dir dist   # catches errors the browser misses
```

See [SHIP.md](SHIP.md) for getting it onto TestFlight.
