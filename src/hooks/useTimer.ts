import { useState, useEffect, useRef } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import { TimerConfig } from '../types';
import { playSound } from '../utils/sounds';

export type TimerPhase = 'idle' | 'countdown' | 'hold' | 'rest' | 'done';

export interface TimerState {
  phase: TimerPhase;
  remaining: number;
  currentSet: number;
  totalSets: number;
  isRunning: boolean;
  snapBar: boolean; // true for one render when a phase resets to full
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

const COUNTDOWN_SECONDS = 3;
const ZERO_DISPLAY_MS = 200;

export function useTimer(config: TimerConfig): [TimerState, TimerControls] {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [remaining, setRemaining] = useState(initialRemaining(config));
  const [currentSet, setCurrentSet] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [snapBar, setSnapBar] = useState(false);

  // Use refs to access current state values inside the interval callback
  const phaseRef = useRef(phase);
  const remainingRef = useRef(remaining);
  const currentSetRef = useRef(currentSet);
  const isTransitioningRef = useRef(false); // guard: only one pending transition at a time
  phaseRef.current = phase;
  remainingRef.current = remaining;
  currentSetRef.current = currentSet;

  const active = phase !== 'idle' && phase !== 'done';
  useKeepAwake(active ? 'timer' : undefined);

  // Perform a phase transition: show 0 for ZERO_DISPLAY_MS, then switch
  const transitionAfterZero = (doTransition: () => void) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setRemaining(0);
    setTimeout(() => {
      isTransitioningRef.current = false;
      setSnapBar(true);
      doTransition();
      // Clear snapBar after one frame so subsequent ticks animate normally
      setTimeout(() => setSnapBar(false), 50);
    }, ZERO_DISPLAY_MS);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const next = remainingRef.current - 1;
      const p = phaseRef.current;

      if (isTransitioningRef.current) return; // waiting for zero display

      // --- Countdown phase ---
      if (p === 'countdown') {
        if (next > 0) {
          setRemaining(next);
          playSound('countIn');
          return;
        }
        // Count-in finished → start hold (no zero-display for count-in)
        setSnapBar(true);
        setPhase('hold');
        setRemaining(initialRemaining(config));
        playSound('holdStart');
        setTimeout(() => setSnapBar(false), 50);
        return;
      }

      if (next > 0) {
        setRemaining(next);
        return;
      }

      // remaining hit zero — show 0 briefly then transition
      if (config.mode === 'simple') {
        transitionAfterZero(() => {
          setPhase('done');
          setIsRunning(false);
          playSound('done');
        });
        return;
      }

      // Interval mode
      const set = currentSetRef.current;

      if (p === 'hold') {
        if (set >= config.sets) {
          transitionAfterZero(() => {
            setPhase('done');
            setIsRunning(false);
            playSound('done');
          });
        } else {
          transitionAfterZero(() => {
            setPhase('rest');
            setRemaining(config.restSeconds);
            playSound('restStart');
          });
        }
      } else if (p === 'rest') {
        transitionAfterZero(() => {
          const nextSet = currentSetRef.current + 1;
          setCurrentSet(nextSet);
          setPhase('hold');
          setRemaining(config.holdSeconds);
          playSound('holdStart');
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, config]);

  const start = () => {
    setPhase('countdown');
    setRemaining(COUNTDOWN_SECONDS);
    setCurrentSet(1);
    setIsRunning(true);
    setSnapBar(false);
    playSound('countIn');
  };

  const pause = () => setIsRunning(false);

  const resume = () => {
    if (phase !== 'idle' && phase !== 'done') {
      setIsRunning(true);
    }
  };

  const reset = () => {
    isTransitioningRef.current = false;
    setIsRunning(false);
    setPhase('idle');
    setRemaining(initialRemaining(config));
    setCurrentSet(1);
    setSnapBar(false);
  };

  return [
    { phase, remaining, currentSet, totalSets: totalSets(config), isRunning, snapBar },
    { start, pause, resume, reset },
  ];
}
