# M15 Scope: Skills, Levels & the Learning Graph

**Status:** Draft for review. **No code written.** Do not begin implementation until this is approved.

**Parent:** [ROADMAP.md](ROADMAP.md) M15 · [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) §3.4, §4, §5.

**One-line summary:** Give the learner *educational coordinates*. Define the 8 skill strands and 7 levels as data, author all 56 Arabic-specific can-do descriptors (each cited to an external framework), tag every M14 learning object with its strands and level, wire prerequisite edges among those objects, and derive a per-strand level honestly (with an "insufficient evidence" state). One new panel on the Progress view; no other UI change.

This is where the app stops being a collection of lessons and starts being a learning *system*.

---

## 1. Why M15 exists

M14 gave every teachable thing a stable id and a type. But a lexeme, a grammar point, a letter — they have no *place*. There is no notion of "this is A2 reading," no way to say "sun/moon assimilation needs the definite article first," no way to answer "what level is this learner at, and in which skill." M15 adds exactly that layer and nothing downstream of it (curriculum tree = M16, placement = M17, assessment = M18, review = M19).

---

## 2. What M15 delivers

### 2.1 `SKILLS` — the 8 strands (data)

`reading · writing · listening · speaking · vocabulary · grammar · pronunciation · comprehension`

```
{ id, name, blurb, assess: "reliable" | "partial" | "self-report" }
```

| strand | assess | what it means here |
|---|---|---|
| vocabulary | reliable | recognition + recall of known words |
| grammar | reliable | agreement, case, conjugation, structure — targeted items |
| reading | reliable | decoding + literal understanding of text |
| listening | reliable | decoding + literal understanding of audio (TTS now, native later) |
| pronunciation | partial | **recognition** (minimal pairs, listen-and-identify) is reliable; **production** is "compare to model" only |
| comprehension | reliable | inferential / integrated understanding — gist, inference, discourse, author stance — assessed on both read and heard texts |
| writing | partial | letter form + spelling + dictation are gradable; **composition is self-assessed against a rubric** |
| speaking | self-report | interaction and fluency — **self-assessed + "compare to model," never a fabricated score** |

Every learning object, lesson, and (from M18) exercise declares `skills: [...]`.

### 2.2 `LEVELS` — 7 levels (data)

`A0 · A1 · A2 · B1 · B2 · C1 · C2` (ordered). `{ id, name, blurb }`. `A0` = "Pre-A1 / Absolute Beginner" (id kept as `A0` — already used by `lexemes` and the M5 `curriculum` façade; see §8 Q1). `C2` is added (the façade currently stops at `C1`).

### 2.3 The 56 descriptor cells — **the bulk of M15**

`content/descriptors.json` — one entry per (skill × level):

```
{ skill, level, canDo, notes?, source }
```

`canDo` is an **Arabic-specific** can-do statement — it names the actual competency (positional forms, iʿrāb, root-and-pattern, broken plurals, sun/moon assimilation, elided hamza…), not a generic European-language descriptor. `source` cites the external framework the cell was checked against (§8 Q2). Illustrative:

| level | reading | grammar |
|---|---|---|
| A0 | Recognises all 28 letters by name and sound; knows the four positional forms and the 6 non-connectors; reads fully-vowelled CV / CVV syllables. | *(pre-grammar)* |
| A1 | Reads fully-vowelled words and short sentences; handles sukūn, shaddah, tanwīn, tāʾ marbūṭa, alif maqṣūra, sun/moon assimilation. | Gender agreement; definiteness; nominal sentence; demonstratives; attached possessive pronouns; core prepositions; negation ليس/لا/ما. |
| B1 | Reads mostly-unvowelled MSA on familiar topics; infers vowels from pattern + context; handles broken plurals in context. | Derived forms II–X (recognition); relative clauses; إنّ وأخواتها; verbal nouns; participles; subjunctive after أن/لن. |
| B2 | Reads unvowelled authentic texts (news, articles) with occasional lookup; follows argument structure. | Full case system used actively; jussive; conditionals; passive; كان وأخواتها; حال and تمييز. |

