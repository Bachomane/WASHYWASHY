import React, { useEffect, useState } from 'react';
import { Stack, Redirect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { View, Text } from 'react-native';
import LoadingScreen from '../components/LoadingScreen';
import { AuthProvider, useAuth } from '../lib/auth-context';
import AuthScreen from './auth';

function RootLayoutNav() {
  const { user, loading: authLoading } = useAuth();
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    console.log('[RootLayoutNav] Component mounted');
    SplashScreen.hideAsync();
    
    const timer = setTimeout(() => {
      console.log('[RootLayoutNav] Min loading time completed');
      setMinLoadingTime(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Debug current state
  console.log('[RootLayoutNav] Current state:', {
    user: !!user,
    authLoading,
    fontsLoaded,
    fontError: !!fontError,
    minLoadingTime,
    shouldShowLoading: !fontsLoaded || !!fontError || authLoading || minLoadingTime
  });

  // Show loading screen only if absolutely necessary
  if (!fontsLoaded || fontError) {
    console.log('[RootLayoutNav] Showing loading due to fonts');
    return <LoadingScreen />;
  }

  // After fonts are loaded, show auth screen if not authenticated
  if (!user) {
    console.log('[RootLayoutNav] Showing auth screen - no user');
    return <AuthScreen />;
  }

  // User is authenticated, show main app
  console.log('[RootLayoutNav] Showing main app - user authenticated');
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        animation: 'fade',
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="faq" options={{ headerShown: true }} />
        <Stack.Screen name="terms" options={{ headerShown: true }} />
        <Stack.Screen name="account-settings" options={{ headerShown: true }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}