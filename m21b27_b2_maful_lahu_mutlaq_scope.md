# M21 — Batch 27: B2 — Two More of the Five Objects (الْمَفْعُول الْمُطْلَق، الْمَفْعُول لِأَجْلِه)

**Status:** implemented and verified — `npm run content:check` clean; `npm run qa` full pass;
`node tools/a11y-audit.js` clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b2-u1` ("The Full Case System (Iʿrāb)"), its
seventh lesson · [docs/iraab-audit.md](docs/iraab-audit.md) §8's `B2-iʿrāb-2` names all
five مفاعيل (بِهِ/فِيهِ/لَهُ/مُطْلَق/مَعَهُ) as one entry; مَفْعُول بِهِ was already implicit in A2's
`gr:verbal-sentence`, and batch 25 covered فِيهِ/مَعَهُ — this batch closes out the remaining two,
completing all five.

---

## 1. What this batch covers

**الْمَفْعُول الْمُطْلَق** (the absolute/cognate object — a مَصْدَر of the SAME verb, accusative,
here restricted to its "بَيَان النَّوْع" (specifying kind/manner) use via a following adjective):
عَمِلَ الرَّجُلُ عَمَلًا جَيِّدًا ("the man did good work"). **الْمَفْعُول لِأَجْلِه** (the causative
object — an indefinite مَصْدَر, accusative, answering "لِمَاذَا؟", naming the reason the main verb
happened, sharing the main verb's subject and time): أَغْلَقَ الرَّجُلُ النَّافِذَةَ خَوْفًا مِنَ
الرِّيحِ ("the man closed the window out of fear of the wind").

This completes all five مَفَاعِيل (بِهِ at A2 via `gr:verbal-sentence`, فِيهِ/مَعَهُ at batch 25,
لَهُ/مُطْلَق here) — the audit's `B2-iʿrāb-2` entry is now fully taught.

## 2. Checked before authoring

- **Verified both mechanics against an external source** before writing anything: الْمَفْعُول
  الْمُطْلَق is a مَصْدَر from the verb's own root, in one of three roles (تَوْكِيد the verb,
  بَيَان النَّوْع its kind, or بَيَان الْعَدَد its count) — this lesson teaches بَيَان النَّوْع only,
  the same "first look, defer the rest" discipline as `gr:maful-fihi` (time only, place deferred)
  and `gr:naat`/`gr:atf-nasaq` (two of four تَوَابِع). الْمَفْعُول لِأَجْلِه is confirmed as an
  indefinite مَصْدَر accusative answering "لِمَاذَا" that shares its subject and time with the verb
  it explains — distinguished explicitly in `commonErrors` from الْمَفْعُول الْمُطْلَق (both are
  accusative مَصَادِر, easy to conflate): مُطْلَق is built from the SAME root as its verb; لِأَجْلِه
  never is.
- **Checked the lexicon first.** `lex:wrk-11` (عَمَل, "work/job") already carries the note "Noun
  form of the existing عَمِلَ (ʿamila) 'to work' verb" — an exact pre-existing مَصْدَر pairing,
  found before assuming a new lexeme was needed. Reused `عَمِلَ`/`عَمَل`/`جَيِّد`/`مُهِمّ` (all
  known) for both مُطْلَق texts — **0 new lexemes for this grammar point.**
- **الْمَفْعُول لِأَجْلِه needed one new lexeme**: no reason/cause noun existed in the lexicon.
  Added `lex:bod-10` خَوْف ("fear") — filed under the existing "body" topic alongside `lex:bod-08`
  أَلَم ("pain/ache"), the project's existing home for abstract sensation nouns — rather than
  opening a new topic category for one word. Reuses `أَغْلَقَ`/`نَافِذَة`/`رِيح`/`رَجُل`/`اِمْرَأَة`/
  `بَاب` (all known) around it. **1 new lexeme total this batch**, tagged `level: "B2"` (same
  precedent as batch 23's `أَنْ`/`لَنْ`/`لَمْ` — grammar-driven vocabulary gets the level of the
  grammar point that needs it, not a wordlist-checklist level).
- **Deliberate variation, not a new scenario from scratch**: both لِأَجْلِه texts reuse the exact
  same cause phrase (خَوْفًا مِنَ الرِّيحِ, "out of fear of the wind") behind two different
  subjects/objects (رَجُل+نَافِذَة, then اِمْرَأَة+بَاب) — isolates the grammar point instead of
  testing new vocabulary comprehension at the same time.
- **Read the QA harness's title Arabic-ratio check directly again** (line 277 of
  `tools/qa-harness.js`) before finalizing the lesson title, following batch 26's catch — this
  time by choosing an English-forward title with only the concept name in Arabic:
  "Two More Objects (الْمَفْعُول الْمُطْلَق / لِأَجْلِه)" computed comfortably under the 0.5
  threshold.
- **Proofread every new string in full before building** — no leaked self-corrections found.

## 3. What ships

**1 new lexeme**: `lex:bod-10` خَوْف ("fear," noun, topic "body", level B2).

**4 new texts**: `txt:gram-maful-mutlaq-good-work` (عَمِلَ الرَّجُلُ عَمَلًا جَيِّدًا),
`txt:gram-maful-mutlaq-important-work` (عَمِلَتِ الْمُعَلِّمَةُ عَمَلًا مُهِمًّا),
`txt:gram-maful-lahu-window` (أَغْلَقَ الرَّجُلُ النَّافِذَةَ خَوْفًا مِنَ الرِّيحِ),
`txt:gram-maful-lahu-door` (أَغْلَقَتِ الْمَرْأَةُ الْبَابَ خَوْفًا مِنَ الرِّيحِ).

**2 new grammar points**: `gr:maful-mutlaq`, `gr:maful-lahu`.

**1 new lesson**, `b2-maful-mutlaq-lahu`, `b2-u1`'s seventh (`order: 7`): `explain` →
`reading-practice` (all 4 objective texts) → 4 `practice-choice` steps (one per text) →
`complete`, which names all five مَفَاعِيل as now covered.

**`b2-u1`'s blurb updated** to state all five مَفَاعِيل are now covered.

## 4. Invariants held

- Zero changes to `exerciseTypes.label`, `exGenLabel`, `LABEL_ROLES`, or `LABEL_CASES`.
- No change to any prior grammar point beyond citation as a prereq.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- New lesson's title verified against the QA harness's own exact formula before building.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- الْمَفْعُول الْمُطْلَق (بَيَان النَّوْع) / الْمَفْعُول لِأَجْلِه mechanics are linguistically
  correct, verified against external sources.
- `npm run content:check`: +1 lexeme, +4 texts, +2 grammar points, +1 lesson.
- `tools/qa-harness.js` full regression clean; `tools/a11y-audit.js` clean.
- All prior B2 lessons still pass unchanged.

## 7. Out of scope

- الْمَفْعُول الْمُطْلَق's other two roles (تَوْكِيد الْفِعْل, بَيَان الْعَدَد) — deferred to a later
  batch if/when needed; this batch teaches بَيَان النَّوْع only.
- التَّوْكِيد and الْبَدَل (the remaining two تَوَابِع) — still blocked on vocabulary, unchanged
  from batch 26's deferral.
- Any change to prior B2 lessons.

---

**Implemented and verified** on `main`.
