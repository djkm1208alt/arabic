# M20 Scope: Content Pipeline + the A1 Reference Level

**Status:** Draft for review. **No implementation code written.** Do not begin implementation until this is approved.

**Parent:** [ROADMAP.md](ROADMAP.md) M20 · [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) §10, §11 · depends on M14–M19 (the whole engine).

**One-line summary:** Before any large-scale authoring, harden the pipeline. Grow `tools/build-content.js` a real **schema + linguistic linter** (ḥarakāt coverage, transliteration ↔ Arabic consistency, MSA register, Arabic-Indic digit placement, level fit against a controlled word list), prove it catches a deliberately-broken example, and add a lesson-content JSON format so new lessons are authored as reviewable data. **Then**, against that proven pipeline, author the A1 level across all eight strands — as a **sequence of small, linted, individually-reviewed content batches**, not one code drop.

The roadmap's internal gate is explicit: *pipeline proven → then author A1.* This scope makes that gate a PR boundary.

---

## 1. Why M20 exists

Everything from M14 on has built an engine with almost no fuel. A1 today: **31** A1-tagged lexemes (target ~350), **2** A1 grammar points (target ~9), **4** A1 texts. The M16 A1 curriculum units are mostly slots. And `build-content.js` validates *structure* but not *Arabic* — nothing stops a bare-consonant word, a transliteration that doesn't match its script, an Egyptian colloquialism in an MSA lesson, or an A1 text built from B2 vocabulary.

