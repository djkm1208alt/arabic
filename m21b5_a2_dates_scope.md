# M21 — Batch 5: Dates (a2-u4, fourth and final lesson)

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m21b4_a2_dates_prices_scope.md](m21b4_a2_dates_prices_scope.md) §4 — already researched and approved at a summary level alongside batch 4; this doc gives it the same full, standalone treatment every other batch has had, now that batch 4 (prices) is merged.
**Base:** `main` @ `d0c90ad` (batch 4 merged).
**Branch:** `claude/pensive-darwin-7mao26`, restarted from `main` now that batch 4's PR is merged.

---

## 1. What this batch covers

The fourth and final lesson on `a2-u4` — once this lands, the unit's original blurb ("11–99, gender polarity, dates, prices, and the clock") is delivered in full, and `a2-u4` closes out exactly the way `a2-u1`/`a2-u2` did in batch 1.

## 2. Checked before planning

Re-confirmed against the current lexicon (post-batch-4): `يَوْم` (day), `أُسْبُوع` (week), `شَهْر` (month), `سَنَة` (year), all seven weekday names, and `مِنْ` (from/of) already exist at A1. No month name, no masculine ordinal, and no word for "date" exists anywhere. Batch 3 added the **feminine** ordinals 2nd–12th for telling time (`lex:tim-30`–`lex:tim-40`) — this batch adds their **masculine** counterparts, needed because `يَوْم` (day) is masculine, unlike `السَّاعَة`.

## 3. What ships

### 3.1 24 new lexemes

- **10 masculine ordinals, 1st–10th**: `أَوَّل` (1st — irregular/suppletive, its own word rather than a pattern-formed ordinal), `ثَانِي` (2nd), `ثَالِث` (3rd), `رَابِع` (4th), `خَامِس` (5th), `سَادِس` (6th), `سَابِع` (7th), `ثَامِن` (8th), `تَاسِع` (9th), `عَاشِر` (10th). 3rd–10th are the exact same roots as the feminine ordinals batch 3 already taught, just without the ة — a genuinely regular, predictable pattern (فَاعِل). `ثَانِي` is a defective noun (see §3.4).
- **12 month names**, the Western-transliterated set (`يَنَايِر` through `دِيسِمْبِر`) — used pan-Arab-wide, per the already-approved open question.
- `التَّارِيخ` (date, noun) and `مَا التَّارِيخُ الْيَوْمَ؟` (What's the date today?), mirroring the shape of the existing `كَمِ السَّاعَة؟`.

### 3.2 One new grammar point: `gr:dates`

The date construction: [definite ordinal] + `مِنْ` + [month] — `الثَّالِثُ مِنْ سِبْتَمْبِر` (the third of September) — a complete phrase on its own, the same elliptical pattern `gr:telling-time` already established for the clock. `أَوَّل` and `ثَانِي` get a one-line callout each: `أَوَّل` doesn't follow the فَاعِل pattern the others do, and `ثَانِي` is the same defective-noun class as `قَاضٍ` ("judge").

4 example texts: `الْأَوَّلُ مِنْ يَنَايِر` (the first of January), `الثَّالِثُ مِنْ سِبْتَمْبِر` (the third of September), `الْعَاشِرُ مِنْ دِيسِمْبِر` (the tenth of December), and one full sentence — `الْيَوْمَ هُوَ الْخَامِسُ مِنْ مَارِس` (today is the fifth of March) — showing the construction embedded in an actual sentence rather than only as a bare phrase. `prereqs: ["gr:numbers-11-99"]` (the ordinal-compounding logic, even though this batch only goes to 10th and doesn't need a teen-compound itself, is the same family of pattern).

**Sourcing**: Al-Kitaab Part One's calendar chapter for the construction and month-name convention; Ryding's *Reference Grammar* for ordinal-number formation (already this session's citation for both batches 3 and 4) and for `ثَانِي`/`ثَانٍ`-class defective-noun declension.

### 3.3 One new lesson

`content/lessons/a2-dates.json`, `a2-u4`'s fourth lesson (`order: 4`). Same shape as every prior lesson in this unit. Once this lands, `a2-u4`'s blurb drops its "come later" clause entirely — the unit is fully delivered, matching `a2-u1`/`a2-u2`'s own closure in batch 1.

### 3.4 Two honesty notes carried over from the combined doc

- **`ثَانِي` citation form**: a defective noun (نَاقِص) — true indefinite nominative/genitive drops the ي with tanwīn (`ثَانٍ`), definite and accusative keep it (`الثَّانِي`, `ثَانِيًا`). Citing it as `ثَانِي`, the form dictionaries conventionally use for this noun class, with a `notes` flag explaining the alternation — already approved in the combined doc's open question 5.
- **Month-name vowelling**: unlike the rest of this project's content, the 12 month names are transliterated loanwords, not native triliteral-root words — their vowelling doesn't follow the same predictable derivational logic the rest of the lexicon does. Flagging honestly that each one's exact vowelling gets checked against a dictionary/reference source at implementation time, the same diligence this project has applied to every harder point so far, rather than presented as confidently as the (genuinely regular) masculine ordinals.

### 3.5 Proof

Same battery as every prior batch: `build-content.js --check`/`--lint` (0 new warnings), `build-audio-manifest.js --check`, `tools/qa-harness.js`, `tools/a11y-audit.js` clean, live-browser confirmation `a2-u4` shows 4/4 lessons all available and its blurb no longer says "come later."

## 4. Open questions

Both already answered in the approved combined doc, restated here for this batch's own record:

1. **Ordinals capped at 1st–10th**, not the full 1st–31st needed for every possible day-of-month — 11th–31st reuse the exact same teen/tens-compounding pattern batch 3 already taught (in masculine form), so authoring all 31 would be padding, not teaching. Recommend **yes, as already approved**.
2. **Western-transliterated month names**, not the traditional Levantine/Iraqi Syriac-derived set — flagged with a `notes` mention that the regional variant exists, so it isn't silently erased. Recommend **yes, as already approved**.

One new question specific to writing this doc out in full:

3. **The one full-sentence example** (`الْيَوْمَ هُوَ الْخَامِسُ مِنْ مَارِس`, "today is the fifth of March") introduces `هُوَ` as a linking pronoun between `الْيَوْمَ` (today) and the date-phrase — a small extra wrinkle beyond the bare elliptical phrase pattern, included so the lesson shows the construction working inside a real sentence, not just as a fragment. Recommend **keep it** — one sentence, clearly worth the small addition.

## 5. Not in this batch

- ❌ Day-of-month 11th–31st as individually-authored lexemes.
- ❌ Full calendar years (needs "thousand", `أَلْف` — its own small addition whenever a batch actually needs it).
- ❌ The traditional Levantine/Iraqi month-name set — flagged as existing, not authored.
- ❌ `narrative`/`everyday-exchanges` vocabulary from `wordlists/a2.json`, `a2-u3`/`a2-u5`/`a2-u6` — unchanged, later in the parent milestone's order. With this batch, `a2-u4` is the second fully-complete A2 unit (after `a2-u1`/`a2-u2`), and the milestone's next natural step is scoping one of those.
- ❌ Any engine/UI change — pure content, same proven pipeline.
