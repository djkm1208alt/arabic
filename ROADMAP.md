# Master Roadmap

The standing plan for the Arabic-learning platform. Every milestone scope doc cites this for "where does this fit and what may it not touch." Design detail lives in [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md); milestone workflow lives in the Master Standards (`feedback_master_standards` in project memory).

## Philosophy

1. **Build the educational engine first. Populate it second. Personalise it third. Polish the product last.**
2. **Local-first.** Everything works single-device with no backend until there is per-user state genuinely worth syncing (M22).
3. **Quality over quantity.** No AI-generated mountain of questionable Arabic. Every Arabic string is checked for spelling, ḥarakāt, grammar, transliteration, meaning, natural usage, and level-appropriateness.
4. **Education before monetisation.** Design the curriculum on its merits; decide what is free vs. premium only once the product is genuinely valuable.
5. **Honesty about limits.** The system never fabricates a score for something it cannot measure (free writing, speaking fluency). It says "self-assessed" or "insufficient evidence" instead.

## Position

`main` @ `b1e2e13`. **M6–M16 merged and live** (+ a `lang="ar"` accessibility fix). Next: **M17**.

Phases 1–2 (M13–M15) build the frame. Phase 3 (M16) fills it. Phases 4–6 (M17–M19) make learning findable, provable, and durable. Phase 7 (M20–M21) produces content. Phase 8 (M22–M23) adds accounts and monetisation. Then the UI/UX pass, the AI tutor layer, and the long tail of content.

---

## The milestones

| M | Name | One line | Proven done when | Depends on |
|---|---|---|---|---|
| **M13** | Native-audio prep | Manifest + resolver + TTS fallback, inert behind a flag. | ✅ merged | — |
| **M14** | Learning-object core | One `lexemes` table + typed `LETTERS`/`MARKS`/`SYLLABLE_OBJECTS`/`GRAMMAR_POINTS`/`TEXTS` in `content/*.json`, compiled to the app. Behaviour-preserving. | ✅ merged | — |
| **M15** | Skills · levels · learning graph | 8 strands, 7 levels (PRE_A1→C2), **all 56 Arabic-specific can-do descriptors** (each cited to an external framework), `prereqs` edges among M14 objects, honest `deriveLevel(skill)`. Progress view gains a per-strand panel; no other UI change. | ✅ merged (PR #10) — 234 objects tagged, 62 acyclic level-monotonic edges, `deriveLevel` returns level + confidence or "insufficient evidence", "Your skills" panel live. | M14 |
| **M16** | Curriculum spine | The real `curriculum` tree (levels → units → lessons) wired to objects and levels; Learn view "start where you fit"; lessons declare `objectives`; the 7-stage lesson generator. The full A2–C2 content *map* placed by level. | ✅ merged (PR #12) — `content/curriculum.json` (37 units / 18 lesson nodes), `generateLessonSteps` v1 + 2 generated A1 lessons, `deriveLevel` introduced-coverage bridge (capped A1), Learn view rebuilt. | M15 |
| **M17** | Placement / diagnostic | Per-strand adaptive-lite diagnostics for the reliably-measurable strands, self-report for speaking/writing, honest confidence, learner override. **Rides on the existing MCQ / listen-identify primitives** — does not build a new item engine. | Placement recommends a per-strand entry level with a confidence flag; the learner can override every one. | M15, M16 |
| **M18** | Assessment framework | `exerciseTypes` registry (parallel to `stepRenderers`); migrate MCQ in; add `match` / `order` / `cloze` / `build-word` / `build-sentence` / `dictation` / `transform`. Each item references learning objects; results feed the review store. | Non-MCQ types work; each strand has item types suited to it; every graded interaction emits an `InteractionEvent`. | M15 |
| **M19** | Review / retention | `InteractionEvent` + per-object `ReviewState` (backfilled from existing quizzes); an SM-2-lite scheduler as a pluggable module; a mistake log; review queues. The crude `mastered` toggle becomes `learned → practised → weak → forgotten → reviewed → retained`. | Review queues built from `dueDate` + mistakes; the word "spaced repetition" is only used once a real scheduler runs. | M18 |
| **M20** | Content pipeline + complete A1 | `tools/build-content.js` grows a schema + **linguistic linter** (ḥarakāt coverage, transliteration↔Arabic consistency, register, level fit); migrate all existing content into it; then author a **complete, heavily-QA'd A1 across all 8 strands** as the reference level. Internal gate: pipeline proven → then author A1. | The linter catches a deliberately-broken example; A1 is coherent end-to-end across every strand. | M15–M19 |
| **M21** | Content scale-out | A2 → B1 → B2 → C1 → C2, level by level, against a stable engine. The advanced/literary end (الأدب، الشِّعر، البلاغة، النقد، الفكر، الصحافة، اللغة الأكاديمية) is the **top of this ladder**, with specialised sub-tracks where the pedagogy differs from language acquisition. **The beginning of a continuous content operation, not a task with an end.** | Each level is coherent and QA'd before the next starts. | M20 |
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
