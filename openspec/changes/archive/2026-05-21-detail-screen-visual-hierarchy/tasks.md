## 1. Data Layer

- [x] 1.1 Add optional `reps?: number | string` field to the `Exercise` type in `src/types.ts`
- [x] 1.2 Add `reps` values to the four no-timer exercises in `data/exercises.json`: Seitlicher Ausfallschritt, Seitwärts Gehen, Herabsteigen, Einbeinige Kniebeuge
- [x] 1.3 Run `npx tsc --noEmit` and confirm zero type errors

## 2. Pill Row Component

- [x] 2.1 Create a `PillRow` component (or inline function) inside `ExerciseDetailScreen.tsx` that accepts `timer` and `reps` props
- [x] 2.2 Render three pills (sets×, hold, rest) when `timer` is present
- [x] 2.3 Render one pill (reps×) when only `reps` is present and no `timer`
- [x] 2.4 Render nothing when neither `timer` nor `reps` is present
- [x] 2.5 Style pills: number at fontSize 20 / fontWeight 700, label text at fontSize 12 / fontWeight 500; pill background `#f0f4ff`, border radius 10

## 3. Wichtig Blockquote

- [x] 3.1 Wrap the cues list in a `View` with `borderLeftWidth: 3`, `borderLeftColor: '#2a7aef'`, `paddingLeft: 12`
- [x] 3.2 Update cue text style: fontSize 15, fontWeight 500, color `#111`, lineHeight 22
- [x] 3.3 Confirm the Wichtig section is hidden when `exercise.cues` is empty

## 4. Content Reorder & Visual Hierarchy

- [x] 4.1 Reorder `ExerciseContent` render output: name → PillRow → Wichtig → Anleitung → Muskeln
- [x] 4.2 Update instruction step text style: fontSize 15, fontWeight 400, color `#444`
- [x] 4.3 Update muscles text style: fontSize 13, fontWeight 400, color `#888`
- [x] 4.4 Review spacing between sections for visual breathing room (marginTop/marginBottom)

## 5. Verification

- [x] 5.1 Run `npx tsc --noEmit` — zero errors
- [x] 5.2 Visually verify a timer exercise (e.g. Hüftabduktion): pill row shows 3 pills, Wichtig has blue border, Anleitung below, Muskeln at bottom
- [x] 5.3 Visually verify a no-timer exercise (e.g. Herabsteigen): single reps pill shows, rest of layout correct
- [x] 5.4 Confirm empty-cues edge case does not render the Wichtig section header or blockquote
