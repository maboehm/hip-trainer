## Why

The exercise detail screen currently only supports forward navigation via a "Next" button, requiring users to exit to the list if they want to revisit a previous exercise. Adding back navigation, sticky action controls, and swipe gestures reduces friction and makes the session flow feel more natural.

## What Changes

- Add a "Previous" button to the exercise detail screen, visually less prominent than "Next"
- Make the bottom action bar (timer, back, next) sticky — always visible regardless of content scroll length
- Support left/right swipe gestures on the exercise detail screen to navigate between exercises
- Swiping left on the first exercise and swiping right on the last exercise does nothing

## Capabilities

### New Capabilities

- `exercise-navigation`: Navigation controls for moving between exercises — previous/next buttons and swipe gestures on the exercise detail screen

### Modified Capabilities

- `exercise-detail`: The exercise detail screen layout changes to support a sticky bottom action bar and swipe gesture navigation

## Impact

- `src/screens/ExerciseDetailScreen.tsx` — primary file to modify
- `@react-navigation/stack` navigation prop usage for back navigation
- `react-native-gesture-handler` for swipe gesture detection (already a dependency)
- No new dependencies required
- No API or data changes
