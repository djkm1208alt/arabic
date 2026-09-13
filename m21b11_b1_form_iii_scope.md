# M21 — Batch 11: b1-u1, Derived Verb Forms — Form III (second slice)

**Status:** proposed. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [reference/iraab-audit.md](reference/iraab-audit.md) §9 Implementation Gate, prerequisite 2 ("B1 is empty"). This is that prerequisite's **second** slice, following [m21b10_b1_form_ii_scope.md](m21b10_b1_form_ii_scope.md)'s Form II batch (merged, `b1-u1` now `available`) — still not M27/iʿrāb content itself, which stays blocked on this *and* M27.0 shipping.
**Base:** `main` @ `52895cd`.

---

## 1. What this batch covers

`b1-u1` ("Derived Verb Forms II–X") already carries one lesson (`b1-derived-forms-ii`) covering Form II only. This batch delivers **Form III** (فَاعَلَ) as an **additive extension of the same `gr:derived-verb-forms` grammar point** — not a new `gr:` id — exactly as that point's own design intent stated in the batch 10 scope doc (§4: "structured to grow additively in later batches... rather than spawning a separate `gr:` point per form"). `b1-u1` stays `available`; its blurb grows to name both forms shipped so far.

## 2. Why Form III next, and why now

- Batch 10 shipped only Form II of ten forms and explicitly deferred "Forms III–X" (its own §6). Form III is the next form in conventional Arabic-pedagogy ordering and — like Form II — has a distinct, teachable meaning tendency: **doing the action toward or together with someone** (a long alif after the first root consonant, وَزْن فَاعَلَ), most often reciprocal/associative, sometimes denominative.
- Checked before proposing: `main` @ `52895cd` still has zero B1 grammar beyond Form II — this is squarely the next increment of Gate prerequisite 2, same track as batch 10.
- The lexicon already anticipates this the same way it anticipated batch 10: `lex:ver-26` سَافَرَ ("to travel," A1) is a genuine, already-taught Form III verb sitting idle, ready to reuse as a worked example with zero new authoring — the same pattern `lex:ver-30` جَرَّبَ played for Form II.

## 3. Checked before planning — what's already in place

- `gr:derived-verb-forms` (B1, from batch 10) already frames the ten-form system in general — this batch extends its `rule` text and `examples` array with Form III content, it does not re-explain root-and-pattern or the general derived-form idea from scratch.
- `content/roots.json`'s ك-ت-ب cluster (`lex:sch-06` كِتَاب, `lex:pla-10` مَكْتَبَة) plus `lex:ver-04` كَتَبَ (Form I, "to write," already taught and used throughout A2's `a2-root-pattern` lesson) is fully taught — a ready-made home for a Form III minimal pair: كَتَبَ ("he wrote") → كَاتَبَ ("he corresponded with / wrote to," reciprocal).
- `lex:ver-21` جَلَسَ (Form I, "to sit," A1, present tense يَجْلِس already documented) supports a second reciprocal minimal pair: جَلَسَ ("he sat") → جَالَسَ ("he sat with / kept company with").
- `lex:peo-11` صَدِيق ("friend," A0, already carries an `example` sentence) supports a denominative Form III verb without inventing a root: صَادَقَ ("to befriend / be friends with").
- `lex:ver-26` سَافَرَ (Form III, A1, "to travel," notes already document its present tense يُسَافِر) needs no new authoring — reusable directly as a fourth worked example, exactly like `lex:ver-30` جَرَّبَ was for Form II.
- No `wordlists/b1.json` exists yet — same call as batch 10: still premature after only two batches. Recommend **not** authoring one yet.

## 4. Proposed shape (not yet written)

- **Grammar (additive, no new `gr:` id):** extend `gr:derived-verb-forms`'s `rule` text with a Form III paragraph — the long-alif وَزْن فَاعَلَ pattern, its reciprocal/associative meaning tendency ("to do X toward/with someone"), contrasted against Form II's causative/denominative tendency already stated. `examples` grows from 4 Form II texts to 8 (4 Form II + 4 new Form III), keeping the array purely additive as designed. `commonErrors` gains one Form II/III contrast entry (doubled middle consonant vs. long alif after the first consonant — the two most visually similar derived forms).
- **New lexemes (3, all level B1):**
  - **كَاتَبَ** (kātaba, "to correspond with / write to") — root ك-ت-ب, paired against already-taught كَتَبَ for the flagship minimal pair.
  - **جَالَسَ** (jālasa, "to sit with / keep company with") — root ج-ل-س, paired against already-taught جَلَسَ for a second minimal pair.
  - **صَادَقَ** (ṣādaqa, "to befriend / be friends with") — denominative from already-taught صَدِيق.
  - (سَافَرَ reused as-is from `lex:ver-26` — no new lexeme, cited again as a fourth worked example.)
  - Each new lexeme's `notes` documents its present tense (يُكَاتِبُ, يُجَالِسُ, يُصَادِقُ), matching the established convention.
- **Content:** 4 new example texts (`textType: sentence`), same discipline as batch 10 — built only from vocabulary already taught plus this batch's new verbs, no proper nouns.
- **Lesson:** extend `content/lessons/b1-derived-forms-ii.json` (or add a second lesson on `b1-u1` — open question below) with a Form III explain block, `reading-practice` covering the new texts, and 2–3 new `practice-choice` questions (recognizing Form III against Form I and Form II, matching a verb to its reciprocal/associative sense).
- **Blurb:** `b1-u1`'s blurb grows from "Form II (تَفْعِيل)..." to name both Form II and Form III, still short of the full "ten forms" framing.

## 5. Open questions

1. **One lesson extended, or a second lesson on `b1-u1`?** Batch 10 built one lesson per grammar point so far; this batch is the first test of the "additive grammar point, multiple lessons per unit" shape the architecture anticipates for the remaining eight forms. Recommend **a second lesson** (`b1-derived-forms-iii`) rather than growing `b1-derived-forms-ii` indefinitely — keeps each lesson a bounded, completable session and avoids one lesson eventually covering all ten forms. Flag if you'd rather keep extending a single lesson.
2. **Exact final verb list beyond the three named above** — none needed; three new + one reused mirrors batch 10's four-worked-example shape. Flag only if you'd rather see more.
3. **Root-note updates in `content/roots.json`** — batch 10 extended the د-ر-س entry's `lexemes`/`note` to mention its verb pair; this batch would do the same for the ك-ت-ب and ج-ل-س clusters. Purely documentation, not validated by the build pipeline. Recommend **yes, continue the convention**.

## 6. Not in this batch

- ❌ Forms IV–X, or any `b1-u1` blurb claim beyond Form II + Form III.
- ❌ Any `gr:mabni-muʿrab`, case-recognition, or other M27/iʿrāb-programme content.
- ❌ Any M27.0 engine/`parse`-type dependency — uses only the existing `sentence`/`reading-practice`/`practice-choice` machinery.
- ❌ `content/wordlists/b1.json` — still premature after two batches.
- ❌ Participles/verbal nouns (e.g. مُكَاتِب) — `b1-u3`'s job, same deferral batch 10 made for Form II's مُدَرِّس.
- ❌ `b1-u2`/`b1-u3`/`b1-u4`/`b1-u5`/`b1-u6` — untouched.
- ❌ Actual lesson/lexeme/grammar JSON, or any `index.html` change — scope only, per your instruction.
