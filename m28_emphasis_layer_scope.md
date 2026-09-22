# M28 — Emphasis layer (General MSA / Quranic & Islamic / Both)

**Status:** Draft for review — held for approval (ROADMAP standing rule 6). The Unit 01–02 seed data is staged as reviewable files under `content/seed/m28/` and is **not wired into the build**; nothing in `index.html` or `content/*.json` changes in this pass.
**Parent:** [ROADMAP.md](ROADMAP.md) M28. Source of truth: [docs/MASTER_CURRICULUM_SPEC.md](docs/MASTER_CURRICULUM_SPEC.md) v2 (decisions 1–9) plus the 2026-09-22 decisions on role styling, schema fields, and the first seed target.

---

## 1. What this is (and isn't)

A **layer over the existing curriculum**: the learner picks an emphasis (🌍 General MSA, 🕌 Quranic & Islamic, 🔄 Both), content carries an additive tag saying which emphasis it serves, and a two-way Smart Nudge occasionally invites each group to try the other side. Grammar, phonetics, and progression stay shared.

It is **not**:

- a second course or a fork of the curriculum spine;
- a renumbering or re-sequencing of the existing 45 data lessons or the inline A0 lessons;
- server-side content. Supabase (M21.9) stores learner state only. Content stays compiled into `index.html` by `tools/build-content.js`, so the app keeps working offline with zero runtime fetches.

## 2. Why its own milestone

It touches four things at once, which no content batch (`m21bN`) does:

1. **Schema:** additive fields on lexemes, texts, lessons, and exercise items (§4).
2. **Learner state:** a new stored preference, which triggers the migration discipline of standing rule 2.
3. **UI:** a preference control, a nudge card, role styling, and French content rendering. All bounded, none a redesign (M24 stays the redesign).
4. **Content:** new minimal-pair data and five new A0 lessons (§5).

## 3. How the spec maps onto the app

The spec numbers its levels differently from the app. Nothing is renamed; this is the mapping used everywhere below.

| Spec | App | App units |
| --- | --- | --- |
| A1.1 — Foundations & Phonetics (Units 01–04) | **A0** ("Pre-A1") | `a0-u1` … `a0-u4` |
| A1.2 — Functional Syntax (Units 05–07) | A1 | `a1-u*` |
| A2 (Units 08–10) | A2 | `a2-u*` |

- **Spec Unit 01** (alphabet, stroke order, minimal pairs) → `a0-u1`.
- **Spec Unit 02** (short vowels, sukūn and, per the 2026-09-22 decision, syllables) → `a0-u2` + `a0-u3`.
- **Decision 7's "zero metalanguage throughout A1"** therefore covers the app's A0 **and** A1.
- **Script vocabulary is not grammatical metalanguage.** Letter names, fatḥah / kasrah / ḍammah, sukūn and shaddah name what is on the page, and the alphabet cannot be taught without them; the existing A0 lessons already use them. The policy bans grammar terms: case names, iʿrāb roles, "subject", "adjective", "feminine".

## 4. Schema (all additive)

### 4.1 Requested fields → content JSON fields

Every existing content field is camelCase (`strokeOrder`, `markClass`, `audioText`, `objectIds`), and the compiler, the runtime, and 45 lesson files read them that way. The requested fields therefore map to camelCase names. Where the app already has a field for the same thing, that field is reused rather than duplicated.

