# M20 Phase B — Batch 3: the rest of A1 vocabulary

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m20_content_pipeline_scope.md](m20_content_pipeline_scope.md) §"PHASE B" item 3.
**Base:** `main` @ `c6bdc63` (batch 2 merged, live).
**Branch (on approval):** `feature/m20-a1-vocab-rest`.

---

## 1. Where A1 vocabulary stands after batch 2

`content/lexemes.json`: **131 A0 + 85 A1 = 216 lexemes**. The A1 target list
`content/wordlists/a1.json` (265 lemmas, cited) is the checklist.

Batches 1–2 covered A1 grammar and the five core threads (family, food, home,
time, daily verbs) plus the function words used by batch-1 grammar. **96 lemmas
remain**, across the outward-facing topic threads:

| thread | remaining | notable |
|---|---|---|
| school | 11 | university, word, question, answer, language, Arabic / English (language), pencil, paper, sentence, exam |
| work | 10 | doctor (m/f), engineer, employee, office, company, money, colleague, busy, important |
| places | 9 | country, shop / store, bank, station, park, here, there, near, far |
| shopping | 9 | to buy / sell / pay, price, cheap, expensive, how much?, a little, a lot |
| travel | 9 | bus, train, plane, taxi, ticket, trip, to travel / arrive / return |
| directions | 10 | right, left, straight ahead, under, in front of, behind, next to, between, inside, outside |
| health / body | 9 | head, hand, eye, foot / leg, sick, healthy, tired, pain, medicine |
| weather | 8 | hot, cold, warm, rain, wind, weather, sky, season |
| social glue | 19 | conjunctions (and, or, but, because), question words (who / what / where / when / why / how / how many), subject pronouns (I, you m/f, we), that, good, bad, fine |
| family | 2 | neighbour, young |

**~96 new lexemes** — this closes the A1 word-list.

---

## 2. What this batch adds

### 2.1 The lexemes

New `lex:` objects for all 96 remaining lemmas. Same shape as batch 2:

```json
{ "id": "lex:<slug>", "kind": "lexeme", "ar": "<fully vowelled citation form>",
  "translit": "<ALA-LC-ish>", "en": "<gloss matching wordlists/a1.json>",
  "pos": "<noun|verb|adjective|adverb|preposition|conjunction|interrogative|pronoun>",
  "topic": "<see §2.2>", "level": "A1", "tags": [], "skills": ["vocabulary"], "prereqs": [] }
```

Per batch 2's recommendation 2: **verbs carry an `example` + present-tense
note; everything else is a bare entry.** That is ~11 verbs (to buy/sell/pay,
to travel/arrive/return) with examples; the other ~85 are bare.

### 2.2 Topic tags — 4 new topics

Existing lexeme topics have no slot for work / travel / body / weather words.
Batch 2 set the precedent (added `particles`). This batch adds four more, each
one line in `VOCAB_CATEGORIES` (index.html) so the words are visible in the
Word Bank:

| new topic | label | words |
|---|---|---|
| `work` | "Work & Jobs" | doctor, engineer, employee, office, company, money, colleague, busy, important |
| `travel` | "Travel & Transport" | bus, train, plane, taxi, ticket, trip |
| `body` | "The Body & Health" | head, hand, eye, foot, sick, healthy, tired, pain, medicine |
| `weather` | "Weather & Nature" | rain, wind, sky, weather, season, hot, cold, warm |

Everything else folds into existing topics: school → `school`; places / here /
there / near / far → `places`; to buy/sell/pay, to travel/arrive/return →
`verbs`; price / cheap / expensive / how much / a little / a lot → `shopping`
(**5th new topic — "Shopping & Money"**, or fold into `expressions`; see Q2);
right / left / straight → `directions` (**6th new topic**, or `places`);
under / behind / between / inside / outside → `particles`; conjunctions +
question words → `particles`; pronouns I / you / we → `pronouns`; good / bad /
fine / young → `adjectives`; neighbour → `people`.

### 2.3 Wiring

