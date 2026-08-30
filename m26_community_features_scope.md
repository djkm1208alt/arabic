# M26 — Community Features (optional/future)

**Status:** Draft for review. Do not begin implementation until this is approved.

**Renumbered from the requested "M24".** ROADMAP.md already defines **M24 = "UI/UX & product refinement"** (line 43 — a dedicated navigation/onboarding/mobile/RTL/accessibility/typography pass, explicitly "not interleaved with M15–M21"). That milestone number is committed and load-bearing — other docs and this session's own M14.1 plan reference it. Rather than overwrite an existing milestone's meaning, Community Features is proposed here as **M26**, positioned as the numbered-sequence counterpart to the roadmap's own existing note under "Parallel tracks": *"Teacher / classroom features — assign lessons, track a class... a candidate milestone after M22"* (ROADMAP.md line 50). Community Features is the same category of feature (multi-learner, post-M22) and is proposed to sit alongside that entry, after M25 (AI personal tutor layer).

**Parent:** After M25+ (AI personal tutor) in [ROADMAP.md](ROADMAP.md). Hard-depends on M22 (Student accounts / personal state).

---

## 1. Why it exists

Every milestone in this roadmap through M25 is, deliberately, either local-first or a thin layer over local-first data. M26 is different in kind: it's the first genuinely **multi-learner, social** surface — the point where the product needs to know about more than one person's data at once. That's worth calling out explicitly rather than quietly assuming it fits the same "buildless, local-first" mold as everything before it.

## 2. What it delivers

An honest, deliberately narrow first version — not a full social platform:

1. **Per-lesson discussion threads** — a comment surface attached to individual curriculum lessons (M16's tree), for learners to ask questions or share notes.
2. **An honest, non-gamified streak display** — extends the existing local `streak` field (already computed in `progress`) with a shareable/visible form, but stops there deliberately: **no cross-learner leaderboard by default**. A leaderboard would conflict with this project's own anti-gamification posture (standing rule 4/5's honesty stance, and the general "no fabricated score" philosophy applied to social comparison, not just skill measurement) — if ever wanted, it would need its own explicit, separate product decision, not be bundled in here by default.
3. **Minimal moderation**: keyword-filter MVP (block a small deny-list of obvious abuse patterns) — explicitly *not* a claim of robust moderation. A "genuinely safe and well-moderated" community feature (real-time human moderation, ML-based abuse detection, reporting workflows with SLA) is a much bigger undertaking, flagged in §7/§8 rather than overpromised.

## 3. Invariants — what must NOT change

| Must hold | Why |
|---|---|
| No cross-learner leaderboard ships by default | Anti-gamification stance carried from standing rule 4/5's honesty philosophy |
| Every comment/thread is tied to a real authenticated identity from M22 | No anonymous posting surface — reduces abuse surface for the MVP moderation level this scope can actually deliver |
| Existing local-first features keep working fully offline | Standing rule 2 (M22 already established "a signed-out learner still works fully offline" — M26 must not regress that) |
| No feature here becomes load-bearing for the core curriculum experience | Community features are additive/optional, never required to complete a lesson |

## 4. Migration requirements

Not applicable in the M14–M21 sense (no `progress`/local learner-state schema migration) — this milestone's state lives in M22's backend (posts/comments collection), which by definition doesn't exist until M22 ships. Any backend schema versioning here follows whatever pattern M22 itself establishes for backend data, not the local-storage migration discipline standing rule 2 describes.

## 5. Acceptance criteria (for the honest minimal MVP scoped in §2)

- A learner can post and read comments on a specific lesson, tied to their real M22 identity.
- The keyword-filter MVP demonstrably blocks a test set of obvious abuse-pattern strings (explicitly documented as MVP-level, not claimed as comprehensive).
- The streak display renders from real local `streak` data with no fabrication, and has no default leaderboard/ranking surface.
- Every feature here is reachable without breaking or gating the existing offline, non-social experience.

## 6. Regression re-tests

Full offline-mode walk-through (every existing feature still works fully signed-out, per M22's own invariant), full regression battery from M14.5's `qa-harness.js` if landed by this point.

## 7. Out of scope

- **A cross-learner leaderboard** — deliberately excluded by default; would need its own explicit product decision given the anti-gamification stance, not bundled here.
- **Robust, production-grade moderation** (human review queues, ML abuse detection, reporting/appeals workflow) — the scoped MVP here is keyword-filter-only, stated plainly as a floor, not a ceiling. A genuinely safe, well-moderated version of this feature is realistically **larger than 1–2 weeks** of senior-dev work and is not what's being proposed for the initial M26 slice.
- **Teacher/classroom features** (assign lessons, track a cohort) — ROADMAP.md already tracks this as its own separate parallel-track candidate (line 50); related in spirit (both are post-M22, multi-user) but a distinct feature set with distinct requirements (cohort management, not peer discussion), not folded into M26.
- Direct messaging or any private communication surface between learners — not proposed at all here; a materially different trust/safety scope than public per-lesson comment threads.

## 8. Open questions

- Should M26 be tracked in ROADMAP.md's numbered core sequence at all, or moved into the existing "Parallel tracks (not blocking the M-sequence)" section alongside the Teacher/classroom features note it's positioned next to in spirit? **Recommend:** the latter — it hard-depends on M22/M23 like the Teacher-features entry does, isn't part of the linear path every learner passes through, and the roadmap already has a home for exactly this category of feature. Proposing it as "M26" here is a placeholder label for discussion purposes; recommend the roadmap update (see accompanying note) list it under Parallel tracks rather than renumbering it into the main sequence table.
- Does the honest MVP (§2/§5) ship as one milestone, or does even that minimal version want splitting into "threads" and "streak display" as two smaller pieces? **Recommend:** split if actually scheduled — they have almost no shared surface area (one touches M16's lesson tree + M22's backend; the other only touches the existing local `streak` field plus a small display), and splitting keeps each piece inside the 1–2 week target cleanly rather than stretching one milestone thin.

## 9. Rollout

Not scheduled — this scope doc exists to answer "what would this look like," per the request, but per §1 and standing rule 7 (milestone vs. layer vs. operation), it cannot start before M22 exists, and realistically not before M23. No rollout steps are proposed until it is actually next in line; revisit this document's assumptions against the real state of M22/M23 before beginning.
