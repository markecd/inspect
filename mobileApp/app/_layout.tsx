import Header from "@/components/Header/Header";
import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { CVModelProvider } from "@/modules/cv/provider/CVModelProvider";
import { UserStatsProvider } from "@/modules/gamification/contexts/UserStatsContext";
import { Stack, usePathname } from "expo-router";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast, { ToastProps } from "react-native-toast-message";
import { useEffect } from "react";
import { registerBackgroundSync } from '@/services/backgroundSync';



export default function RootLayout() {
  
    useEffect(() => {
      registerBackgroundSync(); 
    }, []);

  const pathname = usePathname();
  const hideNavbarOn = [
    "/auth/login",
    "/auth/register",
    "/observation",
    "/observation/details",
  ];
  const shouldShowNavbar = !hideNavbarOn.includes(pathname);

  const toastConfig = {
    achievementToast: (props: any) => (
      <TouchableOpacity style={styles.toast} onPress={props.props.onPress}>
        <Text style={styles.dosezenoText}>{props.props.txt1}</Text>
        <Text style={styles.achievementText}>{props.props.txt2}</Text>
        <Image
          source={require("../assets/images/achievement_1.png")}
          style={styles.achievementIcon}
        />
      </TouchableOpacity>
    ),
    achievementInfoToast: (props: any) => (
      <TouchableOpacity style={styles.toast} onPress={props.props.onPress}>
        <Text style={styles.dosezenoText}>{props.props.txt1}</Text>
        <Text style={styles.achievementText}>{props.props.txt2}</Text>
        <Image
          source={require("../assets/icons/info_icon.png")}
          style={styles.achievementIcon}
        />
      </TouchableOpacity>
    ),
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CVModelProvider>
          <UserStatsProvider>
            <View style={styles.container}>
              {shouldShowNavbar && <Header />}
              <Stack screenOptions={{ headerShown: false }} />
              {shouldShowNavbar && <Navbar />}
              <Toast config={toastConfig} />
            </View>
          </UserStatsProvider>
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
  toast: {
    width: "90%",
    top: 10,
    height: 100,
    backgroundColor: "#F0EAD2",
    borderRadius: 10,
    position: "absolute",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  dosezenoText: {
    color: "#6C584C",
    fontSize: 16,
    fontWeight: "bold",
  },
  achievementText: {
    color: "#6C584C",
    fontSize: 14,
    fontWeight: "bold",
  },
  achievementIcon: {
    width: 50,
    height: 50,
    alignSelf: "flex-end",
    position: "absolute",
    right: 5,
    top: 25
  }
});
