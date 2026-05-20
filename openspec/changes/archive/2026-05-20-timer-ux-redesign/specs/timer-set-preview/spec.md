## ADDED Requirements

### Requirement: Set progress pip row
The app SHALL display a row of pip indicators showing completed, current, and remaining sets for interval-mode timers.

#### Scenario: Pips reflect current set
- **WHEN** an interval timer is on set N of M
- **THEN** N-1 pips are shown as filled, the Nth pip is highlighted as current, and the remaining pips are shown as empty

#### Scenario: Pips absent for simple mode
- **WHEN** a simple (non-interval) timer is displayed
- **THEN** no pip row is shown
