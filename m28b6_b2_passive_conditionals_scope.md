# M28-B6 — B2, first batch: completing the Passive, Jussive & Conditionals unit

**Status:** Approved 2026-09-24 — all four §9 decisions confirmed, with the user supplying the four Qurʾānic verses (2:183, 4:28, 99:7, 2:197). **Built** in four QA-gated commits on branch `claude/m28b6-b2-scope` (grammar objects + texts + vocab; passive; jussive commands; conditionals). **`b2-u2` now delivers its full title** — mood, passive, jussive and conditionals. No engine change. QA 120 green; a11y clean. All authored Arabic pending the user's linguistic review (rule 1); the four verses flagged for muṣḥaf confirmation.
**Parent:** [ROADMAP.md](ROADMAP.md) M28 · first B2 batch, following m28b4/m28b5 (B1, complete and merged). Reuses all m28 machinery; continues the dual-track emphasis layer and the B1 dual-label convention. No pack source — B2 content is authored from the app's leveled lexicon and `CURRICULUM_ARCHITECTURE.md`, reviewed by the user.

---

## 1. What this is

B2's first batch, aimed at the unit that is **advertised but unfinished**: `b2-u2` ("The Passive, the Jussive & Conditionals") is marked `available` yet holds a single lesson covering only present-tense mood. A learner who opens it today is promised three topics and gets one.

This batch delivers the two missing ones — **the passive** (الْمَبْنِي لِلْمَجْهُول) and **conditional sentences** (جُمْلَة الشَّرْط) — plus a second look at the **jussive** in commands and prohibitions, so the unit finally matches its title.

### What B2 already has (grounding)

| Unit | Status | Reality |
|---|---|---|
| `b2-u1` The Full Case System (Iʿrāb) | available | **7 lessons** — well built (M21 iʿrāb work) |
| `b2-u2` The Passive, the Jussive & Conditionals | available | **1 lesson** — mood only (أَنْ / لَنْ / لَمْ) ← *this batch* |
| `b2-u3` Weak & Irregular Verbs | planned | 0 lessons |
| `b2-u4` Reading the News | planned | 0 lessons |
| `b2-u5` Broadcast & Extended Audio | planned | 0 lessons |
| `b2-u6` Argumentative Writing | planned | 0 lessons |

`gr:mudari-mood` already defines مَرْفُوع / مَنْصُوب / مَجْزُوم, so the jussive is **partly covered** — this batch extends rather than repeats it. B2 currently has only **4 lexemes** (أَنْ، لَنْ، لَمْ، خَوْف), so B2 vocabulary needs building as we go.

## 2. Scope boundary, and the proposed B2 split

Following the split that worked for A2 and B1 (grammar batches, then skill batches):

- **m28b6 (this batch):** `b2-u2` — the passive, the jussive in commands/prohibitions, conditional sentences.
- **m28b7 (next):** `b2-u3` Weak & Irregular Verbs (assimilated / hollow / defective) — a large topic that deserves its own batch.
- **m28b8 (after):** the three B2 **skill** units — `b2-u4` Reading the News, `b2-u5` Broadcast & Extended Audio, `b2-u6` Argumentative Writing.

**Out:** C1+; UI localization (M29 French + a future Arabic UI — still deferred, content-first); the stepwise de-vowelling reader (its own milestone).

### Metalanguage at B2

B2 uses full formal terminology — `b2-u1`'s lessons already name الإعراب, الحال, التمييز and the like. The **dual-label convention from m28b4 continues**: every term appears as `Term (العربية) → plain English function`, e.g. *Al-Mabnī li-l-Majhūl (الْمَبْنِي لِلْمَجْهُول) → "the passive — the doer is not named"*.

## 3. Source & provenance (standing rule 1)

No pack for B2. Every string is authored from the leveled lexicon, then **verified by the user** before merge; any Qurʾānic quotation is muṣḥaf-checked (user confirms against a physical copy); French stays provisional until M29. Grammar and progression remain shared across tracks — only the theme and example payload differ.

## 4. Content deliverables

### 4.1 Grammar objects (new, additive to `content/grammar.json`)

- **`gr:passive`** — الْمَبْنِي لِلْمَجْهُول: the passive, where the doer is not named (كَتَبَ → كُتِبَ; يَكْتُبُ → يُكْتَبُ), with the vowel-pattern shift and نَائِب الْفَاعِل (the stand-in subject).
- **`gr:conditional`** — جُمْلَة الشَّرْط: إِنْ / إِذَا / مَنْ + the two clauses (شَرْط and جَوَاب), and why the verbs take the jussive after إِنْ.

