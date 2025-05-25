import React from 'react';
import { View, Text, Image } from 'react-native';
import  styles  from '../../assets/styles/Profile/profile-details.style';

const ProfileDetails = () => {
    return (
      <View style={styles.container}>
        <View style={styles.avatar} />
        <Text style={styles.username}>LjubimHrosce12</Text>
        <View style={styles.infoBox}>
          <Text style={styles.value}>46</Text><Text style={styles.label}>opažanj</Text>
          <Text style={styles.value}>5</Text><Text style={styles.label}>kolekcij</Text>
          <Text style={styles.value}>12</Text><Text style={styles.label}>dosežkov</Text>
          <Text style={styles.label}>Član od 2022</Text>
        </View>
        <Text style={styles.levelTag}>Level 18</Text>
      </View>
    );
  };
  
  export default ProfileDetails;