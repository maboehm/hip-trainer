## 1. Build SlidablePager component

- [x] 1.1 Create `src/components/SlidablePager.tsx` with TypeScript types: `SlidablePagerHandle` (ref interface with `slideForward`, `slideBack`), `SlidablePagerProps` (`count`, `initialIndex`, `renderItem`, `onIndexChange`, `onTransitionStart`)
- [x] 1.2 Implement two-slot layout: `overflow: hidden` clip container with two `Animated.View` (Reanimated) slots using `absoluteFill` and `useSharedValue` for `translateX`
- [x] 1.3 Implement `slide(nextIndex, direction)` function using `withTiming` (220ms) on both shared values in parallel, calling `runOnJS` callbacks for `onTransitionStart` and `onIndexChange`
- [x] 1.4 Implement `transitioning` guard (ref boolean) to prevent overlapping transitions
- [x] 1.5 Implement boundary checks in `slideForward`/`slideBack`: no-op at first/last item
- [x] 1.6 Expose `slideForward` and `slideBack` via `useImperativeHandle` on a forwarded ref
- [x] 1.7 Add swipe gesture using `Gesture.Pan()` with `activeOffsetX={[-20, 20]}`, `failOffsetY={[-10, 10]}`, translationX threshold > 50, and horizontal-dominance check
- [x] 1.8 Wire both slots' `ScrollView` refs with `Gesture.Native()` and compose with `Gesture.Simultaneous(pan, nativeA, nativeB)` — apply identically to both slots via `GestureDetector`

## 2. Migrate ExerciseDetailScreen

- [x] 2.1 Replace `PanGestureHandler` + `NativeViewGestureHandler` + two `Animated.View` slot blocks with a single `<SlidablePager>` instance
- [x] 2.2 Pass `renderItem` render prop that returns `<ExerciseContent exercise={exercises[index]} />`
- [x] 2.3 Wire `onIndexChange` to update `currentIndex` state (drives the "N of M" header counter)
- [x] 2.4 Wire `onTransitionStart` to call `setTimerVisible(false)` (resets timer on navigation)
- [x] 2.5 Store the `SlidablePager` ref and update Prev/Next button `onPress` handlers to call `ref.current.slideBack()` / `ref.current.slideForward()` instead of the inlined `slide()` function
- [x] 2.6 Remove all inlined slot state (`slotContent`, `activeSlot`), `translateA`/`translateB` `Animated.Value`s, `transitioning` ref, and the `slide()` function from the screen
- [x] 2.7 Remove unused imports (`Animated`, `PanGestureHandler`, `NativeViewGestureHandler`, `GestureHandlerRootView` if no longer needed at screen level)

## 3. Verify

- [x] 3.1 Run `npx tsc --noEmit` and fix any type errors
- [x] 3.2 Smoke-test on iOS: tap Prev/Next buttons, swipe left/right, scroll vertically within an exercise, verify timer resets on navigation
- [x] 3.3 Smoke-test on Android: same checks as iOS, confirm edge-to-edge safe-area insets are unaffected
