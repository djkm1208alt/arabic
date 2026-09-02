# M20 Phase B — Batch 2: A1 core vocabulary

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m20_content_pipeline_scope.md](m20_content_pipeline_scope.md) §"PHASE B" item 2.
**Base:** `main` @ `fba6a73` (batch 1 merged, live).
**Branch (on approval):** `feature/m20-a1-vocab-core`.

---

## 1. Where A1 vocabulary stands

`content/lexemes.json`: **131 A0 + 31 A1 = 162 lexemes**. The A1 target list
`content/wordlists/a1.json` (263 English-side lemmas, cited) is the checklist;
its `levelfit` linter rule flags any A1 lexeme not on it.

Batch 1 (grammar) introduced seven function words — `هَذَا هَذِهِ فِي عَلَى مِنْ
إِلَى مَعَ لَيْسَ مَا` — **only inside example sentences**. They have no `lex:`
entry yet.

## 2. What this batch adds

New `lex:` objects for the **highest-priority (priority 1) A1 lemmas** in the
five core topic threads, plus the batch-1 function words. Same shape as every
existing lexeme:

```json
{ "id": "lex:<slug>", "kind": "lexeme", "ar": "<fully vowelled, citation form>",
  "translit": "<ALA-LC-ish>", "en": "<gloss matching wordlists/a1.json>",
  "pos": "<noun|verb|adjective|…>", "topic": "<existing topic>", "level": "A1",
  "tags": [], "skills": ["vocabulary"], "prereqs": [] }
```

Optional `example: { "ar": "<short vowelled sentence>", "en": "…" }` and `notes`
where they earn their place (as existing lexemes do).

### 2.1 Word set (English-side — Arabic authored on approval)

Counts are *new* lemmas (existing ones already cover part of each thread):

| thread | topic tag | ~new priority-1 | examples |
|---|---|---|---|
| family / people | `people` | ~9 | child, boy, man, woman, uncle, aunt, name, young, old (person) |
| food & meals | `food` | ~11 | juice, egg, cheese, salt, apple, meal, breakfast, lunch, dinner, hungry, thirsty |
| home | `home` | ~4 | wall, floor, garden, clean |
| time | `time` | ~9 | hour, minute, noon, early, late, always, sometimes, before, after |
| daily verbs | `verbs` | ~12 | to come, to sleep, to wake up, to study, to live, to want, to have, to play, to open, to close, to sit, to walk |
| function words (from batch 1) | `pronouns` / `particles` | ~9 | هَذَا, هَذِهِ, هَؤُلَاءِ, فِي, عَلَى, مِنْ, إِلَى, مَعَ, لَيْسَ |

**~54 new lexemes.** (Words already present at A0 — house, water, days, numbers,
basic colours — are not re-authored; `wordlists/a1.json` already omits them.)

### 2.2 Wiring

`content/curriculum.json` unit `a1-u3` ("Everyday Words", `available`,
`skills: [vocabulary]`) already carries generated lessons (`a1-colours`,
`a1-useful-questions`, …). Add one **generated** lesson node per thread —
`source: "generate"`, objectives = that thread's lexemes — so the M16 lesson
generator (which already handles lexeme objectives) builds a runnable lesson
with no new code:

- `a1-family` · `a1-food` · `a1-home-extra` · `a1-time-extra` · `a1-daily-verbs`
- `a1-this-and-that` (the demonstratives + prepositions, cross-linked from the
  batch-1 grammar points via `prereqs`)

No `index.html` change. No pipeline change (batch 1 already taught the compiler
everything needed; vocab is the pipeline's original job).

### 2.3 Proof

- `build-content.js --check` green; `--lint` → **the `levelfit` warning count
  goes down** (new lexemes are now on the list) and **0 new linguistic
  warnings** (harakat / emphatic / register / ar-indic all clean).
- The orphan-warning count (`--lint`, currently 83) **drops** — each new lexeme
  is referenced by its curriculum lesson objective.
- `--write-app` byte-stable for existing objects; `m14` byte-compare shows
  only the new lexemes.
- `build-audio-manifest.js --check` clean after regen.
- `m15`–`m19` func suites pass (fixtures updated for the new A0/A1 counts).
- Live browser: each new thread lesson runs start→finish; the words appear in
  the Vocabulary view and its quiz; Western digits in chrome; dark + 320 px.
- `ROADMAP.md` M20 row updated.

## 3. Sourcing — every word verified, not invented

Per invariant I6. Each lexeme's Arabic (spelling **and** full vowelling) and
its part of speech are checked against:

- **Al-Kitaab fii Taʿallum al-ʿArabiyya, Part One, 3rd ed.** — the first-year
  core vocabulary and its vowelled citation forms.
- **Hans Wehr, *A Dictionary of Modern Written Arabic*** (Cowan ed.) — for
  spelling, root, gender, and plural where a lexeme's `notes` mentions one.
- **A Frequency Dictionary of Arabic** (Buckwalter & Parkinson) — to confirm
  each is genuinely high-frequency and register-neutral.
- Existing in-repo lexemes for any shared root/pattern (reuse exact vowelling).

The draft PR presents all ~54 as a single table (id · Arabic · translit · en ·
pos · source note) for your line-by-line review before merge.

## 4. Open questions

1. **Batch size.** ~54 lexemes in one PR, or split — e.g. **2a** = family +
   food + function words (~29), **2b** = home + time + daily verbs (~25)?
   Recommend **one PR** — they are individually trivial, a shared review pass
   is efficient, and each is independently linted. Split only if the sentence
   table feels too long to review in one sitting.
2. **`example` sentences on lexemes.** Add a short vowelled example to every
   verb and ~⅓ of nouns (as several existing lexemes have), or keep this batch
   to bare entries and add examples in batch 4 (texts)? Recommend **verbs get
   an example, nouns stay bare** — verbs need a frame to be learnable; noun
   examples are better delivered as the batch-4 reading sentences.
3. **Topic taxonomy.** Keep the existing lexeme `topic` values
   (`people`, `verbs`, `pronouns`) even though `wordlists/a1.json` uses
   `family` / `daily-routine` / `social`? Recommend **yes, keep them** — the
   linter matches on the English gloss, not the topic; renaming 162 objects is
   churn with no user-facing benefit. (A follow-up can align the two
   taxonomies once A1 vocab is complete.)
4. **Function words in this batch or batch 3?** They are already used by
   batch-1 grammar and are top-frequency. Recommend **this batch** — it closes
   the loop on batch 1 (the grammar points can then list them as `prereqs`).

## 5. Not in this batch

Priority-2/3 A1 vocabulary and the remaining threads (shopping, travel, school,
work, health, directions, weather, social) → **batch 3**. A1 reading/listening
texts → batch 4. A1 writing → batch 5. Wiring `a1-u4` / `a1-u5` → batch 6. Any
A2+ content, any engine/UI change.
