import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import styles from '../../assets/styles/Navbar/navbar.style';
import { openDatabase } from '@/services/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const tabs = [
    { path: '/achievements', icon: require('../../assets/images/achievements.png'), style: styles.icon },
    { path: '/collection', icon: require('../../assets/images/collection.png'), style: styles.icon },
    { path: '/observation', icon: require('../../assets/images/scan.png'), style: styles.centerIcon },
    { path: '/friends', icon: require('../../assets/images/friends.png'), style: styles.icon },
    { path: '/notifications', icon: require('../../assets/images/notifications.png'), style: styles.icon },
  ];

  const databaseClearance = async () => {
    const db = await openDatabase();

    try {
      db.execSync(`DELETE FROM OPAZANJE`);
      db.execSync(`DELETE FROM UPORABNIK_DOSEZEK`);
      db.execSync(`UPDATE ROD SET najdeno = 0 WHERE najdeno = 1`);
      db.execSync(`UPDATE UPORABNIK SET xp = 0, level = 1`);
      AsyncStorage.removeItem("user_xp");
      AsyncStorage.removeItem("user_level");
      console.log("✅ Database reset successfully.");
    } catch (error) {
      console.error("❌ Error during database clearance:", error);
    }
  };

  const checkLvl = async() => {
        const db = await openDatabase();
    const result = db.getAllSync(
      `
      SELECT * FROM UPORABNIK_DOSEZEK
      `
    )
    
  }

  return (
    <View style={styles.container}>
      {tabs.map((tab, i) => (
        <TouchableOpacity key={i} onPress={
          () => router.push(tab.path)
        
          //databaseClearance
          }>
          <Image source={tab.icon} style={tab.style} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
