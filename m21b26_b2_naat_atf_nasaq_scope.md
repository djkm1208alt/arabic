# M21 — Batch 26: B2 — التوابع, First Two (النَّعْت، عَطْف النَّسَق)

**Status:** implemented and verified — `npm run content:check` clean at 652 objects (415 lexemes,
30 grammar points, 146 texts, 38 units, 77 lessons); `npm run qa` 92/92; `node tools/a11y-audit.js`
clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b2-u1` ("The Full Case System (Iʿrāb)"), its sixth
lesson · [docs/iraab-audit.md](docs/iraab-audit.md) §8's `B2-iʿrāb-5` names all four
تَوَابِع (نعت/عطف النسق/توكيد/بدل) as one batch; this session splits it, teaching the two tractable
with existing vocabulary first.

---

## 1. What this batch covers

The first two of the four تَوَابِع ("followers" — words that copy some or all of a preceding
noun's grammar rather than carrying independent case): **النَّعْت** (a describing adjective that
fully agrees with its noun in definiteness, gender, number, AND case — الْبَيْتُ الْكَبِيرُ جَمِيلٌ,
"the big house is beautiful") and **عَطْف النَّسَق** (a coordinating conjunction that forces two
independent nouns to share one case — الْأَبُ وَالْأُمُّ سَعِيدَانِ, "the father and the mother are
happy").

**Deliberately split from the audit's grouping**: التَّوْكِيد (emphasis — لفظي repeats a word;
معنوي uses نفس/عين + a pronoun) and الْبَدَل (substitution) both need vocabulary this project
doesn't have cleanly yet (no "نفس"/"عين" lexeme for توكيد معنوي; no natural substitution pair
without either a proper noun or an awkward sentence for بدل) — named-not-taught this round, the
same discipline used throughout this session's batches.

## 2. Checked before authoring

- **Verified عَطْف النَّسَق's mechanic against an external source** (the conjoined noun copies the
  first noun's case, across رفع/نصب/جر/جزم) before writing anything. النَّعْت's four-way agreement
  rule was already cross-checked earlier in this session while researching حال/تمييز, since all
  three (نعت، حال، تمييز) came up together in that search.
- **Checked the lexicon first**: النعت reuses `بيت`/`كبير`/`جميل`/`رجل`/`طويل`/`رأى` (all
  already known); عطف النسق reuses `أب`/`أم`/`سعيد`/`كتاب`/`درس`/`قرأ` plus the already-existing
  particle `أَوْ`. **0 new lexemes.**
- **Deliberate callback, not a new example from scratch**: `الْبَيْتُ الْكَبِيرُ` is the EXACT
  phrase `a1-grammar-structural` already used, back at A1, as a contrast case ("if you make the
  second word definite too... it just means 'the big house'") — what was explicitly presented
  there as "not a sentence" is now the same phrase, formally named as منعوت+نعت.
- **Caught a lang/dir coverage risk before running QA this time, not after**: the first draft
  title ("The First Two Followers (النَّعْت، عَطْف النَّسَق)") computed to an exact 50%
  Arabic-character ratio using the QA harness's own formula (non-whitespace chars, matching
  `tools/qa-harness.js`'s `/[؀-ۿ]/g` test) — right at the `>= 0.5` fail boundary. Read the harness's
  exact check implementation directly (line 277 of `tools/qa-harness.js`) rather than re-guessing
  a rough estimate, then shortened the title's Arabic citation (not the English framing) to
  `"Followers, First Look (النَّعْت / عَطْف)"`, ratio ≈0.37, before ever running the suite.
- **Proofread every new string in full before building** — no leaked self-corrections found this
  time (batches 24 and 25 had each caught one).

## 3. What ships

**0 new lexemes.**

**4 new texts**: `txt:gram-naat-big-house` (الْبَيْتُ الْكَبِيرُ جَمِيلٌ),
`txt:gram-naat-tall-man` (رَأَيْتُ الرَّجُلَ الطَّوِيلَ), `txt:gram-atf-father-mother` (الْأَبُ
وَالْأُمُّ سَعِيدَانِ), `txt:gram-atf-book-lesson` (قَرَأْتُ الْكِتَابَ وَالدَّرْسَ).

**2 new grammar points**: `gr:naat`, `gr:atf-nasaq`.

**1 new lesson**, `b2-naat-atf-nasaq`, `b2-u1`'s sixth (`order: 6`): `explain` →
`reading-practice` (all 4 objective texts) → 4 `practice-choice` steps (one per text) →
`complete`, which explicitly names التوكيد and البدل as the two still-deferred تَوَابِع.

**`b2-u1`'s blurb updated** to name the two تَوَابِع now covered.

## 4. Invariants held

- Zero changes to `exerciseTypes.label`, `exGenLabel`, `LABEL_ROLES`, or `LABEL_CASES`.
- No change to any prior grammar point beyond citation as a prereq.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- New lesson's title verified against the QA harness's own exact formula before building, not
  estimated informally — the lesson learned from batch 21's title failure earlier this session.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- النعت/عطف النسق mechanics are linguistically correct, verified against external sources.
- `npm run content:check`: +0 lexemes, +4 texts, +2 grammar points, +1 lesson.
- `tools/qa-harness.js` full regression clean (92/92, first run — no title-ratio failure this
  time); `tools/a11y-audit.js` clean.
- All prior B2 lessons still pass unchanged.

## 7. Out of scope

- التَّوْكِيد (لفظي، معنوي) and الْبَدَل (مطابق، بعض من كل، اشتمال) — the remaining two تَوَابِع,
  blocked on vocabulary (نفس/عين for توكيد معنوي; a clean substitution pair for بدل).
- Any change to prior B2 lessons.

---

**Implemented and verified** on `main`.
