# M20 — linguistic lint & data-authored lessons: proof

This is the review-gate artifact for M20 Phase A rollout step 3. It shows the
linter running on the current content set, each rule firing on a deliberately
broken fixture, and the first data-authored lesson compiling into the app with
no hand-inlined Arabic.

Regenerate the numbers here with:

```bash
node tools/build-content.js --lint
node tools/lint-fixtures.js
node tools/build-content.js --check
```

---

## 1. The linter

`tools/content-lint.js` — pure, zero-dependency, `lint(data, wordlists, allow) →
{ errors, warnings }`. No file IO. Called by `tools/build-content.js` as part of
every run; **hard errors fail the build (`exit 1`), warnings are printed only**.
It is a safety net, not the authority — a human still verifies every piece of
Arabic. `content/_lint-allow.json` (`{ "<object-id>": ["<rule>", …] }`) silences
a rule for one object where the flag is a deliberate, reviewed exception.

| rule | severity | catches |
|---|---|---|
| `register` | **error** | a colloquialism (bare-consonant skeleton match against a denylist of ~30 dialect words) in MSA-only content |
| `ar-indic` | **error** | Arabic-Indic digits (٠–٩) in an object whose `topic` is not `"numbers"` |
| `emphatic` | **error** | translit/script disagreement on the 1:1 pairs the scheme maps — `ṣ↔ص ḍ↔ض ṭ↔ط ẓ↔ظ ḥ↔ح ʿ↔ع` and digraphs `kh↔خ th↔ث dh↔ذ sh↔ش gh↔غ` — checked **both directions** (a missing dot on an emphatic is the classic beginner-content bug) |
| `harakat` | warning | an A0/A1 fully-vowelled field with an interior consonant carrying no ḥarakah and not acting as a long-vowel carrier (conservative heuristic: excuses alif/maddah/ة, word-final letters, و/ي after the matching short vowel, and the assimilated definite-article lām) |
| `longvowel` | warning | translit has more long-vowel macrons than the Arabic has carriers (+1 slack) |
| `length` | warning | gross letter-count mismatch between script and translit — a transposition or truncation |
| `levelfit` | warning | an `A1`-tagged lexeme whose English lemma is not on `content/wordlists/a1.json` — "confirm it belongs at A1" |

---

## 2. Linter on the current content set

`node tools/build-content.js --lint`

```
lint OK — 0 errors, 10 warning(s).
```

**0 errors.** Three genuine translit-dot inconsistencies the `emphatic` rule
surfaced during calibration have been fixed in `content/lexemes.json`:

| id | was | now |
|---|---|---|
| `lex:gre-01` | `marhaban` | `marḥaban` |
| `lex:fc-14` | `taʿām` | `ṭaʿām` |
| `lex:fc-28` | `kayfa hāluk` | `kayfa ḥāluk` |

(These three propagate to `tools/audio-manifest.json` / `.md`, regenerated.)

**10 warnings, all `levelfit`** — every one is an A1 lexeme that is not yet on
the A1 word-list spec. None is a linguistic fault; each is a "does this belong at
A1?" question for the migration pass (step 4). They split three ways:

| id | English | disposition (proposed, step 4) |
|---|---|---|
| `lex:col-07` | orange | add to word-list (`colours` are A1 extension) |
| `lex:col-10` | gray | add to word-list |
| `lex:obj-08` | umbrella | add to word-list (`weather`/`home`) |
| `lex:pla-02` | village | add to word-list (`places`) |
| `lex:ver-07` | to hear / to listen | word-list has `hear` + `listen`; `levelfit` needs to split `/`-compounds and strip `to ` — rule fix, step 4 |
| `lex:ver-10` | to work / to do | same — `work` is on the list |
| `lex:exp-10` | How much is this? | phrase, not a lemma — allow-list or add a `shopping` phrase entry |
| `lex:pro-03` | they (masculine/mixed group) | pronoun; parenthetical defeats the match — normalise `en` or allow-list |
| `lex:hom-11` | a house (subject form, ending in ḍammatayn) | grammar-demo lexeme, not real vocab → `_lint-allow.json` |
| `lex:hom-12` | in a house (ending in kasratayn, after a preposition) | grammar-demo lexeme → `_lint-allow.json` |

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

✅ ALL LINT FIXTURES BEHAVE
```

---

## 4. The A1 word-list spec

`content/wordlists/a1.json` — an **English-side curriculum plan**, not Arabic
content. 261 entries across 14 topic areas, each `{ en, topic, pos, priority }`.
A0-covered items (numbers 0–10, the six basic colours, core greetings, immediate
family, days, basic food) are deliberately omitted — the file is the A1
*extension over A0*. Count is partial by design and grows as Phase B batches land.

Sources cited in `_meta`:

- **Brustad, Al-Batal & Al-Tonsi** — *Al-Kitaab fii Taʿallum al-ʿArabiyya, Part One*, 3rd ed. (Georgetown University Press) — first-year core vocabulary
- **Buckwalter & Parkinson** — *A Frequency Dictionary of Arabic* (Routledge, 2011) — top frequency bands, cross-checked for concreteness and beginner suitability

Topic breakdown: family 23 · food 26 · home 21 · time 20 · daily-routine 23 ·
school 23 · work 11 · places 19 · shopping 9 · travel 10 · directions 15 ·
health 9 · social 43 · weather 9.

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
the lesson's lexeme objectives into a normal `items` array — so the lesson file
itself contains **zero inlined Arabic**; the Arabic comes from the reviewed
`content/lexemes.json` entries. `build-content.js` validates every rule above;
`index.html` folds `CONTENT.lessons` into the runtime `lessons` catalog
(`if (!lessons[L.id]) lessons[L.id] = L;` — a JSON lesson never shadows an
inline one).

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
    { "symbolWord": "تَكَلَّمَ", "name": "to speak",            "translit": "takallama", "sound": "verb", "examples": [] },
    { "symbolWord": "سَمِعَ",    "name": "to hear / to listen",  "translit": "samiʿa",    "sound": "verb", "examples": [] },
    { "symbolWord": "رَأَى",     "name": "to see",              "translit": "raʾā",      "sound": "verb", "examples": [] },
    { "symbolWord": "فَهِمَ",    "name": "to understand",       "translit": "fahima",    "sound": "verb", "examples": [] }
  ]
}
```

---

## 6. Build is green and byte-stable

```
node tools/build-content.js --check          → content OK and index.html in sync — 234 objects
node tools/build-audio-manifest.js --check    → audio manifest is up to date (359 targets)
node tools/lint-fixtures.js                    → ✅ ALL LINT FIXTURES BEHAVE
m14-compare2.js (vs index.pre-m15.html)        → ✅ NO UNEXPECTED DIFFERENCES
m15/m16/m17/m18/m19-func.js                    → ✅ ALL PASS
```

The byte-compare confirms every existing derived structure
(`readingPassages`, `grammarExamples`, syllables, all pre-existing `lessons`)
is unchanged; the only new bytes are the three approved translit fixes and the
one new `a1-verbs-communication` lesson.

---

## 7. Open items for step 4 (the migration pass)

1. Resolve the 10 `levelfit` warnings per the dispositions in §2 — extend the
   word-list, teach `levelfit` to split `/`-compounds and strip parentheticals,
   and create `content/_lint-allow.json` for `lex:hom-11` / `lex:hom-12`.
2. Run the linter over the full content set with the tightened rule and confirm
   0 errors / 0 unexplained warnings.
3. Then Phase B: author the A1 Arabic in small cited, linted, reviewed batches
   (grammar first, then core vocab, then texts) — each its own PR.
