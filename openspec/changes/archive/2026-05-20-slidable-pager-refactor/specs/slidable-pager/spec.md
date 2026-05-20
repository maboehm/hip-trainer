## ADDED Requirements

### Requirement: SlidablePager renders content via render prop
The component SHALL accept a `renderItem: (index: number) => React.ReactNode` prop and a `count: number` prop. It SHALL maintain two internal slots and render the active item in the visible slot and the next/previous item (during a transition) in the off-screen slot.

#### Scenario: Active item is rendered
- **WHEN** `SlidablePager` mounts with a given `initialIndex`
- **THEN** `renderItem(initialIndex)` is visible to the user and no other slot is visible

### Requirement: SlidablePager exposes imperative slide controls via ref
The component SHALL expose a ref handle with `slideForward()` and `slideBack()` methods that programmatically trigger a directional slide transition.

#### Scenario: slideForward advances to next index
- **WHEN** `slideForward()` is called and the current index is not the last item
- **THEN** the pager transitions forward to `currentIndex + 1`

#### Scenario: slideBack goes to previous index
- **WHEN** `slideBack()` is called and the current index is not the first item
- **THEN** the pager transitions back to `currentIndex - 1`

#### Scenario: slideForward does nothing at last item
- **WHEN** `slideForward()` is called and the current index equals `count - 1`
- **THEN** no transition occurs

#### Scenario: slideBack does nothing at first item
- **WHEN** `slideBack()` is called and the current index is 0
- **THEN** no transition occurs

### Requirement: SlidablePager notifies parent of index changes
The component SHALL accept an `onIndexChange: (index: number) => void` callback that is called after each transition completes with the new active index.

#### Scenario: Index change fires after forward transition
- **WHEN** a forward transition completes
- **THEN** `onIndexChange` is called with the new index

#### Scenario: Index change fires after swipe transition
- **WHEN** a swipe gesture triggers a transition and it completes
- **THEN** `onIndexChange` is called with the new index

### Requirement: SlidablePager transitions use horizontal slide animation
The component SHALL animate transitions as a horizontal slide: new content enters from the right on forward navigation and from the left on backward navigation. The outgoing content SHALL exit in the opposite direction simultaneously. Animation duration SHALL be 220ms.

#### Scenario: Forward slide animates correctly
- **WHEN** a forward transition is triggered
- **THEN** new content slides in from the right and old content exits to the left over 220ms

#### Scenario: Back slide animates correctly
- **WHEN** a backward transition is triggered
- **THEN** new content slides in from the left and old content exits to the right over 220ms

### Requirement: SlidablePager detects horizontal swipe to navigate
The component SHALL recognize a horizontal swipe gesture (translationX magnitude > 50, horizontal movement dominant over vertical) and trigger a slide transition in the swipe direction.

#### Scenario: Swipe left navigates forward
- **WHEN** the user swipes left with translationX < -50 and horizontal movement exceeds vertical
- **THEN** a forward transition is triggered

#### Scenario: Swipe right navigates back
- **WHEN** the user swipes right with translationX > 50 and horizontal movement exceeds vertical
- **THEN** a backward transition is triggered

#### Scenario: Vertical scroll is not misinterpreted as swipe
- **WHEN** the user scrolls vertically inside the pager content
- **THEN** no horizontal transition is triggered

### Requirement: SlidablePager supports simultaneous scroll and swipe gesture
The component SHALL wire both slots' scroll views with simultaneous gesture recognition so that vertical scrolling within content and horizontal swipe navigation can coexist without one blocking the other. Both slots SHALL be wired identically.

#### Scenario: Scroll within active slot works during swipe readiness
- **WHEN** the active slot contains a scrollable view and the user scrolls vertically
- **THEN** the scroll proceeds normally and no pager transition occurs

### Requirement: SlidablePager prevents overlapping transitions
The component SHALL ignore any new transition request (programmatic or gesture) while a transition is already in progress.

#### Scenario: Rapid swipes do not stack
- **WHEN** a transition is in progress and another swipe or button tap triggers a transition
- **THEN** the second transition is ignored until the first completes

### Requirement: SlidablePager accepts an onTransitionStart callback
The component SHALL accept an optional `onTransitionStart: () => void` callback that is called at the beginning of every transition, before the animation starts.

#### Scenario: Callback fires at start of transition
- **WHEN** any transition begins (programmatic or gesture)
- **THEN** `onTransitionStart` is called before any animation runs
