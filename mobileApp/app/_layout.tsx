import { Slot, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import Navbar from '../components/Navbar/Navbar';

export default function RootLayout() {
  const pathname = usePathname();
  const hideNavbarOn = ['/auth/login', '/auth/register'];
  const shouldShowNavbar = !hideNavbarOn.includes(pathname);

  return (
    <View style={styles.container}>
      <Slot />
      {shouldShowNavbar && <Navbar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C584C', 
  },
});
