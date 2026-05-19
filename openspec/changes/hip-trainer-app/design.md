## Context

New greenfield project. No existing codebase. The app is a personal tool for one user (Android phone), built with React Native + Expo for cross-platform experience and the ability to run in a browser. All exercise data is static — sourced from a one-off extraction pipeline (YouTube transcripts + LLM). No backend, no auth, no sync.

## Goals / Non-Goals

**Goals:**
- A working Android app (APK or Expo Go) with exercise list, detail, and timer screens
- Two timer modes: simple countdown and interval (hold/rest cycles)
- Screen stays awake during timer
- Runnable in browser via Expo Web (best-effort, no native polish required)
- Clean, maintainable project structure as a learning vehicle for React Native / Expo

**Non-Goals:**
- iOS-specific polish or App Store submission
- User accounts, cloud sync, or progress tracking
- Dynamic exercise content (no CMS, no API)
- The extraction pipeline is a one-off script, not part of the app build

## Decisions

### 1. Expo Managed Workflow (not bare)

Managed Expo gives access to the full SDK without ejecting to native Xcode/Android Studio projects. For this app there are no native modules that require ejecting. Managed workflow means faster iteration and simpler tooling.

Alternative considered: bare workflow — rejected, adds unnecessary complexity for a personal app with no exotic native requirements.

### 2. React Navigation (Stack) over Expo Router

Expo Router uses file-based routing (Next.js style) and is better suited for apps with many routes or web-first designs. This app has exactly 3 screens in a linear flow. Explicit stack navigation is simpler to understand and debug for a learner, and avoids the magic of file-system routing.

Alternative considered: Expo Router — rejected for this scope; adds abstraction without benefit.

### 3. Static JSON data file

Exercise data lives in `data/exercises.json`, committed to the repo. No API, no database. The extraction pipeline (yt-dlp + LLM) is a separate, one-off step that produces this file. The app simply imports it.

Alternative considered: SQLite via expo-sqlite — rejected, overkill for static read-only data.

### 4. Timer implemented with `useInterval` hook (setInterval + useEffect)

A custom `useInterval` hook keeps the timer logic clean and testable. State: `{ phase: 'hold' | 'rest' | 'done', remaining: number, currentSet: number }`. Transitions are deterministic and driven by countdown reaching zero.

Alternative considered: react-native-background-timer — rejected, unnecessary complexity; this app is foreground-only.

### 5. No navigation to timer as separate screen — timer is part of the detail screen

Rather than a 3rd screen, the timer renders inline on the detail screen below the instructions, activated by tapping "Start Timer." This avoids a navigation transition mid-exercise and keeps the instructions visible for reference.

Alternative considered: separate Timer screen — possible but adds nav complexity and hides instructions.

### Project Structure

```
hip-trainer/
├── App.tsx                     ← root, navigation container
├── app.json                    ← Expo config
├── data/
│   └── exercises.json          ← static exercise data
├── src/
│   ├── screens/
│   │   ├── ExerciseListScreen.tsx
│   │   └── ExerciseDetailScreen.tsx  ← includes timer UI
│   ├── components/
│   │   ├── Timer.tsx           ← interval/simple timer display
│   │   └── ProgressBar.tsx
│   ├── hooks/
│   │   └── useTimer.ts         ← timer state machine
│   └── types.ts                ← Exercise, TimerConfig types
└── assets/
```

### Data Shape

```typescript
type Exercise = {
  id: string
  name: string
  targetMuscles: string[]
  instructions: string[]
  cues: string[]
  timer: SimpleTimer | IntervalTimer
  youtubeId?: string
}

type SimpleTimer = {
  mode: 'simple'
  durationSeconds: number
}

type IntervalTimer = {
  mode: 'interval'
  holdSeconds: number
  restSeconds: number
  sets: number
}
```

## Risks / Trade-offs

- **Expo Web timer accuracy** → `setInterval` in browsers can be throttled when the tab is backgrounded. Acceptable for this use case (personal, foreground use). Mitigation: document the limitation.
- **Exercise data quality** → LLM extraction from YouTube transcripts may produce inaccurate instructions. Mitigation: user reviews and edits `exercises.json` before use.
- **Screen keep-awake on web** → `expo-keep-awake` has no effect in browsers. Mitigation: acceptable, web is secondary target.
- **React Navigation + Expo Web** → some minor styling differences between native and web. Mitigation: keep UI simple, test on both platforms early.
