# NSHA

iPhone app for **North Shore Hebrew Academy** (Great Neck, NY): school news, important alerts,
an events calendar, and office contacts, for parents and students. Styled like the CTeen GN app:
Apple's own tab bar, a floating Liquid Glass header with the lion logo, white cards on a pale
background, Bricolage headlines, and light/dark mode that follows the phone.

## Screens

- **Home**: the current important notice, the next event (big card with a countdown), quick
  tiles, and the latest news.
- **News**: every post with filters (Announcements, Events, Polls, Photos). Polls can be voted
  on, posts can be liked, and tapping one opens it as an Apple card pop-up with comments.
- **Calendar**: upcoming events grouped by month.
- **School**: the logo, office contacts (tap to email or call), divisions, and Settings.
- **Settings**: Parent / Student / Show everything (filters what the feed shows).

## Content is sample data

Everything in `src/data/seed.ts` (posts, events, office phone numbers and emails) is a
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
