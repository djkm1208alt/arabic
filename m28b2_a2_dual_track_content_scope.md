# M28-B2 — Second dual-track content batch (A2)

**Status:** Approved 2026-09-23 with these decisions: (1) Rule B fires on `lesson-complete` (no engine change); (2) role pills render **below** the sentence line (a legend), not inline; (3) author a small muṣḥaf-checked Quranic text set (user verifies against a physical copy); (4) **split A2 in two** — **m28b2 = Units 1–3** (Verbal Sentence, Iḍāfa, Root & Pattern), **m28b3 = Units 4–6** (Numbers/Time, Reading Paragraphs, Everyday Exchanges) — to keep QA manageable. **Built 2026-09-23** on branch `claude/m28b2-a2-dual-track-scope` (vocab + pills-below rendering; `a2-dual-verbal-sentence` with acceptedOrders VSO/SVO + A2 role pills; `a2-dual-idafa`; `a2-dual-root-pattern` + Rule B nudge; two texts incl. `txt:quran-fatiha-2` **awaiting the user's muṣḥaf check**). QA 109/109, a11y clean. All authored Arabic pending the user's linguistic review (rule 1).
**Parent:** [ROADMAP.md](ROADMAP.md) M28 · builds on [m28b1_a1_dual_track_content_scope.md](m28b1_a1_dual_track_content_scope.md) (the A1 batch, merged) and reuses all its machinery (payload selector, per-track `variants`, Smart Nudge, role styling, `acceptedOrders`). Source: [docs/EXPANDED_DUAL_TRACK_CONTENT_A1_A2.md](docs/EXPANDED_DUAL_TRACK_CONTENT_A1_A2.md) (its A2 material) and [docs/MASTER_CURRICULUM_SPEC.md](docs/MASTER_CURRICULUM_SPEC.md) (A2, Units 08–10).

---

## 1. What this is

The A2 dual-track content batch — the same pattern as m28b1, one level up, on the app's existing A2 spine. It reuses every mechanism m28b1 built and adds the pieces A1 couldn't exercise because **A1 is verbless**:

- the **multi-order `acceptedOrders` sentence-builder** (deferred from m28b1) — a verbal sentence graded correct in both VSO (يَقْرَأُ الْمُسْلِمُ الْقُرْآنَ) and SVO (الْمُسْلِمُ يَقْرَأُ الْقُرْآنَ) order;
- **present-tense daily-routine drills** with dual-track verb objects (يَقْرَأُ الرِّسَالَةَ vs يَقْرَأُ الْقُرْآنَ);
- **preposition `cloze` drills**, dual-track;
- the **first role pills** — A2 shows the tap-labels (Topic/Doer/Receiver/Description) that A1 deliberately omitted (`renderRolePattern({showLabels:true})`).

## 2. Scope boundary

**In (m28b2 = A2 Units 1–3):** `a2-u1` (The Verbal Sentence), `a2-u2` (Iḍāfa / genitive construct), `a2-u3` (Root & Pattern) — verbal-sentence content (the acceptedOrders VSO/SVO demo + A2 role pills), dual-track iḍāfa possession, root-family examples, the Rule B nudge (ك-ت-ب), and the muṣḥaf-checked Quranic text set.

**Deferred to m28b3 (A2 Units 4–6):** `a2-u4` (Numbers/Counting/Time), `a2-u5` (Reading Paragraphs), `a2-u6` (Everyday Exchanges) — the present-tense daily-routine drills and preposition `cloze` move there.

**Out (later still):** B1+ content; French UI chrome (M29); any new exercise engine (all machinery already exists).

## 3. Source & provenance (standing rule 1)

Same discipline as m28b1: the pack is AI-drafted, so every string is verified against a reference before it compiles; any Quranic quotation is muṣḥaf-checked by the user; French stays provisional until M29; examples are authored from the app's leveled lexicon. m28b1 established the review loop; this batch repeats it.

## 4. Content deliverables

### 4.1 Vocabulary

- **Tag existing A2-relevant lexemes `both`** (everyday words are universal, per the m28b1 decision): the prepositions في/على/مِن/إلى/مع (`lex:prt-*`) and verbs كَتَبَ/جَلَسَ/فَتَحَ (`lex:ver-*`) — additive `emphasisTag` only.
- **~6 new A2 lexemes to author + verify:** رِسَالَة (letter/message, general), صَوْت (sound/voice, both), أَذَان (call to prayer, quranic), مَغْفِرَة (forgiveness, quranic), دَعَا/يَدْعُو (to supplicate, quranic), فَجْر (dawn, both). Each with translit, gloss, level A2, `emphasisTag`, a verified example, and present-tense note for the verb.

### 4.2 Lessons (m28b2 = Units 1–3)

1. **`a2-dual-verbal-sentence`** (`a2-u1`) — the verbal sentence with a **`build`/`word` `acceptedOrders`** drill accepting VSO + SVO, per-track `variants` (everyday vs Quranic sentence), and the A2 role-pattern step (§4.3). The deferred multi-order demo (m28b1 acceptance criterion 5).
2. **`a2-dual-idafa`** (`a2-u2`) — dual-track possession/genitive: general (بَيْتُ الْمُعَلِّمِ) vs Quranic (كِتَابُ اللهِ, رَسُولُ اللهِ), on the shared `gr:idafa` rule.
3. **`a2-dual-root-pattern`** (`a2-u3`) — one root across its family (ك-ت-ب → كَتَبَ / كِتَاب / مَكْتَب / مَكْتَبَة, all `both`), and the **Rule B nudge** (mastery of ك-ت-ب → everyday-email use) on lesson completion.

### 4.3 Role pills (A2 — first use, pills BELOW the line)

Add a `role-pattern` step **with `showLabels: true`** to the verbal-sentence lesson: the sentence colour-coded (Doer green / Receiver blue / Description amber), with the role labels rendered as a **legend row beneath the sentence** (decision 2), not inline — cleaner in RTL and at 320px. `renderRolePattern` changes: when `showLabels`, emit the coloured line, then a `.role-pattern-legend` row of one pill per distinct role present (reading order). Re-verify a11y in both themes.

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

## 9. Decisions (resolved 2026-09-23)

1. **Rule B trigger:** `lesson-complete` (no engine change).
2. **RTL pill layout:** labels as a **legend row below** the sentence, not inline.
3. **Quranic text objects:** author a small muṣḥaf-checked set; the user verifies against a physical copy.
4. **Batch size:** split — **m28b2 = Units 1–3**, **m28b3 = Units 4–6**.

## 10. Risks

- **Quranic text verification** remains the critical-path item (user muṣḥaf check).
- **RTL pill readability** at the narrowest breakpoint (320px) — the reason A1 deferred pills; design and a11y-check carefully.
- **Synthesized audio** for new A2 vocab (same tier-1 recording gap).
- **Scope creep** — keep to A2; resist pulling B1 material forward.
