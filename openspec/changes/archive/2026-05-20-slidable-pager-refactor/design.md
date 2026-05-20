## Context

`ExerciseDetailScreen` currently embeds a two-slot horizontal slide animation system directly in the screen component. The slots are driven by the legacy `Animated` API (`Animated.Value`, `Animated.timing`, `Animated.parallel`) and gesture detection uses the class-based `PanGestureHandler` component from RNGH v1. There is also a known inconsistency: Slot A's `ScrollView` is wrapped in a `NativeViewGestureHandler` to enable simultaneous pan+scroll handling, but Slot B's `ScrollView` is not — correctness relies on the implicit invariant that Slot B is always off-screen when a swipe begins.

The codebase already has `react-native-reanimated` and `react-native-gesture-handler` as dependencies (RNGH requires Reanimated). No new packages are needed.

## Goals / Non-Goals

**Goals:**
- Extract slot management, animation, and gesture logic into `src/components/SlidablePager.tsx`
- Migrate to Reanimated 3 (`useSharedValue`, `withTiming`, `runOnJS`) and RNGH v2 gesture API (`Gesture.Pan()`, `GestureDetector`)
- Fix the Slot B `NativeViewGestureHandler` inconsistency by making scroll+gesture coexistence an explicit structural guarantee in the component
- Leave `ExerciseDetailScreen` behavior identical from the user's perspective

**Non-Goals:**
- Changing the visual design or animation feel
- Supporting more than two slots or looping
- Supporting anything beyond horizontal slide transitions
- Adding tests or Storybook stories

## Decisions

### 1. Render prop API for content

`SlidablePager` accepts a `renderItem: (index: number) => React.ReactNode` render prop and a controlled `count` prop. The screen passes its current index imperatively via a `ref` (exposing `slideForward()` and `slideBack()`). This matches the existing usage pattern (buttons and swipe both call `slide(nextIndex, direction)`) while keeping the component generic.

**Alternatives considered:**
- Children array: requires the screen to manage two rendered copies of content and pass them in, leaking slot awareness upward.
- Callback-based index state inside component: conflicts with the screen needing to reset the timer and track `currentIndex` for its own header ("N of M").

### 2. Reanimated `useSharedValue` + `withTiming` for animation

Replaces `Animated.Value` / `Animated.timing` / `Animated.parallel`. Shared values run on the UI thread without bridge overhead. `runOnJS` is used to call back into JS (update `currentIndex`, reset timer) after the animation completes — the same pattern as the current `Animated.timing` completion callback.

**Alternatives considered:**
- Keep legacy `Animated` API: works but is being phased out; Reanimated is the recommended path for New Architecture apps.
- `react-native-pager-view`: native ViewPager, good perf, but programmatic directional slide + scroll coexistence configuration is non-trivial and adds a new native dependency.

### 3. `Gesture.Pan()` + `GestureDetector` for swipe

Replaces `PanGestureHandler` component and `onHandlerStateChange`. The v2 API is composable (`Gesture.Simultaneous`) and more readable. Swipe recognition thresholds (`translationX > 50`, horizontal dominance check) are preserved unchanged.

### 4. Fix Slot B by using `ScrollView` `scrollEnabled` coordination

In the new component, both slots' `ScrollView`s are structurally equivalent. Scroll+swipe coexistence is handled by composing `Gesture.Native()` (for each slot's scroll view ref) with `Gesture.Simultaneous(pan, native)` — the RNGH v2 equivalent of `simultaneousHandlers`. This applies to both slots identically, removing the asymmetry.

## Risks / Trade-offs

- **Reanimated worklet constraints**: `withTiming` callbacks run on the UI thread; any state updates must be wrapped in `runOnJS`. Missing a `runOnJS` call causes a crash. → Mitigation: keep post-animation JS callbacks small and explicit.
- **RNGH v2 gesture composition**: `Gesture.Simultaneous` replaces `simultaneousHandlers` prop but the semantics are the same; the main risk is subtle ordering issues. → Mitigation: test swipe+scroll on both iOS and Android after migration.
- **Ref-based imperative API**: the `ref.slideForward/slideBack` pattern is less idiomatic than fully controlled props, but matches the screen's existing imperative `slide()` call sites cleanly. → Accepted trade-off for this refactor scope.

## Migration Plan

1. Build `SlidablePager` as a new file — no changes to the screen yet
2. Update `ExerciseDetailScreen` to use `SlidablePager`, removing the inlined slot/animation/gesture code
3. Verify visually on iOS and Android (no automated tests in this project)
4. Delete any dead code remaining in the screen after migration

Rollback: revert the two changed files; no data migrations, no native rebuilds required.
