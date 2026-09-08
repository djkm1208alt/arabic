# M21 — Batches 4 & 5: Prices, then Dates (a2-u4, third & fourth lessons)

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m21b3_a2_telling_time_scope.md](m21b3_a2_telling_time_scope.md) §6 — the two remaining items in `a2-u4`'s original blurb ("11–99, gender polarity, dates, prices, and the clock").
**Base:** `main` @ `65bd97b` (batch 3 merged).
**Branch:** `claude/pensive-darwin-7mao26`, restarted from `main` now that batch 3's PR is merged.

---

## 1. Why one doc, two batches

You asked for both scoped together, and they share a parent (finishing `a2-u4`) — so this doc plans both now rather than making you wait through two separate scoping round-trips. But checked against the real lexicon first, they turned out to be very different sizes, so they still ship as **two separate PRs**, smaller first: batch 4 (prices) needs no new grammar at all, just currency nouns applied to rules already taught; batch 5 (dates) needs a real new vocabulary set (masculine ordinals, month names) and its own scope-narrowing decision. Bundling them into one PR would blur a nearly-trivial addition together with a genuinely new one.

## 2. What's already there — checked, not assumed

- **Prices**: `سِعْر` (price), `رَخِيص` (cheap), `غَالٍ` (expensive), `بِكَمْ؟` (how much?), `بِكَمْ هَذَا؟` (How much is this?), `قَلِيل`/`كَثِير` (a little / a lot) all already exist at A1 (`shopping`/`expressions` topics). No currency name exists anywhere.
- **Dates**: `يَوْم` (day), `أُسْبُوع` (week), `شَهْر` (month), `سَنَة` (year), and all seven weekday names already exist at A1 (`time` topic). `مِنْ` (from/of) already exists. No ordinal number, masculine or feminine, existed before batch 3; batch 3 added the **feminine** ordinals (2nd–12th, for telling time). No month name exists anywhere.

## 3. Batch 4 — Prices (ships first)

### 3.1 What's new
4 currency nouns — `دُولَار` (dollar), `رِيَال` (riyal), `دِينَار` (dinar), `جُنَيْه` (pound) — covering the major currencies a pan-Arab MSA course reasonably introduces together, rather than picking one country's. Topic `shopping`, matching where `price`/`cheap`/`expensive` already live.

### 3.2 No new grammar point
Prices are just [number] + [currency noun], and both counting rules needed already exist: `عَشَرَةُ دَنَانِير` (ten dinars, plural genitive — `gr:counted-noun-intro`) and `عِشْرُونَ دُولَارًا` (twenty dollars, singular accusative — `gr:numbers-11-99`). This batch applies both to a new semantic domain rather than teaching anything new — the first batch this session where that's true. New example texts (4–5, reusing `بِكَمْ هَذَا؟` + a priced answer) get wired straight into the lesson's own objectives without a new `gr:` entry to house them — precedented by how A1's own vocabulary batches (M20 batches 2–3) worked, before this session's A2 batches all happened to need new grammar too.

### 3.3 One new lesson
`content/lessons/a2-prices.json`, `a2-u4`'s third lesson (`order: 3`). `prereqs` on the new lexemes point at both existing counting grammar points. Unit blurb narrows again once this lands.

## 4. Batch 5 — Dates

### 4.1 What's new, and the scope-narrowing this needs
Day-of-month uses **masculine** ordinals (`يَوْم` is masculine, unlike `السَّاعَة`) — the same roots batch 3 already taught in feminine form: `أَوَّل` (1st, irregular — no feminine counterpart the way 2nd–12th had, since "first" itself is suppletive in both genders), `ثَانِي` (2nd), `ثَالِث` (3rd), `رَابِع` (4th), `خَامِس` (5th), `سَادِس` (6th), `سَابِع` (7th), `ثَامِن` (8th), `تَاسِع` (9th), `عَاشِر` (10th). Day-of-month genuinely runs 1–31, but 11th–31st reuse the exact same teen/tens-compounding pattern batch 3 already taught (just masculine) — authoring all 31 would be padding, not teaching. **Proposing 1st–10th only**, the same "teach the shape, not the exhaustive list" call `a1-numbers` made for 0–10 and batch 3 made stopping at 12.

