## ADDED Requirements

### Requirement: Content order follows execution priority
The detail screen SHALL render exercise content in the following top-to-bottom order: (1) exercise name, (2) rep/timer pill row, (3) Wichtig cues blockquote, (4) Anleitung steps, (5) Muskeln.

#### Scenario: All sections present
- **WHEN** an exercise has a timer, cues, instructions, and targetMuscles
- **THEN** the screen renders them in the order: name → pills → Wichtig → Anleitung → Muskeln

#### Scenario: No timer and no reps field
- **WHEN** an exercise has no `timer` and no `reps` field
- **THEN** the pill row is omitted and the remaining sections render in order: name → Wichtig → Anleitung → Muskeln

### Requirement: Timer pill row displays structured timing data
When an exercise has a `timer` object, the screen SHALL display a horizontal pill row with three pills: repetition count (`{sets}×`), hold duration (`{holdSeconds}s halten`), and rest duration (`{restSeconds}s Pause`).

#### Scenario: Timer exercise renders three pills
- **WHEN** `exercise.timer` is present with `sets`, `holdSeconds`, and `restSeconds`
- **THEN** three pills are rendered showing the values in the format above

### Requirement: Reps pill row for non-timer exercises
When an exercise has a `reps` field and no `timer`, the screen SHALL display a single pill showing `{reps}×`.

#### Scenario: Reps-only exercise renders one pill
- **WHEN** `exercise.reps` is present and `exercise.timer` is absent
- **THEN** one pill is rendered showing the reps value followed by `×`

### Requirement: Wichtig cues rendered as blockquote
The cues section SHALL be rendered with a 3px left border in `#2a7aef` and `paddingLeft: 12`, with no background color. Each cue is a plain text line. The section label "Wichtig" appears above in the standard small-caps style.

#### Scenario: Cues blockquote appearance
- **WHEN** `exercise.cues` contains one or more items
- **THEN** they are rendered inside a View with a left border of 3px solid `#2a7aef` and paddingLeft 12, with no background tint

#### Scenario: No cues
- **WHEN** `exercise.cues` is empty
- **THEN** the Wichtig section (label and blockquote) is not rendered

### Requirement: Visual weight hierarchy across sections
The screen SHALL apply distinct visual weight to each section to create clear typographic hierarchy: pill numbers (20px/700), cue text (15px/500, color `#111`), instruction step text (15px/400, color `#444`), muscles text (13px/400, color `#888`).

#### Scenario: Pill numbers are largest interactive element
- **WHEN** a pill row is rendered
- **THEN** the count/duration number within each pill uses fontSize 20 and fontWeight 700

#### Scenario: Muscles text is least prominent
- **WHEN** targetMuscles are rendered
- **THEN** the text uses fontSize 13 and color #888
