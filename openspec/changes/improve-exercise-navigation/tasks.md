## 1. Sticky Bottom Action Bar

- [x] 1.1 Refactor ExerciseDetailScreen layout to use a flex column with a ScrollView for content and a fixed View for the action bar
- [x] 1.2 Move the timer button, next button into the sticky action bar View
- [x] 1.3 Apply `useSafeAreaInsets` bottom padding to the action bar for Android edge-to-edge compatibility

## 2. Previous Exercise Button

- [x] 2.1 Add a "Previous Exercise" button to the sticky action bar, styled as secondary/ghost (less prominent than Next)
- [x] 2.2 Wire the Previous button to navigate to `ExerciseDetail` with `index - 1`
- [x] 2.3 Disable (reduced opacity, no-op press) the Previous button when `index === 0`
- [x] 2.4 Disable the Next button when on the last exercise (align with existing spec behavior — hide or disable)

## 3. Swipe Gesture Navigation

- [x] 3.1 Wrap the scrollable content area in a `PanGestureHandler` from `react-native-gesture-handler`
- [x] 3.2 Implement swipe detection: trigger navigation only when `|translationX| > 50` and `|translationX| > |translationY|`
- [x] 3.3 Swipe left → navigate to next exercise (no-op on last exercise)
- [x] 3.4 Swipe right → navigate to previous exercise (no-op on first exercise)

## 4. Verification

- [x] 4.1 Run `npx tsc --noEmit` and fix any type errors
- [ ] 4.2 Manually verify sticky bar stays visible when scrolling long instructions on iOS
- [ ] 4.3 Manually verify Previous/Next boundary states (disabled at first and last exercise)
- [ ] 4.4 Manually verify swipe left/right navigation and boundary no-op behavior
