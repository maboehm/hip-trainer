## Context

`ExerciseDetailScreen` renders exercise content via a `ExerciseContent` component inside a `SlidablePager`. Currently the order is: name → Muskeln → Anleitung (7+ steps) → Wichtig. All sections use near-identical visual treatment — small-caps gray labels, same font size, same color. For a regular user the most critical runtime information (how many reps, how long to hold, key cues) is visually indistinguishable from supplementary content and partially off-screen.

The data layer has a `timer` object on most exercises. Four exercises have no timer and no structured rep count — rep counts are embedded in prose inside `instructions` strings.

## Goals / Non-Goals

**Goals:**
- Reorder content: pill row → Wichtig → Anleitung → Muskeln
- Add an optional `reps` field to `Exercise` type and JSON for exercises without a timer
- Render a compact pill row for timer exercises (sets × hold × rest); single pill for reps-only; nothing for neither
- Render "Wichtig" cues as a blockquote with a left blue border (`#2a7aef`), no background tint
- Establish clear visual weight differences between sections

**Non-Goals:**
- Changing timer logic or the bottom action bar
- Internationalisation or dynamic font sizing
- Editing or removing any existing exercise instruction content

## Decisions

### D1: Add `reps` as a structured field rather than parsing prose

Exercises without a timer embed rep counts like "10–15 Mal" inside instruction sentences. Parsing this reliably is fragile and would couple UI to prose formatting.

**Decision**: Add an optional `reps: number | string` field to the `Exercise` type and populate it for the four no-timer exercises. The UI reads `exercise.reps` directly.

**Alternative considered**: Parse the instructions text with a regex. Rejected — brittle, breaks if phrasing changes.

### D2: Pill row renders only present data

Three possible states:
1. `timer` present → three pills: `{sets}×`, `{hold}s halten`, `{rest}s Pause`
2. `reps` present, no timer → one pill: `{reps}×`  
3. Neither → pill row omitted entirely

**Decision**: Conditional rendering inside `ExerciseContent` based on `exercise.timer` and `exercise.reps`. No fallback text or placeholder row.

### D3: Blockquote as left border only, no background

**Decision**: A 3px left border in `#2a7aef` (existing blue accent), `paddingLeft: 12`, no background color change. Each cue line is plain text — no per-line icon prefix. The section label "Wichtig" sits above as usual (existing small-caps pattern) but the cues block itself gains the border treatment.

**Alternative considered**: Amber/warm tinted card — rejected by user preference. Per-line ⚡ icon — rejected by user preference.

### D4: Visual weight hierarchy via type scale, not color palette expansion

Rather than introducing new colors, differentiate sections through:
- Exercise name: 28px / weight 700 (unchanged)
- Pill numbers: 20px / weight 700, label text 12px / weight 500
- Wichtig cues: 15px / weight 500, color `#111` (darker than current `#555`)
- Anleitung steps: 15px / weight 400, color `#444`
- Muskeln: 13px / weight 400, color `#888`

## Risks / Trade-offs

- [`reps` field is optional] → UI must handle `undefined` gracefully; TypeScript optional field enforces this at compile time.
- [Four exercises get manually added `reps` values] → These are hardcoded in JSON; if instructions prose is later updated, `reps` could drift. Acceptable — data is static.
- [No fold/separator between Wichtig and Anleitung] → User requested no fold. Long instruction lists still require scrolling; accepted trade-off.
