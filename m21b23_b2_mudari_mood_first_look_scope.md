# M21 — Batch 23: B2 — Present-Tense Mood, First Look (أَنْ / لَنْ / لَمْ)

**Status:** implemented and verified — `npm run content:check` clean at 635 objects (415 lexemes,
23 grammar points, 136 texts, 38 units, 74 lessons); `npm run qa` 89/89; `node tools/a11y-audit.js`
clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · opens `b2-u2` ("The Passive, the Jussive &
Conditionals") · [docs/iraab-audit.md](docs/iraab-audit.md) §8's proposed table maps this
topic to `B2-iʿrāb-3` / `b2-u2`. Follows the completion of `gr:case-system`'s full noun-case arc
(batches 20–22) — this is the case system's counterpart on the VERB.

---

## 1. What this batch covers

The present tense's own three moods — مَرْفُوع (default), مَنْصُوب (triggered by أَنْ/لَنْ), مَجْزُوم
(triggered by لَمْ) — using the exact same three Arabic names `gr:case-system` uses for noun case,
but a genuinely separate system (marking the verb's ending, not a noun's role; `gr:case-system`'s
own rule text has flagged this exact possible confusion since batch 20). لَمْ is also the first way
this project teaches to negate a PAST-tense **verbal** sentence — `gr:negation-a1` only covers
negating a **nominal** sentence (لَيْسَ/لَا/مَا).

**Deliberately narrow "first look," matching the case-system precedent:** only the two cleanest,
most common subjunctive particles (أَنْ, لَنْ) and one jussive particle (لَمْ) are taught. Named but
not taught: other subjunctive particles (كَيْ, حَتَّى, لِـ), other jussive triggers (لَا النَّاهِيَة the
prohibition/negative-imperative, لَام الْأَمْر the command particle, the conditional particles
إِنْ/مَنْ/مَا), and how plural/dual forms mark مَجْزُوم differently (by dropping the final ن instead of
adding a sukūn).

## 2. Checked before authoring

- **Verified the mood system against external sources before writing anything** — this project's
  standing rule ("never invent Arabic") plus this session's own prior catch on diptotes made this
  non-negotiable for a topic with zero prior in-repo coverage. Two independent sources (an
  Arabic-language grammar reference and an English-language teaching site) confirm: مَرْفُوع is the
  default (ḍamma); أَنْ/لَنْ/كَيْ trigger مَنْصُوب (fatḥa replacing ḍamma); لَمْ/لَا الناهية/لام الأمر/the
  conditionals trigger مَجْزُوم (sukūn replacing ḍamma, or the ن-drop for plural/dual).
- **Checked the lexicon first and found a real gap**: none of أَنْ, لَنْ, or لَمْ existed as lexemes,
  and no grammar point covered verbal-sentence past-tense negation at all — unlike the three
  case-system batches, this one could not stay at zero new vocabulary. `lex:prt-33` (أَنَّ)'s own
  notes, written back when it was authored, already flagged "not to be confused with أَنْ (the
  subjunctive 'to')" — anticipating this exact gap.
- **Checked the `label` exercise engine's schema before assuming it could be reused**:
  `LABEL_CASES` only defines `raf`/`nasb`/`jarr` — there is no `jazm` (jussive) value, because the
  engine was built for NOUN case (M21.6), not verb mood. Extending the engine to add a jussive case
  value and a verb-specific role would be a real engine change needing its own scope/testing, not a
  content-batch decision. **This batch stays purely additive at the content layer** by teaching
  mood entirely through `explain`/`reading-practice`/`practice-choice` steps — no `label` steps, no
  `parse` arrays on the new texts, no engine change.
- **Confirmed `أَرَادَ`'s documented present tense** (`lex:ver-16`'s own notes: "Present tense:
  يُرِيد") before using `يُرِيدُ أَنْ يَذْهَبَ` as the أَنْ example.
- **Verified `ذَهَبَ`/`يَذْهَبُ` (already the project's standard present-tense example verb, used
  across all seven persons since `gr:present-tense`) is a sound/regular triliteral verb** — no
  hollow-root or weak-final irregularity to complicate a first look at mood.

## 3. What ships

**3 new lexemes** (particles, B2): `lex:prt-40` (أَنْ, "to"), `lex:prt-41` (لَنْ, "will never"),
`lex:prt-42` (لَمْ, "did not"). This batch could not stay at zero new vocabulary like the three
case-system batches — the mood-triggering particles themselves didn't exist yet.

