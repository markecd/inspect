import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { showAchievementInfo, useAchievements } from "../../hooks/useAchievements";
import styles from '../../assets/styles/Profile/profile-details.style';

export default function AchievementsDetails() {
  const { achievements, loading } = useAchievements();

  const getAchievementIcon = (id: number) => {
    
        return require('../../assets/images/achievement_1.png');
    
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>🔄 Nalagam dosežene dosežke...</Text>
      </View>
    );
  }

  const dosezeni = achievements.filter((a) => a.dosezen === 1);

  return (
    <View style={styles.containerDosezki}>
      <Text style={styles.heading}>Dosežki</Text>

      <FlatList
        data={dosezeni}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => showAchievementInfo(item.id)}>
            <Image
              source={getAchievementIcon(item.id)} 
              style={styles.achievementIcon}
            />
            <Text style={styles.cardTitle}>{item.naziv}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
