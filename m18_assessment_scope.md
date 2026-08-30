# M18 Scope: Assessment Framework

**Status:** Draft for review. **No implementation code written.** Do not begin implementation until this is approved.

**Parent:** [ROADMAP.md](ROADMAP.md) M18 · [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) §7 · depends on M14 (objects), M15 (`skills`), M16 (`CURRICULUM` + `generateLessonSteps`), M17 (the placement flow that will feed a fourth `deriveLevel` signal once graded events exist).

**One-line summary:** Stop treating every question as a four-option tap. Add an `exerciseTypes` registry parallel to `stepRenderers`; migrate the existing MCQ into it; add the first genuinely different item types (`match`, `cloze`, `build`, `order`) — each authored as data that references learning objects; and make **every graded interaction emit an `InteractionEvent`** into a capped local log. That log is the raw material M19's review scheduler and richer level derivation will run on.

M18 is the engine. It does **not** build the scheduler, the mistake log, or the review queues (M19), and it authors no new Arabic content.

---

## 1. Why M18 exists

Today a "graded" interaction is always `renderMCQ` — recognition, four options, one tap. That can't assess spelling, word order, agreement-in-context, or listening-to-writing, so five of the eight strands are only ever measured indirectly (M15/M17 both note the gap). And nothing that a learner answers is *recorded* per-object: `progress.mastered` is a flat set, `quizBest` is a single number. There is no per-object history for a scheduler (M19) or an honest `deriveLevel` to read.

M18 fixes exactly that layer: the registry, the new types, and the event stream. M19 consumes the stream; M20 authors real items against the engine.

---

## 2. What M18 delivers

### 2.1 `exerciseTypes` — the registry

A map parallel to `stepRenderers`:

```
exerciseTypes[kind] = {
  render(item, host, onResult),   // build the UI into `host`; call onResult({correct, response, latencyMs}) once answered
  score?(item, response),         // optional pure scorer for types with a structured response
  strands?: [skillId]             // which strands this kind can assess (for the generator + validation)
}
```

An exercise is a lesson step:

```
{ type: "exercise", exercise: { kind, objectIds: [...], prompt?, ...kindSpecificFields } }
```

`renderExerciseStep` (a new entry in `stepRenderers`) looks up `exerciseTypes[step.exercise.kind]`, renders it, and on `onResult` emits the interaction (§2.3) and unlocks the lesson's Next button — exactly the contract `practice-choice` already follows.

### 2.2 The item types

| kind | assesses | built from | in v1? |
|---|---|---|---|
| `choice` | recognition (MCQ) | any object + distractors | ✅ **migrated in** — one implementation, the 13 legacy lessons keep working |
| `match` | pairing: ar↔en, letter↔sound, word↔example | `lex:` / `let:` / `syl:` | ✅ new |
| `cloze` | a word/ending in context — grammar + vocabulary recall | `txt:` (`words[]` + `vowelled`), pick the missing word from a tile bank | ✅ new |
| `build` | spelling (`unit: "grapheme"`) and word order (`unit: "word"`) from tiles | `lex:` graphemes / `txt:` `words[]` | ✅ new — covers the roadmap's `build-word` **and** `build-sentence` |
| `order` | sequence — steps of a process, syllable blending order | `syl:` shape sequence / an authored ordered list | ✅ new |
| `dictation` | listening → writing | `lex:`/`txt:` audio + target spelling via the `build` tile UI | ⏸ **deferred** — leans on reliable audio; revisit with native audio |
| `transform` | conjugation / pluralisation / case change | needs paired forms — only `lex:.plural` and a few verb `notes` exist | ⏸ **deferred to M20** (data-thin until real content) |
| `multi-choice` | multi-answer recognition | — | ⏸ deferred — low marginal value over `choice` + `match` |
| `short-write` | composition | — | ❌ **M19** (rubric self-check territory) |
| `record` | speaking | exists (M6) | ❌ stays as-is, **ungraded**, "compare to model" |

**Every v1 item is generated from an existing object's own fields** (same rule as M16's `generateLessonSteps` and M17's `buildPlacementItems`) — no authored question file, no invented Arabic. A type with no real material for a given objective is skipped.

