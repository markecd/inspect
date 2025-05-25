import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import styles from '../../assets/styles/Navbar/navbar.style';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { path: '/achievements', icon: require('../../assets/images/achievements.png'), style: styles.icon },
    { path: '/collection', icon: require('../../assets/images/collection.png'), style: styles.icon },
    { path: '/observation', icon: require('../../assets/images/scan.png'), style: styles.centerIcon },
    { path: '/friends', icon: require('../../assets/images/friends.png'), style: styles.icon },
    { path: '/profile', icon: require('../../assets/images/notifications.png'), style: styles.icon },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, i) => (
        <TouchableOpacity key={i} onPress={() => router.push(tab.path)}>
          <Image source={tab.icon} style={tab.style} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
