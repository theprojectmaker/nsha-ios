import { useFonts, BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { PrefsProvider } from '@/prefs';
import { C, IS_DARK } from '@/theme';

export default function RootLayout() {
  // Headline font: wait for it briefly so the first frame looks right, never more than 1.5s.
  const [fontsReady, fontError] = useFonts({ BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold });
  const [waited, setWaited] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!fontsReady && !fontError && !waited) return <View style={{ flex: 1, backgroundColor: C.bg }} />;

  return (
    <PrefsProvider>
      <StatusBar style={IS_DARK ? 'light' : 'dark'} />
      <Stack screenOptions={{ contentStyle: { backgroundColor: C.bg }, gestureEnabled: true }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Apple's card pop-up: slides up, the page behind shrinks back, drag down to close. */}
        <Stack.Screen name="post/[id]" options={{ presentation: 'modal', headerShown: false, contentStyle: { backgroundColor: C.bg } }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </PrefsProvider>
  );
}
