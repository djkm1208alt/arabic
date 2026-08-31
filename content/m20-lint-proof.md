# M20 — linguistic lint & data-authored lessons: proof

This is the M20 Phase A review artifact. It shows the linter running on the
current content set, each rule firing on a deliberately broken fixture, and the
first data-authored lesson compiling into the app with no hand-inlined Arabic.

Regenerate the numbers here with:

```bash
node tools/build-content.js --lint
node tools/lint-fixtures.js
node tools/build-content.js --check
```

> **Rebased onto `main` (M14.1 / M14.5 / M15.5 / M19.5 / M20.5 / M21.5 landed
> first).** M14.5 had already added a `--lint` mode (ḥarakāt-coverage + orphan
> warnings) and M20.5 folded a `texts.json` drift check into it. The three are
> now **one `--lint` path**: M20's linguistic linter runs as its own pure module
> (`content-lint.js`), its **hard errors block every run**, and its **warnings**
> print under `--lint` alongside M14.5's and M20.5's — all advisory, `--lint`
> never exits non-zero on its own. `--check` and the default run stay quiet
> except for a blocking linguistic hard error.
>
> **Step-4 migration pass.** The 10 `levelfit` warnings the first pass recorded
> are resolved: `levelfit` now normalises the English gloss on **both** sides
> (`lemmaVariants()` — lowercase, drop `(…)` and terminal `? ! .`, split `/` and
> `,` compounds, article/`to`-insensitive); `umbrella` / `how much is this?`
> added to the word-list and `grey` widened to `grey / gray`; the two
> case-ending grammar-demo pseudo-lexemes `lex:hom-11` / `lex:hom-12` recorded
> in `content/_lint-allow.json` with a reason. **Linguistic lint: 0 errors,
> 0 warnings.** (`--lint` still shows M14.5's 83 pre-existing orphan warnings —
> vocabulary authored ahead of its curriculum slot, expected, not M20's.)

---

## 1. The linter

`tools/content-lint.js` — pure, zero-dependency, `lint(data, wordlists, allow) →
{ errors, warnings }`. No file IO. `tools/build-content.js` imports it as
`linguisticLint` (its own advisory `lint()` — M14.5 ḥarakāt/orphan + M20.5 drift
— keeps that name). **Hard errors `exit 1` on every run** (`--check` included);
**warnings surface only under `--lint`**, merged with the M14.5/M20.5 advisory
list. It is a safety net, not the authority — a human still verifies every piece
of Arabic. `content/_lint-allow.json` (`{ "<object-id>": ["<rule>", …] }`;
`_`-prefixed keys are notes) silences a rule for one object where the flag is a
deliberate, reviewed exception.

| rule | severity | catches |
|---|---|---|
| `register` | **error** | a colloquialism (bare-consonant skeleton match against a denylist of ~30 dialect words) in MSA-only content |
| `ar-indic` | **error** | Arabic-Indic digits (٠–٩) in an object whose `topic` is not `"numbers"` |
| `emphatic` | **error** | translit/script disagreement on the 1:1 pairs the scheme maps — `ṣ↔ص ḍ↔ض ṭ↔ط ẓ↔ظ ḥ↔ح ʿ↔ع` and digraphs `kh↔خ th↔ث dh↔ذ sh↔ش gh↔غ` — checked **both directions** (a missing dot on an emphatic is the classic beginner-content bug) |
| `harakat` | warning | an A0/A1 fully-vowelled field with an interior consonant carrying no ḥarakah and not acting as a long-vowel carrier (conservative heuristic: excuses alif/maddah/ة, word-final letters, و/ي after the matching short vowel, and the assimilated definite-article lām) |
| `longvowel` | warning | translit has more long-vowel macrons than the Arabic has carriers (+1 slack) |
| `length` | warning | gross letter-count mismatch between script and translit — a transposition or truncation |
| `levelfit` | warning | an `A1`-tagged lexeme whose English gloss is not on `content/wordlists/a1.json` — "confirm it belongs at A1". Both sides are normalised the same way (`lemmaVariants()`): lowercase, drop `(…)` qualifiers and terminal `? ! .`, split `/` and `,` compounds, article/`to`-insensitive |

---

## 2. Linter on the current content set

`node tools/build-content.js` (default / `--check`) — the linguistic linter
runs, finds **0 hard errors**, and the build proceeds silently.

`node tools/build-content.js --lint` — prints the combined advisory report:

```
content lint — 83 advisory warning(s):
  ! orphaned: lex:gre-02 (lexemes) is not referenced by any prereq, syllable, …
  ! …
```

All 83 are M14.5's orphan check (vocabulary authored ahead of its curriculum
slot). **Zero come from M20's linguistic linter** — no `linguistic — …` line,
no `emphatic` / `register` / `ar-indic` error, no `harakat` / `longvowel` /
`length` / `levelfit` warning.

**0 linguistic errors.** Three genuine translit-dot inconsistencies the
`emphatic` rule surfaced during calibration were fixed in
`content/lexemes.json`:

