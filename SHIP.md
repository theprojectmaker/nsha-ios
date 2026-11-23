# Getting NSHA onto TestFlight

Already done: bundle id `com.solyapps.nsha`, EAS project `@solomonsasson/nsha`
(projectId `c5250115-571a-41ca-9bec-ed3f660eb795`), public repo
`theprojectmaker/nsha-ios` with the GitHub Actions workflow.

What needs you (Apple sign-in can't be done for you):

1. Run `tests/set-expo-token-nsha.ps1` and paste an Expo access token (adds the EXPO_TOKEN
   secret to the repo).
2. `npx eas-cli credentials -p ios` in this folder, sign in with your Apple ID when asked
   (creates the certificate and profile for `com.solyapps.nsha`).

After that the rest can run without you:

3. First build with submit off: `gh workflow run ios-testflight.yml -R theprojectmaker/nsha-ios -f submit=false`.
4. `npx eas-cli submit -p ios --path <app.ipa>` once, interactively: it creates the App Store
   Connect app. Put the printed `ascAppId` in `eas.json` under `submit.production.ios.ascAppId`,
   commit, push.
5. From then on: `gh workflow run ios-testflight.yml -R theprojectmaker/nsha-ios -f submit=true`.
