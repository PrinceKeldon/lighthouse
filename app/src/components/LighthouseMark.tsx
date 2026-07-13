import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// A very small, almost-a-signature mark: a star, a tapered tower, and a
// couple of quiet waves. Built from plain Views/Text on purpose — no
// react-native-svg dependency needed for something this simple.
// `scale` lets the same mark serve both the inline header usage (scale 1)
// and a larger splash-screen presence (scale 3+) without a second
// component or an actual image asset.
export function LighthouseMark({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.star, { color, fontSize: 13 * scale, marginBottom: 3 * scale }]}>✦</Text>
      <View
        style={[
          styles.tower,
          {
            borderBottomColor: color,
            borderLeftWidth: 8 * scale,
            borderRightWidth: 8 * scale,
            borderBottomWidth: 18 * scale,
          },
        ]}
      />
      <View style={[styles.waves, { marginTop: 6 * scale }]}>
        <Text style={[styles.waveText, { color, fontSize: 11 * scale }]}>〜〜〜</Text>
        <View style={{ width: 18 * scale }} />
        <Text style={[styles.waveText, { color, fontSize: 11 * scale }]}>〜〜〜</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 4,
  },
  star: {},
  tower: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  waves: {
    flexDirection: 'row',
  },
  waveText: {
    letterSpacing: 1,
    opacity: 0.6,
  },
});
