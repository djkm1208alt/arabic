# M21 — Batch 3: Telling Time (a2-u4, second lesson)

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m21b2_a2_numbers_scope.md](m21b2_a2_numbers_scope.md) §6 — the explicit follow-up that batch deferred ("Telling time, dates, and prices — the rest of a2-u4's original blurb... needs ordinal numbers, not yet checklisted anywhere").
**Base:** `main` @ `4f1efb3` (batch 2 merged).
**Branch:** `claude/pensive-darwin-7mao26`, restarted from `main` now that batch 2's PR is merged.

---

## 1. What this batch covers

`a2-u4` ("Numbers, Counting & Time") is already `available` from batch 2, with one lesson (cardinal numbers 11–99). This batch adds a **second** lesson to the same unit — telling time — without touching the unit's status flip again. Dates and prices, the other two items in the unit's original blurb, stay out of scope here (see §6): telling time is its own coherent, checkable piece of grammar, and mixing in dates/prices would blur three genuinely different vocabulary sets (ordinals vs. calendar words vs. currency) into one batch.

## 2. What's new here, checked against the real lexicon

Telling time in Arabic doesn't reuse the cardinal numbers batch 2 just shipped — it switches to **ordinal** numbers (second, third, fourth…) agreeing with السَّاعَة (the hour/clock — itself feminine), which is exactly why batch 2 flagged this as needing its own vocabulary pass. Checked before planning:

- `lex:tim-20` (سَاعَة, "hour") already carries the note *"Also 'clock' / 'watch'"* — already set up for this exact reuse.
- `lex:tim-21` (دَقِيقَة, "minute") and `lex:exp-09` (كَمِ السَّاعَة؟, "What time is it?") already exist — both reusable as-is.
- `half` and `quarter` are still sitting unauthored in `wordlists/a2.json`'s `numbers-extended` topic, exactly where batch 2 left them for this follow-up.
- No ordinal number exists anywhere in `content/lexemes.json` yet — genuinely new territory.

## 3. What ships

### 3.1 15 new lexemes

