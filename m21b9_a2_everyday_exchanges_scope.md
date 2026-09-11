# M21 — Batch 9: a2-u6, Everyday Exchanges

**Status:** approved. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [reference/iraab-audit.md](reference/iraab-audit.md) §9 Implementation Gate, prerequisite 1 ("A2 not closed — `a2-u6` still in development"). Closing this unit is the single blocking step before B1/iʿrāb work can start.
**Base:** `main` @ `67e8e3c`.

---

## 1. What this batch covers

`a2-u6` ("Everyday Exchanges") is the **last `planned` A2 unit** — blurb: "Shopping, directions, and routine conversation — listening and speaking," skills `listening`/`speaking`/`comprehension`, prereq `a1-u3` (available). Closing it finishes A2 entirely.

## 2. Checked before planning — vocabulary is already fully stocked

Grepped `content/lexemes.json` against every `everyday-exchanges` entry in `wordlists/a2.json`, plus the unit's "directions" promise (not its own checklist topic — checked separately):

- **Shopping/exchange phrases** — all 13 already exist as lexemes from Batch 7, unused since: `lex:exp-17..22` (ذَاتَ يَوْمٍ, طَبْعًا, لَا بَأْسَ, هَلْ عِنْدَكَ...؟, مُمْكِن...؟, هَذَا كُلُّ شَيْءٍ), `lex:shp-11..14` (نَقْد, بِطَاقَة اِئْتِمَان, مَقَاس, خَصْم), plus `lex:ver-30` (جَرَّبَ), `lex:sch-22` (قِصَّة), `lex:obj-09` (شَيْء). Currencies (`lex:shp-07..10`) already have their own lesson (`a2-prices`, `a2-u4`) but are fair to reuse in a shopping dialogue.
- **"I would like..." / "there is/are"** — already covered by existing A1 lexemes (`lex:ver-16` أَرَادَ, `lex:pla-17` هُنَاكَ), confirmed in Batch 7.
- **Directions** — turns out to be a non-gap I almost missed: `lex:dir-01/02/03` (يَمِين / يَسَار / إِلَى الْأَمَام) plus `lex:pla-16..19` (هُنَا / هُنَاكَ / قَرِيب / بَعِيد) and `lex:pla-03` (شَارِع) were all already authored at **A0/A1**, just never used in a text.

**Result: zero new lexemes needed.** Same discipline as Batch 6 (root & pattern) and Batch 8 (reading) — pure application of existing vocabulary into a new lesson.

## 3. The real content gap: no imperative mood taught anywhere

This is the one genuine gap, and it's grammatical, not lexical. Giving directions idiomatically ("turn left," "go straight") needs the imperative (فِعْل الْأَمْر) — `content/grammar.json` has no `gr:imperative` and nothing else in the curriculum introduces command verb forms.

Two ways to close `a2-u6` without stalling on this:

- **(a) Add `gr:imperative`.** More authentic direction-giving dialogue, but a real new grammar point — arguably its own concern, and directions-via-command-verbs pulls in a verb-form paradigm (sound vs. weak roots) that's more than this batch's stated scope.
- **(b) Stay inside existing grammar.** Phrase directions as location statements instead of commands — "the bank is near here, on the right" (`gr:nominal-sentence` + `gr:core-prepositions` + the already-taught direction/place words) rather than "turn right." Zero new grammar, matches this batch's vocabulary-only budget, and is still a legitimate real-world register (giving directions by describing location is at least as common as barking commands). Costs some naturalism in the dialogue.

**Recommend (b)** — keeps this batch zero-new-grammar like Batches 4/6/8, and defers the imperative to wherever the roadmap actually needs it next (it'll be needed eventually for classroom/command language regardless of iʿrāb).

## 4. Proposed shape (not yet written)

- **Content:** 2 short dialogues (`textType: "dialogue"`, reusing the existing `turns` array — no engine change, same as the 4 dialogues already in `texts.json`) — one shopping exchange (price, size, trying on, cash/card, "that's all"), one asking/giving directions (location-statement style per §3b). Concept-tagged to spend the 13 idle Batch-7 lexemes plus the directions set.
- **Grammar:** none new (§3b).
- **Lesson:** one `content/lessons/a2-everyday-exchanges.json` on `a2-u6`, listening/speaking-flavored per the unit's own skills tags (dialogue playback + `practice-choice` comprehension, matching Batch 8's reading-comprehension framing rather than grammar-recognition).
- **Flip:** `a2-u6` `planned` → `available`, blurb's "In development" clause drops — **A2 fully closed**, satisfying Implementation Gate prerequisite 1.

## 5. Open questions

1. **(a) vs (b) on the imperative** (§3) — **decided: (b)**, stay in existing grammar (location statements). No new grammar point.
2. **Two dialogues, one lesson** — matches the "smaller unit, one lesson" precedent (`a2-u3`, `a2-u5`). Recommend **yes**; open to a third dialogue if you want more coverage.
3. **مُمْكِن...؟** — Batch 7 flagged it as "deliberately unanalyzed" (avoids the subjunctive it could otherwise govern). This batch should use it only as a fixed conversational fragment ("مُمْكِن؟" / "مُمْكِن أُجَرِّب هَذَا؟" reusing جَرَّبَ's own already-taught form, not a new subjunctive construction). Recommend confirming this constraint before drafting.

## 6. Not in this batch

- ❌ `gr:imperative` or any new grammar point (pending §3/§5.1 answer).
- ❌ Any change to `content/lexemes.json`, `wordlists/a2.json`, `content/roots.json`, or `_lint-allow.json` — nothing here is unanticipated.
- ❌ Any new `textType`, step type, or `exerciseType` — reuses `dialogue`/`turns` and `explain`/`reading-practice`/`practice-choice`/`complete` unchanged.
- ❌ B1 content, `gr:imperative` as a B1 grammar point, or anything from the iʿrāb programme — this batch's only job is closing A2.
- ❌ Actual lesson/text JSON, or any `index.html` change — scope only, per your instruction.
