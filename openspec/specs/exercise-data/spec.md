### Requirement: Static exercise data file
The app SHALL load exercise data from a static JSON file (`data/exercises.json`) bundled with the app. No network requests are made at runtime.

#### Scenario: App loads without network
- **WHEN** the app is opened with no internet connection
- **THEN** all exercise data is available and the app functions normally

### Requirement: Exercise data schema
Each exercise record in `exercises.json` SHALL conform to the following structure:
- `id` (string, unique): kebab-case identifier
- `name` (string): display name
- `targetMuscles` (string[]): list of targeted muscle groups
- `instructions` (string[]): ordered step-by-step instructions
- `cues` (string[]): short coaching reminders
- `timer` (object): either `{ mode: "simple", durationSeconds: number }` or `{ mode: "interval", holdSeconds: number, restSeconds: number, sets: number }`
- `youtubeId` (string, optional): source video identifier

#### Scenario: Valid data loads correctly
- **WHEN** the app starts
- **THEN** all exercises with valid schema fields are available in the exercise list

#### Scenario: Order is preserved
- **WHEN** exercises are rendered in the list
- **THEN** they appear in the same order as defined in the JSON array
