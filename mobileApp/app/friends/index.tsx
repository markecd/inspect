import React from 'react';
import FriendList from '../../components/Friends/FriendList';
import { ScrollView } from 'react-native';
import {styles} from '../../assets/styles/Friends/friends-list.style'

export default function FriendsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.profileContentContainer}>
    <FriendList />
    </ScrollView>
  )
}
