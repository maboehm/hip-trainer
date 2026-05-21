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
import { Exercise, TimerConfig } from '../types';
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
        {exercise.timer && (timerVisible ? (
          <View style={styles.timerInline}>
            <Timer config={exercise.timer} autoStart onReset={() => setTimerVisible(false)} />
          </View>
        ) : (
          <TouchableOpacity style={styles.timerButton} onPress={() => setTimerVisible(true)}>
            <Text style={styles.timerButtonText}>⏱ Timer</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.navButtons}>
          <TouchableOpacity
            style={[styles.prevButton, isFirst && styles.disabledButton]}
            onPress={() => pagerRef.current?.slideBack()}
            disabled={isFirst}
          >
            <Text style={[styles.prevButtonText, isFirst && styles.disabledText]}>← Zurück</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, isLast && styles.disabledButton]}
            onPress={() => pagerRef.current?.slideForward()}
            disabled={isLast}
          >
            <Text style={[styles.nextButtonText, isLast && styles.disabledText]}>Weiter →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

// ─── Pill Row ────────────────────────────────────────────────────────────────

function PillRow({ timer, reps }: { timer?: TimerConfig; reps?: number | string }) {
  if (timer && timer.mode === 'interval') {
    return (
      <View style={styles.pillRow}>
        <Pill value={`${timer.sets}`} label="Wdh." />
        <Pill value={`${timer.holdSeconds}s`} label="Halten" />
        <Pill value={`${timer.restSeconds}s`} label="Pause" />
      </View>
    );
  }
  if (reps != null) {
    return (
      <View style={styles.pillRow}>
        <Pill value={`${reps}`} label="Wdh." />
      </View>
    );
  }
  return null;
}

function Pill({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillValue}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

// ─── Exercise Content ────────────────────────────────────────────────────────

function ExerciseContent({ exercise }: { exercise: Exercise }) {
  return (
    <>
      {/* 1. Name */}
      <Text style={styles.name}>{exercise.name}</Text>

      {/* 2. Rep / timer pills */}
      <PillRow timer={exercise.timer} reps={exercise.reps} />

      {/* 3. Wichtig — cues as blockquote */}
      {exercise.cues.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>Wichtig</Text>
          <View style={styles.cueBlock}>
            {exercise.cues.map((cue, i) => (
              <View key={i} style={styles.cueRow}>
                <Text style={styles.cueBullet}>•</Text>
                <Text style={styles.cue}>{cue}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* 4. Anleitung */}
      <Text style={styles.sectionLabel}>Anleitung</Text>
      {exercise.instructions.map((step, i) => (
        <View key={i} style={styles.instructionRow}>
          <Text style={styles.stepNumber}>{i + 1}.</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      {/* 5. Muskeln */}
      <Text style={[styles.sectionLabel, styles.sectionLabelBottom]}>Muskeln</Text>
      <Text style={styles.muscles}>{exercise.targetMuscles.join(' · ')}</Text>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },

  // Header
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

  // Exercise name
  name: { fontSize: 28, fontWeight: '700', color: '#111', marginBottom: 16 },

  // Pill row
  pillRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    minWidth: 64,
  },
  pillValue: { fontSize: 20, fontWeight: '700', color: '#111' },
  pillLabel: { fontSize: 12, fontWeight: '500', color: '#555', marginTop: 2 },

  // Section labels
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
  },
  sectionLabelBottom: { marginTop: 28 },

  // Wichtig blockquote
  cueBlock: {
    borderLeftWidth: 3,
    borderLeftColor: '#2a7aef',
    paddingLeft: 12,
    gap: 6,
  },
  cueRow: { flexDirection: 'row', gap: 6 },
  cueBullet: { fontSize: 15, color: '#111', lineHeight: 22 },
  cue: { fontSize: 15, fontWeight: '400', color: '#111', lineHeight: 22, flex: 1 },

  // Instructions
  instructionRow: { flexDirection: 'row', marginBottom: 8, gap: 8 },
  stepNumber: { fontSize: 15, fontWeight: '700', color: '#2a7aef', width: 20 },
  stepText: { fontSize: 15, fontWeight: '400', color: '#444', flex: 1, lineHeight: 22 },

  // Muscles
  muscles: { fontSize: 13, fontWeight: '400', color: '#888' },

  // Bottom action bar
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
