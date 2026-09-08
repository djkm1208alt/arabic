# M21 — Batch 14: B1 إنّ وأخواتها, First Look (إنّ / أنّ / لِأَنَّ)

**Status:** scope, held for approval. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b1-u2` ("Relative Clauses & Longer Sentences") ·
[CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) §10.2 B1 grammar spine ("relative clauses
(اَلَّذِي / اَلَّتِي / اَلَّذِينَ …); إنّ وأخواتها"). Batch 13's own scope doc named this as its
first named follow-up (§8): `b1-u2`'s second grammar system, genuinely independent of relative
clauses.
**Base:** `main` (post batch 13 / PR #48 — `b1-u2`'s first lesson, relative clauses, now `available`).
**Branch:** `claude/m21b14-b1-inna-wa-akhawatuha`.

---

## 1. What this batch covers

إنّ وأخواتها ("inna and its sisters") is a family of particles that, like كَانَ (`gr:kana`, already
taught at A2), enters a nominal sentence and shifts one side's case — but the mirror image of كَانَ:
where كَانَ leaves the subject (اِسْم كَانَ) nominative and pushes the *predicate* (خَبَر كَانَ) to
accusative, إنّ's family pushes the *subject* (اِسْم إنّ) to accusative and leaves the predicate
(خَبَر إنّ) nominative: البَيْتُ كَبِيرٌ ("the house is big") → إِنَّ البَيْتَ كَبِيرٌ ("indeed the
house is big") — البَيْتُ's ـُ becomes ـَ, كَبِيرٌ stays exactly as it was.

**This batch takes only two sisters plus one already-known word, not the full family:**

- **إِنَّ** (inna) — opens a sentence for emphasis ("indeed / truly"), the family's namesake and most
  frequent member.
- **أَنَّ** (anna) — subordinates a nominal clause as "that" after a verb of saying/hearing/knowing
  (سَمِعْتُ أَنَّ..., "I heard that..."), أَنَّ's own most common real-world use.
- **لِأَنَّ** (liʾanna, "because") — **already in the lexicon since A1** (`lex:prt-17`) as a fixed
  conjunction, never formally analysed. It is transparently لِ + أَنَّ, and it governs the same
  accusative-subject rule as bare أَنَّ. This batch adds that analysis to the existing entry rather
  than minting a new word — the same "found it already there, just undocumented" pattern batches 11
  and 12 established for hidden derived verb forms.

**Deliberately narrower than the full family**, flagged as follow-ups (§8), not silently dropped:

- **كَأَنَّ** ("as if"), **لٰكِنَّ** (the heavy, case-marking "but" — a genuine minimal pair against
  the already-known light لَكِنْ, `lex:prt-16`), **لَعَلَّ** ("perhaps"), **لَيْتَ** ("would that") —
  four more sisters, same "don't cram every member into one batch" discipline `b1-u1` (verb forms)
  and batch 13 (relative pronouns) already established.
- **Attached-pronoun forms** (إِنَّهُ, أَنَّهَا, etc. — إنّ's family takes pronoun suffixes instead of
  a following noun) — a separate mechanic, not touched here.

## 2. Checked before authoring

- **No sister of إنّ existed anywhere in the lexicon under its case-marking (doubled-nūn, ـّ) spelling
  before this batch** — confirmed by direct search. The only near-hit was **`lex:prt-17` لِأَنَّ
  ("because"), already sitting in the lexicon at A1** since an early batch, spelled correctly with
  the shadda but never formally connected to the إنّ family or its accusative rule. This batch's real
  find, exactly like batch 11/12's hidden verb forms.
- **`lex:prt-16` لَكِنْ ("but," A1) is confirmed to be the *light* form** (لَكِنْ, no shadda, does
  **not** trigger the accusative-subject rule) — a real, distinct word from لٰكِنَّ (the *heavy* form,
  one of the four sisters deferred to §1's follow-up list). This batch does not touch `prt-16` and is
  careful not to conflate the two in the new grammar point's rule text.
- **أَنَّ (this batch, "that," subordinates a full nominal clause) is a different word from أَنْ (the
  subjunctive "to," subordinates a following verb)** — `lex:exp-21`'s existing note on `مُمْكِن...؟`
  already explicitly deferred the subjunctive أَنْ as its own B1 topic. This batch's grammar point
  states the distinction directly so the two identically-transliterable spellings (`anna` vs. `an`)
  are never confused; أَنْ + subjunctive stays out of scope here.
- **All three example sentences reuse only already-taught vocabulary**: `الطَّقْس`/`جَمِيل` (weather
  + "beautiful," already paired in batch 8's paragraph reading), `سَمِعَ` (already-known Form I verb,
  "to hear"), `سَعِيدَة`/`دَافِئ` (happy / warm, both A0–A1). No new content lexemes needed beyond the
  two particles themselves.
- **`gr:kana`'s existing rule text is the natural teaching parallel** — it already states كَانَ's
  case-shift in exactly the vocabulary (اِسْم / خَبَر, nominative / accusative) this batch's rule can
  reuse and explicitly mirror, rather than introducing new terminology from scratch.

## 3. What ships

**2 new lexemes** (`content/lexemes.json`, `pos: "particle"`, `topic: "particles"`, `level: "B1"`):
`إِنَّ` (inna, "indeed / truly") and `أَنَّ` (anna, "that").

**1 existing lexeme annotated, not replaced**: `lex:prt-17` لِأَنَّ gains a `notes` field explaining
it is لِ + أَنَّ and follows the same accusative-subject rule, cross-referencing the new grammar
point. Its `ar`/`translit`/`en`/`level` are untouched.

**1 new grammar point**, `gr:inna-sisters`:

- States the core rule as the mirror of `gr:kana`'s already-taught one: إنّ's family shifts the
  *subject* (اِسْم إنّ) to accusative; the predicate (خَبَر إنّ) stays nominative — the reverse of
  what كَانَ does to a nominal sentence.
- Covers إِنَّ's sentence-opening emphatic use, أَنَّ's subordinating "that" after a verb of
  speech/perception, and لِأَنَّ's "because" (already known, now explained) as one case-marking
  family, not three unrelated words.
- States the أَنَّ-vs-أَنْ distinction explicitly (this batch's أَنَّ takes a full nominal clause;
  the unrelated subjunctive أَنْ, not covered here, takes a following verb).
- Names the four remaining sisters (كَأَنَّ, لٰكِنَّ, لَعَلَّ, لَيْتَ) for recognition, explicitly
  marked "covered in a later unit" rather than left unmentioned.
- `prereqs: ["gr:kana", "gr:nominal-sentence", "gr:verbal-sentence"]` — `gr:kana` for the direct
  mirror-image parallel, `gr:nominal-sentence` for the topic/predicate structure being modified,
  `gr:verbal-sentence` because the أَنَّ example is a verb-initial sentence (`سَمِعْتُ...`) with the
  إنّ-clause nested inside it.

**3 new example texts** (`source: "m11"`, `concept: "inna-sisters"`): `إِنَّ الطَّقْسَ جَمِيلٌ
اليَوْمَ` (إِنَّ, emphatic opener), `سَمِعْتُ أَنَّ الطَّقْسَ جَمِيلٌ اليَوْمَ` (أَنَّ, subordinated
"that"-clause after a verb), `هِيَ سَعِيدَةٌ لِأَنَّ الطَّقْسَ دَافِئٌ` (لِأَنَّ, already-known word
now shown obeying the same rule). Real wording finalized and checked at implementation time; the
pattern above is the design, not a promise every word survives unchanged.

**1 new lesson**, `b1-inna-sisters`, wired onto `b1-u2` as its **second** lesson (`order: 2`, after
batch 13's `b1-relative-clauses`) — same `explain` → `reading-practice` → `practice-choice` × 2–3 →
`complete` shape every B1 lesson so far has used. `b1-u2`'s blurb narrows again to add "إِنَّ, أَنَّ,
and لِأَنَّ" to what's shipped, while the four remaining sisters and object-relative clauses stay
named as still in development.

## 4. Invariants held

- No changes to `content/wordlists/*.json` — إنّ's family are function words, the same status
  relative pronouns and every other particle in the lexicon already has.
- No change to `lex:prt-16` (لَكِنْ) or any other existing lexeme's `ar`/`translit`/`en`/`level`;
  `lex:prt-17` (لِأَنَّ) gains only a `notes` field.
- No change to `gr:kana`, `gr:relative-clauses`, or any other existing grammar point, lesson, or
  `b1-u1`'s content.
- `buildAudioControl()` / `playArabicAudio()` untouched. Zero runtime dependencies / zero runtime
  fetches. No engine change.

## 5. Migration requirements

None. Purely additive (plus one `notes`-field annotation on an existing lexeme).

## 6. Acceptance criteria

- إنّ's family case-shift rule (accusative subject, nominative predicate) is stated correctly and
  matches standard reference-grammar treatment, explicitly framed as كَانَ's mirror image.
- أَنَّ vs. أَنْ distinction stated clearly enough that neither is left ambiguous.
- All 3 example texts reuse only already-taught vocabulary beyond the 2 new particles.
- `tools/qa-harness.js` full regression clean (including the new lesson walking to completion by
  name); `tools/a11y-audit.js` clean.
- `npm run content:check`: +2 lexemes (404→406), +1 grammar point (20→21), +3 texts (106→109),
  +1 lesson.
- `b1-u2` stays `available`; blurb narrows further to name exactly what shipped across both its
  lessons so far.

## 7. Out of scope

- كَأَنَّ, لٰكِنَّ, لَعَلَّ, لَيْتَ — four more sisters, a genuinely separate follow-up batch (§8).
- Attached-pronoun forms of إنّ's family (إِنَّهُ, أَنَّهَا, …) — a separate mechanic.
- The subjunctive أَنْ (as opposed to this batch's أَنَّ) — `lex:exp-21`'s own prior deferral, still
  standing.
- Object-relative clauses and plural/dual relative pronouns — batch 13's own named follow-up,
  unrelated to this batch, still pending as its own future batch.
- "Joining ideas into paragraphs" — `b1-u2`'s remaining named topic, depends on more of `b1-u2`'s
  grammar being in place first.
- Any change to `content/curriculum.json`'s prereq graph beyond `b1-u2` itself.

## 8. Proposed follow-up batches (planning only, not committed)

- **Batch 15 (unclaimed slot from batch 13's own numbering) — Object-relative clauses + plural/dual
  relative pronouns**: batch 13's own named follow-up, independent of this batch.
- **إنّ وأخواتها, completing the set — كَأَنَّ / لٰكِنَّ / لَعَلَّ / لَيْتَ + attached-pronoun forms**:
  completes what this batch deliberately left out, the same two-part shape `b1-u1` (verb forms) and
  now `b1-u2` (relative clauses) both already used.

## 9. Rollout

Plan → this branch → draft PR → review → implementation only on explicit approval, per Master
Standards (same shape as every prior M21 batch).
