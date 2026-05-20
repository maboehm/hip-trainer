import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import exercises from '../../data/exercises.json';
import { Exercise } from '../types';
import Timer from '../components/Timer';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ExerciseDetail'>;
  route: RouteProp<RootStackParamList, 'ExerciseDetail'>;
};

const exerciseList = exercises as Exercise[];

export default function ExerciseDetailScreen({ navigation, route }: Props) {
  const { index } = route.params;
  const exercise = exerciseList[index];
  const [timerVisible, setTimerVisible] = useState(false);

  const isLast = index >= exerciseList.length - 1;

  const goNext = () => {
    if (!isLast) {
      setTimerVisible(false);
      navigation.replace('ExerciseDetail', {
        exerciseId: exerciseList[index + 1].id,
        index: index + 1,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Position indicator */}
        <Text style={styles.position}>
          {index + 1} of {exerciseList.length}
        </Text>

        {/* Exercise name */}
        <Text style={styles.name}>{exercise.name}</Text>

        {/* Target muscles */}
        <Text style={styles.sectionLabel}>Target Muscles</Text>
        <Text style={styles.muscles}>{exercise.targetMuscles.join(' · ')}</Text>

        {/* Instructions */}
        <Text style={styles.sectionLabel}>Instructions</Text>
        {exercise.instructions.map((step, i) => (
          <View key={i} style={styles.instructionRow}>
            <Text style={styles.stepNumber}>{i + 1}.</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        {/* Cues */}
        {exercise.cues.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Key Cues</Text>
            {exercise.cues.map((cue, i) => (
              <Text key={i} style={styles.cue}>
                • {cue}
              </Text>
            ))}
          </>
        )}

        {/* Timer section */}
        <View style={styles.timerSection}>
          {timerVisible ? (
            <Timer config={exercise.timer} />
          ) : (
            <TouchableOpacity
              style={styles.startTimerButton}
              onPress={() => setTimerVisible(true)}
            >
              <Text style={styles.startTimerText}>Start Timer</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Next exercise */}
        {!isLast && (
          <TouchableOpacity style={styles.nextButton} onPress={goNext}>
            <Text style={styles.nextButtonText}>Next Exercise →</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  position: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
  },
  muscles: {
    fontSize: 15,
    color: '#333',
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  stepNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2a7aef',
    width: 20,
  },
  stepText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  cue: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    lineHeight: 20,
  },
  timerSection: {
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  startTimerButton: {
    backgroundColor: '#2a7aef',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startTimerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButton: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2a7aef',
  },
  nextButtonText: {
    color: '#2a7aef',
    fontSize: 16,
    fontWeight: '600',
  },
});