### 2.3 `InteractionEvent` + the log

```
InteractionEvent = { objectId, skill, itemType, correct, latencyMs, ts }   // ts = ISO string
```

- `emitInteraction(ev)` pushes to `progress.interactionLog` — an **append-only ring buffer**, capped (§8 Q5), oldest dropped first.
- **Every** graded interaction emits: the new types **and** the legacy `practice-choice` / `quiz` / `audio-exercise` steps (they route their answer callback through one shared `emitInteraction`).
- A wrong answer emits `correct: false` — that's all the "mistake log" M19 needs; M18 does not build a separate mistake structure.
- **The M17 placement flow does NOT emit** — a diagnostic is not practice, its output is `placementResult`, and letting it seed the review stream would double-count (§8 Q4).
- `latencyMs` = time from render to first answer; best-effort, `null` if not measurable.

### 2.4 `deriveLevel` — unchanged in M18

M18 only *produces* the event stream. `deriveLevel` keeps its M17 precedence (`mastery > placement > lesson-bridge > null`). Turning `interactionLog` into a real graded signal (per-object accuracy → firm levels for the other strands) is **M19**, alongside `ReviewState`. Noting this so M18 doesn't quietly widen.

### 2.5 Generator + placement wiring (light)

- `generateLessonSteps` (M16) gains the ability to emit `exercise` steps: a vocabulary lesson's practice/quiz stage can use `match`; a grammar lesson can use `cloze`; a syllable lesson can use `build`/`order`. Existing hand-written lessons are untouched; the four generated A1 lessons are re-checked.
- The M17 placement flow **keeps its own minimal MCQ** — migrating it to the registry is churn with no user-visible change; flagged as an M18-follow-up.

### 2.6 Learner-state migration

`progress` gains `interactionLog: []`. `loadProgress` adds it with a safe default; every other field (`mastered`, `skillLevels`, `placementResult`, `objectsIntroduced`, streak, …) preserved; idempotent; lossless; verified against a real pre-M18 blob (which came through the M14→M17 chain). No backfill — there is no historical per-object data to reconstruct.

### 2.7 Tooling + docs

