## ADDED Requirements

### Requirement: Exercise type supports optional reps field
The `Exercise` TypeScript type SHALL include an optional `reps` field of type `number | string` to represent a structured repetition count for exercises that have no timer.

#### Scenario: Type accepts reps field
- **WHEN** an exercise object is defined with a `reps` property of type number or string
- **THEN** TypeScript compilation succeeds with no type errors

#### Scenario: Type accepts absence of reps field
- **WHEN** an exercise object is defined without a `reps` property
- **THEN** TypeScript compilation succeeds with no type errors

### Requirement: No-timer exercises carry a reps value in data
The four exercises in `data/exercises.json` that have no `timer` (Seitlicher Ausfallschritt, Seitwärts Gehen, Herabsteigen, Einbeinige Kniebeuge) SHALL each have a `reps` field added reflecting the rep count described in their instructions prose.

#### Scenario: Reps field present on no-timer exercises
- **WHEN** the exercises JSON is loaded
- **THEN** each exercise without a `timer` has a `reps` field with a non-empty value
