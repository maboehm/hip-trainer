## Context

The exercise detail screen currently has a "Next Exercise" button and a timer that are rendered inline with the scrollable content. As exercise instructions grow longer, these controls can scroll off screen. There is no way to go back to a previous exercise without exiting to the list, and no gesture-based navigation.

The app already depends on `react-native-gesture-handler` (required as first import in `App.tsx`), making swipe detection available without new dependencies. Navigation is handled by `@react-navigation/stack` and the screen receives `navigation` and `route` props with typed `RootStackParamList`.

## Goals / Non-Goals

**Goals:**
- Sticky bottom action bar — timer, previous, and next buttons always visible on screen
- Previous exercise button, visually secondary to Next
- Swipe left/right to navigate between exercises
- Boundary guards: no-op swipe/button at first and last exercise

**Non-Goals:**
- Animated swipe transitions or page-curl effects
- Haptic feedback
- Persisting navigation history across app restarts
- Any changes to the exercise list screen or data layer

## Decisions

### Sticky bottom bar via flex layout

Use a `flex: 1` outer container with the scrollable content in a `ScrollView` (flex-growing) and the action bar as a plain `View` below it. This is the standard React Native pattern for pinning a footer without `position: absolute`, avoiding keyboard/safe-area conflicts.

Alternatives considered:
- `position: absolute` bottom bar — causes overlap with content and safe-area edge cases on Android with `edgeToEdgeEnabled: true`.
- `FlatList` with a `ListFooterComponent` — over-engineered for a single content block.

### Swipe gestures via react-native-gesture-handler `PanGestureHandler`

Wrap the scrollable content area in a `PanGestureHandler`. Detect horizontal swipes by comparing the final translation X against a threshold (e.g., 50px) and confirming that the horizontal displacement exceeds the vertical (to avoid interfering with vertical scroll). On a qualifying swipe, call the same navigation handler used by the buttons.

Alternatives considered:
- `react-native-swiper` / `react-native-pager-view` — heavier dependency, changes the whole screen paradigm.
- `ScrollView` with `horizontal` paging — conflicts with the existing vertical scroll for instructions.

### Previous button styling

Render the Previous button with a secondary/ghost style (outline or muted text, no filled background) alongside the primary-styled Next button. Both live in the same sticky bar row as the timer trigger.

## Risks / Trade-offs

- [Gesture conflict with vertical scroll] `PanGestureHandler` may intercept vertical scroll events → Mitigation: only trigger navigation when `|translationX| > |translationY|` and `|translationX| > threshold`.
- [Safe area on Android] Sticky bar must respect bottom inset with `edgeToEdgeEnabled` → Mitigation: wrap bar content with `useSafeAreaInsets` bottom padding.
- [First/last boundary UX] Disabled buttons must be visually obvious → Mitigation: reduce opacity and disable `onPress` when at boundary.
