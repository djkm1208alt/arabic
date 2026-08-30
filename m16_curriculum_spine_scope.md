# M16 Scope: Curriculum Spine

**Status:** Draft for review. **No implementation code written.** Do not begin implementation until this is approved.

**Parent:** [ROADMAP.md](ROADMAP.md) M16 · [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) §6, §10, §14 step 4.

**One-line summary:** Turn the placeholder Learn view into a real curriculum. Author the `levels → units → lessons` tree as data, wired to the M14 learning objects and M15 levels; give every lesson an `objectives` list (the objects it teaches); build a v1 of the 7-stage lesson generator so a lesson can be authored as *objectives* rather than a hand-typed wall of steps; rebuild the Learn view so a learner sees the whole A0→C2 ladder and is pointed at where they fit — without ever being locked out of the rest.

This is the milestone where the app stops being "5 lessons plus some practice activities" and becomes a course with a shape.

---

## 1. Why M16 exists

M15 gave every object *coordinates* (a strand, a level, prereqs) and `deriveLevel` a way to read them. But the Learn view still renders a hand-written `curriculum` object with **one** real unit (`a0-u1`, five lessons) and five greyed-out "Coming soon" level cards. There is:

- no unit structure below the level,
- no link from a lesson to the objects it is responsible for (`deriveLevel`'s lesson bridge is a hand-maintained `LESSON_LEVEL_FLOOR` map of 11 entries),
- no way to author a lesson except by hand-typing every step,
- no "you're around A1, start here" — the learner just sees A0 is "Available now" and everything else is locked.

M16 fixes exactly that layer: the tree, the lesson↔object wiring, the generator, and the Learn-view rebuild. It does **not** build placement (M17), assessment types (M18), the review store (M19), or any actual A1+ teaching content (M20+).

---

## 2. What M16 delivers

### 2.1 `content/curriculum.json` — the real tree (data)

Authored as JSON, compiled into a `CURRICULUM` block in `index.html` by `tools/build-content.js` (same pattern as M14's `CONTENT` and M15's taxonomy). Replaces the inline `const curriculum = {…}` façade.

```
levels:  [ { id, order, status } ]              // id ∈ LEVELS (A0…C2); status: "available" | "planned"
units:   [ { id, level, order, title, blurb, skills:[], status } ]
lessons: [ { id, unitId, order, title, blurb,
             level, skills:[],
             objectives: ObjectId[],            // the M14 objects this lesson is responsible for
             status:  "available" | "preview" | "planned",
             source:  "steps:<lessonId>"        // hand-written steps in the `lessons` catalog (the 11 existing)
                    | "view:alphabet" | "view:vocabulary"
                    | "generate" } ]            // steps built by the 7-stage generator from `objectives`
```

- **A0** — the current unit `a0-u1` is preserved as-is (its 5 lessons keep ids `l1`–`l5`, keep their targets), and is joined by the other A0 practice activities (`reading-foundations`, `pronunciation-foundations`, `listening-foundations`, `syllables-intro`, `stroke-order-writing`, `alphabet-writing-1`) which today live only in the `PRACTICE_LESSONS` array — M16 gives them a home in the tree as A0 lessons.
- **A1** — authored as real unit + lesson **nodes** with `objectives` and `status: "preview"` or `"planned"`, targeting `"generate"`. The *steps* (real teaching content) are M20; M16 ships the scaffold and 1–2 fully-generated proof lessons (§2.3).
- **A2 → C2** — **unit-level stubs only**, one per major thread from CURRICULUM_ARCHITECTURE.md §10 (grammar spine, morphology ladder, topic threads, the reading/listening/writing/speaking ladders, the numbers area). Each stub carries `title`, `level`, `skills`, a `blurb`, and `status: "planned"`. No lesson nodes below A1. This is the *map* the roadmap asks M16 to place — not content.

### 2.2 Lesson `objectives` — the lesson↔object wiring

Every lesson node **and** every entry in the existing `lessons` catalog gains `objectives: ObjectId[]` — the M14 object ids it teaches (letters, marks, syllables, grammar points, texts, lexemes).

- The 11 existing lessons get `objectives` filled by hand (checked, small): e.g. `harakat-intro` → the 11 `mrk:*` objects; `syllables-1` → the CVV/CVC/gem `syl:*` it covers; `grammar-intro` → `gr:gender-agreement`, `gr:present-tense`, `gr:sun-moon`.
- Completing a lesson adds its `objectives` to a new `progress.objectsIntroduced` set — **introduced, not mastered** (§2.5).
- This **replaces `LESSON_LEVEL_FLOOR`**: `deriveLevel`'s bridge becomes real per-object coverage (§2.5) instead of a hand-maintained 11-row table.

### 2.3 The 7-stage lesson generator — v1

`generateLessonSteps(objectives, opts) → Step[]`, emitting the Master-Standards pedagogical arc:

| stage | step type used (all existing) | source |
|---|---|---|
| 1 Concept | `explain` | object `labels` / `notes` |
| 2 Visual | `example-set` / `reading-practice` | real examples found in objects that reference the target (the existing `findVocabExamples` / `findHarakaExamples` helpers, generalised) |
| 3 Explanation | `explain` | object `notes`, grammar `explanation` |
| 4 Pronunciation | `example-set` with audio | the object's `audio` key → `playArabicAudio` (M13 path, unchanged) |
| 5 Practice | `reading-practice` / `listen-repeat` | generated from examples |
| 6 Quiz | `choice` (the existing MCQ step) | distractors drawn from same-strand, same-level objects |
| 7 Application | `reading-practice` on a `txt:` object, or a short recap | a `TEXTS` object whose `prereqs`/`objectives` intersect |

- **Existing step types only.** No new step renderer. The richer item types (`match`, `cloze`, `build-word`…) are M18 and slot into stages 5–6 later.
- **Never invents Arabic.** Every example is pulled from an existing object; if a stage has no real material, it is **skipped**, not filled.
- Proven in M16 by authoring **1–2 real A1 lessons** entirely as `objectives` + `source: "generate"` and running them end-to-end. The 11 existing lessons keep their hand-written `steps` and are **not** regenerated.

### 2.4 Learn view — rebuild

The Learn view (`#view-learn`, `renderLearn()`) is rebuilt to render `CURRICULUM`:

- **Ladder** — all 7 levels A0→C2, each showing its units; `status: "planned"` levels/units are visible but clearly marked "In development" (not a hard "locked" — honesty over gamified scarcity).
- **"Start where you fit"** — a banner using `deriveHeadlineLevel()` / `deriveLevel`: *"Your reading and vocabulary are around A1 — a good place to start is [unit]."* When there's not enough evidence: *"New here? Start at the beginning"* / *"Already know some Arabic? [Take a placement check]"* (the check is M17 — until then the link points at a "browse by level" jump).
- **No forced gating.** Every unit is openable. A lesson whose `prereqs` aren't met shows a soft *"builds on: [x, y]"* hint, not a lock.
- **Progress reflected** — each unit shows *n / m lessons done* and *k objectives introduced*, from `progress`.
- Reuses the existing `.level-card` / `.unit-block` / `.lesson-item` / `.badge` markup and CSS tokens wherever possible. **New CSS is permitted here** (this is a "view rebuild" per the roadmap) but kept minimal, scoped to the Learn view, token-based, and listed in the PR. No other view gets new CSS.

### 2.5 `deriveLevel` upgrade — real coverage, still honest

The M15 `LESSON_LEVEL_FLOOR` bridge is removed. In its place:

```
// signal 1 (unchanged): mastery coverage from progress.mastered
// signal 2 (new): "introduced" coverage from progress.objectsIntroduced
//   — a level L is provisionally reached when ≥ THRESHOLD of the strand's
//     objects at L have been INTRODUCED by a completed lesson.
//   Introduced evidence is always "provisional" — never "firm".
```

- `objectsIntroduced` is strictly weaker evidence than `mastered`: it can yield a **provisional** level, never a firm one, and mastery always wins where both exist.
- The honest contract is unchanged: `assess: self-report` → always `null`; `assess: partial` → provisional at most; no evidence → `{ level: null, reason: "insufficient evidence" }`. Never a fabricated number.
- `LESSON_LEVEL_FLOOR` deleted; the M15 tests that referenced it are updated to the coverage model.

### 2.6 Learner-state migration

`progress` gains:
- `objectsIntroduced` — `string[]` of object ids introduced by completed lessons.

`loadProgress` migration **backfills** it: for every id in `lessonsCompleted` ∪ `practiceLessonsCompleted`, look up that lesson's `objectives` and union them in. Idempotent, lossless; every existing field (`mastered`, `skillLevels`, `streak`, both `*Completed` lists, `placementResult`, …) untouched. Verified against a real pre-M16 blob, same discipline as `migrateMastered` (M14) and the M15 migration.

`curriculum` lesson ids `l1`–`l5` are **kept stable** so `lessonsCompleted` needs no remap; any id that does change ships an entry in a small `_curriculum-id-map.json` and the migration applies it.

### 2.7 Tooling + docs

- `tools/build-content.js` — loads + validates `content/curriculum.json`: unique ids; every `unit.level` and `lesson.level` ∈ `LEVELS`; every `lesson.objectives` id resolves to a real object; every `lesson.level` is ≥ the max level of its objectives (a lesson can't be A1 while teaching a B1 object); `source` well-formed; `source: "steps:<id>"` resolves to a real entry in the `lessons` catalog. Compiles the `CURRICULUM` block.
- `content/m16-curriculum-review.md` — generated: the full tree, every lesson with its `objectives` resolved to labels, the A2–C2 stub map, and the `deriveLevel` coverage preview — for your sign-off before the Learn view is wired (§8 gate).
- This scope doc; a "What shipped" note on merge; `ROADMAP.md` M16 row and `CURRICULUM_ARCHITECTURE.md` §6 / §14 step 4 annotated.

---

## 3. Invariants — what M16 must NOT change

| # | Invariant |
|---|---|
| I1 | All 11 existing lessons (M6–M13) run **identically** — their hand-written `steps` arrays are untouched; the generator is only used for new lessons. The step engine, `stepRenderers`, and every `build*Step` helper are unchanged. |
| I2 | The M13 audio layer, the M14 `CONTENT` / adapter model, and the M15 `SKILLS` / `LEVELS` / `DESCRIPTORS` / `deriveLevel` contract are untouched except the one documented `deriveLevel` bridge swap (§2.5), which preserves the honest semantics. |
| I3 | `HARAKAT` == 3; `strokeOrderData` unchanged; `RECORDED_AUDIO_MANIFEST` byte-identical; `build-audio-manifest.js --check` green. |
| I4 | Flashcards / Quiz / Word Bank / Alphabet / Practice / Progress behave exactly as after M15. `progress.mastered` and `progress.skillLevels` values are only *read* by M16. |
| I5 | New CSS is confined to the Learn view, token-based, and enumerated in the PR. No other view, nav, or route changes. The Progress "Your skills" panel is untouched. |
| I6 | No runtime dependency, no runtime fetch; shipped `index.html` stays one self-contained file. `CURRICULUM` is compiled in at dev time. |
| I7 | Western digits in UI chrome; Arabic-Indic only in taught content (M16 adds none). |
| I8 | `deriveLevel` never returns a fabricated level; `objectsIntroduced` evidence is provisional-only; writing/speaking never get a machine level. |
| I9 | No new Arabic content beyond `objectives` wiring and curriculum `title`/`blurb` copy (English). The 1–2 proof A1 lessons use **only** examples already present in existing objects. |

---

## 4. Migration requirements

| # | |
|---|---|
| MIG1 | `progress` gains `objectsIntroduced` (backfilled from completed lessons via the objectives map); every other field preserved; idempotent; lossless; tested against a real pre-M16 blob. |
| MIG2 | `curriculum` lesson ids `l1`–`l5` stable; any changed id covered by `_curriculum-id-map.json` + applied in `loadProgress`; `lessonsCompleted` / `practiceLessonsCompleted` values still resolve after migration. |
| MIG3 | `build-content.js --check` green after `content/curriculum.json` is added; two runs byte-identical; validation fails loudly on a dangling objective id, a level-inconsistent lesson, or a bad `source`. |
| MIG4 | `build-audio-manifest.js --check` green (unaffected). |
| MIG5 | Reversible — reverting the merge restores exact post-M15 behaviour (`CURRICULUM` compile, `objectsIntroduced`, the generator, and the Learn-view rebuild are all new or additive paths; `LESSON_LEVEL_FLOOR` removal is the only deletion and is behaviour-preserving for `deriveLevel`'s honest contract). |

---

## 5. Acceptance criteria

- `build-content.js --check` passes; validation **fails loudly** (each verified by deliberately breaking it) on: a dangling `objectives` id, a lesson whose `level` is below an objective's level, a duplicate node id, a `source: "steps:x"` with no matching catalog entry.
- `CURRICULUM` present in the running app: 7 levels, the A0 unit(s) with the existing 5 lessons + the migrated practice activities, real A1 unit/lesson nodes, A2–C2 unit stubs.
- Every lesson node resolves: `source: "steps:*"` → a real catalog lesson; `source: "generate"` → `generateLessonSteps` returns a non-empty, valid step array; `source: "view:*"` → a real view.
- The 1–2 generated A1 proof lessons run **every step, end to end, 0 console errors**, and every Arabic string in them traces to an existing object.
- Learn view: renders the full ladder; the "start where you fit" banner shows a sensible target for (a) a fresh profile, (b) a profile with A0 mastered, (c) a profile with a provisional A1; no unit is unopenable; 0 console errors; no layout shift elsewhere.
- Completing a lesson adds its `objectives` to `progress.objectsIntroduced`; `deriveLevel` then reflects provisional coverage; a fresh profile still derives `null` / "insufficient evidence" for every reliable strand.
- Pre-M16 `progress` blob → loads; `objectsIntroduced` backfilled; `mastered` / `skillLevels` / `streak` / both `*Completed` lists / `quizBest` / `placementResult` all preserved; reload idempotent.
- All 11 existing lessons run every step; 0 console errors (live browser trace).
- 320 / 375 / 390 / desktop — no overflow; dark mode intact (incl. new Learn-view CSS); 0 Arabic-Indic numerals in UI.
- `git diff`: `content/curriculum.json` new; `index.html` gains the generated `CURRICULUM` block, `generateLessonSteps`, the rebuilt `renderLearn`, the `deriveLevel` bridge swap, the `loadProgress` field, scoped Learn-view CSS — nothing else.

---

## 6. Regression re-tests (live browser, each end-to-end)

M6 harakāt · M7 syllables · M8 sentence-reading · M9 unvowelled · M11 grammar-intro · M12 stroke-order + `alphabet-writing-1` byte-identical + `practiceLetterWriting` · M13 audio (flag off, TTS, 0 `Audio()` objects) · M14 (`CONTENT` intact, `migrateMastered`, 46-card deck, data-driven chips) · M15 (`SKILLS`/`LEVELS`/`DESCRIPTORS`, "Your skills" panel, `deriveLevel` honest, pre-M15→M16 migration chain) · PWA (shell + fonts only) · persistence (streak, both `*Completed` lists, mid-lesson reload → Home).

---

## 7. Out of scope — the milestone that owns it in brackets

- ❌ Placement / diagnostics flow and UI — **M17** (M16's "start where you fit" is a suggestion from `deriveLevel`, not an assessment).
- ❌ `exerciseTypes` registry, `match` / `order` / `cloze` / `build-word` / `build-sentence` / `dictation` / `transform` — **M18**. M16's generator uses only existing step types.
- ❌ `InteractionEvent`, `ReviewState`, SM-2-lite scheduler, mistake log, review queues — **M19**. Completing a lesson updates `objectsIntroduced` only.
- ❌ The full fine-grained prerequisite graph beyond what M15 shipped + the coarse unit-level edges M16 needs — **M20**.
- ❌ Real A1 teaching content (the steps of the A1 lessons beyond the 1–2 proof lessons), the linguistic linter — **M20**.
- ❌ A2–C2 content of any kind — **M21+**. M16 ships unit *stubs* only.
- ❌ Accounts / sync — **M22**.
- ❌ Audience adaptation (`child` / `advanced` modes), dialect tracks — later; `audience` / `variety` fields stay reserved.
- ❌ Any change to Flashcards / Quiz / Word Bank / Alphabet / the Progress "Your skills" panel.
- ❌ Retiring or merging `lessonsCompleted` and `practiceLessonsCompleted` — left as-is.
- ❌ New Arabic content, new lexemes, new grammar copy.

---

## 8. Open questions

1. **`content/curriculum.json` (compiled) vs. keep `curriculum` inline?** *Recommend: JSON + compile* — consistent with M14 `CONTENT` and M15 taxonomy, keeps the tree reviewable in a small file, and is the exact groundwork M20's pipeline needs. The runtime stays buildless (compiled in, zero fetch).
2. **How much of A2–C2 to place now?** *Recommend: unit-level stubs for A2–C2* (one per §10 thread), **lesson nodes only down to A1**. Enough for the Learn view to show the whole ladder and for M20/M21 to have slots to fill; not so much that M16 becomes a content milestone.
3. **Build the 7-stage generator in M16, or defer to M18?** *Recommend: build a v1 now* using existing step types, and prove it with 1–2 real A1 lessons. Without it, "every lesson resolves to real objects" (the roadmap's done-condition) isn't met and M16 is just a data reshuffle. M18's richer item types extend it later.
4. **"Start where you fit" — suggest or auto-place?** *Recommend: suggest only.* A banner points at a unit; the learner can start anywhere; nothing is locked. Matches the "learner can override every placement" principle. Auto-placement waits for M17's real diagnostic.
5. **New CSS in the Learn view?** *Recommend: yes, minimal and scoped.* The roadmap calls M16 a "Learn view rebuild"; the "no new CSS" rule from M14–M15 was about additive data milestones. Every new rule is token-based, Learn-view-scoped, and listed in the PR. No other view changes.
6. **The A0 practice activities** (`reading-foundations`, etc.) currently only in `PRACTICE_LESSONS` — pull them into the curriculum tree as A0 lessons? *Recommend: yes* — they *are* A0 curriculum; having them only in a flat Practice list is an artefact of how they were added. They keep working from the Practice view too (no behaviour loss).
7. **Review gate before the Learn-view rebuild?** *Recommend: yes* — implementation pauses after `content/curriculum.json` + the `objectives` wiring + `content/m16-curriculum-review.md` are drafted, for your sign-off, before `renderLearn` is rebuilt and the generator is wired. Same checkpoint pattern as M14/M15.

---

## 9. Rollout

1. Scope approved (this doc).
2. Branch `feature/m16-curriculum-spine` off `main` (already created — carries only the `ROADMAP.md` status bump so far).
3. Author `content/curriculum.json` (A0 real, A1 nodes, A2–C2 stubs); add `objectives` to the 11 catalog lessons; add the coarse unit-level prereq edges. Extend `build-content.js` validation. Generate `content/m16-curriculum-review.md`. **Pause for your sign-off.**
4. `--write-app`; build `generateLessonSteps` v1; author the 1–2 generated A1 proof lessons.
5. Rebuild `renderLearn` (ladder + "start where you fit" + progress); scoped Learn-view CSS; swap the `deriveLevel` bridge to `objectsIntroduced` coverage; `loadProgress` migration + `objectsIntroduced` backfill.
6. `build-content.js` + `build-audio-manifest.js` `--check`; full QA (§5, §6) — live browser trace + independent read-only audit + the seeded-RNG byte-compare for the 11 existing lessons.
7. Draft PR against `main` with this doc + the review doc.
8. Merge on your explicit approval — `--no-ff`, delete branch, confirm clean tree, report new HEAD, verify live.
