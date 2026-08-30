# M19 Scope: Review & Retention

**Status:** Draft for review. **No implementation code written.** Do not begin implementation until this is approved.

**Parent:** [ROADMAP.md](ROADMAP.md) M19 · [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) §8 · depends on M14 (`mastered`), M15 (`deriveLevel`), M16 (`objectsIntroduced`), M17 (placement tier), M18 (`interactionLog` + `exerciseTypes`).

**One-line summary:** Turn M18's event stream into memory. Fold `interactionLog` + `mastered` into a per-object `ReviewState` (reps, ease, interval, due date), run it through a real, transparent **SM-2-lite scheduler**, expose review queues (due · mistakes · weak · stale), and let the review answers feed back in. The crude `mastered` boolean becomes a six-state lifecycle, and `deriveLevel`'s graded signal finally covers every strand — not just vocabulary. Only now does the app get to say "spaced repetition."

---

## 1. Why M19 exists

M18 records every graded answer but does nothing with it — `interactionLog` is inert, `deriveLevel` still reads a flat `mastered` set that only vocabulary can populate, and `rebuildDeck()`'s comment already claims "spaced-repetition-lite" it doesn't do. There is no notion of *when* to see a word again, no mistake follow-up, and no way for "I answered this grammar cloze right three times" to become a reading/grammar level.

M19 adds the retention layer: the state model, the scheduler, the queues, and the `deriveLevel` upgrade. It does **not** author content (M20) or add accounts/sync (M22).

---

## 2. What M19 delivers

### 2.1 `ReviewState` — per object, derived + cached

```
progress.reviewState[objectId] = {
  objectId, skill,
  reps,          // consecutive successful reviews
  ease,          // SM-2 factor, starts 2.5, clamped [1.3, 3.0]
  intervalD,     // days to next review
  dueDate,       // ISO date
  lapses,        // times forgotten
  lastResult,    // "again" | "hard" | "good" | "easy"
  lastSeen,      // ISO
  status         // §2.3
}
progress.reviewCursor = "<ISO ts of the last interaction folded in>"
```

- **Derived, incrementally.** The source of truth stays `progress.interactionLog` (M18) + `progress.mastered` (M14). On load and after each interaction, `foldInteractions()` applies every event **newer than `reviewCursor`** through the scheduler and advances the cursor. So the state accumulates even as the 400-event log rotates — a full replay is never needed.
- **Seeded from `mastered`** on first fold (§4): each mastered object starts at `reps: 2, ease: 2.5, status: "reviewed", dueDate: now + 4d` — the existing signal is preserved without inventing an event history.
- Recomputable from scratch if `reviewCursor` is missing/corrupt (replays whatever the log still holds).

### 2.2 The scheduler — SM-2-lite, pluggable, honest

```
scheduler.next(state, quality) -> { reps, ease, intervalD, dueDate, lapses }
```

- One module, one function. **v1 = SM-2-lite**: transparent arithmetic, no ML, swappable.
  - `quality` derived from the `InteractionEvent`: `!correct` → `again`; `correct` with `latencyMs` above a slow threshold → `hard`; typical → `good`; fast → `easy`. (`latencyMs` may be `null` → `good`.)
  - `again`: `reps → 0`, `lapses += 1`, `ease → ease − 0.2`, `intervalD → 1`.
  - `hard`: `ease − 0.15`, `intervalD → max(1, intervalD × 1.2)`.
  - `good`: `reps === 0 → 1d`, `reps === 1 → 4d`, else `intervalD × ease`; `reps += 1`.
  - `easy`: as `good` but `× 1.3` and `ease + 0.15`.
  - `ease` clamped `[1.3, 3.0]`; `dueDate = lastSeen + intervalD`.
- **The label rule:** the string "spaced repetition" appears in the UI/comments **only** once `scheduler.next` is the thing computing `dueDate`. `rebuildDeck()`'s stale "spaced-repetition-lite" comment is corrected in this milestone.

### 2.3 The six-state lifecycle

`learned → practised → weak → forgotten → reviewed → retained` — a **pure function** of `(reps, lapses, ease, dueDate, lastResult, now)`:

| status | when |
|---|---|
| `learned` | introduced (M16) but no graded attempt yet |
| `practised` | ≥ 1 correct attempt, `reps` ≤ 1, not due |
| `weak` | `ease < 2.0` or last result `again`/`hard`, and not currently due |
| `forgotten` | overdue by more than `intervalD` (a full extra interval missed) with `lapses ≥ 1` |
| `reviewed` | answered correctly on/after its due date; `2 ≤ reps < RETAINED_REPS` |
| `retained` | `reps ≥ RETAINED_REPS` (default 4) and `ease ≥ 2.3` |