**All 56 are authored, checked, and cited in M15** (decision #7 — "the map before the territory"). They are reviewed by you before anything is wired (§9 gate).

### 2.4 Object tagging

Every M14 object gains `skills: [...]` and a confirmed `level`:

- `LEXEMES` — already carry `level` (from the Word Bank; `A0`/`A1` today). Add `skills` (`["vocabulary"]`, plus `["reading"]` where the word anchors a decoding step, etc.). Fill `level` on the 7 `lex:fc-*` (currently `A0`).
- `LETTERS` / `MARKS` / `SYLLABLE_OBJECTS` — `level: "A0"`, `skills: ["reading","writing"]` / `["reading"]` etc.
- `GRAMMAR_POINTS` — `level` per the descriptor map (gender-agreement A1, present-tense A2, sun-moon A1), `skills: ["grammar","reading"]`.
- `TEXTS` — `level` + `skills: ["reading","comprehension"]` (+ `listening` where an audio target exists).

This is careful content editing of `content/*.json` — checked, not bulk-stamped — and is in the §9 review gate.

### 2.5 `prereqs` — the graph mechanism + the obvious edges

M14 reserved `prereqs: ObjectId[]` on every object. M15:
- **Coarse gates** — an object at level L declares the level-below foundation objects it assumes (e.g. every A1 grammar point requires the A0 foundations complete).
- **Critical fine-grained edges** — the handful where skipping genuinely breaks understanding: `let:lam` → the definite article → `gr:sun-moon`; `mrk:shadda` → gemination in verb forms; the three long-vowel `MARKS` → CVV syllables → CVV example words.
- **Not** the full fine-grained dependency graph — that is authored alongside the curriculum tree in **M16**. M15 ships the mechanism, the gates, and the edges that already matter.

`build-content.js` validates: acyclic (already checked) **+ level-monotonic** (a prereq may not be a higher level than the object that depends on it).

### 2.6 `deriveLevel(skill)` — honest, per-strand

Pure function. From `progress.mastered` (lexeme ids, plus — post-M19 — richer signal) and object coverage:

```
deriveLevel(skill) →
  { level, confidence: "firm" | "provisional", reason }              // enough evidence
  { level: null, reason: "insufficient evidence" }                   // not yet
```

- A strand level L is asserted when a threshold fraction of that strand's objects at ≤ L are mastered **and** there is enough graded evidence (§8 Q4).
- Below the evidence floor → `null` + "take a quick check" (the check itself is M17).
- Placement (M17) can seed a level with `source: "placement"`; real evidence overtakes it.
- `deriveHeadlineLevel()` → the learner's single headline level (§8 Q5).

### 2.7 Progress view — one new panel

The Progress view gains a **"Your skills"** panel: each of the 8 strands with its derived level, "keep going," or "self-tracked" (writing/speaking). Reuses the existing `.cat-progress-list` / `.cat-progress-row` markup and CSS custom properties — **zero new CSS rules** (holds the M6–M14 streak). No other UI, nav, or route change.

### 2.8 Learner-state migration

`progress` gains:
- `skillLevels` — `{ [skillId]: { level, confidence, reason } | null }`, a cache recomputed on load and after each lesson.
- `placementResult` — `null` until M17.

`loadProgress` migration adds the fields with safe defaults; existing `mastered` / `streak` / everything else is untouched. Migration is idempotent and lossless, verified against a real pre-M15 blob (same discipline as M14's `migrateMastered`).

### 2.9 Tooling + docs

- `tools/build-content.js` — validate: 56/56 descriptor cells present; every object has ≥ 1 valid skill + a level in `LEVELS`; prereq graph acyclic + level-monotonic.
- `content/m15-descriptor-review.md` — generated: all 56 descriptors with citations + the object-tagging summary, for your sign-off.
- This scope doc; a "What shipped" note on merge; `ROADMAP.md` / `CURRICULUM_ARCHITECTURE.md` §5 annotated.

---

## 3. Invariants — what M15 must NOT change

| # | Invariant |
|---|---|
| I1 | Every M1–M14 lesson runs identically; the step engine, builders, and all derived views are untouched. |
| I2 | The M13 audio layer and the M14 `CONTENT` / adapter model are untouched (M15 *adds* `skills`/`level`/`prereqs` fields to the JSON; `build-content.js` gains checks, not a new output shape). |
| I3 | `HARAKAT` == 3; `strokeOrderData` unchanged; `RECORDED_AUDIO_MANIFEST` byte-identical. |
| I4 | Flashcards / Quiz / Word Bank / Alphabet behave exactly as after M14. `progress.mastered` values unchanged (M15 only *reads* them). |
| I5 | No new CSS rule; no new view; no nav or route change. The "Your skills" panel reuses existing markup + tokens. |
| I6 | The M5-era `curriculum` object is **not touched** — M16 owns its rebuild. M15's `LEVELS` is a new, separate structure. |
| I7 | No runtime dependency, no runtime fetch; shipped `index.html` stays one self-contained file. |
| I8 | Western digits in UI; Arabic-Indic only in taught content (M15 adds none). |
| I9 | `deriveLevel` **never returns a fabricated level** — below the evidence floor it returns `null` with a reason. Writing/speaking are never given a machine level. |

---

## 4. Migration requirements

| # | |
|---|---|
| MIG1 | `progress` gains `skillLevels` + `placementResult` with safe defaults; every other field preserved; idempotent; lossless; tested against a real pre-M15 blob. |
| MIG2 | Existing `lexemes[].level` values (`A0`/`A1`) validated against `LEVELS`; the 7 `lex:fc-*` get a real level (not left blank). |
| MIG3 | `build-content.js --check` green after the JSON gains `skills`/`level`/`prereqs`; two runs byte-identical. |
| MIG4 | `build-audio-manifest.js --check` green (the audio tool ignores the new fields). |
| MIG5 | Reversible — one squashed commit; reverting restores exact post-M14 behaviour (the new fields are additive, `deriveLevel` and the panel are new code paths). |

---

## 5. Acceptance criteria

- `build-content.js --check` passes; validation **fails loudly** on: a missing descriptor cell, an object with no skill or an unknown level, a prereq cycle, a level-non-monotonic edge (each verified by deliberately breaking it).
- `SKILLS` (8), `LEVELS` (7), `DESCRIPTORS` (56) present in the running app; every descriptor has a non-empty `canDo` and `source`.
- Every M14 object resolves to ≥ 1 skill and a level; every `prereqs` id resolves.
- `deriveLevel("vocabulary")` on a fresh profile → `{ level: null, reason: "insufficient evidence" }`. On a profile with the A0 foundation mastered → `A0` or `A1` with a confidence flag. `deriveLevel("speaking")` → always self-report, never a number.
- Progress view: the "Your skills" panel renders all 8 strands; no console error; no layout shift on the rest of the view.
- Pre-M15 `progress` blob → loads, `skillLevels` populated, `mastered`/`streak`/`lessonsCompleted`/`quizBest` all preserved; reload idempotent.
- All 11 lessons run every step; 0 console errors (live browser trace).
- 320 / 375 / 390 / desktop — no new overflow; dark mode intact; 0 Arabic-Indic numerals in UI.
- `git diff`: the JSON gains additive fields; `index.html` gains `SKILLS`/`LEVELS`/`DESCRIPTORS` (generated), `deriveLevel` + `deriveHeadlineLevel`, the panel render, the `loadProgress` fields — nothing else. No CSS.

---

## 6. Regression re-tests (live browser, each end-to-end)

M6 harakāt · M7 syllables · M8 sentence-reading · M9 unvowelled · M11 grammar-intro · M12 stroke-order + `alphabet-writing-1` byte-identical + `practiceLetterWriting` · M13 audio (flag off, TTS, 0 `Audio()` objects, `--check` green) · M14 (`CONTENT` intact, `migrateMastered`, 46-card deck, data-driven chips) · PWA (shell+fonts only) · persistence (streak, both `*Completed` lists, mid-lesson reload → Home).

---

## 7. Out of scope — the milestone that owns it in brackets

- ❌ The real `curriculum` tree, Learn-view rebuild, "start where you fit", lesson `objectives`, the 7-stage generator — **M16**
- ❌ The **full fine-grained** prerequisite graph — **M16** (M15 = mechanism + gates + critical edges only)
- ❌ Placement / diagnostics — **M17**
- ❌ `exerciseTypes` registry, non-MCQ item types — **M18**
- ❌ `InteractionEvent`, `ReviewState`, SM-2-lite, mistake log, review queues — **M19**
- ❌ Content pipeline linguistic linter, A1 authoring — **M20**
- ❌ A2–C2 content, morphology curriculum, literary Arabic — **M21+**
- ❌ Accounts / sync — **M22**
- ❌ **Any new Arabic content** beyond the 56 descriptors and the skill/level tags on existing objects. No new lexemes, sentences, lessons, grammar copy.
- ❌ Any UI/CSS/layout/nav change beyond the single "Your skills" Progress panel.
- ❌ `morphology` / `collocation` object instances (kinds still reserved).
- ❌ Renaming `curriculum.levels` or its ids; touching the M5 façade.

---

## 8. Open questions

1. **Level id: `A0` or `PRE_A1`?** The architecture doc says `PRE_A1`; the code (`lexemes[].level`, `curriculum.levels`) uses `A0`. *Recommend: keep `A0`* — established, shorter, unambiguous in a language-learning context, no lexeme migration. Display label "Pre-A1 / Absolute Beginner."
2. **External framework for the 56 descriptors.** *Recommend:* CEFR Companion Volume (2018) descriptors as the spine, adapted per strand and cross-checked against the **ACTFL Arabic Proficiency Guidelines** and a recognised Arabic teaching progression; every cell cites its source(s). Some cells (esp. `comprehension`, `pronunciation`) have no clean external descriptor and get a **documented rationale** instead of a citation. I draft all 56; you review at the §9 gate.
3. **`comprehension` — keep as the 8th strand or fold into reading + listening (→ 7)?** *Recommend: keep 8*, defined as §2.1 (inferential/integrated understanding, assessed on both read and heard texts). Confirm.
4. **`deriveLevel` thresholds.** *Recommend* tunable constants: assert level L when ≥ 75 % of the strand's objects at ≤ L are mastered **and** ≥ 12 graded interactions exist in that strand; below that → "insufficient evidence." (Evidence signal is thin until M18/M19 — M15's `deriveLevel` is conservative by design and firms up later.)
5. **Headline level.** *Recommend:* "primary level" = **min of `reading`, `vocabulary`, `grammar`** (the load-bearing strands); `listening` / `speaking` / others shown alongside, not averaged in. Honest without being demoralising.
6. **Descriptor + tagging review gate.** *Recommend:* implementation pauses after `content/descriptors.json` + the object tagging + `m15-descriptor-review.md` are drafted, for your sign-off, before `deriveLevel` / the panel / the migration are wired. Confirm you want that checkpoint (same as M14's merge-report gate).
7. **Add `C2`?** The façade stops at `C1`. *Recommend: yes* — 7 levels A0→C2, so C1/C2 Arabic has somewhere to go (ROADMAP.md).

---

## 9. Rollout

1. Scope approved (this doc) + `ROADMAP.md` acknowledged.
2. Branch `feature/m15-skills-levels-graph` off `main`.
3. Author `SKILLS` / `LEVELS` / `content/descriptors.json` (all 56, cited); tag every object with `skills` + `level`; add the coarse gates + critical prereq edges. Generate `content/m15-descriptor-review.md`. **Pause for your sign-off.**
4. Extend `build-content.js` validation; `--write-app`.
5. `deriveLevel` + `deriveHeadlineLevel`; the "Your skills" Progress panel; `loadProgress` migration.
6. `build-content.js` + `build-audio-manifest.js` `--check`; full QA (§5, §6) — live browser trace + independent read-only audit.
7. Draft PR against `main` with this doc + the review doc.
8. Merge on your explicit approval — squashed, `--no-ff`, delete branch, confirm clean tree, report new HEAD.
