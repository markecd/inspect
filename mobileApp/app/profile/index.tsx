import { View, Text, ScrollView } from 'react-native';
import ProfileDetails from '@/components/Profile/ProfileDetails';
import AchievementsDetails from '@/components/Profile/AchievementsDetails';
import styles from '../../assets/styles/Profile/profile-details.style';


export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.profileContentContainer}>
      <ProfileDetails></ProfileDetails>
      <AchievementsDetails></AchievementsDetails>
    </ScrollView>
  );
}
