# M21 — Batch 20: B2 — The Full Case System, First Look (رَفْع / نَصْب / جَرّ)

**Status:** implemented. `npm run content:check` clean at 619 objects (412 lexemes, 22 grammar
points, 124 texts, 38 units, 71 lessons); `npm run qa` 86/86 (including `b1-role-recognition`
still passing unchanged); `node tools/a11y-audit.js` clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md)
§10.2 ("B2 (upper-int): the full case system used actively (iʿrāb of nominals and verbs)") ·
`b2-u1` ("The Full Case System (Iʿrāb)"), whose `prereqs` (`b1-u2`, `b1-u7`) are both satisfied for
the first time as of last session. This is the actual payoff of the whole M21.6→M21.7→batches
14–19 arc: the first B2 content, and the first lesson to ask role **and** case together.
**Base:** `main`, post batch 19.

---

## 1. What this batch covers

`b2-u1` is a whole unit, not a single lesson — the same discipline that split `b1-u1` into 8
lessons and `b1-u2` into 7 applies here too. This batch is a deliberately narrow **first look**:
the three basic cases (رَفْع nominative, نَصْب accusative, جَرّ genitive) on **regular (triptote)
nouns only**, recognized together with the role that requires each one — exactly what "parsing"
(إعراب) means, and exactly the `label` engine's **role+case tier**, which `exerciseTypes.label` has
supported since M21.6 shipped but nothing has used until now (the M21.6 QA check
"role-only + role+case" tests the mechanism; this batch is the first *content* to exercise the
case half of it).

**The reveal, not new grammar:** every case ending used here has already appeared, correctly, in
lessons going back to A2 — `gr:idafa`'s genitive second term, `gr:kana`'s accusative predicate,
`gr:inna-sisters`' accusative subject. This batch's job is naming the system those rules were
quietly instances of, not teaching a new mechanic.

**Deliberately excluded, named but not exampled:** diptotes (ممنوع من الصرف — fatḥa instead of
kasra for genitive, no tanwīn), the five nouns' long-vowel case markers (و/ا/ي instead of
ḍamma/fatḥa/kasra), and sound-plural case markers (وَ/ي, ـِ for feminine plural in naṣb) — all
irregular case-marking patterns needing their own dedicated batch, out of scope for a first look at
the *regular* system. Case on VERBS (رفع/نصب/جزم of the present tense) is `gr:mudari-mood`-shaped
territory, not this batch's job either — this batch's "verbs" claim from the unit title is about
case *inside* a verbal sentence's nominal parts (فاعل، مفعول به), not the verb's own mood marking.

## 2. Checked before authoring

