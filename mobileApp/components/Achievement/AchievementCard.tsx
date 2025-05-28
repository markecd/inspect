import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "../../assets/styles/Achievements/achievements.style";
import { showAchievementInfo } from "@/modules/gamification/utils/achievementUtils";

type Props = {
  achievement: {
    id: number;
    naziv: string;
    dosezen: number;
    icon: any;
  };
};


export function AchievementCard({ achievement }: Props) {
  return (
    <TouchableOpacity style={styles.achievementCardOuterContainer} onPress={() => showAchievementInfo(achievement.id)}>
      <View style={[styles.card, !achievement.dosezen && styles.cardBlurred]}>
        {achievement.dosezen === 1 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Doseženo</Text>
          </View>
        )}

        <Image
          source={achievement.icon}
          style={[styles.icon, !achievement.dosezen && styles.iconBlurred]}
        />
      </View>
      <Text style={styles.title}>{achievement.naziv}</Text>
    </TouchableOpacity>
  );
}
