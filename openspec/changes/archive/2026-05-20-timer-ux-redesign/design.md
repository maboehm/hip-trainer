## Context

The timer lives in `src/components/Timer.tsx`, driven by `src/hooks/useTimer.ts`. The hook owns a state machine with phases: `idle | hold | rest | done`. The component renders conditionally based on a `timerVisible` boolean in `ExerciseDetailScreen.tsx` — the user first taps "⏱ Timer" to reveal it, then taps "Start Timer" to begin. The progress bar (`src/components/ProgressBar.tsx`) renders a plain percentage width with no animation and fills from 0→1 (i.e., it grows as time elapses — the opposite of a countdown feel).

No audio exists today. `expo-keep-awake` is already in use during active phases.

## Goals / Non-Goals

**Goals:**
- Eliminate the double-tap: one tap → count-in → exercise starts
- Invert progress bar direction and add smooth animation
- Add a `countdown` phase (3-2-1) to the timer state machine
- Introduce sound feedback at: each count-in tick, hold start, rest start, and done
- Design the sound layer so placeholder tones work now and real `.mp3` files can be dropped in later without code changes
- Add set pip row (● ● ○ …) beneath the progress bar

**Non-Goals:**
- Haptic feedback
- Tenths-of-a-second precision
- Final-countdown urgency (no last-3-seconds special casing)
- Rest skip
- Auto-pause on exercise slide
- Circular progress ring

## Decisions

### 1. New `countdown` phase in `useTimer`

Add `'countdown'` to `TimerPhase`. The state machine becomes:

```
idle → countdown (3→2→1) → hold → rest → hold → ... → done
```

`start()` sets `phase = 'countdown'`, `remaining = 3`. Each tick decrements. When `remaining` hits 0 in `countdown`, transition to `hold`.

**Why not handle count-in in the component?** Keeping it in the hook means the component stays a pure renderer. It also means `TimerState` always reflects true phase, useful if we later add persistence or pause-on-swipe.

**Alternative considered**: A separate `useCountIn` hook wrapping `useTimer`. Rejected — adds indirection for no benefit at this scale.

---

### 2. Auto-start via prop

`Timer` gains an `autoStart?: boolean` prop. When `true`, `useEffect` calls `controls.start()` on mount.

`ExerciseDetailScreen` passes `autoStart` when it reveals the timer:

```
timerVisible=false  →  tap "⏱ Timer"  →  setTimerVisible(true)
                                          (Timer mounts with autoStart=true)
```

This keeps `ExerciseDetailScreen` unaware of timer internals. The existing "⏱ Timer" button becomes the single activation point.

**Alternative considered**: Lifting start logic into `ExerciseDetailScreen`. Rejected — Timer would need to expose its controls upward, adding complexity.

---

### 3. Sound layer: swappable asset pattern

Create `src/utils/sounds.ts` as a thin abstraction:

```ts
// sounds.ts
export type SoundEvent = 'countIn' | 'holdStart' | 'restStart' | 'done';

export async function playSound(event: SoundEvent): Promise<void>
```

Internally, `playSound` maps each event to an asset. Initially these are short synthesized tones generated with `expo-av`'s Audio API (or bundled silent/minimal `.mp3` placeholders). To swap in real sounds later, only the asset mapping inside `sounds.ts` changes — nothing else.

Sound files live in `assets/sounds/`:
```
assets/sounds/
  count-in.mp3      ← placeholder (short tick)
  hold-start.mp3    ← placeholder (focused tone)
  rest-start.mp3    ← placeholder (lighter tone)
  done.mp3          ← placeholder (completion chime)
```

Placeholders will be minimal valid `.mp3` files (e.g. a short sine tone) so the integration can be verified end-to-end before real assets arrive.

**Why `.mp3` placeholders over programmatic tones?** Programmatic tone generation requires an audio synthesis library or Web Audio API bridging — adds complexity. A minimal `.mp3` placeholder is simpler, proves the full pipeline (file → `expo-av` → speaker), and the swap path is identical.

**`expo-av` setup**: Call `Audio.setAudioModeAsync` once on app init (or lazily in `sounds.ts`) to allow sound to play when the device is in silent mode — standard fitness app behavior.

---

### 4. Progress bar: inverted + animated

`ProgressBar` receives the same `progress` prop (0–1) but renders `width: (1 - progress) * 100%` — so full at start, empty at end.

Smooth animation via `Animated.timing` on an `Animated.Value`. Each `progress` prop change triggers a new tween (duration ~800ms, `easeInOut`) so the bar flows continuously between second ticks.

**Why Animated.Value over Reanimated?** `react-native-reanimated` is not currently in the project. `Animated` from core RN is sufficient for a single bar tween and avoids a new dependency.

---

### 5. Set pips

Rendered inside `Timer.tsx` below the progress bar. A row of small circles: filled (●) for completed sets, current set highlighted, empty (○) for remaining.

Pure derived rendering from `currentSet` and `totalSets` — no new state needed.

For `simple` mode timers (no sets), the pip row is omitted.

## Risks / Trade-offs

- **Silent mode**: `expo-av` sounds play by default only when not silenced. We call `Audio.setAudioModeAsync({ playsInSilentModeIOS: true })` to override, matching fitness app convention. Risk: user may not expect sound to override silent — acceptable for a workout app.
- **`expo-av` version**: Must be compatible with Expo SDK 54 and the New Architecture. `expo-av` ~14.x is the SDK 54 compatible version. Verify during install.
- **Placeholder `.mp3` quality**: Placeholder tones may feel jarring until real assets arrive. Mitigation: keep them short (<0.5s) and low-amplitude.
- **Count-in state visible**: The `countdown` phase shows 3/2/1 in the number display area. If the user taps "Reset" during count-in, it returns to `idle` — timer is gone (hidden by `timerVisible=false` reset). This is acceptable; the user opted out.

## Open Questions

- What volume/tone character does the user want for the real `.mp3` assets? (Deferred — placeholders ship first)
- Should count-in display just the number (3, 2, 1) or also a "GET READY" label above it?
