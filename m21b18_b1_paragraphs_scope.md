# M21 — Batch 18: B1 Joining Ideas into Paragraphs (closing b1-u2)

**Status:** implemented. `npm run content:check` clean at 615 objects (412 lexemes, 21 grammar
points, 121 texts, 38 units, 69 lessons); `npm run qa` 84/84; `node tools/a11y-audit.js` clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b1-u2`'s own blurb, which named "joining ideas into
paragraphs" as its last remaining open topic after batches 13–17 closed relative clauses and all
ten sisters of إنّ.
**Base:** `main`, post batch 17.

---

## 1. What this batch covers

A reading-comprehension capstone for `b1-u2`: one connected, multi-sentence paragraph that puts
the unit's whole toolkit to work together — a subject-relative clause, `gr:kana`, three sisters of
إنّ (لٰكِنَّ, أَنَّ, لَعَلَّ) with attached-pronoun subjects, and the A2 narrative connectors
(ثُمَّ, أَخِيرًا) — followed by comprehension questions, the same `"paragraph"` textType and
comprehension-question style `a2-reading-paragraphs` (M21 batch 8) established.

**Zero new lexemes, zero new grammar.** This is application, not new content: every word and every
grammar point in the paragraph was taught somewhere in batches 13–17 (or earlier). The skill being
taught is combining already-known pieces into connected prose, not a new rule.

## 2. Checked before authoring

- **Every word in the paragraph verified against `content/lexemes.json` individually** before
  writing the final text — not assumed from memory. A first draft used several words that turned
  out not to exist yet (`عَنْ` "about," `حَقِيقِيّ` "true," `جِدًّا` "very," `أَعَادَ` "to give
  back") and was rewritten around confirmed vocabulary instead of adding new lexemes to make the
  draft work.
- **Two constructions were deliberately avoided as ungrounded**, even though they would read as
  natural Arabic to a fluent speaker: attaching a pronoun directly to a preposition (إِلَيْهَا,
  "to it") — `gr:attached-possessive`'s own rule text frames the taught suffixes as attaching to a
  *noun*, not a preposition, so the paragraph repeats the noun (`إِلَى الْحَدِيقَةِ`) instead; and
  an existential "there is" clause with a sister of إنّ governing a delayed, fronted-predicate
  subject (`إنّ في المدينة حديقةً`-shape) — a genuinely contested construction among reference
  grammars (flagged in `docs/iraab-audit.md`'s own "أو نقول" contested-parse category for
  C1/C2), not something to teach silently in a B1 reading passage.
- **A second paragraph was drafted and dropped.** Extending the plural-relative-clause example
  (`الْمُعَلِّمُونَ الَّذِينَ...`) into its own short narrative kept needing either an unverified
  broken plural (`سُعَدَاء`, "happy," plural), an untaught 3rd-person-plural verb conjugation
  (`يُحِبُّونَ`), or the "our/their" possessive suffixes (`ـنَا`/`ـهُمْ`), none of which
  `gr:attached-possessive` teaches (it names only `ـِي`/`ـكَ`/`ـكِ`/`ـهُ`/`ـهَا`). Rather than
  quietly teach a sixth/seventh suffix or an unverified plural inside a reading passage, this batch
  ships one well-built, fully-verified paragraph instead of two — quality over quantity, per this
  project's own Philosophy §3.

## 3. What ships

**0 new lexemes. 0 new grammar points.**

**1 new example text**, `txt:read-para-teacher-trip` (`textType: "paragraph"`, matching
`a2-reading-paragraphs`'s own shape): four sentences — a subject-relative clause with a nominal
predicate (الرَّجُلُ الَّذِي هُوَ مُعَلِّمٌ), `gr:kana`, لٰكِنَّ with an attached pronoun, أَنَّ,
the connectors ثُمَّ and أَخِيرًا, and a closing لَعَلَّ with an attached pronoun — a short story
about a teacher's trip, weather, and a garden, built entirely from vocabulary already taught in
batches 13–17 plus earlier A1/A2 lexemes.

**1 new lesson**, `b1-paragraphs`, `b1-u2`'s sixth and closing lesson (`order: 6`): `explain` →
`reading-practice` → 3 comprehension-style `practice-choice` questions (main idea, a weather
detail, a sequencing detail) → `complete` — matching `a2-reading-paragraphs`'s own comprehension
framing over grammar-recognition, since every grammar point here already has its own dedicated
lesson elsewhere in the unit.

**1 small edit:** `b1-u2`'s blurb updated to state the unit is complete — relative clauses,
إنّ's family, and joining them into paragraphs — with dual relative pronouns named as a deliberate,
permanent scope boundary (the same framing `b1-u1`'s blurb gives Form IX), not a pending item.

## 4. Invariants held

- No change to any of batches 13–17's grammar points, lexemes, or lessons.
- No new construction introduced beyond what `gr:relative-clauses`, `gr:kana`, `gr:inna-sisters`,
  and `gr:attached-possessive` already explicitly state — checked word-by-word and
  construction-by-construction before writing, per §2.
- `buildAudioControl()` / `playArabicAudio()` untouched. Zero engine changes.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- Every word in `txt:read-para-teacher-trip` resolves to an existing lexeme.
- The paragraph uses no construction beyond what its cited grammar points already teach.
- `npm run content:check`: +0 lexemes, +0 grammar points, +1 text, +1 lesson.
- `tools/qa-harness.js` full regression clean; `tools/a11y-audit.js` clean.
- `b1-u2` stays `available`; blurb states the unit complete short of dual relative pronouns.

## 7. Out of scope

- A second paragraph — dropped per §2, a genuine follow-up once broken plurals or a fuller
  possessive-suffix set (`ـنَا`, `ـهُمْ`, …) exist as taught content.
- Dual relative pronouns — permanently deferred past B1, not this unit's job.
- `b1-u1` (verb forms) and `b1-u7` (role recognition) are separate units, untouched here.

---

**Implemented** on `main`. `b1-u2` is now complete. See ROADMAP.md M21 row for verification results.
