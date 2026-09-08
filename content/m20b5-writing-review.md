# M20 Phase B — Batch 5 review: A1 writing / dictation

**Scope:** [m20b5_a1_writing_scope.md](../m20b5_a1_writing_scope.md) (approved, all Q1–Q5 taken as recommended).
**Branch:** `feature/m20-a1-writing`, rebased onto `origin/main` (see §6).
**For sign-off before the draft PR.**

---

## 1. What shipped

### 1.1 Pipeline — `build-content.js` (build-time only)

- `graphemeTiles()` / `isSpellable()` helpers — byte-identical to the runtime
  `graphemeTiles()`; the compile step asserts `target.join("") === source`.
- `"exercise"` added to `FROM_OBJECTIVES_OK`. An `exercise` step with
  `fromObjectives: true` and `exercise: { kind: "build", unit }` compiles to
  **one `build` exercise per eligible objective**:
  - `unit: "grapheme"` → one per lexeme objective that spells to 3–6 tiles;
    `target` = `graphemeTiles(lexeme.ar)`.
  - `unit: "word"` → one per text objective with 2–6 `words[]`;
    `target` = `text.words[].surface`.
  - `exercise.audio: true` on the authored step → each compiled item carries
    `audio` (the lexeme `ar` / text `vowelled`).
- Validation: `fromObjectives` on `exercise` requires `kind:"build"` +
  `unit ∈ {grapheme, word}` + ≥ 1 eligible objective; grapheme items must
  reconstruct their source string.

No Arabic is inlined in the lesson files — the batch-1 precedent (which extended
`compile()` to expand `txt:` objectives into `reading-practice`).

### 1.2 Runtime — `index.html`, one additive hook (Q1 = B)

```js
// exerciseTypes.build.render, right after the prompt/hint:
if (item.audio) host.appendChild(buildAudioControl(item.audio, { label: "Listen", ariaLabel: "Hear the word to spell" }));
```

4 lines. **No existing `build` item has an `audio` field** — every pre-B5 call
(the M18 generator, `exGenBuild`, the review runner) renders byte-identically,
confirmed by the seeded-RNG byte-compare and a live trace of an M18 generated
lesson. No new `exerciseTypes` kind, no new `stepRenderers` entry, no CSS.

### 1.3 Object tagging — `content/lexemes.json` + `content/texts.json`

**Scope note — this goes slightly beyond §3 of the approved scope.** Acceptance
criterion #15 ("the `writing` strand moves off *keep going*") turned out to be
un-meetable as written: **no A1 object carried the `writing` skill** — only the
28 A0 `let:` objects do — so `deriveLevel("writing")` could never leave
"insufficient evidence" regardless of how many `build` exercises a learner
completed, and M18's "first machine-checkable writing signal" fed nothing.

Fix: **`"writing"` added to the `skills[]` of the 23 objects these lessons use
as writing-exercise targets** — the 16 spellable lexemes + the 7 nominal-sentence
texts. This is the correct data model (an object's `skills` lists what it can
assess; spelling / sentence-construction *is* writing assessment), it is purely
additive, and it is the same pattern as batch 1 (A1 grammar objects) and batch 4
(A1 text objects) creating a strand's A1 content.

