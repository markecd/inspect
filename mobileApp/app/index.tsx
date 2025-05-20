import { useEffect } from 'react';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/auth';
import { View, Text } from 'react-native';

import 'expo-router/entry';

export default function Index() {
  
  useEffect(() => {
    console.log("Checking auth state...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/model');  
      } else {
        router.replace('/login'); 
      }
    });

    return unsubscribe;
  }, []);

  return <Text>Počakajte trenutek...</Text>; 
}
