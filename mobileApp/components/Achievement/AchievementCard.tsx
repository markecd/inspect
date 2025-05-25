import { View, Text, Image } from 'react-native';
import { styles } from '../../assets/styles/Achievements/achievements.style';

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
    <View
      style={[
        styles.card,
        !achievement.dosezen && styles.cardBlurred,
      ]}
    >
     
      {achievement.dosezen === 1 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Doseženo</Text>
        </View>
      )}

     
      <Image
        source={achievement.icon}
        style={[
          styles.icon,
          !achievement.dosezen && styles.iconBlurred,
        ]}
      />

      
      <Text style={styles.title}>{achievement.naziv}</Text>
    </View>
  );
}

