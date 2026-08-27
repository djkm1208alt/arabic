# M8 Scope: Sentence-Level Reading

**Status:** Draft for review. No code written. Do not begin implementation until this is approved.

## Context

M6 (Harakāt — all 8 reading marks, full alphabet) and M7 (Syllables — CVV, CVC, geminated) are merged and live on `main` (tag `v0.7.0-syllables`). M8 is the next step in the reading progression: applying everything already taught to short, fully-vowelled, connected sentences. This is explicitly **not** M9 (reduced-vowel/unvowelled reading) — every word in every M8 sentence stays fully diacritized.

## Strict Scope (Must Include)

1. Decoding fully vowelled 2–3 word sentences (e.g. الْبَيْتُ كَبِيرٌ).
2. Explicitly applying rules the learner already knows — long vowels (M6 madd intro + M7 CVV), sukūn/shaddah (M7 CVC + gemination) — as they appear *within connected words*, not as new rules.
3. A `readingPassages`-style data structure: sentence, per-word transliteration, English meaning, and a TTS audio hook (`audioText`, using the existing `playArabicAudio`/`speakText` pipeline — no native recordings, matching the M6/M7 precedent that `audioUrl` stays ready for future real recordings without any rendering change).
4. A 10-step lesson flow: **Decode word-by-word → Listen to full sentence → Read aloud → Quiz**, applied across however many example sentences the final content set covers, plus the standard leading `explain`/trailing `complete` steps (the same structural requirement that pushed M6/M7 slightly past their own nominal step counts — `complete` is what wires up the Finish button, it can't be dropped).

## Hard Out-of-Scope (Must Avoid)

- ❌ Reduced-vowel / unvowelled reading — that's M9.
- ❌ Directional stroke-order guidance.
- ❌ Arabic-Indic numerals.
- ❌ Professionally recorded native-speaker audio.
- ❌ Spaced repetition / review scheduling.
- ❌ Student accounts, subscriptions, backend/database.

## Proposed Data Shape (illustrative — not final field names, no code to be written yet)

```
{
  id: "...",
  sentence: "الْبَيْتُ كَبِيرٌ",
  words: [
    { arabic: "الْبَيْتُ", transliteration: "al-baytu", gloss: "the house" },
    { arabic: "كَبِيرٌ",  transliteration: "kabīrun",  gloss: "big" }
  ],
  transliteration: "al-baytu kabīrun",
  meaning: "The house is big.",
  audioText: "الْبَيْتُ كَبِيرٌ"
}
```

Following the M6/M7 pattern: this should be built from words that already exist in the `vocabulary` Word Bank wherever possible, verified against the real data before any sentence is finalized — not invented sentence-first.

## Proposed 10-Step Lesson Flow (per the locked flow, applied once per example sentence set + wrapper steps)

1. `explain` — concept intro: "you already know every sound in these sentences — here's how they connect."
2. `explain` — visual example (show 1–2 full sentences large, unexplained yet, matching the M6/M7 "visual before interaction" pattern).
3–4. **Decode word-by-word** — per-word reveal/audio for each word in a sentence (reuses `reading-practice` or `example-set`, same as M6/M7).
5. **Listen to full sentence** — single `audioText` playback of the whole sentence via the existing audio pipeline.
6. **Read aloud** — ungraded, matching the existing `reading-practice`/pronunciation-style pattern (learner reads aloud themselves, not verified by the app, consistent with how every other "read aloud" moment in this app already works).
7–8. Repeat decode/listen for a second sentence.
9. **Quiz** — multiple choice on sentence meaning/word identification (reuses `quiz`/`renderMCQ`, no new component).
10. `complete`.

*(Exact step count may land at 10–13 once real content is finalized, same as M6/M7 landing slightly above their own nominal ranges once the mandatory `complete` step and per-sentence repetition are accounted for — will confirm exact count before implementation, not force it to exactly 10.)*

## 3 Example Sentences (grounded in vocabulary confirmed to already exist)

Checked directly against the current `vocabulary` array before writing these — all content words below already exist as real entries; nothing here is invented:

1. **الْبَيْتُ كَبِيرٌ** — *al-baytu kabīrun* — "The house is big." (بَيْت, كَبِير both existing entries)
2. **الْكِتَابُ جَمِيلٌ** — *al-kitābu jamīlun* — "The book is beautiful." (كِتَاب, جَمِيل both existing entries)
3. **الْبِنْتُ سَعِيدَةٌ** — *al-bintu saʿīdatun* — "The girl is happy." (بِنْت existing; سَعِيد exists but only in its masculine form — the feminine سَعِيدَة here is a regular, always-valid Arabic adjective-agreement derivation of that same real word, not a new invented word, but it's not literally a standalone vocabulary entry yet. Flagging this now as the first concrete example of an M8 requirement the current data model doesn't have yet: **adjective gender agreement**. Worth a decision before implementation — either add feminine forms to relevant vocabulary entries, or handle agreement at the sentence-data level.)

## Open Questions for Implementation Time (not blockers to approving this scope, just flagged now)

- Adjective/noun gender agreement (see sentence 3 above) — needs a decision on where it lives in the data model.
- Exact final sentence count and step count (targeting the spirit of "10-step flow," not a hard-locked 10).
- Whether `readingPassages` sentences should also feed the existing `reading-foundations` lesson's phrase step, or stay fully separate (M6/M7 precedent was to always add new, separate lesson content and never retroactively alter already-shipped lesson steps).
