import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { CVModelProvider } from "@/modules/cv/provider/CVModelProvider";
import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function RootLayout() {

  const pathname = usePathname();
  const hideNavbarOn = ["/auth/login", "/auth/register"];
  const shouldShowNavbar = !hideNavbarOn.includes(pathname);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CVModelProvider>
          <View style={styles.container}>
            <Stack screenOptions={{ headerShown: false }} />
            {shouldShowNavbar && <Navbar />}
          </View>
        </CVModelProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C584C",
  },
});
