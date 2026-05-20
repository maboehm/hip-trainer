## ADDED Requirements

### Requirement: Count-in before exercise start
The app SHALL play a 3-2-1 countdown before the first hold phase begins, replacing the two-tap start flow.

#### Scenario: Single tap triggers count-in
- **WHEN** the user taps the "⏱ Timer" button in the action bar
- **THEN** the timer immediately enters the `countdown` phase displaying "3" without requiring a second tap

#### Scenario: Count-in progresses
- **WHEN** the timer is in the `countdown` phase
- **THEN** it counts down 3 → 2 → 1 at one-second intervals

#### Scenario: Count-in transitions to hold
- **WHEN** the count-in reaches zero
- **THEN** the timer transitions to the `hold` phase and begins the exercise

#### Scenario: Count-in is cancellable
- **WHEN** the user taps "Reset" during the count-in phase
- **THEN** the timer returns to its hidden/idle state
