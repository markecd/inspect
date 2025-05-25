import { FlatList, View, Text } from 'react-native';
import { useAchievements } from '../../hooks/useAchievements';
import { AchievementCard } from '../../components/Achievement/AchievementCard';
import { styles } from '../../assets/styles/Achievements/achievements.style';

export default function AchievementScreen() {
  const { achievements, loading } = useAchievements();
  
  
  const achievementsWithIcons = achievements.map(a => ({
    ...a,
    icon: require('../../assets/images/achievements.png'), 
  }));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>🔄 Nalagam dosežke...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={achievementsWithIcons}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      numColumns={2}
      renderItem={({ item }) => <AchievementCard achievement={item} />}
    />
  );
}
