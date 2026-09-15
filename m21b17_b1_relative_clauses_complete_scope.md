# M21 — Batch 17: B1 Relative Clauses, Completing the Set (Object-Relative + الَّذِينَ / اللَّاتِي)

**Status:** implemented. `npm run content:check` clean at 614 objects (412 lexemes, 21 grammar
points, 120 texts, 38 units, 68 lessons); `npm run qa` 83/83; `node tools/a11y-audit.js` clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b1-u2` · `gr:relative-clauses`'s own text (batch 13),
which named object-relative clauses and plural/dual relative pronouns as its next steps; also
named in batch 13's own scope doc §8 as "Batch 15 — Object-relative clauses + plural/dual relative
pronouns" (a slot since renumbered, as batches 15/16 went to إنّ وأخواتها instead).
**Base:** `main`, post batch 16 (إنّ's attached-pronoun forms).

---

## 1. What this batch covers

`gr:relative-clauses` (batch 13) covered only SUBJECT-relative clauses with singular الَّذِي/الَّتِي,
explicitly deferring two things in its own rule text: object-relative clauses ("the book that I
read [it]") and plural/dual relative pronouns. This batch delivers both of those, checked
separately against the lexicon rather than assumed together.

**Object-relative clauses:** when the antecedent is the clause's OBJECT rather than its subject,
Arabic needs an extra resumptive pronoun suffix on the clause's verb, pointing back at the
antecedent: الْكِتَابُ الَّذِي قَرَأْتُهُ جَمِيلٌ ("the book that I read is beautiful") — قَرَأْتُ
alone would mean "I read [something unspecified]"; ـهُ on the end makes it "I read it," resuming
the antecedent. This is the exact same attached-pronoun mechanic batch 16 just taught on إنّ's
family, now doing an analogous job on a verb instead of a particle — a deliberate callback, not a
coincidence.

**Plural relative pronouns:** الَّذِينَ (masc. plural, human) and اللَّاتِي (fem. plural, human) —
checked: `gr:noun-number` (already taught) states the sound-plural patterns (مُعَلِّمُونَ,
ـَاتٌ) these lean on directly, so the plural antecedents in this batch's examples are regular
applications of an already-taught rule to already-known singular nouns (مُعَلِّم → مُعَلِّمُونَ,
مُعَلِّمَة → مُعَلِّمَاتٌ), not new vocabulary.

**Deliberately excluded, named but not exampled:** the DUAL relative pronouns (اللَّذَانِ nominative
/ اللَّذَيْنِ accusative-genitive, and their feminine counterparts) are genuinely rare at this
level and, unlike the plural forms, are themselves case-inflected — a second new complication
stacked on top of "there's a plural form at all." Named in the rule text for recognition, no
worked example, staying ahead past B1 — the same "flag, don't teach" treatment Form IX and إنّ's
1st-person irregularity already got.

## 2. Checked before authoring

- **No plural relative pronoun existed anywhere in the lexicon** — confirmed by direct search.
- **No ready-made plural noun lexeme exists** (no standalone "teachers"/"men" entry) — rather than
  invent one, this batch derives the plural directly from an already-known singular via
  `gr:noun-number`'s own already-taught sound-plural pattern (مُعَلِّم/مُعَلِّمَة, lex:sch-02/03),
  the same "apply an already-taught rule to an already-known word" discipline batch 15 used for
  `لِأَنَّهُ`.
- **Both plural examples use a prepositional-phrase predicate** (فِي الْمَدْرَسَةِ, "at school"),
  not a plural-conjugated verb inside the relative clause — a 3rd-person masculine/feminine plural
  present-tense verb form is not yet a taught pattern anywhere in the curriculum, and this batch's
  job is the relative pronoun, not a new verb conjugation; introducing one silently would overreach.
- **Both object-relative examples reuse already-taught verbs and nouns**: قَرَأَ/كِتَاب/جَمِيل
  (read/book/beautiful, A0) and رَأَى/اِمْرَأَة/سَعِيد (see/woman/happy, A0–A1) — the resumptive
  pronoun (ـهُ, ـهَا) is the exact suffix set from `gr:attached-possessive`, already reused for
  إنّ's family in batch 16.

## 3. What ships

**2 new lexemes** (B1, `pos: "particle"`): `الَّذِينَ` (alladhīna, masc. plural "who/which/that")
and `اللَّاتِي` (allātī, fem. plural "who/which/that").

**`gr:relative-clauses` grown, not replaced**: two new `rule` paragraphs (object-relative + the
resumptive pronoun; plural pronouns, with the dual named-but-deferred), `examples` grows from 4 to
8, two new `commonErrors` entries (forgetting the resumptive pronoun; using singular الَّذِي/الَّتِي
with a plural antecedent). `prereqs` gains `gr:attached-possessive` and `gr:noun-number`.

**4 new example texts** (`concept: "relative-clauses"`): الْكِتَابُ الَّذِي قَرَأْتُهُ جَمِيلٌ
(object-relative, masc.), الْمَرْأَةُ الَّتِي رَأَيْتُهَا سَعِيدَةٌ (object-relative, fem.),
الْمُعَلِّمُونَ الَّذِينَ فِي الْمَدْرَسَةِ مَشْغُولُونَ (plural, masc., subject-relative shape),
الْمُعَلِّمَاتُ اللَّاتِي فِي الْمَدْرَسَةِ مَشْغُولَاتٌ (plural, fem., subject-relative shape).

**1 new lesson**, `b1-relative-clauses-2`, `b1-u2`'s fifth (`order: 5`) — `explain` →
`reading-practice` → `practice-choice` × 4 (one per new sentence, since these are two genuinely
separate ideas — the resumptive pronoun and the plural pronoun forms — not one repeated rule) →
`complete`.

**1 small edit:** `b1-u2`'s blurb updated to state relative clauses now cover subject- and
object-relative, singular and plural; the dual forms and "joining ideas into paragraphs" are what
remains open for the unit.

## 4. Invariants held

- No change to `b1-relative-clauses` (batch 13) or any of batches 14–16's content — additive only.
- No new plural-noun lexeme minted; the plurals used are regular applications of `gr:noun-number`'s
  already-taught rule to already-known singular lexemes.
- No new verb conjugation pattern introduced; both plural examples use a PP predicate specifically
  to avoid needing one.
- Lesson title and every option/explanation string checked against the 50%-Arabic lang/dir
  threshold before writing.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- `gr:relative-clauses`'s object-relative rule correctly states the resumptive-pronoun requirement;
  plural-pronoun rule correctly restricts اللَّاتِي/الَّذِينَ to human antecedents (non-human
  plurals keep taking singular-feminine agreement, per `gr:noun-number`'s existing rule — unchanged
  here, just not contradicted).
- Dual relative pronouns are named in the rule text but have no worked example and no lexeme.
- `npm run content:check`: +2 lexemes, +0 grammar points (same `gr:` id), +4 texts, +1 lesson.
- `tools/qa-harness.js` full regression clean; `tools/a11y-audit.js` clean.
- `b1-u2` stays `available`; blurb states relative clauses (subject/object, singular/plural)
  complete short of dual forms.

## 7. Out of scope

- Dual relative pronouns (اللَّذَانِ/اللَّذَيْنِ and feminine counterparts) — named, not taught.
- "Joining ideas into paragraphs" — `b1-u2`'s last remaining named topic, likely needs more of B1's
  subordination machinery (already substantial after this batch) before it's worth scoping.
- Any new verb conjugation pattern (3rd-person plural present tense) — deliberately avoided this
  batch by using PP predicates instead.

---

**Implemented** on `main`. See ROADMAP.md M21 row for verification results.
