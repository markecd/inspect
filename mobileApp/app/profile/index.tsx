import { View, Text, ScrollView } from 'react-native';
import ProfileDetails from '@/components/Profile/ProfileDetails';
import AchievementsDetails from '@/components/Profile/AchievementsDetails';
import styles from '../../assets/styles/Profile/profile-details.style';
import CollectionDetails from '@/components/Profile/CollectionDetails';
import FriendList from '@/components/Friends/FriendList';
import { useLocalSearchParams } from 'expo-router';




export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const friendId = id ? parseInt(id as string) : undefined;
  
  return (
    <ScrollView contentContainerStyle={styles.profileContentContainer}>
      <ProfileDetails friendId={friendId} />
      <CollectionDetails friendId={friendId} />
      <AchievementsDetails friendId={friendId} />
    </ScrollView>
  );
}
