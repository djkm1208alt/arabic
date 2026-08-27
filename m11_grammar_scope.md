# M11 Scope: Grammar & Reading Lessons

**Status:** Draft for review. No code written. Do not begin implementation until this is approved.

## My approach, in short

- Verified every anchor word before drafting anything (grepped the live `vocabulary` array): كَبِير, ذَهَبَ, مَدْرَسَة, بِنْت, بَيْت all already exist — nothing below is invented.
- Deliberately reused an M8 sentence (الْبَيْتُ كَبِيرٌ) as half a minimal pair for the gender-agreement concept, rather than writing something new from scratch — this is literally "apply M6-M9 knowledge," not just a slogan.
- One new vocabulary category needed: `pronouns` (هُوَ/هِيَ/هُمْ don't fit any existing category). This is an addition to `VOCAB_CATEGORIES`, not a change to how the category system works — same "extend, don't refactor" rule already applied in M6-M10.
- Landed on **13 steps**, not the ceiling of 15 — explained below, with the alternative that would reach 15 laid out so you can pick either.
- Present-tense verb forms (يَذْهَبُ etc.) are *inflections* of the already-existing ذَهَبَ headword, not new dictionary words — following the exact M8 precedent (`sentenceWord()`), these are supplied inline in the lesson's own sentence data, not as new standalone Word Bank entries. Only genuinely new headwords become new vocabulary entries.

## Scope (What Is In)

1. Three grammar concepts (below), each built from real, already-existing or newly-added vocabulary.
2. A 13-step lesson (`grammar-intro`), reached from the Practice view like every M6-M10 foundations lesson — recommending this over touching the main Learn curriculum, for the same reason M6-M10 never touched it: zero risk to already-shipped navigation.
3. 6 new vocabulary entries (within your 5-10 budget): `كَبِيرَة` (feminine "big"), `هُوَ`/`هِيَ`/`هُمْ` (he/she/they — new `pronouns` category), `شَمْس`/`قَمَر` (sun/moon — for the sun-and-moon-letters contrast).
4. Roadmap line marking "Grammar & Reading Lessons" done, same pattern as every prior milestone.

## Out of Scope (will not be implemented, mentioned in a code comment, or left as a TODO)

- ❌ Past tense beyond what M8/M9 already show, subjunctive, jussive, or any verb mood beyond simple present indicative.
- ❌ Full pronoun paradigm (أنا/أنت/نحن etc.) — only هو/هي/هم, per your scope.
- ❌ Broken plurals, dual number, case theory beyond what's needed to read the fixed example sentences correctly.
- ❌ Accounts, subscriptions, native audio, stroke-order — separate milestones (M12-M15).

---

## The 3 Grammar Concepts

### 1. Noun-Adjective Gender Agreement
**Rule taught:** a feminine noun needs a feminine adjective (add ة). Taught via a minimal pair against a sentence the learner has already read in M8.

- Reference (already known, M8): **الْبَيْتُ كَبِيرٌ** — *al-baytu kabīrun* — "The house is big." (بَيْت is masculine)
- New: **الْبِنْتُ كَبِيرَةٌ** — *al-bintu kabīratun* — "The girl is big." (بِنْت is feminine → كَبِيرَةٌ)

### 2. Simple Present-Tense Verbs (he / she / they)
**Rule taught:** the prefix on a present-tense verb changes with the subject — ي for he, ت for she, يـ...ون for they. Built on the real, already-existing verb ذَهَبَ (dhahaba, "to go") and its already-existing example context (school).

- **هُوَ يَذْهَبُ إِلَى الْمَدْرَسَةِ** — *huwa yadhhabu ilā al-madrasati* — "He goes to school."
- **هِيَ تَذْهَبُ إِلَى الْمَدْرَسَةِ** — *hiya tadhhabu ilā al-madrasati* — "She goes to school."
- **هُمْ يَذْهَبُونَ إِلَى الْمَدْرَسَةِ** — *hum yadhhabūna ilā al-madrasati* — "They go to school."

### 3. Sun & Moon Letters (definite article assimilation)
**Rule taught:** ال is pronounced normally before "moon letters" but assimilates (silent ل, doubled consonant) before "sun letters" — the classic pair used to teach this in virtually every Arabic textbook, which is exactly why they're named after it.

- **الشَّمْسُ كَبِيرَةٌ** — *ash-shamsu kabīratun* — "The sun is big." (ش is a sun letter — ل is silent, ش is doubled; this sentence also reuses كَبِيرَةٌ from concept 1, and is grammatically required to be feminine since شمس is a feminine noun in Arabic — not an arbitrary choice)
- Contrast shown (not a full graded sentence, just the visual/explanation pair): الْقَمَر (al-qamar, "the moon" — ق is a moon letter, ل is pronounced normally)

**5 new graded example sentences total** (بِنْت كَبِيرَة / 3 present-tense sentences / شمس كبيرة), plus the reused M8 reference and the shams/qamar contrast pair for the explanation itself.

---

## Proposed Data Shape (illustrative — not final, no code to be written yet)

Following the `readingPassages` shape from M8, reusing `sentenceWord()`/`vocabWord()`:

```
const grammarExamples = [
  {
    id: "gram-gender-bint",
    concept: "gender-agreement",
    sentence: "الْبِنْتُ كَبِيرَةٌ",
    words: [ sentenceWord("peo-13", "الْبِنْتُ", "al-bintu", "feminine"),
              sentenceWord("adj-01f", "كَبِيرَةٌ", "kabīratun", "feminine") ],
    meaning: "The girl is big.",
    audioText: "الْبِنْتُ كَبِيرَةٌ"
  },
  // ... present-tense and sun/moon entries follow the same shape
];
```

## Proposed 13-Step Lesson Flow

| # | Step type (existing, reused) | Content |
|---|---|---|
| 1 | `explain` | Lesson intro — "a few patterns that help you read even more Arabic" |
| 2 | `explain` | Concept 1: gender agreement — shows the الْبَيْتُ كَبِيرٌ / الْبِنْتُ كَبِيرَةٌ pair, explains the ة rule |
| 3 | `reading-practice` | Concept 1 practice — audio + reveal on the new sentence |
| 4 | `practice-choice` | Concept 1 quick check |
| 5 | `explain` | Concept 2: present tense — shows هو/هي/هم + the 3 verb forms, explains the prefix pattern |
| 6 | `reading-practice` | Concept 2 practice — all 3 sentences, audio + reveal |
| 7 | `practice-choice` | Concept 2 quick check |
| 8 | `explain` | Concept 3: sun & moon letters — shows الشمس vs القمر, explains assimilation |
| 9 | `reading-practice` | Concept 3 practice — الشمس كبيرة, audio + reveal |
| 10 | `practice-choice` | Concept 3 quick check |
| 11 | `quiz` | Comprehensive quiz — one question per concept + one mixed |
| 12 | `reading-practice` | Reading Application — all 5 new sentences shown together as a final capstone read |
| 13 | `complete` | Standard completion step |

**Why 13, not 15:** each concept gets a full Concept+Example+Explanation step (combined — the same pattern M8/M9 already used, where an `explain` step's body text and its `previewSymbols` row work together), then Practice, then a quick check, then one shared Quiz and one shared Reading Application at the end. This is the same principle already established at M8 ("if it lands at 11 or 13, that's fine" — not forcing a specific number).

**Alternative, if you'd rather hit 15:** split step 2/5/8 each into two steps (a pure concept-intro `explain`, then a separate visual-example `explain`) — adds exactly 3 steps → 16, so it'd actually need trimming elsewhere to land at 15 rather than a clean addition. I'd recommend staying at 13 unless you specifically want more separation between "concept" and "example" — happy to do either, flagging it now rather than deciding silently.

## Open Questions / Risks Flagged

- New `pronouns` vocabulary category (هو/هي/هم) — confirmed nothing like this exists yet; recommend adding it as a new `VOCAB_CATEGORIES` entry (extension, not refactor) rather than mis-filing them into `expressions` or `people`.
- إِلَى ("to/toward") is a function word (preposition) supplied directly in the sentence data, not added as a standalone vocabulary entry — same treatment the definite article ال already gets in M8/M9. Flagging this as a deliberate choice, not an oversight.
- الْقَمَر (moon) appears only in the explanation/contrast step, not in a graded example sentence — it's there so the sun/moon *rule* makes sense (you need both to see the contrast), not because every new word needs its own quiz question.
