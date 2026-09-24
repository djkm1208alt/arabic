# M28-B7 — B2, second batch: Weak & Irregular Verbs (الأَفْعَال المُعْتَلَّة)

**Status:** Approved 2026-09-25. §9 settled: three grammar objects; traditional order المِثَال → الأَجْوَف → النَّاقِص; dual-label convention continues; and the user supplied three verified verses (112:3, 112:1, 1:6), one per family. Building now.
**Parent:** [ROADMAP.md](ROADMAP.md) M28 · follows m28b6 (b2-u2, merged — that unit now delivers its full title). Second of the three approved B2 batches: **m28b6 = b2-u2 · m28b7 = b2-u3 (this) · m28b8 = the B2 skill units (u4–u6)**. Reuses all m28 machinery; continues the dual-track layer and the dual-label convention.

---

## 1. What this is

`b2-u3` (Weak & Irregular Verbs) — the three families of **الأَفْعَال المُعْتَلَّة**, verbs whose root contains و or ي and whose letters therefore shift, lengthen or vanish under conjugation:

| Type | Weak letter sits | Example | English |
|---|---|---|---|
| **المِثَال** (assimilated) | **first** root letter | وَعَدَ / يَعِدُ | to promise |
| **الأَجْوَف** (hollow) | **middle** root letter | قَالَ / يَقُولُ | to say |
| **النَّاقِص** (defective) | **last** root letter | دَعَا / يَدْعُو · هَدَى / يَهْدِي | to call upon · to guide |

### The hook: the learner has been using these since A1

Grounding turned up something worth building the unit around. The lexicon **already contains weak verbs the learner has been conjugating for levels** — نَامَ (hollow, A1), مَشَى (defective, A1), وَصَلَ (assimilated, A1), رَأَى (A1), دَعَا (A2) — without ever being told they were irregular. So this unit is not new vocabulary; it is **naming a system the learner has already absorbed**, which is exactly the "pattern recognition before theory" principle. The lessons should open that way.

## 2. Scope boundary

**In (m28b7):** `b2-u3` — three grammar objects and three lessons, one per weak-verb family, dual-track throughout; plus the vocabulary those lessons need, and type notes added to the weak verbs already in the lexicon. `b2-u3` flips to `available` when its lessons land.

**Out:** the B2 skill units (m28b8); C1+; UI localization (M29 French + a future Arabic UI — still deferred, content-first); per-step custom role labels (a future UI-polish milestone, per m28b6).

## 3. Source & provenance (standing rule 1)

No pack for B2. Every string authored from the leveled lexicon, then **verified by the user**; every Qurʾānic quotation muṣḥaf-checked by the user (see §9.2); French provisional until M29. English glosses of any verse stay **original literal working glosses**, never a published translation (the standing copyright constraint). Qurʾānic verses are presented **whole** — reading and nudge payloads only, never scrambled into build tiles (confirmed practice from m28b6).

## 4. Content deliverables

### 4.1 Grammar objects (new, additive)

Three, so each lesson carries its own objective and the Grammar reference lists them separately (matching the granularity of `gr:hal`, `gr:tamyiz`, …):

- **`gr:mithal`** — المِثَال: the weak letter is the **first** root letter; its headline behaviour is that و **drops out** in the present — وَعَدَ → يَعِدُ, وَصَلَ → يَصِلُ.
- **`gr:ajwaf`** — الأَجْوَف: the weak letter is the **middle** one; it appears as a long ا in the past and as و/ي in the present — قَالَ → يَقُولُ, نَامَ → يَنَامُ — and **shortens** when the ending is clipped (لَمْ يَقُلْ).
- **`gr:naqis`** — النَّاقِص: the weak letter is the **last** one; the ending shifts and is **dropped in the jussive** — دَعَا → يَدْعُو → لَمْ يَدْعُ; هَدَى → يَهْدِي → لَمْ يَهْدِ; مَشَى → يَمْشِي.

Each with `rule` (dual-labelled), `examples` (text ids), `commonErrors`, `skills`, `prereqs`.

### 4.2 Vocabulary

**New lexemes** — the roots the user named, plus what the examples need: قَالَ / يَقُولُ (hollow, both — extremely high frequency), وَعَدَ / يَعِدُ (assimilated, both), هَدَى / يَهْدِي (defective, quranic), and likely صَارَ (hollow, both) and وَجَدَ (assimilated, both). Each with translit, gloss, level B2, `emphasisTag`, a verified example, and its **weak-verb type + root** in `notes`.

**Existing weak verbs get type notes** (additive, no meaning change): نَامَ (أَجْوَف), مَشَى (نَاقِص), وَصَلَ (مِثَال), دَعَا (نَاقِص). **رَأَى is deliberately excluded** — it is doubly irregular (hamzated *and* defective, with يَرَى dropping the hamza), so it would muddy the paradigms — so the lessons can point back at verbs the learner already knows.

