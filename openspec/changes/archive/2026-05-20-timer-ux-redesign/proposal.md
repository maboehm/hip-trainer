## Why

The current timer requires two taps to start, the progress bar fills up (counterintuitive for a countdown), and the overall visual lacks polish. Sound feedback is absent, making phase transitions easy to miss during exercise. This change brings the timer up to the quality bar expected of a fitness app.

## What Changes

- Tapping "⏱ Timer" in the action bar immediately triggers a 3-2-1 count-in and auto-starts the exercise — no second tap required
- Progress bar drains from full to empty (right-to-left) as time counts down
- Sound feedback plays at each count-in tick, on hold start, on rest start, and on completion — using placeholder tones now, swappable for real `.mp3` assets later
- Set progress is shown as a row of pip dots (● ● ○ ○ …) beneath the progress bar
- Progress bar animates smoothly instead of jumping each second
- General visual polish: typography, spacing, and phase label presentation

## Capabilities

### New Capabilities

- `timer-count-in`: 3-2-1 count-in state that plays before hold begins; replaces the idle "Start Timer" button interaction
- `timer-sounds`: Sound feedback at key timer moments (count-in ticks, hold start, rest start, done); designed with a swappable sound asset layer
- `timer-set-preview`: Row of pip dots showing completed vs remaining sets at a glance

### Modified Capabilities

- `timer-progress-bar`: Bar now drains (countdown) instead of filling, and animates smoothly

## Impact

- `src/components/Timer.tsx` — new count-in state, revised rendering, set pips
- `src/components/ProgressBar.tsx` — inverted progress direction, smooth `Animated.timing`
- `src/hooks/useTimer.ts` — new `countdown` phase (3, 2, 1) added to state machine
- `src/screens/ExerciseDetailScreen.tsx` — timer reveal button triggers auto-start via a new prop
- `assets/sounds/` — new directory with placeholder sound files (swappable for real `.mp3`)
- New dependency: `expo-av` for audio playback