| id | was | now |
|---|---|---|
| `lex:gre-01` | `marhaban` | `marḥaban` |
| `lex:fc-14` | `taʿām` | `ṭaʿām` |
| `lex:fc-28` | `kayfa hāluk` | `kayfa ḥāluk` |

(These three propagate to `tools/audio-manifest.json` / `.md`, regenerated.)

**0 warnings.** The 10 `levelfit` warnings from the first gate pass are resolved:

| id | English | resolution |
|---|---|---|
| `lex:ver-07` | to hear / to listen | `levelfit` now splits `/`-compounds → matches `to hear` |
| `lex:ver-10` | to work / to do | → matches `to work` |
| `lex:col-07` | orange | `levelfit` now drops `(…)` qualifiers → matches `orange (colour)` |
| `lex:pro-03` | they (masculine/mixed group) | → both sides normalise to `they`, matches `they (m.)` |
| `lex:pla-02` | village | → matches `town / village` |
| `lex:col-10` | gray | word-list entry widened `grey` → `grey / gray` |
| `lex:obj-08` | umbrella | added to word-list (`weather`, priority 3) |
| `lex:exp-10` | How much is this? | added to word-list (`shopping`, priority 2) |
| `lex:hom-11` | a house (subject form, ending in ḍammatayn) | grammar-demo pseudo-lexeme → `content/_lint-allow.json` |
| `lex:hom-12` | in a house (ending in kasratayn, after a preposition) | grammar-demo pseudo-lexeme → `content/_lint-allow.json` |

The `levelfit` gloss normalisation (`lemmaVariants()` in `content-lint.js`) is
applied identically to the word-list lemmas and to each lexeme's `en`, so the
match is symmetric. `content/_lint-allow.json` records the two grammar-demo
exceptions with a `_why` note for each.

---

## 3. Every rule fires — fixtures

`tools/lint-fixtures.js` holds one minimal deliberately-broken object per rule
and asserts three things for each: the fixture is flagged at the right severity,
the corrected version is clean, and an `_lint-allow.json` entry silences it.

`node tools/lint-fixtures.js`

```
  ✔ [register] fixture is flagged (error)
  ✔ [register] fixed version is clean
  ✔ [register] _lint-allow.json silences it
  ✔ [ar-indic] fixture is flagged (error)
  ✔ [ar-indic] fixed version is clean
  ✔ [ar-indic] _lint-allow.json silences it
  ✔ [emphatic] fixture is flagged (error)
  ✔ [emphatic] fixed version is clean
  ✔ [emphatic] _lint-allow.json silences it
  ✔ [harakat] fixture is flagged (warning)
  ✔ [harakat] fixed version is clean
  ✔ [harakat] _lint-allow.json silences it
  ✔ [longvowel] fixture is flagged (warning)
  ✔ [longvowel] fixed version is clean
  ✔ [longvowel] _lint-allow.json silences it
  ✔ [length] fixture is flagged (warning)
  ✔ [length] fixed version is clean
  ✔ [length] _lint-allow.json silences it
  ✔ [levelfit] fixture is flagged (warning)
  ✔ [levelfit] fixed version is clean
  ✔ [levelfit] _lint-allow.json silences it
  ✔ [levelfit] compound / qualified glosses match a plain lemma
  ✔ [levelfit] a genuinely off-level word still warns

✅ ALL LINT FIXTURES BEHAVE
```

---

## 4. The A1 word-list spec

`content/wordlists/a1.json` — an **English-side curriculum plan**, not Arabic
content. 263 entries across 14 topic areas, each `{ en, topic, pos, priority }`.
A0-covered items (numbers 0–10, the six basic colours, core greetings, immediate
family, days, basic food) are deliberately omitted — the file is the A1
*extension over A0*. Count is partial by design and grows as Phase B batches land.

Sources cited in `_meta`:

- **Brustad, Al-Batal & Al-Tonsi** — *Al-Kitaab fii Taʿallum al-ʿArabiyya, Part One*, 3rd ed. (Georgetown University Press) — first-year core vocabulary
- **Buckwalter & Parkinson** — *A Frequency Dictionary of Arabic* (Routledge, 2011) — top frequency bands, cross-checked for concreteness and beginner suitability

Topic breakdown: family 23 · food 26 · home 21 · time 20 · daily-routine 23 ·
school 23 · work 11 · places 19 · shopping 10 · travel 10 · directions 15 ·
health 9 · social 43 · weather 10.

---

## 5. Lessons authored as data

### Schema — `content/lessons/*.json`

```
{
  "id":                 kebab-case, unique, must NOT collide with an inline
                        index.html catalog lesson id
  "unitId":             a curriculum unit id, or null
  "curriculumLessonId": a curriculum lesson id (for progress tracking), or null
  "title":              string
  "level":              a level id from levels.json
  "skills":             non-empty list of valid skill ids
  "objectives":         list of learning-object ids; each must resolve, and none
                        may be a higher level than the lesson
  "steps":              non-empty list; each step.type ∈ { explain, example-set,
                        practice-choice, quiz, trace-letter, reading-practice,
                        audio-exercise, listen-repeat, exercise, complete }
}
```

