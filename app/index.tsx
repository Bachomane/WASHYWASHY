import { useEffect } from 'react';
import { userStorage } from '../lib/storage/userStorage';
import { Redirect } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Clear storage for testing
    userStorage.clearAllData();
  }, []);

  return <Redirect href="/auth" />;
} 