Effect: after a learner completes an A0 alphabet-writing lesson **and** all three
B5 lessons, `deriveLevel("writing")` returns **`A1 · provisional`** ("from
completed lessons") and the Progress "Your skills" panel shows
**"Writing — A1 · Beginner · provisional"** (verified live). Never `firm` —
`writing` is `assess: "partial"`, so provisional is its ceiling. Every other
unpractised strand still reads "keep going". If you'd rather not tag objects and
drop acceptance #15, the tags come out in one revert and the lessons still work
(the `InteractionEvent`s still log and still feed the review scheduler / mistake
queues) — the headline level just stays "keep going".

### 1.4 Content — 3 data lessons + 3 curriculum nodes

| lesson | unit · order | steps | objectives |
|---|---|---|---|
| `a1-writing-join-spell` | `a1-u1` · 7 | explain ×2 → reading-practice (6 words) → **build/grapheme ×6** → practice-choice → complete | 6 lex (اِسْم · وَلَد · رَجُل · بَنْك · جُبْن · يَوْم) |
| `a1-writing-dictation` | `a1-u3` · 17 | explain → reading-practice (10 words) → **build/grapheme + audio ×10** → practice-choice (audio) → complete | 10 lex (family / food / home) |
| `a1-writing-sentences` | `a1-u1` · 8 | explain → reading-practice (7 sentences) → **build/word ×7** → practice-choice → complete | 5 gr: + 7 txt: (batch-4 / batch-1 nominal sentences) |

**Zero new Arabic objects** — every target traces to a merged lexeme / text.
Every explain-step glyph is a positional form of an already-taught A0 letter,
shown illustratively (the `a1-grammar-structural` precedent).

### 1.5 Compiled `build` targets (grapheme fidelity — every `target.join("")` = the source `ar`)

**`a1-writing-join-spell` / `a1-writing-dictation`:**

| objective | en | target tiles | join = ar |
|---|---|---|---|
| lex:peo-20 | name | `اِ · سْ · م` | ✓ اِسْم |
| lex:peo-15 | boy | `وَ · لَ · د` | ✓ وَلَد |
| lex:peo-16 | man | `رَ · جُ · ل` | ✓ رَجُل |
| lex:pla-14 | bank | `بَ · نْ · ك` | ✓ بَنْك |
| lex:foo-18 | cheese | `جُ · بْ · ن` | ✓ جُبْن |
| lex:tim-22 | day | `يَ · وْ · م` | ✓ يَوْم |
| lex:peo-14 | child | `طِ · فْ · ل` | ✓ طِفْل |
| lex:peo-19 | aunt (paternal) | `عَ · مَّ · ة` | ✓ عَمَّة |
| lex:peo-21 | neighbour | `جَ · ا · ر` | ✓ جَار |
| lex:foo-16 | juice | `عَ · صِ · ي · ر` | ✓ عَصِير |
| lex:foo-17 | egg | `بَ · يْ · ضَ · ة` | ✓ بَيْضَة |
| lex:foo-19 | salt | `مِ · لْ · ح` | ✓ مِلْح |
| lex:foo-20 | apple | `تُ · فَّ · ا · ح` | ✓ تُفَّاح |
| lex:foo-27 | delicious | `لَ · ذِ · ي · ذ` | ✓ لَذِيذ |
| lex:hom-13 | wall | `جِ · دَ · ا · ر` | ✓ جِدَار |
| lex:hom-16 | clean | `نَ · ظِ · ي · ف` | ✓ نَظِيف |

**`a1-writing-sentences` / build-word:**

| objective | target (word tiles) |
|---|---|
| txt:read-weather-hot | `الطَّقْسُ · حَارٌّ` |
| txt:read-room-clean | `الْغُرْفَةُ · نَظِيفَةٌ` |
| txt:read-this-my-house | `هَذَا · بَيْتِي` |
| txt:gram-dem-the-house | `هَذَا · الْبَيْتُ · كَبِيرٌ` |
| txt:read-that-man-doctor | `ذَلِكَ · الرَّجُلُ · طَبِيبٌ` |
| txt:read-book-on-table | `الْكِتَابُ · عَلَى الطَّاوِلَةِ` |
| txt:read-tired-but-happy | `أَنَا · مُتْعَبٌ · لَكِنْ · سَعِيدٌ` |

(`عَلَى الطَّاوِلَةِ` is one tile — `words[]` groups the prepositional phrase; the
learner assembles meaning units, which is fine at A1.)

---

## 2. Acceptance criteria — results

| # | criterion | result |
|---|---|---|
| 1 | no new renderer / kind; only the ≤ 8-line audio hook in `index.html` | ✅ 4-line `if (item.audio)` hook, nothing else in script |
| 2 | `build` unchanged for existing callers | ✅ byte-compare + live M18-generated-lesson trace (no `audio` field → no audio control) |
| 3 | no new CSS, no nav / Learn / Progress / placement change | ✅ (the "Your skills" panel *value* for writing changes — that is #15, intended) |
| 4 | inventory closure — every Arabic string → an object | ✅ 0 unmatched; 0 new objects |
| 5 | level closure — every objective A1-or-below | ✅ `--check` monotonicity clean |
| 6 | grapheme / word fidelity | ✅ compile-time assert + the table in §1.5 |
| 7 | dictation honesty — audio before/with every spelling item | ✅ dictation lesson: `build` items carry `audio`; the others are preceded by a `reading-practice` audio step |
| 8 | `build-content.js --check` green, in sync | ✅ 437 objects, in sync |
| 9 | `--lint` 0 linguistic errors / 0 new warnings; orphans unchanged | ✅ 0 linguistic; 83 orphan warnings (= origin/main baseline) |
| 10 | `--write-app` byte-stable; `m14-compare2` shows only the new lessons | ✅ "NO UNEXPECTED DIFFERENCES" vs `origin/main` |
| 11 | audio manifest `--check` clean | ✅ 573 targets (= origin/main; the batch-5 words were already TTS targets) |
| 12 | `lint-fixtures` pass | ✅ |
| 13 | `m15`–`m19` func suites pass | ✅ (m15 object count 430→437 for origin/main's residual lexemes; m16 node count 39→42 for the 3 new nodes — B5 adds 0 objects) |
| 14 | all new lessons run every step, 0 console errors; one `writing` `InteractionEvent` per `build` | ✅ join-spell 7 events / dictation 11 / sentences 8; 0 console errors across all three |
| 15 | writing strand moves off "keep going" | ✅ **via the §1.3 object tagging** — `A1 · provisional` after A0-writing + the 3 lessons; panel row "Writing — A1 · Beginner · provisional" |
| 16 | new exercises only in their lessons — not the M18 generator elsewhere, not placement, not review-until-seen | ✅ generator / `exGenBuild` unchanged; placement self-rates writing; review folds from the logged events |
| 17 | dark + 320 px — tile bank wraps, no page overflow, RTL, Western digits | ✅ screenshot: dictation lesson at 320 px dark, audio control + tiles clean |
| 18 | `ROADMAP.md` + `m20-lint-proof.md` + this review doc | ✅ |

---

## 3. Live trace evidence

- **join-spell** — explain ×2 (positional forms; the six non-connectors) →
  reading-practice (6 words, 🔊) → 6 × build/grapheme (correct → `build-answer
  right`, `lessonCanProceed`, one `{objectId, skill:"writing", itemType:"build",
  correct, latencyMs, ts}` per item; a deliberately-wrong build → `build-answer
  wrong`, `correct:false`, recoverable) → practice-choice ("which letter does not
  join forward?" → د) → complete → recorded in `lessonsCompleted` +
  `objectsIntroduced`.
- **dictation** — 🔊 Listen plays the target word (`طِفْل`), 🐢 Slower present,
  "🔈 Synthesized" provenance tag; audio control sits **above** the tile bank;
  practice-choice step carries its own `audioText`.
- **sentences** — reading-practice shows the 7 sentences with audio; 7 ×
  build/word, tiles are whole words, `.build-answer` RTL with an 8 px gap
  between word chips; practice-choice "find the topic" → `الطَّقْسُ`.
- **0 console errors** across all three lessons + the Progress panel + the Learn
  view (a1-u1 shows lessons 7–8, a1-u3 shows lesson 17).
- **Regression:** M18-generated `a1-colours` build step — no `audio` field, no
  audio control rendered, tiles + Check identical to pre-B5.

---

## 4. What A1 writing still does not cover (from the scope, unchanged)

Free composition (M19 `short-write`); contextual stroke-order / handwriting of
joined forms (a separate later milestone — `CURRICULUM_ARCHITECTURE.md` §10.6);
the لا ligature / cursive proportion; spelling of > 6-tile words or whole-sentence
dictation; true blind dictation (the `build` prompt shows the gloss + translit).
All correctly later.

---

## 5. Files

```
 content/curriculum.json                    | +3 lesson nodes
 content/lessons/a1-writing-join-spell.json  | new
 content/lessons/a1-writing-dictation.json   | new
 content/lessons/a1-writing-sentences.json   | new
 content/lexemes.json                        | +"writing" on 16 skills[]
 content/texts.json                          | +"writing" on 7 skills[]
 index.html                                  | audio hook (4 lines) + compiled CONTENT (3 lessons, 23 re-tagged objects)
 tools/build-content.js                      | graphemeTiles/isSpellable, FROM_OBJECTIVES_OK += exercise, validation, compile branch
 m20b5_a1_writing_scope.md                   | scope (already committed)
 content/m20b5-writing-review.md             | this doc
 ROADMAP.md                                  | M20 B5 row
```

---

## 6. Rebase note

The branch was cut from `main @ 958946c`. While batch 5 was in progress,
`origin/main` advanced (PRs #24 / #26: a 7-lexeme "B3 residual cleanup" closing
`wordlists/a1.json`, and a 3-blurb lang/dir fix). The branch was **rebased onto
`origin/main`** — the residual lexemes and the blurb fixes are all intact and
present in the compiled `CONTENT`; the byte-compare in §2 (#10) runs against the
current `origin/main`, not the old base. No batch-5 change touches any file the
`origin/main` commits touched except `content/lexemes.json` (disjoint entries —
they added new lexemes, B5 tags a different 16) and the compiled `CONTENT` block
(regenerated from the merged sources).
