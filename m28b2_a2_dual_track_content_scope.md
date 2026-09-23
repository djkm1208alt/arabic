# M28-B2 — Second dual-track content batch (A2)

**Status:** Draft for review — held for approval (ROADMAP standing rule 6). No content authored yet; this plans the work.
**Parent:** [ROADMAP.md](ROADMAP.md) M28 · builds on [m28b1_a1_dual_track_content_scope.md](m28b1_a1_dual_track_content_scope.md) (the A1 batch, merged) and reuses all its machinery (payload selector, per-track `variants`, Smart Nudge, role styling, `acceptedOrders`). Source: [docs/EXPANDED_DUAL_TRACK_CONTENT_A1_A2.md](docs/EXPANDED_DUAL_TRACK_CONTENT_A1_A2.md) (its A2 material) and [docs/MASTER_CURRICULUM_SPEC.md](docs/MASTER_CURRICULUM_SPEC.md) (A2, Units 08–10).

---

## 1. What this is

The A2 dual-track content batch — the same pattern as m28b1, one level up, on the app's existing A2 spine. It reuses every mechanism m28b1 built and adds the pieces A1 couldn't exercise because **A1 is verbless**:

- the **multi-order `acceptedOrders` sentence-builder** (deferred from m28b1) — a verbal sentence graded correct in both VSO (يَقْرَأُ الْمُسْلِمُ الْقُرْآنَ) and SVO (الْمُسْلِمُ يَقْرَأُ الْقُرْآنَ) order;
- **present-tense daily-routine drills** with dual-track verb objects (يَقْرَأُ الرِّسَالَةَ vs يَقْرَأُ الْقُرْآنَ);
- **preposition `cloze` drills**, dual-track;
- the **first role pills** — A2 shows the tap-labels (Topic/Doer/Receiver/Description) that A1 deliberately omitted (`renderRolePattern({showLabels:true})`).

## 2. Scope boundary

**In:** app level **A2**, primarily `a2-u1` (The Verbal Sentence) and `a2-u6` (Everyday Exchanges), plus the A2 vocabulary, verbal-sentence + present-tense drills, preposition cloze, Smart Nudge(s), and role-annotated (pilled) examples from the pack's A2 material.

**Out (later):** B1+ content; French UI chrome (M29); any new exercise engine (the `variants`, `acceptedOrders`, cloze, and nudge machinery all already exist).

## 3. Source & provenance (standing rule 1)

Same discipline as m28b1: the pack is AI-drafted, so every string is verified against a reference before it compiles; any Quranic quotation is muṣḥaf-checked by the user; French stays provisional until M29; examples are authored from the app's leveled lexicon. m28b1 established the review loop; this batch repeats it.

## 4. Content deliverables

### 4.1 Vocabulary

- **Tag existing A2-relevant lexemes `both`** (everyday words are universal, per the m28b1 decision): the prepositions في/على/مِن/إلى/مع (`lex:prt-*`) and verbs كَتَبَ/جَلَسَ/فَتَحَ (`lex:ver-*`) — additive `emphasisTag` only.
- **~6 new A2 lexemes to author + verify:** رِسَالَة (letter/message, general), صَوْت (sound/voice, both), أَذَان (call to prayer, quranic), مَغْفِرَة (forgiveness, quranic), دَعَا/يَدْعُو (to supplicate, quranic), فَجْر (dawn, both). Each with translit, gloss, level A2, `emphasisTag`, a verified example, and present-tense note for the verb.

### 4.2 Lessons (on the existing A2 spine)

1. **`a2-dual-verbal-sentence`** (`a2-u1`) — teaches the verbal sentence with a **`build`/`word` `acceptedOrders`** drill accepting VSO + SVO, and per-track `variants` (general everyday sentence vs a Quranic one). This is the deferred multi-order demo (acceptance criterion 5 from m28b1).
2. **`a2-dual-daily-verbs`** (`a2-u6`) — present-tense routine with dual-track verb objects via the payload selector / `variants` (يَقْرَأُ الرِّسَالَةَ ↔ الْقُرْآنَ; يَسْمَعُ الصَّوْتَ ↔ الْأَذَانَ; يَطْلُبُ الْمُسَاعَدَةَ ↔ الْمَغْفِرَةَ), plus a **preposition `cloze`** drill.

