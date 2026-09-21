# M21 — Batch 25: B2 — Two of the Five Objects (مَفْعُول فِيهِ، مَفْعُول مَعَهُ)

**Status:** implemented and verified — `npm run content:check` clean at 646 objects (415 lexemes,
28 grammar points, 142 texts, 38 units, 76 lessons); `npm run qa` 91/91; `node tools/a11y-audit.js`
clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b2-u1` ("The Full Case System (Iʿrāb)"), its fifth
lesson · [docs/iraab-audit.md](docs/iraab-audit.md) §8's `B2-iʿrāb-2` names "المفاعيل
(فيه/به/له/مطلق/معه)" alongside the passive; this batch takes the two objects tractable without
participle vocabulary, leaving the passive itself (needs `b1-u3`) and two vocabulary-blocked
objects for later.

---

## 1. What this batch covers

Two more of the five accusative "object" roles (مَفْعُول بِهِ, already covered by `b1-u7`):
**مَفْعُول فِيهِ** (ẕarf zamān — a time word implying "في" with none written: سَافَرْتُ صَبَاحًا, "I
traveled in the morning") and **مَفْعُول مَعَهُ** (accompaniment after وَاو الْمَعِيَّة, distinct from
the plain conjunction "and": سَافَرْتُ وَصَدِيقًا, "I traveled along with a friend" — the friend
didn't act, he came along).

**Deliberately narrowed from the audit's full "المفاعيل" grouping**: مَفْعُول لَهُ (the reason/cause)
and مَفْعُول مُطْلَق (the cognate object) are named-not-taught this round — both need vocabulary this
project doesn't have yet (an abstract "reason" noun for له; a verb–cognate-noun pair for مطلق that
isn't awkward with the current verb list). مَفْعُول فِيهِ's ظَرْف مَكَان (place) half is also deferred
— it uses a smaller, partly irregular closed set of words, a genuinely separate check from ظَرْف
زَمَان. The full passive voice (نَائِب الْفَاعِل) stays blocked on `b1-u3` (participles), unbuilt.

## 2. Checked before authoring

- **Verified both mechanics against external sources**: مَفْعُول فِيهِ's implied-فِي behavior and
  مَفْعُول مَعَهُ's three conditions (وَ must mean "with," the following word must be a single noun
  not a clause, and a verbal — or verb-like — clause must precede the وَ) were both confirmed
  before writing any example, continuing this session's now-standard practice of not authoring
  grammar claims from memory alone.
- **Checked the lexicon first**: `صَبَاح`/`مَسَاء`/`لَيْل` (time nouns), `دَرَسَ` (studied), `جَلَسَ`
  (sat), `اِبْن` (son), and `صَدِيق` (friend) were all already present — **0 new lexemes**.
- **Verified `اِبْنَهُ` (accusative, fatḥa before the attached pronoun) is distinguishable from
  `اِبْنُهُ`/`اِبْنِهُ`** before using it as the pronoun-attached مَفْعُول مَعَهُ example — the case still
  shows on the vowel immediately before an attached pronoun, matching how `gr:attached-possessive`
  already established pronoun-attachment doesn't erase the noun's own case marking.
- **Proofread every new grammar-point rule/commonErrors string and every new text's glosses before
  building**, specifically checking for leaked self-corrections — batch 24 shipped one such
  artifact in-repo (an aborted "wait, no —" inside `gr:hal`'s rule text, caught and fixed same
  session) and this batch caught two more of the same kind before they ever reached
  `npm run content:write`: a case-label typo in a text gloss, and a broken placeholder word
  mid-sentence in `gr:maful-maahu`'s own commonErrors. Read back all new/changed strings in full
  after writing them, not just after QA — this is now a standing step for every remaining batch.

## 3. What ships

**0 new lexemes.**

**4 new texts**: `txt:gram-maful-fihi-sabahan` (سَافَرْتُ صَبَاحًا), `txt:gram-maful-fihi-laylan`
(دَرَسَ الطَّالِبُ لَيْلًا), `txt:gram-maful-maahu-sadiqan` (سَافَرْتُ وَصَدِيقًا),
`txt:gram-maful-maahu-ibnahu` (جَلَسَ الرَّجُلُ وَابْنَهُ).

**2 new grammar points**: `gr:maful-fihi`, `gr:maful-maahu` — separate ids, matching the
established discipline of one id per distinct role rather than growing `gr:case-system`.

**1 new lesson**, `b2-maful-fihi-maahu`, `b2-u1`'s fifth (`order: 5`): `explain` →
`reading-practice` (all 4 objective texts) → 4 `practice-choice` steps (one per text) →
`complete`, which explicitly names the two still-deferred objects (مفعول له، مفعول مطلق) so the
"five objects" family's remaining gap stays visible rather than silently dropped.

**`b2-u1`'s blurb updated** to name all the roles now covered.

## 4. Invariants held

- Zero changes to `exerciseTypes.label`, `exGenLabel`, `LABEL_ROLES`, or `LABEL_CASES` — same
  `practice-choice`-only discipline as batches 23–24.
- No change to any prior grammar point beyond citation as a prereq.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- New lesson's title checked for Arabic-character ratio (≈24%) before running QA.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- مَفْعُول فِيهِ / مَفْعُول مَعَهُ mechanics are linguistically correct, verified against external
  sources.
- `npm run content:check`: +0 lexemes, +4 texts, +2 grammar points, +1 lesson.
- `tools/qa-harness.js` full regression clean, including the new lesson walking to completion;
  `tools/a11y-audit.js` clean.
- All prior B2 lessons still pass unchanged.

## 7. Out of scope

- مَفْعُول لَهُ, مَفْعُول مُطْلَق — the remaining two of the five objects, blocked on vocabulary this
  project doesn't have yet cleanly.
- ظَرْف مَكَان (place) — مَفْعُول فِيهِ's place-adverbial half, a smaller and partly irregular word set.
- نَائِب الْفَاعِل (the passive voice) — still blocked on `b1-u3` (participles), unbuilt.
- التوابع (`B2-iʿrāb-5`) — the next item in the audit's dependency-ordered table.

---

**Implemented and verified** on `main`.
