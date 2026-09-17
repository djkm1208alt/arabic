# M21 — Batch 21: B2 — The Case System, Second Look (الْأَسْمَاء الْخَمْسَة، الْجَمْع السَّالِم)

**Status:** implemented, pending `content:check`/`qa`/`a11y` verification (see bottom of this doc).
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b2-u1` ("The Full Case System (Iʿrāb)") · follows directly
from [m21b20_b2_case_system_first_look_scope.md](m21b20_b2_case_system_first_look_scope.md), whose
§7 "Out of scope" named exactly this batch's two topics as the next, irregular layer.
**Base:** `main`, post batch 20 + the alphabet-modal/service-worker/lesson-picker fixes.

---

## 1. What this batch covers

Batch 20 was a deliberately narrow "first look" at إِعْرَاب on **regular** nouns only, and named —
but explicitly did not teach — three irregular layers: diptotes, the five nouns, and the sound
plurals. This batch teaches two of those three: **الْأَسْمَاء الْخَمْسَة** (the five nouns) and the
**sound plurals'** own case markers. **Diptotes are deliberately deferred again** — see §7.

**The five nouns:** of the five (أَب، أَخ، حَم، فَم، ذُو), only **أَب** (father) and **أَخ** (brother)
exist in the lexicon (`lex:peo-02`, `lex:peo-03`); حَم/فَم/ذُو are named in the grammar point's rule
text but not exampled — no lexeme exists for them, and they are rare outside classical/formal
registers, the same "flag, don't teach" treatment Form IX and dual relative pronouns got. أَب/أَخ
take a long vowel (و رَفْع / ا نَصْب / ي جَرّ) instead of a short one when they are the **first term of
an iḍāfa** — critically, only with a following noun, not with an attached pronoun (أَخِي alone means
"my brother"; the three cases only stay visibly distinct with a genuine construct chain).

**The sound plurals:** already used elsewhere in the app (`gr:noun-number`, `gr:relative-clauses`)
for their **رَفْع** forms only. This batch adds their **نَصْب** forms, which is where the real
irregularity lives: sound masculine plural swaps ـُونَ for ـِينَ in *both* نَصْب and جَرّ; sound feminine
plural is regular everywhere except نَصْب, where it unexpectedly takes the same kasra-tanwīn ending
as its own جَرّ form instead of the fatḥa a regular noun would take.

## 2. Checked before authoring

- **Zero new lexemes needed.** أَب/أَخ (`lex:peo-02`/`03`), طَالِب, مُعَلِّم/مُعَلِّمَة, كِتَاب, جَدِيد, and
  the verb رَأَى (`lex:ver-08`, "to see" — confirmed present, previously unused in any `texts.json`
  entry) cover every new sentence. رَأَى's own conjugation (رَأَيْتُ) is standard Form I.
- **Confirmed no existing text uses أَب/أَخ as a real word** (a naive substring search initially
  false-matched on كِتَاب, which happens to contain the letters ا-ب adjacent — re-checked against
  `words[].surface` with word-boundary-aware matching).
- **Confirmed the definite/indefinite distinction for diptotes** is the reason they're excluded
  here, not an oversight: their irregular جَرّ marker only shows when indefinite, which needs its own
  carefully-checked example set — reason enough to keep this batch to the two topics already
  verified with high confidence, deferring diptotes rather than guessing.
- **Reused the existing `mubtada`/`khabar`/`fail`/`mafulbih`/`mudafilayhi` role set** (M21.6/M21.7)
  as-is — no new role needed. The five-noun head of an iḍāfa (e.g. أَخُو in أَخُو الطَّالِبِ) is tagged
  with the SAME role the whole phrase plays (`mubtada`/`mafulbih`), a small departure from batch
  20's own texts (which left the iḍāfa's head/mudaf term untagged, tagging only `mudafilayhi` +
  `khabar`) — necessary here because the head term is *itself* the irregular form being taught.
- **Traced the exact `exGenLabel`/hand-authored `label` format** against `b2-case-system-first-look`
  before writing new steps — same `role+case` answer key, same option shape.

## 3. What ships

**0 new lexemes.**

**5 new texts:** `txt:gram-case-five-nouns-raf` (أَخُو الطَّالِبِ مُعَلِّمٌ), `-nasb` (رَأَيْتُ أَبَا
الطَّالِبِ), `-jarr` (كِتَابُ أَخِي الطَّالِبِ جَدِيدٌ — double-tagged: أَخِي + جَدِيدٌ), `txt:gram-case-sound-mpl-nasb`
(رَأَيْتُ الْمُعَلِّمِينَ فِي الْمَدْرَسَةِ), `txt:gram-case-sound-fpl-nasb` (رَأَيْتُ الْمُعَلِّمَاتِ فِي الْمَدْرَسَةِ).

**2 existing texts gain an additive `parse` array** (same pattern batch 20 used on
`b1-role-recognition`'s texts): `txt:gram-relclause-pl-teachers-m`/`-f` (from `gr:relative-clauses`,
batch 17) each gain one `{word, role: "mubtada", case: "raf"}` entry — their sound-plural رَفْع forms
were already correct in those sentences, just never tagged.

**`gr:case-system` grown additively** (same `gr:` id, matching how `gr:inna-sisters` grew across
batches 14–16): two new rule paragraphs (five nouns; sound plurals), `examples` grown from 7 to 14,
two new `commonErrors` entries, the "still ahead" closing sentence narrowed to name only diptotes.

**1 new lesson**, `b2-case-system-second-look`, `b2-u1`'s second (`order: 2`): `explain` →
`reading-practice` (all 7 objective texts) → 6 `label` steps (one per single-tagged text: five-nouns
راف/نصب, sound-m-pl راف/نصب, sound-f-pl راف/نصب) → 1 `practice-choice` (the double-tagged five-nouns
جر sentence) → `complete`.

**`b2-u1`'s blurb updated** to name what's now covered (five nouns, sound plurals) and what remains
(diptotes only).

## 4. Invariants held

- No change to `exerciseTypes.label`, `exGenLabel`, `LABEL_ROLES`, or `LABEL_CASES` — reuses the
  role+case tier exactly as M21.6 shipped it.
- No change to `b1-role-recognition`, `b2-case-system-first-look`, `gr:relative-clauses`, or
  `gr:noun-number` beyond the two additive `parse` entries described above.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- `content/lessons/*.json` + `content/curriculum.json`/`grammar.json`/`texts.json` edited directly;
  `index.html` only touched via `npm run content:write` (never hand-edited for this batch).

## 5. Migration requirements

None. Purely additive (new texts; new optional `parse` field on two existing texts; grown grammar
point; one new lesson + curriculum stub; one unit blurb string).

## 6. Acceptance criteria

- Every new/updated `parse` case value is linguistically correct for a plain use of the five nouns
  and sound plurals in the stated role (checked by hand against standard Arabic grammar, since no
  in-repo reference exists for this specific check).
- `npm run content:check`: +0 lexemes, +5 texts (2 existing modified in place), +1 lesson; `b2-u1`
  gains a second available lesson.
- `tools/qa-harness.js` full regression clean, including the new lesson walking to completion with
  all 6 `label` steps + 1 `practice-choice` grading correctly; `tools/a11y-audit.js` clean.
- `b2-case-system-first-look` and `b1-role-recognition` still pass unchanged.

## 7. Out of scope

- **Diptotes (مَمْنُوع مِنَ الصَّرْف)** — needs its own batch. The indefinite/definite distinction (the
  irregular جَرّ marker only shows when indefinite; a diptote reverts to fully regular case marking
  once definite or annexed to a definite noun) needs a source check before authoring examples, which
  this session's effort budget didn't extend to. Candidate existing diptote-shaped vocabulary was
  identified for later use: `مَكَاتِب` (plural of `lex:wrk-01` مَكْتَب) and `أَصْدِقَاء` (plural of
  `lex:peo-11`) — both already in the lexicon, zero new lexemes likely needed for that batch either.
- **حَم، فَم، ذُو** — named in the grammar rule, not exampled; no lexemes exist for them.
- Verb mood (رفع/نصب/جزم of the present tense) — still `gr:mudari-mood`-shaped, its own future batch.
- Any change to `b1-role-recognition` or `b2-case-system-first-look` beyond the two additive `parse`
  entries described above.

---

**Implemented** on `main`. See ROADMAP.md M21 row for verification results once QA completes.
