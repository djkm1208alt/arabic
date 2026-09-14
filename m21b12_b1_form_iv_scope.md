# M21 — Batch 12: b1-u1, Derived Verb Forms — Form IV (third slice)

**Status:** proposed. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [reference/iraab-audit.md](reference/iraab-audit.md) §9 Implementation Gate, prerequisite 2 ("B1 is empty"). This is that prerequisite's **third** slice, following [m21b10_b1_form_ii_scope.md](m21b10_b1_form_ii_scope.md) (Form II, merged) and [m21b11_b1_form_iii_scope.md](m21b11_b1_form_iii_scope.md) (Form III, merged) — still not M27/iʿrāb content itself, which stays blocked on this *and* M27.0 shipping.
**Base:** `main` @ `1dd2711`.

---

## 1. What this batch covers

`b1-u1` ("Derived Verb Forms II–X") carries two lessons so far (`b1-derived-forms-ii`, `b1-derived-forms-iii`). This batch delivers **Form IV** (أَفْعَلَ) as a third **additive extension of the same `gr:derived-verb-forms` grammar point** — not a new `gr:` id — continuing the shape both prior batches established. `b1-u1` stays `available`; its blurb grows to name all three forms shipped so far.

## 2. Why Form IV next, and why now

- Batches 10 and 11 shipped Forms II and III; Form IV is the next form in the unit's own numeric sequence, and it has a genuinely distinct signal (a hamza prefix, no doubling and no long alif) and a genuinely distinct meaning tendency worth teaching on its own — most often causative, like Form II, but formed differently and worth contrasting against it.
- Checked before proposing: `main` @ `1dd2711` still has only Forms II–III in B1 — this is squarely the next increment of Gate prerequisite 2.
- The lexicon is unusually rich in already-taught Form IV verbs this time — **two**, not just one: `lex:ver-16` أَرَادَ ("to want," A1) and `lex:ver-20` أَغْلَقَ ("to close," A1) are both genuine Form IV verbs sitting idle, ready to reuse with zero new authoring, continuing the `جَرَّبَ`/`سَافَرَ` pattern from batches 10–11.

## 3. Checked before planning — what's already in place

