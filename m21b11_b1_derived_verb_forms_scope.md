# M21 — Batch 11: B1 Derived Verb Forms (II, III, V, VIII, X)

**Status:** implemented — see the branch wiring this into the app. `tools/qa-harness.js` 70/70
(including the new lesson walking to completion by name), `tools/a11y-audit.js` clean, `node
tools/lint-fixtures.js` 33/33, `npm run content:check` shows exactly the planned deltas: +5 texts
(94→99), +1 grammar point (18→19), +1 lesson, lexeme count unchanged at 399.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [m21_content_scaleout_scope.md](m21_content_scaleout_scope.md)
§1 ("A2 → B1 → B2 → C1 → C2... this doc scopes A2 concretely and names the shape for what comes
after... B1's own scope doc is written when A2 is done"). A2 closed with batch 10 (PR #42). This is
that doc — **the first B1 content this project has ever authored.**
**Base:** `main` (post batch 10 / PR #42, post M21.6 / PR #41).
**Branch:** `claude/m21b11-derived-verb-forms-impl`.

---

## 0. Before scoping content: does the pipeline need anything new for B1?

Checked directly, not assumed — the same discipline M21 batch 1 applied when it extended the
pipeline from A1 to A2:

- **`tools/content-lint.js`'s ḥarakāt-coverage rule** is hardcoded to `A0 || A1 || A2`
  (`content-lint.js:188`). This is **already correct for B1** — `levels.json`'s own B1 blurb is
  "Mostly-unvowelled MSA," so B1 content is not expected to be fully vowelled the way A0–A2 is.
  No engine change needed; B1 content simply falls outside a rule that was never meant to apply to
  it.
- **`tools/content-lint.js`'s level-fit rule** only recognizes `A1`/`A2` and only loads
  `content/wordlists/a1.json`/`a2.json` (`content-lint.js:120,200`). There is no `wordlists/b1.json`.
  **This batch doesn't need one.** Unlike A1/A2 (new *lexical items*), "B1 vocabulary" here is
  overwhelmingly new *morphological forms of roots already in the lexicon* — see §2. A checklist
  of brand-new English glosses isn't the right tool for that; extending level-fit to B1 is deferred
  to whichever future B1 batch actually needs brand-new lexemes (there will be some — new
  participle/maṣdar nouns in `b1-u3`, relative-clause vocabulary in `b1-u2` — but not this one).
- **No new `exerciseTypes`, no new `textType`, no new engine code of any kind.** This batch is
  content only, on a fully proven pipeline (`gr:` + `txt:` objects, an `explain` → `reading-practice`
  → `exercise` → `complete` lesson, exactly like every A2 grammar batch).

## 1. What this batch covers

`b1-u1`'s title is "Derived Verb Forms II–X" — all ten forms. Authoring all ten in one batch would
be exactly the "AI-mountain-of-content" the roadmap's own quality-over-quantity rule exists to
prevent. This batch covers **five: II, III, V, VIII, X** — chosen because of the finding in §2, not
arbitrarily — and explicitly leaves IV, VI, VII, IX to a follow-up batch (§8).

## 2. The finding that shapes this batch: five derived forms are already hiding in the lexicon

Checked every one of the 29 existing verb lexemes' root and pattern directly, not assumed. One
(`lex:ver-30` جَرَّبَ) is already flagged in its own `notes` as "Form II... taught in B1's Derived
Verb Forms unit" — a direct, already-existing forward reference this batch pays off. Re-checking the
other 28 the same way turned up **four more derived forms sitting undocumented as plain A0/A1
vocabulary**:

| Verb | Root | Pattern | Form | Currently taught as |
|---|---|---|---|---|
| `lex:ver-30` جَرَّبَ (to try) | ج-ر-ب | فَعَّلَ | **II** | A2 vocabulary (already flagged) |
| `lex:ver-26` سَافَرَ (to travel) | س-ف-ر | فَاعَلَ | **III** | plain A1 verb, no form noted |
| `lex:ver-06` تَكَلَّمَ (to speak) | ك-ل-م | تَفَعَّلَ | **V** | plain A1 verb, no form noted |
| `lex:ver-23` اِشْتَرَى (to buy) | ش-ر-ي | اِفْتَعَلَ | **VIII** | plain A1 verb, no form noted |
| `lex:ver-13` اِسْتَيْقَظَ (to wake up) | ي-ق-ظ | اِسْتَفْعَلَ | **X** | plain A1 verb, no form noted |

**This means batch 11 needs zero new lexemes.** Every example verb the five targeted forms need is
a word learners already know — the same "check the lexicon first" discipline every A2 batch
followed, applied here to find hidden structure in vocabulary rather than gaps in a checklist.

## 3. What ships

**5 lexeme note updates** (`content/lexemes.json`) — `lex:ver-06`, `lex:ver-13`, `lex:ver-23`,
`lex:ver-26` each gain a `notes` addition naming their form and root, in the same voice
`lex:ver-30`'s existing note already uses (e.g. `lex:ver-06`: "Form V verb (root ك-ل-م) — the
reflexive of a hypothetical Form II 'to address/speak to' — its derivational pattern is formally
taught in B1's 'Derived Verb Forms II–X' unit."). Purely additive; no other field changes, no level
changes.

**1 new grammar point**, `gr:derived-verb-forms`, modeled directly on `gr:root-pattern`'s own shape
(§ below is content, not final prose — the actual `rule` text is written at implementation time,
reviewed then, not rubber-stamped now):

- Names all ten forms by number and pattern (فَعَّلَ, فَاعَلَ, أَفْعَلَ, تَفَعَّلَ, تَفَاعَلَ, اِنْفَعَلَ,
  اِفْتَعَلَ, اِفْعَلَّ, اِسْتَفْعَلَ) — the "how to recognise them in text" part of `b1-u1`'s blurb
  applies to reading all ten, even though only five get worked examples here.
- Teaches meaning tendencies for the five worked forms specifically: II causative/intensive, III
  reciprocal/effort-toward, V reflexive-of-II ("to become X'd" / to do II's action to oneself), VIII
  reflexive/middle voice, X "to seek/consider X" or reflexive-causative.
- `commonErrors`, matching `gr:root-pattern`'s own honest-about-limits style: patterns are strong
  *tendencies*, not fixed rules (the same caveat `gr:root-pattern` already states for noun patterns,
  extended here to verb forms) — a given root's actual derived-form meaning can be lexicalized and
  drift from the "textbook" tendency (اِشْتَرَى doesn't transparently mean "to seek to sell" from
  ش-ر-ي's bidirectional buy/sell sense; it's simply "to buy").
- `prereqs: ["gr:root-pattern"]` — directly builds on the A2 concept, per `b1-u1`'s own curriculum
  prereq (`["a2-u1", "a2-u3"]`).

**Example texts** (`content/texts.json`, `source: "m20"` — matching every other grammar-point text,
per the `build-content.js` source-enum, not the `m21bN` doc-numbering scheme): 5 new sentences,
one per targeted form, each built from the retroactively-annotated verb plus already-taught
vocabulary only. E.g. (illustrative, not final): سَافَرَ الرَّجُلُ إِلَى مِصْرَ (Form III), تَكَلَّمَتِ
الْمَرْأَةُ بِالْعَرَبِيَّةِ (Form V), اِشْتَرَتِ الطَّالِبَةُ كِتَابًا (Form VIII), اِسْتَيْقَظَ الْوَلَدُ
مُبَكِّرًا (Form X) — the real wording is written and checked at implementation time.

**1 new lesson**, `b1-derived-verb-forms`, wired onto `b1-u1` as its first lesson (`unitId: "b1-u1"`, `order: 1`). Shape: `explain` (the concept — a form is a
pattern poured into a root you already know how to write, the same idea `gr:root-pattern` taught for
nouns, now applied to verbs) → `reading-practice` (`fromObjectives`, the 5 example texts) →
`practice-choice` (form recognition: "جَرَّبَ — which pattern is this?", options from the 9 named
patterns, matching how `gr:root-pattern`'s own lesson tested root recognition) → `complete`.
`b1-u1` flips `"planned"` → `"available"` — **B1's first available unit.**

## 4. Invariants held

- No changes to `content/wordlists/*.json`, `content/grammar.json`'s existing points, or any
  existing lexeme's `ar`/`en`/`level`/`pos` field — only `notes` gain an addition on 4 lexemes.
- `buildAudioControl()` / `playArabicAudio()` untouched.
- Zero runtime dependencies / zero runtime fetches.
- No engine change (§0) — this is a pure content batch on the existing pipeline.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- All 5 targeted verbs' forms are named correctly and match the traditional Form II/III/V/VIII/X
  patterns exactly (spot-checkable against any standard Arabic reference grammar).
- `gr:derived-verb-forms` reuses only already-taught vocabulary in its examples — zero new lexemes.
- `tools/qa-harness.js` full regression clean; `tools/a11y-audit.js` clean.
- `npm run content:check` shows exactly 5 new texts + 1 new grammar point + 1 new lesson; lexeme
  count unchanged (399) since no lexeme is added, only 4 existing ones' `notes` edited.
- `b1-u1` flips `planned` → `available`.

## 7. Out of scope

- Forms IV, VI, VII, IX — see §8.
- `b1-u2`–`b1-u6` (relative clauses, إنّ وأخواتها, maṣdar, participles, subjunctive, unvowelled
  reading, listening, writing) — each is its own future batch.
- Any change to `gr:root-pattern` itself or the A2 lessons that use it.
- Full verb-form conjugation paradigms (all persons/tenses per form) — `b1-u1`'s own blurb says
  "recognition... in text," not production drilling; the descriptor's "recognition + high-frequency
  production" is satisfied by the `practice-choice` recognition step plus the fact that all five
  example verbs are already-known, already-producible A1/A2 vocabulary — not by a new conjugation
  drill this batch doesn't build.

## 8. Proposed follow-up batch (planning only, not committed)

Forms IV (أَفْعَلَ), VI (تَفَاعَلَ), VII (اِنْفَعَلَ) have **no existing example in the lexicon** —
unlike this batch, that follow-up would need 2–3 new verb lexemes, checked against `wordlists/a1.json`
`/a2.json` first in case a suitable word already exists under a different `pos` tag. Form IX
(اِفْعَلَّ, colors/defects — e.g. اِحْمَرَّ "to turn red") is rare enough that standard MSA courses
often defer it past B1 entirely; recommend deferring it to C1+ rather than force-fitting it here,
subject to the same review this doc itself is waiting for.

## 9. Rollout

Plan → this branch → draft PR → review → implementation only on explicit approval, per Master
Standards (same shape as every prior M21 batch). This is B1's first batch — worth a closer read
than usual before approval, since every wording/example choice here sets the precedent the next
five B1 units follow.

## 10. Implementation notes

Shipped exactly as designed in §3 — no deviations. The 4 lexeme `notes` additions match `lex:ver-30`'s
existing voice exactly; `gr:derived-verb-forms` mirrors `gr:root-pattern`'s shape (`rule` names all
nine derived patterns for reading recognition, `examples` point at the 5 worked texts,
`commonErrors` carries the same "tendency, not a rule" caveat plus two new errors specific to verb
forms). The 5 example sentences (§3) reuse zero new vocabulary — `الرَّجُلُ`/`الْمَرْأَةُ`/`الطَّالِبَةُ`/
`الْوَلَدُ`/`الطَّعَامَ`/`الْمَدِينَةِ`/`الْعَرَبِيَّةِ`/`صَبَاح` were all already-taught A0/A1 vocabulary,
confirmed by direct lookup before writing a single sentence.

`b1-u1`'s blurb was narrowed to name exactly what ships (Forms II/III/V/VIII/X) rather than kept as
the original "the ten forms" placeholder — the same honesty-about-scope correction `a2-u4`'s and
`a2-u6`'s blurbs already got once their real content existed to check them against. `b1-u1` flips
`"planned"` → `"available"` — **B1's first available unit.**

One deliberate non-change, checked and confirmed correct rather than assumed: `content/curriculum.json`'s
top-level `levels[]` array still lists `A2` as `"status": "planned"` even though all six `a2-uN`
units have been `"available"` for two batches now — that field is evidently not kept in sync with
unit-level completion by this project's own established convention (nothing in the A2 batches ever
touched it either). Left untouched for B1 too, for consistency with that precedent; not this
batch's job to relitigate.

`node tools/build-content.js --write-app` then `--check`: 578 objects, exactly the planned deltas
(+5 texts, +1 grammar point, +1 lesson, lexemes unchanged at 399). `npm run content:lint`: 84
advisory warnings (down from the pre-existing baseline of 90 — the 4 edited lexemes are now
referenced by the new lesson's `objectives` and dropped out of the orphaned-lexeme list; zero new
warnings introduced). `node tools/lint-fixtures.js`: 33/33. `npm run qa`: 70/70, including
`catalog lesson "b1-derived-verb-forms" walks to completion` by name. `node tools/a11y-audit.js`:
clean.
