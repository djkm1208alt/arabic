# M14 Scope: Learning-Object Core & Vocabulary Unification

**Status:** Draft for review. **No code written.** Do not begin implementation until this is approved.

**Parent design:** [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) — all 7 decisions in §16 are approved as stated. M14 executes §14 migration steps 1–2 and nothing else.

**One-line summary:** Collapse the two vocabulary systems into one `lexemes` table, wrap the other content arrays as typed learning objects, move that data into `content/*.json` compiled by a dev-time tool — as a **pure, behaviour-preserving refactor**. No UI change, no new content, no new lessons.

---

## 1. Why M14 exists

The app has two vocabulary systems (`flashcards` — 46, powers Flashcards/Quiz/Alphabet examples; `vocabulary` — 155, powers only the Word Bank), two category taxonomies, and every other content array (`arabicAlphabet`, `HARAKAT`, syllables, `grammarExamples`, `readingPassages`) is an isolated silo with no shared identity. Until content is **typed learning objects with stable ids, defined once**, nothing in the curriculum architecture (skills, levels, the learning graph, review, placement) can be built.

M14 builds that foundation and **only** that foundation.

---

## 2. What M14 delivers

### 2.1 One `lexemes` table

`flashcards` (46) + `vocabulary` (155) → a single `lexemes` table (~162 entries after dedup).

- **Dedup by Arabic.** The 39 legacy flashcards that duplicate a Word Bank entry (exact, then NFC-normalised Arabic match) **merge into the existing lexeme**. The 7 that don't (طَعَام, سَيَّارَة, عَائِلَة, أَهْلًا وَسَهْلًا, كَيْفَ حَالُك؟, اِسْمِي…, تَشَرَّفْنَا) become new lexemes.
- **`french` is preserved** on every merged/new lexeme (real functionality, not curriculum positioning — same call as the branding cleanup). Lexemes with no french value carry none; consumers hide the field when empty.
- **Every merge is recorded** in a generated `content/lexemes.merge-report.md`: legacy id → target lexeme id, match basis (exact / normalised / manual), any ḥarakāt-or-form difference flagged for a human decision. No silent merges.
- **Lexeme id scheme:** `lex:<slug>` from the transliteration, disambiguated by a counter on collision (the same collision the M13 audio work found — `sabʿah` / `ṣabāḥ`). Stable once assigned.

### 2.2 Typed learning objects

Each existing content array is wrapped as objects with the shared shape from CURRICULUM_ARCHITECTURE.md §3.1 (`id`, `kind`, `labels`, `level`, `skills`, `tags`, `prereqs`, `audio`, `notes`) plus a `kind`-specific payload:

| Table | `kind` | Count | Source | Payload |
|---|---|---|---|---|
| `LEXEMES` | `lexeme` | ~162 | `flashcards` + `vocabulary` | `pos`, `gender?`, `plural?`, `root?` (only where already known), `example?`, `french?`, `frequencyBand?`, `register?`, `tags` (incl. `legacy-flashcard` on the original 46) |
| `LETTERS` | `letter` | 28 | `arabicAlphabet` + `strokeOrderData` | four positional forms, `connects`, name, sound, `strokeOrder` (M12 data, unchanged) |
| `MARKS` | `mark` | ~10 | `HARAKAT` (3) + `TANWIN` (3) + `MADD_PATTERNS` (3) + `SUKUN_MARK` | symbol, function text, `markClass` (short-vowel / long-vowel / sukūn / shaddah / tanwīn) |
| `SYLLABLES` | `syllable` | ~30 | `cvvSyllables` + `cvcSyllables` + `geminatedSyllables` | `shape` (CV/CVV/CVC/geminated), constituent letter+mark ids, `exampleWord` → lexeme id |
| `GRAMMAR_POINTS` | `grammar` | 3 (stub) | `grammarExamples` `concept` values | rule statement (from the existing M11 lesson copy), contrast pairs (already in the lesson), `commonErrors: []` (empty — filled M18/M21) |
| `TEXTS` | `text` | 8 | `readingPassages` (3) + `grammarExamples` sentences (5) | `vowelled` / `reduced` / `unvowelled` forms, `words[]` → lexeme ids, translation, `audio`, `textType` (`sentence`) |