- `gr:derived-verb-forms` (B1, from batches 10–11) already frames the ten-form system in general and contrasts Form II vs. Form III — this batch extends its `rule` text and `examples` array with Form IV content, it does not re-explain the general derived-form idea from scratch.
- `lex:ver-27` وَصَلَ (Form I, "to arrive," A1, present tense يَصِل already documented) supports a clean causative minimal pair: وَصَلَ ("he arrived") → أَوْصَلَ ("he delivered / gave a ride to / conveyed" — literally "he caused [someone/something] to arrive"). A **sound, non-hollow** root (و-ص-ل is only *assimilated*, not hollow), deliberately chosen as the flagship pair so the very first Form IV example doesn't also have to teach hollow-root vowel contraction.
- `lex:ver-09` فَهِمَ (Form I, "to understand," A1, already carries an `example` sentence) supports a second causative minimal pair: فَهِمَ ("he understood") → أَفْهَمَ ("he made [someone] understand / explained to [someone]"), a double-object construction reusing the same مُعَلِّم/طَالِب/دَرْس school vocabulary batch 10's flagship pair used.
- `lex:ver-16` أَرَادَ (Form IV, A1, "to want," present tense يُرِيد already documented) is a **hollow-root** Form IV verb (root ر-و-د) — reusable as-is, and a good place to *flag* (not teach) hollow-root irregularity as a heads-up for whichever future batch covers it.
- `lex:ver-20` أَغْلَقَ (Form IV, A1, "to close," present tense يُغْلِق already documented) is a second reusable Form IV verb — like `جَلَّمَ`/`نَظَّفَ` in batch 10, its own Form I غَلِقَ isn't in everyday use, so it's effectively "Form IV only" from a learner's standpoint, worth noting as its own pattern.
- Checked and found **no** third new causative/denominative candidate whose Form I half is already taught beyond the two above (فَتَحَ, بَاعَ, دَفَعَ, رَجَعَ, فَعَلَ, سَمِعَ, رَأَى were all checked and don't have a standard, well-attested Form IV counterpart worth teaching at this level). Recommend **2 new lexemes**, not 3 — the four-worked-example shape from batches 10–11 is still reached (2 new + 2 reused), just with less new-vocabulary burden than either prior batch.
- No `wordlists/b1.json` exists yet — same call as batches 10–11: still premature after only two prior batches.

## 4. Proposed shape (not yet written)

- **Grammar (additive, no new `gr:` id):** extend `gr:derived-verb-forms`'s `rule` text with a Form IV paragraph — the hamza-prefix وَزْن أَفْعَلَ pattern (no doubling, no long alif), its causative meaning tendency, contrasted against Form II's causative-by-doubling and Form III's causative-by-alif already stated. `examples` grows from 8 to 12 (4 Form II + 4 Form III + 4 new Form IV). `commonErrors` gains one Form II/III/IV three-way contrast entry.
- **New lexemes (2, both level B1):**
  - **أَوْصَلَ** (awṣala, "to deliver / convey / give a ride to") — root و-ص-ل, paired against already-taught وَصَلَ for the flagship minimal pair. Present tense noted as يُوصِلُ (the root's initial و elides under the prefix's ḍammah — flagged in `notes`, not formally taught as its own rule).
  - **أَفْهَمَ** (afhama, "to make understand / explain to") — paired against already-taught فَهِمَ, reusing the مُعَلِّم/طَالِب/دَرْس cluster for continuity with batch 10's own flagship theme.
  - (أَرَادَ and أَغْلَقَ reused as-is from `lex:ver-16`/`lex:ver-20` — no new lexemes, cited again as the third and fourth worked examples.)
- **Content:** 4 new example texts (`textType: sentence`), same discipline as batches 10–11 — built only from vocabulary already taught plus this batch's new verbs, no proper nouns. One of the four (the أَغْلَقَ sentence) deliberately pairs it against the unrelated, already-known فَتَحَ ("to open") for variety rather than a root minimal pair, since أَغْلَقَ has no taught Form I counterpart of its own.
- **Lesson:** a third lesson on `b1-u1` (`b1-derived-forms-iv`), same explain → reading-practice → practice-choice → complete shape as the two prior Form lessons, closing with a small recognition check across all three forms taught so far (II vs. III vs. IV) rather than just this form in isolation — the first point where that three-way contrast is possible.
- **`content/roots.json`:** extend the existing و-ص-ل entry if one exists (checked: **none exists yet** — this would be a new cluster) with وَصَلَ/أَوْصَلَ; ف-ه-م likewise has no existing cluster and would be new. Continues the documentation convention batches 10–11 started, purely advisory (not validated by the build pipeline).
- **Blurb:** `b1-u1`'s blurb grows to name all three forms shipped (II, III, IV), still short of the full "ten forms" framing.

## 5. Open questions

1. **2 new lexemes instead of 3** — recommend **yes, keep it at 2**; the lexicon search genuinely turned up only two clean causative candidates with an already-taught Form I half, and forcing a third (denominative or otherwise) would mean introducing brand-new base vocabulary in a batch whose job is the derived form, not the vocabulary. Flag if you'd rather see a third (e.g. a fresh denominative Form IV built from an already-taught noun/adjective, similar to نَظَّفَ/صَادَقَ's role in batches 10–11 — none was found that felt as natural as those two).
2. **أَرَادَ's hollow root** — recommend citing it as a worked example without explaining *why* it looks different (أَرَادَ instead of a regular أَوْرَدَ) — hollow-root conjugation stays out of scope until a dedicated batch addresses it (candidate for later in `b1-u1`'s Form IV+ coverage, or deferred further). This batch should just use أَرَادَ's already-established present tense (يُرِيد) without deriving it.
3. **The closing three-way recognition question (II vs. III vs. IV)** — recommend **yes**, since this is the first point three forms coexist and the project's own `commonErrors` entries have been flagging exactly this confusion risk since batch 10. Flag if you'd rather keep each lesson's practice strictly scoped to its own form only.

## 6. Not in this batch

- ❌ Forms V–X, or any `b1-u1` blurb claim beyond Form II + III + IV.
- ❌ Any `gr:mabni-muʿrab`, case-recognition, or other M27/iʿrāb-programme content.
- ❌ Any M27.0 engine/`parse`-type dependency — uses only the existing `sentence`/`reading-practice`/`practice-choice` machinery.
- ❌ `content/wordlists/b1.json` — still premature after two prior batches.
- ❌ Hollow-root conjugation as its own taught rule (أَرَادَ is cited, not explained).
- ❌ Participles/verbal nouns — `b1-u3`'s job, same deferral batches 10–11 made.
- ❌ `b1-u2`/`b1-u3`/`b1-u4`/`b1-u5`/`b1-u6` — untouched.
- ❌ Actual lesson/lexeme/grammar JSON, or any `index.html` change — scope only, per your instruction.
