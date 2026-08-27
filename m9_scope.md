# M9 Scope: Reduced-Vowel / Unvowelled Reading

**Status:** Draft for review. No code written. Do not begin implementation until this is approved.

## My approach, in short

- Reuse the 3 sentences already taught in M8 rather than introducing new vocabulary — M9 is a *representation* skill (reading the same known sentences with fewer visual cues), not a new-content milestone.
- Generate the reduced/unvowelled forms **programmatically** from the existing `readingPassages.sentence` strings via a small regex (in the spirit of the existing `stripArabicDiacritics()` function already in the codebase), not by hand-typing new strings — this is the same "never hand-author what can be derived from real data" discipline as M6/M7/M8.
- Map the milestone onto the newly-locked 7-stage progression (Concept → Visual Example → Explanation → Pronunciation → Practice → Quiz → Reading Application), using multi-sentence grid steps (the established M6/M7 reference-grid pattern) rather than repeating all 7 stages per sentence — that would overshoot 15 steps for no pedagogical gain, since all 3 sentences share the same rule.
- I verified my hand-computed example strings below programmatically before writing them down and caught a small error in my own manual tracing — flagging that transparently rather than presenting hand-typed Arabic as already-correct.
- One open decision below (exactly which marks "reduced" drops vs. keeps) has two reasonable options — I'm recommending one, not leaving it open-ended.

## Scope (What Is In)

