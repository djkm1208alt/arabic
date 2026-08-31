# M20 Phase B — Batch 1: A1 grammar

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m20_content_pipeline_scope.md](m20_content_pipeline_scope.md) §"PHASE B" item 1.
**Base:** `main` @ `3d92c1a` (Phase A merged, live).
**Branch (on approval):** `feature/m20-a1-grammar`.

---

## 1. Why this batch

Phase A shipped the pipeline; Phase B authors the A1 content it validates, as a
sequence of small, individually-reviewed PRs. Grammar goes first because the
vocab batches and the reading texts both sit on top of it.

**A1 grammar today** (`content/grammar.json`): 2 points at A1 —
`gr:gender-agreement`, `gr:sun-moon` — plus `gr:present-tense` parked at A2.

**A1 grammar the descriptor promises** (`content/descriptors.json`, grammar/A1,
cited to `CURRICULUM_ARCHITECTURE.md §10.2` + CEFR-CV 2018):

> Noun gender and number; definiteness (ال, tanwīn); the nominal sentence
> (mubtadaʾ + khabar); demonstratives; attached possessive pronouns; core
> prepositions; adjective agreement; negation with ليس / لا / ما.

Adjective agreement = `gr:gender-agreement` (done). This batch authors the
other seven.

---

## 2. What ships

### 2.1 Seven new `gr:` objects in `content/grammar.json`

Same shape as the existing three — `{ id, kind:"grammar", name, level:"A1",
rule, examples:[txt-id], commonErrors:[…], skills, prereqs }`.

| # | id | covers | rests on |
|---|---|---|---|
| 1 | `gr:noun-number` | singular → dual (ـانِ / ـينِ) → sound plurals (ـونَ / ـاتٌ), recognition only | — |
| 2 | `gr:definiteness` | indefinite = tanwīn (ـٌ ـٍ ـً); definite = ال; the two are mutually exclusive | `gr:sun-moon` |
| 3 | `gr:nominal-sentence` | mubtadaʾ + khabar, no verb "to be"; khabar indefinite, mubtadaʾ definite | `gr:definiteness` |
| 4 | `gr:demonstratives` | هٰذَا / هٰذِهِ / هٰؤُلَاءِ + noun; agreement with the noun | `gr:nominal-sentence` |
| 5 | `gr:attached-possessive` | ـِي ـكَ ـكِ ـهُ ـهَا on a noun (كِتَابِي, بَيْتُكَ …) | `gr:definiteness` |
| 6 | `gr:core-prepositions` | فِي، عَلَى، مِنْ، إِلَى، مَعَ، بِـ، لِـ + noun in the genitive | `gr:definiteness` |
| 7 | `gr:negation-a1` | nominal-sentence negation: لَيْسَ + khabar; لَا / مَا for simple contradiction | `gr:nominal-sentence` |

`prereqs` stay level-monotonic (all A1 → A1) — the build already enforces this.

### 2.2 ~15–18 new `txt:` example objects in `content/texts.json`

Each `gr:` point references 2–3 fully-vowelled example sentences. Shape matches
`txt:gram-gender-bint`: `{ id, kind:"text", textType:"sentence",
source:"m11", concept:<grammar-slug>, vowelled, translit, en, words:[{surface,
translit, gloss, …}], audio, level:"A1", skills, prereqs:[gr-id] }`.

- **Vocabulary ceiling:** every content word is A1-or-below. Built from what
  already exists — بَيْت، كِتَاب، بِنْت، مَدْرَسَة، وَلَد، كَبِير، جَمِيل،
  سَعِيد، the numbers, the colours — plus the function words each point is
  actually teaching (هٰذَا، فِي، عَلَى، لَيْسَ …). Those function words become
  formal `lex:` entries in Batch 2 (vocab); here they appear only inside
  grammar example sentences, which is how the current `txt:gram-*` objects
  already work.
- **No `reduced` / `unvowelled` fields** on these (they are grammar demos, not
  reading-fluency material) — an unauthored field is not flagged, and it keeps
  them clear of M20.5's drift check.
