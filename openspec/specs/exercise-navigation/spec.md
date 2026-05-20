### Requirement: Navigate to previous exercise
The app SHALL allow the user to move to the previous exercise in the routine from the detail screen.

#### Scenario: Navigate to previous exercise
- **WHEN** the user taps the "Previous Exercise" button
- **THEN** the app navigates to the detail screen of the previous exercise in the routine

#### Scenario: No previous on first exercise
- **WHEN** the user is on the first exercise
- **THEN** the "Previous Exercise" button is visually disabled and tapping it does nothing

### Requirement: Swipe to navigate between exercises
The app SHALL allow the user to swipe left or right on the exercise detail screen to navigate between exercises.

#### Scenario: Swipe right navigates to previous exercise
- **WHEN** the user swipes right on the exercise detail screen
- **THEN** the app navigates to the previous exercise in the routine

#### Scenario: Swipe left navigates to next exercise
- **WHEN** the user swipes left on the exercise detail screen
- **THEN** the app navigates to the next exercise in the routine

#### Scenario: Swipe right on first exercise does nothing
- **WHEN** the user is on the first exercise and swipes right
- **THEN** nothing happens and the screen stays on the current exercise

#### Scenario: Swipe left on last exercise does nothing
- **WHEN** the user is on the last exercise and swipes left
- **THEN** nothing happens and the screen stays on the current exercise
