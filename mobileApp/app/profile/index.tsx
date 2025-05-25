import { View, Text, ScrollView } from 'react-native';
import ProfileDetails from '@/components/Profile/ProfileDetails';
import AchievementsDetails from '@/components/Profile/AchievementsDetails';

export default function ProfileScreen() {
  return (
    <ScrollView>
      <ProfileDetails></ProfileDetails>
      <AchievementsDetails></AchievementsDetails>
    </ScrollView>
  );
}
