# M20 Phase B — Batch 4: A1 reading / listening / comprehension texts

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m20_content_pipeline_scope.md](m20_content_pipeline_scope.md) §"PHASE B" item 4.
**Base:** `main` @ `4f9ecd9` (batch 3 merged, live — A1 vocabulary complete).
**Branch (on approval):** `feature/m20-a1-texts`.

---

## 1. Where the text strands stand

`content/texts.json`: **29 texts** — 3 M8 reading passages (`source:"m8"`) and
26 M20-B1 grammar-example sentences (`source:"m11"`). The reading / listening /
comprehension strands at A1 currently rest almost entirely on those 3 M8
sentences (`الْبَيْتُ كَبِيرٌ` and two siblings) plus the grammar examples.

The A1 descriptors ask for:

| strand | A1 can-do |
|---|---|
| reading | reads fully-vowelled words and short sentences aloud accurately |
| listening | understands familiar words and very short slowly-spoken phrases — greetings, numbers, personal information |
| comprehension | extracts specific predictable information (a name, a number, a time, a place) from a very short text or exchange; gets the topic when stated explicitly |

This batch authors **18–22 short fully-vowelled A1 texts** — graded sentences
and 2–4-turn mini-dialogues — built **only** from the merged A1 inventory, and
wires them into runnable lessons.

---

## 2. Hard constraints — the A1 inventory, nothing else

### 2.1 Vocabulary — closed set

Every content word in every text **must** be one of:

- the **310 merged lexemes** in `content/lexemes.json` (131 A0 + 179 A1), used
  in a form the learner has met (citation form, or the fixed `example` form on
  that lexeme);
- a closed-class grammar word already taught as a lexeme (the pronouns,
  demonstratives, `particles` — prepositions / conjunctions / question words);
- a **proper first name** from a short authored set (see Q3) — proper nouns,
  not vocabulary to learn.

**No other Arabic word may appear.** If a text needs a word that is not in the
set, the text is cut or reworded — the word is **not** added (that is a later
vocabulary batch's job, and this batch must not smuggle in vocab to make a
sentence work).

### 2.2 Grammar — the 9 A1 points only

