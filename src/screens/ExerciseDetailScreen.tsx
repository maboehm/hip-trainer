import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../App';
import exercises from '../../data/exercises.json';
import { Exercise } from '../types';
import Timer from '../components/Timer';
import SlidablePager, { SlidablePagerHandle } from '../components/SlidablePager';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ExerciseDetail'>;
  route: RouteProp<RootStackParamList, 'ExerciseDetail'>;
};

const exerciseList = exercises as Exercise[];

export default function ExerciseDetailScreen({ navigation, route }: Props) {
  const [currentIndex, setCurrentIndex] = useState(route.params.index);
  const [timerVisible, setTimerVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<SlidablePagerHandle>(null);

  const exercise = exerciseList[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= exerciseList.length - 1;

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

      {/* Pager body */}
      <SlidablePager
        ref={pagerRef}
        count={exerciseList.length}
        initialIndex={route.params.index}
        renderItem={index => <ExerciseContent exercise={exerciseList[index]} />}
        onIndexChange={setCurrentIndex}
        onTransitionStart={() => setTimerVisible(false)}
      />

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
            onPress={() => pagerRef.current?.slideBack()}
            disabled={isFirst}
          >
            <Text style={[styles.prevButtonText, isFirst && styles.disabledText]}>← Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, isLast && styles.disabledButton]}
            onPress={() => pagerRef.current?.slideForward()}
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
