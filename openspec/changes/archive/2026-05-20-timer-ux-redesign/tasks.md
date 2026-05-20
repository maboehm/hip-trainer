## 1. Dependencies & Assets

- [x] 1.1 Install `expo-av` compatible with Expo SDK 54 (`npx expo install expo-av`)
- [x] 1.2 Create `assets/sounds/` directory with four placeholder `.mp3` files: `count-in.mp3`, `hold-start.mp3`, `rest-start.mp3`, `done.mp3`
- [x] 1.3 Verify placeholder `.mp3` files are valid and play via a quick manual test

## 2. Sound Abstraction Layer

- [x] 2.1 Create `src/utils/sounds.ts` with `SoundEvent` type and `playSound(event)` function
- [x] 2.2 Implement asset mapping inside `sounds.ts` (event → `assets/sounds/*.mp3`)
- [x] 2.3 Call `Audio.setAudioModeAsync({ playsInSilentModeIOS: true })` on first `playSound` call
- [x] 2.4 Verify `playSound` works for all four events by calling it manually from a component

## 3. Timer State Machine — Count-in Phase

- [x] 3.1 Add `'countdown'` to `TimerPhase` union in `src/hooks/useTimer.ts`
- [x] 3.2 Update `start()` to set `phase = 'countdown'` and `remaining = 3` instead of going directly to `hold`
- [x] 3.3 Add count-in transition logic in the tick handler: when `phase === 'countdown'` and `remaining` hits 0, transition to `hold`
- [x] 3.4 Wire `playSound('countIn')` on each count-in decrement and `playSound('holdStart')` on transition to hold
- [x] 3.5 Wire `playSound('restStart')` on transition to rest phase
- [x] 3.6 Wire `playSound('done')` on transition to done state
- [x] 3.7 Verify state machine transitions: idle → countdown(3→2→1) → hold → rest → … → done

## 4. Timer Component — Auto-start & Count-in UI

- [x] 4.1 Add `autoStart?: boolean` prop to `Timer` component
- [x] 4.2 Add `useEffect` in `Timer` that calls `controls.start()` on mount when `autoStart` is true
- [x] 4.3 Add rendering for `countdown` phase: display the countdown number (3/2/1) in place of the exercise countdown number; use a neutral color (e.g. `#aaa`)
- [x] 4.4 Update `ExerciseDetailScreen` to pass `autoStart={true}` to `<Timer>` so the single tap on "⏱ Timer" triggers count-in immediately

## 5. Progress Bar — Countdown Direction & Animation

- [x] 5.1 Update `ProgressBar.tsx` to use an `Animated.Value` instead of a plain percentage string
- [x] 5.2 Invert the fill: render `width` as `(1 - progress) * 100%` so the bar drains left as time elapses
- [x] 5.3 Trigger `Animated.timing` on each `progress` prop change (~800ms, `easeInOut`)
- [x] 5.4 Verify bar starts full at phase start and reaches empty at phase end with smooth animation
- [x] 6.4 Verify pip row updates correctly across a full interval session (e.g. 12 sets)
- [x] 7.1 Review and tighten spacing/padding in `Timer.tsx` for the new count-in, pip row, and overall layout
- [x] 7.2 Verify the full timer flow end-to-end on both `simple` and `interval` mode exercises
- [x] 7.3 Run `npx tsc --noEmit` and resolve any type errors
