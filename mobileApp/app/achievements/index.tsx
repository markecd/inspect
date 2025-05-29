import { FlatList, View, Text, ScrollView } from 'react-native';
import { useAchievements } from '../../hooks/useAchievements';
import { AchievementCard } from '../../components/Achievement/AchievementCard';
import { styles } from '../../assets/styles/Achievements/achievements.style';

export default function AchievementScreen() {
  const { achievements, loading } = useAchievements();
  
  
  const achievementsWithIcons = achievements.map(a => ({
    ...a,
    icon: require('../../assets/images/achievement_1.png'), 
  }));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Nalagam dosežke...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {achievementsWithIcons?.map((item, index) => (
          <AchievementCard key={index} achievement={item}></AchievementCard>
        ))}
      </ScrollView>
    </View>
  );
}