`kind: "morphology"` and `kind: "collocation"` are **defined in the schema but have zero instances in M14** — reserved for later milestones.

### 2.3 Content moves to `content/*.json`, compiled by a dev-time tool

Approved decision #1 (dev-time compilation). M14 introduces the **minimal** version:

- **`content/`** directory: `lexemes.json`, `letters.json`, `marks.json`, `syllables.json`, `grammar.json`, `texts.json`, `_legacy-id-map.json`.
- **`tools/build-content.js`** — zero-dependency Node, mirroring `tools/build-audio-manifest.js` exactly:
  - reads `content/*.json`, **validates** (JSON well-formed; ids namespaced + globally unique; every `prereqs` / word-ref / `exampleWord` id resolves; no prereq cycles; both Arabic and transliteration present on every object that needs them; `legacy-id-map` covers all 46),
  - emits a generated data block into `index.html` between `AUTO-GENERATED` markers,
  - flags: bare run = regenerate + `content/lexemes.merge-report.md`; `--check` = fail on staleness (CI/pre-commit); `--write-app` = splice into `index.html`.
  - deterministic — running twice is byte-identical; line-ending-agnostic (the M13 `.gitattributes` already covers this).
- **The full linguistic linter, lazy-loading, and content authoring at scale are M20.** M14's tool does structural + referential validation only.

### 2.4 `index.html` — the derived-view adapters

The existing consts stay, but become **thin derived views over the object tables**, so every current consumer and builder function keeps working with zero changes to their code:

```
const flashcards      = LEXEMES.filter(l => l.tags.includes("legacy-flashcard")).map(toLegacyFlashcardShape);
const vocabulary      = LEXEMES.map(toWordBankShape);
const arabicAlphabet  = LETTERS.map(toAlphabetShape);
const HARAKAT         = MARKS.filter(m => m.markClass === "short-vowel").map(toHarakahShape);   // still exactly 3
const readingPassages = TEXTS.filter(t => t.source === "m8").map(toPassageShape);
const grammarExamples = TEXTS.filter(t => t.source === "m11").map(toGrammarExampleShape);
// cvvSyllables / cvcSyllables / geminatedSyllables similarly
```

`HARAKAT` stays **exactly 3 entries** (the frozen invariant since M6). `strokeOrderData` is unchanged. Builder functions (`buildSyllableGroupStep`, `buildGrammarPracticeStep`, `sentenceWord`, `vocabWord`, …) are untouched — they read the same-shaped derived arrays.

### 2.5 `loadProgress()` — one-time `mastered` migration

`progress.mastered` currently holds numeric flashcard ids (1–46). On load:

```
mastered = mastered.map(id => LEGACY_FLASHCARD_ID[id] ?? id)   // numeric → lexeme id
                    .filter(unique)
```

