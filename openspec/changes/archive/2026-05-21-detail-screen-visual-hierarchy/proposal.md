## Why

The exercise detail screen presents all content with equal visual weight, burying the most execution-critical information (repetitions, hold/rest timing, key cues) below a long step-by-step instruction list. Regular users who already know the movements suffer friction every session: they must scroll past content they don't need to find the numbers they do.

## What Changes

- Reorder `ExerciseDetailScreen` content: reps/timer pills → Wichtig blockquote → Anleitung steps → Muskeln
- Add a structured `reps` field to the exercise data schema for exercises that have no timer but do have a defined rep count
- Render a pill row showing sets, hold duration, and rest duration when timer data is present; render a single reps pill when only `reps` is present; omit the row entirely when neither exists
- Replace the flat bullet list for "Wichtig" (cues) with a styled blockquote: left accent border in the app's blue (`#2a7aef`), no background tint
- Apply clear visual weight differentiation across all sections (size, weight, color, spacing)

## Capabilities

### New Capabilities

- `exercise-detail-layout`: Restructured visual hierarchy and information ordering of the detail screen
- `exercise-reps-field`: Structured `reps` field on exercises lacking a timer, enabling pill display

### Modified Capabilities

- (none)

## Impact

- `src/screens/ExerciseDetailScreen.tsx`: layout restructure, new styles
- `data/exercises.json`: add `reps` field to exercises currently without a timer (Seitlicher Ausfallschritt, Seitwärts Gehen, Herabsteigen, Einbeinige Kniebeuge)
- `src/types.ts`: extend `Exercise` type with optional `reps` field
