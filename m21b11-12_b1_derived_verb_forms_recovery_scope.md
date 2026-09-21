# M21 — Batches 11–12 (recovered + restructured): b1-u1, Derived Verb Forms II–X

**Status:** implemented, on branch `recover/m21-full-history`.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [docs/iraab-audit.md](docs/iraab-audit.md) §9
Implementation Gate, prerequisite 2 ("B1 is empty").
**Supersedes (locally):** `m21b10_b1_form_ii_scope.md`, `m21b11_b1_form_iii_scope.md`,
`m21b12_b1_form_iv_scope.md` (deleted — describe a partial, independently-redone version of this
same ground; see §1).
**Original authorship (recovered content):** `m21 batch 11` (Forms II/III/V/VIII/X, PR #43/#44)
and `m21 batch 12` (Forms IV/VI/VII, PR #45/#46) on `main`, merged 2026-09-08.

---

## 1. What happened

On 2026-09-11 a local "restore project on ubuntu" push force-pushed `main` back to its
2026-09-08 08:48 state, discarding everything merged between then and 2026-09-08 22:18 — PRs
#39–#48. That work was never deleted (it survives on its GitHub branches, e.g.
`claude/m21b12-derived-verb-forms-2-impl`), but `main` lost it, and local work after the restore
re-derived a slower-paced, partial version of the same ground from scratch: `m21b10` (Form II
alone) and `m21b11` (Form III alone), with a `m21b12` scope doc for Form IV drafted but not yet
implemented when the loss was discovered.

This doc records the recovery: `main` (via branch `recover/m21-full-history`) is brought forward
to include the lost content — **all eight of the taught derived forms (II, III, IV, V, VI, VII,
VIII, X), plus B1 relative clauses, plus the M21.6 parse/label exercise-type engine, plus an A2
writing batch** — rather than continuing to re-derive it piecemeal. The lexeme/grammar/text
content below is the *recovered* authoring (PRs #43–#46), not new content.

## 2. Why this batch was also restructured, not just restored

The recovered lessons (`b1-derived-verb-forms.json`, `b1-derived-verb-forms-2.json`) taught five
forms (II, III, V, VIII, X) in one lesson and the remaining three (IV, VI, VII) in a second —
one `explain` step per lesson introducing all forms in that batch at once, backed by only three
`practice-choice` questions total per lesson. That is a real pedagogical regression against this
project's own established discipline (batches 10–11's original, pre-loss design: one form, one
lesson, its own worked example(s), its own closing recognition check) and against how serious
references (Ryding; Al-Kitaab) sequence derived-form instruction — one وزن at a time, so a learner
isn't asked to hold five new morphological shapes in working memory before any of them gets
individual practice.

**Decision: keep the recovered content (verb choices, rule text, example sentences, common
errors) but re-split delivery into one lesson per form.** This preserves the recovered set's real
strength — seven of eight taught forms reuse vocabulary the learner already has (only
اِنْفَتَحَ / اِنْغَلَقَ / تَكَاتَبَ are new lexemes for the whole arc), which is *more* aligned with this
project's own "reuse before adding new vocabulary" principle than the original from-scratch
`m21b10`/`m21b11` redo (which added two brand-new lexemes per form). The restructuring only
changes lesson boundaries and practice-question count/distribution — no new vocabulary, no new
grammar claim beyond what `gr:derived-verb-forms`'s recovered rule text already states.

## 3. What shipped

- **`gr:derived-verb-forms`** (additive on the same `gr:` id, per the project's own established
  pattern) — full rule text covering all eight forms' signature shape and meaning tendency in one
  place, `examples` citing one text per form, `commonErrors` covering the four most-attested
  confusions (fixed-meaning expectation, Form-I-must-exist assumption, II/III doubling-vs-alif
  confusion, VII's non-human-subject rule).
- **Eight lessons**, one per form, `b1-u1` orders 1–8: `b1-derived-forms-ii` … `-viii`, `-x`
  (Form IX stays deferred, unchanged from the original design). Each: `explain` (3-paragraph body
  scoped to that one form) → `reading-practice` (its own example text) → 2 `practice-choice`
  questions (pattern recognition + meaning tendency) → `complete`. Form X's lesson, being last,
  adds a third closing `practice-choice` reviewing three forms at once (II, V, VII) — the
  cross-form recognition check the original design flagged as only possible once forms coexist.
- **3 new lexemes** (all B1): `lex:ver-31` اِنْفَتَحَ, `lex:ver-32` اِنْغَلَقَ (Form VII, minimal pair with
  already-known فَتَحَ/أَغْلَقَ), `lex:ver-33` تَكَاتَبَ (Form VI, root ك-ت-ب). Seven already-known
  A1/A2 lexemes (جَرَّبَ, سَافَرَ, أَرَادَ, أَغْلَقَ, تَكَلَّمَ, اِشْتَرَى, اِسْتَيْقَظَ) gained a `notes` annotation
  naming their form, reused as-is otherwise.
- **8 new example texts** (`txt:gram-form2-jarraba` … `txt:gram-form10-istayqaza`), one per form.
- **B1 relative clauses** (`gr:relative-clauses`, lesson `b1-relative-clauses`, `b1-u2` flips
  `planned` → `available`) — brought in unchanged; its own two-step-per-concept pacing was already
  correct and needed no restructuring.

## 4. What this batch does NOT do

- ❌ Form IX, or any claim beyond the eight forms taught.
- ❌ Any M27/iʿrāb-programme content — that still gates on this unit closing *and* M27.0/M21.6
  shipping real content (M21.7, drafted as PR #50, is the next step there).
- ❌ إنّ وأخواتها (`b1-u2`'s other topic) — still open; PR #49 (draft, unmerged) scoped it but it
  was not part of this recovery's implemented set.
- ❌ Any change to `content/wordlists/b1.json` (still doesn't exist) or to `content/roots.json`
  beyond reverting the now-superseded local root-cluster notes for the discarded II/III redo
  (دَرَّسَ/نَظَّفَ/كَلَّمَ/كَاتَبَ/جَالَسَ/صَادَقَ never shipped).

## 5. Verification

`npm run content:write` (rebuilt `index.html`'s embedded tables from the merged `content/*.json`
against the recovered `M21.6` engine code already in `index.html`) → 591 objects, 404 lexemes, 20
grammar points, 106 texts, 37 units, 63 lessons. `npm run content:check` clean. `npm run qa` and
`node tools/a11y-audit.js` — see recovery PR for results.

---

**Recovered + restructured**, on `recover/m21-full-history`. Merge to `main` on explicit approval.
