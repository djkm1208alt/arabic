# M21 — Batch 1: A2 Grammar + the A2 Wordlist

**Status:** scope, held for approval. No implementation yet.
**Parent:** [m21_content_scaleout_scope.md](m21_content_scaleout_scope.md) (approved) §2.1–2.2 item 1.
**Base:** `main` @ `9d77aa1`.
**Branch (on approval):** `claude/pensive-darwin-7mao26` (this session's designated branch).

---

## 1. What this batch covers

Per the approved M21 doc: the pipeline extension (§2.1) folds in here rather than getting its own PR, and grammar comes first. Concretely, this batch completes **both** `a2-u1` ("The Verbal Sentence") and `a2-u2` ("The Genitive Construct / Iḍāfa") — not just the pipeline plumbing.

## 2. A head start worth stating up front

Checked before planning any new vocabulary: **all 29 existing verb lexemes are already cited in their 3rd-person-masculine-singular past-tense form** (`lex:ver-01` ذَهَبَ "to go", `ver-02` أَكَلَ "to eat", …) — that's simply how Arabic dictionaries and this app's own convention cite a verb's "dictionary form." Past-tense Form I conjugation doesn't need a single new verb; every existing "to X" lexeme is already the "he did X" form. Likewise, iḍāfa examples run on existing nouns (بَيْت، كِتَاب، رَجُل…). **This batch needs zero new lexemes** — the same discovery M20 batch 6 made for numbers, one level up.

## 3. What ships

### 3.1 Pipeline extension (small, per the approved M21 doc)

- `content/wordlists/a2.json` — new file, same shape as `a1.json` (`_meta` header citing sources, `{ en, topic, pos, priority }` entries), organized by the six `a2-u*` units' actual topics. Sized to what those units need — not a pre-committed count (per the approved doc's §5 open-question answer). This batch's own grammar content needs no new vocabulary (§2), so this file's entries serve the *later* vocab batches — authored now as the target checklist, same as `a1.json` was authored complete before any A1 vocab batch started.
- `tools/content-lint.js`: extend the level-fit rule (currently hardcoded to A1 only, lines ~116/194) to also check A2 lexemes against `wordlists.a2`.
- `tools/content-lint.js`: extend the ḥarakāt-coverage rule's level guard (currently `A0 || A1`, line ~182) to include `A2` — A2 content is still fully vowelled per `levels.json`'s own description; the unvowelled shift is B1's.
- `tools/build-content.js`: load `wordlists/a2.json` alongside `a1.json`.
- Each extension proven against a fixture, same as every M20 Phase A rule.

### 3.2 Three new grammar points

**`gr:verbal-sentence`** (A2) — Arabic's other sentence type, introduced for the first time (A1 taught nominal sentences only). Covers: (a) past-tense Form I conjugation across the full person paradigm (هو/هي/هم/أنا/أنتَ/أنتِ/نحن — reusing pronouns already taught in `gr:connectors`'s wiring), demonstrated on already-existing verbs; (b) VSO word order — Arabic's neutral default puts the verb first (فِعْل — فَاعِل — مَفْعُول), unlike English SVO, while noting SVO/topic-fronted order is also grammatical, not teaching VSO as the *only* order. `prereqs: ["gr:noun-number", "gr:nominal-sentence"]` (needs the plural/agreement groundwork and something to contrast against).

**`gr:kana`** (A2) — كَانَ ("was/were"), the way a nominal sentence moves into the past: `الْبَيْتُ كَبِيرٌ` (the house is big) → `كَانَ الْبَيْتُ كَبِيرًا` (the house was big) — the predicate becomes accusative after كان, and كان's own conjugation is irregular (hollow root, و): `كَانَ / كَانَتْ / كَانُوا / كُنْتُ`. Flagged honestly as an irregular paradigm, not smoothed over as a regular Form I verb. `prereqs: ["gr:nominal-sentence", "gr:gender-agreement"]`.