12 month names (`يَنَايِر`…`دِيسِمْبِر`) — the Western-transliterated set, used pan-Arab-wide (Gulf, Egypt, Maghreb, and increasingly Levant/Iraq media), rather than the traditional Levantine/Iraqi Syriac-derived set (`كَانُون الثَّانِي`, `شُبَاط`…) — flagged as a judgment call below.

Plus `التَّارِيخ` (date) and the expression `مَا التَّارِيخُ الْيَوْمَ؟` (What's the date today?), mirroring `كَمِ السَّاعَة؟`'s existing shape.

### 4.2 One new grammar point: `gr:dates`
The date construction: [definite ordinal] + `مِنْ` + [month] — `الثَّالِثُ مِنْ سِبْتَمْبِر` (the third of September) — a complete phrase on its own, the same elliptical pattern `gr:telling-time` already established. Full calendar years (needing "thousand", not yet in the lexicon) are out of scope — see §5.

### 4.3 One new lesson
`content/lessons/a2-dates.json`, `a2-u4`'s fourth lesson (`order: 4`). Once this lands, `a2-u4`'s blurb can finally drop its "come later" clause entirely — the unit is fully delivered.

### 4.4 A citation-form judgment call
"2nd" masculine (`ثَانِي`) is a defective noun (نَاقِص) — its true indefinite nominative/genitive drops the ي with tanwīn (`ثَانٍ`), while the definite and accusative forms keep it (`الثَّانِي`, `ثَانِيًا`). Proposing to cite it as `ثَانِي` (the form dictionaries conventionally use, e.g. Hans Wehr's own citation style for this class of noun) with a `notes` flag explaining the alternation, rather than citing the grammatically-purer but pedagogically-obscure bare `ثَانٍ`.

## 5. Sourcing

Al-Kitaab Part One covers both prices (shopping chapters) and dates/months (calendar chapters). Ryding's *Reference Grammar* for ordinal-number formation (already the citation for batch 3) and for defective-noun declension (`ثَانٍ`/`قَاضٍ`-class nouns). Buckwalter–Parkinson doesn't apply to either — currency names and month names are closed, grammar-forced vocabulary sets, not frequency-ranked choices.

## 6. Open questions

1. **Ship as two PRs, prices first** — recommend **yes**, per §1.
2. **Prices needs no new `gr:` entry** — recommend **yes**; manufacturing one where no new rule exists would be dishonest bookkeeping.
3. **Dates capped at ordinals 1st–10th**, deferring 11th–31st (same compounding pattern, just masculine) and full calendar years (needs "thousand") — recommend **yes**, matching the narrow-scope discipline every prior batch used.
4. **Month names: Western-transliterated set**, not the traditional Levantine/Iraqi set — recommend **yes**, with a `notes` flag on the lesson naming the regional variant exists, so it's not silently erased.
5. **`ثَانِي` citation form** for masculine "2nd" (§4.4) — recommend **yes**, matching standard dictionary practice.

## 7. Not in these batches

- ❌ Full calendar years (needs "thousand", `أَلْف` — its own small addition whenever a batch actually needs it).
- ❌ Day-of-month 11th–31st as individually-authored lexemes — the compounding pattern is taught, not exhaustively listed.
- ❌ The traditional Levantine/Iraqi month-name set — flagged as existing, not authored.
- ❌ `narrative`/`everyday-exchanges` vocabulary from `wordlists/a2.json`, `a2-u3`/`a2-u5`/`a2-u6` — unchanged, later in the parent milestone's order.
- ❌ Any engine/UI change — pure content, same proven pipeline.
