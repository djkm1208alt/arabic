# M28-B4 — Dual-track content, B1 (first B1 batch)

**Status:** Draft for review — held for approval (ROADMAP standing rule 6). No content authored yet; this plans the work.
**Parent:** [ROADMAP.md](ROADMAP.md) M28 · first dual-track batch above A2. Reuses all m28 machinery (payload selector, per-track `variants`, `cloze`, Smart Nudge, role styling + pills, `acceptedOrders`). Continues the arc of m28b1 (A1) → m28b2/m28b3 (A2). No pack source (the dual-track pack was A1–A2 only) — B1 content is authored from the app's leveled lexicon + `CURRICULUM_ARCHITECTURE.md`, reviewed by the user.

---

## 1. What this is

The first dual-track batch at **B1**, on the grammar unit that most naturally carries the General/Quranic split: **b1-u3 (Verbal Nouns & Participles)** — the maṣdar and the active/passive participle. It layers emphasis onto B1's existing spine the same way the A1/A2 batches did.

## 2. Scope boundary

**In (m28b4):** `b1-u3` (Verbal Nouns & Participles) — dual-track verbal-noun (maṣdar) and participle (ism fāʿil / ism mafʿūl) content: vocab, examples, drills, role-annotated patterns, and nudges.

**Deferred to later B1 batches (m28b5+):** the three B1 *skill* units — `b1-u4` (Reading Unvowelled MSA), `b1-u5` (Understanding Standard Speech / listening), `b1-u6` (Writing Connected Texts). Dual-track applies to them via text selection (general vs devotional passages), but each is its own batch to keep QA manageable — the same reason A2 was split.

**Out:** B2+; UI localization (M29 French + a future Arabic UI, both deferred per the 2026-09-24 content-first steer).

### Metalanguage at B1

Unlike A1 (zero terms) and A2 (functional roles only), **B1 uses formal grammatical terminology** — the existing B1 lessons already say maṣdar, active/passive participle, and name cases/roles. So m28b4 lessons may use those terms, and role pills (introduced at A2) continue here.

## 3. Source & provenance (standing rule 1)

No pack for B1. Every B1 string is authored from the app's leveled lexicon and the architecture's B1 map, then **verified by the user** before merge; any Quranic quotation is muṣḥaf-checked (user verifies against a physical copy); French stays provisional until M29. The vision's rule holds: grammar/phonetics/progression are shared; only the theme, vocabulary payload, and example context differ by track.

## 4. Content deliverables

### 4.1 Vocabulary (new B1 lexemes to author + verify)

Verbal nouns (maṣdar) and participles, tagged by track. Candidates (final set confirmed while authoring):

- **General:** كِتَابَة (writing), قِرَاءَة (reading), كَاتِب (writer), قَارِئ (reader), مَكْتُوب (written).
- **Quranic:** عِبَادَة (worship), صَلَاة (prayer, as a noun), عَابِد (worshipper), دُعَاء (supplication).
- **Both:** عِلْم (knowledge), عَالِم (scholar/knower). (ذِكْر, مُؤْمِن, مَغْفِرَة already exist.)

Each with translit, gloss, level B1, `emphasisTag`, a verified example, and the root noted where helpful.

### 4.2 Lessons

1. **`b1-dual-verbal-nouns`** (`b1-u3`) — the maṣdar: turning a verb into a noun (كَتَبَ → كِتَابَة “writing”; ذَكَرَ → ذِكْر “remembrance”). Dual-track examples (general: الْكِتَابَة مُفِيدَة; quranic: الذِّكْر عِبَادَة) via the payload selector / `variants`; a drill matching verb ↔ maṣdar; a role-pattern example.
2. **`b1-dual-participles`** (`b1-u3`) — active vs passive participle (كَاتِب “writer” / مَكْتُوب “written”; from ع-ب-د: عَابِد “worshipper”). Dual-track examples and a drill telling the doer-noun (ism fāʿil) from the done-to-noun (ism mafʿūl), with role pills.

### 4.3 Role pills & nudges

- Role pills (A2-style, legend below) where a pattern is shown — e.g. marking the participle's role in a sentence.
- One or two Smart Nudges (lesson-complete, audience-gated), e.g. a Quranic learner who learns عِبَادَة → its everyday cousin, or a general learner from كِتَابَة → a Quranic ذِكْر example. Payloads are existing/new verified objects; a Quranic verse only if muṣḥaf-checked.

## 5. Schema & engine

None new. `variants`, `cloze`, `role-pattern`, `smartNudge`, `acceptedOrders`, and the payload selector all exist and are validated in build-content.js. m28b4 is pure content + tags.

## 6. Invariants

Identical to prior batches: additive schema; objectives stay `both` (tag the payload, not the objective) so reachability holds under every preference; buildless runtime; audio untouched; `content:check` / `qa` / `a11y` clean; every new string verified, every Quranic ref muṣḥaf-checked.

## 7. Acceptance criteria

1. `b1-u3` stays completable under general, quranic, and both (validator + QA walk under seeded emphases).
2. The maṣdar and participle drills show the learner's track payload; `both` sees both.
3. Any role pills render and read correctly RTL; a11y clean in both themes.
4. Any nudges fire for the right audience, ≤1/day, dismiss permanently.
5. `content:check` / `qa` / `a11y` clean.
6. Every new string verified; every Quranic ref muṣḥaf-checked.

## 8. Build order (after approval)

Four QA-gated commits, same rhythm as m28b1–m28b3:
1. Vocabulary (new B1 maṣdar/participle lexemes + tags).
2. `b1-dual-verbal-nouns` (maṣdar) + its node.
3. `b1-dual-participles` + its node.
4. Role-pattern examples + nudges (+ any muṣḥaf-checked verse), and flip `b1-u3` to `available`.

## 9. Decisions (carried from m28b2/m28b3 unless changed)

1. Rule B / nudges on `lesson-complete` (no engine change).
2. Role pills as a legend below the line.
3. Muṣḥaf-checked Quranic texts only where needed; user verifies.
4. B1 split into batches: m28b4 = grammar (b1-u3); the skill units (u4–u6) are m28b5+. Confirm, or widen m28b4.
5. **New for B1:** formal metalanguage is allowed (maṣdar, participle, case/role terms), matching existing B1 lessons. Confirm.

## 10. Risks

- **Grammatical accuracy** — maṣdar and participle patterns are irregular across roots; author carefully and lean on user verification.
- **Register/level fit** — keep B1 examples within B1 vocabulary; don't drift into C1 abstraction.
- **Synthesized audio** for new B1 vocab (same tier-1 recording gap).
- **Scope creep** — keep to b1-u3; the skill units are separate batches.