- `tools/build-content.js` — no new output. Validation: for each `exerciseTypes` kind, at least one object can produce a valid item (a coverage check like M17's band check); every kind's declared `strands` are real skill ids.
- `content/m18-assessment-review.md` — generated: each type's rendered contract, a real generated example item per type (with its correct answer), the `InteractionEvent` shape, and which strands each type can now reach — for sign-off before the generator is wired broadly.
- This scope doc; a "What shipped" note on merge; `ROADMAP.md` M17/M18 rows + `CURRICULUM_ARCHITECTURE.md` §7 annotated.

---

## 3. Invariants — what M18 must NOT change

| # | Invariant |
|---|---|
| I1 | All 13 runnable lessons (11 catalog + 2 generated) and every M6–M17 behaviour run identically. `stepRenderers`, the 9 existing step renderers, the lesson runner, and `generateLessonSteps`' output for the current 4 generated lessons are unchanged except the documented additive event emission. |
| I2 | `renderMCQ`'s external signature (`container, cfg, onDone`) is unchanged — every current caller (legacy steps, M17 placement) keeps working. Internally it may become `exerciseTypes.choice`'s renderer; that is the only permitted refactor. |
| I3 | The M13 audio layer, M14 `CONTENT`, M15 taxonomy, M16 `CURRICULUM`, and M17 `placementResult` + `deriveLevel` precedence are untouched. `deriveLevel` gains no new signal in M18. |
| I4 | `HARAKAT` == 3; `strokeOrderData`, `RECORDED_AUDIO_MANIFEST` byte-identical; both build tools `--check` green; the M12 `trace-letter` / stroke-order flow is untouched (formalising its scoring is out of scope). |
| I5 | Flashcards / Quiz / Word Bank / Alphabet / Practice / Learn / Progress / Placement behave as after M17. New CSS is scoped to the exercise renderers, token-based, listed in the PR. |
| I6 | No runtime dependency, no runtime fetch; `index.html` stays one self-contained file. |
| I7 | Western digits in UI chrome; Arabic-Indic only inside tested content. |
| I8 | **No new Arabic content.** Every item is built from an existing object's fields. No new lexemes, sentences, grammar copy, or authored questions. |
| I9 | Speaking and free composition remain **never machine-scored** — no `record` grading, no `short-write` grading is added. |

---

## 4. Migration requirements

| # | |
|---|---|
| MIG1 | `progress.interactionLog` added as `[]`; every other field preserved; idempotent; lossless; tested against a real pre-M18 blob. |
| MIG2 | The log is a ring buffer — once at the cap, a new event drops the oldest; two reloads with the same activity produce the same tail. |
| MIG3 | Legacy `quiz` / `practice-choice` / `audio-exercise` answers emit events with a best-effort `objectId` (resolved from the step's referenced object where one exists; `null` where the legacy step has no object ref — those events still record `skill`/`correct` for M19's aggregate signal). |
| MIG4 | `build-content.js --check` + `build-audio-manifest.js --check` green; two runs byte-identical. |
| MIG5 | Reversible — reverting the merge restores exact post-M17 behaviour (`exerciseTypes`, `renderExerciseStep`, `emitInteraction`, `interactionLog`, and the new renderers are all new or additive; the `renderMCQ` refactor is behaviour-preserving). |

---

## 5. Acceptance criteria

- `exerciseTypes` has `choice`, `match`, `cloze`, `build`, `order`. Each `render(item, host, onResult)` builds a working UI and calls `onResult` exactly once per attempt.
- A generated lesson containing one of each new type runs **every step end to end, 0 console errors**; every Arabic string in it traces to an existing object.
- Answering any graded item — new or legacy — appends an `InteractionEvent` with the right `{objectId, skill, itemType, correct, latencyMs, ts}`; `itemType` distinguishes the kinds; `progress.interactionLog` never exceeds the cap.
- `match`: pairs shuffle, a correct pairing marks complete, a wrong pairing is recoverable; emits one event per pair (or one summary event — §8 Q3).
- `cloze`: the sentence renders with a gap, the tile bank has the answer + plausible distractors from the same text set / same-level objects, correct fills the gap.
- `build` (`unit: "grapheme"` and `unit: "word"`): tiles shuffle, the learner assembles, submit scores exact-match; partial credit is out of scope (right/wrong only).
- `order`: shuffled sequence, drag or tap-to-place, submit scores exact order.
- Placement (M17) still runs and still does **not** emit interactions.
- Pre-M18 `progress` blob loads; `interactionLog: []` added; `mastered` / `skillLevels` / `placementResult` / `objectsIntroduced` / streak / `quizBest` all preserved; reload idempotent.
- All 13 existing lessons run every step; 0 console errors (live trace); the 2 generated lessons unchanged unless the generator opts them into a new type (documented).
- 320 / 375 / 390 / desktop — no overflow (tile grids wrap / scroll in their own container); dark mode themed; 0 Arabic-Indic numerals in UI chrome.
- `git diff`: `exerciseTypes` + `renderExerciseStep` + the 4 new renderers + `emitInteraction` + `interactionLog` plumbing + the `renderMCQ` refactor + scoped CSS + `build-content.js` coverage check — nothing else.

---

## 6. Regression re-tests (live browser, each end-to-end)

M6 harakāt · M7 syllables · M8 sentence-reading · M9 unvowelled · M11 grammar-intro · M12 stroke-order + `alphabet-writing-1` byte-identical + `practiceLetterWriting` · M13 audio (flag off, 0 `Audio()`) · M14 (`CONTENT`, `migrateMastered`, 46-card deck) · M15 ("Your skills" panel, `deriveLevel` honest) · M16 (Learn rebuild, 2 generated lessons, `objectsIntroduced`) · M17 (placement flow, override, `placementResult`, no interaction emission) · lang="ar" a11y · PWA (shell+fonts) · persistence (streak, both `*Completed` lists, mid-lesson reload → Home).

---

## 7. Out of scope — the milestone that owns it

- ❌ `ReviewState`, the SM-2-lite scheduler, `dueDate`, review queues, the mistake log as a queryable structure, the `learned → practised → weak → …` state machine — **M19**. M18 emits raw events only.
- ❌ Turning `interactionLog` into a `deriveLevel` signal (per-object accuracy → firm levels for reading/grammar/listening/etc.) — **M19**.
- ❌ Authored item banks (`content/exercises/*.json`), the linguistic linter — **M20**.
- ❌ `dictation`, `transform`, `multi-choice`, `short-write` — deferred (see §2.2).
- ❌ Formalising `trace-letter` / stroke-order scoring — later; M12's flow is untouched.
- ❌ Migrating the M17 placement flow onto the registry — M18-follow-up.
- ❌ Any change to `deriveLevel`, the Learn view, the Progress view, or the nav.
- ❌ New Arabic content of any kind.
- ❌ IndexedDB / accounts / cross-device sync of the log — **M22** (`interactionLog` is `localStorage` for now, capped so it fits).

---

## 8. Open questions

1. **How many new types in v1?** *Recommend:* four — `choice` (migrated) + `match`, `cloze`, `build` (grapheme **and** word), `order`. That covers `build-word` + `build-sentence` + `order` from the roadmap list; `dictation` / `transform` / `multi-choice` / `short-write` deferred with the rationale in §2.2. Confirm, or cut/add.
2. **`renderMCQ` migration depth.** *Recommend:* `renderMCQ` stays the DOM builder (signature frozen) and gains a single `emitInteraction` call in its answer handler; `exerciseTypes.choice.render` is a thin wrapper over it. One event path, minimal churn, no risk to the 13 lessons. The alternative (fully re-home MCQ inside the registry) is more "correct" but riskier — flag if you want it.
3. **`match` / `order` — one event or one per pair?** *Recommend:* one **summary** event per item (`correct` = whole thing right first try), plus — since M19 wants per-object signal — one event per constituent object with its own correct/incorrect. So a 4-pair `match` emits 4 events. Confirm the per-object granularity is wanted now (it's cheap and M19 needs it).
4. **Does placement emit events?** *Recommend: no.* Placement's output is `placementResult`; emitting would double-count a diagnostic as practice and pollute M19's scheduler. Confirm.
5. **`interactionLog` cap.** *Recommend:* 400 events (~40–80 KB JSON), ring buffer. Enough for M19 to compute recent per-object accuracy; small enough for `localStorage` and a future sync. Tunable constant.
6. **Generator wiring in M18.** *Recommend:* light — the four generated A1 lessons may each gain one new-type exercise where their objectives support it (vocabulary → `match`, etc.), proven in QA; broad generator use lands with M20 content. Confirm.
7. **Review gate.** *Recommend: yes* — pause after the registry + `emitInteraction` + the 4 renderers + one sample generated lesson + `content/m18-assessment-review.md`, for sign-off, before wiring the generator and re-checking all 13 lessons. Same checkpoint as M14–M17.

---

## 9. Rollout

1. Scope approved (this doc).
2. Branch `feature/m18-assessment` off `main` (already created — will carry the `ROADMAP.md` status bump).
3. `exerciseTypes` registry + `renderExerciseStep`; `InteractionEvent` + `emitInteraction` + `progress.interactionLog` (+ migration); `choice` migrated in + legacy steps emit; the four new renderers (`match`, `cloze`, `build`, `order`), each generated from objects; `build-content.js` coverage check. Generate `content/m18-assessment-review.md` with a sample lesson. **Pause for sign-off.**
4. Wire `generateLessonSteps` to use the new types where objectives support them; re-check the 4 generated lessons.
5. `loadProgress` migration finalised; scoped CSS; the `renderMCQ` event path.
6. `build-content.js` + `build-audio-manifest.js` `--check`; full QA (§5, §6) — live browser trace + independent read-only audit + the seeded-RNG byte-compare for the 13 lessons.
7. Draft PR against `main` with this doc + the review doc.
8. Merge on explicit approval — `--no-ff`, delete branch, confirm clean tree, report new HEAD, verify live.