**`gr:idafa`** (A2) — the genitive construct: two nouns in sequence express possession — `بَيْتُ الرَّجُلِ` (the man's house) — the first noun (مُضَاف) drops its own tanwīn/ال, the second (مُضَاف إِلَيْهِ) is genitive and carries the definiteness for the whole phrase. "The backbone of Arabic phrasing," per its own unit blurb — real weight, cited carefully. `prereqs: ["gr:definiteness"]`.

Each gets 3 example `txt:` sentences (9 total), same `rule`/`examples`/`commonErrors` shape as every existing `gr:` entry, built only from already-existing vocabulary.

### 3.3 Two lessons, both units fully wired

- `content/lessons/a2-verbal-sentence.json` on `a2-u1` — `gr:verbal-sentence` + `gr:kana` together (they're taught in the same unit per the curriculum stub).
- `content/lessons/a2-idafa.json` on `a2-u2`.
- `a2-u1` and `a2-u2`: `"planned"` → `"available"`. Both units **fully** complete, not partial stubs.

### 3.4 Proof

Same battery as every prior batch — `build-content.js --check`/`--lint` (0 new warnings, new lint-rule fixtures proven), `build-audio-manifest.js --check`, `tools/qa-harness.js` (both new lessons walk to completion, suite stays green), `tools/a11y-audit.js` clean, live-browser confirmation that `a2-u1`/`a2-u2` show "Available."

---

## 4. Sourcing

Al-Kitaab Part One's later chapters (past tense, iḍāfa are both introduced before Part One ends) rather than Part Two, since M21's own doc flagged Part One alone as insufficient for A2 as a whole — these three points specifically are still Part-One-territory; the Part Two texts cited start once vocabulary batches need higher-frequency-band words. Ryding's *Reference Grammar of Modern Standard Arabic* for the structural detail on VSO order, كان وأخواتها (teaching plain كان only — its "sisters" are a later point, not scoped here), and iḍāfa's genitive-chain behavior.

## 5. Open questions

1. **`gr:present-tense`'s person coverage.** The existing A1 point only covers he/she/they. This batch's `gr:verbal-sentence` teaches the *past* tense across the full person paradigm (adding أنا/أنتَ/أنتِ/نحن) — leaving present tense's coverage narrower than past tense's would be an inconsistent gap. Recommend **extending `gr:present-tense`'s examples to the same persons in this batch** (edit its `examples` list only, not its `rule` text or existing ids — purely additive, same non-destructive pattern M12 used for `alphabet-writing-1`) rather than opening a whole separate batch for one small addition.
2. **One lesson or two.** Proposed one lesson per unit (§3.3) rather than one combined lesson, matching how `a2-u1` and `a2-u2` are separate curriculum units with separate prereqs. Recommend **as proposed**.
3. **`a2.json` topic breakdown.** Proposing to organize it around the six units' own topics (verbal-sentence/kana need no vocab topic; iḍāfa likewise; the wordlist mainly serves `a2-u3`/`a2-u5`/`a2-u6`'s eventual vocab batches: root-and-pattern words, paragraph-topic vocabulary, everyday-exchange vocabulary). Recommend **yes** — happy to adjust the topic split once you see the draft file.
4. **Batch size** — three grammar points + two full lessons + the wordlist file in one PR, or split the wordlist out on its own first (even though M21's doc recommended folding it in)? Recommend **keep together** — the wordlist has no dependents to unblock separately, and reviewing it alongside the grammar it's meant to eventually serve gives useful context.

## 6. Not in this batch

- ❌ Any A2 vocabulary authoring (batches 2–3) — the wordlist here is the checklist, not the vocabulary.
- ❌ `a2-u3` (root/pattern), `a2-u5` (reading), `a2-u6` (listening) — later batches, per the approved M21 order.
- ❌ كان وأخواتها's other "sisters" (أصبح، ظل، صار، …) — plain كان only.
- ❌ Any engine/UI change beyond the two lint-rule extensions in §3.1.
