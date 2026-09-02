# M20 Phase B — A1 vocabulary: residual cleanup

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m20_content_pipeline_scope.md](m20_content_pipeline_scope.md) §"PHASE B" item 3 · supersedes my own [m20b3_a1_vocab_extended_scope.md] (retired — see below).
**Base:** `main` @ `4f9ecd9` (batch 3 + wiring merged, live).
**Branch:** `claude/pensive-darwin-7mao26` (this session's designated branch; restarted from current `main`).

---

## 0. Why this doc replaces the previous one

I scoped a 113-entry batch 3 against `main` @ `c6bdc63`. While that was in
review, a parallel session scoped, authored, and merged its own "batch 3"
(PR #23, 94 lexemes) against the same gap — plus the curriculum wiring
(`a1-u3` generated lessons, `a1-u4` flipped `planned` → `available`) I'd
deliberately deferred. `main` is now at 310 lexemes (179 A1).

I re-ran the same diff (`content/lexemes.json` vs. `content/wordlists/a1.json`,
exact English-gloss match) against current `main` rather than assume my old
numbers still held. **19 entries came back unmatched — not 113.** Of those,
4 are false positives already covered under different phrasing (see §1), so
the real gap is **15 lexemes**. Small enough for one PR; no split needed.

## 1. Where A1 vocabulary stands now

| still unmatched by exact string | verdict |
|---|---|
| `they (m.)` | **skip** — already `lex:pro-03` `"they (masculine/mixed group)"` |
| `welcome (greeting)` | **skip** — already `lex:fc-27` `"welcome"` |
| `you're welcome` | **skip** — already covered by `lex:exp-03` `"you're welcome / excuse me"` |
| `excuse me / sorry` | **skip** — same `exp-03`, plus `lex:exp-04` `"sorry (said by a male speaker)"` already covers the apology sense |
| the other 15 | **real gaps** — table below |

These 4 are exactly the ones I'd already flagged as likely-duplicates in my
original doc, now confirmed against the merged state rather than guessed.

## 2. What this batch adds — 15 lexemes

| en | topic | priority | extends existing lesson |
|---|---|---|---|
| friend | `people` | 1 | `a1-family` (`a1-u3`) |
| young | `people` | 2 | `a1-family` |
| old (person) | `people` | 2 | `a1-family` |
| old (thing) | `home` | 1 | `a1-home-garden` (`a1-u3`) |
| to work | `verbs` | 1 | `a1-daily-verbs` (`a1-u3`) |
| to hear | `verbs` | 1 | `a1-daily-verbs` |
| to do / to make | `verbs` | 1 | `a1-daily-verbs` |
| class / lesson | `school` | 1 | `a1-school` (`a1-u3`) |
| work / job | `work` | 1 | `a1-work` (`a1-u3`) |
| town / village | `places` | 2 | `a1-places` (`a1-u4`) |
| library | `places` | 2 | `a1-places` |
| park | `places` | 3 | `a1-places` |
| above / on | `directions` | 1 | `a1-directions` (`a1-u4`) — distinct from the existing `on` (`lex:prt-02`); wordlist's entry targets the spatial "above/over" sense (فَوْقَ), not the locative "on/at" (عَلَى) `prt-02` already covers. Flagging the nuance rather than silently treating it as either a duplicate or an unexamined add. |
| orange (colour) | `colors` | 3 | `a1-colours` (`a1-u3`) |
| grey / gray | `colors` | 3 | `a1-colours` |

Same shape as every prior batch: `{ id: "lex:<slug>", kind:"lexeme", ar
(fully vowelled), translit, en, pos, topic, level:"A1", tags, skills, prereqs }`.
IDs continue each topic's existing numbering (e.g. `lex:peo-22`, `lex:hom-17`
— assigned at implementation, not pinned here).

### 2.1 Wiring

Unlike my original doc (which deferred all wiring), every one of these 15
words has an existing `source:"generate"` lesson node already live for its
topic — confirmed directly in `content/curriculum.json` (table above). Each
new lexeme is added to that lesson's `objectives` array; the M16 generator
already renders whatever objectives a lesson lists, so this is a one-line
addition per word, no new lesson node, no new unit, no code change.

### 2.2 Proof

Same battery as every prior batch:

- `build-content.js --check` green; `--lint` → `levelfit` warning count drops
  by 15 (these join the checklist), 0 new linguistic warnings.
- `--write-app` byte-stable for existing objects; `m14` byte-compare shows
  only the 15 new lexemes.
- `build-audio-manifest.js --check` clean after regen.
- `m15`–`m19` func suites pass (A1 count: 179 → 194).
- Live browser: each extended lesson (`a1-family`, `a1-home-garden`,
  `a1-daily-verbs`, `a1-school`, `a1-work`, `a1-places`, `a1-directions`,
  `a1-colours`) still runs start→finish with the new words included; words
  appear in Vocabulary/quiz; dark + 320 px.
- `ROADMAP.md` M20 row updated.

---

## 3. Sourcing

Same standard as every batch: Al-Kitaab Part One, Hans Wehr, and the
Buckwalter–Parkinson frequency dictionary, plus (per §1) the existing
in-repo entries themselves as the check for what's already covered. Arabic
authored on approval, presented as a single reviewable table before merge.

## 4. Not in this batch

Any A2+ content, any engine/UI change, any further wordlist audit beyond
this one — this closes the loop on `wordlists/a1.json`'s current ~265
entries (minus the 4 skipped as already-covered), which is short of Phase
A's own ~350-entry estimate; per that file's own `_meta` note, the list
"grows as Phase B batches land," so a future pass may still add to it.
