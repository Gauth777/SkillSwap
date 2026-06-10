import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '@/store/useAppStore';

export default function RootLayout() {
  const isOnboarded = useAppStore((state) => state.isOnboarded);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // If router is not ready, segments might be empty
    if (!segments[0]) return;

    const currentSegment = segments[0];
    const isInsideTabs = currentSegment === '(tabs)';
    const isInsideOnboarding = currentSegment === 'onboarding';

    if (!isOnboarded && !isInsideOnboarding) {
      // Redirect to onboarding if they haven't onboarded yet
      router.replace('/onboarding');
    } else if (isOnboarded && isInsideOnboarding) {
      // Redirect to tabs if already onboarded and on the onboarding screen
      router.replace('/(tabs)');
    }
  }, [isOnboarded, segments]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="create-post" options={{ presentation: 'modal' }} />
        <Stack.Screen name="swap/[id]" />
        <Stack.Screen name="ai-assistant" />
      </Stack>
    </>
  );
}