`gr:mudari-mood` is **extended in use, not redefined** — the jussive lesson references it.

### 4.2 Vocabulary (new B2 lexemes)

Modest set, only what the examples need: the conditional particles إِنْ، إِذَا، مَنْ, the prohibitive لَا (النَّاهِيَة), and a handful of B2 nouns/verbs for the passive examples. Final list confirmed while authoring; each with translit, gloss, level B2, `emphasisTag`, a verified example, and morphology noted where useful.

### 4.3 Lessons (three, on `b2-u2`)

1. **`b2-dual-passive`** — the passive: كَتَبَ → كُتِبَ, the vowel shift, and نَائِب الْفَاعِل. Dual-track examples (general: a report/letter "was written"; Quranic/devotional: passive in devotional register), a pattern drill (active ↔ passive), and a role-pattern showing the stand-in subject.
2. **`b2-dual-jussive-commands`** — the jussive beyond لَمْ: the prohibition لَا تَفْعَلْ and the command form, with per-track examples.
3. **`b2-dual-conditionals`** — إِنْ / إِذَا + condition and answer, with a `build` (both clause orders where valid) and per-track sentences.

### 4.4 Nudges

One or two, lesson-complete, audience-gated. The passive is a natural bridge (the Qurʾān uses it constantly); a conditional verse is another. Payloads reuse already-verified texts where possible, per §9.2.

## 5. Schema & engine

**None new.** New grammar objects are ordinary data (`content/grammar.json` already holds 32). `variants`, `cloze`, `build` + `acceptedOrders`, `role-pattern`, `practice-choice`, the payload selector and `smartNudge` all exist and are validated. This batch is content + data only.

## 6. Invariants

As in every prior batch: additive schema; objectives stay `both` (tag the payload, not the objective) so reachability holds under every preference; buildless runtime; audio untouched; `content:check` / `qa` / `a11y` clean; every new string verified; every Qurʾānic ref muṣḥaf-checked.

## 7. Acceptance criteria

1. `b2-u2` is completable under general, quranic and both, and its lesson count matches its title (mood + passive + jussive + conditionals).
2. The passive drill grades the active↔passive transformation; the conditional `build` accepts every valid clause order and rejects invalid ones.
3. Each learner sees their track's examples; `both` sees both.
4. Any nudges fire for the right audience, ≤1/day, dismiss permanently.
5. New grammar objects resolve as objectives and appear correctly in the Grammar reference.
6. `content:check` / `qa` / `a11y` clean.
7. Every new string verified; every Qurʾānic ref muṣḥaf-checked.

## 8. Build order (after approval)

Four QA-gated commits, the established rhythm:
1. Grammar objects (`gr:passive`, `gr:conditional`) + B2 vocabulary.
2. `b2-dual-passive` + node.
3. `b2-dual-jussive-commands` + node.
4. `b2-dual-conditionals` + node + any nudges; confirm `b2-u2` is coherent end to end.

## 9. Decisions to confirm

1. **Batch split** — m28b6 = b2-u2, m28b7 = weak verbs (u3), m28b8 = the three skill units (u4–u6). Confirm, or widen/narrow.
2. **Qurʾānic quotations at B2** — the passive and conditionals are *everywhere* in the Qurʾān, so this is the first batch where real verses genuinely earn their place. Preference: (a) author 2–3 short muṣḥaf-checked verses (you verify, as with 2:282), or (b) stick to original devotional sentences and quote nothing? **Recommendation: (a)** — the 2:282 discovery nudge showed how much the real text adds.
3. **Jussive second look** — keep `b2-dual-jussive-commands` as its own lesson, or fold prohibition/command into the conditionals lesson? **Recommendation: keep it separate** — the unit's title promises the jussive, and commands are high-frequency.
4. **Dual-label convention continues at B2** (`Term (العربية) → English function`), as set for B1. Confirm.

## 10. Risks

- **Grammatical accuracy** — passive vowel patterns vary by verb form (Form I كُتِبَ vs derived forms) and conditional syntax has real subtleties; author conservatively, lean on user verification.
- **Qurʾānic verification** — the critical-path item if §9.2 = (a).
- **Level/register fit** — B2 examples should stretch beyond B1 without drifting into C1 abstraction.
- **Thin B2 vocabulary** — only 4 B2 lexemes exist today; resist inventing vocabulary faster than it can be verified.
- **Scope creep** — b2-u2 only; weak verbs and the skill units are separate batches.