Replaces the `mastered` boolean as the vocabulary status shown on the Word Bank / Progress (the boolean stays as the flashcard toggle's store — §3 I4).

### 2.4 Mistake log — a derived view

No new store. `mistakes()` = objects whose most recent graded event is `correct: false` **and** which have not since been answered correctly. `mistakesForStrand(skill)`, `mistakeCount()`. This is exactly what M18's `correct: false` events already give.

### 2.5 Review queues

Each is a filter over `reviewState` + `mistakes()`:

| queue | filter |
|---|---|
| **Due for review** | `status` ∈ {`reviewed`,`retained`,`practised`} and `dueDate ≤ now` |
| **Fix mistakes** | `mistakes()` |
| **Weak spots** | `status` ∈ {`weak`,`forgotten`} |
| **Haven't seen in a while** | `lastSeen` older than `STALE_DAYS` (default 21) and not due |

`reviewQueue(name)` returns the object list; `reviewQueueCounts()` powers the badges.

### 2.6 The review runner

A lightweight flow (`#view-review`, hidden, not in the nav — reached from a new **Review** card on the Practice view). Given a queue:

- Serves 8–15 items, one per object, **generated via M18's `exerciseTypes`** — `choice` for most, `match` when several vocab objects share a topic, `cloze` for a `txt:`/`gr:` object. No new item code.
- Each answer **emits an `InteractionEvent`** (a review *is* a graded interaction) → `foldInteractions()` reschedules the object immediately.
- Ends on a plain summary: *"7 reviewed, 2 to see again soon."* No score, no streak pressure beyond the existing daily goal.
- The Practice **Review** card shows the live queue counts and is hidden entirely until there is at least one due/mistake/weak object (a fresh learner sees no empty review UI).

### 2.7 `deriveLevel` — the graded signal covers every strand

The M17 precedence is kept; its **graded tier changes source**:

- **Before:** `coverageLevel(strandObjects, new Set(progress.mastered), …)` — only vocabulary (the only strand `mastered` can hold) ever reached `firm`.
- **After:** `coverageLevel(strandObjects, retainedSet(), …)` where `retainedSet()` = objects with `status` ∈ {`retained`,`reviewed`}. Since `reviewState` is **seeded from `mastered`**, every currently-mastered vocab object is in `retainedSet()` on day one — **no regression** — and now a `gr:` point answered correctly across several cloze reviews, or a `syl:` drilled in `build`, also counts. Reading / grammar / listening / pronunciation get a real `firm` path for the first time.
- `EVIDENCE_MIN` (12) and the `assess: "reliable"` gate for `firm` are unchanged. Placement and the lesson bridge still sit below.

`deriveLevel` stops reading `progress.mastered` directly; `computeMasteryStats()` and the Word-Bank badges read `reviewState` status instead (with `mastered` as the fallback for objects not yet in `reviewState`).

### 2.8 Learner-state migration

`progress` gains `reviewState: {}` and `reviewCursor: null`. `loadProgress` adds them; `foldInteractions()` runs once on load to seed from `mastered` + fold any logged events. `progress.mastered`, `interactionLog`, `skillLevels`, `placementResult`, `objectsIntroduced`, streak — all untouched. Idempotent (folding the same events past the cursor is a no-op), lossless, verified against a real pre-M19 blob (which came through M14→M18).

### 2.9 Tooling + docs

- `tools/build-content.js` — no new output. A small check that `RETAINED_REPS`, `STALE_DAYS`, the ease clamp, and the interval steps are internally consistent is not warranted; validation stays as is. (The scheduler is code, not content.)
- `content/m19-review-preview.md` — generated: the scheduler's output for a worked sequence of answers, the six-state truth table, each queue's filter, and the `deriveLevel` before/after on a sample profile — for sign-off before the review-runner UI.
- This scope doc; a "What shipped" note on merge; `ROADMAP.md` M18/M19 rows + `CURRICULUM_ARCHITECTURE.md` §8 annotated; the "Spaced repetition" roadmap chip now legitimately ●.

---

## 3. Invariants — what M19 must NOT change

| # | Invariant |
|---|---|
| I1 | All 13 runnable lessons and every M6–M18 behaviour run identically. The lesson runner, `stepRenderers`, `exerciseTypes`, `renderMCQ`, `generateLessonSteps`, and `emitInteraction` are unchanged — M19 *reads* `interactionLog` and *adds* the review runner as a new consumer. |
| I2 | The M13 audio layer, M14 `CONTENT`, M15 taxonomy, M16 `CURRICULUM`, M17 `placementResult`, M18 `exerciseTypes` + the `InteractionEvent` shape are untouched. |
| I3 | `HARAKAT` == 3; `strokeOrderData`, `RECORDED_AUDIO_MANIFEST` byte-identical; both build tools `--check` green. |
| I4 | Flashcards keep working: `markCard` still writes `progress.mastered` (and now also emits an `InteractionEvent` so the schedule moves). `rebuildDeck` still surfaces unmastered-first; only its comment is corrected. `progress.mastered` values are never rewritten by M19. |
| I5 | New CSS is scoped to `#view-review` and the Practice **Review** card, token-based, listed in the PR. No nav change. No change to Learn / Progress / Placement / Alphabet layout. |
| I6 | No runtime dependency, no runtime fetch; `index.html` stays one self-contained file. |
| I7 | Western digits in UI chrome; Arabic-Indic only inside reviewed content. |
| I8 | **No new Arabic content.** Review items are generated from existing objects via M18's registry. |
| I9 | `deriveLevel` stays honest — `firm` only on a `reliable` strand with ≥ `EVIDENCE_MIN` retained objects; speaking is still never machine-levelled; the seeded-from-`mastered` rule guarantees no strand *loses* a level it had at M18. |
| I10 | The word **"spaced repetition"** appears only where `scheduler.next` computes the due date. |

---

## 4. Migration requirements

| # | |
|---|---|
| MIG1 | `progress` gains `reviewState {}` + `reviewCursor null`; every other field preserved; idempotent; lossless; tested against a real pre-M19 blob. |
| MIG2 | First `foldInteractions()` seeds `reviewState` from `progress.mastered` (each → `reps 2 / ease 2.5 / reviewed / due +4d`), then folds any events in `interactionLog`. Running it again advances nothing (cursor guard). |
| MIG3 | On a profile with mastered vocab and no `interactionLog`, `deriveLevel("vocabulary")` returns the **same level and confidence** as it did at M18 (regression fixture). |
| MIG4 | `build-content.js --check` + `build-audio-manifest.js --check` green; two runs byte-identical; the seeded-RNG byte-compare of the 13 lessons unchanged. |
| MIG5 | Reversible — reverting the merge restores exact post-M18 behaviour (`reviewState`, `reviewCursor`, `scheduler`, the queues, the review runner are all new or additive; the `deriveLevel` source swap is behaviour-preserving via the seed). |

---

## 5. Acceptance criteria

- `scheduler.next` produces the documented intervals for a `good/good/good` sequence (1d → 4d → ~10d) and resets on `again`; ease clamps at the bounds.
- `foldInteractions()` on a fresh profile with 5 mastered lexemes → 5 `reviewState` entries, all `status: "reviewed"`, `reviewCursor` set. Re-run → no change.
- Answering a review item emits an `InteractionEvent` and immediately updates that object's `dueDate` / `reps` / `status`.
- The four queues return correct membership on a fixture profile (one due, one mistake, one weak, one stale).
- Practice **Review** card is hidden when all queues are empty; shows counts otherwise; opens the runner.
- The runner serves items generated by `exerciseTypes`, 0 console errors, every Arabic string traces to an object; ends on a plain summary.
- `deriveLevel`: on a pre-M19 mastered-vocab profile → unchanged. After 3 correct `cloze` reviews of the A1 grammar objects → `grammar` reaches `A1` from the graded tier (not just the lesson bridge).
- Pre-M19 `progress` blob loads; `reviewState` seeded; `mastered` / `interactionLog` / `skillLevels` / `placementResult` / streak preserved; reload idempotent.
- All 13 lessons run every step; 0 console errors; flashcard `markCard` still toggles `mastered` and now also nudges the schedule.
- 320 / 375 / 390 / desktop — `#view-review` + the Review card: no overflow; dark mode themed; 0 Arabic-Indic numerals in chrome.
- `git diff`: `scheduler` + `foldInteractions` + `reviewState`/`reviewCursor` plumbing + the queue filters + `#view-review` runner + the Practice card + the `deriveLevel` source swap + `markCard` emit + the corrected `rebuildDeck` comment + scoped CSS — nothing else.

---

## 6. Regression re-tests (live browser, each end-to-end)

M6 harakāt · M7 syllables · M8 sentence-reading · M9 unvowelled · M11 grammar-intro · M12 stroke-order + `alphabet-writing-1` byte-identical + `practiceLetterWriting` · M13 audio · M14 (`CONTENT`, `migrateMastered`, 46-card deck) · M15 ("Your skills" panel) · M16 (Learn rebuild, 2 generated lessons, `objectsIntroduced`) · M17 (placement, override, no emission) · M18 (the 4 exercise renderers, `interactionLog` cap, generator wiring) · lang="ar" a11y · PWA · persistence (streak, both `*Completed` lists, mid-lesson reload → Home).

---

## 7. Out of scope — the milestone that owns it

- ❌ A full FSRS/Anki-grade scheduler, per-card fuzz, load balancing — v1 is SM-2-lite; the `scheduler` seam makes a better one a drop-in later.
- ❌ Authored review decks, the linguistic linter — **M20**.
- ❌ Any new Arabic content or new `exerciseTypes` kinds — **M18/M20**.
- ❌ Cross-device sync of `reviewState` / `interactionLog` — **M22** (both are `localStorage`, both self-heal, both bounded).
- ❌ A review-history *view* / analytics dashboard — **M24** (the UI/UX pass).
- ❌ Notifications / reminders to review — later; needs a service-worker + permissions story.
- ❌ Changing the flashcard UI or the `mastered` toggle semantics.
- ❌ Migrating the M17 placement flow to emit into `reviewState` — placement stays a diagnostic that does not emit.
- ❌ Any nav change; any redesign of Learn / Progress / Placement.

---

## 8. Open questions

1. **`reviewState`: derived-and-incrementally-cached (via `reviewCursor`) vs. a store mutated per-event?** *Recommend: cached + incremental.* Self-heals, matches how `skillLevels` works, survives the 400-event log rotation, and a from-scratch replay is still cheap when the cursor is lost.
2. **Grading: binary or 4-grade?** *Recommend: 4-grade* (`again`/`hard`/`good`/`easy`) derived from `correct` + `latencyMs`, because SM-2 needs the spread and M18 already records latency. `null` latency → `good`.
3. **Does `deriveLevel`'s graded tier switch from `mastered` to `reviewState`?** *Recommend: yes* — that's the milestone's point (every strand gets a `firm` path). The seed-from-`mastered` rule (MIG3) guarantees no regression.
4. **Ship all six status names, or a smaller set?** *Recommend: all six* as a pure derivation — the roadmap names them, and they're just labels on `(reps, lapses, ease, due)`.
5. **Review runner: new `#view-review` vs. fold into Flashcards/Practice?** *Recommend: new lightweight `#view-review`* reached from a Practice card, reusing the M18 `exerciseTypes` and the lesson-runner shell pattern. Not in the nav.
6. **Does the review runner emit `InteractionEvent`s?** *Recommend: yes* — a review answer is graded practice and must move the schedule. (Contrast: placement, which does not emit.)
7. **`mastered` seed values** — `reps 2 / ease 2.5 / status reviewed / due +4d`. *Recommend as stated;* it preserves the signal without fabricating a history. Confirm the numbers.
8. **Review gate.** *Recommend: yes* — pause after `scheduler` + `foldInteractions` + the queue filters + the `deriveLevel` swap + `content/m19-review-preview.md`, before the `#view-review` runner UI. Same checkpoint as M14–M18.

---

## 9. Rollout

1. Scope approved (this doc).
2. Branch `feature/m19-review` off `main` (already created — will carry the `ROADMAP.md` bump).
3. `scheduler.next` (SM-2-lite); `ReviewState` shape + `foldInteractions()` (seed from `mastered`, fold via `reviewCursor`); the six-state `reviewStatus()`; `mistakes()` + the four queue filters; the `deriveLevel` graded-tier source swap + `computeMasteryStats` / Word-Bank badge swap; `markCard` emits an event; correct the `rebuildDeck` comment. `loadProgress` migration. Generate `content/m19-review-preview.md`. **Pause for sign-off.**
4. `#view-review` runner (queue picker → item run via `exerciseTypes` → summary); the Practice **Review** card with live counts; scoped CSS.
5. Wire the runner's answers back through `foldInteractions()`; finalise the migration.
6. `build-content.js` + `build-audio-manifest.js` `--check`; full QA (§5, §6) — live browser trace + independent read-only audit + the seeded-RNG byte-compare for the 13 lessons + the MIG3 `deriveLevel` regression fixture.
7. Draft PR against `main` with this doc + the preview doc.
8. Merge on explicit approval — `--no-ff`, delete branch, confirm clean tree, report new HEAD, verify live.