### 4.3 Role pills (A2 — first use)

Add a `role-pattern` step **with `showLabels: true`** to the verbal-sentence lesson: a verbal sentence colour-coded with **Doer** (green) + **Receiver** (blue) + optional **Description** (amber) pills. This is the first place the A2 tap-labels appear (A1 was colour+underline only). **Resolve the RTL pill-placement** flagged in M28.3 here — with multiple pills in an RTL line, lay them out cleanly (e.g. pill directly after its chunk with `white-space:nowrap` on the pair, or a small legend), and re-verify a11y.

### 4.4 Smart Nudges

- **Rule B (quranic→general), the pack's own example:** on the root ك-ت-ب, show everyday use ("write an email"). Decision (§5): trigger on `lesson-complete` of the verbal-sentence lesson (simple, already supported) **or** extend the nudge engine with an `object-mastered` trigger. Lean: `lesson-complete` now; `object-mastered` only if wanted.
- **Rule A (general→quranic):** on the present-tense lesson, from يَقْرَأُ (everyday) to a Quranic occurrence of the same verb. Payload = an existing/verified text.

## 5. Schema & engine

No new engine is required — `variants`, `acceptedOrders` (+ its validator), `cloze`, `role-pattern`, `smartNudge`, and the payload selector all shipped in m28b1/M28.3. Two small possible touches, both optional and called out as decisions:

- **RTL pill layout** (§4.3) — CSS only.
- **`object-mastered` nudge trigger** (§4.4) — a small `maybeShowNudge` extension, only if Rule B should fire on mastery rather than lesson completion.

## 6. Invariants

Identical to m28b1: additive schema; objectives stay `both` (tag the payload, not the objective) so reachability holds under every preference; buildless runtime; audio untouched; `content:check` / `qa` / `a11y` clean; every new Arabic string verified, every Quranic ref muṣḥaf-checked.

## 7. Acceptance criteria

1. Every A2 unit touched stays completable under general, quranic, and both (validator + a QA walk under seeded emphases).
2. A `build` sentence-builder grades **both** VSO and SVO correct (the acceptedOrders content demo).
3. Present-tense and preposition drills show the learner's track payload; `both` sees both.
4. A2 role pills render and read correctly RTL; a11y clean in both themes.
5. Rule B (and Rule A) nudges fire for the right audience, ≤1/day, dismiss permanently.
6. `content:check` / `qa` / `a11y` clean; new QA checks for the multi-order build and (if added) the object-mastered trigger.
7. Every new string verified; every Quranic ref muṣḥaf-checked.

## 8. Build order (after approval)

Same four-stage rhythm as m28b1, each its own commit + QA/a11y:
1. Vocabulary (new A2 lexemes + tag existing) + confirm the selector covers A2 surfaces.
2. `a2-dual-verbal-sentence` (acceptedOrders VSO/SVO + variants) + the RTL pill layout + A2 role-pattern step.
3. `a2-dual-daily-verbs` (present-tense dual-track + preposition cloze).
4. Smart Nudges (Rule A + Rule B) + any Quranic text objects (muṣḥaf-checked).

## 9. Open decisions

1. **Rule B trigger:** `lesson-complete` (recommended, no engine change) or add an `object-mastered` trigger for "mastering the root ك-ت-ب"?
2. **RTL pill layout:** pill-after-chunk with `nowrap`, or a legend below the sentence? (Lean: nowrap pairs; fall back to a legend if it crowds at 320px.)
3. **New Quranic text objects** for the A2 nudge/examples — confirm we author a small muṣḥaf-checked set (as in m28b1).
4. **Batch size:** all of A2's dual-track content in m28b2, or split verbal-sentence (m28b2) from everyday-exchanges (m28b3)? (Lean: one A2 batch.)

## 10. Risks

- **Quranic text verification** remains the critical-path item (user muṣḥaf check).
- **RTL pill readability** at the narrowest breakpoint (320px) — the reason A1 deferred pills; design and a11y-check carefully.
- **Synthesized audio** for new A2 vocab (same tier-1 recording gap).
- **Scope creep** — keep to A2; resist pulling B1 material forward.