M20 fixes the pipeline first (so bad Arabic can't land), then begins filling A1 under that guard. It does **not** touch the runtime engine, and it does **not** author A2+ (M21).

---

## 2. What M20 delivers

### PHASE A — the pipeline (this milestone's PR)

#### 2.1 A controlled A1 word list

`content/wordlists/a1.json` — the **target A1 lexicon as a spec**, ~350 entries, each `{ lemma_en, topic, pos, priority }`, grouped by the §10.5 topic threads (greetings · family · food · home · shopping · travel · school · work · health · directions · daily routine · weather · social). Sourced from a published MSA frequency / beginner list (cited in the file header); this is an English-side *plan*, not Arabic — the Arabic is authored in Phase B against it. The linter uses it for the **level-fit** check: an A1 object may only use lemmas at A1-or-below.

#### 2.2 The linguistic linter — in `build-content.js`

A `--lint` pass (also run by `--check`), each rule with a fixture proving it fires:

| rule | catches |
|---|---|
| **ḥarakāt coverage** | an A0/A1 `ar` string with a consonant carrying no ḥaraka / sukūn / shadda and not acting as a long-vowel carrier (heuristic: consonant-to-mark ratio + no naked medial clusters). Warns, doesn't hard-fail, on ambiguous cases. |
| **translit ↔ ar — emphatics & pharyngeals** | `translit` has `ṣ ḍ ṭ ẓ ḥ ʿ ġ ʾ` without the matching `ص ض ط ظ ح ع غ ء` in `ar` (and the reverse) — the errors beginners' content most often ships. |
| **translit ↔ ar — long vowels** | `ā ī ū` in `translit` without a corresponding `ا ي و` madd in `ar`. |
| **translit ↔ ar — length sanity** | `translit` grapheme count wildly out of proportion to `ar` (a rough transposition/truncation catch). |
| **MSA register** | a curated denylist of common colloquialisms (`مش`, `عايز`, `إيه`, `فين`, `ازيك`, `ليش`, `شنو`, `هسه`, `بدي`, …) appearing in any `ar` / text `words[]`. |
| **Arabic-Indic digits** | `[٠-٩]` in any object **not** in `topic: "numbers"` — Western digits everywhere else (§10.4). |
| **level fit** | an object at level L using a lemma above L per `wordlists/a1.json` (and, once they exist, `a2.json`…). A1-only in this milestone. |
| **audio keys** | every `audio` field resolves to an entry the audio manifest will accept. |

Existing structural checks (dangling refs, prereq cycles, level-monotonicity, descriptor completeness, the M17/M18 coverage checks) are **kept and consolidated** into the same report.

#### 2.3 Lesson content as data

`content/lessons/*.json` — a JSON step format so a lesson can be authored without touching `index.html`:

```
{ id, unitId, title, blurb, level, skills, objectives:[objId],
  steps: [ { type, ...typeSpecificFields } ] }
```

- Step types are the **existing** `stepRenderers` / `exerciseTypes` — `explain`, `example-set` (by objective ref, not literal Arabic), `reading-practice`, `exercise`, `complete`.
- `build-content.js` compiles these into the app's `lessons` catalog alongside the 11 legacy ones and validates every `objectives` id + step shape + that the referenced objects pass the linter.
- **The 11 existing generator-heavy lessons stay as inline JS** (they pull live examples from data — converting them to literals would *lose* that property). They're unchanged, still guarded by the seeded-RNG byte-compare. New lessons — and the A1 lessons in Phase B — are authored as `content/lessons/*.json`.

#### 2.4 Migration + proof

- `_legacy-id-map`, the M15 descriptor grid, M16 `curriculum.json` — already in `content/`; no move needed.
- The A0 foundation lexemes / letters / marks / syllables / texts get a one-time linter pass; anything it flags is fixed **or** explicitly allow-listed with a reason (e.g. a deliberately-unvowelled `txt.unvowelled` field).
- `content/m20-lint-proof.md` — generated: the linter run on the current content (clean or an allow-list), plus each rule shown firing on its fixture.

#### 2.5 Tooling + docs

- `build-content.js` — the `--lint` rules, the wordlist load, the lesson compiler; summary print gains a lint section.
- This scope doc; a "What shipped" note; `ROADMAP.md` M19/M20 rows + `CURRICULUM_ARCHITECTURE.md` §11 annotated.

### PHASE B — author A1 (a series of small reviewed content PRs, after Phase A merges)

Each PR: one topic thread or one grammar cluster, authored as `content/*.json`, **linted green**, with the Arabic verified against a cited source, reviewed by you before merge. No PR invents Arabic; no PR is large.

1. **A1 grammar** (~7 new `gr:` points): number (sg/pl overview), definiteness & tanwīn, the nominal sentence formalised, demonstratives, attached possessive pronouns, core prepositions, negation `ليس/لا/ما`. Each with a `rule`, real `examples` (as `txt:` objects), `commonErrors`.
2. **A1 vocabulary — core threads** (family, food, home, time, daily routine): the highest-`priority` entries from `wordlists/a1.json`, ~60–100 lexemes, each `{ ar (fully vowelled), translit, en, pos, topic, level:"A1", example }`.
3. **A1 vocabulary — remaining threads** (shopping, travel, school, work, health, directions, weather, social): the rest of the list.
4. **A1 reading / listening / comprehension texts** (~15–20 short sentences & mini-dialogues) built only from A1-or-below vocab + grammar, each with `vowelled` / `reduced` / `unvowelled` / `translit` / `en` / `words[]` / `audio`.
5. **A1 writing**: dictation word sets + joining-practice items referencing existing `let:` objects.
6. **Wire-up**: the M16 A1 curriculum units (`a1-u1 … a1-u5`) get real `content/lessons/*.json` lessons using the new objects; the placeholder generated proof lessons are replaced or kept as-is.

Phase B is **explicitly a bounded content operation, not a monolithic deliverable** — consistent with the roadmap's own note that content authoring has no end date. M20 is "done" for milestone-tracking when Phase A is merged and the first Phase-B grammar + core-vocab batches are in and A1 is coherent enough for a learner to work through end to end.

---

## 3. Invariants — what M20 must NOT change

| # | Invariant |
|---|---|
| I1 | The runtime engine is untouched: `stepRenderers`, `exerciseTypes`, the lesson runner, `deriveLevel`, the M19 scheduler / `ReviewState`, `generateLessonSteps`, the placement flow, the review runner — no changes. M20 adds *content* and *build-time validation*. |
| I2 | The 11 legacy lessons stay inline JS and byte-identical (seeded-RNG compare). The M13 audio layer, M14 `CONTENT` shape, M15–M19 structures are unchanged; `build-content.js` gains checks and a new input dir, not a new output shape beyond the additive `lessons` compile. |
| I3 | Runtime stays **buildless, zero-dependency, zero-fetch, offline-first, one self-contained file**. `content/lessons/*.json` is compiled in at dev time exactly like `lexemes.json` etc. |
| I4 | `HARAKAT` == 3; `RECORDED_AUDIO_MANIFEST` regenerated but consistent; `build-audio-manifest.js --check` green. |
| I5 | Western digits in UI chrome; Arabic-Indic only inside `topic: "numbers"` content — now **enforced** by the linter. |
| I6 | **Never invent Arabic.** Every Arabic string added in Phase B is verified against a cited source (a dictionary, a published beginner corpus, a reference grammar). The linter is a safety net, not the authority — you review the Arabic. |
| I7 | No new `exerciseTypes` kinds, no new step renderers, no UI/nav/CSS changes. New lessons use what exists. |
| I8 | `progress` / learner state is untouched — M20 adds no field and no migration. |
| I9 | The linter **warns** on genuinely ambiguous ḥarakāt / length cases and **hard-fails** only on unambiguous errors (a colloquialism, an Arabic-Indic digit outside numbers, a translit emphatic with no script emphatic, a dangling ref). It must not block authoring on false positives. |

---

## 4. Migration requirements

| # | |
|---|---|
| MIG1 | `build-content.js --check` green on current content after the linter lands — every existing object either passes or is in `content/_lint-allow.json` with a one-line reason. |
| MIG2 | `build-content.js --write-app` still produces a byte-identical `CONTENT` block for the existing objects (the compile is unchanged; only validation is added). Two runs identical. |
| MIG3 | The seeded-RNG byte-compare of the 13 lessons is unchanged. |
| MIG4 | `build-audio-manifest.js --check` green (new A1 audio strings appear in the manifest as TTS targets, same as M13). |
| MIG5 | Reversible — Phase A adds files + validation; reverting restores the pre-M20 build tool. Phase-B content PRs are each independently revertible. |

---

## 5. Acceptance criteria

**Phase A:**
- `build-content.js --lint` runs; every rule in §2.2 has a fixture in `tools/fixtures/` (or inline) that makes it fire, shown in `content/m20-lint-proof.md`.
- The linter run on current content is clean, or every exception is in `_lint-allow.json` with a reason.
- A `content/lessons/*.json` sample lesson compiles into the `lessons` catalog, runs every step in the live browser with 0 console errors, and every Arabic string in it traces to a linted object.
- `content/wordlists/a1.json` exists, ~350 entries, cites its source, groups by topic thread.
- `--check` (structural + lint) green; `--write-app` byte-identical `CONTENT` for existing objects; two runs identical.
- The 13 legacy lessons byte-compare unchanged; audio `--check` green.
- `git diff`: `build-content.js` (+lint, +lesson compile, +wordlist load), `content/wordlists/a1.json`, `content/lessons/<sample>.json`, `content/_lint-allow.json`, the proof + review docs — no runtime `index.html` script changes beyond the additive compiled `lessons` entries.

**Phase B (per batch, not this PR):**
- The batch lints green with no new allow-list entries.
- Every Arabic string is cited.
- The affected A1 curriculum unit runs end to end, 0 console errors.
- `deriveLevel`, review queues, and placement still behave — the new objects flow through them.

---

## 6. Regression re-tests (live browser, each end-to-end)

M6 harakāt · M7 syllables · M8 sentence-reading · M9 unvowelled · M11 grammar-intro · M12 stroke-order + `alphabet-writing-1` byte-identical + `practiceLetterWriting` · M13 audio · M14 (`CONTENT`, `migrateMastered`, 46-card deck) · M15 ("Your skills" panel) · M16 (Learn rebuild, generated lessons, `objectsIntroduced`) · M17 (placement, override, no emission) · M18 (the 4 exercise renderers, `interactionLog` cap, generator wiring) · M19 (scheduler purity, fold idempotency + the same-ms ts fix, the review runner, the queues, the `deriveLevel` graded tier) · lang="ar" a11y · PWA · persistence.

---

## 7. Out of scope

- ❌ A2–C2 content of any kind — **M21**.
- ❌ Converting the 11 legacy generator lessons to JSON — deferred; documented as incremental future work.
- ❌ Any runtime engine change: renderers, `deriveLevel`, the scheduler, the review/placement flows, the nav, CSS.
- ❌ A **complete** ~350-word A1 lexicon and full text corpus in one PR — Phase B is a bounded, reviewed, ongoing operation.
- ❌ Audience adaptation (`child` / `advanced`), dialect content — later; fields stay reserved.
- ❌ A frequency-analysis tool / corpus ingestion — the wordlist is hand-curated from a published source, not computed.
- ❌ Native audio recording — TTS stays the mechanism (M13).
- ❌ Any `progress` / learner-state change.
- ❌ Runtime JSON fetch — the runtime stays buildless (§11 option C).

---

## 8. Open questions

1. **Phase A alone as this milestone's PR, with Phase B as follow-on content PRs?** *Recommend: yes.* It matches the roadmap's own "pipeline proven → then author A1" gate, gives you real review points on the Arabic, and keeps each change small and revertible. The alternative (one giant M20 PR with all of A1) violates the "no AI mountain of Arabic" rule and is unreviewable.
2. **ḥarakāt check — warn or hard-fail?** *Recommend: warn* on ambiguous cases (final position, long-vowel carriers, borrowed words), *hard-fail* only on a clear naked medial cluster. False positives blocking authoring is worse than a missed edge case a reviewer catches.
3. **The A1 word list source.** *Recommend:* a published MSA beginner / frequency list (e.g. Buckwalter–Parkinson frequency dictionary top band, or a standard A1 syllabus word list), cited in the file header. I'll propose the specific source at rollout step 3 for your OK before building the list.
4. **Lesson JSON — do the A1 lessons use `generate` (M16) or explicit `steps`?** *Recommend: explicit `steps`* for authored A1 lessons (full control, linted), with `generate` reserved for quick coverage. The M16 generator stays for the 4 proof lessons.
5. **First Phase-B batch after Phase A merges — grammar or core vocab?** *Recommend: grammar first* (~7 points, small, well-defined, unblocks the reading/text batches which need it), then core-thread vocab.
6. **`_lint-allow.json` — is an allow-list acceptable, or must all current content pass clean?** *Recommend: allow-list permitted* for deliberate cases (unvowelled text fields, proper nouns, the numbers content's Arabic-Indic digits) — each with a reason string the linter prints.
7. **Review gate.** *Recommend: yes* — pause after the linter + wordlist + the sample lesson JSON + `content/m20-lint-proof.md`, before the migration pass over existing content and before any Phase-B authoring.

---

## 9. Rollout

1. Scope approved (this doc).
2. Branch `feature/m20-content-pipeline` off `main` (already created — carries the `ROADMAP.md` bump).
3. Propose the A1 word-list source (Q3) for your OK. Build `content/wordlists/a1.json`. Implement the `--lint` rules with fixtures. Add the `content/lessons/*.json` schema + compiler + one sample lesson. Generate `content/m20-lint-proof.md`. **Pause for sign-off.**
4. Run the linter over all existing content; fix or allow-list; regenerate the proof doc.
5. `build-content.js` + `build-audio-manifest.js` `--check`; full QA (§5 Phase A, §6) — live browser trace of the sample lesson + the 13-lesson byte-compare + independent read-only audit.
6. Draft PR against `main` with this doc + the proof doc. **This PR = Phase A only.**
7. Merge on explicit approval — `--no-ff`, delete branch, verify live.
8. **Then** Phase B: `feature/m20-a1-grammar`, `feature/m20-a1-vocab-core`, … — each a small linted content PR, Arabic cited, reviewed, merged one at a time.
