// app/index.tsx
import { useEffect } from "react";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../modules/auth/firebase/auth";
import { ActivityIndicator, Text, View } from "react-native";
import { syncData } from '../sync/syncData';

export default function Index() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await syncData();
        router.replace('/observation');
      } else {
        router.replace('/auth/login');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#6C584C",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator
        size="large"
        color="#ffffff"
      />
    </View>
  );
}
