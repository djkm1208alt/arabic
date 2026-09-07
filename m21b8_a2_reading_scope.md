# M21 — Batch 8: a2-u5, Reading Short Paragraphs

**Status:** scope, held for approval. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [m21_content_scaleout_scope.md](m21_content_scaleout_scope.md) §2.2, step 5 ("A2 reading (`a2-u5`) — connected, fully-vowelled paragraphs built only from A2-or-below vocab + grammar, same discipline as M20 batch 4"). Batch 7 specifically stocked the `narrative` connector vocabulary this batch needed — this is the batch that finally spends it.
**Base:** `main` @ `c915959` (batch 7 / PR #37 merged).
**Branch:** `claude/pensive-darwin-7mao26`, already restarted from `main`.

---

## 1. What this batch covers

`a2-u5` ("Reading Short Paragraphs") is currently `"status": "planned"`, prereq `a1-u2` (available). This is the first batch to write genuinely **connected, multi-sentence text** — every text in this project so far (89 of them) has been one standalone sentence tied to a single grammar point. Two short narrative paragraphs, one lesson, `a2-u5` flips to `available` — the fourth A2 unit to close out completely.

## 2. Checked before planning

- Confirmed the unit's own blurb — "Fully-vowelled connected text on familiar topics; separating main idea from detail" — needs two things nothing in this project has built yet: (a) multi-sentence connected prose, not single sentences, and (b) a comprehension angle (main idea vs. detail), not just grammar recognition. Neither needs a new *step* type — `practice-choice` can already ask a comprehension question exactly as easily as a grammar question.
- **Checked whether `textType` is validated or branched on anywhere** before assuming a new value is free: grepped every `tools/*.js` file. It's read in exactly one place beyond pass-through compilation — `build-audio-manifest.js`'s `t.textType === "dialogue" ? "dialogue" : "sentence"` — which means any *other* value (including a new `"paragraph"`) already falls through safely to the "sentence" audio-type bucket with no code change needed. Nothing else — not `build-content.js`, not `content-lint.js`, not the runtime in `index.html` — branches on `textType` at all; `words` and dialogue's own `turns` array are read generically. Introducing `"paragraph"` as a new `textType` value is a pure content/labelling addition, not an engine change.
- **Picked topics deliberately re-using vocabulary already confirmed in the lexicon**, checked lexeme-by-lexeme rather than assumed: `سَافَرَ`/`وَصَلَ`/`رَجَعَ` (lex:ver-26/27/28) already carry example sentences in *exactly* the shape this batch needs (`وَصَلَ الْقِطَار`, `رَجَعَ إِلَى الْبَيْت`); `اِشْتَرَى` (lex:ver-23) already has `اِشْتَرَى كِتَابًا` as its own example — an indefinite-accusative object, the exact construction reused below; `قَرَأَ` (lex:ver-05) is A0-level, already demonstrated with an accusative object (`قَرَأَتِ الْكِتَاب`). `كَانَ` + accusative predicate (`gr:kana`) is reused twice, matching its own existing examples (`كَانَ الْبَيْتُ كَبِيرًا`, `كُنْتُ فِي الْبَيْتِ`) letter-for-letter in shape.
- Result: **zero new lexemes needed.** Both paragraphs below are built entirely from A0/A1 vocabulary plus batch 7's narrative connectors.
- Checked for grammar not yet taught before drafting: dropped an early draft's use of the circumstantial accusative (ḥāl, e.g. "returned home *happy*") once I noticed it's not a taught construction anywhere in this curriculum — replaced with a second `كَانَ` + accusative-predicate sentence instead, reusing an already-taught pattern rather than silently introducing an untaught one.

## 3. What ships

### 3.1 Zero new lexemes, zero new grammar points

Every word below already exists; every construction (VSO past tense, `كَانَ` + accusative predicate, preposition + genitive, sun-letter assimilation) is already taught. This batch is pure application — same discipline as batch 4 (prices) and batch 6 (root & pattern).

### 3.2 One new `textType`: `"paragraph"`

Structurally like `"sentence"` (`vowelled`/`translit`/`en`/`audio`/`level`/`skills`/`prereqs`), but instead of a flat `words` array (which the rest of the corpus uses for a literal per-word gloss), a paragraph gets a `sentences` array — one entry per sentence, `{ar, translit, en}` — mirroring exactly how `"dialogue"` already got its own `turns` array rather than overloading `words` at the wrong granularity.

### 3.3 Two new texts

**`txt:read-para-trip`** (concept: `narrative`):

> أَوَّلًا، اشْتَرَى الطَّالِبُ تَذْكِرَةً. ثُمَّ سَافَرَ بِالْقِطَارِ إِلَى الْمَدِينَةِ. أَثْنَاءَ الرِّحْلَةِ، قَرَأَ كِتَابًا. أَخِيرًا، وَصَلَ الْقِطَارُ، وَرَجَعَ الطَّالِبُ إِلَى الْبَيْتِ. كَانَ سَعِيدًا.
>
> *First, the student bought a ticket. Then he traveled by train to the city. During the trip, he read a book. Finally, the train arrived, and the student returned home. He was happy.*

Four connectors in one short narrative: أَوَّلًا (firstly) → ثُمَّ (then) → أَثْنَاءَ (during) → أَخِيرًا (finally). Every verb (اِشْتَرَى، سَافَرَ، قَرَأَ، وَصَلَ، رَجَعَ) already exists at A0/A1; every noun (طَالِب، تَذْكِرَة، قِطَار، مَدِينَة، رِحْلَة، كِتَاب، بَيْت) already exists.

**`txt:read-para-garden`** (concept: `narrative`):

> ذَاتَ يَوْمٍ، كَانَ الطَّقْسُ جَمِيلًا. بَيْنَمَا كَانَ الرَّجُلُ فِي الْحَدِيقَةِ، رَأَى طَائِرَةً فِي السَّمَاءِ فَجْأَةً. طَبْعًا، كَانَ سَعِيدًا.
>
> *One day, the weather was beautiful. While the man was in the garden, he suddenly saw a plane in the sky. Of course, he was happy.*

A different connector set: ذَاتَ يَوْمٍ (the story-opener) → بَيْنَمَا (while) → فَجْأَةً (suddenly) → طَبْعًا (of course). `كَانَ` + prepositional-phrase predicate (`كَانَ الرَّجُلُ فِي الْحَدِيقَةِ`) reuses the exact shape of the already-existing `كُنْتُ فِي الْبَيْتِ`.

Both paragraphs are deliberately built to put 8 of batch 7's 21 new words to their first real use (أَوَّلًا، ثُمَّ، أَثْنَاءَ، أَخِيرًا، ذَاتَ يَوْمٍ، بَيْنَمَا، فَجْأَةً، طَبْعًا) — the remaining 13 (everyday-exchanges phrases, كُلّ, شَيْء, جَرَّبَ, قِصَّة) are `a2-u6`'s job.

### 3.4 One new lesson

`content/lessons/a2-reading-paragraphs.json`, `a2-u5`'s one lesson:
1. `explain` — what changes when reading a paragraph instead of a sentence: connectors signal the *order* of events, and a comprehension question can ask about the whole passage, not just one line.
2. `reading-practice`, `fromObjectives: true` — both paragraphs, sentence-by-sentence via the new `sentences` field.
3. Three `practice-choice` comprehension questions (not grammar-recognition, per the unit's own "main idea vs. detail" framing):
   - Main idea: "What is the first paragraph mainly about?" (a student's train trip — correct; two plausible-but-wrong distractors built from the same vocabulary).
   - Detail/sequencing: "According to the paragraph, what did the student do أَثْنَاءَ (during) the trip?" (read a book — correct; "bought a ticket" and "returned home" as wrong-but-real-events-from-the-paragraph distractors, testing whether the reader tracked *order*, not just content).
   - Cross-paragraph comprehension: "What happened بَيْنَمَا (while) the man was in the garden?" (he suddenly saw a plane — correct; a distractor pulled from paragraph 1 to check the reader isn't just pattern-matching on "a happy ending").
4. `complete`.

`a2-u5` flips `planned` → `available`; blurb's "In development" clause drops.

### 3.5 Proof

Same battery as every prior batch, plus one addition: since this is the first `"paragraph"`-type text, `tools/qa-harness.js`'s existing "catalog lesson walks to completion" check exercises the new `sentences`-array rendering path for the first time — a real functional check, not just a content-shape check.

## 4. Open questions

1. **New `sentences` field on `paragraph` texts, distinct from `words`** — matches the precedent `dialogue`/`turns` already set (a new textType gets its own appropriately-named array) rather than overloading `words` at sentence-level granularity. Recommend **yes**.
2. **Two paragraphs, one lesson** — matches `a2-u3`'s own "smaller unit, one lesson" shape rather than splitting into two lessons for two short paragraphs. Recommend **yes**; open to a third paragraph or a second lesson if you'd rather this unit carry more weight.
3. **Comprehension questions instead of grammar-recognition questions** — a genuinely different question style from every prior batch's `practice-choice` steps, chosen because the unit's own blurb specifically names "separating main idea from detail," not grammar. Recommend **yes**.
4. **Zero new grammar point** — the batch's only "new" content is the reading-connected-text *skill*, not a rule; every sentence reuses `gr:verbal-sentence`, `gr:kana`, and `gr:core-prepositions` exactly as already taught. Recommend **yes, as reasoned above**.

## 5. Not in this batch

- ❌ `a2-u6` (Everyday Exchanges dialogues) — later in the parent milestone's order, still needing its own scope doc; the 13 unused batch-7 words are reserved for it.
- ❌ Any change to `content/roots.json`, `wordlists/a2.json`, or `_lint-allow.json` — nothing here was unanticipated.
- ❌ Any new step type or `exerciseType` — `explain`/`reading-practice`/`practice-choice`/`complete` unchanged; only a new *text* shape (`paragraph`/`sentences`), not a new *step* shape.
- ❌ A1's own `wordlists/a1.json`/A1 content — untouched.
