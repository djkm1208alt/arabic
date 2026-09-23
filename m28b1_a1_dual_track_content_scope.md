# M28-B1 — First dual-track A1 content batch

**Status:** Approved 2026-09-22; **built** 2026-09-22/23 in four commits on branch `claude/m28b1-a1-dual-track-scope` (vocabulary + payload selector; drills lesson with per-track `variants`; greetings dialogues; Smart Nudges + role-annotated example). Decisions taken: `fill_in_blank`→`cloze`; Quranic text objects authored (one verse, `txt:quran-buruj-21-22`, **verified against a muṣḥaf by the user, 2026-09-23**); A2 deferred to `m28b2`. `acceptedOrders`'s multi-order demo also deferred to `m28b2` (A1 is verbless, so word-order variation is an A2 topic; the engine itself is fixture-tested). The user reviewed the flagged linguistic items (2026-09-23). Per the user's call, core everyday vocab (مسجد، سوق، مدرسة، مكتب، صديق، سافر) is tagged `both` so it reaches every learner; only distinctly devotional words (جنة، محراب، مؤمن/ة، رسول، صلى) stay `quranic`-emphasis.
**Parent:** [ROADMAP.md](ROADMAP.md) M28 · uses the machinery from [m28_implementation_scope.md](m28_implementation_scope.md) (M28.1 seed pipeline, M28.2 emphasis state/selector/visibility/Quranic line, M28.3 role styling + `acceptedOrders`). Source material: [docs/EXPANDED_DUAL_TRACK_CONTENT_A1_A2.md](docs/EXPANDED_DUAL_TRACK_CONTENT_A1_A2.md) and [docs/MASTER_CURRICULUM_SPEC.md](docs/MASTER_CURRICULUM_SPEC.md) (A1.2, Units 05–07).

---

## 1. What this is

The **first real dual-track content batch** — the content that finally exercises the emphasis machinery end to end: the visibility filter, the reachability invariant, the Quranic-occurrence line, the Smart Nudge, role styling, and `acceptedOrders`. It sits on the app's existing **A1** spine (spec A1.2 = app A1) and establishes the authoring patterns every later dual-track batch repeats.

Everything shipped since M28.1 has been machinery with all content tagged `both`; this batch introduces the **first `general`-only and `quranic`-only content**, so it is also the first real test that a learner on any single emphasis can still complete every unit.

## 2. Scope boundary

**In:** app level **A1** (units `a1-u1` … `a1-u4`), covering the spec's A1.2 functional syntax — demonstratives, pronouns + nominal sentences, definiteness & adjective agreement, iḍāfa/possession — plus the A1-level vocabulary, two micro-dialogues, drills, nudges, and role-annotated examples from the pack that fit here.

