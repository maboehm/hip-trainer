## 1. Project Scaffolding

- [ ] 1.1 Initialize Expo managed project with TypeScript template (`npx create-expo-app hip-trainer --template`)
- [ ] 1.2 Install dependencies: `@react-navigation/native`, `@react-navigation/stack`, `react-native-screens`, `react-native-safe-area-context`, `expo-keep-awake`
- [ ] 1.3 Create project directory structure: `src/screens/`, `src/components/`, `src/hooks/`, `data/`
- [ ] 1.4 Define TypeScript types in `src/types.ts` (Exercise, SimpleTimer, IntervalTimer)
- [ ] 1.5 Set up React Navigation stack in `App.tsx` with placeholder screens

## 2. Exercise Data

- [ ] 2.1 Create `data/exercises.json` with at least two placeholder exercises (one simple timer, one interval timer) to validate the schema
- [ ] 2.2 Run the one-off extraction pipeline (yt-dlp + LLM) and populate `exercises.json` with real exercise data
- [ ] 2.3 Validate all entries conform to the Exercise schema (manual review)

## 3. Exercise List Screen

- [ ] 3.1 Implement `ExerciseListScreen` that reads from `exercises.json` and renders a scrollable list of exercise names
- [ ] 3.2 Add tap handler on each list item to navigate to `ExerciseDetailScreen` with the selected exercise
- [ ] 3.3 Add "Start Routine" button that navigates to `ExerciseDetailScreen` with the first exercise

## 4. Exercise Detail Screen

- [ ] 4.1 Implement `ExerciseDetailScreen` displaying name, target muscles, numbered instructions, and cues
- [ ] 4.2 Add position indicator ("X of N") using the exercise index and total count
- [ ] 4.3 Add "Next Exercise" button (hidden or disabled on last exercise) that navigates to the next exercise detail
- [ ] 4.4 Add "Start Timer" button that reveals the inline timer component

## 5. Timer Hook

- [ ] 5.1 Implement `useTimer` hook with state: `{ phase: 'idle' | 'hold' | 'rest' | 'done', remaining: number, currentSet: number }`
- [ ] 5.2 Implement simple countdown mode: count down from `durationSeconds`, transition to `done` at zero
- [ ] 5.3 Implement interval mode: hold → rest → hold cycle for configured sets, no rest phase after final hold
- [ ] 5.4 Implement pause/resume: toggle a running flag that stops/resumes the interval
- [ ] 5.5 Wire `expo-keep-awake` to activate when timer phase is not `idle` or `done`, deactivate otherwise

## 6. Timer UI Component

- [ ] 6.1 Implement `Timer` component that accepts timer config and renders current phase label ("HOLD" / "REST" / countdown value)
- [ ] 6.2 Implement `ProgressBar` component showing proportion of current phase elapsed
- [ ] 6.3 Display set counter for interval mode ("Set 3 of 10")
- [ ] 6.4 Add Pause / Resume button wired to `useTimer` hook
- [ ] 6.5 Show completion state when timer phase is `done`

## 7. Polish & Verification

- [ ] 7.1 Test full routine flow on Android (Expo Go): list → detail → timer → next exercise
- [ ] 7.2 Verify screen stays awake during timer on Android
- [ ] 7.3 Test on Expo Web (browser): confirm basic functionality works, note any layout issues
- [ ] 7.4 Verify interval timer: hold/rest transitions, correct set count, no rest after last set
- [ ] 7.5 Verify simple timer: countdown, completion state, progress bar
