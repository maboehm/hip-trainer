import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Props {
  progress: number; // 0 to 1
  color?: string;
  snap?: boolean; // true = instant reset (new phase start), false = animate
}

const SNAP_DURATION = 50; // ms to for the bar to snap to the new value
const ANIMATE_DURATION = 200; // ms for the bar to animate to the next step

export default function ProgressBar({ progress, color = '#2a7aef', snap = false }: Props) {
  const clamped = Math.min(1, Math.max(0, progress));
  // Bar drains: full at progress=0, empty at progress=1
  const fillRatio = 1 - clamped;

  const animatedWidth = useRef(new Animated.Value(fillRatio)).current;

  useEffect(() => {
    const duration = snap ? SNAP_DURATION : ANIMATE_DURATION;
    Animated.timing(animatedWidth, {
      toValue: fillRatio,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [fillRatio, snap]);

  const widthPercent = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: widthPercent, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