| Requested | Content JSON | Notes |
| --- | --- | --- |
| `emphasis_tag` | `emphasisTag` | §4.2 |
| `transliteration` | existing `translit` | Already on every lexeme, letter, mark, and syllable. A second field would have to be kept in sync by hand. |
| `audio_key` | `audioKey` | An audio-manifest target id (`words/hom-01`, `grid/ba-fatha`, new `pairs/…`). Optional: when absent, the key is derived exactly as today. |
| `frequency_rank` | `frequencyRank` | `{ "rank": n, "list": "<cited source>" }` or `null`. Never estimated; `null` until a cited list exists. |
| `smart_nudge_config` | `smartNudge` | §4.4 |
| `drill_type` | existing `kind` + new `drillType` | `kind` picks the renderer (`choice`, `build`, …). `drillType` names the teaching purpose (`minimal-pair`, …) for review and analytics. |
| `accepted_orders` | `acceptedOrders` | §4.5 |
| `visual_roles` | `visualRoles` | §4.5, §4.7 |
| `contrast_phonemes` | `contrastPhonemes` | Object ids (`let:ha1`, `mrk:fatha`), not raw glyphs, so results feed each sound's review state. |

The Supabase schema's snake_case columns are unaffected: they hold learner state, not content.

### 4.2 `emphasisTag` and the visibility rule

