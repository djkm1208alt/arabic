# Fix Scope: Live Link From Alphabet View to Letter-Writing Practice

**Status:** Implemented, QA passed (320/375/390/desktop + console + regression) — opening draft PR, holding for merge approval per standing workflow.

## The problem

The Alphabet tab's per-letter detail view (`selectLetter()`) rendered a static placeholder:

```html
<div class="writing-practice-placeholder">✍️ Writing practice — coming in a future milestone.</div>
```

That's been stale since M12 merged: `stroke-order-writing` (all 28 letters, Watch → Trace → Write) shipped, and `alphabet-writing-1` (plain tracing) already existed before that. Writing practice is live — it just wasn't reachable from this spot.

## Decision — which lesson to link, and how

Two existing lessons could be the target: `alphabet-writing-1` (trace only) and `stroke-order-writing` (Watch → Trace → Write, directional arrows). Picked **`stroke-order-writing`**, landing directly on the selected letter's step, because it's the more complete "writing practice" experience and this is exactly the gap M12's own scope note flagged as not yet wired up.

The lesson runner already has everything needed to do this without touching lesson data or the runner itself:

- `findLetterStepIndex(lessonObj, letterId)` / `jumpToLetterStep(letterId)` — existing, used by the in-lesson letter picker — locate and jump to a given letter's `trace-letter` step in the active lesson. `stroke-order-writing`'s steps already carry `letter: letter` (the shared `arabicAlphabet` objects), so this works with zero changes.
- `startLesson(lessonId, returnView)` — existing — starts a lesson and records where "Exit" should return to.

So the fix is one small additive function, not a change to either:

```js
function practiceLetterWriting(letterId) {
    startLesson("stroke-order-writing", "alphabet");
    jumpToLetterStep(letterId);
}
```

`startLesson` renders step 0 (the lesson's intro) for one synchronous tick before `jumpToLetterStep` overwrites it with the target step — both calls complete before the browser paints, so nothing flashes.

## What changed

1. Added `practiceLetterWriting(letterId)` next to `jumpToLetterStep`/`findLetterStepIndex`.
2. Replaced the stale placeholder `<div>` in `selectLetter()` with `<button class="pill show-btn" ...>✍️ Practice Writing This Letter</button>`, wired to `practiceLetterWriting(letter.id)`.
3. Removed the now-unused `.writing-practice-placeholder` CSS rule (its only two references were the definition and the div just replaced).

**Zero new CSS.** The button reuses the existing `.pill.show-btn` classes (same styling as every other lesson-launch button, e.g. "Start Tracing", "Start Stroke Order"), plus the same inline `margin-top` pattern already used elsewhere for a single spaced-out action button (`#tracePhaseBtn`).

## Out of scope

- ❌ No changes to `alphabet-writing-1`, `stroke-order-writing`, or any lesson data.
- ❌ No changes to the in-lesson letter picker or `startLesson`/`jumpToLetterStep` behavior — both reused exactly as they already existed.
- ❌ Not linking to `alphabet-writing-1` as well — one entry point avoids asking the learner to choose between two "writing practice" buttons with no clear distinction from this view.

## QA pass

Driven with Playwright/Chromium against the static file served locally (no build step in this repo).

- **320px / 375px / 390px / desktop** — selected a non-default letter (ḥāʾ) in the Alphabet view, confirmed the button renders on one line with no overflow at all four widths, clicked it, confirmed the lesson view opens with the in-lesson letter picker showing "— currently on ḥāʾ" and the matching tile highlighted (i.e. it lands on the correct letter, not step 0), and confirmed "← Exit" returns to the Alphabet view with the same letter still selected.
- **Console** — clean at all four widths and through the regression pass, aside from one `net::ERR_CONNECTION_RESET` on the Google Fonts stylesheet request — pre-existing and environment-only (this sandbox's network proxy can't reach `fonts.googleapis.com`), unrelated to this change, and consistent with M10's privacy audit, which already documented those two font hosts as the app's only external calls.
- **Regression** — Practice tab's "Start Tracing" (`alphabet-writing-1`) and "Start Stroke Order" (`stroke-order-writing`) launches re-tested after this change: both still open at step 1 with no errors, confirming the shared lesson runner is unaffected.
