# M17 · placement / diagnostic review

**This is the M17 sign-off gate.** The generated placement item bank, the adaptive walk, and the `deriveLevel` precedence are drafted below. Review, then approve — the `#view-placement` UI (intro / item run / results + override) is on hold until you do.

Items are generated at runtime from the existing `CONTENT` objects (like M16's lesson generator) — there is no authored question file. `tools/build-content.js` now fails if a measurable strand lacks objects at ≥ 2 levels.

---

## 1. Strand plan

| strand | how it's placed | why |
|---|---|---|
| **reading** | adaptive MCQ | syllable→translit (A0), word→translit (A1), reduced-vowel sentence→meaning (A2) |
| **vocabulary** | adaptive MCQ | word→meaning, distractors from the same topic |
| **grammar** | adaptive MCQ *(thin)* | sentence → "what does this show?" over the 3 grammar points; only 2 A1 + 3 A2 items possible until M20 authors more |
| **listening** | adaptive MCQ | TTS plays a word/sentence → pick the meaning |
| **comprehension** | adaptive MCQ | unvowelled text → pick the meaning (comprehension, not decoding) |
| **writing** | 0 items · **self-rating** | letter formation / spelling can't be judged from a tap; learner picks the descriptor that fits |
| **pronunciation** | 0 items · **self-rating** *(moved from measured)* | TTS cannot reliably voice the emphatic / pharyngeal minimal pairs a real recognition test needs, and production is never machine-scored. Recognition of letter *sounds* is already covered by the listening check. |
| **speaking** | 0 items · **self-rating** | never machine-scored, by standing rule |

> **Deviation from the approved scope (§8 Q1):** pronunciation is a **self-rating** in v1, not an opt-in measured strand — a TTS "which did you hear, ص or س" item would be dishonest about what it's testing. Flagging for your call.

## 2. Adaptive walk

- Bands: **A0 / A1 / A2** (what current content can test). Start at **A1**.
- Ask **2 items per band** (`PLACEMENT_BATCH = 2`), then re-evaluate: **2/2 → step up**, **0/2 → step down**, **1/2 → settle here**.
- Stop on: settle, hit the A0 floor, ace the A2 ceiling, *bounce* (revisit a band → settle on the lower), or **12 items** total.
- Acing A2 → level **A2**, flagged `atCeiling` → shown as **"A2 or above — we'll refine this as you learn."** Never a fabricated B1+.
- An empty band (e.g. grammar has no A0 items) behaves like a failed band — the walk steps past it.

Worked walks (deterministic given the answers):

| answers | outcome |
|---|---|
| A1 miss, then A0 pass | **A0** |
| A1 pass, A2 split (1/2) | **A2** |
| A1 pass, A2 pass | **A2 · at ceiling** |
| A1 split (1/2) | **A1** |

## 3. `deriveLevel` precedence (with the new placement tier)

```
1. mastered-item coverage   → "firm"  (reliable strand, ≥ 12 mastered)  |  else "provisional"
2. placement result          → "provisional" (measured) / "self-rated" / "self-set" (overridden)   ← M17
3. introduced-lesson coverage → "provisional", capped at A1
4. nothing                   → { level: null, reason: "insufficient evidence" }
```

- Mastery **always** overtakes placement (a later mastered-word run silently wins).
- Placement overtakes the lesson bridge (a deliberate check > clicking through a lesson).
- Placement is **never** `firm`. Speaking placement is only ever `self-rated` / `self-set`.

## 4. The generated item bank

Exactly what `buildPlacementItems(strand)` produces on one run (order/wording will vary with the shuffle; the *set* is fixed). ✓ marks the correct option.

### Reading  —  A0:4  A1:3  A2:3

**A0 band**

- `تَا` — *How is this read?*  
  tā ✓ · mad- · bur- · tū
- `تِي` — *How is this read?*  
  -dda- · mī · tī ✓ · tis-
- `مِرْ` — *How is this read?*  
  mir- ✓ · bā · tā · baḥ-
- `تَّ` — *How is this read?*  
  -dda- · tā · -tta- ✓ · bin-

**A1 band**

- `رَأَى` — *How is this word read aloud?*  
  maʿa s-salāmah · jadd · fahima · raʾā ✓
- `قَرْيَة` — *How is this word read aloud?*  
  qadīm · ṭawīl · qaryah ✓ · ithnān
- `سَمِعَ` — *How is this word read aloud?*  
  samiʿa ✓ · as-salāmu ʿalaykum · sūq · shāriʿ

**A2 band**

- `هُوَ يَذْهَبُ إِلَى الْمَدْرَسَةِ` — *What does this say?*  
  She goes to school. · He goes to school. ✓ · They go to school. · The girl is happy.
- `هِيَ تَذْهَبُ إِلَى الْمَدْرَسَةِ` — *What does this say?*  
  They go to school. · The book is beautiful. · The girl is happy. · She goes to school. ✓
- `هُمْ يَذْهَبُونَ إِلَى الْمَدْرَسَةِ` — *What does this say?*  
  The girl is big. · They go to school. ✓ · The book is beautiful. · The girl is happy.

### Vocabulary  —  A0:4  A1:4  A2:0

**A0 band**

- `اِثْنَان` — *What does this word mean?*  
  nine · one · two ✓ · five
- `جَمِيل` — *What does this word mean?*  
  big · new · beautiful ✓ · easy
- `قَمَر` — *What does this word mean?*  
  moon ✓ · evening · Friday · morning
- `اِسْمِي...` — *What does this word mean?*  
  my name is... ✓ · welcome · peace be upon you (a greeting) · good morning

**A1 band**

- `بِكَمْ هَذَا؟` — *What does this word mean?*  
  How much is this? ✓ · Where is the bathroom? · you're welcome / excuse me · What time is it?
- `قَرْيَة` — *What does this word mean?*  
  village ✓ · mosque · airport · sea
- `فَهِمَ` — *What does this word mean?*  
  to understand ✓ · to drink · to work / to do · to hear / to listen
- `هُمْ` — *What does this word mean?*  
  she · they (masculine/mixed group) ✓ · he · Monday

### Grammar  —  A0:0  A1:2  A2:3

**A1 band**

- `الْبِنْتُ كَبِيرَةٌ` — *“The girl is big.” — what does this sentence show?*  
  Sun & moon letters (definite-article assimilation) · Noun–adjective gender agreement ✓ · Present-tense verb prefixes (he / she / they)
- `الشَّمْسُ كَبِيرَةٌ` — *“The sun is big.” — what does this sentence show?*  
  Noun–adjective gender agreement · Sun & moon letters (definite-article assimilation) ✓ · Present-tense verb prefixes (he / she / they)

**A2 band**

- `هُوَ يَذْهَبُ إِلَى الْمَدْرَسَةِ` — *“He goes to school.” — what does this sentence show?*  
  Sun & moon letters (definite-article assimilation) · Noun–adjective gender agreement · Present-tense verb prefixes (he / she / they) ✓
- `هِيَ تَذْهَبُ إِلَى الْمَدْرَسَةِ` — *“She goes to school.” — what does this sentence show?*  
  Noun–adjective gender agreement · Sun & moon letters (definite-article assimilation) · Present-tense verb prefixes (he / she / they) ✓
- `هُمْ يَذْهَبُونَ إِلَى الْمَدْرَسَةِ` — *“They go to school.” — what does this sentence show?*  
  Present-tense verb prefixes (he / she / they) ✓ · Noun–adjective gender agreement · Sun & moon letters (definite-article assimilation)

### Listening  —  A0:3  A1:8  A2:3

**A0 band**

- 🔊 `بَاب` — *Listen. What does this word mean?*  
  and upon you be peace (the reply) · coffee · friend (male) · door ✓
- 🔊 `عَشَرَة` — *Listen. What does this word mean?*  
  coffee · friend (male) · clock / watch · ten ✓
- 🔊 `مُعَلِّمَة` — *Listen. What does this word mean?*  
  chair · teacher (female) ✓ · eight · year

**A1 band**

- 🔊 `لَا أَعْرِف` — *Listen. What does this word mean?*  
  student (male) · I don't know ✓ · big · to write
- 🔊 `مُسْتَشْفَى` — *Listen. What does this word mean?*  
  son · sea · hospital ✓ · today
- 🔊 `أَيْنَ الْحَمَّام؟` — *Listen. What does this word mean?*  
  Where is the bathroom? ✓ · clock / watch · banana · morning
- 🔊 `الْبَيْتُ كَبِيرٌ` — *Listen. What does this sentence mean?*  
  The sun is big. · The girl is big. · She goes to school. · The house is big. ✓
- 🔊 `الْكِتَابُ جَمِيلٌ` — *Listen. What does this sentence mean?*  
  The book is beautiful. ✓ · The sun is big. · She goes to school. · The girl is happy.
- 🔊 `الْبِنْتُ سَعِيدَةٌ` — *Listen. What does this sentence mean?*  
  The girl is happy. ✓ · The girl is big. · She goes to school. · The sun is big.
- 🔊 `الْبِنْتُ كَبِيرَةٌ` — *Listen. What does this sentence mean?*  
  The girl is big. ✓ · He goes to school. · The house is big. · They go to school.
- 🔊 `الشَّمْسُ كَبِيرَةٌ` — *Listen. What does this sentence mean?*  
  The sun is big. ✓ · The book is beautiful. · They go to school. · He goes to school.

**A2 band**

- 🔊 `هُوَ يَذْهَبُ إِلَى الْمَدْرَسَةِ` — *Listen. What does this sentence mean?*  
  The girl is happy. · The girl is big. · The sun is big. · He goes to school. ✓
- 🔊 `هِيَ تَذْهَبُ إِلَى الْمَدْرَسَةِ` — *Listen. What does this sentence mean?*  
  They go to school. · She goes to school. ✓ · The girl is happy. · The sun is big.
- 🔊 `هُمْ يَذْهَبُونَ إِلَى الْمَدْرَسَةِ` — *Listen. What does this sentence mean?*  
  The girl is big. · They go to school. ✓ · The book is beautiful. · He goes to school.

### Comprehension  —  A0:0  A1:5  A2:3

**A1 band**

- `البيت كبير` — *What does this say?*  
  The girl is big. · The house is big. ✓ · He goes to school. · She goes to school.
- `الكتاب جميل` — *What does this say?*  
  He goes to school. · The girl is happy. · The book is beautiful. ✓ · She goes to school.
- `البنت سعيدة` — *What does this say?*  
  She goes to school. · The sun is big. · He goes to school. · The girl is happy. ✓
- `الْبِنْتُ كَبِيرَةٌ` — *What does this say?*  
  The girl is happy. · He goes to school. · The sun is big. · The girl is big. ✓
- `الشَّمْسُ كَبِيرَةٌ` — *What does this say?*  
  She goes to school. · The girl is big. · He goes to school. · The sun is big. ✓

**A2 band**

- `هُوَ يَذْهَبُ إِلَى الْمَدْرَسَةِ` — *What does this say?*  
  He goes to school. ✓ · The girl is happy. · The girl is big. · They go to school.
- `هِيَ تَذْهَبُ إِلَى الْمَدْرَسَةِ` — *What does this say?*  
  He goes to school. · The book is beautiful. · The girl is big. · She goes to school. ✓
- `هُمْ يَذْهَبُونَ إِلَى الْمَدْرَسَةِ` — *What does this say?*  
  The book is beautiful. · She goes to school. · He goes to school. · They go to school. ✓

## 5. Self-rating strands

For **writing**, **pronunciation**, **speaking** the learner reads the M15 can-do descriptors for A0–B1 and picks the one that fits. Result stored `confidence: "self-rated"`, labelled *self-assessed* wherever it shows. Writing additionally gets 2 spelling-recognition MCQs (built from real lexemes — spot the correct spelling) as a light anchor; the level still comes from the self-rating.

Descriptors shown (from `content/descriptors.json`):

**Writing**
- *A0* — Forms all 28 letters in isolation with correct stroke order and direction (right-to-left, top-to-bottom); copies fully-vowelled syllables legibly.
- *A1* — Writes letters correctly in initial / medial / final position with correct joining; spells familiar fully-vowelled words from dictation; writes short simple sentences (subject + predicate).
- *A2* — Writes a short connected paragraph on a familiar topic (self, family, daily routine) using learned vocabulary and basic connectors (وَ، ثُمَّ، لكِنْ); spelling of high-frequency words is generally accurate.
- *B1* — Writes straightforward connected texts — a description, a narrative, an informal message — on familiar topics; links ideas with common conjunctions and relative clauses; attempts case endings where required.

**Pronunciation**
- *A0* — Produces the short and long vowels and the non-emphatic consonants intelligibly; recognises by ear the emphatic vs. plain contrasts and the pharyngeals ع and ح.
- *A1* — Produces most consonants clearly including ع، ح، ق، غ; applies sun/moon assimilation of ال; word stress is usually appropriate; a foreign accent is evident but does not impede understanding.
- *A2* — Pronunciation is clearly intelligible across familiar material; handles shaddah (gemination) and consonant clusters at syllable boundaries; tāʾ marbūṭa is realised correctly in pause vs. construct.
- *B1* — Consistently intelligible; case-ending pronunciation is attempted in careful speech; intonation carries basic sentence function (statement, question).

**Speaking**
- *A0* — Produces the individual letter sounds and short syllables intelligibly by imitation.
- *A1* — Uses simple memorised phrases and sentences to give personal information, greet, and ask or answer very simple questions; long pauses to search for expression are normal.
- *A2* — Handles short social exchanges and simple routine transactions (ordering, buying, asking directions); describes in simple terms family, background, and immediate surroundings.
- *B1* — Sustains a conversation on familiar topics; narrates an event or experience, gives reasons and brief explanations, and copes with less routine situations with some hesitation.

## 6. Decisions to confirm

1. **Pronunciation → self-rating** instead of opt-in measured (see §1). Recommend yes — honest about TTS limits.
2. **Grammar check is thin** (2 A1 + 3 A2 items, all the same "what does this show?" shape) — accept for v1, richer authored items in M20. Recommend accept.
3. **Batch size 2, max 12, ceiling label "A2+"** — recommend as-is; all tunable constants.
4. **Reading A1 tests transliteration** (decoding) rather than meaning, to stay distinct from the vocabulary check. Recommend keep.
5. **Comprehension shows the unvowelled form** where available (3 of 8 texts), else vowelled — comprehension is about meaning, not vowels. Recommend keep.

---

## Sign-off

Approve, and implementation resumes at rollout step 4: `#view-placement` (intro / adaptive item run / results + per-strand override), the three entry buttons (Learn banner · Progress panel · one-time Home prompt), and the `loadProgress` / `refreshSkillLevels` / "Start learning →" wiring.
