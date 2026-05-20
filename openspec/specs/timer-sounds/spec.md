### Requirement: Sound feedback at key timer events
The app SHALL play a distinct sound at each of the following moments: each count-in tick, hold phase start, rest phase start, and timer completion.

#### Scenario: Count-in tick sound
- **WHEN** the count-in phase decrements (3, 2, 1)
- **THEN** a short tick sound plays on each decrement

#### Scenario: Hold start sound
- **WHEN** the timer transitions into the hold phase
- **THEN** a focused tone plays

#### Scenario: Rest start sound
- **WHEN** the timer transitions into the rest phase
- **THEN** a lighter tone plays

#### Scenario: Completion sound
- **WHEN** the timer reaches the done state
- **THEN** a completion chime plays

### Requirement: Sounds play in silent mode
The app SHALL play timer sounds even when the device is set to silent/vibrate mode.

#### Scenario: Silent mode override
- **WHEN** the device is in silent mode and the timer transitions phase
- **THEN** the sound plays at normal volume

### Requirement: Swappable sound assets
The sound system SHALL be implemented with a single asset-mapping layer so that placeholder sounds can be replaced with final `.mp3` files without changes to timer logic.

#### Scenario: Asset swap requires no logic change
- **WHEN** an `.mp3` file in `assets/sounds/` is replaced with a new file of the same name
- **THEN** the new sound plays at the corresponding timer event without any code changes outside `src/utils/sounds.ts`
