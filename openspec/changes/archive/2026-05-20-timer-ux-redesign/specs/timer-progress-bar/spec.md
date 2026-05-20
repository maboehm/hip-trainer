## MODIFIED Requirements

### Requirement: Progress shown
The app SHALL display a progress bar that drains from full to empty as time elapses in the current phase, and SHALL animate smoothly between updates rather than jumping.

#### Scenario: Bar starts full
- **WHEN** a timer phase begins
- **THEN** the progress bar is completely full

#### Scenario: Bar drains over time
- **WHEN** a timer phase is running
- **THEN** the progress bar continuously drains from right to left, reaching empty when the phase ends

#### Scenario: Bar animates smoothly
- **WHEN** the remaining time decrements
- **THEN** the progress bar transitions to its new width with a smooth animation rather than an instant jump
