# M20 Phase B — Batch 6: Wire `a1-u5` (Numbers 1–10)

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m20_content_pipeline_scope.md](m20_content_pipeline_scope.md) §"PHASE B" item 6 · [m20b2_a1_vocab_core_scope.md](m20b2_a1_vocab_core_scope.md) §5 (first named this as the last item in Phase B).
**Base:** `main` @ `6a089f7` (batch 5 — A1 writing/dictation — merged, live).
**Branch:** `claude/pensive-darwin-7mao26` (this session's designated branch, restarted from current `main`).

---

## 1. Why this is the last Phase B batch, and why it's small

Every other A1 unit (`a1-u1` through `a1-u4`) is `"status": "available"`. `a1-u5` ("Numbers 1–10") is the only one still `"planned"` — it's the one item left on M20 Phase A's own closing list ("wire the M16 A1 curriculum units... the placeholder generated proof lessons are replaced or kept as-is").

Unlike batches 1–5, this isn't a vocabulary-authoring pass: **the numbers themselves already exist.** `content/lexemes.json`'s `numbers` topic has all of `صِفْر` through `عَشَرَة` (0–10, `lex:num-00`…`lex:num-10`) — tagged **A0**, from before M20 even started. What's actually missing is a *lesson* and the one grammar point numbers need that nothing else already covers.

## 2. The `a1-u5` blurb overpromises — narrowing it, not fulfilling it as written

Current `content/curriculum.json` entry:

```
"blurb": "Counting, the counted noun, and telling the time — the start of the numbers strand. In development."
```

Checked this against the rest of the curriculum before scoping to it literally. **`a2-u4`** already exists, explicitly titled "Numbers, Counting & Time", `prereqs: ["a1-u5"]`:

```
"blurb": "11–99, gender polarity, dates, prices, and the clock. In development."
```

So the curriculum's own later design already owns telling the time and the hard part of the counted noun (**gender polarity** — Arabic's reversed-agreement rule where masculine 3–10 takes feminine-marked nouns and vice versa, one of the notoriously difficult corners of Arabic grammar). `a1-u5`'s blurb predates that split and still reads as if it owns all three. Teaching gender polarity and clock-time at A1, on top of the counted noun's basic structure, would be cramming an A2 unit's content in a level early — and would leave `a2-u4` with nothing new to teach.

**Recommend narrowing `a1-u5` to what its own prereq position supports:** counting 1–10, and the counted noun's *structure* only (1 and 2 use the noun's own singular/dual form; 3–10 take a plural noun) — without the gender-polarity rule, which stays a genuine A2 topic at `a2-u4` as already planned. Telling time drops from `a1-u5` entirely; it's already `a2-u4`'s job. Updated blurb proposed in §4.

## 3. What ships

### 3.1 One new grammar point: `gr:counted-noun-intro` (A1)

```json
{ "id": "gr:counted-noun-intro", "kind": "grammar", "name": "Counting nouns: 1–2 vs. 3–10",
  "level": "A1",
  "rule": "وَاحِد (one) and اِثْنَان (two) don't count a noun the way English does — the noun itself already shows the number: كِتَابٌ (a book) is already singular, كِتَابَانِ (two books) is already dual (see gr:noun-number). From ثَلَاثَة (three) to عَشَرَة (ten), the number is followed by the noun in its plural form: ثَلَاثَةُ كُتُبٍ (three books). The reversed masculine/feminine agreement between 3–10 and the counted noun is a real rule, saved for a later, dedicated unit rather than rushed here.",
  "examples": ["txt:gram-count-one", "txt:gram-count-two", "txt:gram-count-three"],
  "commonErrors": ["Treating اِثْنَان + noun like 3-10 and reaching for a plural instead of the dual.", "Expecting the counted noun after 3-10 to look like an English plural pattern rather than the noun's own (often broken) plural."],
  "skills": ["grammar", "reading"], "prereqs": ["gr:noun-number"] }
```

Deliberately named `-intro`, not `-agreement` or `-full` — the name itself signals gender polarity isn't in here, so nothing later has to explain a rename.

### 3.2 Three new `txt:` examples

