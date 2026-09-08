# M21 — Batch 13: B1 Relative Clauses (الَّذِي / الَّتِي, subject-relative only)

**Status:** scope, held for approval. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b1-u2` ("Relative Clauses & Longer Sentences" —
`الَّذِي and its family, إنّ وأخواتها, and joining ideas into paragraphs`) ·
[CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) §10.2 B1 grammar spine ("relative clauses
(اَلَّذِي / اَلَّتِي / اَلَّذِينَ …); إنّ وأخواتها"). `b1-u2` bundles two genuinely separate grammar
systems under one title — same situation `b1-u1` was in with ten verb forms — so this batch takes
only the first: relative clauses. إنّ وأخواتها is its own future batch (§8).
**Base:** `main` (post batch 12 / PR #46 — `b1-u1` covers 8 of 10 derived verb forms).
**Branch:** `claude/m21b13-b1-relative-clauses`.

---

## 1. What this batch covers

The relative pronouns الَّذِي (masculine singular) and الَّتِي (feminine singular) — "who/which/
that" — and **subject-relative clauses only**: a relative clause where the antecedent is also the
subject of the clause that follows it (`الرَّجُلُ الَّذِي سَافَرَ...`, "the man who traveled..." —
the verb's own subject already *is* الرَّجُلُ, so nothing extra needs to refer back to it).

**Deliberately narrower than `b1-u2`'s full title.** Two things are explicitly out of scope here,
both flagged as follow-ups (§8), not silently dropped:

- **Object-relative clauses** (`الْكِتَابُ الَّذِي قَرَأْتُهُ`, "the book that I read *it*") — these
  require a resumptive pronoun suffix on the clause's verb referring back to the antecedent, a
  genuinely separate rule from subject-relative clauses and one this batch doesn't teach.
- **Plural/dual relative pronouns** (اَلَّذِينَ, اللَّاتِي, اللَّذَانِ, اللَّتَانِ) — same "don't cram
  every form into one batch" discipline `b1-u1` already established across its two batches.

## 2. Checked before authoring

- **No relative pronoun exists anywhere in the lexicon or `content/grammar.json` yet** — confirmed
  by direct search, not assumed. The closest existing word, `lex:prt-18` مَنْ ("who?"), is the
  *interrogative* "who," an entirely different word and function from the *relative* pronoun
  الَّذِي — this batch does not touch `prt-18` or reuse it.
- **Present-tense Form I is already formally taught** (`gr:present-tense`, extended to the full
  person paradigm in M21 batch 1) — subject-relative clause examples can safely use present-tense
  verbs without assuming any new grammar.
- **Three of this batch's four example sentences deliberately reuse batch 11/12's own derived-form
  verbs** (`سَافَرَ`, `تَكَلَّمَ`, `اِسْتَيْقَظَ`) — not required, but a real, checked opportunity to tie
  B1's first three lessons together rather than introducing yet more unrelated vocabulary.
- **The indefinite-antecedent rule needs its own worked example, not just prose.** Arabic drops the
  relative pronoun entirely when the antecedent is indefinite (`رَأَيْتُ طَالِبًا يَدْرُسُ...`, "I saw
  a student who studies...", no الَّذِي) — this is the single most common beginner error with
  relative clauses, so one of the four example texts demonstrates it directly rather than leaving it
  as a warning with nothing to point at.

## 3. What ships

**2 new lexemes** (`content/lexemes.json`, `pos: "particle"`, `topic: "particles"`, `level: "B1"`):
`الَّذِي` (allathī, "who/which/that," masculine) and `الَّتِي` (allatī, same, feminine).

**1 new grammar point**, `gr:relative-clauses`:

- Names الَّذِي/الَّتِي, states the core rule (they follow a **definite** antecedent only; they
  agree with the antecedent's gender, not the clause's internal grammar; the clause that follows,
  جملة الصلة, has no case role of its own — a full concept only formally parsed at C1, mentioned
  here just so the term isn't left unexplained).
- States the indefinite-antecedent rule explicitly (no relative pronoun at all — the clause just
  follows the noun directly), with the worked contrast example backing it up.
- Scoped explicitly to subject-relative clauses; the rule text names object-relative clauses and
  the resumptive pronoun they need as "a separate rule, covered in a later unit" rather than staying
  silent about the gap.
- `prereqs: ["gr:definiteness", "gr:verbal-sentence"]` — needs both definiteness (the core
  distinction driving the whole rule) and the verbal sentence (the clause itself is a full verbal
  sentence in miniature).

**4 new example texts** (`source: "m11"`, `concept: "relative-clauses"`): `هَذَا هُوَ الرَّجُلُ
الَّذِي سَافَرَ إِلَى الْمَدِينَةِ` (masc., callback to batch 11's Form III), `هَذِهِ هِيَ الْمَرْأَةُ
الَّتِي تَتَكَلَّمُ الْعَرَبِيَّةَ` (fem., callback to batch 11's Form V), `هَذَا هُوَ الْوَلَدُ الَّذِي
اِسْتَيْقَظَ فِي الصَّبَاحِ` (masc., callback to batch 11's Form X), and `رَأَيْتُ طَالِبًا يَدْرُسُ
الْعَرَبِيَّةَ` (indefinite antecedent, no relative pronoun — the contrast case). Real wording
finalized and checked at implementation time; the pattern above is the design, not a promise every
word survives unchanged.

**1 new lesson**, `b1-relative-clauses`, wired onto `b1-u2` as its first lesson — same
`explain` → `reading-practice` → `practice-choice` × 2–3 → `complete` shape every B1 lesson so far
has used. `b1-u2` flips `"planned"` → `"available"`; blurb narrows to name exactly what ships
(subject-relative الَّذِي/الَّتِي), matching the honesty-about-scope pattern `b1-u1`'s blurb already
established across two batches.

## 4. Invariants held

- No changes to `content/wordlists/*.json` — relative pronouns are function words, never checklist
  items (same status as `مَنْ`, `أَيْنَ`, or any other particle already in the lexicon).
- No change to any existing grammar point, lesson, or `b1-u1`'s content.
- `buildAudioControl()` / `playArabicAudio()` untouched. Zero runtime dependencies / zero runtime
  fetches. No engine change.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- الَّذِي/الَّتِي's gender agreement and the definite-antecedent rule are stated correctly and
  match standard reference-grammar treatment.
- All 4 example texts reuse only already-taught vocabulary beyond the 2 new relative pronouns.
- `tools/qa-harness.js` full regression clean (including the new lesson walking to completion by
  name); `tools/a11y-audit.js` clean.
- `npm run content:check`: +2 lexemes (402→404), +1 grammar point (19→20), +4 texts (102→106),
  +1 lesson.
- `b1-u2` flips `planned` → `available`; blurb narrows to name exactly what shipped.

## 7. Out of scope

- Object-relative clauses and the resumptive pronoun they require (§1) — a genuinely separate rule,
  left for a follow-up batch, not silently absorbed into this one.
- Plural/dual relative pronouns (اَلَّذِينَ, اللَّاتِي, اللَّذَانِ, اللَّتَانِ) — same reasoning.
- إنّ وأخواتها — `b1-u2`'s other named topic, entirely separate grammar, its own future batch (§8).
- "Joining ideas into paragraphs" (connected multi-sentence B1 prose) — depends on relative clauses
  existing first; a natural batch once both this one and إنّ وأخواتها are in place.
- Any change to `content/curriculum.json`'s prereq graph beyond `b1-u2` itself.

## 8. Proposed follow-up batches (planning only, not committed)

- **Batch 14 — إنّ وأخواتها**: the accusative-marking particle family (إنّ, أنّ, كأنّ, لكنّ, لأنّ...),
  `b1-u2`'s second lesson. Genuinely independent of relative clauses; could ship before or after a
  relative-clauses follow-up.
- **Batch 15 — Object-relative clauses + plural/dual relative pronouns**: completes what this batch
  deliberately left out, the same two-part shape `b1-u1` used.

## 9. Rollout

Plan → this branch → draft PR → review → implementation only on explicit approval, per Master
Standards (same shape as every prior M21 batch).
