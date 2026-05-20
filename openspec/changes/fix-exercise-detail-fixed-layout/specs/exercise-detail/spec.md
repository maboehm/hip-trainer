## MODIFIED Requirements

### Requirement: Navigate between exercises
The app SHALL allow the user to move to the previous or next exercise in the routine from the detail screen. The navigation bar (back button, position indicator, exercise title) and the bottom controls (timer and prev/next buttons) SHALL remain visually fixed during exercise-to-exercise transitions. Only the exercise body content SHALL animate during transitions.

#### Scenario: Navigate to next exercise
- **WHEN** the user taps "Next" or swipes left
- **THEN** the app transitions to the next exercise with only the body content sliding; the navigation bar and bottom controls do not move

#### Scenario: Navigate to previous exercise
- **WHEN** the user taps "Prev" or swipes right
- **THEN** the app transitions to the previous exercise with only the body content sliding; the navigation bar and bottom controls do not move

#### Scenario: No next on last exercise
- **WHEN** the user is on the last exercise
- **THEN** the "Next" button is disabled

#### Scenario: No prev on first exercise
- **WHEN** the user is on the first exercise
- **THEN** the "Prev" button is disabled

## ADDED Requirements

### Requirement: Fixed navigation bar during exercise transitions
The app SHALL render a custom in-screen navigation bar (back button + position indicator) that remains stationary when the user swipes or taps between exercises.

#### Scenario: Header does not animate on exercise change
- **WHEN** the user navigates from one exercise to another
- **THEN** the top navigation bar (back button and "X of N" position label) does not translate, fade, or otherwise animate

### Requirement: Fixed bottom controls during exercise transitions
The app SHALL render the timer and prev/next navigation buttons in a bottom bar that remains stationary when the user swipes or taps between exercises.

#### Scenario: Bottom bar does not animate on exercise change
- **WHEN** the user navigates from one exercise to another
- **THEN** the timer button/widget and the prev/next buttons do not translate or animate
