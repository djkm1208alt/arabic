# M21 — Batch 10: A2 Writing

**Status:** scope, held for approval. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [m21_content_scaleout_scope.md](m21_content_scaleout_scope.md) §2.2, step 7 ("A2 writing — extends the existing `build`/`exerciseTypes` machinery to A2 vocabulary and the new grammar; likely small, same shape as M20 batch 5"). With `a2-u1`–`a2-u6` all complete (batches 1–9), this is the last unclaimed item in M21's original A2 sequence.
**Base:** `main` @ `44da7cd` (M21.6 / PR #41 merged).
**Branch:** `claude/pensive-darwin-7mao26`, already restarted from `main`.

---

## 1. What this batch covers

A2 has no writing practice at all yet — every A2 lesson so far exercises reading, listening, speaking, or grammar recognition, never production. This batch adds it, reusing the exact `build` exercise-type machinery M20's own A1-writing batch (PR #27) already proved, applied to A2's grammar and vocabulary instead of A1's.

## 2. Checked before planning

- Re-read the actual A1 writing lessons rather than going from memory: `a1-writing-sentences.json` (`exercise: {kind:"build", unit:"word"}`, `fromObjectives: true`, pulling word-tiles from 7 already-existing `txt:` objectives) and `a1-writing-dictation.json` (`exercise: {kind:"build", unit:"grapheme", audio:true}`, pulling letter-tiles from 10 already-existing `lex:` objectives). Both reuse the identical `build` exercise type with a different `unit`; neither needs any new engine code.
- **A1's third writing lesson, `a1-writing-join-spell`, doesn't need an A2 counterpart** — letter-joining mechanics (positional forms, the six non-connectors) don't change between levels; that's already-taught, level-independent mechanics, not something A2 needs to re-teach.
- **No dedicated "A2 writing" unit exists, by design** — confirmed no `a2-u7` (or similar) stub anywhere in `content/curriculum.json`, matching A1's own precedent exactly: `a1-writing-sentences`/`a1-writing-dictation` both live as extra lessons on existing thematic units (`a1-u1`, `a1-u3`), not a separate "writing unit." This batch does the same.
- Checked every candidate text/lexeme directly against the current files, not from memory.

## 3. What ships: 2 new lessons, zero new lexemes, zero new grammar, zero new texts

Pure application — every sentence and word below already exists.

### 3.1 `a2-writing-sentences` — building A2's three signature sentence shapes

Wired onto `a2-u1` as its second lesson (order 2, after `a2-verbal-sentence`). Reuses 7 already-existing texts spanning A2's first three grammar points — VSO past tense, `كَانَ` + accusative predicate, and iḍāfa — the direct A2 analog of `a1-writing-sentences`' own nominal-sentence tiles:

| id | Arabic | Grammar point |
|---|---|---|
| `txt:gram-past-vso` | ذَهَبَ الرَّجُلُ إِلَى الْمَدْرَسَةِ | `gr:verbal-sentence` (VSO) |
| `txt:gram-past-1sg` | أَنَا قَرَأْتُ الْكِتَابَ | `gr:verbal-sentence` (1st person + object) |
| `txt:gram-kana-house` | كَانَ الْبَيْتُ كَبِيرًا | `gr:kana` |
| `txt:gram-kana-fem` | كَانَتِ الْمَرْأَةُ كَبِيرَةً | `gr:kana` (feminine agreement) |
| `txt:gram-idafa-phrase` | بَابُ الْبَيْتِ | `gr:idafa` (bare phrase) |
| `txt:gram-idafa-sentence` | بَيْتُ الرَّجُلِ كَبِيرٌ | `gr:idafa` (as a sentence topic) |
| `txt:gram-idafa-pen-student` | قَلَمُ الطَّالِبِ جَدِيدٌ | `gr:idafa` (second instance, different vocabulary) |

Steps: `explain` (what changes building an A2 sentence vs. A1's — a verb can now come first, and two nouns can combine without a linking word) → `reading-practice` (`fromObjectives`) → `exercise` (`build`/`word`, `fromObjectives`) → one `practice-choice` (word-order recognition, e.g. "which word starts this sentence — the verb or the subject?") → `complete`.

### 3.2 `a2-writing-dictation` — spelling 8 A2 words from sound

Wired onto `a2-u4` as its fifth lesson (order 5, after `a2-dates`). 8 words spanning five different A2 batches, picked for phonetic variety (a shadda-doubled root, a mid-word hamza, a loanword's unusual spelling) the way A1's own dictation picked interesting rather than trivial words:

| id | Arabic | Gloss | Batch |
|---|---|---|---|
| `lex:num-20` | عِشْرُونَ | twenty | 2 |
| `lex:num-half` | نِصْف | half | 3 |
| `lex:num-quarter` | رُبْع | quarter | 3 |
| `lex:tim-62` | دِيسِمْبِر | December | 5 |
| `lex:sch-22` | قِصَّة | story | 7 |
| `lex:prt-27` | أَثْنَاءَ | during | 7 |
| `lex:shp-13` | مَقَاس | size | 7 |
| `lex:shp-14` | خَصْم | discount | 7 |

Steps: `explain` (same "listen, then write" framing as A1's) → `reading-practice` (`fromObjectives`) → `exercise` (`build`/`grapheme`, `audio: true`, `fromObjectives`) → one `practice-choice` (listen-and-identify, matching A1's own closing-step shape) → `complete`.

## 4. Open questions

1. **Two lessons, not three** — dropping the letter-joining-mechanics lesson A1 had, since positional forms don't change at A2. Recommend **yes, as reasoned in §2**.
2. **Wiring onto `a2-u1`/`a2-u4` rather than a new dedicated unit** — matches A1's own precedent exactly (no separate "writing unit" exists there either). Recommend **yes**.
3. **7 sentence-building texts spanning 3 grammar points in one lesson**, rather than splitting by grammar point — matches `a1-writing-sentences`' own scale (7 texts, one lesson) and these three points were themselves taught together in `a2-u1`'s first lesson. Recommend **yes**.
4. **Dictation words picked for phonetic interest and batch spread rather than by single topic** — mirrors A1's own dictation picking across family/food/home rather than one topic. Recommend **yes**; happy to swap any word if you'd rather a tighter thematic set (e.g., all-shopping or all-numbers).

## 5. Not in this batch

- ❌ A letter-joining/positional-forms lesson — not needed again at A2, per §2.
- ❌ Any new lexeme, grammar point, or text — pure reuse of already-existing, already-vetted content.
- ❌ Any new exercise type or engine change — `build`/`word` and `build`/`grapheme` are both already fully proven by A1's own writing batch.
- ❌ B1 content, M21.6's `label` exercise type, or anything from the concurrent iʿrāb-audit thread — unrelated track.
