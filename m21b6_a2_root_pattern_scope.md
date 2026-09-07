# M21 — Batch 6: a2-u3, Root & Pattern — First Look

**Status:** scope, held for approval. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [m21_content_scaleout_scope.md](m21_content_scaleout_scope.md) §2.2, step 4 ("`a2-u3` (Root & Pattern) — smaller than the others; largely wiring `roots.json`'s existing 11 clusters into a lesson"). `a2-u4` is now fully complete (batches 1–5), so this is the next batch in the milestone doc's own approved order — ahead of `a2-u5` (reading) and `a2-u6` (listening), both of which need the `narrative`/`everyday-exchanges` wordlist topics this batch does not touch.
**Base:** `main` @ `d9274c4` (batch 5 / PR #35 merged).
**Branch:** `claude/pensive-darwin-7mao26`, already restarted from `main`.

---

## 1. What this batch covers

`a2-u3` ("Root & Pattern — First Look") is currently `"status": "planned"` in `content/curriculum.json`, prereq `a2-u1` (available). This batch delivers its one lesson and flips the unit to `available` — the third A2 unit to close out completely, after `a2-u1`/`a2-u2` (batch 1) and `a2-u4` (batches 1–5).

## 2. Checked before planning

- **`content/roots.json`** (built in M20.5 for quiz distractors, never loaded into the compiled app — confirmed via `grep` of `build-content.js` and `index.html`; the only `index.html` mention is a comment explaining why it's *unlike* the Unicode-transform helpers) holds exactly 11 verified, sourced root clusters, all built from lexemes that already exist. Reusing them here needs no new engine capability — the clusters get hand-transcribed into a lesson using the existing `explain`/`reading-practice`/`practice-choice`/`complete` step types, the same way every other batch this session has worked. `roots.json` itself is untouched by this batch (it stays the distractor-pool source it always was).
- **`content/wordlists/a2.json`**'s own `_meta` note (written back in batch 1) already flags that `a2-u3` "mostly re-clusters EXISTING lexemes... has no dedicated topic here" and that a future batch may add "a few new lexemes directly if a cluster genuinely needs one, rather than pre-listing them speculatively." Checked while planning the 4 example sentences below: **zero new lexemes are needed** — every word in every planned sentence already exists.
- **`content/grammar.json`** has 17 entries; none cover derivational morphology. `gr:root-pattern` is a new, non-colliding id.
- Verified the exact vowelling of every lexeme touched below directly against `content/lexemes.json` (not from memory) before drafting any sentence: `كِتَاب` (lex:sch-06), `كَتَبَ` (lex:ver-04), `مَكْتَبَة` (lex:pla-10), `مَطْعَم` (lex:pla-06), `طَعَام` (lex:fc-14), `جَدّ` (lex:peo-07), `جَدَّة` (lex:peo-08), `جَدِيد` (lex:adj-06), `خَمْسَة` (lex:num-05), `الْخَمِيس` (lex:tim-15), `خَامِس` (lex:tim-45, batch 5's masculine ordinal), `لَذِيذ` (lex:foo-27), `يَوْم` (lex:tim-22).

## 3. What ships

### 3.1 Zero new lexemes

All 11 clusters' 24 lexeme references are pre-existing. The lesson's `objectives` array cites them directly:

| Root | Gloss | Lexemes |
|---|---|---|
| ك-ت-ب | write | `lex:sch-06` كِتَاب, `lex:ver-04` كَتَبَ, `lex:pla-10` مَكْتَبَة |
| ط-ع-م | taste, food | `lex:pla-06` مَطْعَم, `lex:fc-14` طَعَام |
| ص-ب-ح | morning, shine | `lex:obj-06` مِصْبَاح, `lex:tim-05` صَبَاح |
| د-ر-س | study | `lex:sch-01` مَدْرَسَة, `lex:sch-09` دَرْس |
| ج-د-د | new, renew | `lex:adj-06` جَدِيد, `lex:peo-07` جَدّ, `lex:peo-08` جَدَّة |
| ر-أ-ي | see | `lex:ver-08` رَأَى, `lex:obj-07` مِرْآة |
| و-ح-د | one, alone | `lex:num-01` وَاحِد, `lex:tim-11` الْأَحَد (Sunday) |
| ث-ن-ي | two, fold | `lex:num-02` اِثْنَان, `lex:tim-12` الِاثْنَيْن (Monday) |
| ث-ل-ث | three | `lex:num-03` ثَلَاثَة, `lex:tim-13` الثُّلَاثَاء (Tuesday) |
| ر-ب-ع | four | `lex:num-04` أَرْبَعَة, `lex:tim-14` الْأَرْبِعَاء (Wednesday) |
| خ-م-س | five | `lex:num-05` خَمْسَة, `lex:tim-15` الْخَمِيس (Thursday) |

All 11 are already sourced (Hans Wehr root morphology, cross-checked against Wiktionary — see `content/m20.5-language-tools-review.md`); this batch adds no new root-morphology claims, only presents the existing ones to the learner for the first time.

### 3.2 One new grammar point: `gr:root-pattern`

**Rule:** Most Arabic words are built from a root (جَذْر) — usually three consonants carrying a core, abstract meaning — poured into a pattern (وَزْن) that adds a grammatical role: a place, an instrument, an action, a doer. كَتَبَ (he wrote), كِتَاب (book), and مَكْتَبَة (library) all share the root ك-ت-ب ("write"); the vowels and extra letters around those three consonants belong to the pattern, not the root. A bare root isn't itself a pronounceable word — د-ر-س only becomes sayable once a pattern is applied: دَرْس (lesson), مَدْرَسَة (school, literally "the place where studying happens"). Recognising a shared root is a shortcut to guessing an unfamiliar word's rough meaning long before you know the whole vocabulary.

**commonErrors:**
- Assuming any two words that merely *look* alike share a root — root-sharing means the same three consonants in the same order, not surface resemblance.
- Expecting one pattern to always carry one fixed meaning — patterns are strong tendencies (مَفْعَل often marks "place of," مِفْعَال often marks "instrument"), not absolute rules; the same pattern surfaces different senses on different roots.
- Treating the root like an English base word that gets prefixes/suffixes stuck on it — the root is an abstract three-consonant skeleton that never stands alone as a word; it gets its vowels and shape entirely from the pattern poured into it.

**examples:** 4 new texts, each pairing two members of one cluster in a natural sentence built only from vocabulary and grammar already taught:

| id | Arabic | Gloss | Cluster | Grammar reused |
|---|---|---|---|---|
| `txt:gram-root-katab` | هَذَا كِتَابٌ مِنَ الْمَكْتَبَةِ | This is a book from the library. | ك-ت-ب | demonstratives, core prepositions |
| `txt:gram-root-taam` | الطَّعَامُ فِي الْمَطْعَمِ لَذِيذٌ | The food in the restaurant is delicious. | ط-ع-م | nominal sentence, core prepositions |
| `txt:gram-root-jadid` | بَيْتُ جَدِّي جَدِيدٌ | My grandfather's house is new. | ج-د-د | iḍāfa, attached possessive |
| `txt:gram-root-khamis` | الْخَمِيسُ هُوَ الْيَوْمُ الْخَامِسُ | Thursday is the fifth day. | خ-م-س | nominal sentence + هُوَ-linking and definite-noun/definite-ordinal agreement, both from `gr:dates` |

The ج-د-د pair is deliberately included even though "grandfather" and "new" look unconnected in translation — it's the same genuinely non-obvious, real, cited root family `roots.json` already flagged, and makes a better teaching point about roots not always predicting an obvious sense than the more transparent pairs do. The خ-م-س sentence is the one deliberate callback across three separate batches' vocabulary (numbers, weekdays, and batch 5's masculine ordinals) — the clearest "aha" the lesson can offer.

**prereqs:** `["gr:idafa"]` — the only one of the four example sentences with a real grammatical dependency beyond A1 material is `txt:gram-root-jadid`'s iḍāfa. Open to dropping this sentence instead if a bare-A1 prereq is preferred (see §4.2).

**Sourcing:** Ryding, *A Reference Grammar of Modern Standard Arabic* (root-and-pattern morphology chapter) for the general rule and the two common-error framings; `content/roots.json` + `content/m20.5-language-tools-review.md` for the 11 clusters themselves (already reviewed, not re-litigated here).

### 3.3 One new lesson

`content/lessons/a2-root-pattern.json`, `a2-u3`'s first (and only) lesson, same shape as every other batch this session:
1. `explain` — introduce root vs. pattern with the ك-ت-ب/د-ر-س examples from the rule text.
2. `reading-practice`, `fromObjectives: true` — all 11 clusters' lexemes, then the 4 new example sentences.
3. Three `practice-choice` steps:
   - "Which word shares a root with كِتَاب؟" (مَكْتَبَة correct; مَدْرَسَة, طَعَام wrong — different roots).
   - "الْأَحَد (Sunday) and وَاحِد (one) share a root. What does it mean?" (correct: "one, alone" — five of the seven weekday names are built directly on the numbers 1–5).
   - "جَدّ and جَدِيد share the letters ج-د-د. Are they really related?" (correct: yes, a real documented root family, even though the English translations don't suggest it — testing the *other* direction of common-error #1: not every resemblance is coincidence either).
4. `complete`.

`a2-u3` flips `planned` → `available`; blurb's "In development" clause drops.

### 3.4 Proof

Same battery as every prior batch: `build-content.js --check`/`--lint` (0 new warnings — no new lexemes to lint, only 1 new grammar point + 4 new texts to structurally validate), `build-audio-manifest.js --check`, `tools/qa-harness.js`, `tools/a11y-audit.js` clean, live-browser confirmation that `a2-u3` shows its one lesson AVAILABLE.

## 4. Open questions

1. **Batch identity/order** — treating this as the milestone doc's step 4 (root/pattern), ahead of `a2-u5`/`a2-u6`, since both of those need the still-untouched `narrative`/`everyday-exchanges` wordlist topics and this batch doesn't. Recommend **yes, as originally approved order**.
2. **`txt:gram-root-jadid`'s iḍāfa dependency** — the only one of the 4 sentences that reaches past A1. Recommend **keep it**: iḍāfa is already A2-available (`a2-u2`, order 2, sequenced right before `a2-u3`, order 3, so every learner reaching this lesson through the normal unit order has already met it), and the ج-د-د pairing is the single best teaching moment in the batch.
3. **All 11 clusters in one lesson**, not split or trimmed — matches the milestone doc's own characterization of this as a small, single-lesson unit, and the cognitive load here is recognition of already-known words, not fresh memorization. Recommend **yes**.
4. **Practice-question 3's "are they really related" framing** — deliberately teaches that shared roots aren't always semantically obvious, rather than only testing the easy, transparent pairs. Recommend **keep it**; happy to swap for a more conventional recognition question if you'd rather keep all three questions the same shape.

## 5. Not in this batch

- ❌ `narrative`/`everyday-exchanges` vocabulary from `wordlists/a2.json` — still `a2-u5`/`a2-u6`'s job, unchanged.
- ❌ Any additional root clusters beyond the existing 11 — `roots.json` itself isn't extended here; a future batch can add more if a real teaching need shows up.
- ❌ Any engine/UI change — pure content, same proven pipeline, no new step types.
- ❌ `a2-u5` (reading) / `a2-u6` (listening) / A2 writing — later in the parent milestone's order, each still needing its own scope doc.
