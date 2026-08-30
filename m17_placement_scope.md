# M17 Scope: Placement / Diagnostic

**Status:** Draft for review. **No implementation code written.** Do not begin implementation until this is approved.

**Parent:** [ROADMAP.md](ROADMAP.md) M17 · [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) §9 · depends on M15 (`deriveLevel`, `SKILLS`, `LEVELS`, the 56 descriptors) and M16 (`CURRICULUM`, `deriveLevel`'s coverage model, the "take a placement check" stubs).

**One-line summary:** Let a learner who isn't a beginner find their level. A short, honest, per-strand diagnostic — adaptive-lite multiple choice for the strands we can actually measure, an explicit self-rating against the M15 descriptors for the ones we can't — that outputs a recommended entry level per strand with a confidence flag and a plain-language reason, **every one of which the learner can override**. The result seeds `deriveLevel` (`source: "placement"`) and real evidence later overtakes it. Reached from the Learn banner and the Progress panel; no new nav item, no new exercise engine.

This is what makes the app usable by the ~half of prospective learners who already know *some* Arabic and would otherwise bounce off "start at the alphabet."

---

## 1. Why M17 exists

M16 built the ladder and the "start where you fit" banner — but for anyone without completed lessons or mastered words, that banner just says *"New to Arabic? Start at the alphabet."* There is no way to tell the app "I can already read, I just need grammar," and `progress.placementResult` (reserved since M15) is still `null` everywhere. M17 fills exactly that: the diagnostic flow, its result, and the wiring of that result into `deriveLevel` and the Learn view. It does **not** build the richer item types (M18), the review/mistake store (M19), or any new teaching content (M20).

---

## 2. What M17 delivers

### 2.1 The diagnostic flow — one new view

A self-contained `#view-placement` (hidden; **not** in the main nav — reached by button from the Learn banner, the Progress "Your skills" panel, and a Home prompt for a fresh profile). Three phases:

**a. Pick what to check.** A short intro screen: *"How much Arabic do you already know?"* with
- **"I'm new"** → skip the diagnostic, go straight to the alphabet (records nothing).
- **"Check my level"** → choose strands. Default selection = the three load-bearing strands (**reading, vocabulary, grammar**); **listening**, **comprehension**, and **pronunciation** are opt-in checkboxes; **writing** and **speaking** are always shown as *self-rated* (§2.3). "Just the essentials" preselects the three; "Everything" selects all.

**b. The items.** For each selected measurable strand, an **adaptive-lite** run:
- Item bank is **generated from the existing M14 objects** (same principle as M16's lesson generator — no new item engine, no authored question file). Each item is a `renderMCQ` config or an `audio-exercise` question, bucketed by the object's `level`.
- Start at the **A1/A2 boundary**. Ask 2 items at the current band; ≥ both right → step up a band, ≤ one right → step down; stop after 8–12 items or when the band is stable. Converge on a level.
- Because current content only reaches ~A2 (M16), the diagnostic distinguishes **A0 / A1 / A2 / "A2+"**. A learner who clears every A2 item is placed *"A2 or above — we'll refine this as you learn"* (honest: there's no B1+ content to test against yet).
- Item shapes, all on existing primitives:
  | strand | item | built from |
  |---|---|---|
  | vocabulary | "What does **[word]** mean?" MCQ | `lex:*` + same-topic distractors |
  | reading | "How is **[vowelled word/syllable]** read?" → pick transliteration; and a 1-question read-and-answer on a `txt:` | `syl:*`, `lex:*`, `txt:*` |
  | grammar | pick the correct form / finish the sentence (MCQ) | `gr:*` + `txt:gram-*` |
  | listening | hear it → choose the meaning (`audio-exercise`, `listen-choose-meaning`) | `lex:*` via `playArabicAudio` (TTS) |
  | comprehension | 1–2 questions on a short `txt:` (gist / detail) | `txt:*` |
  | pronunciation | **recognition only** — "which word did you hear?" / emphatic-vs-plain minimal choice | `lex:*`, letter pairs; **production is never scored** |

**c. Results.** One screen, one row per checked strand:
- recommended **level** + **confidence** (`provisional` for measured, `self-rated` for self-report) + a one-line **reason** (*"you read A1 words and the A2 syllables accurately"*).
- the matching **M15 descriptor** `canDo` text, so the learner sees what that level means.
- an **override control** (a small level stepper / select) — *"That's not right? Set it yourself."* Overriding flips confidence to `self-set`.
- a headline line: *"A good place to start is **[unit]**"* + **"Start learning →"** (jumps to that unit in the Learn view).

### 2.2 `deriveLevel` — the third signal

`deriveLevel` gains a **placement** tier between mastery and the lesson bridge:

```
1. mastered coverage        → firm (reliable strand, ≥ EVIDENCE_MIN) or provisional
2. placement result         → provisional  (or "self-set" if the learner overrode)   ← M17
3. introduced coverage       → provisional (capped at A1)
4. none                     → { level: null, reason: "insufficient evidence" }
```

- Mastery **always** overtakes placement (real graded evidence wins — arch §9).
- Placement overtakes the lesson bridge (a deliberate check beats "clicked through a lesson").
- Placement never yields `firm`.
- A self-report strand (speaking) with a self-rating returns `{ level, confidence: "self-set", reason: "you rated yourself" }` — still never a machine level.

`deriveHeadlineLevel` and `renderSkillsPanel` are unchanged in logic; they just start seeing non-null placement levels. The "take a placement check" stub text in `placementSuggestion()` and the skills panel becomes a real button.

### 2.3 Honest strands — writing & speaking

- **writing**: 2–3 machine-checkable items (spot the misspelling; which spelling is right) **plus** a self-rating: the learner reads the A1 / A2 / B1 writing `canDo` descriptors and picks the one that fits. Stored `confidence: "self-rated"`, labelled *"self-assessed"* everywhere it shows.
- **speaking**: **no items.** A single self-rating card against the speaking descriptors, with the standing note that speaking is never machine-scored. Stored `confidence: "self-rated"`.

### 2.4 Learner state

`progress.placementResult` goes from `null` to:

```
{
  [skillId]: {
    level,                       // "A0".."A2" | "A2+" (never a fabricated higher level)
    confidence: "provisional"    // measured
              | "self-rated"     // writing/speaking self-assessment
              | "self-set",      // learner overrode
    reason,                      // plain-language, shown in the panel
    takenAt                      // ISO date, for "re-check" and staleness later
  }
}
```

- `loadProgress` migration: `placementResult` stays `null` for a fresh/pre-M17 profile; once any strand is placed it becomes the object above. Additive; every other field untouched; idempotent; verified against a real pre-M17 blob.
- Re-takeable **per strand** (a "re-check" link per row in the skills panel and on the results screen). Re-checking replaces that strand's entry.
- No `InteractionEvent` / mistake logging yet — placement answers feed `placementResult` only (that store is M19).

### 2.5 Item generation

- `tools/build-content.js` gains **no new output** — items are generated at runtime from `CONTENT` objects, like M16's `generateLessonSteps`. A `buildPlacementItems(skillId, band)` helper.
- Validation added: `build-content.js` checks that **every measurable strand has ≥ N objects at A0, A1 and A2** so the diagnostic can actually form bands (fails loudly if a strand can't be tested — surfaces the content gap rather than shipping a broken check).
- No `content/placement.json`. If authored items are ever wanted (they will be, for grammar especially), that's a later refinement with the M20 pipeline.

### 2.6 Tooling + docs

- `content/m17-placement-review.md` — generated: the item bank each strand produces (every generated item, its correct answer, its level band), the adaptive parameters, and the `deriveLevel` precedence table — for sign-off before the flow UI is built.
- This scope doc; a "What shipped" note on merge; `ROADMAP.md` M16/M17 rows + Position line updated; `CURRICULUM_ARCHITECTURE.md` §9 annotated.

---

## 3. Invariants — what M17 must NOT change

| # | Invariant |
|---|---|
| I1 | All 13 runnable lessons (11 catalog + 2 generated) and every M6–M16 behaviour run identically. The lesson runner, `stepRenderers`, `renderMCQ`, `renderAudioExerciseStep`, and `generateLessonSteps` are **reused, not modified** (M17 calls `renderMCQ` / `buildAudioControl`; it does not edit them). |
| I2 | The M13 audio layer, M14 `CONTENT`, M15 taxonomy + descriptors, and M16 `CURRICULUM` are untouched. `deriveLevel` gains one tier; its honest contract (no fabricated level, no machine level for writing/speaking, `firm` only from mastery on a reliable strand) is preserved and extended. |
| I3 | `HARAKAT` == 3; `strokeOrderData`, `RECORDED_AUDIO_MANIFEST` byte-identical; both build tools `--check` green. |
| I4 | Flashcards / Quiz / Word Bank / Alphabet / Practice / the Learn view / the Progress "Your skills" panel behave as after M16. M17 only *adds* the placement entry buttons and starts populating `placementResult`. |
| I5 | No new main-nav item. New CSS is scoped to `#view-placement` (and the two small entry buttons), token-based, listed in the PR. |
| I6 | No runtime dependency, no runtime fetch; `index.html` stays one self-contained file. Placement items are generated in-page from `CONTENT`. |
| I7 | Western digits in UI chrome; Arabic-Indic only inside taught/tested content (the Arabic words shown in items). |
| I8 | **No new Arabic content.** Every placement item is built from an existing object's own fields. No new lexemes, sentences, or grammar copy. |
| I9 | Placement **never** produces a `firm` level, never a level above what the content can test (`A2+` is the ceiling label), and never a machine score for writing production or speaking. |

---

## 4. Migration requirements

| # | |
|---|---|
| MIG1 | `progress.placementResult`: `null` for fresh/pre-M17; becomes the §2.4 object once a strand is placed. Additive, idempotent, lossless; every other field preserved; tested against a real pre-M17 blob (which itself came through the M14→M15→M16 chain). |
| MIG2 | `deriveLevel` with a populated `placementResult` returns the placement tier only when no mastery evidence exists for that strand; a later `mastered` entry silently overtakes it (verified: place vocabulary at A2, then master A0 words → still A2 from placement until A1 coverage flips it). |
| MIG3 | `refreshSkillLevels` re-runs after a placement completes and after an override, so `progress.skillLevels` and the panel stay current. |
| MIG4 | `build-content.js --check` + `build-audio-manifest.js --check` green; two runs byte-identical. |
| MIG5 | Reversible — reverting the merge restores exact post-M16 behaviour (`#view-placement`, `buildPlacementItems`, the `deriveLevel` tier, and the entry buttons are all new or additive; `placementResult` simply stops being written). |

---

## 5. Acceptance criteria

- From a fresh profile: Learn banner and skills panel show a working **"Take a placement check"** button; "I'm new" exits to the alphabet writing nothing.
- Running the check for reading / vocabulary / grammar: 8–12 items each, adaptive stepping observed, converges; results screen shows level + confidence + reason + descriptor + a working override; "Start learning" jumps to the recommended unit.
- A strong run (all A2 items correct) → **"A2 or above"**, never a fabricated B1/B2.
- listening / comprehension / pronunciation opt-in runs work on the `audio-exercise` / MCQ primitives; pronunciation shows *"recognition only — speaking practice is elsewhere."*
- writing → a few items + self-rating; speaking → self-rating only, both labelled self-assessed; stored `confidence: "self-rated"`.
- After placement, `deriveLevel` reflects the result; mastering ≥ 12 A0 vocabulary items then overtakes the vocabulary placement.
- Override a strand → confidence becomes `self-set`, panel + headline update, persists across reload.
- Re-check a single strand → only that strand's entry changes.
- `deriveLevel` precedence verified by fixture: mastery-firm > mastery-prov > placement > introduced > null.
- Pre-M17 `progress` blob loads; `placementResult` still `null`; every field preserved; reload idempotent.
- All 13 lessons run every step; 0 console errors (live trace).
- 320 / 375 / 390 / desktop — `#view-placement` no overflow; dark mode themed; 0 Arabic-Indic numerals in UI chrome.
- `git diff`: new `#view-placement` HTML + scoped CSS, `buildPlacementItems` + the placement controller, the `deriveLevel` tier, `placementResult` writes, the entry buttons, `build-content.js` band-coverage check — nothing else.

---

## 6. Regression re-tests (live browser, each end-to-end)

M6 harakāt · M7 syllables · M8 sentence-reading · M9 unvowelled · M11 grammar-intro · M12 stroke-order + `alphabet-writing-1` byte-identical + `practiceLetterWriting` · M13 audio (flag off, 0 `Audio()`) · M14 (`CONTENT`, `migrateMastered`, 46-card deck) · M15 ("Your skills" panel, `deriveLevel` honest) · M16 (Learn view rebuild, 2 generated lessons, `objectsIntroduced` migration, "start where you fit") · lang="ar" a11y (still on flashcards / letter tiles / MCQ Arabic options) · PWA (shell+fonts) · persistence (streak, both `*Completed` lists, mid-lesson reload → Home).

---

## 7. Out of scope — the milestone that owns it

- ❌ `exerciseTypes` registry, `match` / `cloze` / `build-word` / etc. — **M18**. M17 uses `renderMCQ` + `audio-exercise` only.
- ❌ `InteractionEvent`, `ReviewState`, mistake log, SRS — **M19**. Placement answers feed `placementResult` only.
- ❌ Authored item banks (`content/placement.json`), a linguistic linter — **M20**. M17 generates items from objects.
- ❌ Any B1–C2 placement precision — needs content that doesn't exist yet; `A2+` is the honest ceiling.
- ❌ New teaching content of any kind.
- ❌ A main-nav entry, a redesign of the Learn or Progress views (only the entry buttons are added).
- ❌ Real native audio for listening/pronunciation items — TTS via existing `playArabicAudio`.
- ❌ Adaptive *item selection* beyond the simple band step-up/step-down (no IRT, no ML).
- ❌ Timed tests, scoring percentages, pass/fail framing.
- ❌ Accounts / cross-device placement history — **M22**.

---

## 8. Open questions

1. **Which strands get the adaptive MCQ flow in v1?** *Recommend:* reading, vocabulary, grammar as the default trio; listening, comprehension, pronunciation as opt-in; writing = few items + self-rate; speaking = self-rate only. Confirm, or narrow v1 to just the trio + self-rate for the rest.
2. **Item source — generate from objects, or author `content/placement.json`?** *Recommend: generate* (consistent with M16, no new authored artefact, unblocks now). Grammar items are the weakest generated (only 3 `gr:*` + 5 `txt:gram-*`) — accept a thin grammar check in v1, richer authored items in M20.
3. **Adaptive parameters.** *Recommend:* start at the A1/A2 boundary, 2 items per band, step up on 2/2, down on 0–1/2, hard stop at 12 items per strand, floor A0 / ceiling label "A2+". Tunable constants.
4. **Dedicated `#view-placement` vs. extending the lesson runner.** *Recommend: dedicated view* — the flow is adaptive (branching) and ends in a bespoke results+override screen; bending the linear lesson runner to do this is riskier than a small self-contained controller that reuses `renderMCQ`.
5. **`deriveLevel` precedence: does placement beat the M16 introduced-coverage bridge?** *Recommend: yes* — a deliberate diagnostic is stronger evidence than lesson completion. Mastery still beats both.
6. **Entry points.** *Recommend:* Learn banner button + a per-strand "check / re-check" link in the Progress "Your skills" panel + a one-time Home prompt for a profile with no lessons and no placement. **No nav item.** Confirm.
7. **Re-take granularity.** *Recommend: per strand.* The results screen and the skills panel each expose a per-strand re-check; there's no "retake everything" button (just re-check each).
8. **Review gate before the flow UI.** *Recommend: yes* — pause after `buildPlacementItems` + the `deriveLevel` tier + `content/m17-placement-review.md` are drafted, for sign-off, before `#view-placement` and the results/override screen are built. Same checkpoint as M14–M16.

---

## 9. Rollout

1. Scope approved (this doc).
2. Branch `feature/m17-placement` off `main` (already created — will carry the `ROADMAP.md` status bump).
3. `buildPlacementItems(skillId, band)` + the adaptive controller logic (pure, no UI); the `deriveLevel` placement tier; `build-content.js` band-coverage check. Generate `content/m17-placement-review.md`. **Pause for sign-off.**
4. `#view-placement` — intro / item run / results+override screens; the three entry buttons; scoped CSS.
5. `loadProgress` handling of `placementResult`; `refreshSkillLevels` hooks on complete + override; wire "Start learning →" to the Learn view.
6. `build-content.js` + `build-audio-manifest.js` `--check`; full QA (§5, §6) — live browser trace + independent read-only audit + the seeded-RNG byte-compare for the 13 existing lessons.
7. Draft PR against `main` with this doc + the review doc.
8. Merge on explicit approval — `--no-ff`, delete branch, confirm clean tree, report new HEAD, verify live.