1. Taking the 3 existing M8 sentences and generating two new representations of each, programmatically, from the existing `sentence` string:
   - **Reduced** — short vowels (fatḥah/kasrah/ḍammah) and tanwīn removed; sukūn and shaddah retained; long vowels remain (they're letters, not marks, so removal was never in question).
   - **Unvowelled** — the bare consonant skeleton, zero diacritics, exactly how the sentence would appear in ordinary printed Arabic (a newspaper, a novel, a text message).
2. A lesson that walks the learner through *why* this doesn't mean they're lost — they already know these exact sentences cold from M8; the pronunciation and meaning haven't changed, only how much is written down.
3. Recognition and comprehension practice at both the reduced and unvowelled levels, plus a final "read the fully unvowelled sentence and confirm you understood it" application step.
4. Extending `readingPassages` (existing M8 data) with the derived forms — not a new top-level data array, since this content is structurally the same 3 sentences, just re-rendered.

## Out of Scope (What Is NOT In — will not be implemented, mentioned in code comments, or left as a TODO)

- ❌ New sentences or new vocabulary — reuses the exact 3 from M8, nothing added to the Word Bank this milestone.
- ❌ Grammar explanation of *why* Arabic vowelling works the way it does (e.g., case theory, i'rāb) — this is reading pattern-recognition, not grammar theory, same rule M8 followed.
- ❌ Directional stroke-order guidance.
- ❌ Arabic-Indic numerals.
- ❌ Professionally recorded native-speaker audio — TTS via the existing `speakText()`/`playArabicAudio()` pipeline only, unchanged.
- ❌ Spaced repetition / review scheduling.
- ❌ Student accounts, subscriptions, backend/database.
- ❌ Longer passages, paragraphs, or sentences beyond the existing 2-3 word length.

**Flagged future dependency (not implemented now):** a genuine "read a full unvowelled paragraph you've never seen before" milestone would need a much larger sentence corpus than 3 examples — noting this as a future scope item, not building toward it prematurely.

## Open Decision — flagging before implementation, with a recommendation

**What exactly does "reduced" drop?** Two reasonable options:
- **A (recommended):** drop short vowels + tanwīn, keep sukūn + shaddah. Reasoning: sukūn and shaddah were the hard-won content of M7; keeping them one step longer gives a gentler bridge, and it matches how real graded readers/partially-vowelled Quran text are actually marked in practice.
- **B:** drop everything except long vowels in one step (skip straight from full to unvowelled, no middle stage). Simpler to build, but removes the scaffolding step entirely — I don't recommend this, since "the learner should never feel lost" is a stated non-negotiable principle, and a single full→bare jump is a bigger leap than a graded one.

I'm proceeding with **A** in the structure below unless you'd prefer B.

## 3 Concrete Examples (verified programmatically, not hand-typed with unverified confidence)

Generated directly from the real `readingPassages` sentences using `sentence.replace(/[ًٌٍَُِ]/g, "")` for reduced and `sentence.replace(/[ً-ْ]/g, "")` for unvowelled — I ran this against the actual strings before writing them here and caught one small error in my own manual first pass, corrected below:

| # | Full (M8, known) | Reduced (new) | Unvowelled (new) | Meaning |
|---|---|---|---|---|
| 1 | الْبَيْتُ كَبِيرٌ *(al-baytu kabīrun)* | الْبيْت كبير | البيت كبير | "The house is big." |
| 2 | الْكِتَابُ جَمِيلٌ *(al-kitābu jamīlun)* | الْكتاب جميل | الكتاب جميل | "The book is beautiful." |
| 3 | الْبِنْتُ سَعِيدَةٌ *(al-bintu saʿīdatun)* | الْبنْت سعيدة | البنت سعيدة | "The girl is happy." |

## Lesson Structure (targeting 10–15 steps — landed at 11, not forced)

Mapped onto the locked 7-stage progression. Steps 5–8 use the established multi-item grid pattern (all 3 sentences per step) rather than repeating the full progression three times, since all three share one rule:

1. **Concept** (`explain`) — you already know these exact sentences; real Arabic text usually isn't fully marked, and that's normal, not a harder version of what you know.
2. **Visual Example** (`explain`) — show sentence 1 in all three forms side by side (full → reduced → unvowelled), unexplained, so the learner notices the pattern before being told the rule.
3. **Explanation** (`explain`) — the actual rule: short vowels and tanwīn are usually dropped; sukūn/shaddah often stick around a little longer; long vowels never disappear because they're letters, not marks.
4. **Pronunciation (TTS)** (`example-set` or `reading-practice`) — all 3 sentences, same audio as M8, reused as-is — reinforces "sounds identical, only the writing changed."
5. **Practice — reduced form** (`reading-practice`) — all 3 sentences in reduced form, reveal-to-check.
6. **Practice — quick check** (`practice-choice`) — one recognition question on a reduced-form sentence.
7. **Practice — unvowelled form** (`reading-practice`) — all 3 sentences in unvowelled form, reveal-to-check.
8. **Practice — quick check** (`practice-choice`) — one recognition question on an unvowelled-form sentence.
9. **Quiz** (`quiz`) — 3 questions, one per sentence, comprehension on the unvowelled form (reusing the exact shuffled-options pattern from M8's quiz).
10. **Reading Application** (`reading-practice`) — final pass: all 3 sentences shown unvowelled only, audio + meaning-reveal, no more scaffolding.
11. `complete`.

*(Same caveat as M6/M7/M8: exact final count may shift by a step or two once real content is finalized — targeting 11, not force-fitting a different number.)*

## Data Change (illustrative shape, no code yet)

Extends the existing `readingPassages` entries (M8) with two new derived fields — not a new array, not a schema refactor:

```
{
  id: "sent-house-big",
  sentence: "الْبَيْتُ كَبِيرٌ",        // unchanged, M8
  words: [...],                       // unchanged, M8
  transliteration: "al-baytu kabīrun", // unchanged, M8
  meaning: "The house is big.",        // unchanged, M8
  audioText: "الْبَيْتُ كَبِيرٌ",       // unchanged, M8
  reduced: "الْبيْت كبير",             // NEW — generated, not hand-typed
  unvowelled: "البيت كبير"             // NEW — generated, not hand-typed
}
```

Generation happens via a small pure function (`reduceVowelling(sentence)` / `stripAllVowelling(sentence)`) applied once at data-definition time — same pattern as M6/M7's `findVocabExamples`/`findSyllableExample` helpers computing derived fields from real source data rather than the fields being hand-entered.