Referenced by `gr:counted-noun-intro` above, reusing `كِتَاب`/`كُتُب` — already in the app (`lex:sch-06`, and `كُتُبٌ` is `gr:noun-number`'s own broken-plural example, so no new plural is invented):

- `txt:gram-count-one` — كِتَابٌ وَاحِدٌ (one book)
- `txt:gram-count-two` — كِتَابَانِ (two books) — ties directly back to `gr:noun-number`'s dual
- `txt:gram-count-three` — ثَلَاثَةُ كُتُبٍ (three books)

Same shape as the existing `txt:gram-number-*` set (`source: "m11"`, per batch 1's precedent of reusing that provenance value for "grammar demo," not the commit).

### 3.3 One new lesson: `content/lessons/a1-numbers.json`

`unitId: "a1-u5"`. Objectives: the 11 existing `lex:num-00`…`lex:num-10` + `gr:counted-noun-intro` + its 3 new `txt:` examples. Steps follow the established data-lesson shape (batch 5's files are the direct template): `explain` (why counting isn't just "number + noun" in Arabic) → `reading-practice` (`fromObjectives: true` over the 11 numbers) → an `exercise` (`choice` or `build`, recognizing numbers) → `explain` or `reading-practice` for the counted-noun examples → `complete`.

### 3.4 Curriculum wiring

- `a1-u5.status`: `"planned"` → `"available"`.
- `a1-u5.blurb`: → *"Counting 1–10, and how Arabic nouns change after a number — full agreement rules come later."* (drops "telling the time"; "the counted noun" narrowed to "how nouns change after a number," matching §2).
- `a2-u4` unchanged — it already correctly owns gender polarity and time; nothing here removes or duplicates that.

### 3.5 Proof

- `build-content.js --check`/`--lint`: green, 0 new warnings; the new `gr:` and `txt:` objects are referenced (by the lesson and by each other), so no new orphans.
- `build-audio-manifest.js --check`: clean after regen (3 new sentence targets, the numbers' own audio targets already exist from A0).
- `tools/qa-harness.js`: the new `a1-numbers` lesson walks to completion; full suite stays green (currently 53/53).
- `tools/a11y-audit.js`: clean.
- Live browser: `a1-u5` shows `available` in Learn view; the lesson runs start→finish; the numbers (already-familiar A0 vocabulary) and the new grammar point both render correctly; dark + 320px.
- `ROADMAP.md` M20 row: Phase B marked fully complete (batches 1–6 all done).

---

## 4. Sourcing

Same standard as every batch. The counted-noun structure (1–2 vs. 3–10) and the honest deferral of gender polarity are checked against **A Reference Grammar of Modern Standard Arabic** (Ryding) and **Al-Kitaab Part One**'s own sequencing (which likewise introduces counting before the full agreement rule). No new vocabulary is authored — every word in the new examples already exists in-repo.

## 5. Open questions

1. **Narrowing `a1-u5`'s blurb** (§2) — confirm dropping "telling the time" and softening "the counted noun" to structure-only, leaving gender polarity + clock time to `a2-u4` as already planned? Recommend **yes** — this is a rescoping *toward* the curriculum's own existing design, not a new deferral being invented here.
2. **Exercise type for the numbers-recognition step** (§3.3) — `choice` (simpler, matches `a1-writing-dictation`'s pattern) or `build`/word (matches the writing-batch's spelling emphasis)? Recommend **`choice`** — this lesson's job is recognition and the counted-noun structure, not spelling; `a1-writing-dictation` already exercises spelling on other vocabulary.
3. **Is this the right point to also close M20 in `ROADMAP.md`** (mark Phase B fully done, not just this row) — or leave that framing to whoever scopes M21 next? Recommend **yes, close it here** — batch 6 was always Phase B's last listed item; leaving the row "in progress" after this lands would be the same kind of staleness this session already fixed once.

## 6. Not in this batch

- ❌ Gender polarity (3–10 reversed agreement) and 11–99 — `a2-u4`, unchanged.
- ❌ Telling time, dates, prices — `a2-u4`.
- ❌ Ordinal numbers (first, second, …) — not in `wordlists/a1.json`, not scoped anywhere yet.
- ❌ Any new vocabulary — the 11 numbers already exist; nothing else is needed.
- ❌ Any engine/UI change — same step types, same lesson-generator/exercise machinery as every prior batch.
