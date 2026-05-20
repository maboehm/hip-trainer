## ADDED Requirements

### Requirement: Display full exercise list
The app SHALL display all exercises from the static data file in a fixed, ordered list on the home screen.

#### Scenario: List renders all exercises
- **WHEN** the app is opened
- **THEN** all exercises are displayed in their defined order with their names visible

#### Scenario: Tap to view detail
- **WHEN** the user taps an exercise in the list
- **THEN** the app navigates to the Exercise Detail screen for that exercise

### Requirement: Start routine from list
The app SHALL provide a "Start Routine" action that begins the routine from the first exercise.

#### Scenario: Start routine
- **WHEN** the user taps "Start Routine"
- **THEN** the app navigates to the Exercise Detail screen for the first exercise
