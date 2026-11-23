import { useFonts, BarlowCondensed_800ExtraBold, BarlowCondensed_800ExtraBold_Italic, BarlowCondensed_900Black_Italic } from '@expo-google-fonts/barlow-condensed';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { PrefsProvider } from '@/prefs';
import { C } from '@/theme';

export default function RootLayout() {
  // Headline font: wait for it briefly so the first frame looks right, never more than 1.5s.
  const [fontsReady, fontError] = useFonts({ BarlowCondensed_800ExtraBold, BarlowCondensed_800ExtraBold_Italic, BarlowCondensed_900Black_Italic });
  const [waited, setWaited] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!fontsReady && !fontError && !waited) return <View style={{ flex: 1, backgroundColor: C.page }} />;

  return (
    <PrefsProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ contentStyle: { backgroundColor: C.page }, headerShown: false, gestureEnabled: true }}>
        <Stack.Screen name="(tabs)" />
        {/* Apple's card pop-up: slides up, drag down to close. */}
        <Stack.Screen name="post/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" />
      </Stack>
    </PrefsProvider>
  );
}
