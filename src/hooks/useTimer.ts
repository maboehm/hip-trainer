import { useState, useEffect, useRef } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import { TimerConfig } from '../types';

export type TimerPhase = 'idle' | 'hold' | 'rest' | 'done';

export interface TimerState {
  phase: TimerPhase;
  remaining: number;
  currentSet: number;
  totalSets: number;
  isRunning: boolean;
}

export interface TimerControls {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

function initialRemaining(config: TimerConfig): number {
  return config.mode === 'simple' ? config.durationSeconds : config.holdSeconds;
}

function totalSets(config: TimerConfig): number {
  return config.mode === 'interval' ? config.sets : 1;
}

export function useTimer(config: TimerConfig): [TimerState, TimerControls] {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [remaining, setRemaining] = useState(initialRemaining(config));
  const [currentSet, setCurrentSet] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  // Use refs to access current state values inside the interval callback
  const phaseRef = useRef(phase);
  const remainingRef = useRef(remaining);
  const currentSetRef = useRef(currentSet);
  phaseRef.current = phase;
  remainingRef.current = remaining;
  currentSetRef.current = currentSet;

  const active = phase !== 'idle' && phase !== 'done';
  useKeepAwake(active ? 'timer' : undefined);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const next = remainingRef.current - 1;

      if (next > 0) {
        setRemaining(next);
        return;
      }

      // Countdown hit zero — determine transition
      if (config.mode === 'simple') {
        setPhase('done');
        setIsRunning(false);
        return;
      }

      // Interval mode
      const set = currentSetRef.current;
      const p = phaseRef.current;

      if (p === 'hold') {
        if (set >= config.sets) {
          // Last set hold done — complete
          setPhase('done');
          setIsRunning(false);
        } else {
          // Transition to rest
          setPhase('rest');
          setRemaining(config.restSeconds);
        }
      } else if (p === 'rest') {
        // Transition to next hold
        const nextSet = set + 1;
        setCurrentSet(nextSet);
        setPhase('hold');
        setRemaining(config.holdSeconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, config]);

  const start = () => {
    setPhase(config.mode === 'simple' ? 'hold' : 'hold');
    setRemaining(initialRemaining(config));
    setCurrentSet(1);
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const resume = () => {
    if (phase !== 'idle' && phase !== 'done') {
      setIsRunning(true);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setPhase('idle');
    setRemaining(initialRemaining(config));
    setCurrentSet(1);
  };

  return [
    { phase, remaining, currentSet, totalSets: totalSets(config), isRunning },
    { start, pause, resume, reset },
  ];
}
