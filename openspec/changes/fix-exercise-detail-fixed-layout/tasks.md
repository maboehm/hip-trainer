## 1. Navigation Config

- [x] 1.1 Set `headerShown: false` and `gestureEnabled: false` on the `ExerciseDetail` screen in `App.tsx`
- [x] 1.2 Remove the `cardStyleInterpolator` from the `ExerciseDetail` screen options (no card-level slide animation needed)

## 2. Custom In-Screen Header

- [x] 2.1 Add a custom header `View` inside `ExerciseDetailScreen` using `insets.top` for top padding, containing a back button (navigates to `ExerciseList`) and the "X of N" position label
- [x] 2.2 Style the custom header to match the existing visual design (background, font weights, border)

## 3. Body Animation

- [x] 3.1 Add an `Animated.Value` ref (`bodyTranslateX`) initialized based on `route.params.direction` (`width` for forward, `-width` for back, `0` for initial)
- [x] 3.2 On mount, run a spring/timing animation from the initial offset to `0` so the body slides in
- [x] 3.3 On `goNext` / `goPrev`, animate `bodyTranslateX` to the exit offset (slide out), then call `navigation.replace`
- [x] 3.4 Wrap only the `ScrollView` (exercise body content) in an `Animated.View` with the `bodyTranslateX` transform

## 4. Bottom Controls

- [x] 4.1 Ensure the bottom action bar (`actionBar`) is rendered as a sibling to the `Animated.View` body — not inside it — so it never participates in the body translation
- [x] 4.2 Verify bottom action bar respects `insets.bottom` with safe area padding

## 5. Verification

- [x] 5.1 Run `npx tsc --noEmit` and fix any type errors
- [ ] 5.2 Manually test: swipe forward and back between exercises and confirm the header and bottom bar stay fixed
- [ ] 5.3 Manually test: tap Prev/Next and confirm the header and bottom bar stay fixed
- [ ] 5.4 Manually test: tap back button in custom header and confirm navigation returns to the exercise list
