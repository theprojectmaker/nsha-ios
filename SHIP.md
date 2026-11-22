# Getting Pennant onto TestFlight

1. `cd pennant-native && npx eas-cli login` then `npx eas-cli init` (creates the EAS project, writes `extra.eas.projectId` + `owner` into app.json).
2. `npx eas-cli credentials -p ios` and sign in with your Apple ID when it asks (creates certs/profile for `com.solyapps.pennant`). Do this yourself; nobody else should type Apple credentials.
3. Create the repo `theprojectmaker/pennant-ios` (public, to keep GitHub Actions minutes free — same pattern as the other apps), push this folder, then run `tests/set-expo-token-pennant.ps1` to add the EXPO_TOKEN secret.
4. First build with submit off: `gh workflow run ios-testflight.yml -R theprojectmaker/pennant-ios -f submit=false`, download the `.ipa` artifact.
5. `npx eas-cli submit -p ios --path <app.ipa>` once, interactively: it creates the App Store Connect app. Put the printed `ascAppId` into `eas.json` -> `submit.production.ios.ascAppId`, commit, push.
6. From then on: `gh workflow run ios-testflight.yml -R theprojectmaker/pennant-ios -f submit=true`.

This is the one step that needs you — EAS can't create iOS credentials or an App Store Connect app without an interactive Apple sign-in. Everything else (build, typecheck, future TestFlight submits) runs unattended on GitHub's free macOS runners.
