## Why

The two-slot horizontal slide animation in `ExerciseDetailScreen` is complex, tightly coupled screen logic that would benefit from extraction into a reusable component. At the same time, the code uses the legacy `Animated` API and contains a known inconsistency in gesture handler wiring that creates a latent footgun.

## What Changes

- Extract the two-slot paging mechanism from `ExerciseDetailScreen` into a new `SlidablePager` component
- Migrate animation and gesture code from the legacy `Animated` + `PanGestureHandler` API to `react-native-reanimated` (`useSharedValue`, `withTiming`, `runOnJS`) and the modern `Gesture.Pan()` API
- Fix the inconsistency where Slot B's `ScrollView` lacks `NativeViewGestureHandler` wrapping, making the scroll+swipe coexistence rely on an implicit invariant rather than an explicit structural guarantee

## Capabilities

### New Capabilities

- `slidable-pager`: A generic two-slot horizontal paging component that encapsulates slot management, entry/exit animation, swipe gesture detection, and scroll coexistence — accepting content via a render prop and exposing programmatic `slideForward`/`slideBack` controls

### Modified Capabilities

- (none — `ExerciseDetailScreen` behavior is unchanged from the user's perspective; only the internal implementation is refactored)

## Impact

- `src/screens/ExerciseDetailScreen.tsx`: significant simplification; delegates slot/animation/gesture logic to `SlidablePager`
- New file: `src/components/SlidablePager.tsx`
- Dependencies: `react-native-reanimated` and `react-native-gesture-handler` (both already present); no new package installs expected
- No changes to navigation, data, or other screens
