## Context

The `ExerciseDetail` screen uses `navigation.replace` to move between exercises. This triggers a full stack card transition — the entire screen (including the React Navigation header and the bottom action bar) slides in/out with each exercise change. The user experiences the nav bar and bottom controls animating/jumping during swipes, which feels broken.

The current `cardStyleInterpolator` in `App.tsx` slides the whole card. The React Navigation header lives outside the card content but is part of the same screen render, so it flickers or repositions on replace.

The bottom action bar (`actionBar`) is inside the card and also slides.

## Goals / Non-Goals

**Goals:**
- Top navigation bar stays visually fixed (no movement) during exercise-to-exercise transitions.
- Bottom controls (timer + prev/next buttons) stay visually fixed during transitions.
- Only the exercise body content (name, muscles, instructions, cues) slides left/right during swipe.

**Non-Goals:**
- Changing the swipe gesture detection mechanism.
- Animating the header or bottom bar in any way.
- Supporting landscape or other orientations.
- Replacing the `navigation.replace` approach with a pager library.

## Decisions

### Decision 1: Keep `navigation.replace` but limit what slides

Rather than introducing a pager component (e.g. `react-native-pager-view`), we keep the existing replace-based navigation and fix the visual issue by:

1. **Removing the header from React Navigation** (`headerShown: false` on `ExerciseDetail`) and rendering a custom in-screen header that is positioned outside/above the animated content area.
2. **Moving the bottom action bar outside the animated content area** — it already sits below the `ScrollView` inside `<View style={styles.inner}>`, which is the card root, so it does slide. We restructure so that the animated region is only the body.

The `cardStyleInterpolator` will be changed to only translate the **body content** portion. We achieve this by wrapping only the exercise body in an `Animated.View` that we drive manually via the gesture, rather than relying on the card-level interpolator.

**Alternative considered**: Use `react-native-pager-view` or `FlatList` horizontal pager. Rejected because it introduces a new dependency and a larger refactor without clear benefit given the simple replace pattern already works.

**Alternative considered**: Use a shared-element or overlay approach where header/footer are rendered in a parent. Rejected because the navigation stack doesn't easily support persistent overlays without restructuring to a tab/modal pattern.

### Decision 2: Custom in-screen header replaces React Navigation header

We set `headerShown: false` for `ExerciseDetail` and render the back button + "X of N" title inside the screen itself, positioned with `paddingTop: insets.top`. This header `View` is outside the swipeable body area, so it never moves.

### Decision 3: Animate only the body with a local `Animated.Value`

Instead of card-level animation, we wrap the exercise body content in an `Animated.View`. On swipe end (via `PanGestureHandler`), we:
1. Animate the body sliding out (left or right).
2. Call `navigation.replace` to load the new screen.
3. The new screen starts with the body pre-offset and animates to `translateX: 0`.

This makes header and footer visually static — they never participate in the translation.

## Risks / Trade-offs

- [Risk] The entering screen starts with a brief frame before the animation begins → Mitigation: initialize `translateX` to the offscreen value immediately in component state/ref, driven by `route.params.direction`.
- [Risk] Custom header may not match platform conventions exactly → Mitigation: acceptable for this app (portrait-only, light mode, single custom style).
- [Risk] Back gesture on iOS (swipe from left edge) now conflicts with custom header → Mitigation: disable the native back swipe gesture (`gestureEnabled: false`) on `ExerciseDetail` since navigation between exercises uses replace, not push/pop semantics; a dedicated back button returns to the list.
