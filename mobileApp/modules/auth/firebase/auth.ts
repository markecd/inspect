import {
    initializeAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    // @ts-ignore
    getReactNativePersistence,
    signOut,
  } from 'firebase/auth';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import app from './config';
  
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  
  export {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  };
  