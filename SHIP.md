# Getting Marquee onto TestFlight

The repo, slug, bundle id and EAS project are already set up as Marquee (renamed from the
original "Pennant" working name — `com.solyapps.marquee`, `theprojectmaker/marquee-ios`,
EAS project ID `0b346ca8-3768-420f-b576-e7350763a4b6`). Steps 1 is already done; the rest
is the one interactive stretch only you can do.

1. ~~`npx eas-cli init`~~ — done, `app.json` already has `extra.eas.projectId` + `owner`.
2. `npx eas-cli credentials -p ios` and sign in with your Apple ID when it asks (creates
   certs/profile for `com.solyapps.marquee`). Do this yourself; nobody else should type
   Apple credentials.
3. Run `tests/set-expo-token-marquee.ps1` to add the EXPO_TOKEN secret to
   `theprojectmaker/marquee-ios` (the repo is already created and pushed).
4. First build with submit off: `gh workflow run ios-testflight.yml -R theprojectmaker/marquee-ios -f submit=false`, download the `.ipa` artifact.
5. `npx eas-cli submit -p ios --path <app.ipa>` once, interactively: it creates the App
   Store Connect app. Put the printed `ascAppId` into `eas.json` -> `submit.production.ios.ascAppId`, commit, push.
6. From then on: `gh workflow run ios-testflight.yml -R theprojectmaker/marquee-ios -f submit=true`.

This is the one step that needs you — EAS can't create iOS credentials or an App Store
Connect app without an interactive Apple sign-in. Everything else (build, typecheck,
future TestFlight submits) runs unattended on GitHub's free macOS runners.