A step may carry `"fromObjectives": true` (only on `example-set` /
`reading-practice`). At **build time**, `tools/build-content.js` expands it from
the lesson's lexeme objectives into a normal `items` array — pulling `ar`,
`translit`, `en`, `pos`, and the object's own `example` sentence if it has one —
so the lesson file itself contains **zero inlined Arabic**; everything comes from
the reviewed `content/lexemes.json` entries. `build-content.js` validates every
rule above; `index.html` folds `CONTENT.lessons` into the runtime `lessons`
catalog (`if (!lessons[L.id]) lessons[L.id] = L;` — a JSON lesson never shadows
an inline one).

One supporting runtime tweak: `renderExampleSetStep` now omits the `(translit)`
parenthetical for an example sentence that has no transliteration, instead of
rendering an empty `()`. Behaviour is identical for every pre-existing
example-set (they all carry translit); the byte-compare confirms no data
structure changed.

### Sample — `content/lessons/a1-verbs-communication.json`

A four-verb A1 vocabulary lesson: `explain` → `example-set` (`fromObjectives`) →
`complete`. Objectives: `lex:ver-06` (to speak), `lex:ver-07` (to hear/listen),
`lex:ver-08` (to see), `lex:ver-09` (to understand).

The compiled `example-set` step, as spliced into `index.html` — every Arabic
string pulled from the lexeme objects, nothing hand-authored:

```json
{
  "type": "example-set",
  "title": "The verbs",
  "intro": "Tap each card to hear it. The transliteration and meaning come straight from the vocabulary entries — nothing here is added by hand.",
  "items": [
    { "symbolWord": "تَكَلَّمَ", "name": "to speak",           "translit": "takallama", "sound": "verb", "examples": [] },
    { "symbolWord": "سَمِعَ",    "name": "to hear / to listen", "translit": "samiʿa",    "sound": "verb", "examples": [] },
    { "symbolWord": "رَأَى",     "name": "to see",             "translit": "raʾā",      "sound": "verb", "examples": [] },
    { "symbolWord": "فَهِمَ",    "name": "to understand",      "translit": "fahima",    "sound": "verb",
      "examples": [ { "arabic": "هَلْ فَهِمْتَ الدَّرْس؟", "translit": "", "english": "Did you understand the lesson?" } ] }
  ]
}
```

Live-checked (post-rebase): the lesson runs `explain → example-set → complete`
with 0 console errors; the three verbs without an example sentence show
"No example yet.", فَهِمَ shows its sentence; regression lessons (`harakat-intro`
inline, `a1-colours` generated) still run; every nav view renders without
throwing (incl. M21.5's analytics panel, M19.5's IndexedDB layer present); dark
mode + 320 px clean; 0 Arabic-Indic digits in the rendered DOM.

---

## 6. Build is green and byte-stable (rebased on `main`)

```
node tools/build-content.js --check          → content OK and index.html in sync — 234 objects
node tools/build-content.js --write-app       → no change (byte-stable)
node tools/build-audio-manifest.js --check    → audio manifest is up to date (359 targets)
node tools/lint-fixtures.js                    → ✅ ALL LINT FIXTURES BEHAVE
m14-compare2.js (vs index.pre-m15.html)        → ✅ NO UNEXPECTED DIFFERENCES
m15/m16/m17/m18/m19-func.js                    → ✅ ALL PASS
```

(`tools/qa-harness.js` and `tools/a11y-audit.js` — added on `main` — need a
Playwright Chromium download this environment doesn't have; the live-browser
trace above covers the same ground.)

The byte-compare confirms every existing derived structure
(`readingPassages`, `grammarExamples`, syllables, all pre-existing `lessons`)
is unchanged; the only new bytes are the three translit fixes and the one new
`a1-verbs-communication` lesson.

---

## 7. Step 4 (the migration pass) — done

1. ✅ `levelfit` gloss normalisation (`lemmaVariants()`): drop `(…)`, drop
   terminal `? ! .`, split `/` and `,` compounds, article/`to`-insensitive —
   applied to both sides. Regression-tested in `lint-fixtures.js`
   ("compound / qualified glosses match a plain lemma" + "a genuinely off-level
   word still warns").
2. ✅ word-list: `grey` → `grey / gray`; added `umbrella`, `how much is this?`.
3. ✅ `content/_lint-allow.json` created — `lex:hom-11` / `lex:hom-12`
   (`levelfit`), each with a `_why` note.
4. ✅ linter over the full content set: **0 errors, 0 warnings**.

Nothing else in the existing content set triggers a rule. Next:

- **Step 5–6:** this doc + the sample lesson get a live-browser QA trace, then
  the Phase A PR.
- **Phase B:** author the A1 Arabic in small cited, linted, reviewed batches
  (grammar first, then core vocab, then texts) — each its own PR.