- **No `gr:full-case-system`-shaped grammar point existed** — confirmed by direct search.
- **Zero new lexemes, zero new texts needed.** `b1-role-recognition`'s own seven texts
  (`txt:gram-nominal-father`, `-mother`, `txt:gram-past-vso`, `txt:gram-past-1sg`,
  `txt:gram-idafa-phrase`, `-sentence`, `-pen-student`) already carry a `role`-only `parse` array
  from M21.7. Every antecedent in them is a regular triptote noun. Adding `case` to each existing
  `parse` entry (additive — `case` is an optional field per M21.6's own schema) activates the
  engine's role+case tier on content that already exists, rather than authoring a parallel set of
  near-duplicate sentences.
- **Traced `exGenLabel`'s role+case behavior directly in `index.html`** before hand-authoring items:
  when a `parse` entry carries `case`, the generated `answer` is `role+case` (e.g. `"mubtada+raf"`)
  and each option's `ar`/`en` is `LABEL_ROLES[r].ar + " — " + LABEL_CASES[c].ar` /
  `LABEL_ROLES[r].en + ", " + LABEL_CASES[c].en`. This batch's hand-authored `label` steps match
  that exact format, the same discipline M21.7 used for the role-only tier.
- **Every case assignment checked against the antecedent's actual role**, not asserted: مبتدأ/خبر/
  فاعل → رفع; مفعول به → نصب; مضاف إليه → جر — standard, uncontested for a plain triptote noun in
  each of these seven sentences (no diptotes, no five-nouns, no sound plurals among them).

## 3. What ships

**0 new lexemes. 0 new texts.**

**`case` added to all 9 existing `parse` entries** across the 7 `b1-role-recognition` texts (an
additive field, not a new array) — e.g. `txt:gram-nominal-father`'s `{"word": "الْأَبُ", "role":
"mubtada"}` becomes `{"word": "الْأَبُ", "role": "mubtada", "case": "raf"}`. `b1-role-recognition`
itself is untouched otherwise — it still asks role-only, since `exGenLabel`/hand-authored items
choose whether to surface `case`, and that lesson's own hand-authored steps don't reference it.

**1 new grammar point**, `gr:case-system`: states the three cases, their markers (ḍamma/tanwīn ـٌُ,
fatḥa/tanwīn ـًَ, kasra/tanwīn ـٍِ), which role takes which case, and explicitly connects this to
`gr:idafa`/`gr:kana`/`gr:inna-sisters`' already-taught endings — "you've been producing this
correctly since A2; this is its name." Names diptotes/five-nouns/sound-plural markers as the next,
irregular layer, deliberately not covered here.

**1 new lesson**, `b2-case-system-first-look`, `b2-u1`'s first (`order: 1`): `explain` → `reading-practice` (reusing the same
seven texts, now with case visible in each word's gloss) → 5 `label` steps (role+case combined, one
per single-tagged text) → 2 `practice-choice` reinforcement questions (on the two double-tagged
iḍāfa sentences, each needing both words' role+case named) → `complete`.

**`b2-u1` flips `planned` → `available`**, blurb updated to name what this first batch actually
covers and what's still ahead (diptotes, five nouns, sound-plural markers, verb mood).

## 4. Invariants held

- No change to `b1-role-recognition`'s own steps or to any of the 7 texts' `words`/`vowelled`/
  other fields — only `case` added inside existing `parse` entries.
- No change to `exerciseTypes.label`, `exGenLabel`, `LABEL_ROLES`, or `LABEL_CASES` — this batch
  uses the role+case tier exactly as M21.6 shipped it, zero engine changes.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- Lesson title and every option/explanation string checked against the 50%-Arabic lang/dir
  threshold before writing.

## 5. Migration requirements

None. Purely additive (a new optional field on existing `parse` entries; new grammar point; new
lesson; one unit status flip).

## 6. Acceptance criteria

- `gr:case-system`'s rule states the three cases and their markers correctly, and explicitly ties
  back to `gr:idafa`/`gr:kana`/`gr:inna-sisters` rather than re-explaining case from zero.
- Each of the 9 `parse` entries' new `case` value is the linguistically correct one for that word's
  stated role in a plain triptote noun.
- `npm run content:check`: +0 lexemes, +1 grammar point, +0 texts (existing texts modified in
  place), +1 lesson; `b2-u1` flips to `available`.
- `tools/qa-harness.js` full regression clean, including the new lesson walking to completion with
  all 5 `label` steps grading role+case correctly; `tools/a11y-audit.js` clean.
- `b1-role-recognition` (M21.7) still passes unchanged — confirms the additive `case` field doesn't
  alter that lesson's own role-only behavior.

## 7. Out of scope

- Diptotes, the five nouns (أَب/أَخ/حَم/فَم/ذُو), sound-plural case markers, broken plurals under
  case — the whole "irregular case marking" layer, a genuine and substantial follow-up batch.
- Verb mood (رفع/نصب/جزم of the present tense) — `gr:mudari-mood`-shaped, a separate grammar point.
- Any change to `b1-role-recognition` beyond the additive `case` fields.
- حَال / تَمْيِيز, كَانَ وأخواتها "in full," passive voice — `CURRICULUM_ARCHITECTURE.md`'s other
  named B2 topics, each its own future batch.

---

**Implemented** on `main`. See ROADMAP.md M21 row for verification results.
