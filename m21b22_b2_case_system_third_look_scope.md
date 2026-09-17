# M21 — Batch 22: B2 — The Case System, Third Look (مَمْنُوع مِنَ الصَّرْف)

**Status:** implemented and verified — `npm run content:check` clean at 628 objects (412 lexemes,
22 grammar points, 133 texts, 38 units, 73 lessons); `npm run qa` 88/88; `node tools/a11y-audit.js`
clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b2-u1` ("The Full Case System (Iʿrāb)") · follows
directly from [m21b21_b2_case_system_second_look_scope.md](m21b21_b2_case_system_second_look_scope.md),
whose §7 "Out of scope" deferred diptotes specifically because the indefinite/definite behavior
needed a source check before authoring examples.

---

## 1. What this batch covers

The third and last of `gr:case-system`'s named irregular layers: **diptotes** (مَمْنُوع مِنَ الصَّرْف).
Batches 20 and 21 both explicitly deferred this because the indefinite/definite distinction is easy
to get wrong from memory alone: a diptote takes fatḥa instead of kasra for جَرّ **only when
indefinite**; the moment it becomes definite (by الـ, or by being the second term of an إِضَافَة
whose own definiteness carries through), it reverts to fully regular case marking, kasra included.

## 2. Checked before authoring

- **Verified the indefinite/definite rule against external sources** before writing any example —
  the exact gap flagged in batch 21's §7. Two independent sources (an Arabic-language grammar
  reference and an English-language Arabic-grammar teaching site) both confirm: "إذا أضيف الممنوع
  من الصرف أو أدخلت عليه (ال) جُرّ بالكسرة" — annexation or الـ restores the regular kasra. This was
  not assumed or guessed.
- **Zero new lexemes.** `مَكَاتِب` (plural of `lex:wrk-01` مَكْتَب, pattern مَفَاعِل) and `أَصْدِقَاء`
  (plural of `lex:peo-11` صَدِيق, pattern أَفْعِلَاء) were both already identified as candidate diptote
  vocabulary in batch 21's own §7 and confirmed still unused in `texts.json`.
- **The definite/indefinite minimal pair** (`هَذَا بَيْتُ أَصْدِقَاءَ` vs. `هَذَا بَيْتُ الْأَصْدِقَاءِ`) was
  deliberately built as two near-identical sentences differing only in definiteness, so the lesson
  can show the exception to the exception directly rather than asserting it in prose alone.
- **Confirmed `هَذَا` + definite predicate is an already-used sentence pattern** in this project
  (`txt:read-dlg-who-is-this`: "هَذَا صَدِيقِي مُحَمَّدٌ") before relying on it — an identification
  sentence with a demonstrative subject is not the same construction as the topic+comment nominal
  sentence that requires an indefinite predicate (`gr:nominal-sentence`'s own rule), so this doesn't
  contradict anything already taught.

## 3. What ships

**0 new lexemes.**

**4 new texts:** `txt:gram-case-diptote-raf` (هَذِهِ مَكَاتِبُ جَدِيدَةٌ), `-nasb` (رَأَيْتُ مَكَاتِبَ
جَدِيدَةً), `-jarr-indef` (هَذَا بَيْتُ أَصْدِقَاءَ — fatḥa), `-jarr-def` (هَذَا بَيْتُ الْأَصْدِقَاءِ — kasra,
the payoff contrast).

**`gr:case-system` grown additively a third time** (same `gr:` id, same pattern used across batches
20–21): the rule's closing "one irregular layer is still ahead" sentence replaced with the full
diptote explanation including the definiteness exception; `examples` grown from 14 to 18; one new
`commonErrors` entry naming the exact misconception (assuming diptotes always take fatḥa for جَرّ).

**1 new lesson**, `b2-case-system-third-look`, `b2-u1`'s third (`order: 3`): `explain` →
`reading-practice` (all 4 objective texts) → 4 `label` steps (one per text) → 1 `practice-choice`
(the indefinite/definite minimal pair, asked together) → `complete`.

**`b2-u1`'s blurb updated** to state the full noun case system (regular, five nouns, sound plurals,
diptotes) is now covered; only verb mood remains.

## 4. Invariants held

- No change to `exerciseTypes.label`, `exGenLabel`, `LABEL_ROLES`, or `LABEL_CASES`.
- No change to `b1-role-recognition`, `b2-case-system-first-look`, or `b2-case-system-second-look`.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- Learned from batch 21's own QA catch: the new lesson's title (`"The Case System — Third Look
  (مَمْنُوع مِنَ الصَّرْف)"`) was checked for Arabic-character ratio (≈38%) before running QA, rather
  than after — comfortably under the lang/dir coverage check's 50% threshold this time.
- `content/lessons/*.json` + `content/curriculum.json`/`grammar.json`/`texts.json` edited directly;
  `index.html` only touched via `npm run content:write`.

## 5. Migration requirements

None. Purely additive (4 new texts; grown grammar point; one new lesson + curriculum stub; one unit
blurb string).

## 6. Acceptance criteria

- Every new `parse` case value is linguistically correct, including the definite/indefinite
  contrast, verified against external sources (see §2) rather than memory alone.
- `npm run content:check`: +0 lexemes, +4 texts, +1 lesson; `b2-u1` gains a third available lesson.
- `tools/qa-harness.js` full regression clean, including the new lesson walking to completion with
  all 4 `label` steps + 1 `practice-choice` grading correctly; `tools/a11y-audit.js` clean.
- `b2-case-system-first-look`/`-second-look` and `b1-role-recognition` still pass unchanged.

## 7. Out of scope

- Verb mood (رفع/نصب/جزم of the present tense, `gr:mudari-mood`-shaped) — the one remaining named
  gap in `gr:case-system`'s own rule text, now a wholly separate future batch. With this batch,
  **the full case system on NOUNS is complete**: regular, five nouns, sound plurals, and diptotes.
- Any change to the three prior `b2-case-system-*` lessons.

---

**Implemented and verified** on `main`.
