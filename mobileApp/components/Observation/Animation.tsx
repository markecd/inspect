import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function WaveformAnimation() {
  const bars = Array.from({ length: 25}, () => useRef(new Animated.Value(1)).current);

  useEffect(() => {
    bars.forEach((bar, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: Math.random() * 30 + 10,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: 10,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {bars.map((bar, i) => (
        <Animated.View key={i} style={[styles.bar, { height: bar }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  bar: {
    width: 4,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
});
