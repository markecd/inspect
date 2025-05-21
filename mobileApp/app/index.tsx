// app/index.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../modules/auth/firebase/auth';
import { Text } from 'react-native';

export default function Index() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/observation'); 
      } else {
        router.replace('/auth/login'); 
      }
    });

    return unsubscribe;
  }, []);

  return <Text>Počakajte trenutek...</Text>;
}