### 4.3 Texts

Short example sentences per family, track-tagged (general vs devotional), used as the grammar objects' `examples` and the lessons' reading items. Plus any muṣḥaf-checked verse per §9.2.

### 4.4 Lessons (three, on `b2-u3`)

1. **`b2-dual-mithal`** — assimilated: the disappearing و (وَعَدَ → يَعِدُ), anchored on وَصَلَ which the learner already uses.
2. **`b2-dual-ajwaf`** — hollow: قَالَ / يَقُولُ, نَامَ / يَنَامُ, and the shortening under the jussive (لَمْ يَقُلْ) — which ties straight back to the jussive lesson in m28b6.
3. **`b2-dual-naqis`** — defective: دَعَا / يَدْعُو, هَدَى / يَهْدِي, مَشَى / يَمْشِي, and the dropped final letter in the jussive.

Each: a dual-labelled `explain`, track-tagged reading, a per-track conjugation `choice` (`variants`), and a check that targets the family's characteristic trap.

### 4.5 Nudges

One or two, lesson-complete, audience-gated. The defective family is the natural bridge — دَعَا and هَدَى are devotional core vocabulary, while مَشَى is everyday, so the same pattern reads both ways.

## 5. Schema & engine

**None new.** Grammar objects are ordinary data. `variants`, `cloze`, `build` + `acceptedOrders`, `role-pattern`, `practice-choice`, the payload selector and `smartNudge` all exist and are validated. Content + data only.

## 6. Invariants

As every prior batch: additive schema; objectives stay `both` (tag the payload, not the objective) so reachability holds under every preference; buildless runtime; audio untouched; `content:check` / `qa` / `a11y` clean; every new string verified; every Qurʾānic ref muṣḥaf-checked; verses never scrambled.

## 7. Acceptance criteria

1. `b2-u3` is completable under general, quranic and both, and flips to `available`.
2. Each family's characteristic change is drilled and graded: و dropping (يَعِدُ), the hollow shortening (لَمْ يَقُلْ), the defective ending dropping (لَمْ يَدْعُ).
3. Each learner sees their track's examples; `both` sees both.
4. The three new grammar objects resolve as objectives and read correctly in the Grammar reference.
5. Any nudges fire for the right audience, ≤1/day, dismiss permanently.
6. `content:check` / `qa` / `a11y` clean.
7. Every new string verified; every Qurʾānic ref muṣḥaf-checked.

## 8. Build order (after approval)

Four QA-gated commits:
1. Three grammar objects + vocabulary (new lexemes + type notes on existing weak verbs) + example texts (and any verse).
2. `b2-dual-mithal` + node.
3. `b2-dual-ajwaf` + node.
4. `b2-dual-naqis` + node + nudges; flip `b2-u3` to `available`.

## 9. Decisions to confirm

1. **Three grammar objects** (`gr:mithal` / `gr:ajwaf` / `gr:naqis`), one per family — or a single umbrella `gr:weak-verbs`? **Recommendation: three**, matching the app's existing granularity and giving each lesson its own objective.
2. **Qurʾānic verses — SUPPLIED AND VERIFIED by the user (2026-09-25),** one per family, each chosen because the weak letter's behaviour *is* the verse:
   - **المِثَال:** `لَمْ يَلِدْ وَلَمْ يُولَدْ` (112:3) — وَلَدَ → يَلِدُ, the initial و dropping in the jussive. It also carries a **passive** (يُولَدْ), tying straight back to m28b6 — and showing that the و survives in the passive.
   - **الأَجْوَف:** `قُلْ هُوَ اللهُ أَحَدٌ` (112:1) — the long vowel shortening in the imperative قُلْ.
   - **النَّاقِص:** `اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ` (1:6) — the final weak letter dropping in the imperative اهْدِ.
3. **Lesson order** — المِثَال → الأَجْوَف → النَّاقِص (traditional), or lead with الأَجْوَف since قَالَ is the highest-frequency verb in the language? **Recommendation: traditional order**, with قَالَ previewed in the first lesson's opening so the learner sees where it is going.
4. **Dual-label convention** continues (`Term (العربية) → English function`). Confirm.

## 10. Risks

- **Morphological accuracy** — weak-verb conjugation is where Arabic grammar bites hardest (hollow shortening, defective endings, the ي/و split within each family). Author conservatively, restrict to Form I, and lean on user verification.
- **Over-reach** — each family has many sub-cases; this batch teaches the *headline* behaviour per family, not the full paradigm. Say so in the lessons rather than implying completeness.
- **Qurʾānic verification** — critical path if §9.2 verses are included.
- **Scope creep** — b2-u3 only; the skill units are m28b8.