Permitted structures (each text's `prereqs` names the points it uses):

| A1 point | in a text looks like |
|---|---|
| `gr:nominal-sentence` | definite topic + indefinite comment, **no verb**: `الطَّقْسُ حَارٌّ` |
| `gr:gender-agreement` | `الْغُرْفَةُ نَظِيفَةٌ` (fem. noun → fem. adjective) |
| `gr:definiteness` | `الـ` vs tanwīn used correctly throughout |
| `gr:noun-number` | a dual / plural may **appear** (`الْكُتُبُ عَلَى الطَّاوِلَةِ`) — recognition only, never required to be produced |
| `gr:demonstratives` | `هَذَا كِتَابٌ` · `هَذِهِ مَدْرَسَتِي` · `ذَلِكَ الرَّجُلُ طَبِيبٌ` |
| `gr:attached-possessive` | `بَيْتِي` · `اسْمُهُ` · `غُرْفَتُهَا` |
| `gr:core-prepositions` | prepositional predicate, noun in the genitive: `الْحَقِيبَةُ تَحْتَ الْكُرْسِيِّ` |
| `gr:negation-a1` | `لَيْسَ الْجَوُّ بَارِدًا` · `هَذَا لَيْسَ قَلَمِي` · `لَا مَاءَ فِي الْكُوبِ` |
| `gr:sun-moon` | correct assimilation in the vowelling / translit (`ash-shams`) |

Also permitted because each is already an authored, taught lexeme (not a new
grammar rule): coordination with **`وَ` / `أَوْ` / `لَكِنْ`**; the question words
**`مَنْ` `مَا` `أَيْنَ` `كَيْفَ` `مَتَى` `لِمَاذَا` `كَمْ`**; the fixed
phrases (`كَيْفَ حَالُكَ؟`, `مَا اسْمُكَ؟`, `أَيْنَ الْحَمَّامُ؟`,
`بِكَمْ هَذَا؟`, the greeting adjacency pairs, `بِخَيْرٍ`, `تَشَرَّفْنَا`); the
time adverbs `الْيَوْمَ` / `غَدًا` / `أَمْسِ` / `الْآنَ`.

**Explicitly forbidden** (all A2+ — do not use, do not add):

- **Any conjugated verb.** A1 has no verb-sentence grammar. Texts are verbless
  (nominal sentences and their variants). The verb lexemes stay in their own
  lesson example sentences; they do not enter batch-4 texts. → this is the
  single biggest limit; see §5.
- The genitive construct (**iḍāfa**) beyond the handful already lexicalised
  (`غُرْفَةُ النَّوْمِ`, `صَبَاحُ الْخَيْرِ`, `سَيَّارَةُ أُجْرَةٍ`,
  `قَلَمُ رَصَاصٍ`) and beyond noun + attached pronoun. `بَابُ الْبَيْتِ`
  ("the door of the house") is A2 — use `بَابُهُ` or `الْبَابُ فِي الْبَيْتِ`.
- **Numbers with a counted noun** (`ثَلَاثَةُ كُتُبٍ`) — number–noun agreement
  and polarity are A2. Numbers 0–10 may appear only **standing alone** (as an
  answer: `— كَمْ؟ — ثَلَاثَةٌ`).
- Comparatives / superlatives (`أَكْبَر`), `كَانَ` and its sisters, `إِنَّ`,
  relative clauses (`الَّذِي`), the subjunctive, `سَوْفَ` / `سَـ`, the dual/
  plural **verb** or **pronoun** agreement, `لَنْ` / `لَمْ`.
- Subordination beyond a single `لِأَنَّ` + a nominal clause, and only if it
  stays inside the inventory (`الْأُمُّ سَعِيدَةٌ لِأَنَّ الْبَيْتَ نَظِيفٌ`).

### 2.3 Form

- **Fully vowelled.** Every consonant carries its ḥarakah / sukūn / shadda /
  tanwīn — the `harakat` linter (warn) and a review pass both check this.
- **No `reduced` / `unvowelled` fields.** Progressive de-vowelling is A2's
  `unvowelled-reading` lesson; batch-4 texts are A1 = fully vowelled. Omitting
  the fields keeps them clear of the M20.5 drift check (which only runs when a
  field is present).
- Western digits nowhere; numbers, if any, are **spelled out** (`ثَلَاثَة`).
- `audio` = the `vowelled` string, as every existing text does.

---

## 3. What ships

### 3.1 `content/texts.json` — 18–22 new objects

Shape follows the existing `txt:gram-*` objects:

```json
{ "id": "txt:read-<slug>", "kind": "text",
  "textType": "sentence" | "dialogue",
  "source": "m20",
  "vowelled": "<fully vowelled>", "translit": "<ALA-LC-ish>", "en": "<gloss>",
  "words": [ { "surface": "...", "translit": "...", "gloss": "...", "gender": "..." } ],
  "audio": "<= vowelled>",
  "level": "A1",
  "skills": ["reading", "listening", "comprehension"],
  "prereqs": [ "gr:<points used>" ] }
```

- **`source: "m20"`** — a new provenance value. The only code change in this
  batch: `["m8", "m11"]` → `["m8", "m11", "m20"]` in `build-content.js`'s text
  check (one line). Rationale: `m8` = "M8 reading passage" (carries
  `reduced`/`unvowelled` and feeds the `readingPassages` derived view + the
  `unvowelled-reading` lesson); `m11` = "grammar-demo sentence" (carries
  `concept`, feeds `grammarExamples`). Batch-4 texts are neither — a fresh tag
  keeps them out of both derived views and lets them reach lessons only through
  their own data-authored lessons. (Alternative in Q1.)
- **Dialogues:** `textType: "dialogue"`; `vowelled` is the whole exchange with
  turns separated by ` — ` (em-dash), speakers alternating and unlabelled (or
  labelled `أ` / `ب`; see Q2). A `turns` array (`[{ ar, translit, en }]`) is
  **also** stored for a future turn-by-turn renderer; the current
  `reading-practice` renderer shows `vowelled` as one block, which is fine for
  2–4 short turns.

### 3.2 Progression — simple → longer (the ~20 texts)

| tier | n | shape | examples (illustrative — final Arabic authored + reviewed) |
|---|---|---|---|
| **1 — two-word statements** | 6 | `الـ`-noun + indefinite adjective; pronoun + noun | `الطَّقْسُ حَارٌّ` · `أَنَا طَالِبٌ` · `الْغُرْفَةُ نَظِيفَةٌ` · `هُوَ مُهَنْدِسٌ` |
| **2 — 3–4 words: place, possession, pointing** | 6 | prepositional predicate; noun + attached pronoun; demonstrative + noun | `الْكِتَابُ عَلَى الطَّاوِلَةِ` · `هَذَا بَيْتِي` · `صَدِيقِي فِي الْجَامِعَةِ` · `ذَلِكَ الرَّجُلُ طَبِيبٌ` |
| **3 — coordinated / negated** | 4 | two clauses joined by `وَ` / `لَكِنْ`; `لَيْسَ` / `لَا` | `الْأَبُ فِي الْمَكْتَبِ وَالْأُمُّ فِي الْبَيْتِ` · `أَنَا مُتْعَبٌ لَكِنْ سَعِيدٌ` · `لَيْسَ الْجَوُّ بَارِدًا الْيَوْمَ` |
| **4 — mini-dialogues (2–4 turns)** | 4 | greeting exchange; asking the way; "who is this?"; "how much?" | `— السَّلَامُ عَلَيْكُمْ. — وَعَلَيْكُمُ السَّلَامُ. — كَيْفَ حَالُكَ؟ — بِخَيْرٍ، شُكْرًا.` |

Each tier's texts share vocabulary with the batch-1–3 lessons so nothing is
new to the reader except the act of reading a whole (short) text.

### 3.3 Wiring — 3 data-authored lessons

`content/lessons/*.json`, using the pipeline batch 1 built (`reading-practice`
+ `fromObjectives` already expands `txt:` objectives; no compiler change):

- **`a1-reading-sentences`** → `a1-u1` — tiers 1–2: an `explain` on "reading a
  whole sentence: find the topic, then the comment", one `reading-practice`
  (fromObjectives, the ~12 tier-1/2 texts), 2 `practice-choice` comprehension
  checks ("which sentence says the weather is hot?"), `complete`.
- **`a1-reading-connected`** → `a1-u1` — tier 3: `explain` on `وَ` / `لَكِنْ` /
  `لَيْسَ` joining ideas, `reading-practice` (the 4 texts), 1 comprehension
  check, `complete`.
- **`a1-listening-dialogues`** → `a1-u1` (or a new `a1-u4` slot; see Q4) —
  tier 4: `explain` on "an exchange has two speakers; listen for the answer",
  `reading-practice` (the 4 dialogues, audio-forward), 2 comprehension checks
  ("what is the second speaker's name?"), `complete`.

Curriculum: 3 new `source:"steps:<id>"` lesson nodes on `a1-u1` (orders 5–7).
No unit status change (a1-u1 is already `available`). `a1-u2` ("Reading Beyond
Full Vowels", A2) is untouched.

### 3.4 Not shipped / not touched

`readingPassages` and `grammarExamples` derived views (batch-4 texts use
`source:"m20"`, so neither picks them up); the M8 `sentence-reading` and
`unvowelled-reading` lessons; any `gr:` object; `VOCAB_CATEGORIES`; the M16
generator.

---

## 4. Acceptance criteria

A reviewer (you) signs off only if **all** of these hold. The draft PR presents
every text in a table (`id · vowelled · translit · en · grammar points · every
content word → its lexeme id`) so each row is checkable at a glance.

**Content**

1. **Vocabulary closure.** Every content word in every text maps to a lexeme
   id in `content/lexemes.json` (or is a listed proper name, or a taught
   closed-class particle). The PR table has a "words → lexeme ids" column;
   **zero** unmatched words.
2. **Grammar closure.** Every text uses only the 9 A1 grammar points + the
   permitted coordinators / question words / fixed phrases from §2.2. **No**
   conjugated verb, iḍāfa (beyond the lexicalised four), counted noun,
   comparative, `كان`, relative clause, or A2 tense/mood marker appears. Each
   text's `prereqs` lists exactly the `gr:` points it exercises, and all
   resolve and are A1 (`--check` enforces level-monotonicity).
3. **Full vowelling.** `build-content.js --lint` reports **0 new `harakat`
   warnings** on the new texts; a manual pass confirms every consonant is
   pointed.
4. **Register + digits.** `--lint` reports 0 `register` and 0 `ar-indic`
   errors; no Western or Arabic-Indic digit appears anywhere; any number is
   spelled out.
5. **Sourcing.** Every sentence is a standard textbook pattern verified against
   Al-Kitaab Part One and Ryding's *Reference Grammar of MSA* (§6). No sentence
   is invented to fit; the PR notes the source pattern per text.
6. **Translit + gloss.** `translit` matches the vowelled Arabic 1:1 (sun-letter
   assimilation shown, `ة` as `-ah`, case endings written); `en` is natural
   English; every `words[]` entry has `surface` / `translit` / `gloss`.
7. **Progression.** Tier 1 ≤ 3 words, tier 2 ≤ 5, tier 3 = two clauses, tier 4
   = 2–4 turns. No tier-1 text is longer than any tier-2 text.

**Build / regression**

8. `node tools/build-content.js --check` — green, index.html in sync.
9. `node tools/build-content.js --lint` — **0 new linguistic errors or
   warnings**; the pre-existing 83 M14.5 orphan warnings unchanged or reduced
   (each new text is referenced by a lesson objective → adds no orphan).
10. `node tools/build-content.js --write-app` — byte-stable on re-run;
    `m14-compare2.js` shows **only** the new texts as changed bytes (existing
    derived structures, all catalog lessons, and the M8/M11 views untouched).
11. `node tools/build-audio-manifest.js --check` — clean after regen.
12. `m15`–`m19` func suites pass (object / lesson-node counts bumped only).

**Live (SW-cleared, `?v=` cache-bust)**

13. All 3 new lessons run `explain → reading-practice → practice-choice… →
    complete` with **0 console errors**; each `reading-practice` step renders
    its texts with audio + reveal; the comprehension `practice-choice` steps
    gate and accept the correct answer.
14. The new texts appear nowhere they should not — not in the M8
    `sentence-reading` lesson, not in the grammar view, not in the placement
    "which rule is this?" quiz.
15. Dark theme + 320 px: no horizontal overflow on any new lesson step;
    Arabic renders RTL; Western digits in chrome.

**Docs**

16. `ROADMAP.md` M20 row updated; `content/m20-lint-proof.md` "current content"
    line refreshed if its counts are quoted.

---

## 5. What A1 cannot express naturally — and what we do about it

Identified up front so the batch is not quietly padded to hide them:

| gap | why it is A2+ | batch-4 workaround |
|---|---|---|
| **Any action or narrative** ("she went to the market", "I drink coffee in the morning") | needs verb-sentence grammar + past/present conjugation — **no A1 grammar point covers verbs** | texts stay **verbless**: states, descriptions, locations, identities, feelings. No text tells a story. This is a real ceiling — connected *narrative* reading waits until after the A2 verb-sentence unit. |
| **Stating a price** ("it costs ten riyals") | currency noun not in inventory + number–noun agreement (A2) | shopping dialogue stays qualitative: `— بِكَمْ هَذَا؟ — هَذَا رَخِيصٌ` / `غَالٍ` |
| **Telling clock time** ("it's half past three") | ordinal + iḍāfa + `النِّصْف` — all A2 | time stays adverbial: `الْآنَ` / `صَبَاحًا` (if `صباح`→adverb is deemed in range) / `الْيَوْمَ` |
| **"the X of the Y"** (`مِفْتَاحُ الْبَابِ`) | iḍāfa (A2) | attached pronoun (`مِفْتَاحُهُ`) or a preposition (`الْمِفْتَاحُ فِي الْحَقِيبَةِ`) |
| **Plurals used productively** ("there are many books") | number-noun / quantifier + plural agreement | a plural may *appear* for recognition; the text never hinges on the reader parsing the agreement |
| **"because" + a reason with a verb** | verb clause | at most one `لِأَنَّ` + a nominal clause inside the inventory, used sparingly (target: ≤ 2 texts) |
| **Names in dialogues** | proper nouns are not in `lexemes.json` | see Q3 — a tiny authored name set, used inline in dialogue text only, not as vocab to drill |
| **`هَلْ` yes/no questions** | `هَلْ` is not a taught lexeme | use a question word (`مَنْ` / `مَا` / `أَيْنَ`) or intonation-only questions (`أَنْتَ طَالِبٌ؟`) — flagged per text |

Net: batch 4 delivers **descriptive** reading and **transactional** dialogue at
A1 — which is exactly what the descriptors ask for (extract a name / place /
number / topic). It does **not** deliver narrative prose; that is correctly a
post-A2 deliverable and the roadmap already places connected-paragraph reading
at A2 (`a2-u5`).

---

## 6. Sourcing

Per invariant I6. Every sentence pattern checked against:

- **Al-Kitaab fii Taʿallum al-ʿArabiyya, Part One, 3rd ed.** — the A1 sentence
  types and the greeting / classroom / "who is this" exchange templates.
- **Ryding, *A Reference Grammar of Modern Standard Arabic*** (Cambridge, 2005)
  — nominal-sentence structure, `لَيْسَ` government, demonstrative agreement,
  preposition + genitive.
- Existing in-repo texts and lexeme `example` fields for any wording already
  authored (reuse verbatim).

No sentence is generated from scratch; the PR names the source template per
text. **You review every sentence and every dialogue before merge.**

---

## 7. Open questions

1. **`source: "m20"` (1-line validator change) vs reuse `source: "m11"` with a
   non-grammar `concept` (e.g. `"a1-reading"`, zero code change).** Recommend
   **`m20`** — the one-line change buys honest provenance and keeps the texts
   out of `grammarExamples` cleanly; reusing `m11` works but overloads the
   "grammar demo" tag and the `concept` field. Either is safe.
2. **Dialogue speaker labels — `أ` / `ب`, or unlabelled em-dash turns?**
   Recommend **unlabelled `—` turns** (matches how the fixed greeting pairs are
   already presented; less clutter at A1). The `turns[]` array carries the
   structure for a future renderer regardless.
3. **Proper names for dialogues.** Recommend authoring **4 transparent, high-
   frequency first names** — `مُحَمَّد` · `سَارَة` · `عُمَر` · `لَيْلَى` —
   used only inside dialogue `vowelled` text (not as `lex:` entries, not
   drilled). They are proper nouns; a learner meeting `اسْمِي سَارَة` needs no
   gloss beyond "Sara". Alternative: no names, and name-exchange dialogues use
   `اسْمِي...` trailing off (weaker).
4. **Third lesson — `a1-u1` or `a1-u4`?** The dialogues lean listening /
   speaking-adjacent, which is `a1-u4`'s ("Talking About People & Places")
   territory. Recommend **`a1-u4`** for `a1-listening-dialogues` (it fits the
   unit's theme and spreads the load), the two reading lessons on `a1-u1`.
5. **Batch size — one PR (~20 texts + 3 lessons), or split reading / dialogue?**
   Recommend **one PR** — 20 short texts review in one table pass; the tiers
   are a single coherent progression.

---

## 8. Not in this batch

A1 writing / dictation (batch 5); wiring `a1-u5` / Numbers (batch 6, and the
counted-noun grammar it needs is A2); any A2 grammar or vocabulary; progressive
de-vowelling of the new texts (that is A2 `unvowelled-reading`'s job); a
turn-by-turn dialogue renderer (the `turns[]` data ships, the renderer does
not); narrative / connected-paragraph reading (post-A2).
