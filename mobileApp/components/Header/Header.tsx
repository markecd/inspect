import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import styles from '../../assets/styles/Header/header.style';
import { router } from 'expo-router';
import { auth, signOut } from '../../modules/auth/firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const progress = 0.65; // 65% za primer – lahko dinamično

  /*const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("local_user_id");
      router.replace('/auth/login');
    } catch (error) {
      console.error("Napaka pri odjavi:", error);
    }
  }; */

  const handleUserIconPress = () => {
    router.push('/profile'); 
  };

  return (
    <View style={styles.container}>
      {/*<TouchableOpacity onPress={handleLogout}>
                <Text>Odjava</Text>
            </TouchableOpacity>*/}
        <Image source={require('../../assets/icons/shield.png')} style={styles.icon1} />
        <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <TouchableOpacity onPress={handleUserIconPress}>
        <Image source={require('../../assets/icons/user.png')} style={styles.icon2} />
        </TouchableOpacity>
    </View>
  );
}
