# Master Roadmap

The standing plan for the Arabic-learning platform. Every milestone scope doc cites this for "where does this fit and what may it not touch." Design detail lives in [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md); milestone workflow lives in the Master Standards (`feedback_master_standards` in project memory).

## Philosophy

1. **Build the educational engine first. Populate it second. Personalise it third. Polish the product last.**
2. **Local-first.** Everything works single-device with no backend until there is per-user state genuinely worth syncing (M22).
3. **Quality over quantity.** No AI-generated mountain of questionable Arabic. Every Arabic string is checked for spelling, ḥarakāt, grammar, transliteration, meaning, natural usage, and level-appropriateness.
4. **Education before monetisation.** Design the curriculum on its merits; decide what is free vs. premium only once the product is genuinely valuable.
5. **Honesty about limits.** The system never fabricates a score for something it cannot measure (free writing, speaking fluency). It says "self-assessed" or "insufficient evidence" instead.

## Position

`main` @ `42887f8`. **M6–M18 merged and live** (+ three `lang="ar"` accessibility follow-ups). Next: **M19**.

Phases 1–2 (M13–M15) build the frame. Phase 3 (M16) fills it. Phases 4–6 (M17–M19) make learning findable, provable, and durable. Phase 7 (M20–M21) produces content. Phase 8 (M22–M23) adds accounts and monetisation. Then the UI/UX pass, the AI tutor layer, and the long tail of content.

---

## The milestones

