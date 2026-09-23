# M28-B3 — Third dual-track content batch (A2 Units 4–6)

**Status:** Draft for review — held for approval (ROADMAP standing rule 6). No content authored yet; this plans the work.
**Parent:** [ROADMAP.md](ROADMAP.md) M28 · completes A2 after [m28b2_a2_dual_track_content_scope.md](m28b2_a2_dual_track_content_scope.md) (Units 1–3, merged). Reuses all m28 machinery (payload selector, per-track `variants`, `cloze`, Smart Nudge, role styling, `acceptedOrders`). Source: [docs/EXPANDED_DUAL_TRACK_CONTENT_A1_A2.md](docs/EXPANDED_DUAL_TRACK_CONTENT_A1_A2.md) and [docs/MASTER_CURRICULUM_SPEC.md](docs/MASTER_CURRICULUM_SPEC.md).

---

## 1. What this is

The second half of A2 — Units 4–6 — finishing the dual-track A2 layer. It lands the two pieces explicitly deferred from m28b2: the **present-tense daily-routine drills** and the **preposition `cloze`**, plus a short dual-track reading paragraph. No new engine; same authoring pattern as m28b1/m28b2.

## 2. Scope boundary

**In (m28b3 = A2 Units 4–6):**
- `a2-u6` (Everyday Exchanges) — the present-tense daily-routine drills (dual-track verb objects) and the preposition `cloze`.
- `a2-u5` (Reading Short Paragraphs) — one short dual-track paragraph pair (everyday vs devotional), read via track-tagged items.
- `a2-u4` (Numbers, Counting & Time) — **tagging only.** Numbers/time are universal, so their vocab is `both`; no track-specific lesson is authored here (noted, not an omission).

**Out:** B1+; French UI chrome (M29); any new exercise engine.

## 3. Source & provenance (standing rule 1)

Same discipline as m28b1/m28b2: every string verified against a reference before compile; any Quranic quotation muṣḥaf-checked by the user; French provisional until M29; examples authored from the leveled lexicon.

## 4. Content deliverables

### 4.1 Vocabulary

- **2 new A2 lexemes:** مُسَاعَدَة (help, general), وَقْت (time, both). Each with translit, gloss, level A2, `emphasisTag`, verified example.
- **Tag existing `both`:** غُرْفَة (`lex:hom-02`), كُرْسِيّ (`lex:hom-09`). (Prepositions and the daily verbs were tagged in m28b2.)

### 4.2 Lessons

1. **`a2-dual-daily-verbs`** (`a2-u6`) — present-tense routine. A `choice`/`build` drill per verb with per-track `variants` on the object: يَقْرَأُ (الرِّسَالَةَ ↔ الْقُرْآنَ), يَسْمَعُ (الصَّوْتَ ↔ الْأَذَانَ), يَطْلُبُ (الْمُسَاعَدَةَ ↔ الْمَغْفِرَةَ), يَدْخُلُ (الْغُرْفَةَ ↔ الْمَسْجِدَ), يَذْكُرُ (الِاسْمَ ↔ اللهَ). The verb (shared objective) stays `both`; only the object varies by track.
2. **`a2-dual-prepositions`** (`a2-u6`) — preposition `cloze` (the pack's `fill_in_blank`): الطَّالِبُ يَجْلِسُ ___ الْكُرْسِيِّ → عَلَى; الْمُؤْمِنُ يَدْعُو اللهَ ___ كُلِّ وَقْتٍ → فِي. Per-track `variants` where the sentence differs; the preposition set is shared.
3. **`a2-dual-paragraph`** (`a2-u5`) — a short reading paragraph in two track-tagged versions (a general daily-routine paragraph vs a devotional one), each 2–3 sentences built only from A1–A2 vocab. Optional Rule A/B nudge on completion.

### 4.3 Role pills

Optional: a `role-pattern` step (A2, pills-below) on the daily-verbs lesson, reusing the m28b2 rendering — only if it adds clarity; not required.

### 4.4 Smart Nudges

Reuse the lesson-complete mechanism. Candidate: a Rule B on the daily-verbs lesson (a Quranic learner who drilled يَذْكُرُ اللهَ → the everyday يَذْكُرُ الِاسْمَ), payload an existing/new verified text. Keep to one or two; don't over-nudge.

### 4.5 Quranic texts

Only if a paragraph or nudge needs a verse — author a small muṣḥaf-checked set (user verifies), as in m28b1/m28b2. Lean: the daily-verbs/prepositions content is original example sentences (no Quranic quotation needed); a verse is optional for the paragraph.

## 5. Schema & engine

None new. `variants`, `cloze`, the payload selector, Smart Nudge, and `role-pattern` all exist and are validated in build-content.js.

## 6. Invariants

Identical to m28b1/m28b2: additive schema; objectives stay `both` (tag the payload, not the objective) so reachability holds under every preference; buildless runtime; audio untouched; `content:check` / `qa` / `a11y` clean; every new string verified, every Quranic ref muṣḥaf-checked.

## 7. Acceptance criteria

1. A2 Units 4–6 stay completable under general, quranic, and both (validator + QA walk under seeded emphases).
2. The daily-verb drills and preposition cloze show the learner's track object/sentence; `both` sees both.
3. The dual-track paragraph shows the general or devotional version by emphasis.
4. Any nudges fire for the right audience, ≤1/day, dismiss permanently.
5. `content:check` / `qa` / `a11y` clean.
6. Every new string verified; every Quranic ref muṣḥaf-checked.

## 8. Build order (after approval)

Same staged rhythm, each its own commit + QA/a11y:
1. Vocabulary (2 new + tag غرفة/كرسي) and confirm A2-u4 numbers are `both`.
2. `a2-dual-daily-verbs` (present-tense dual-track objects) + optional role-pattern.
3. `a2-dual-prepositions` (cloze).
4. `a2-dual-paragraph` + any nudges + any muṣḥaf-checked verse.

## 9. Decisions (carried from m28b2, confirm if changed)

1. Rule B on `lesson-complete` (no engine change).
2. Role pills as a legend below the line.
3. Author muṣḥaf-checked Quranic texts only where needed (paragraph/nudge).
4. This is the final A2 batch; B1 (if pursued) would be m28b4+, but B1 dual-track is out of current scope.

## 10. Risks

- **Register creep** — A2 present-tense sentences must stay within A1–A2 vocab; author from the leveled lexicon.
- **Synthesized audio** for new A2 vocab (same tier-1 recording gap).
- **Scope creep** — keep to A2 Units 4–6; no B1 material.
