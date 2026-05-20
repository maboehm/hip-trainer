## MODIFIED Requirements

### Requirement: Navigate between exercises
The app SHALL allow the user to move to the next or previous exercise in the routine from the detail screen. Navigation controls SHALL always remain visible on screen regardless of content scroll position.

#### Scenario: Navigate to next exercise
- **WHEN** the user taps "Next Exercise"
- **THEN** the app navigates to the detail screen of the next exercise in the routine

#### Scenario: No next on last exercise
- **WHEN** the user is on the last exercise
- **THEN** the "Next Exercise" button is visually disabled and tapping it does nothing

#### Scenario: Navigate to previous exercise
- **WHEN** the user taps "Previous Exercise"
- **THEN** the app navigates to the detail screen of the previous exercise in the routine

#### Scenario: No previous on first exercise
- **WHEN** the user is on the first exercise
- **THEN** the "Previous Exercise" button is visually disabled and tapping it does nothing

#### Scenario: Action bar always visible
- **WHEN** the exercise instructions are long enough to require scrolling
- **THEN** the timer, previous, and next controls remain fixed at the bottom of the screen