- Values: `"general"` | `"quranic"` | `"both"`. **Absent means `"both"`**, so all existing content keeps its current behaviour without being edited.
- Carried by: lexemes, texts, minimal pairs, lessons, and lesson steps (a step inherits its lesson's tag unless it sets its own).
- Visibility: an item is shown when `tag == "both"` **or** `preference == "both"` **or** `tag == preference`.
- **Invariant (validator-enforced):** every unit's objectives stay reachable under every preference. A `general` lesson needs a `quranic` or `both` counterpart covering the same objectives, and vice versa.
- Learner preference: `progress.emphasis`, default `"both"`. Existing learners are migrated to `"both"`, which is exactly today's experience. New learners choose during onboarding; everyone can change it later. Ships with a migration function and a before/after check (standing rule 2).

### 4.3 Words

Lexemes gain optional `emphasisTag`, `audioKey`, and `frequencyRank`. Minimal-pair words (§5) use the same fields plus:

- `phoneme`: the object id of the sound that distinguishes the word;
- `lexemeId`: set when the word already exists as a lexeme (تِين → `lex:foo-14`, عَمَل → `lex:wrk-11`);
- `quranic`: `{ "ref": "surah:ayah", "form": "<word as it occurs there>" }` or `null`.

### 4.4 Lessons: `emphasisTag`, `fr`, `smartNudge`

```json
"smartNudge": {
  "rule": "general-to-quranic",
  "trigger": { "on": "lesson-complete" },
  "prompt": "Great job! Would you like to see this pattern in a famous Quranic verse?",
  "fr": { "prompt": "Bravo ! Voulez-vous voir ce modèle dans un verset célèbre du Coran ?" },
  "payload": { "textId": "txt:…" }
}
```

- `rule` sets the audience: `general-to-quranic` is shown only to `general` learners and `quranic-to-general` only to `quranic` learners. `both` learners already see both sides, so they get no nudge.
- `trigger.on`: `lesson-complete`, or `object-mastered` with an `objectId` (the spec's Rule B "mastering a root verb").
- `payload` references an existing object (a text or lexeme). It never carries new inline Arabic, so every nudge's Arabic is reviewed content.
- Proposed cadence ("periodically"): at most one nudge per day, always dismissible, never blocks progress, and a dismissed payload never returns.
- **The Unit 01–02 seed carries no nudges.** The spec's Rule A triggers on a grammar milestone (A1.2 Step 3) and Rule B on mastering a root verb; neither happens in A0. The first nudges land with the A1.2 seed.

### 4.5 Drills

Exercise items gain `drillType`, `contrastPhonemes`, `pairRef` (`{ pairId, heard }`), `audioKey`, `acceptedOrders`, and `visualRoles`.

| Spec drill | `kind` (renderer) | `drillType` | Engine work |
| --- | --- | --- | --- |
| `minimal_pair_discrimination` | `choice` | `minimal-pair` | **None.** `choice` already takes `audioText` + options; verified in the browser (§5.4). |
| `pattern_substitution` | `choice` | `pattern-substitution` | None: the options are whole sentences. |
| `sentence_builder` | `build` (unit `word`) | `sentence-builder` | Small: `build`'s check must accept any order listed in `acceptedOrders`. |
| `reduced_vowel_reading` | new step type | `reduced-vowel-reading` | A renderer. The data exists: `content/texts.json` already carries hand-authored `reduced` forms (M20.5). |

- **`acceptedOrders`** is a list of permutations of token indices. It defaults to `[[0, 1, …, n-1]]`. The validator requires every entry to be a full permutation, with no duplicate entries.
- **`visualRoles`** is a list of `{ "token": i, "role": "doer" | "receiver" | "description" }`.
- **A refinement of spec drill 1.** As written, "select the word containing /ḥ/" can be answered by reading alone, because the right answer always contains ح. The seed instead plays either member of the pair and asks which one was heard, so only listening solves it.

### 4.6 French

- Every learner-facing string gets an `fr` sibling object with the same keys: `title`, `body`, `prompt`, `explanation`, `message`, `finishLabel`, and `blurb` on curriculum nodes. The renderer uses `fr` when the UI language is French and falls back to English per key. Lexemes keep their existing `fr` gloss field.
- **Out of M28:** the app chrome (navigation, buttons, and the hard-coded "Correct! ✓" / "Not quite." in `renderMCQ`). That is a whole-app string-extraction job and deserves its own milestone (proposed M29). Until then a French learner sees French content inside English chrome.

### 4.7 Visual roles (decision 8 + the 2026-09-22 role styling)

| Role | Light theme | Dark theme | Second cue |
| --- | --- | --- | --- |
| Doer | `#065F46` (6.18:1) | `#34D399` (8.47:1) | 2px solid underline |
| Action Receiver | `#075985` (6.08:1) | `#38BDF8` (7.60:1) | 2px dashed underline |
| Description | `var(--gold)` = `#8A5A1F` (4.74:1) | `var(--gold)` = `#D9AC54` (7.74:1) | 2px dotted underline |

- **Ratios** are the worst case across the theme's three backgrounds (`--panel`, `--bg-1`, `--bg-2`); all pass WCAG AA for normal text (4.5:1).
- **Why not the named shades:** `#D97706` measures 2.56:1 on the light theme's `--bg-2`, below even the 3:1 large-text minimum. The mid-tone emerald (`#059669`, 3.03:1) and sky (`#0284C7`, 3.29:1) fail too. The app's own `--gold` token is an amber that passes in both themes, so Description uses it (the "theme accent" option).
- **Implement the underline as `border-bottom` + `padding-bottom`**, as specified, not `text-decoration: underline`, which cuts through the dots under ب ج ي.
- **A1 (and A0):** colour + underline only, no text. **A2:** a pill tag with the role name is added, because a role name is itself metalanguage.
- **B1 continuity:** the existing label engine (M21.6/M21.7) already shows English "doer (fāʿil)" and "object (mafʿūl bih)", so A2's "Doer" and "Action Receiver" lead straight into it.
- **Final values** are confirmed by `node tools/a11y-audit.js` in both themes during implementation.

## 5. Seed data — Units 01–02 (this pass)

### 5.1 Files (`content/seed/m28/`)

| File | Contents |
| --- | --- |
| `minimal-pairs.json` | All 11 pairs from spec §4 (22 words) as a new `minimal-pair` object kind (`mp:` ids), with translit, EN/FR glosses, `emphasisTag`, `audioKey`, `frequencyRank: null`, and `quranic` refs for 18 of the 22 words. |
| `proposed-objects.json` | `mrk:hamza`. The ع/ء contrast needs a learning object for the hamza sound, and none exists (hamza appears only in the M20.9 alif diagram caption). |
| `letter-tracing.json` | All 28 letters: stroke geometry referenced from `content/letters.json` (M12), not copied; dots as structured `{ count, position }`, transcribed from `index.html`'s `LETTER_DOT_NOTES` and checked against it by the generator; phases Watch → Trace → Write. |
| `curriculum-nodes.json` | 5 curriculum nodes, appended after each unit's existing lessons. No existing node is renumbered. |
| `lessons/*.json` | 5 data lessons in the exact `content/lessons/` format, plus the additive fields above. |

### 5.2 Lessons

| Lesson | Unit (order) | Drills | Tracing | Focus |
| --- | --- | --- | --- | --- |
| `a0-sounds-throat` | `a0-u1` (5) | 8 | ح ع | ح/ه, ع/ء |
| `a0-sounds-heavy` | `a0-u1` (6) | 10 | ص ط | ص/س, ط/ت, ض/د |
| `a0-sounds-back` | `a0-u1` (7) | 4 + 6 mixed review | ق ك | ق/ك, then every Unit 01 contrast |
| `a0-hear-short-vowels` | `a0-u2` (3) | 6 + 4 | — | fatḥah / kasrah / ḍammah; open vs sukūn-closed |
| `a0-hear-long-and-short` | `a0-u3` (3) | 6 + 8 | — | short vs long; word-level pairs |

That is 52 drills and 6 tracing steps. Each lesson has 8–14 drills, the 3–5-minute micro-lesson size.

### 5.3 Teaching decisions in the seed

1. **Unit 01 answers are letters, not words.** At `a0-u1` learners know the letter shapes but cannot yet read vowelled words, so they hear a word and pick its first letter. Choosing whole words starts in `a0-u3`.
2. **Written word pairs use only what has been taught.** The `a0-u3` word-choice drills use the four pairs spelled with short vowels and sukūn alone: حَرَم/هَرَم, قَلْب/كَلْب, عَمَل/أَمَل, عَلِمَ/أَلِمَ. Pairs needing long vowels (صَارَ/سَارَ, قَالَ/كَالَ, …) or shaddah (حَبَّ/هَبَّ, ضَلَّ/دَلَّ) are drilled by ear in Unit 01 and move to written form with the Unit 03 seed. The generator enforces this.
3. **All 11 §4 pairs are used,** not only the four corrected ones, so every contrast in the spec, including ع/ء, ط/ت and ض/د, has drills.
4. **Each pair is heard both ways.** The correct option's position varies: it comes first in 23 of the 52 items.
5. **Existing objects are reused throughout:** letters, marks and syllables as objectives; manifest audio keys (`grid/…`, `syllables/…`, `words/foo-14`, `words/wrk-11`); M12's stroke geometry. The only new objects are the pairs and `mrk:hamza`.
6. **Emphasis in a shared unit.** Everything is tagged `both` (spec: A1.1 is shared). The Quranic emphasis shows up as context: after an answer, `quranic` and `both` learners see where the word occurs in the Quran (e.g. تِين → وَالتِّينِ, 95:1).
7. **Copy follows §3's rule.** There are no grammar terms; sounds are described physically ("tighten your throat", "pull the back of your tongue up and back").
8. **Every explanation step says the audio is synthesized.** It tells learners that some device voices blur these sounds and to replay them.

### 5.4 Verification done

- **Generator checks** (`tools/m28-seed-generator.py`, which writes every file in `content/seed/m28/` and exits non-zero on any failure): every object id and audio key resolves; every Arabic word carries ḥarakāt; each item has exactly one correct option; the heard word matches its pair member; all 22 pair members are heard in Unit 01; the word-level readability rule holds; the dots match `LETTER_DOT_NOTES`.
- **Drop-in build test:** on a clean export of `main` at `21f3117` (after batch 27) with the seed added (lessons, nodes, `mrk:hamza`), `node tools/build-content.js` passes with 0 errors (83 curriculum lessons, 50 data lessons; 78 and 45 without the seed), and `--lint` output is identical to the baseline.
- **Browser smoke test** on that compiled copy:
  - `a0-sounds-throat` loads, and its first drill shows Listen / Slower / "Synthesized", RTL `lang="ar"` answer buttons, and the explanation as feedback.
  - The answer is logged as `{ objectId: "let:ha1", skill: "listening", correct: true }`.
  - The `trace-letter` steps fail as expected ("Cannot read properties of undefined"). They carry `letterId`, which the build must turn into the letter object and its strokes (§6).
- **Not done yet:** `npm run qa` and `node tools/a11y-audit.js`, because the seed isn't wired in.

### 5.5 Needs human review before merge

- **Quranic refs** (`ref` + exact `form`): each must be checked against a muṣḥaf (standing rule 1).
- **French strings:** drafted by Claude; they need a native-speaker read.
- **Standing rule "AI-generated curriculum content → never."** This seed was drafted by Claude, but every Arabic word comes from your reviewed spec or from existing app objects, and nothing merges without your review.

## 6. Implementation plan (after approval)

1. **`tools/build-content.js`:**
   - add the `minimal-pair` kind (`content/minimal-pairs.json`) and `mrk:hamza`;
   - validate `emphasisTag` and the reachability invariant;
   - turn `trace-letter` `letterId` into the letter object and its strokes;
   - validate `acceptedOrders`, `drillType`, and `fr` objects.
2. **Move the seed into place:** lessons → `content/lessons/`, nodes → `curriculum.json`, `dots` → `letters.json`, then generate `LETTER_DOT_NOTES` from `letters.json`.
3. **`index.html`:**
   - preference control + `progress.emphasis` migration;
   - visibility filter;
   - the Quranic-occurrence line after pair answers;
   - `fr` rendering;
   - role CSS tokens;
   - nudge card;
   - `acceptedOrders` in `build`;
   - a larger option style for single-letter answers (at the current 21px, ه is small).
4. **Audio manifest:** add the `pairs/…` targets as **tier 1**. These are the recordings where synthesized audio hurts most.
5. **QA:** `npm run content:check`, `npm run qa` and `node tools/a11y-audit.js` all clean, including the harness's lang/dir check on the new strings.

## 7. Invariants

- Existing lessons, curriculum nodes and their orders are unchanged.
- `buildAudioControl()` / `playArabicAudio()` are untouched.
- Zero runtime dependencies, zero runtime fetches.
- `content/*.json` changes are additive only.
- With the default `"both"` preference, the app behaves exactly as before M28.

## 8. Acceptance criteria

1. With `progress.emphasis = "both"`, the existing QA battery passes unchanged.
2. The validator proves every unit completable under each preference.
3. All 5 seed lessons run end to end, including tracing, and each drill logs an interaction on the phoneme actually heard.
4. The role colours pass `tools/a11y-audit.js` in both themes.
5. Every seed string has an `fr` counterpart, and a French UI setting shows them.

## 9. Risks

- **Synthesized audio for minimal pairs.** These drills only work if the device voice actually produces the contrast. Some voices blur ح/ه or ص/س, and some devices (commonly Linux desktops) have no Arabic voice at all. Mitigations:
  - make the `pairs/…` keys tier-1 recording targets;
  - keep the on-screen audio note;
  - consider not featuring these lessons prominently until recorded or M15.6 AI-voice audio exists.
- **Level mapping confusion.** Spec "A1.1" is the app's A0. §3 is the reference for this; unit titles in the spec are author-facing only.

## 10. Open decisions

1. **The "topic" of a sentence without a verb** (هذا كتابٌ, أنا طالبٌ) isn't a Doer. Options: (a) same green + solid styling, with a "Topic" pill at A2; (b) no pill on topics. I recommend (a).
2. **French app chrome:** confirm it is its own milestone (proposed M29).
3. **Nudge cadence:** confirm the proposed defaults in §4.4.
4. **Missing contrast:** the A0 listening descriptor lists ذ/ز/ظ, but spec §4 has no pair for it. Should we source real pairs (checked against a reference) for the next seed?
5. **Next seed:** Unit 03 (long vowels, shaddah, tanwīn, and the written form of the remaining seven pairs)?
