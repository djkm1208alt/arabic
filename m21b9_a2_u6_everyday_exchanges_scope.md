# M21 — Batch 9: `a2-u6` Everyday Exchanges (shopping, directions, routine conversation)

**Status:** implemented — see the branch wiring this into the app.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · follows directly from a read-only iʿrāb curriculum
mapping audit against two external reference PDFs (kept locally, not part of this repo), whose
Implementation Gate's first recommended step was "finish A2 (`a2-u6`)" before any iʿrāb work is
even considered.
**Base:** `main` (post batch 8 / PR #38, post M20.9).
**Branch:** `claude/a2-u6-everyday-exchanges`.

---

## 1. What this batch covers

`a2-u6`'s one lesson: **Shopping, Directions & Everyday Exchanges** — the sixth and last A2 unit,
closing A2 out completely. Three short dialogues (shopping/paying, asking the way, a small polite
request) plus three comprehension `practice-choice` questions, one per dialogue.

## 2. Checked before authoring — zero new vocabulary, zero new grammar

Every word needed was already in the lexicon, confirmed by direct lookup, not assumed:

- **Shopping/payment:** `lex:shp-01..14` (price, cheap/expensive, how much?, currencies, cash,
  credit card, size, discount) — all already authored (M21 batches 1, 4, 7). `مَقَاس` (size,
  `lex:shp-13`), `نَقْد`/`بِطَاقَة اِئْتِمَان` (`lex:shp-11/12`), `هَذَا كُلُّ شَيْءٍ` (`lex:exp-22`) came
  straight from batch 7's checklist, unused until now.
- **Directions:** `lex:dir-01..03` (right/left/straight ahead, A1) plus `lex:pla-14` (bank),
  `lex:pla-06` (restaurant), `lex:pla-10` (library), `lex:pla-18/19` (near/far), `lex:prt-08/09/10`
  (in front of/behind/next to) — all A1, all already there. The existing A1 dialogue
  `txt:read-dlg-asking-way` ("Where is the station? — Over there, on the right") is the direct
  model this batch extends into a fuller, two-landmark A2 exchange.
- **Routine politeness:** `lex:exp-18/19/20/21` (of course, no problem, do you have...?, may I...?)
  — batch 7's four politeness phrases, also unused until now.
- **Numbers:** `عِشْرِينَ` (twenty) reuses `gr:numbers-11-99` (batch 2) exactly as modelled in the
  existing price examples (`txt:gram-price-twenty`: "هَذَا الْقَلَمُ بِعِشْرِينَ دِينَارًا").
- Grammar reused, not added: `gr:idafa` (`بِطَاقَةُ اِئْتِمَانٍ`, `هَذَا كُلُّ شَيْءٍ`), `gr:core-prepositions`
  (`بِجَانِبِ`, `أَمَامَ`, `مِنْ`), `gr:negation-a1` (`لَا بَأْسَ`).
- **Deliberately avoided:** the imperative (فعل الأمر) — not yet taught anywhere in the curriculum
  (confirmed absent from `content/grammar.json`) — so neither dialogue uses a command form
  ("go straight", "here you go"); both directions turns stay declarative, matching
  `txt:read-dlg-asking-way`'s own existing pattern exactly. Comparative "bigger/smaller" was
  likewise avoided in favour of the plain adjectives `كَبِير`/`صَغِير` already taught at A0, since
  Arabic comparative morphology (أَفْعَل) isn't wired into a grammar point yet.

## 3. What ships

- **3 new texts** (`content/texts.json`, `textType: "dialogue"`, `source: "m21b9"`):
  `txt:read-dlg-shopping` (7 turns), `txt:read-dlg-directions` (6 turns),
  `txt:read-dlg-permission` (4 turns). Zero new lexemes, zero new grammar points.
- **1 new lesson** (`content/lessons/a2-shopping-routine.json`), `unitId: "a2-u6"`,
  `curriculumLessonId: "a2-shopping-routine"` — mirrors `a1-listening-dialogues.json`'s established
  shape (`explain` → `reading-practice` with `fromObjectives: true` → three `practice-choice` →
  `complete`).
- **`content/curriculum.json`:** `a2-u6` flips `"planned"` → `"available"`; blurb's trailing
  "In development." dropped (matches every other unit that shipped its lesson); `prereqs` corrected
  from the M16-era placeholder `["a1-u3"]` (a generic A1 vocabulary unit) to `["a2-u4"]` (Numbers,
  Counting & Time — the actual dependency, since the shopping dialogue's price line needs
  `gr:numbers-11-99`), the same kind of metadata correction batch 6 made to `a2-u3`'s blurb once the
  real content existed to check it against.

**A2 is now fully closed** — all six `a2-uN` units (`a2-u1` through `a2-u6`) are `"available"`.

## 4. Invariants held

- No changes to `content/lexemes.json`, `content/wordlists/a2.json`, or `content/grammar.json`.
- `buildAudioControl()` / `playArabicAudio()` untouched — new dialogue audio strings follow the
  exact concatenation pattern every prior dialogue/paragraph text already uses.
- Zero runtime dependencies / zero runtime fetches.

## 5. Verification

`node tools/build-content.js --write-app`, then `--check`; `npm run content:lint`;
`npm run content:check`; `npm run qa`; `node tools/a11y-audit.js`. Results recorded in the commit
this doc ships with.
