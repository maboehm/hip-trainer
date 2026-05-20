## ADDED Requirements

### Requirement: Simple countdown timer
The app SHALL support a simple countdown mode that counts down from a configured duration and signals completion.

#### Scenario: Countdown runs to zero
- **WHEN** a simple timer is started
- **THEN** it counts down from `durationSeconds` to zero and then displays a completion state

#### Scenario: Progress shown
- **WHEN** a simple timer is running
- **THEN** a progress indicator shows the proportion of time elapsed

### Requirement: Interval timer
The app SHALL support an interval mode that alternates between a "hold" phase and a "rest" phase for a configured number of sets.

#### Scenario: Hold phase runs
- **WHEN** an interval timer is in the hold phase
- **THEN** the display shows "HOLD", counts down from `holdSeconds`, and the current set number

#### Scenario: Transition to rest
- **WHEN** the hold phase countdown reaches zero and more sets remain
- **THEN** the timer transitions to the rest phase and counts down from `restSeconds`

#### Scenario: Transition to next set
- **WHEN** the rest phase countdown reaches zero and more sets remain
- **THEN** the timer transitions to the hold phase of the next set

#### Scenario: Completion after all sets
- **WHEN** the hold phase of the final set completes
- **THEN** the timer displays a completion state without starting another rest phase

### Requirement: Pause and resume
The app SHALL allow the user to pause and resume a running timer.

#### Scenario: Pause stops countdown
- **WHEN** the user taps "Pause"
- **THEN** the countdown stops at the current value

#### Scenario: Resume continues countdown
- **WHEN** the user taps "Resume" after pausing
- **THEN** the countdown continues from where it was paused

### Requirement: Screen stays awake during timer
The app SHALL prevent the device screen from sleeping while a timer is active.

#### Scenario: Keep awake while running
- **WHEN** a timer is running
- **THEN** the screen does not dim or lock automatically

#### Scenario: Allow sleep when not timing
- **WHEN** no timer is active
- **THEN** the screen behaves according to normal device settings
