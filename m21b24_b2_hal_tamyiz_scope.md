# M21 — Batch 24: B2 — Two More Accusative Roles (الْحَال، التَّمْيِيز، لَا النَّافِيَة لِلْجِنْس)

**Status:** implemented and verified — `npm run content:check` clean at 640 objects (415 lexemes,
26 grammar points, 138 texts, 38 units, 75 lessons); `npm run qa` 90/90; `node tools/a11y-audit.js`
clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b2-u1` ("The Full Case System (Iʿrāb)"), its fourth
lesson · [reference/iraab-audit.md](reference/iraab-audit.md) §8's proposed table maps this to
`B2-iʿrāb-4` (indicative ids `gr:hal`, `gr:tamyiz`, `gr:la-nafiya-jins` — used as-written).

---

## 1. What this batch covers

Two genuinely new accusative-taking noun roles, beyond the five `b1-u7`/`gr:case-system` already
named (مبتدأ/خبر/فاعل/مفعول به/مضاف إليه): **الْحَال** (a temporary state at the moment of the verb —
رَجَعَ الرَّجُلُ سَعِيدًا, "the man returned happy") and **التَّمْيِيز** (specifying an ambiguous
quantity — عِنْدِي عِشْرُونَ كِتَابًا, "I have twenty books," already produced correctly since
`gr:numbers-11-99`). Plus one deliberately-flagged look-alike: **لَا النَّافِيَة لِلْجِنْس** (a
category-negating لَا — لَا مَاءَ فِي الْحَقِيبَةِ, already produced correctly since A1's plain
negation lesson), whose single-word noun is honestly taught as مَبْنِي (grammatically built), not
truly مُعْرَب (case-declined), even though it's written identically to a real accusative noun.

## 2. Checked before authoring

- **Verified both الحال/التمييز mechanics and, critically, the لا النافية للجنس مبني/معرب
  distinction against external sources** before writing anything. The لا-النافية-للجنس check
  mattered most: a single-word اسم لا is مبني (built) with فتحة that only LOOKS like a normal
  accusative ending; it becomes genuinely مُعرب مَنصوب only when it's مضاف or شبيه بالمضاف. Getting
  this backwards would have taught a real grammatical inaccuracy dressed up as authoritative
  content — exactly the risk `reference/iraab-audit.md` §3 flags as this whole programme's
  "biggest structural gap" (المعرب والمبني، entirely absent before this batch).
- **Checked the lexicon for حَال-suitable vocabulary first**: `رَجَعَ`/`جَاءَ` (already-known verbs)
  plus `سَعِيد`/`حَزِين` (already-known adjectives) cover both new sentences with zero new lexemes.
  Confirms colors DO exist in the lexicon too (`lex:col-*`, found via the `en` field — corrects an
  earlier session search that used the wrong field name, `english`, and concluded none existed;
  not needed for this batch, but worth noting for the record since it could matter for a future
  diptote-adjective example).
- **Reused two already-existing texts wholesale** (`txt:gram-num-20` for التمييز,
  `txt:gram-neg-no-water` for لا-النافية-للجنس) rather than authoring near-duplicates — both already
  demonstrate the exact mechanic, just unnamed until now, continuing the "you've already been doing
  this correctly" pattern `gr:case-system`'s own first look established.
- **Confirmed no `label`-engine change was needed or attempted**: consistent with batch 23's own
  decision, this stays at `explain`/`reading-practice`/`practice-choice` only — no new `LABEL_ROLES`
  entries for حال/تمييز, no `parse` arrays on any of the texts here.
- **Caught and fixed two authoring artifacts before building**: a stray mid-thought correction
  leaked into one text's word gloss (labeled الرَّجُلُ's case as نَصْب before self-correcting to the
  right answer, رَفْع, inside the same string) and into `gr:hal`'s own rule text (an aborted "wait,
  no —" self-correction). Both were caught and cleaned up before `npm run content:write`, not left
  for QA to catch.

## 3. What ships

**0 new lexemes.**

**2 new texts**: `txt:gram-hal-rajaa-saeed` (رَجَعَ الرَّجُلُ سَعِيدًا), `txt:gram-hal-jaa-hazin`
(جَاءَ الطَّالِبُ حَزِينًا) — both الْحَال. **2 existing texts reused as-is** for التمييز and
لا-النافية-للجنس, cited as objectives without modification.

**3 new grammar points**: `gr:hal`, `gr:tamyiz`, `gr:la-nafiya-jins` — matching the audit's own
indicative ids exactly. Three separate ids (not additive growth of `gr:case-system`), since each
names a genuinely distinct role/mechanic, the same discipline that kept `gr:kana` and
`gr:inna-sisters` as separate points despite both being case-shifting particles.

**1 new lesson**, `b2-hal-tamyiz-first-look`, `b2-u1`'s fourth (`order: 4`): `explain` →
`reading-practice` (all 4 objective texts) → 4 `practice-choice` steps (حال role-ID, a
حال-vs-predicate minimal pair, تمييز role-ID, the لا-النافية-للجنس مبني/معرب caveat) → `complete`.

**`b2-u1`'s blurb updated** to name all seven accusative-taking roles now covered (five original +
حال + تمييز) plus the لا-النافية-للجنس caveat.

## 4. Invariants held

- Zero changes to `exerciseTypes.label`, `exGenLabel`, `LABEL_ROLES`, or `LABEL_CASES`.
- No change to `gr:case-system`, `gr:numbers-11-99`, or `gr:negation-a1` beyond being cited as
  prereqs/cross-references; `txt:gram-num-20` and `txt:gram-neg-no-water` are unmodified.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- New lesson's title checked for Arabic-character ratio (≈40%) before running QA.

## 5. Migration requirements

None. Purely additive (2 new texts; 3 new grammar points; 1 new lesson + curriculum stub; one unit
blurb string).

## 6. Acceptance criteria

- الحال/التمييز mechanics and the لا-النافية-للجنس مبني/معرب distinction are linguistically
  correct, verified against external sources rather than memory alone.
- `npm run content:check`: +0 lexemes, +2 texts, +3 grammar points, +1 lesson.
- `tools/qa-harness.js` full regression clean, including the new lesson walking to completion with
  all 4 `practice-choice` steps grading correctly; `tools/a11y-audit.js` clean.
- All prior B2 lessons (`b2-case-system-*`, `b2-mudari-mood-first-look`) still pass unchanged.

## 7. Out of scope

- The full مُعْرَب/مَبْنِي distinction itself (only the لا-النافية-للجنس instance is flagged here) —
  a genuinely foundational topic `reference/iraab-audit.md` names as its own future entry point.
- لا-النافية-للجنس's مضاف / شبيه بالمضاف forms (which ARE fully معرب منصوب) — only the single-word
  مبني form is taught here.
- التوابع (نعت/عطف/توكيد/بدل) — `B2-iʿrāb-5`, the next item in the audit's dependency-ordered table.
- Any change to `b2-case-system-*` or `b2-mudari-mood-first-look`.

---

**Implemented and verified** on `main`.
