import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// A very small, almost-a-signature mark: a star, a tapered tower, and a
// couple of quiet waves. Built from plain Views/Text on purpose — no
// react-native-svg dependency needed for something this simple.
export function LighthouseMark({ color }: { color: string }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.star, { color }]}>✦</Text>
      <View style={[styles.tower, { borderBottomColor: color }]} />
      <View style={styles.waves}>
        <Text style={[styles.waveText, { color }]}>〜〜〜</Text>
        <View style={{ width: 18 }} />
        <Text style={[styles.waveText, { color }]}>〜〜〜</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 4,
  },
  star: {
    fontSize: 13,
    marginBottom: 3,
  },
  tower: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  waves: {
    flexDirection: 'row',
    marginTop: 6,
  },
  waveText: {
    fontSize: 11,
    letterSpacing: 1,
    opacity: 0.6,
  },
});