**Out (later batches):** A2 (spec Units 08–10, and the pack's A2 material); the A0 units (done in M28.1); French UI chrome (M29); any new exercise *engine* work beyond a possible `fill_in_blank` decision (§5).

## 3. Source & provenance (standing rule 1)

The pack in `docs/EXPANDED_DUAL_TRACK_CONTENT_A1_A2.md` was **AI-drafted**. Nothing from it enters `content/` unverified:

- Every Arabic string is checked for spelling, ḥarakāt, grammar, transliteration, meaning, and A1-level fit against a real reference before it compiles.
- Every Quranic reference (the nudge payloads, the minimal-pair `quranic` fields already merged, any new Quranic example) is checked against a muṣḥaf — surah:ayah and the exact word form.
- French glosses are drafted here but stay **provisional** until the M29 native-speaker pass; they never block this batch.
- The pack supplies *candidate* words and the *shape* of examples; final example sentences are authored from the app's own leveled lexicon (the rule every M20/M21 batch followed).

## 4. Content deliverables

### 4.1 Vocabulary

- **21 pack words already exist as lexemes** — reuse their ids and add `emphasisTag` where the pack marks a track (e.g. مَسْجِد `lex:pla-04` → `quranic`, سُوق `lex:pla-07` → `general`, بَيْت `lex:hom-01` → `both`). Additive; no id churn. (Full existing set: بيت, مسجد, مدرسة, سوق, أرض, سماء, مكتب, أب, أم, أخ, أخت, صديق, جار, قرأ, سمع, سافر, كبير, صغير, قريب, بعيد, جديد.)
- **~14 new lexemes to author + verify**, mostly Quranic-track: جَنَّة, مِحْرَاب, وَالِد, وَالِدَة, مُؤْمِن, مُؤْمِنَة, رَسُول, طَلَبَ/يَطْلُبُ, دَخَلَ/يَدْخُلُ, صَلَّى/يُصَلِّي, ذَكَرَ/يَذْكُرُ, كَرِيم, صَادِق, مُبَارَك. Each gets `emphasisTag`, `translit`, EN + (provisional) FR, level A1, and — where the pack cites it — a `quranic` example reference (verified).

### 4.2 The emphasis split — and how reachability is guaranteed

The invariant (M28 §4.2): **every unit's objectives stay reachable under every preference.** The safe, simple way to honour it at A1 — and the design this batch adopts:

- **Objectives and grammar stay `both`.** A lesson's *objectives* (the letters/lexemes/grammar it teaches) are never gated by emphasis. The lesson itself is `both`.
- **Emphasis tags the *payload*, not the lesson** — which example sentence, which vocabulary set, which drill context a learner sees *within* a `both` lesson. A `general` learner sees the general example; a `quranic` learner the Quranic one; `both` sees both.
- So no objective is ever stranded, and the validator's reachability check passes by construction. This is stricter than the general schema (which allows whole-lesson gating) and is the recommended A1 pattern; whole-lesson `general`/`quranic` splits, if ever needed, come with a paired counterpart.

This makes example **selection** emphasis-aware. Concretely, an example-set / reading-practice / drill step gains an optional `variants: { general: <payload>, quranic: <payload> }` (or per-item `emphasisTag`), and the renderer picks by `getEmphasis()`, falling back to a `both` default. **This selection logic is the one small runtime addition this batch needs** (M28.2 shipped the filter for *listing*, not per-example variant selection) — scoped here, built with the content.

### 4.3 Drills (pack §3 → real schema)

| Pack `type` | App `kind` + `drillType` | Notes |
| --- | --- | --- |
| `pattern_substitution` | `choice` + `pattern-substitution` | Options are whole sentences; the base/cue shown, distractors as authored. Already how the spec drill maps. |
| `sentence_builder` | `build` (unit `word`) + `sentence-builder` | Uses M28.3 `acceptedOrders` so nominal + verbal order both grade correct. |
| `fill_in_blank` | **decision (§5)** — `cloze`, or `choice` with the sentence as prompt | No `fill_in_blank` kind exists; `cloze` is the closest. |

All drill Arabic authored from the leveled lexicon; `track` → `emphasisTag`.

### 4.4 Micro-dialogues (pack §2)

Two dialogues (greetings/identity), a `general` and a `quranic` variant, authored as `text` objects (`source:"m20"`) and surfaced through existing `reading-practice` / `listen-repeat` steps. Verified; the Quranic variant's devotional phrases (إِنْ شَاءَ اللهُ, جَزَاكَ اللهُ خَيْراً) checked for correctness and A1 fit.

### 4.5 Smart Nudges (M28.2 `smartNudge`, first real use)

- **Rule A (general → quranic):** on completing the adjective-agreement milestone, invite the general learner to see the pattern in a Quranic verse. The spec cites Sūrah al-Burūj 85:21–22 (بَلْ هُوَ قُرْآنٌ مَجِيدٌ · فِي لَوْحٍ مَحْفُوظٍ). **This payload needs a new, muṣḥaf-verified `text` object** — no Quranic text objects exist yet (§6, open decision).
- **Rule B (quranic → general):** on mastering the root ك-ت-ب, show the general learner's everyday use ("I am writing an email"). Payload references existing كتب-family lexemes/texts.
- Cadence per M28.2: ≤ 1/day, dismissible, never returns once dismissed, payload is an existing (verified) object.

### 4.6 Role-annotated examples (M28.3 `renderRolePattern`, first real use)

Add `visualRoles` to one or two demonstrative/adjective/nominal-sentence examples so the colour+underline pattern is exercised. **At A1 this is colour + underline only — no pills** (role names are metalanguage barred at A1; pills begin at A2, a later batch). This also surfaces the **RTL pill/layout refinement** flagged in M28.3 — but since A1 shows no pills, the batch only needs the colour+underline layout to read cleanly RTL.

## 5. Schema decisions

- `emphasisTag` on lexemes/texts/steps — additive, already validated by build-content.js (M28.1).
- **Per-example emphasis selection** (§4.2): a `variants`/`emphasisTag`-on-item convention + the renderer picking by `getEmphasis()`. New; the one runtime addition, validated in build-content.js.
- **`fill_in_blank`:** recommend mapping to **`cloze`** (exists) rather than adding a kind — smallest change. Confirm.
- `visualRoles` on a step: `[{ token, role }]`, role ∈ topic|doer|receiver|description (M28.3). Validate against `renderRolePattern`'s contract.

## 6. Invariants

- Additive schema only; no existing lesson/objective/id churn (emphasis tags and variants are additive).
- Reachability under all three preferences — validator-enforced (§4.2).
- Buildless runtime; `buildAudioControl()`/`playArabicAudio()` untouched; content compiles into `index.html`.
- `npm run content:check` / `npm run qa` / `node tools/a11y-audit.js` clean.
- Every new Arabic string verified against a reference; every Quranic ref against a muṣḥaf.

## 7. Acceptance criteria

1. The validator proves every A1 unit completable under `general`, `quranic`, and `both`.
2. A simulated general learner and a quranic learner each walk the A1 units to completion (QA), seeing their own example payloads.
3. Rule A and Rule B nudges fire for the right audience, once/day, dismissible, with verified payloads.
4. At least one role-annotated A1 example renders (colour + underline, no pills) and reads correctly RTL.
5. At least one `sentence_builder` grades both nominal and verbal order correct (M28.3).
6. `content:check` / `qa` / `a11y` clean; new QA checks for per-example emphasis selection + a nudge firing.
7. Every new string carries a verification note; every Quranic ref cites surah:ayah checked against a muṣḥaf.

## 8. Verification plan

- Author in `content/` (lexemes, texts, lessons), compile with `--write-app`, `content:check`.
- Extend QA: a general-learner and quranic-learner walk of an A1 unit (seeded emphasis), asserting the right payload shows; a nudge-fires check; an acceptedOrders sentence-builder walk.
- a11y on the role-annotated example (both themes).
- A human-review pass over every new Arabic string + Quranic ref before merge (rule 1).

## 9. Open decisions

1. **`fill_in_blank` → `cloze`?** (recommended) or a new kind.
2. **Quranic text objects for Rule A / examples** — the Quran *text* is fine to use (not a copyrighted translation), but it must be authored as verified `text` objects (85:21–22, etc.). Confirm we author a small set of muṣḥaf-verified Quranic `text` objects in this batch, tagged `quranic`.
3. **Batch size** — all of A1 in one batch, or unit-by-unit (`m28b1`, `m28b2`, …)? (Lean: one A1 batch to establish the patterns, then A2 as `m28b2`.)
4. **Per-example variant shape** — `variants:{general,quranic}` on a step vs. per-item `emphasisTag` in a list (§4.2). (Lean: `variants` for single-example steps, per-item `emphasisTag` for lists.)
5. **RTL role layout** — for A1 (no pills) the colour+underline is enough; defer the pill-placement design to the A2 batch that introduces pills. Confirm.

## 10. Risks

- **Quranic text authoring/verification** is the critical-path item — real muṣḥaf-checking per string, not draftable at volume.
- **Synthesized audio** for the new Quranic vocab/dialogues (same tier-1 recording gap as M28.1's pairs).
- **Scope creep** — keep to A1; resist pulling A2 pack material forward.
