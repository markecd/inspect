import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "../../assets/styles/Achievements/achievements.style";
import { getAchievementDescription } from "@/hooks/useToast";
import Toast from "react-native-toast-message";

type Props = {
  achievement: {
    id: number;
    naziv: string;
    dosezen: number;
    icon: any;
  };
};

async function showAchievementInfo(achievementId: number){
                let achievementDescription = await getAchievementDescription(achievementId)
  
                Toast.show({
                  type: 'achievementInfoToast',
                  props: {
                    txt1: "Doseži: ",
                    txt2: achievementDescription,
                    txt3: require("../../assets/icons/Bogomolke_icon.png"),
                    onPress: () => {},
                  },
                });
}

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
