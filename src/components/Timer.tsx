import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimerConfig } from '../types';
import { useTimer } from '../hooks/useTimer';

interface Props {
  config: TimerConfig;
  autoStart?: boolean;
  onReset?: () => void; // called when user resets — lets parent hide the timer
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

export default function Timer({ config, autoStart, onReset }: Props) {
  const [state, controls] = useTimer(config);
  const { phase, remaining, currentSet, totalSets, isRunning } = state;

  useEffect(() => {
    if (autoStart) {
      controls.start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    controls.reset();
    onReset?.();
  };

  const color = phaseColor(phase);

  if (phase === 'done') {
    return (
      <View style={styles.container}>
        <Text style={styles.doneText}>Done!</Text>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={[styles.buttonText, { color: '#555' }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'countdown') {
    return (
      <View style={styles.container}>
        <Text style={styles.countdownLabel}>GET READY</Text>
        <Text style={[styles.countdown, { color: '#aaa' }]}>{remaining}</Text>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={[styles.buttonText, { color: '#555' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Active: hold or rest
  return (
    <View style={styles.container}>
      {config.mode === 'interval' && (
        <View style={styles.phaseRow}>
          <Text style={[styles.phaseLabel, phase === 'hold' ? styles.active : styles.inactive]}>
            HOLD
          </Text>
          <Text style={styles.phaseDivider}> · </Text>
          <Text style={[styles.phaseLabel, phase === 'rest' ? styles.active : styles.inactive]}>
            REST
          </Text>
        </View>
      )}

      <Text style={[styles.countdown, { color }]}>{formatSeconds(remaining)}</Text>

      {config.mode === 'interval' && (
        <View style={styles.pipsRow}>
          {Array.from({ length: totalSets }).map((_, i) => {
            const setNum = i + 1;
            const filled = setNum < currentSet;
            const current = setNum === currentSet;
            return (
              <View
                key={i}
                style={[
                  styles.pip,
                  filled && { backgroundColor: color },
                  current && [styles.pipCurrent, { backgroundColor: color }],
                  !filled && !current && styles.pipEmpty,
                ]}
              />
            );
          })}
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={isRunning ? controls.pause : controls.resume}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Resume'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={[styles.buttonText, { color: '#555' }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 14,
  },
  countdownLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#bbb',
    textTransform: 'uppercase',
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
  countdown: {
    fontSize: 72,
    fontWeight: '200',
    letterSpacing: -2,
  },
  pipsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pipCurrent: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pipEmpty: {
    backgroundColor: '#ddd',
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
