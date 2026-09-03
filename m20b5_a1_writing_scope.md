# M20 Phase B — Batch 5: A1 writing / dictation

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m20_content_pipeline_scope.md](m20_content_pipeline_scope.md) §"PHASE B" item 5.
**Base:** `main` @ `958946c` (batch 4 merged, live — A1 vocabulary + texts complete).
**Branch (created):** `feature/m20-a1-writing`.

---

## 1. Where the writing strand stands

`writing` is the last A1 strand with almost no A1-level content. Today it rests
entirely on **A0**: the 28 `let:` letter objects (stroke-order data for
*isolated* forms, M12) and the two A0 lessons `alphabet-writing-1` (trace) and
`stroke-order-writing` (guided strokes). Nothing at A1 exercises joining,
spelling, or sentence construction, and `writing`'s only machine-checkable
signal is the `build` exercise kind from M18 — which no authored lesson uses
yet.

`content/skills.json`: `writing` is **`assess: "partial"`** ("Letter formation,
joining, spelling, and composition. Composition is self-assessed against a
rubric."). So this batch can move the *mechanical* half of writing —
joining, spelling, short-sentence construction — onto real graded exercises;
free composition stays self-assessed and is **not** in scope (that is M19's
`short-write` / rubric territory, still deferred).

The **A1 writing descriptor** (`content/descriptors.json`, cited to
CEFR-CV 2018 Overall Written Production A1 + Orthographic Control A1):

> *"Writes letters correctly in initial / medial / final position with correct
> joining; spells familiar fully-vowelled words from dictation; writes short
> simple sentences (subject + predicate)."*

Three parts — **joining**, **dictation spelling**, **subject-+-predicate
sentences**. This batch wires a lesson for each, built from content **already
merged** (the 310 lexemes, the 20 batch-4 texts, the 9 A1 `gr:` points, the 28
`let:` objects). It is a **wiring batch** — see §4, it likely adds **zero new
Arabic objects**.

The architecture's writing ladder (`CURRICULUM_ARCHITECTURE.md` §10.6):
*joining practice → vowelled-word copying → dictation → guided sentence writing
→ free composition*. Batch 5 delivers the first four at A1. Free composition and
a **scalable contextual stroke-order model** (§10.6's bigger ask) are explicitly
later work.

---

## 2. Hard constraints

### 2.1 Engine — existing renderers only (M20 invariant I7)

**No new `exerciseTypes` kind, no new `stepRenderers` entry, no new CSS, no
nav/UI change.** The batch uses what M6–M18 already ship:

| renderer | used for |
|---|---|
| `explain` | how the four positional forms join; what "spell from dictation" asks; the subject-then-predicate shape |
| `example-set` *(fromObjectives)* | hear + see the target words before spelling them (🔊 per card) |
| `reading-practice` *(fromObjectives)* | hear + see the target sentences before building them |
| `exercise` → `exerciseTypes.build` | **the graded core.** `unit:"grapheme"` = spell a word from letter tiles (RTL, exact-match); `unit:"word"` = assemble a sentence from word tiles. Emits an `InteractionEvent` with `skill:"writing"` — the descriptor's machine-checkable evidence. |
| `practice-choice` | a light recognition check ("which spelling is correct?", "which is a sentence, not just a phrase?") |
| `complete` | close |

`exerciseTypes.build` today: `item.target` is an array of tiles, `item.prompt`
/ `item.hint` are text, the learner taps tiles into order, **Check** scores
exact-match and emits `{objectId, skill, itemType:"build", correct, latencyMs}`.
That is exactly the spelling / sentence-assembly primitive the descriptor needs.

### 2.2 Not `trace-letter` / stroke-order

Letter **tracing** and **guided stroke order** are A0's job
(`alphabet-writing-1`, `stroke-order-writing`) and M12's flow is untouched
territory (M18 I4, M20 I1). Real stroke-order data for **contextual** forms does
not exist (only isolated forms are modelled), and building that scalable model
is a separate, larger piece of work (`CURRICULUM_ARCHITECTURE.md` §10.6) — **not
this batch**. A1 joining is taught in an `explain` step (using the `let:`
objects' own `forms` data, shown as small inline glyphs exactly as the batch-1
grammar lessons show inline Arabic) and *practised implicitly* — when the
learner builds `كِتَاب` from grapheme tiles, Arabic shaping joins the letters in
the answer box, so a correct build **is** a correct join.

### 2.3 Content — the merged A1 inventory, nothing else

Same closed-set rule as batches 1–4. Every Arabic string a lesson shows traces
to an object already in `content/`:

- spelling targets — the **155 "spellable" A1 lexemes** (no space, 3–6 grapheme
  tiles, so they fit the `build` tile UI; `exGenBuild`'s own gate);
- sentence targets — the **16 non-dialogue batch-4 `txt:` sentences** (verbless
  nominal sentences = subject + predicate, 2–4 words each) plus the batch-1
  `txt:gram-*` grammar-example sentences where they are ≤ 5 words;
- joining illustration — the **28 `let:` objects**' `forms` (`initial` /
  `medial` / `final`), all A0, already taught.

**No new lexeme, text, grammar point, or letter is authored** unless review
finds a genuine gap (§4). Nothing A2+ (no verb sentence, no iḍāfa beyond the
lexicalised handful, no counted noun) — inherited from batch 4 and unchanged.

### 2.4 Digits, register, vowelling

Inherited invariants: Western digits in UI chrome; every Arabic string fully
vowelled (it already is — it comes from merged, linted objects); `--lint` stays
at **0 errors / 0 new warnings**.

---

## 3. What ships

### 3.1 Pipeline — one build-time extension (no runtime change)

**`exercise` steps gain `fromObjectives`.** Today the compiler expands
`fromObjectives` only on `example-set` / `reading-practice`
(`build-content.js` `FROM_OBJECTIVES_OK`). This batch adds `exercise` to that
set: an `exercise` step with `fromObjectives: true` and an
`exercise: { kind, unit }` stub compiles to **one concrete exercise step per
eligible lesson objective**, with the tile array generated by the same
grapheme/word logic `exGenBuild` uses at runtime — so **no Arabic is inlined in
the lesson file** (the batch-1 precedent: `compile()` was extended there to
expand `txt:` objectives into `reading-practice`).

```
// authored (no Arabic):
{ "type": "exercise", "title": "Spell what you heard",
  "fromObjectives": true,
  "exercise": { "kind": "build", "unit": "grapheme" } }

// compiled (one per spellable lexeme objective):
{ "type": "exercise", "title": "Spell what you heard",
  "exercise": { "kind": "build", "skill": "writing",
    "objectId": "lex:foo", "objectIds": ["lex:foo"],
    "prompt": "Spell “X” (translit)", "hint": "Tap the letters in order, right to left.",
    "target": ["<grapheme tiles>"], "audio": "<lexeme.ar>"  // see Q1
  } }
```

- `unit: "grapheme"` → target from `graphemeTiles(lexeme.ar)`; skips a lexeme
  outside the 3–6-tile range (logged in the build summary, same as M18's
  coverage check).
- `unit: "word"` → target from `text.words[].surface`; skips a text with < 2 or
  > 6 words.
- `build-content.js` validation: `fromObjectives` on an `exercise` step requires
  `exercise.kind` (`"build"` only, for now) + `exercise.unit`
  (`"grapheme"` | `"word"`) + at least one objective that yields a valid item.

`git diff` for the pipeline = `build-content.js` (`FROM_OBJECTIVES_OK` += one
entry, a compile branch, a validation branch) + `tools/lint-fixtures.js` if a
new rule fixture is warranted. **No `index.html` script change** — unless Q1 is
answered "add the audio hook".

### 3.2 Runtime — the dictation question (Q1)

The descriptor says *"spells … from **dictation**"* — hear it, then write it.
`exerciseTypes.build` currently renders **no audio**. Two ways to honour the
word:

- **A — no runtime change (recommended default).** Each dictation lesson pairs
  an `example-set` / `reading-practice` step (🔊 per word) **immediately before**
  the `build` exercises for the same words. The learner listens, then spells
  from memory. The `build` prompt still shows the gloss + transliteration (as
  `exGenBuild` already does). This is how classroom dictation of a word list
  actually runs (read aloud, then written) and needs **zero engine change**.
- **B — a ~6-line additive hook.** `exerciseTypes.build` gains: *if
  `item.audio`, prepend `buildAudioControl(item.audio)` above the tile bank.*
  Behaviour-preserving — **no existing `build` item has an `audio` field**, so
  every current call is byte-identical; `exGenBuild` / the M18 generator are
  untouched. This puts the 🔊 **on** the spelling exercise = true, self-paced
  dictation (replay as needed). Precedent: batches 2/3/4 each carried a small
  additive `index.html` line (a `VOCAB_CATEGORIES` entry, six category rows, the
  `readingTexts` view).

**Recommendation: B**, as this batch's single allowed runtime deviation — it is
the difference between real listening-to-writing and a spelling drill with a
misleading title, it is genuinely additive, and it unblocks a proper
`dictation`-flavoured `build` without the deferred standalone `dictation` kind.
If you'd rather hold the runtime completely still, **A** delivers ~90% of the
value. (Either way, no new *kind* is added — M18's deferred `dictation` kind
stays deferred.)

### 3.3 Content — `content/lessons/*.json` (2–3 data lessons)

| lesson | unit | arc | objectives |
|---|---|---|---|
| **`a1-writing-join-spell`** | `a1-u1` (order 7) *or* `a1-u3` (Q3) | `explain` (the four positional forms + the 6 non-connectors, from `let:` `forms`) → `example-set` fromObjectives (hear ~8 short words) → `exercise` build/grapheme fromObjectives → `practice-choice` (spot the mis-joined / mis-spelled form) → `complete` | ~8 `lex:` (short, high-frequency, mixed connectors/non-connectors) + the `let:` objects referenced by the explain |
| **`a1-writing-dictation`** | `a1-u3` (order 17) | `explain` ("you'll hear a word, then build it") → `reading-practice` fromObjectives (audio-forward) → `exercise` build/grapheme fromObjectives (with `audio`, per Q1) → `complete` | ~10 `lex:` across 2–3 topic threads (family / home / food) |
| **`a1-writing-sentences`** | `a1-u1` (order 8) | `explain` (subject then predicate; the tiles are whole words) → `reading-practice` fromObjectives (hear the sentences) → `exercise` build/word fromObjectives → `practice-choice` ("which is a full sentence, not just 'the big house'?") → `complete` | 6–8 `txt:` (batch-4 tier-1/2 nominal sentences + short batch-1 grammar sentences) + the `gr:` points they rest on |

Curriculum: 2–3 new `source:"steps:<id>"` lesson nodes. No unit status change
(`a1-u1` and `a1-u3` are already `available`). Whether it is 2 lessons or 3, and
the exact unit homes, is **Q3**.

### 3.4 Not shipped / not touched

`trace-letter` and both A0 writing lessons; M12 stroke-order; the contextual
stroke-order model (§10.6); a standalone `dictation` / `transform` /
`short-write` exercise kind (M18-deferred, stays deferred); free composition +
rubric self-check (M19); `a1-u5` / Numbers (batch 6); `readingPassages` /
`grammarExamples` / any derived view; `VOCAB_CATEGORIES`; the M16 generator;
`deriveLevel`, the review scheduler, placement (the new `writing` events flow
through them unchanged — no code change needed).

---

## 4. Does this batch add new Arabic?

**Plan: no.** The material is already merged:

- **155** spellable A1 lexemes (≥ 3, ≤ 6 grapheme tiles) — abundant for the
  spelling / dictation lessons.
- **16** batch-4 nominal sentences (2–4 words) + the batch-1 `txt:gram-*`
  sentences ≤ 5 words — abundant for the sentence-building lesson.

If review of the drafted lesson objective lists surfaces a real gap — e.g. a
topic thread with too few short spellable words to make a coherent set, or a
shortage of 3–4-word sentences at the right tier — the batch adds a **small,
cited** handful (Al-Kitaab P1 / Hans Wehr / the Frequency Dictionary, the same
sources as batches 2–4), called out per item in the PR table. The expectation
is **0–6** new objects, not a content push.

---

## 5. Acceptance criteria

A reviewer (you) signs off only if **all** hold. The draft PR presents every
lesson's compiled steps and every exercise's target tiles in a table so each is
checkable.

**Engine / scope**

1. **No new renderer or kind.** `git diff` shows **no** new `exerciseTypes[...]`
   assignment and **no** new `stepRenderers[...]` entry. The only `index.html`
   change is the optional Q1 audio hook (≤ ~8 lines, additive, listed in full in
   the PR) — or none.
2. **`build` unchanged for existing callers.** Every current `build` item
   (M18 generator, `exGenBuild`, review runner) renders and scores exactly as
   before — verified by the seeded-RNG byte-compare of the 13 legacy lessons and
   a live trace of an M18 generated lesson.
3. No new CSS rule; no nav / Learn / Progress / placement change.

**Content**

4. **Inventory closure.** Every Arabic string every new lesson displays or
   tiles traces to an object in `content/` (lexeme `ar`, text `vowelled` /
   `words[]`, letter `forms`). The PR table has an "→ object id" column; **zero**
   unmatched. Any new object (§4) is cited.
5. **Level closure.** Every lesson objective resolves and is A1-or-below
   (`--check` enforces monotonicity); no A2+ structure appears.
6. **Grapheme fidelity.** For every compiled `build`/grapheme target,
   `target.join("") === lexeme.ar` (the tiles reconstruct the exact vowelled
   word). For every `build`/word target, `target.join(" ")` matches the text
   surface sequence.
7. **Dictation honesty.** Every "dictation" exercise is preceded by an audio
   step for the same words (option A) **or** carries a working `item.audio`
   (option B) — a learner can always hear the word before/while spelling it.

**Build / regression**

8. `node tools/build-content.js --check` — green, `index.html` in sync.
9. `node tools/build-content.js --lint` — **0 linguistic errors, 0 new
   warnings**; the pre-existing M14.5 orphan warnings unchanged or **reduced**
   (each lexeme/text a new lesson references as an objective drops off the
   orphan list).
10. `node tools/build-content.js --write-app` — byte-stable on re-run;
    `m14-compare2.js` shows **only** the new compiled lesson entries as changed
    bytes (all existing `CONTENT` structures, all 13 legacy lessons, every
    derived view untouched). `M20_LESSON_IDS` in the compare script += the new
    lesson ids.
11. `node tools/build-content.js` + `node tools/build-audio-manifest.js --check`
    — clean after regen (the spelling/sentence audio strings are already in the
    manifest as their lexeme/text TTS targets; count rises only if §4 adds
    objects).
12. `node tools/lint-fixtures.js` — passes (a new fixture if a new validation
    rule is added).
13. `m15`–`m19` func suites pass (object / lesson-node counts bumped only).

**Live (SW-cleared, `?v=` cache-bust)**

14. All new lessons run **every step, 0 console errors**: `explain` shows the
    joining/subject-predicate copy; `example-set` / `reading-practice` play
    audio; each `build` exercise shuffles tiles, accepts a correct assembly,
    marks a wrong one recoverable, and on Check emits **one** `InteractionEvent`
    with `skill:"writing"`, `itemType:"build"` (confirmed in
    `progress.interactionLog`); `practice-choice` gates; `complete` finishes and
    records objectives.
15. The `writing` strand moves: after completing the spelling lesson with
    correct answers, the Progress "Your skills" panel shows `writing` advancing
    off "keep going" (graded tier via M19's fold) — a real, earned signal.
16. The new exercises appear **only** in their lessons — not in the M18
    generator's output for other lessons, not in the review queue until the
    learner has seen them, not in placement.
17. Dark theme + 320 px: tile banks wrap / scroll in their own container, no
    horizontal page overflow; Arabic renders RTL; Western digits in chrome.

**Docs**

18. `ROADMAP.md` M20 row: B5 marked done. `content/m20-lint-proof.md` "current
    content" counts refreshed if quoted. A short review doc
    `content/m20b5-writing-review.md` (each lesson's compiled steps + every
    target tile array + the audio decision) for sign-off — same checkpoint as
    batches 1–4.

---

## 6. What A1 writing cannot cover — and what we do about it

Stated up front so the batch is not padded:

| gap | why later | batch-5 stance |
|---|---|---|
| **Free composition** ("write two sentences about your family") | needs a rubric + self-assessment UI; `writing` is `assess:"partial"` for exactly this reason | out of scope — M19 `short-write`; batch 5 stops at *guided* sentence assembly from tiles |
| **Contextual stroke order** (writing ـهـ vs ه by hand, stroke sequence for a joined form) | no stroke-order data for contextual forms; building the scalable model is a separate milestone (§10.6) | `explain` teaches *that* the forms differ and *which* letters don't connect; hand-formation of contextual forms is deferred |
| **Handwriting / cursive proportion, the لا ligature, kashīda** | typographic + handwriting variation is late on the reading ladder (§10 item 20), well past A1 | not touched |
| **Spelling long / multi-word items** (> 6 grapheme tiles, phrases with spaces) | the `build` tile UI caps at 6 tiles for usability; `exGenBuild`'s own gate | the ~24 A1 lexemes outside the range are simply not spelling targets this batch; they stay reading/vocab items |
| **Dictation of whole sentences** | 6+ word tile assembly is unwieldy; sentence writing is covered by `build`/word on the 2–4-word set | dictation = single words; sentence lesson = tile assembly with the sentence shown/heard first |
| **True blind dictation** (no gloss shown) | `build` shows `prompt` (gloss + translit); removing it is a renderer change beyond the Q1 hook | acceptable at A1 — the descriptor is "spells familiar words", recognition-supported; blind dictation is an A2 tightening |

Net: batch 5 delivers **positional-form awareness**, **word spelling** (with
audio), and **guided subject-+-predicate sentence writing** — all three
descriptor clauses, all machine-graded through `build`, all from merged content.
It does not deliver free writing or handwriting of joined forms; both are
correctly later.

---

## 7. Sourcing

Per invariant I6. This batch authors little or no new Arabic (§4); what it does:

- **Lesson copy** (the `explain` steps): the four-positional-forms / non-connector
  facts are already in the app (`arabicAlphabet`, the branding-cleanup note) and
  in `CURRICULUM_ARCHITECTURE.md` §10 items 8–10; the subject/predicate framing
  matches the batch-1 `a1-grammar-structural` "sentence with no verb" step.
- **Any new lexeme/text** (only if §4 forces it): cited to Al-Kitaab Part One
  3rd ed., Hans Wehr, or Buckwalter–Parkinson *A Frequency Dictionary of Arabic*
  — per item, in the PR table.
- **Target tiles**: generated by `graphemeTiles()` from the vowelled `ar` of a
  reviewed object — not hand-typed, so no transposition risk.

---

## 8. Open questions

1. **Dictation audio — option A (no runtime change; pair an audio step before
   the `build` exercises) or option B (~6-line additive `item.audio` hook on
   `exerciseTypes.build`)?** *Recommend **B*** — it makes the 🔊 sit on the
   spelling exercise (self-paced replay = real dictation), it is genuinely
   additive (no existing `build` item has `audio`), and every Phase B batch so
   far has carried one small runtime line. A is the fallback if you want the
   engine held perfectly still this batch.
2. **Compiler: extend `fromObjectives` to `exercise` steps (recommended), or
   author each `build` step inline with an explicit `target` tile array?**
   *Recommend the compiler extension* — keeps lesson files declarative and
   Arabic-free (batch-1 precedent), and the tiles are generated by the same
   logic the runtime uses, so they can't drift. Inline authoring puts
   hand-split grapheme arrays in JSON that must exactly match `graphemeTiles()`.
3. **2 lessons or 3, and which units?** *Recommend **3*** — `a1-writing-join-spell`
   + `a1-writing-sentences` on `a1-u1` (they're about *first sentences*),
   `a1-writing-dictation` on `a1-u3` (it's a *vocabulary* consolidation drill).
   The alternative — fold joining+spelling+dictation into one `a1-u3` lesson and
   keep sentences on `a1-u1` (2 lessons) — is tighter but makes the first lesson
   long (explain + 2 audio steps + 2 exercise blocks).
4. **`practice-choice` recognition checks — include them, or keep the lessons
   pure production?** *Recommend include 1 per lesson* — a "spot the wrong
   spelling / the non-sentence" check is cheap, varies the rhythm, and gives the
   `comprehension`/`reading` strands a small co-signal. They add inline Arabic
   options (like the batch-4 reading lessons already do), all tracing to
   objects.
5. **One PR, or split joining/spelling from sentences?** *Recommend **one PR*** —
   2–3 short lessons, one review table, one coherent "A1 writing" story.

---

## 9. Not in this batch

Wiring `a1-u5` / Numbers (batch 6 — and its counted-noun grammar is A2); any A2
content; free composition + rubric self-check (M19); a standalone `dictation` /
`transform` / `short-write` exercise kind; the scalable contextual stroke-order
model; handwriting / cursive / ligature work; converting the A0 writing lessons
to data; any `deriveLevel` / scheduler / placement / nav / CSS change.

---

## 10. Rollout

1. Scope approved (this doc) + Q1–Q5 answered.
2. `feature/m20-a1-writing` off `main` @ `958946c` (created) — carries the
   `ROADMAP.md` bump.
3. Extend `build-content.js` (`fromObjectives` on `exercise`, validation,
   compile); the Q1 audio hook if B. Draft the 2–3 `content/lessons/*.json`
   with objective lists; review the objective lists for §4 gaps; add the
   curriculum nodes. Generate `content/m20b5-writing-review.md`. **Pause for
   sign-off.**
4. `--check` / `--write-app` / `--lint` / `lint-fixtures` / audio `--check`;
   `m14-compare2.js` + `m15`–`m19` func; live browser trace of every new lesson
   step + the 13-lesson byte-compare + an independent read-only audit.
5. Draft PR against `main` with this doc + the review doc + the per-lesson /
   per-target table.
6. Merge on explicit approval — `--no-ff`, delete branch, confirm clean tree,
   report new HEAD, verify live.