| M | Name | One line | Proven done when | Depends on |
|---|---|---|---|---|
| **M13** | Native-audio prep | Manifest + resolver + TTS fallback, inert behind a flag. | ✅ merged | — |
| **M14** | Learning-object core | One `lexemes` table + typed `LETTERS`/`MARKS`/`SYLLABLE_OBJECTS`/`GRAMMAR_POINTS`/`TEXTS` in `content/*.json`, compiled to the app. Behaviour-preserving. | ✅ merged | — |
| **M14.1** | UI baseline (mobile-first, RTL, accessible) | Audit-and-harden pass on the *existing* UI — WCAG 2.5.5 touch targets, measured contrast, explicit `dir` alongside `lang`, focus-visible states, a documented breakpoint set — before M15/M16 build more UI on top of it. Not a redesign; M24 owns that. | 🧪 implemented, pending review — see [m14.1_ui_baseline_scope.md](m14.1_ui_baseline_scope.md), [UI_BASELINE.md](UI_BASELINE.md), [content/m14.1-a11y-review.md](content/m14.1-a11y-review.md) — `tools/a11y-audit.js` clean (0 touch-target, 0 contrast findings) across 2 themes × 6 breakpoints; `tools/qa-harness.js` 31/31 | M14 |
| **M14.5** | Content validation framework | `tools/build-content.js --lint` (structural: dangling ids, duplicates, ḥarakāt coverage) + `tools/qa-harness.js` (Playwright regression battery), formalizing the manual QA process used for every milestone so far. First npm devDependency. | 🧪 implemented, pending review — see [m14.5_content_validation_scope.md](m14.5_content_validation_scope.md) — 30/31 checks pass (the 1 failure was a genuine pre-existing gap, closed by M14.1) | M14 |
| **M15** | Skills · levels · learning graph | 8 strands, 7 levels (PRE_A1→C2), **all 56 Arabic-specific can-do descriptors** (each cited to an external framework), `prereqs` edges among M14 objects, honest `deriveLevel(skill)`. Progress view gains a per-strand panel; no other UI change. | ✅ merged (PR #10) — 234 objects tagged, 62 acyclic level-monotonic edges, `deriveLevel` returns level + confidence or "insufficient evidence", "Your skills" panel live. | M14 |
| **M15.5** | Audio / pronunciation foundation | Recorded-vs-synthesized honesty indicator on every `buildAudioControl()`; A/B "compare with model" toggle in the recorder. M13's manifest/resolver already covered all content (not a bounded tranche) — turned out to need no extension. No scoring — stays inside the existing deferral. | 🧪 implemented, pending review — see [m15.5_audio_pronunciation_foundation_scope.md](m15.5_audio_pronunciation_foundation_scope.md), [content/m15.5-audio-coverage-review.md](content/m15.5-audio-coverage-review.md) — `tools/qa-harness.js` 31/31, `tools/a11y-audit.js` clean | M13, M15 |
| **M16** | Curriculum spine | The real `curriculum` tree (levels → units → lessons) wired to objects and levels; Learn view "start where you fit"; lessons declare `objectives`; the 7-stage lesson generator. The full A2–C2 content *map* placed by level. | ✅ merged (PR #12) — `content/curriculum.json` (37 units / 18 lesson nodes), `generateLessonSteps` v1 + 2 generated A1 lessons, `deriveLevel` introduced-coverage bridge (capped A1), Learn view rebuilt. | M15 |
| **M17** | Placement / diagnostic | Per-strand adaptive-lite diagnostics for the reliably-measurable strands, self-report for speaking/writing, honest confidence, learner override. **Rides on the existing MCQ / listen-identify primitives** — does not build a new item engine. | ✅ merged (PR #13) — `buildPlacementItems` generates items from objects, adaptive walk with per-strand ceiling ("A2 or above"), `#view-placement`, `deriveLevel` placement tier, 3 entry points. | M15, M16 |
| **M18** | Assessment framework | `exerciseTypes` registry (parallel to `stepRenderers`); migrate MCQ in; add `match` / `order` / `cloze` / `build-word` / `build-sentence` / `dictation` / `transform`. Each item references learning objects; results feed the review store. | ✅ merged (PR #15) — registry + `choice`/`match`/`cloze`/`build`/`order`, all generated from objects; `InteractionEvent` → `progress.interactionLog` (ring buffer, cap 400); generator emits varied items; `build` gives `writing` its first machine-checkable signal. `dictation`/`transform`/`multi-choice`/`short-write` deferred. | M15 |
| **M19** | Review / retention | `InteractionEvent` + per-object `ReviewState` (backfilled from existing quizzes); an SM-2-lite scheduler as a pluggable module; a mistake log; review queues. The crude `mastered` toggle becomes `learned → practised → weak → forgotten → reviewed → retained`. | Review queues built from `dueDate` + mistakes; the word "spaced repetition" is only used once a real scheduler runs. | M18 |
| **M19.5** | Local learner state (IndexedDB) | Migrates the `progress` storage *engine* (not its logical contract) from a single `localStorage` blob to IndexedDB (`reviewState` / `interactionEvents` / `progressMeta` stores) before M20/M21's content scale-out grows the event log. `safeIdb*` wrappers, versioned migration, legacy blob retained. | 🔜 proposed — see [m19.5_local_learner_state_scope.md](m19.5_local_learner_state_scope.md) | M19 |
| **M20** | Content pipeline + complete A1 | `tools/build-content.js` grows a schema + **linguistic linter** (ḥarakāt coverage, transliteration↔Arabic consistency, register, level fit); migrate all existing content into it; then author a **complete, heavily-QA'd A1 across all 8 strands** as the reference level. Internal gate: pipeline proven → then author A1. | The linter catches a deliberately-broken example; A1 is coherent end-to-end across every strand. | M15–M19 |
| **M20.5** | Arabic language tools | `normalizeArabicInput()` (alef/tāʾ marbūṭa normalization, for M18's future free-text grading); curated `content/roots.json` for confusable-root distractors; `deriveReducedForm`/`deriveUnvowelledForm` wired into M14.5's linter as a drift check on `texts.json`. Explicitly not a general morphological analyzer or dictionary spellchecker. | 🧪 implemented, pending review — see [m20.5_arabic_language_tools_scope.md](m20.5_arabic_language_tools_scope.md), [content/m20.5-language-tools-review.md](content/m20.5-language-tools-review.md) — 11 verified root clusters (24 lexemes); `build-content.js --lint`'s texts.json drift check is clean; `tools/qa-harness.js` 31/31, `tools/a11y-audit.js` clean. Built against the current lexeme set directly rather than waiting on M20's "complete A1" — its real code dependencies (`content/lexemes.json`, `content/texts.json`, M14.5's `--lint`) already existed | M20 |
| **M21** | Content scale-out | A2 → B1 → B2 → C1 → C2, level by level, against a stable engine. The advanced/literary end (الأدب، الشِّعر، البلاغة، النقد، الفكر، الصحافة، اللغة الأكاديمية) is the **top of this ladder**, with specialised sub-tracks where the pedagogy differs from language acquisition. **The beginning of a continuous content operation, not a task with an end.** | Each level is coherent and QA'd before the next starts. | M20 |
| **M21.5** | Analytics & learning insights | A local-first-only Progress-view panel on M19/M19.5's event data: time-per-strand, accuracy trend, weakest-N objects, streak chart, JSON export. Inline-SVG, no charting library. Cross-learner aggregate/telemetry explicitly deferred to M22+. | 🔜 proposed — see [m21.5_analytics_learning_insights_scope.md](m21.5_analytics_learning_insights_scope.md) | M19.5, M21 |
| **M22** | Student accounts / personal state | Email + password auth; cross-device sync of per-strand level, placement result, completed lessons, mistake + review history, vocabulary exposure, assessment history, preferences. `localStorage` stays the offline fallback. First backend dependency — Firebase Auth + Firestore *or* Supabase (decision surfaced when M22 starts). | Progress syncs across devices; a signed-out learner still works fully offline. | M19 |
| **M23** | Subscriptions / monetisation | Premium tier (advanced course, native-audio pack, analytics, certificate) via Stripe or Play Billing. Free vs. premium vs. teacher/professional decided here — **not** baked into the curriculum. | Payment gate works; the free tier is still a genuinely useful course. | M22 |

---

## After M23

| M | Name | Notes |
|---|---|---|
| **M24** | UI/UX & product refinement | A dedicated pass (likely a 3–4 part cluster): navigation, onboarding, placement UX, learner dashboard, lesson flow, mobile + desktop, Arabic typography, RTL/LTR, accessibility, writing interface, audio controls, progress visualisation, review experience, child / adult / advanced experiences, motion, feedback, consistency, performance. **Not interleaved with M15–M21.** The current "no UI change" rule on M14–M21 is about *sequencing*, not a verdict that today's UI is final. |
| **M25+** | AI personal tutor | A **layer over** the curriculum, never the curriculum. Needs M15 (learner model) + M16 (curriculum) + M18/M19 (assessment + mistake history) to do better than "let's practise Arabic." Example of what it can then do: *"This learner is Reading B1 but Listening A2; they recently struggled with past-tense conjugation and attached pronouns — today's conversation reinforces those without exceeding their vocabulary level."* |

### Parallel tracks (not blocking the M-sequence)

- **Advanced / literary Arabic** — the C1/C2 rungs of M21, plus specialised units (الأدب، الشِّعر، البلاغة، الفكر والفلسفة، النثر، النصوص التراثية، الصحافة، اللغة الأكاديمية، الحجاج، النقد وتحليل النص). C1/C2 Arabic must have somewhere to go beyond "harder tourist phrases."
- **Dialect pathways** — Moroccan, Egyptian, Levantine, Gulf. Attach *alongside* the MSA spine any time after M16; never mixed into the foundational fuṣḥā course. `variety` field reserved since M14.
- **Teacher / classroom features** — assign lessons, track a class, review a cohort's mistakes. A product surface in its own right; **separate from M23 monetisation**, a candidate milestone after M22.
- **Community features** — per-lesson discussion threads, an honest non-gamified streak display, MVP keyword-filter moderation. The first proposed milestone that cannot be local-first: hard-depends on M22 (real identities), recommended after M23. No default cross-learner leaderboard (conflicts with the anti-gamification stance). Proposed as **M26** — see [m26_community_features_scope.md](m26_community_features_scope.md); tracked here rather than in the numbered core sequence since, like Teacher/classroom features above, it's optional and doesn't sit on the path every learner passes through. *(Requested as "M24" — renumbered because M24 is already committed above to UI/UX & product refinement.)*

### Continuous (never "done")

Content quality, new texts / dialogues / audio / exercises / explanations / assessments, and pedagogical iteration. There is no day when "Arabic is finished" — there is a point (≈ M19–M20) where the engine, curriculum architecture, assessment, and learner model are mature, and the platform can then grow indefinitely.

---

## Standing rules (apply to every milestone)

1. **Never invent Arabic.** Examples come from checked, real sources. Descriptors, level maps, and grammar rules are checked against external references, not authored from scratch.
2. **Learner-state migration discipline.** Any milestone that extends `progress` / learner-state (M15–M19, M22) ships a migration function + a before/after verification, as M14 did (`migrateMastered`, seeded-RNG byte-compare).
3. **Accessibility is a continuous constraint.** M15–M21 must not regress keyboard navigation, ARIA, RTL correctness, focus states, or contrast. The M24 pass polishes; it does not rescue.
4. **Honesty about un-gradable skills is permanent.** Free composition and speaking fluency are self-assessed against rubrics with a "compare to model" reference — never a fabricated number.
5. **Buildless runtime.** The shipped app keeps zero runtime dependencies and zero runtime fetches. Dev-time tooling (the `tools/*.js` compilers) is fine and expected.
6. **The Master Standards workflow** — Plan (scope doc, hold for approval) → Branch → Draft PR → QA (live browser trace) → merge only on explicit approval — applies to every milestone.
7. **Milestone vs. layer vs. operation.** A *milestone* ships a bounded deliverable. A *layer* (AI tutor) sits on top of finished milestones. An *operation* (content, quality) runs forever. Don't scope one as another.

## Explicitly deferred

- Backend / accounts / sync → **M22**. Any earlier is an empty shell.
- Dialect content → not until commissioned; never in the fuṣḥā core.
- Pronunciation *scoring* → the recorder stays "compare to model"; no score unless a genuinely reliable one exists.
- Full UI/UX redesign → **M24**, as one deliberate pass.
- AI-generated curriculum content → never. AI is a tutor layer, not a content factory.
