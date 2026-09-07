# M21 — Batch 2: Numbers 11–99 (a2-u4)

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m21_content_scaleout_scope.md](m21_content_scaleout_scope.md) §2.2 item 2 ("A2 core vocabulary") — this doc proposes a concrete reframing of that item; see §1.
**Base:** `main` @ `c383582` (batch 1 merged).
**Branch:** `claude/pensive-darwin-7mao26`, restarted from `main` now that batch 1's PR is merged.

---

## 1. What this batch covers, and a reframing worth flagging up front

The parent doc's §2.2 named batch 2 generically as "A2 core vocabulary — the highest-priority new lemmas for the six A2 units' topics." Before authoring anything, I checked how M20's own vocabulary batches (2/3) actually worked: they wired new lexemes into **already-existing generated-lesson objectives** (`content/curriculum.json`'s A1 lesson nodes, in place since M16). That target doesn't exist for A2 — `a2-u4`/`a2-u5`/`a2-u6` are still bare unit stubs with **no lesson nodes at all**, generated or hand-authored (checked `content/curriculum.json`'s `lessons` array and `content/lessons/`). Authoring loose vocabulary now, with no lesson to wire it into, would leave it orphaned until whichever later batch finally builds that unit — the exact "wire everything at the end" drift the parent doc's own §2.2 explicitly says to avoid this time.

So this batch proposes a concrete scope instead of a loose vocabulary grab: **complete a2-u4's cardinal-numbers half** — the `numbers-extended` topic already sitting in `content/wordlists/a2.json` (20 entries, authored in batch 1 as this batch's own checklist), one new grammar point, one new lesson, wired immediately. This is "A2 core vocabulary" read as *the first genuinely self-contained, wireable slice of it*, the same judgment call batch 1 made when it completed both `a2-u1` and `a2-u2` in full rather than touching three units partially. §5 Q1 asks you to confirm this reframing.

## 2. A promise already made, and a gap already checked

`gr:counted-noun-intro` (A1, shipped in M20 batch 6) taught 1–2 vs. 3–10 counting and said outright: *"The reversed masculine/feminine agreement you can already see on ثَلَاثَةُ … is a real rule, saved for a later, dedicated unit rather than rushed here."* That unit is `a2-u4` — named explicitly in this session's own batch-6 work. This batch is where that promise gets paid off.

Checked before planning: `wordlists/a2.json`'s `numbers-extended` topic already lists exactly what's needed — eleven through nineteen, the tens twenty through ninety, and hundred (18 entries) — plus `half`/`quarter` (2 entries) which this batch does **not** need (see §6). No lexeme in `content/lexemes.json` covers 11–99 yet; `numbers` topic currently stops at `lex:num-10`.

## 3. What ships

### 3.1 18 new lexemes

`lex:num-11` through `lex:num-19`, `lex:num-20`/`30`/`40`/`50`/`60`/`70`/`80`/`90`, `lex:num-100` — each cited in its bare masculine dictionary form, matching the existing `lex:num-01`–`10` convention exactly (no tanwīn shown, e.g. `ثَلَاثَة` not `ثَلَاثَةٌ`). One citation form per number, not masc+fem pairs — 13–19's feminine forms are a **rule-governed alternation** of the same word (exactly how 3–10 already works with a single lexeme each), taught in the grammar point below, not doubled in the lexicon. 11 and 12 are irregular suppletive compounds (أَحَدَ عَشَرَ / اثْنَا عَشَرَ) cited as their own single entries for the same reason. `مِائَة` (miʾah) is the spelling proposed for "hundred" — the older, more universally-recognized orthography (vs. the simplified modern `مِئَة`) — flagged as a judgment call in §5 Q4.

### 3.2 One new grammar point: `gr:numbers-11-99`

The single biggest idea: **11–99 take a singular accusative counted noun** (تمييز), not the plural genitive 3–10 use — عِنْدِي **خَمْسَةَ عَشَرَ كِتَابًا** (fifteen books), not a plural. Within that:

