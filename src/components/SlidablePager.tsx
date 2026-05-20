import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-worklets';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  useAnimatedReaction,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface SlidablePagerHandle {
  slideForward: () => void;
  slideBack: () => void;
}

export interface SlidablePagerProps {
  /** Total number of items. */
  count: number;
  /** Index to start on. */
  initialIndex: number;
  /** Render the content for a given index. */
  renderItem: (index: number) => React.ReactNode;
  /** Called after a transition completes with the new index. */
  onIndexChange?: (index: number) => void;
  /** Called at the very start of a transition, before animation begins. */
  onTransitionStart?: () => void;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type Slot = 'A' | 'B';

const SLIDE_DURATION = 220;

// Sentinel value meaning "no transition completed yet".
const NO_TRANSITION = -1;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SlidablePager = forwardRef<SlidablePagerHandle, SlidablePagerProps>(
  function SlidablePager(
    { count, initialIndex, renderItem, onIndexChange, onTransitionStart },
    ref,
  ) {
    const { width } = useWindowDimensions();

    // Which slot is currently the active (visible) one.
    const activeSlot = useRef<Slot>('A');

    // What index each slot is rendering.
    const [slotContent, setSlotContent] = useState<{ A: number; B: number }>({
      A: initialIndex,
      B: initialIndex,
    });

    // The current index. Stored as a shared value so the gesture worklet can
    // read it safely without Worklets serializing a plain ref object.
    const currentIndex = useSharedValue(initialIndex);

    // Guard: prevent overlapping transitions.
    const transitioning = useRef(false);

    // Reanimated shared values — one per slot.
    // Invariant at rest: active slot at 0, idle slot parked at +width (off-screen right).
    const translateA = useSharedValue(0);
    const translateB = useSharedValue(width);

    const styleA = useAnimatedStyle(() => ({
      transform: [{ translateX: translateA.value }],
    }));
    const styleB = useAnimatedStyle(() => ({
      transform: [{ translateX: translateB.value }],
    }));

    // ScrollView refs for gesture composition.
    const scrollRefA = useRef<ScrollView>(null);
    const scrollRefB = useRef<ScrollView>(null);

    // -----------------------------------------------------------------------
    // Completion signalling — worklet-safe, no JS objects in worklet closures
    // -----------------------------------------------------------------------
    //
    // When an animation finishes, the worklet writes the completed nextIndex
    // into this shared value. useAnimatedReaction watches it on the JS thread
    // and does all the ref/state cleanup there — no refs ever enter a worklet.

    const completedIndex = useSharedValue(NO_TRANSITION);

    // These refs hold the "in-flight" transition metadata so the reaction
    // callback can read them. They are only ever read on the JS thread.
    const inFlightNextSlot = useRef<Slot>('B');
    const inFlightCurrentSlot = useRef<Slot>('A');

    const onTransitionComplete = useCallback(
      (nextIndex: number) => {
        const parkAnim = inFlightCurrentSlot.current === 'A' ? translateA : translateB;
        parkAnim.value = width;
        activeSlot.current = inFlightNextSlot.current;
        currentIndex.value = nextIndex;
        transitioning.current = false;
        onIndexChange?.(nextIndex);
      },
      [translateA, translateB, width, onIndexChange, currentIndex],
    );

    useAnimatedReaction(
      () => completedIndex.value,
      (value, previous) => {
        if (value !== NO_TRANSITION && value !== previous) {
          runOnJS(onTransitionComplete)(value);
          completedIndex.value = NO_TRANSITION;
        }
      },
    );

    // -----------------------------------------------------------------------
    // Core slide logic
    // -----------------------------------------------------------------------

    const slide = useCallback(
      (nextIndex: number, direction: 'forward' | 'back') => {
        if (transitioning.current) return;
        if (nextIndex < 0 || nextIndex >= count) return;

        const current = activeSlot.current;
        const next: Slot = current === 'A' ? 'B' : 'A';
        const currentAnim = current === 'A' ? translateA : translateB;
        const nextAnim = current === 'A' ? translateB : translateA;

        const enterFrom = direction === 'forward' ? width : -width;
        const exitTo = direction === 'forward' ? -width : width;

        onTransitionStart?.();
        transitioning.current = true;

        // Record in-flight metadata for the completion callback.
        inFlightNextSlot.current = next;
        inFlightCurrentSlot.current = current;

        // Load new content into the idle (off-screen) slot.
        setSlotContent(prev => ({ ...prev, [next]: nextIndex }));

        // Snap idle slot to entry edge — it's already off-screen, no visible jump.
        nextAnim.value = enterFrom;

        // Animate. The completion worklet only writes a primitive (nextIndex)
        // to a shared value — no JS objects, no refs, no closures with refs.
        currentAnim.value = withTiming(exitTo, { duration: SLIDE_DURATION });
        nextAnim.value = withTiming(0, { duration: SLIDE_DURATION }, finished => {
          'worklet';
          if (finished) {
            completedIndex.value = nextIndex;
          }
        });
      },
      [count, width, onTransitionStart, translateA, translateB, completedIndex],
    );

    // -----------------------------------------------------------------------
    // Imperative handle
    // -----------------------------------------------------------------------

    useImperativeHandle(ref, () => ({
      slideForward() {
        const next = currentIndex.value + 1;
        if (next < count) slide(next, 'forward');
      },
      slideBack() {
        const next = currentIndex.value - 1;
        if (next >= 0) slide(next, 'back');
      },
    }));

    // -----------------------------------------------------------------------
    // Gestures
    // -----------------------------------------------------------------------

    const panGesture = Gesture.Pan()
      .activeOffsetX([-20, 20])
      .failOffsetY([-10, 10])
      .onEnd(event => {
        'worklet';
        const absX = Math.abs(event.translationX);
        const absY = Math.abs(event.translationY);
        if (absX > 50 && absX > absY) {
          if (event.translationX < 0) {
            runOnJS(slide)(currentIndex.value + 1, 'forward');
          } else {
            runOnJS(slide)(currentIndex.value - 1, 'back');
          }
        }
      });

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.clip}>
          {/* Slot A */}
          <Animated.View style={[StyleSheet.absoluteFill, styleA]}>
            <ScrollView
              ref={scrollRefA}
              contentContainerStyle={styles.content}
              scrollEventThrottle={16}
            >
              {renderItem(slotContent.A)}
            </ScrollView>
          </Animated.View>

          {/* Slot B */}
          <Animated.View style={[StyleSheet.absoluteFill, styleB]}>
            <ScrollView
              ref={scrollRefB}
              contentContainerStyle={styles.content}
              scrollEventThrottle={16}
            >
              {renderItem(slotContent.B)}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

export default SlidablePager;

const styles = StyleSheet.create({
  clip: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    paddingBottom: 24,
  },
});
