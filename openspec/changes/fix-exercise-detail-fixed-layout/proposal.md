## Why

When swiping between exercises in the detail view, the top navigation bar and the bottom controls (navigation arrows + timer) scroll or shift with the content, breaking the sense of a persistent chrome. These elements should remain fixed while only the exercise content animates between pages.

## What Changes

- The top navigation bar (back button, exercise title/index) is rendered outside the swipeable content area and stays fixed during swipe transitions.
- The bottom controls (previous/next navigation buttons and the timer) are rendered outside the swipeable content area and remain fixed at the bottom during swipe transitions.
- The swipeable pager only animates the exercise body content (instructions, images, etc.).

## Capabilities

### New Capabilities
- (none)

### Modified Capabilities
- `exercise-detail`: The layout contract changes — navigation bar and bottom controls are fixed chrome; only the exercise body scrolls/swipes.

## Impact

- `src/screens/ExerciseDetailScreen.tsx` (primary change — layout restructure)
- Possibly `src/components/` if bottom controls or header are extracted into separate components
- No API, data, or navigation changes