- **11 & 12 are irregular compounds**, given as a memorized pair: أَحَدَ عَشَرَ / إِحْدَى عَشْرَةَ (11, masc/fem), اثْنَا عَشَرَ / اثْنَتَا عَشْرَةَ (12, masc/fem — construct-state duals, dropping ن the same way a sound plural does in construct state).
- **13–19 extend the rule already known from 3–10**: the ones-digit keeps its *reversed* gender form (خَمْسَةَ, matching 3–10's own خَمْسَة), while the teen-marker عَشَر/عَشْرَة agrees *normally* with the noun's gender instead — a split worth naming plainly rather than glossing over.
- **20–90 are invariant** for gender (عِشْرُونَ works for both مُعَلِّمٌ and مُعَلِّمَة) — the first number words in the whole curriculum that *don't* care about the noun's gender at all. They do decline for case (عِشْرُونَ nominative / عِشْرِينَ accusative-genitive), unlike 11–19 which stay fixed regardless of case — a brief aside, not a dedicated example (see §5 Q3 on example count).
- **21–99 compound**: ones-digit + وَ + tens, e.g. `وَاحِدٌ وَعِشْرُونَ` (21) — the ones-digit behaves exactly as it would alone (normal agreement for 1/2, reversed for 3–9).
- **مِائَة (100)** governs a *singular genitive* noun via iḍāfa, not accusative: `مِائَةُ كِتَابٍ` (a hundred books) — a third pattern, distinct from both 3–10 and 11–99.

7 example texts (more than the usual 3 — see §5 Q3): `عِنْدِي أَحَدَ عَشَرَ كِتَابًا` / `عِنْدِي إِحْدَى عَشْرَةَ طَالِبَةً` (11, both genders), `عِنْدِي خَمْسَةَ عَشَرَ كِتَابًا` / `عِنْدِي خَمْسَ عَشْرَةَ طَالِبَةً` (15, both genders, the systematic pattern), `عِنْدِي عِشْرُونَ كِتَابًا` (20, invariant), `عِنْدِي وَاحِدٌ وَعِشْرُونَ كِتَابًا` (21, compound), `عِنْدِي مِائَةُ كِتَابٍ` (100, genitive government) — all reusing عِنْدِي + كِتَاب/طَالِبَة, the same `عِنْدِي`-sentence pattern `gr:counted-noun-intro`'s own examples already established, and both nouns already existing lexemes. `prereqs: ["gr:counted-noun-intro"]`.

**Sourcing**: Ryding's *Reference Grammar of Modern Standard Arabic* is the primary authority here — this is one of the genuinely denser corners of MSA grammar, covered in real depth there — cross-checked against Al-Kitaab Part One's own numbers-11-99 treatment for pedagogical sequencing.

### 3.3 One new lesson

`content/lessons/a2-numbers-11-99.json` on `a2-u4` — same shape as `a1-numbers.json`: `explain` → `reading-practice` (`fromObjectives`) → a few `practice-choice` questions covering the irregular pair, the 13–19 split, and the singular-accusative-vs-plural-genitive contrast with 3–10 → `complete`.

### 3.4 `a2-u4` flips `planned` → `available`, blurb narrowed

Current blurb: *"11–99, gender polarity, dates, prices, and the clock."* This batch delivers only the first two. Proposed narrowed blurb: **"11–99 and the gender-polarity rules that come with them."** — matching the exact non-overclaiming pattern used for `a1-u5`, `a2-u1`, and `a2-u2`: say only what shipped. Dates, prices, and the clock stay explicitly open (see §6).

### 3.5 Proof

Same battery as every prior batch: `build-content.js --check`/`--lint` (0 new warnings), `build-audio-manifest.js --check`, `tools/qa-harness.js`, `tools/a11y-audit.js` clean, live-browser confirmation `a2-u4` shows "Available."

## 4. Sourcing

Ryding's *Reference Grammar of Modern Standard Arabic* (numbers chapter) for the agreement rules — the primary citation for this batch, given the density of the material. Al-Kitaab Part One's own numbers-11-99 chapter for sequencing and worked examples. Buckwalter–Parkinson frequency data doesn't really apply here — number words aren't a frequency-ranked vocabulary choice.

## 5. Open questions

1. **The reframing itself (§1)** — complete `a2-u4`'s cardinal-numbers half now, wired into its own lesson immediately, rather than a loose "priority-1 vocabulary across all three `wordlists/a2.json` topics" batch with nothing yet to wire it into? Recommend **yes, as proposed** — no orphaned content, and it finally delivers on `gr:counted-noun-intro`'s own deferral.
2. **Scope narrowing within `a2-u4`** — cardinal numbers 11–99 + hundred now; defer telling time, dates, and prices to a small follow-up? Telling time specifically needs **ordinal** numbers (الأولى، الثانية…), a vocabulary set not yet on any checklist — pulling it in now would double this batch's size. Recommend **yes, defer** — same narrow-scope discipline `a1-numbers` used for 0–10 itself.
3. **Example count** — 7 texts for one grammar point, above the usual 3, because this point genuinely packs in more distinct sub-rules (irregular 11/12, the 13–19 split, invariant tens, compounding, hundred's different case government) than any single A1 point did. Recommend **keep the fuller set** — trimming to 3 would leave a real pattern untaught rather than just under-practiced.
4. **"Hundred" spelling** — `مِائَة` (traditional) vs. `مِئَة` (modern simplified). Recommend **مِائَة** — the more universally-recognized form across both classical and modern printed sources, including how Al-Kitaab itself spells it.

## 6. Not in this batch

- ❌ Telling time, dates, prices — the rest of `a2-u4`'s original blurb; needs ordinal numbers, not yet checklisted anywhere. A small follow-up once this lands.
- ❌ `half`/`quarter` — already sitting in `wordlists/a2.json` for that same telling-time follow-up; unused (and therefore not authored) until that lesson exists.
- ❌ `narrative` and `everyday-exchanges` vocabulary from `wordlists/a2.json` — batch 3's territory, per the parent doc's order; may need the same "what does this actually wire into" check this doc just did for `a2-u4` before batch 3 is scoped.
- ❌ `a2-u3` (root/pattern), `a2-u5` (reading), `a2-u6` (listening) — later batches, unchanged from the parent doc's order.
- ❌ Any engine/UI change — this batch is pure content on the already-proven pipeline.