- `lex:num-01f` — وَاحِدَة (fem. "one") — one o'clock is the one hour that uses the cardinal, not an ordinal (see §3.2). Mirrors the existing `adj-01`/`adj-01f` masculine/feminine pairing convention.
- `lex:tim-30`–`lex:tim-40` — the ordinals second through twelfth (ثَانِيَة، ثَالِثَة، رَابِعَة، خَامِسَة، سَادِسَة، سَابِعَة، ثَامِنَة، تَاسِعَة، عَاشِرَة، حَادِيَةَ عَشْرَةَ، ثَانِيَةَ عَشْرَةَ), topic `time`, `pos: "adjective"` (ordinals agree like adjectives, unlike cardinal numbers' own distinct agreement system) — cited in feminine form only, since that's the sole form this batch teaches and uses; each carries a `notes` flag that a masculine counterpart exists for other contexts (dates, sequence — out of scope here).
- A new particle, `lex:prt-25` — إِلَّا (illā, "except / minus") — needed for "quarter **to** the hour," not yet in the particles list.
- `نِصْف` (half) and `رُبْع` (quarter) — authored now, closing out the two entries batch 2 deliberately left unauthored in `wordlists/a2.json`.

### 3.2 One new grammar point: `gr:telling-time`

The core idea: a definite noun (السَّاعَة) followed by a definite ordinal functions as a complete phrase — السَّاعَةُ الثَّانِيَةُ (it's two o'clock) — the same way English can just answer "two o'clock" with no verb. **One o'clock is the one exception**: السَّاعَةُ الْوَاحِدَةُ uses the cardinal (fem. "one"), not an ordinal — there's no "أُولَى o'clock." Two through ten use the plain ordinals; eleven and twelve compound an ordinal ones-word with the teen-marker exactly the way cardinal numbers do (الْحَادِيَةَ عَشْرَةَ، الثَّانِيَةَ عَشْرَةَ). Minutes attach with وَ for "past" (السَّاعَةُ الثَّانِيَةُ وَالنِّصْف, half past two) or إِلَّا for "to" (السَّاعَةُ الرَّابِعَةُ إِلَّا رُبْعًا, quarter to four).

6 example texts: `السَّاعَةُ الْوَاحِدَةُ` (1, the exception), `السَّاعَةُ الثَّانِيَةُ` (2, plain ordinal), `السَّاعَةُ الثَّانِيَةَ عَشْرَةَ` (12, teen-compound), `السَّاعَةُ الثَّانِيَةُ وَالنِّصْف` (half past two), `السَّاعَةُ الثَّالِثَةُ وَالرُّبْع` (quarter past three), `السَّاعَةُ الرَّابِعَةُ إِلَّا رُبْعًا` (quarter to four) — reusing only اسَاعَة/دَقِيقَة and the new ordinals/فractions. `prereqs: ["gr:numbers-11-99"]` (needs the teen-compounding pattern already taught there).

**Sourcing**: Ryding's *Reference Grammar of Modern Standard Arabic* for ordinal-number formation and the time-telling construction; Al-Kitaab Part One's own telling-time chapter for sequencing and phrasing.

### 3.3 One new lesson

`content/lessons/a2-telling-time.json`, `order: 2` on `a2-u4` (alongside the existing `a2-numbers-11-99` as `order: 1`) — same shape as every prior lesson: `explain` → `reading-practice` (`fromObjectives`) → a few `practice-choice` questions → `complete`. `a2-u4` stays `available` (already flipped in batch 2); only its blurb narrows further to reflect the added content — proposed: *"11–99 and their gender-polarity rules, and how to tell the time. Dates and prices come later."*

### 3.4 Proof

Same battery as every prior batch: `build-content.js --check`/`--lint` (0 new warnings), `build-audio-manifest.js --check`, `tools/qa-harness.js`, `tools/a11y-audit.js` clean, live-browser confirmation the new lesson appears on `a2-u4` and walks to completion.

## 4. Sourcing

Ryding's *Reference Grammar of Modern Standard Arabic* — ordinal numbers and time-telling get real dedicated treatment there. Al-Kitaab Part One's telling-time chapter for pedagogical sequencing and natural phrasing. Buckwalter–Parkinson doesn't apply — these are grammar-forced closed-class words, not a frequency-ranked vocabulary choice.

## 5. Open questions

1. **Scope** — telling time only, dates and prices left for their own later batches? Recommend **yes** — three genuinely different vocabulary sets (ordinals, calendar words, currency), better kept separate.
2. **`وَاحِدَة` as its own lexeme** (`lex:num-01f`) rather than an inline inflection mentioned only in a text's gloss — matches the existing `adj-01`/`adj-01f` pattern, and it's being actively taught/tested here, not incidental. Recommend **yes**.
3. **Ordinals cited feminine-only**, with a `notes` flag that the masculine form exists but is out of scope (needed for dates/sequencing, not this batch). Recommend **yes** — citing both forms now would imply this batch teaches sequencing generally, which it doesn't.
4. **Topic/POS for the new ordinals** — `topic: "time"` (thematically where they're used) with `pos: "adjective"` (grammatically accurate — ordinals agree like adjectives, unlike cardinals), rather than folding them into the `numbers` topic alongside cardinals. Recommend **yes**.

## 6. Not in this batch

- ❌ Dates (day-of-month expressions) — reuses these same ordinals for a different construction ("the third of September"), but is its own batch.
- ❌ Prices — needs currency vocabulary, unrelated to ordinals; its own batch.
- ❌ Masculine ordinal forms (أَوَّل، ثَانٍ، ثَالِث…) — needed for dates/sequencing contexts, not telling time; picked up when that batch is scoped.
- ❌ `a2-u3` (root/pattern), `a2-u5` (reading), `a2-u6` (listening) — unchanged, later in the parent milestone's order.
- ❌ Any engine/UI change — pure content, same proven pipeline.
