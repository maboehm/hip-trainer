import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { RootStackParamList } from '../../App';
import exercises from '../../data/exercises.json';
import { Exercise } from '../types';
import Timer from '../components/Timer';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ExerciseDetail'>;
  route: RouteProp<RootStackParamList, 'ExerciseDetail'>;
};

const exerciseList = exercises as Exercise[];
const SLIDE_DURATION = 220;

// Two slots: A and B. Each has its own translateX Animated.Value.
// Invariant between transitions: active slot is at 0, idle slot is parked at +width (off-screen right).
// On transition:
//   1. Load content into idle slot.
//   2. Snap idle slot to the entry side (±width) — it's already off-screen so no visible jump.
//   3. Animate both slots simultaneously to their exit/entry positions.
//   4. On completion, park the now-idle (outgoing) slot back to +width and flip activeSlot.

type Slot = 'A' | 'B';

export default function ExerciseDetailScreen({ navigation, route }: Props) {
  const [currentIndex, setCurrentIndex] = useState(route.params.index);
  const [timerVisible, setTimerVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const panRef = useRef<PanGestureHandler>(null);

  const activeSlot = useRef<Slot>('A');
  const [slotContent, setSlotContent] = useState<{ A: number; B: number }>({
    A: route.params.index,
    B: route.params.index,
  });

  // Each slot has its own translateX. Invariant: active=0, idle=+width.
  const translateA = useRef(new Animated.Value(0)).current;
  const translateB = useRef(new Animated.Value(width)).current;

  const exercise = exerciseList[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= exerciseList.length - 1;

  const slide = useCallback((nextIndex: number, direction: 'forward' | 'back') => {
    if (transitioning) return;

    const current = activeSlot.current;
    const next: Slot = current === 'A' ? 'B' : 'A';
    const currentAnim = current === 'A' ? translateA : translateB;
    const nextAnim = current === 'A' ? translateB : translateA;

    const enterFrom = direction === 'forward' ? width : -width;
    const exitTo = direction === 'forward' ? -width : width;

    // Step 1: load content into idle slot
    setSlotContent(prev => ({ ...prev, [next]: nextIndex }));
    setTransitioning(true);
    setTimerVisible(false);

    // Step 2: snap idle slot to entry side (it's already off-screen, no visible jump)
    nextAnim.setValue(enterFrom);

    // Step 3: animate both simultaneously
    Animated.parallel([
      Animated.timing(currentAnim, { toValue: exitTo, duration: SLIDE_DURATION, useNativeDriver: true }),
      Animated.timing(nextAnim, { toValue: 0, duration: SLIDE_DURATION, useNativeDriver: true }),
    ]).start(() => {
      // Step 4: park outgoing slot off-screen right (restore invariant), flip active
      currentAnim.setValue(width);
      activeSlot.current = next;
      setCurrentIndex(nextIndex);
      setTransitioning(false);
    });
  }, [transitioning, width]);

  const goNext = () => { if (!isLast) slide(currentIndex + 1, 'forward'); };
  const goPrev = () => { if (!isFirst) slide(currentIndex - 1, 'back'); };

  const onGestureEvent = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    const { translationX, translationY, state } = nativeEvent;
    if (state === 5) {
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);
      if (absX > 50 && absX > absY) {
        translationX < 0 ? goNext() : goPrev();
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'ExerciseList' }] })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerPosition}>
          {currentIndex + 1} of {exerciseList.length}
        </Text>
      </View>

      {/* Clipping wrapper */}
      <PanGestureHandler
        ref={panRef}
        onHandlerStateChange={onGestureEvent}
        simultaneousHandlers={scrollRef}
        activeOffsetX={[-20, 20]}
        failOffsetY={[-10, 10]}
      >
        <View style={styles.bodyClip}>
          {/* Slot A */}
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: translateA }] }]}>
            <NativeViewGestureHandler ref={scrollRef} simultaneousHandlers={panRef}>
              <ScrollView contentContainerStyle={styles.content} scrollEventThrottle={16}>
                <ExerciseContent exercise={exerciseList[slotContent.A]} />
              </ScrollView>
            </NativeViewGestureHandler>
          </Animated.View>
          {/* Slot B */}
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: translateB }] }]}>
            <ScrollView contentContainerStyle={styles.content} scrollEventThrottle={16}>
              <ExerciseContent exercise={exerciseList[slotContent.B]} />
            </ScrollView>
          </Animated.View>
        </View>
      </PanGestureHandler>

      {/* Fixed bottom bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 12 }]}>
        {timerVisible ? (
          <View style={styles.timerInline}>
            <Timer config={exercise.timer} />
          </View>
        ) : (
          <TouchableOpacity style={styles.timerButton} onPress={() => setTimerVisible(true)}>
            <Text style={styles.timerButtonText}>⏱ Timer</Text>
          </TouchableOpacity>
        )}
        <View style={styles.navButtons}>
          <TouchableOpacity
            style={[styles.prevButton, isFirst && styles.disabledButton]}
            onPress={goPrev}
            disabled={isFirst}
          >
            <Text style={[styles.prevButtonText, isFirst && styles.disabledText]}>← Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, isLast && styles.disabledButton]}
            onPress={goNext}
            disabled={isLast}
          >
            <Text style={[styles.nextButtonText, isLast && styles.disabledText]}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

function ExerciseContent({ exercise }: { exercise: Exercise }) {
  return (
    <>
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.sectionLabel}>Target Muscles</Text>
      <Text style={styles.muscles}>{exercise.targetMuscles.join(' · ')}</Text>
      <Text style={styles.sectionLabel}>Instructions</Text>
      {exercise.instructions.map((step, i) => (
        <View key={i} style={styles.instructionRow}>
          <Text style={styles.stepNumber}>{i + 1}.</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
      {exercise.cues.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>Key Cues</Text>
          {exercise.cues.map((cue, i) => (
            <Text key={i} style={styles.cue}>• {cue}</Text>
          ))}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: { paddingVertical: 4 },
  backButtonText: { fontSize: 20, color: '#555', fontWeight: '400', lineHeight: 24 },
  headerPosition: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bodyClip: { flex: 1, overflow: 'hidden' },
  content: { padding: 20, paddingBottom: 24 },
  name: { fontSize: 28, fontWeight: '700', color: '#111', marginBottom: 24 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
  },
  muscles: { fontSize: 15, color: '#333' },
  instructionRow: { flexDirection: 'row', marginBottom: 8, gap: 8 },
  stepNumber: { fontSize: 15, fontWeight: '700', color: '#2a7aef', width: 20 },
  stepText: { fontSize: 15, color: '#333', flex: 1, lineHeight: 22 },
  cue: { fontSize: 14, color: '#555', marginBottom: 4, lineHeight: 20 },
  actionBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  timerInline: { borderRadius: 12, overflow: 'hidden' },
  timerButton: {
    backgroundColor: '#2a7aef',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  timerButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  navButtons: { flexDirection: 'row', gap: 10 },
  prevButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  prevButtonText: { color: '#555', fontSize: 15, fontWeight: '500' },
  nextButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#2a7aef',
  },
  nextButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  disabledButton: { opacity: 0.35 },
  disabledText: {},
});
