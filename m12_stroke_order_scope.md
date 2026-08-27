# M12 Scope: Directional Stroke-Order Writing Guidance

**Status:** Implemented directly per "proceed... open a draft PR when ready" — included here as the scope record/PR reference, same deliverable as every prior milestone's `mX_scope.md`.

## Architecture decision — why this is riskier than M6-M11, and how that risk is contained

Every milestone through M11 was pure data + reused, unmodified renderers. M12 is the first to touch code the already-shipped `alphabet-writing-1` lesson (29 steps, all 28 letters) depends on. To keep that at zero risk:

- `renderTraceLetterStep` gains a new, purely additive branch gated on an optional `step.strokes` field. When absent — true for all 28 existing `alphabet-writing-1` steps, untouched — it falls through to the exact original code, unmodified, character-for-character. When present — true only for the new lesson below — it renders the new 3-phase flow instead.
- All new phase logic lives in new functions (`renderStrokeGuidePhase`, `initTraceCanvasWithStrokes`, `drawStrokeArrows`) rather than edits inside the existing `initTraceCanvas`/`drawGuideLetter`. Some logic is intentionally duplicated rather than shared, specifically to avoid any change to the existing functions' behavior.
- Regression-tested explicitly: `alphabet-writing-1` re-run end-to-end after this change, confirmed identical step count and behavior to before.

## Scope (What Is In)

1. Directional arrows (not animated ghost-tracing) overlaid on the existing tracing canvas — chosen over ghost-tracing because it's achievable and verifiable in one pass without a new animation system, and the scope explicitly allows either.
2. Simplified stroke-direction data for all 28 letters (see honesty note below).
3. A 3-phase interaction per letter — **Watch** (arrows + glyph, no scoring yet) → **Trace** (existing ghost-glyph + freehand + ink-coverage scoring, now with arrows) → **Write independently** (guide and arrows hidden, freehand only, from memory).
4. New lesson (`stroke-order-writing`), reached from Practice, same pattern as every M7-M11 addition — not merged into `alphabet-writing-1`.
5. Roadmap line marking "Directional stroke-order writing guidance" done.

## Out of Scope

- ❌ Full handwriting recognition (visual guidance only, exactly as specified).
- ❌ Contextual (initial/medial/final) stroke variants — isolated form only, matching the existing tracing feature's own current scope.
- ❌ Dots rendered as separately-numbered strokes — dot count/position is mentioned in the instructional text per letter instead. Dot-stroke sequencing is a finer calligraphic detail; overclaiming precision there would be worse than not showing it.
- ❌ Accounts, subscriptions, native audio, grammar — separate milestones.

## Honesty note on the stroke data itself

Unlike every prior milestone's data (which I could verify against the app's own real vocabulary), stroke-order geometry can't be verified against anything already in this codebase — it has to come from standard Arabic penmanship convention. I kept every letter to 1-2 broad directional strokes (start point → end point, normalized 0-1 canvas coordinates) capturing the correct right-to-left, top-to-bottom starting convention, rather than attempting precise multi-point calligraphic paths I can't independently verify. This is a genuine simplification, stated plainly rather than presented as more authoritative than it is — worth a native-speaker or calligraphy-teacher review before this is treated as final, the same way M13's actual audio needs a real voice actor rather than my guess at pronunciation.

## What was implemented

- `strokeOrderData`: 28 entries (`{ letterId, strokes: [{from:{x,y}, to:{x,y}}, ...] }`), reused via `arabicAlphabet`'s existing letter objects (no new letter data duplicated).
- `drawStrokeArrows(ctx, canvas, strokes, opacity)`: plain canvas line + arrowhead + number, reusing the existing `--danger` CSS custom property for color (no new CSS, no new library) — the same pattern the existing code already uses for `--accent`.
- `renderStrokeGuidePhase` / `initTraceCanvasWithStrokes`: the 3-phase flow, reusing `tracePoint`/`clearTraceCanvas`/`updateTraceCoverage`/`inkNear` unmodified. In the "write" phase, the coverage label is replaced with static text ("Writing from memory — no guide shown") rather than showing a permanently-0% coverage score against a blank guide, which would otherwise read as a bug.
- New lesson `stroke-order-writing`: 1 explain intro + 28 per-letter steps (each internally cycling all 3 phases) + 1 complete = 30 steps, matching `alphabet-writing-1`'s own scale (29 steps) for a whole-alphabet lesson.
