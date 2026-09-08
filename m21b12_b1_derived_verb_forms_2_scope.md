# M21 — Batch 12: B1 Derived Verb Forms IV, VI, VII (completing `b1-u1`)

**Status:** implemented — see the branch wiring this into the app. `tools/qa-harness.js` 71/71
(including the new lesson walking to completion by name), `tools/a11y-audit.js` clean, `node
tools/lint-fixtures.js` 33/33, `npm run content:check` shows exactly the planned deltas: +3 lexemes
(399→402), +3 texts (99→102), grammar object count unchanged (extended in place, per §3's own
decision), +1 lesson.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [m21b11_b1_derived_verb_forms_scope.md](m21b11_b1_derived_verb_forms_scope.md)
§8 ("Proposed follow-up batch... Forms IV, VI, VII... have no existing example in the lexicon —
unlike this batch, that follow-up would need 2–3 new verb lexemes, checked against
`wordlists/a1.json`/`a2.json` first"). This is that follow-up.
**Base:** `main` (post batch 11 / PR #44).
**Branch:** `claude/m21b12-derived-verb-forms-2-impl`.

---

## 1. What this batch covers

Batch 11 shipped Forms II, III, V, VIII, X — five of the nine derived forms `b1-u1` names, all from
verbs already in the lexicon. This batch covers **Forms IV, VI, VII** — the three left over after
batch 11's own honest audit. (Form IX — colors/physical defects, e.g. اِحْمَرَّ "to turn red" — stays
deferred to C1+ per batch 11 §8; still rare enough at B1 that most MSA courses skip it here.) With
this batch, **`b1-u1` closes completely except for Form IX**, which is intentionally out of scope
for B1 at all.

## 2. The finding that shapes this batch: Form IV was ALSO already hiding, undetected in batch 11

Re-checking every one of the 29 verb lexemes' root and pattern a second time, specifically for
Forms IV/VI/VII/IX this time (batch 11's own check was thorough but stopped once it had confirmed
five hits) — **two more derived forms turned up, missed the first time**:

| Verb | Root | Pattern | Form | Currently taught as |
|---|---|---|---|---|
| `lex:ver-16` أَرَادَ (to want) | ر-و-د (hollow) | أَفْعَلَ | **IV** | plain A1 verb, no form noted — used constantly (e.g. its present tense أُرِيدُ is the project's own "I would like...") without its form ever being named |
| `lex:ver-20` أَغْلَقَ (to close) | غ-ل-ق | أَفْعَلَ | **IV** | plain A1 verb, no form noted |

**This means Form IV also needs zero new lexemes** — the same discipline batch 11 applied, just
caught one round later. `أَغْلَقَ` pairs naturally with its own Form I counterpart already in the
lexicon, `فَتَحَ` (`lex:ver-19`, "to open") — confirmed both are the exact pair `wordlists/a1.json`'s
own `daily-routine` topic already checklists ("to open" / "to close," priority 2), so this isn't a
coincidental pairing, it's the checklist's own intended open/close pair doing double duty.

Forms VI and VII genuinely have no existing example (re-confirmed, not re-assumed) — checked
`wordlists/a1.json`/`a2.json` for any "cooperate," "exchange," "each other," or "open"/"close"-
adjacent checklist entry that might already flag a planned word: none exists beyond the "to open" /
"to close" pair already accounted for above.

## 3. What ships: 3 new lexemes, extending one existing grammar point, zero new grammar points

**Form VII (اِنْفَعَلَ — passive/reflexive of Form I), taught as minimal pairs with verbs already
known**, exactly the way this form is conventionally introduced (an action happening *to* something,
with no one doing it):

- **`lex:ver-31` اِنْفَتَحَ** ("to open" — intransitive/it-opened-itself) — pairs directly with
  `فَتَحَ` (I, "to open [something]," already known).
- **`lex:ver-32` اِنْغَلَقَ** ("to close" — intransitive/it-closed-itself) — pairs directly with
  `أَغْلَقَ` (IV, "to close [something]," newly-named in §2).

**Form VI (تَفَاعَلَ — reciprocal of Form III), one new lexeme on the project's own most
familiar root**:

- **`lex:ver-33` تَكَاتَبَ** ("to correspond / to write to each other") — root ك-ت-ب, the exact
  root `gr:root-pattern`'s own flagship example (`كَتَبَ`/`كِتَاب`/`مَكْتَبَة`) already made familiar;
  Form VI poured into a root a learner already knows intimately, the same "shared DNA" framing
  `gr:root-pattern` itself used.

**`gr:derived-verb-forms` extended in place, not forked into a new id.** This is one architectural
decision worth stating explicitly: batch 11's `rule` text already named all nine derived patterns
up front (for reading recognition), even though only five had worked examples — it's one concept,
not nine. This batch adds the IV/VI/VII meaning-tendency sentences to that same `rule` text (IV
causative, similar to II but often from a plain noun/adjective rather than another verb; VI the
reciprocal-of-III sense, "to do X to/with each other"; VII passive/reflexive of Form I, "for
something to become X'd," never taking a human agent as its subject) and appends the 3 new example
texts to its existing `examples` array — a second `gr:derived-verb-forms-2` id would artificially
fork one teaching point into two, complicating anything that ever needs to prereq "understands
derived forms" as a single edge.

**3 new example texts** (`content/texts.json`, `source: "m11"`, `concept: "derived-verb-forms"`,
matching batch 11's own convention) — `txt:gram-form4-aghlaqa` (illustrative:
أَغْلَقَ الرَّجُلُ الْبَابَ, "the man closed the door" — needs `بَاب`, door, already A0 vocabulary),
`txt:gram-form6-takataba`, `txt:gram-form7-infataha` — real wording written and checked at
implementation time, not finalized here.

**1 new lesson**, `b1-derived-verb-forms-2`, wired onto `b1-u1` as its second lesson (`order: 2`) —
same shape as batch 11's lesson (`explain` → `reading-practice` → `practice-choice` × 2–3 →
`complete`), this time with an explicit minimal-pair framing for Form VII (فَتَحَ/اِنْفَتَحَ,
أَغْلَقَ/اِنْغَلَقَ side by side) since that pairing is the whole pedagogical point of introducing it.
`b1-u1`'s blurb updates to name all nine covered forms (dropping the "Forms IV/VI/VII/IX still
ahead" caveat batch 11's blurb added, narrowing it to just Form IX).

## 4. Invariants held

- No changes to `content/wordlists/*.json` — `فَتَحَ`/`أَغْلَقَ` already satisfy the existing "to
  open"/"to close" checklist entries; the 3 new lexemes are new items, correctly outside any
  existing checklist (Form VI/VII vocabulary was never checklisted, since it didn't exist as a
  planned A1/A2 item).
- No change to any A2 grammar point, lesson, or the batch-11 lesson's existing steps.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- Zero runtime dependencies / zero runtime fetches. No engine change — same fully-proven pipeline
  as every prior grammar batch.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- `أَرَادَ`/`أَغْلَقَ` (IV), `اِنْفَتَحَ`/`اِنْغَلَقَ` (VII), `تَكَاتَبَ` (VI) all correctly match the
  traditional patterns (spot-checkable against any standard reference grammar).
- The 3 new example sentences reuse only already-taught vocabulary beyond the 3 new lexemes
  themselves.
- `tools/qa-harness.js` full regression clean (including the new lesson walking to completion by
  name); `tools/a11y-audit.js` clean.
- `npm run content:check`: +3 lexemes (399→402), +3 texts, `gr:derived-verb-forms`'s own object
  count unchanged (edited in place, not duplicated), +1 lesson.
- `b1-u1`'s blurb narrows to name all nine covered forms; Form IX explicitly named as B1's one
  deliberately-deferred form, not silently dropped.

## 7. Out of scope

- Form IX — deferred to C1+, per batch 11 §8's own reasoning, unchanged here.
- `b1-u2`–`b1-u6` — each remains its own future batch.
- Full conjugation paradigms for any of the 9 covered forms (same "recognition, not production
  drilling" scope batch 11 already established).
- Any change to batch 11's own 5 lexemes, texts, or lesson steps.

## 8. Rollout

Plan → this branch → draft PR → review → implementation only on explicit approval, per Master
Standards (same shape as batch 11 and every prior M21 batch). Once approved and merged, `b1-u1` is
functionally complete for B1's purposes, and the next open item is `b1-u2` (relative clauses,
إنّ وأخواتها) — the unit the earlier iʿrāb audit specifically named as where case-marking
recognition first becomes teachable, and the first real content M21.6's dormant `label` exercise
type would have something to grade.

## 9. Implementation notes

Shipped exactly as designed in §3 — no deviations. `lex:ver-31`/`ver-32`/`ver-33` follow the
established `notes` voice, each naming its form, root, and (for the VII pair) the already-known
verb it's paired with. `gr:derived-verb-forms`'s `rule` text was extended in place as planned
(added IV/VI/VII tendencies, corrected a small pre-existing miscount — batch 11's own text said
"Four of these appear in verbs you already know" while actually naming five; fixed to "Seven" now
that IV's two verbs are folded into the same sentence), its `examples` array grew from 5 to 8
entries, and one new `commonErrors` entry was added specifically for Form VII's no-human-subject
rule. No second grammar-point id was created.

The three new example texts reuse only already-taught vocabulary beyond the batch's own 3 new
lexemes: `الرَّجُلُ`/`الْبَابَ`/`الطَّالِبَانِ`(dual)/`فَجْأَةً` were all already in the lexicon. One
grammar point worth flagging (not a content error, a real MSA rule, documented in the new text's own
`words[].gloss`): `تَكَاتَبَ الطَّالِبَانِ` keeps the verb in singular form even though its subject is
dual — standard MSA verb-subject agreement drops number agreement whenever the verb precedes its
subject (VSO order), a rule this project hasn't formally taught yet but that's simply how any VSO
sentence with a dual/plural subject is correctly written; the gloss makes this explicit rather than
leaving it looking like an error.

`node tools/build-content.js --write-app` then `--check`: 584 objects, exactly the planned deltas
(+3 lexemes, +3 texts, grammar count unchanged, +1 lesson). `npm run content:lint`: 84 advisory
warnings — identical to the batch-11 baseline (the 5 new/edited lexemes were never orphaned: the 3
new ones are referenced by the new lesson's own `objectives`, and `lex:ver-16`/`ver-20` were
already referenced elsewhere before this batch touched their `notes`). `node
tools/lint-fixtures.js`: 33/33. `npm run qa`: 71/71, including `catalog lesson
"b1-derived-verb-forms-2" walks to completion` by name. `node tools/a11y-audit.js`: clean.

`b1-u1`'s blurb narrows to name all eight covered forms collectively rather than listing each one
(the growing list was becoming unwieldy across two lessons) and names Form IX as the one
deliberately-deferred form, matching batch 11's own honesty-about-scope precedent.
