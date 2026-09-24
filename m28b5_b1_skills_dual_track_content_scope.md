# M28-B5 — Dual-track content, B1 skill units (second B1 batch)

**Status:** Approved 2026-09-24 (§9.5 confirmed: content-only, existing `unvowelled` field; the stepwise de-vowelling reader becomes its own feature milestone later). **Built** in four QA-gated commits on branch `claude/m28b5-b1-skills-scope` (passages; `b1-dual-unvowelled-reading`; `b1-dual-listening`; `b1-dual-writing`). **B1 is now complete — all seven units available.** No engine change at all; no Qur'anic quotation added (passages are original), so no muṣḥaf check this batch. All authored Arabic pending the user's linguistic review (rule 1).
**Parent:** [ROADMAP.md](ROADMAP.md) M28 · follows m28b4 (B1 grammar, b1-u3, merged). Finishes B1 by filling its three **skill** units. Reuses all m28 machinery; no new engine. Continues the arc m28b1 (A1) → m28b2/b3 (A2) → m28b4 (B1 grammar).

---

## 1. What this is

The dual-track content for B1's three skill units — reading, listening, writing — layering the General/Quranic emphasis onto them via track-tagged passages and the payload selector. With this, **B1 is complete** (b1-u1/u2/u7 were built in M21; b1-u3 in m28b4; this fills b1-u4/u5/u6).

## 2. Scope boundary

**In (m28b5 = B1 skill units, one lesson each):**
- `b1-u4` (Reading Unvowelled MSA) — read short B1 passages written **without ḥarakāt**, reveal the meaning.
- `b1-u5` (Understanding Standard Speech) — listen (TTS) to short B1 passages and answer comprehension.
- `b1-u6` (Writing Connected Texts) — arrange/spell to produce a short connected B1 sentence.

Each unit flips to `available` once its lesson lands. Dual-track: general vs devotional passages, selected by emphasis (objectives stay `both`).

**Out:** B2+; UI localization (M29 French + future Arabic UI — deferred, content-first); a dedicated stepwise-de-vowelling reader engine (see §5).

## 3. Source & provenance (standing rule 1)

No pack for B1. Every passage is authored from the app's leveled A1–B1 lexicon (or is a short, well-known Qur'anic phrase for the devotional track), then **verified by the user**; every Qur'anic quotation is muṣḥaf-checked (user confirms against a physical copy); French provisional until M29. Grammar/progression stay shared; only theme/passage differs by track.

## 4. Content deliverables

### 4.1 Texts (new B1 passages, track-tagged)

Short (2–3 sentence) B1 passages, each with `vowelled`, `translit`, `en`, `emphasisTag`, and — for reading — an `unvowelled` field:
- **General:** a daily-routine / study / travel passage (built from existing A1–B1 vocab).
- **Quranic:** a devotional passage or a short, muṣḥaf-checked Qur'anic phrase.

Reuse existing B1/A2 texts where they fit (e.g. `txt:read-para-*`, `txt:para-general/quranic`) rather than duplicating.

### 4.2 Lessons

1. **`b1-dual-unvowelled-reading`** (`b1-u4`) — a `reading-practice` presenting each passage's **unvowelled** surface (from the text's `unvowelled` field), with reveal → vowelled + meaning; track-tagged items + a comprehension `practice-choice`.
2. **`b1-dual-listening`** (`b1-u5`) — an `audio-exercise` / `listen-repeat` on track-tagged B1 sentences (TTS today; honest "Synthesized" badge), then a `practice-choice` comprehension. Per-track `variants` where the sentence differs.
3. **`b1-dual-writing`** (`b1-u6`) — a `build` (unit `word`) arranging a short connected B1 sentence, per-track `variants` (general vs devotional), optionally with `acceptedOrders` where more than one order is valid.

### 4.3 Nudges

Optional, ≤ 1–2, lesson-complete, audience-gated — e.g. a general reader nudged to a short devotional passage. Keep light; only add a Qur'anic payload if muṣḥaf-checked.

## 5. Schema & engine

**None new.** `reading-practice`, `audio-exercise`, `listen-repeat`, `build` (+ `acceptedOrders`), `practice-choice`, `variants`, the payload selector, and `smartNudge` all exist and are validated.

- **Unvowelled reading uses the existing `unvowelled` text field / reading-practice** — the item's `arabic` shows the unvowelled surface and the reveal shows the meaning. A dedicated *stepwise de-vowelling reader* (full → partial → none, per the master spec's `reduced_vowel_reading`) is a nice future engine enhancement but is **out of scope** here; m28b5 stays content-only.

## 6. Invariants

Identical to prior batches: additive schema; objectives stay `both` (tag the payload, not the objective) so reachability holds under every preference; buildless runtime; audio untouched; `content:check` / `qa` / `a11y` clean; every new string verified, every Qur'anic ref muṣḥaf-checked.

## 7. Acceptance criteria

1. `b1-u4/u5/u6` each complete under general, quranic, and both (validator + QA walk under seeded emphases).
2. The reading passage shows unvowelled text with a working meaning reveal; listening plays and its comprehension grades; writing builds a correct sentence (any valid order via `acceptedOrders`).
3. Each learner sees their track's passage; `both` sees both.
4. Any nudges fire for the right audience, ≤1/day, dismiss permanently.
5. `content:check` / `qa` / `a11y` clean.
6. Every new string verified; every Qur'anic ref muṣḥaf-checked.

## 8. Build order (after approval)

Four QA-gated commits, same rhythm:
1. Texts (new B1 passages, track-tagged) + any new vocab + tags.
2. `b1-dual-unvowelled-reading` (b1-u4) + node + flip u4 available.
3. `b1-dual-listening` (b1-u5) + node + flip u5 available.
4. `b1-dual-writing` (b1-u6) + node + flip u6 available; any nudges; any muṣḥaf-checked Qur'anic passage.

## 9. Decisions (carried from prior batches unless changed)

1. Nudges on `lesson-complete` (no engine change).
2. Role pills as a legend below the line (if any role-pattern is used).
3. Muṣḥaf-checked Qur'anic texts only where needed; user verifies.
4. One lesson per skill unit in m28b5; completes B1. After this, B1 is done — next is B2 or the deferred UI work.
5. **New:** unvowelled reading via the existing `unvowelled` field, not a new stepwise-reader engine (§5). Confirm.

## 10. Risks

- **Qur'anic verification** — the critical-path item; keep devotional passages to short, well-known, muṣḥaf-checked phrases.
- **Synthesized audio for listening** — b1-u5 depends on the device TTS producing intelligible B1 sentences; badge stays honest ("Synthesized"), and these become tier-1 recording targets.
- **Level/register fit** — keep passages within A1–B1 vocabulary.
- **Scope creep** — one lesson per unit; no B2, no new reader engine.
