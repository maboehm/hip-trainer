## ADDED Requirements

### Requirement: Display exercise information
The app SHALL display the exercise name, target muscles, step-by-step instructions, and coaching cues on the detail screen.

#### Scenario: Full detail visible
- **WHEN** the user navigates to an exercise detail screen
- **THEN** the exercise name, target muscles, numbered instructions, and cues are all displayed

### Requirement: Show position in routine
The app SHALL display the current exercise's position within the full routine (e.g., "2 of 6").

#### Scenario: Position indicator shown
- **WHEN** viewing an exercise detail screen
- **THEN** the screen shows the exercise's index and total count in the routine

### Requirement: Navigate between exercises
The app SHALL allow the user to move to the next exercise in the routine from the detail screen.

#### Scenario: Navigate to next exercise
- **WHEN** the user taps "Next Exercise"
- **THEN** the app navigates to the detail screen of the next exercise in the routine

#### Scenario: No next on last exercise
- **WHEN** the user is on the last exercise
- **THEN** no "Next Exercise" action is shown (or it is disabled)

### Requirement: Start timer from detail screen
The app SHALL provide a "Start Timer" action on the detail screen that activates the timer inline without navigating away.

#### Scenario: Timer activates inline
- **WHEN** the user taps "Start Timer"
- **THEN** the timer UI appears on the same screen below the exercise instructions