- `audio` = the vowelled string, as the existing grammar texts do →
  `tools/build-audio-manifest.js` regenerated, manifest count grows.

### 2.3 Wiring

- **`gr:present-tense` A2 → A1?** No. It stays A2 (it is a verbal-sentence
  feature; the descriptor puts present tense at A2). Out of scope here.
- **`content/curriculum.json`** — `a1-u1` ("Your First Sentences") lesson
  `grammar-intro` currently lists `gr:gender-agreement, gr:sun-moon,
  gr:present-tense`. Add the seven new points to a curriculum lesson so they
  are reachable. Options (pick in review):
  - **A.** Extend `grammar-intro`'s objectives (simplest; one long lesson).
  - **B.** Add one new **data-authored lesson** `content/lessons/a1-grammar-*.json`
    per cluster (structural: #1–3, #7; function-word: #4–6), wired to `a1-u1`
    (and unblock `a1-u4` "Talking About People & Places", currently `planned`).
    Uses the Phase-A lesson pipeline for real — recommended.
- **No `index.html` change** beyond what `--write-app` regenerates in the
  `CONTENT` block. The grammar view (`grammarExamples`) and the M16 generator
  already render any `gr:` + `txt:` objects.

### 2.4 Proof

- `node tools/build-content.js --check` green; `--lint` shows **0 linguistic
  errors, 0 new linguistic warnings** (the 83 pre-existing M14.5 orphan
  warnings are unaffected — new `gr:`/`txt:` objects are referenced, so they
  do not add orphans).
- `--write-app` byte-stable on re-run.
- `m14` byte-compare: only-new-bytes (the new objects) — existing derived
  structures unchanged.
- `m15–m19` func suites pass.
- Live browser trace: the grammar view lists all 9 A1 points; each renders its
  example sentences; the new/updated A1 grammar lesson(s) run start→finish with
  0 console errors; Western digits in chrome, Arabic-Indic only where a taught
  number appears; dark + 320 px clean.
- Update `content/m20-lint-proof.md` "current content" section + append this
  batch to `ROADMAP.md` M20 row.

---

## 3. Sourcing — every Arabic string is verified, not invented

Per invariant I6. Each `gr:` `rule` and every `txt:` example checked against:

- **Al-Kitaab fii Taʿallum al-ʿArabiyya, Part One, 3rd ed.** (Brustad, Al-Batal,
  Al-Tonsi) — the A1 grammar sequence and example patterns.
- **A Reference Grammar of Modern Standard Arabic** (Ryding, Cambridge, 2005) —
  for the rule statements (nominal sentence, demonstrative agreement, genitive
  after prepositions, لَيْسَ conjugation).
- Existing in-repo content for any word already authored (reuse its exact
  vowelling + translit, do not re-spell).

The linter is the safety net; **you review every sentence before merge.** The
draft PR will present the 7 rules + ~18 sentences as a single table for review.

---

## 4. Open questions

1. **Wiring A or B** (§2.3) — recommend **B** (data-authored cluster lessons;
   exercises the Phase-A pipeline, unblocks `a1-u4`).
2. **`source` tag** — new grammar texts reuse `source:"m11"` (the existing
   "grammar demo" provenance value the validator allows). Fine, or add an
   `m20` value to the `["m8","m11"]` whitelist in `build-content.js`?
   Recommend: **keep `m11`** — provenance of the *pattern*, not the commit.
3. **Batch size** — 7 points + ~18 sentences in one PR, or split
   structural (#1–3, #7) / function-word (#4–6) into two? Recommend **one PR**
   — the points are small and interdependent; splitting doubles the review
   overhead for little isolation gain.
4. **`gr:noun-number`** scope — recognition only (dual/plural forms shown, not
   drilled), or also a production exercise? Recommend **recognition only** at
   A1; production of sound plurals is an A2 concern.

---

## 5. Not in this batch

A1 vocabulary (Batches 2–3), A1 reading/listening texts (Batch 4), A1 writing
sets (Batch 5), any A2+ grammar, any runtime/engine change, any UI redesign.