**3 new texts**, all built on the already-established `ذَهَبَ`/`يَذْهَبُ` example verb, forming a
minimal-pair set with the existing `txt:gram-verb-he` (مَرْفُوع reference): `txt:gram-mood-subj-an`
(هُوَ يُرِيدُ أَنْ يَذْهَبَ...), `txt:gram-mood-subj-lan` (هُوَ لَنْ يَذْهَبَ...), `txt:gram-mood-juss-lam`
(هُوَ لَمْ يَذْهَبْ...).

**1 new grammar point**, `gr:mudari-mood` — a new id, not an additive extension of `gr:case-system`,
since mood and case are explicitly different systems per `gr:case-system`'s own rule text.

**1 new lesson**, `b2-mudari-mood-first-look`, `b2-u2`'s first (`order: 1`): `explain` →
`reading-practice` (all 4 objective texts) → 4 `practice-choice` steps (default/مرفوع baseline,
أنْ, لنْ, لمْ) → `complete`.

**`b2-u2` flips `planned` → `available`, and its `prereqs` corrected** from `["b1-u3"]` to
`["a2-u1"]`. `b1-u3` (verbal nouns & participles) was a speculative placeholder set at M16 for the
unit's *eventual* full scope (passive genuinely needs participle-shaped morphology) — but mood/
jussive doesn't depend on it at all, and `b1-u3` itself is still `planned` with zero lessons, so
leaving it as the only prereq would have made this unit's first real content depend on content that
doesn't exist yet. `a2-u1` (which actually supplies `gr:verbal-sentence`) is the real, satisfied
dependency for this specific lesson. This is the same class of correction batch 6's own note
described: "corrected to name the words the lesson actually teaches... rather than the different
placeholder examples written speculatively back at M16, before any [real] content existed." The
passive/conditionals portions of `b2-u2` may still need `b1-u3` once THEY are authored — that
dependency isn't lost, just not asserted before it's true for what's actually shipped.

## 4. Invariants held

- **Zero changes to `exerciseTypes.label`, `exGenLabel`, `LABEL_ROLES`, or `LABEL_CASES`** — the
  explicit reason this batch uses `practice-choice` instead of `label` for its exercises.
- No change to `gr:case-system`, `gr:present-tense`, `gr:verbal-sentence`, or `gr:negation-a1`
  beyond being cited as prereqs/cross-references.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- New lesson's title checked for Arabic-character ratio (≈23%) before running QA.

## 5. Migration requirements

None. Purely additive (3 new lexemes; 3 new texts; 1 new grammar point; 1 new lesson + curriculum
stub; `b2-u2`'s status flip and prereqs correction).

## 6. Acceptance criteria

- The mood rules (which particle triggers which mood, and how each mood is marked on a sound verb)
  are linguistically correct, verified against external sources rather than memory alone.
- `npm run content:check`: +3 lexemes, +3 texts, +1 grammar point, +1 lesson; `b2-u2` flips to
  `available` with a corrected, actually-satisfied prereq.
- `tools/qa-harness.js` full regression clean, including the new lesson walking to completion with
  all 4 `practice-choice` steps grading correctly; `tools/a11y-audit.js` clean.
- All three `b2-case-system-*` lessons and `b1-role-recognition` still pass unchanged.

## 7. Out of scope

- كَيْ, حَتَّى, لِـ (other subjunctive triggers); لَا النَّاهِيَة, لَام الْأَمْر, and the conditional
  particles إِنْ/مَنْ/مَا (other jussive triggers) — all named in `gr:mudari-mood`'s rule text, not
  taught yet.
- Plural/dual مَجْزُوم marking (the ن-drop, e.g. تَذْهَبُونَ → لَمْ تَذْهَبُوا) — named, not taught.
- The passive voice and real/hypothetical conditionals — `b2-u2`'s other two named topics, each
  their own future batch; `b1-u3` (participles) genuinely still needed for the passive specifically.
- Extending `exerciseTypes.label`/`LABEL_CASES` with a jussive value or a verb-mood role — a real
  engine change, deliberately not bundled into a content batch. If a future batch wants `label`-
  style mood-tagging exercises, that extension needs its own scoping and testing, the same way
  M21.6 was its own milestone before M21.7's content could ride on it.

---

**Implemented and verified** on `main`.
