import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimerConfig } from '../types';
import { useTimer } from '../hooks/useTimer';
import ProgressBar from './ProgressBar';

interface Props {
  config: TimerConfig;
}

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}`;
}

function phaseColor(phase: string): string {
  if (phase === 'hold') return '#2a7aef';
  if (phase === 'rest') return '#34c759';
  return '#aaa';
}

function phaseTotal(config: TimerConfig, phase: string): number {
  if (config.mode === 'simple') return config.durationSeconds;
  if (phase === 'hold') return config.holdSeconds;
  if (phase === 'rest') return config.restSeconds;
  return 1;
}

export default function Timer({ config }: Props) {
  const [state, controls] = useTimer(config);
  const { phase, remaining, currentSet, totalSets, isRunning } = state;

  const total = phaseTotal(config, phase);
  const progress = phase === 'idle' ? 0 : (total - remaining) / total;
  const color = phaseColor(phase);

  if (phase === 'done') {
    return (
      <View style={styles.container}>
        <Text style={styles.doneText}>Done!</Text>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={controls.reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'idle') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={controls.start}>
          <Text style={styles.buttonText}>Start Timer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {config.mode === 'interval' && (
        <>
          <View style={styles.phaseRow}>
            <Text style={[styles.phaseLabel, phase === 'hold' ? styles.active : styles.inactive]}>
              HOLD
            </Text>
            <Text style={styles.phaseDivider}> · </Text>
            <Text style={[styles.phaseLabel, phase === 'rest' ? styles.active : styles.inactive]}>
              REST
            </Text>
          </View>
          <Text style={styles.setCounter}>Set {currentSet} of {totalSets}</Text>
        </>
      )}

      <Text style={[styles.countdown, { color }]}>{formatSeconds(remaining)}</Text>

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color={color} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={isRunning ? controls.pause : controls.resume}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Resume'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={controls.reset}>
          <Text style={[styles.buttonText, { color: '#555' }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  active: {
    color: '#111',
  },
  inactive: {
    color: '#ccc',
  },
  phaseDivider: {
    color: '#ccc',
    fontSize: 15,
  },
  setCounter: {
    fontSize: 14,
    color: '#777',
  },
  countdown: {
    fontSize: 72,
    fontWeight: '200',
    letterSpacing: -2,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 4,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 110,
  },
  pauseButton: {
    backgroundColor: '#2a7aef',
  },
  resetButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  doneText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#34c759',
  },
});