Generated lesson nodes (`source: "generate"`, M16 generator, no code change),
grouped so each lesson is 8–14 words:

- **`a1-u3`** ("Everyday Words") gains: `a1-school`, `a1-work`, `a1-body-health`,
  `a1-weather`, `a1-question-words`, `a1-connectors` (conjunctions + I/you/we).
- **`a1-u4`** ("Talking About People & Places", currently `planned`) becomes
  `available` with: `a1-places`, `a1-directions`, `a1-travel`, `a1-shopping`.
  This is the unit's actual subject — it can now carry real lessons.

`a1-u5` (Numbers) is untouched — the counted-noun grammar it needs is A2.

### 2.4 Proof (same bar as batch 2)

- `build-content.js --check` green; `--lint` **0 new linguistic warnings**
  (harakat / emphatic / longvowel / length / register / ar-indic / levelfit
  clean on all 96) — the `levelfit` rule confirms each is on `wordlists/a1.json`.
- The `--lint` **orphan-warning count drops** — each new lexeme is referenced
  by a generated lesson objective (the outward threads that were 83 orphans'
  worth of authored-ahead vocab finally get their curriculum slots).
- `--write-app` byte-stable for existing objects; `m14` byte-compare shows only
  the new lexemes (+ harakat-intro's vocab-pool example lists, already
  whitelisted).
- `build-audio-manifest.js --check` clean after regen.
- `m15`–`m19` func suites pass (object / lesson-node counts bumped).
- Live browser: every new lesson runs start→finish; the new Word Bank
  categories render and filter; `a1-u4` shows as an available unit with its
  four lessons; Western digits in chrome; dark + 320 px.
- `ROADMAP.md` M20 row updated.

---

## 3. Sourcing — every word verified, not invented

Per invariant I6. Each lexeme's Arabic (spelling **and** full vowelling) and
part of speech checked against:

- **Al-Kitaab fii Taʿallum al-ʿArabiyya, Part One, 3rd ed.** — first-year
  vocabulary and vowelled citation forms.
- **Hans Wehr, *A Dictionary of Modern Written Arabic*** — spelling, root,
  gender, plurals.
- **A Frequency Dictionary of Arabic** (Buckwalter & Parkinson) — register-
  neutrality and genuine high frequency.
- Existing in-repo lexemes for any shared root (reuse exact vowelling).

The draft PR presents all ~96 as one table (id · Arabic · translit · en · pos ·
topic) for your line-by-line review before merge.

---

## 4. Open questions

1. **Batch size.** ~96 lexemes in one PR, or split — **3a** = the four
   outward "getting around" threads for `a1-u4` (places + directions + travel +
   shopping, ~37) and **3b** = school + work + body + weather + social glue for
   `a1-u3` (~59)? Recommend **one PR** — bare entries review fast in a single
   table, and each is independently linted; splitting doubles the merge
   overhead. Fall back to the 3a / 3b split only if the table is unwieldy.
2. **`shopping` and `directions` as topics, or fold?** `directions` (right /
   left) fits `places`; `shopping` (price / cheap) has nowhere clean.
   Recommend **add both as topics** — consistent with `work` / `travel` /
   `body` / `weather`, and the Word Bank stays navigable as A2+ grows these.
   (Total: 6 new `VOCAB_CATEGORIES` lines.)
3. **Question words — `particles` or a `questions` topic?** who / what / where /
   when / why / how / how many. Recommend **`particles`** (they are
   grammatical function words; a dedicated topic for 7 items is thin).
4. **Unblock `a1-u4` now?** It needs vocab (this batch) + grammar (batch 1,
   done) + speaking (deferred to M24). Recommend **yes, mark it `available`**
   with the four getting-around lessons — the "speaking" strand on the unit is
   aspirational; every other A1 unit is already vocab/reading-only.

---

## 5. Not in this batch

A1 reading / listening / comprehension texts (batch 4), A1 writing / dictation
(batch 5), the counted-noun grammar for `a1-u5` (A2), any runtime/engine change
beyond the `VOCAB_CATEGORIES` lines, any A2+ vocabulary.
