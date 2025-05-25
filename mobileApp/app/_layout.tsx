import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { CVModelProvider } from "@/modules/cv/provider/CVModelProvider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CVModelProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CVModelProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
//tu not daj stvari ki se morajo zrenderat pred vsem drugim(fonti...)
