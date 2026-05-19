## Why

A doctor-prescribed hip exercise routine needs to be done consistently, but paper instructions are inconvenient and YouTube videos are slow to navigate mid-workout. A minimal mobile app with exercise descriptions and a built-in timer makes it easy to follow the routine hands-free.

## What Changes

- New React Native (Expo) mobile app, targeting Android with optional web support
- Static exercise data extracted from a YouTube playlist via transcript + LLM summarization (one-off pipeline)
- Exercise list screen showing the full routine in order
- Exercise detail screen with instructions and muscle targets
- Timer screen supporting two modes: simple countdown and interval (alternating hold/rest cycles)
- No backend, no auth, no persistence — fully offline, single-user

## Capabilities

### New Capabilities

- `exercise-list`: Browse all exercises in the prescribed routine in fixed order, tap to view detail
- `exercise-detail`: View exercise name, target muscles, step-by-step instructions, and coaching cues
- `timer`: Run a session timer per exercise — either a simple countdown or an interval mode (hold N seconds, rest M seconds, repeat K times) with phase indicators and progress display
- `exercise-data`: Static JSON data file defining all exercises and their timer configurations, produced by a one-off extraction pipeline (yt-dlp + LLM)

### Modified Capabilities

## Impact

- New project: React Native + Expo (managed workflow)
- Navigation: React Navigation (stack navigator, 3 screens)
- No external runtime dependencies beyond Expo SDK
- Requires `expo-keep-awake` to prevent screen sleep during timer
- One-off extraction tooling (yt-dlp + LLM prompt, not part of the app itself)