- Idempotent: running twice is a no-op (lexeme ids don't match the legacy map).
- Lossless: an id not in the map (corrupt / from a future version) is **kept**, not dropped.
- The `progress` localStorage key name and every other field are unchanged.

### 2.6 One taxonomy

The 15-category set (`VOCAB_CATEGORIES`) becomes canonical (call it `TOPICS`). The legacy 7-category `categories` list is removed. Mapping applied to the 46 legacy lexemes:

| legacy | → unified |
|---|---|
| greetings | greetings |
| objects | objects |
| food | food |
| time | time |
| numbers | numbers |
| family | **people** |

Chip rows and the Progress-view breakdown become **data-driven over non-empty topics** (see §6, open question 2 for the alternative).

### 2.7 Docs

- `m14_learning_object_core_scope.md` (this file).
- `content/lexemes.merge-report.md` (generated).
- CURRICULUM_ARCHITECTURE.md §14 gets an "M14: ✅" annotation on steps 1–2.

---

## 3. Invariants — what M14 must NOT change

| # | Invariant | How it's held |
|---|---|---|
| I1 | **Every M1–M13 lesson runs identically** — same steps, same order, same rendering, same completion behaviour. | Builder functions read same-shaped derived arrays. |
| I2 | **The step engine is untouched** — `stepRenderers`, the 9 step types, `startLesson`, the lesson runner, `renderLessonStep`, the mid-lesson-reload guard. | No edits to any of it. |
| I3 | **The M13 audio layer is untouched** — `playArabicAudio`, `resolveRecordedAudio`, `RECORDED_AUDIO_MANIFEST`, `RECORDED_AUDIO_ENABLED`, the TTS fallback. | Lexeme Arabic forms preserve the exact strings the manifest keys on; `build-audio-manifest.js --check` stays green (re-run after lexeme forms settle). |
| I4 | **`HARAKAT` is exactly 3 entries.** | Derived by filter; asserted in build validation. |
| I5 | **`strokeOrderData` unchanged**; `alphabet-writing-1` byte-identical behaviour (M12 invariant); the PR #6 `practiceLetterWriting` button still jumps to the right letter. | Stroke data carried verbatim into `LETTERS`. |
| I6 | **Flashcards view: same 46-card deck, same modes (flash/quiz/wordbank), same render, same "I know this" behaviour.** | `flashcards` derived view = the `legacy-flashcard`-tagged lexemes. |
| I7 | **Vocabulary Quiz: same pool, same scoring, `quizBest` persists.** | Quiz reads the same derived `flashcards`. |
| I8 | **`progress` localStorage key name + shape unchanged**; streak, `lessonsCompleted`, `practiceLessonsCompleted`, `dailyGoal`, `dailyProgress`, `quizBest` all persist across a real reload from any M1–M13 version. | Only `mastered` *values* are migrated, in place, idempotently. |
| I9 | **No runtime dependency, no runtime fetch, no framework, no build step at runtime, no new CSS rule.** | `build-content.js` is dev-time only and never referenced by the app; data ships inline as before. |
| I10 | **The shipped `index.html` stays a single self-contained file.** | Compiled block is spliced in, same as M13's manifest. |
| I11 | **Western digits in UI; Arabic-Indic (٠–٩) only in taught content.** M14 adds no taught number content, so **zero Arabic-Indic digits anywhere**. | Node codepoint scan in QA. |
| I12 | **No new views, no nav change, no route change.** | `VIEW_IDS` untouched. |
| I13 | **`build-audio-manifest.js` still runs and `--check` is clean** on the post-M14 file. | Regenerate + verify in QA. |

---

## 4. Migration requirements

| # | Requirement |
|---|---|
| MIG1 | **Vocabulary dedup** — match each of the 46 legacy flashcards to a `vocabulary` entry by exact Arabic, then NFC-normalised Arabic. Record every decision in `content/lexemes.merge-report.md` with match basis. Any ḥarakāt / form / gloss discrepancy between a merged pair is **flagged in the report for a human decision before the merge is finalised** — not auto-resolved. |
| MIG2 | **`french` carry-over** — the merged lexeme keeps the flashcard's `french`; new lexemes keep theirs; existing Word Bank lexemes gain `french` only where a merge supplies it. No french is invented. |
| MIG3 | **Legacy id map** — `_legacy-id-map.json`: every numeric flashcard id 1–46 → its lexeme id. Stable, committed, validated complete by the build tool. |
| MIG4 | **`progress.mastered` migration** — on load, numeric → lexeme id via the map, dedupe, idempotent, lossless (unknown ids kept). Tested against a real pre-M14 localStorage blob. |
| MIG5 | **Category remap** — the 6 legacy categories → unified per §2.6; documented; applied only to the 46 legacy lexemes (Word Bank lexemes already use the 15-set). |
| MIG6 | **Audio manifest** — after lexeme Arabic forms are final, run `tools/build-audio-manifest.js --write-app`; `RECORDED_AUDIO_MANIFEST` regenerates against lexeme Arabic (the manifest is keyed by Arabic string, so stable forms = stable manifest); `--check` green. |
| MIG7 | **Backward-compatible load** — a `progress` blob from *any* M1–M13 version loads without error and without losing streak / lessons / mastery / goal / quizBest. |
| MIG8 | **Reversibility** — M14 is one squashed commit on `feature/m14-learning-object-core`; reverting it restores the exact pre-M14 `index.html` behaviour (the derived views reproduce the old arrays 1:1). |

---

## 5. Acceptance criteria

**Build tooling**
- `node tools/build-content.js --check` passes; two consecutive runs produce byte-identical output (deterministic).
- Build validation **fails loudly** on: a duplicate id, an unresolved `prereqs`/word-ref, a prereq cycle, a lexeme missing Arabic or transliteration, an incomplete legacy-id map. (Verified by deliberately breaking each, then reverting.)
- `node tools/build-audio-manifest.js --check` passes on the rebuilt `index.html`.

**Data model**
- `LEXEMES`, `LETTERS`, `MARKS`, `SYLLABLES`, `GRAMMAR_POINTS`, `TEXTS` all present in the running app; ids namespaced (`lex:` / `let:` / `mrk:` / `syl:` / `gr:` / `txt:`) and globally unique.
- `LEXEMES.length` ≈ 162; `LETTERS.length` === 28; `HARAKAT` (derived) length === 3; every `TEXTS[].words[]` entry resolves to a real lexeme.
- Every legacy flashcard id 1–46 resolves through `_legacy-id-map` to a lexeme.

**Behaviour preserved (live browser trace, not source reading)**
- All 11 lessons: every step renders, zero console errors.
- Flashcards: 46-card deck; flip, "I know this ✓" / "Still learning", deck reorder (unmastered first); mastery count on Home matches.
- Vocabulary Quiz: runs to completion, scores, `quizBest` updates and persists.
- Word Bank: lists unified lexemes; the 7 formerly-flashcard-only words appear; detail panel, 🔊, example, plural all render.
- Alphabet: 28 letters, four forms, non-connector notes, example word + 🔊 (see open question 2 for input-set scope).
- Progress view: category breakdown renders; practice-lesson breakdown unchanged; streak/goal unchanged.

**Persistence**
- A hand-crafted pre-M14 `progress` blob (numeric `mastered`, real streak, completed lessons) → loads, mastery preserved as lexeme ids, count unchanged, no error. Re-running the migration (reload again) changes nothing.

**Non-regression surface**
- 320 / 375 / 390 / desktop: no horizontal page overflow.
- Dark mode: intact.
- 0 Arabic-Indic numerals in rendered UI (Node `codePointAt` scan, not shell grep — per the M13 lesson).
- `git diff index.html`: only (a) the generated `AUTO-GENERATED` content block, (b) the derived-view adapter consts, (c) the `loadProgress` migration, (d) the taxonomy const change. No unrelated edits, no CSS, no view code.

---

## 6. Regression requirements — explicit re-tests

Each run end-to-end in a live browser:

| Milestone | Re-test |
|---|---|
| M6 | `harakat-intro` (19 steps) — all marks render, examples pulled from real lexemes, audio buttons work |
| M7 | `syllables-intro` (19) — CVV/CVC/geminated steps, example words resolve |
| M8 | `sentence-reading` (13) — decode / listen / read-aloud per sentence; `TEXTS` word-refs resolve |
| M9 | `unvowelled-reading` (11) — reduced + unvowelled forms derive correctly from `TEXTS` |
| M11 | `grammar-intro` (15) — 3 concepts, contrast pairs, `GRAMMAR_POINTS` referenced; 5 grammar sentences render |
| M12 | `stroke-order-writing` (30) + `alphabet-writing-1` (30) byte-identical; `practiceLetterWriting` button (PR #6) jumps to the correct letter |
| M13 | `RECORDED_AUDIO_ENABLED` still `false`; every 🔊 → TTS; **zero `Audio()` objects created**; `resolveRecordedAudio` returns null; `--check` green |
| PWA | service worker still caches shell + fonts only; no new fetch introduced |
| Persistence | streak increments once/day; daily goal counts; `lessonsCompleted` + `practiceLessonsCompleted` persist; mid-lesson reload → safe bounce to Home |

---

## 7. Out of scope — do not let later milestones creep in

**Explicitly NOT in M14** (milestone that owns it in brackets):

- ❌ `skills` model, `levels` model, A0–C2 competency descriptors, `deriveLevel()`, per-strand progress — **M15**
- ❌ Real `curriculum` tree, Learn-view rebuild, "enter where you fit", lesson `objectives` + the generator template — **M16**
- ❌ Placement / diagnostics — **M17**
- ❌ Exercise-type registry, `match` / `order` / `cloze` / `build-word` / `build-sentence` / `dictation` / `transform` — **M18**
- ❌ `InteractionEvent`, `ReviewState`, SM-2-lite scheduler, mistake log, review queues, correcting the "spaced repetition" wording — **M19**
- ❌ Full content build pipeline (linguistic linter, lazy-load, large-scale authoring), first full-level (A1) content — **M20**
- ❌ Grammar / morphology / numbers curriculum content — **M21+**
- ❌ Accounts, cross-device sync, any backend — **M22**
- ❌ Subscriptions — **M23**
- ❌ **Any new Arabic content** — no new lexemes (beyond surfacing the 7 that already exist in the legacy deck), no new sentences, no new lessons, no new grammar copy. `GRAMMAR_POINTS` are stubs from existing M11 text.
- ❌ **`morphology` and `collocation` instances** — the `kind`s are reserved in the schema; zero objects authored. (`root` may be recorded on a lexeme *only* where it's already unambiguous, e.g. from an existing note — never derived or guessed.)
- ❌ **Flashcard deck recomposition / "starter deck" concept** — **M16**
- ❌ **Widening Flashcards / Quiz / Alphabet-example / Progress-breakdown input sets** to the full lexeme table — each stays frozen to its current 46-word scope; widening is deferred to the milestone that owns each view
- ❌ **Any UI, CSS, layout, nav, routing, or copy change** beyond the unavoidable taxonomy-driven chip list (open question 2)
- ❌ Transliteration scheme change (approved: keep ALA-LC-ish)
- ❌ `french` removal or the roadmap/positioning copy (unchanged)

---

## 8. Open questions for you

1. **Build tool in M14, or defer to M20?**
   *Recommend: minimal `build-content.js` in M14.* Without it, M14's object data lands as a hand-maintained literal block that M20 must then migrate — rework that violates "smallest coherent foundation" in spirit. The minimal tool mirrors `build-audio-manifest.js` exactly (structural + referential validation only; linguistic linter is M20). *Alternative:* M14 ships the object tables as one organised literal block between markers, and the tool arrives in M20.

2. **The one unavoidable visible effect — chip lists.**
   The Flashcards chip row and the Progress-view category breakdown currently show the **7** legacy categories. After unification they'd be **data-driven over non-empty unified topics** (~6–8 chips, `family` → `people`). Options:
   (a) *Recommend:* data-driven — same component, same styling, list sourced from unified data;
   (b) freeze the Flashcards/Progress chip lists to exactly the current 7 via an explicit allowlist (zero visible change, tiny bit of retained legacy config).

3. **Alphabet example words + Word Bank contents.**
   `findExampleWord(letter)` searches the legacy 46 today. Word Bank shows the 155.
   (a) *Recommend:* Alphabet example search stays scoped to the 46 (frozen); Word Bank shows all ~162 (the 7 formerly-flashcard-only words are real vocabulary and belong there — an additive, non-breaking change).
   (b) Freeze Word Bank to exactly 155 too (filter out the 7 until M16).

4. **`GRAMMAR_POINTS` granularity in M14.**
   *Recommend: stubs* — id, labels, level, the contrast pairs already written in the M11 lesson, empty `commonErrors`. Fuller rule content is M18/M21. Confirm, or specify a richer M14 shape.

5. **Merge-report review gate.**
   The `lexemes.merge-report.md` will list ~39 merges. *Recommend:* implementation pauses after the report is generated for your sign-off on the merge list before the derived views are wired — so a bad merge can't slip through. Confirm you want that checkpoint.

---

## 9. Rollout

1. Scope approved (this doc).
2. Branch `feature/m14-learning-object-core` off `main`.
3. Author `content/*.json` from existing data; generate `lexemes.merge-report.md`; **pause for merge-list sign-off** (open question 5).
4. Build `tools/build-content.js`; `--write-app` the generated block.
5. Wire derived-view adapters; `loadProgress` migration; taxonomy const.
6. Regenerate `RECORDED_AUDIO_MANIFEST`; `--check` both tools.
7. Full QA pass (§5, §6) — live browser trace, independent read-only audit.
8. Draft PR against `main` with this doc + the merge report.
9. Merge on your explicit approval — squashed to one commit, `--no-ff`, delete branch, confirm clean tree, report new HEAD.
