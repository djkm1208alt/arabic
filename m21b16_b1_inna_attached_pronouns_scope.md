# M21 — Batch 16: B1 إنّ وأخواتها, Attached-Pronoun Forms (إِنَّهُ / أَنَّهَا)

**Status:** implemented. `npm run content:check` clean at 608 objects (410 lexemes, 21 grammar
points, 116 texts, 38 units, 67 lessons); `npm run qa` 82/82; `node tools/a11y-audit.js` clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b1-u2` · `gr:inna-sisters`'s own text (batches 14/15),
which named "إنّ's family's own attached-pronoun forms (إِنَّهُ, أَنَّهَا, …)" as "a separate
mechanic covered in a later unit" — this batch is that unit.
**Base:** `main`, post batch 15 (all ten sisters of إنّ named, seven with a full lesson).

---

## 1. What this batch covers

Every sister of إنّ can take an attached pronoun suffix directly, in place of a following noun,
as its subject (اِسْم إِنَّ). This is not a new suffix set: it's the exact same possessive
suffixes already taught in `gr:attached-possessive` (A1) — ـهُ (his/him/it), ـهَا (her/it), ـكَ
(your, m.), ـكِ (your, f.) — now attaching to a particle instead of a noun. إِنَّهُ سَعِيدٌ
("indeed he is happy") attaches ـهُ straight to إِنَّ, playing the same role a following noun's
accusative form would.

**One irregularity flagged, not taught:** the 1st-person suffix is irregular after إنّ's family —
إِنَّ + ي surfaces as إِنِّي, not the "expected" إِنَّنِي. Cited as a heads-up (the same discipline
`أَرَادَ`'s hollow root got in the derived-forms batches — flagged, not explained), not used in
this batch's own worked examples, which stick to the fully regular ـهُ/ـهَا suffixes.

## 2. Checked before authoring

- **`gr:attached-possessive`'s rule text already states the exact five suffixes this batch reuses**
  (ـِي, ـكَ, ـكِ, ـهُ, ـهَا) — confirmed by reading it directly. No new suffix, no new lexeme: this
  batch is purely the mechanic of attaching an already-known suffix to a new host.
- **All three example sentences reuse only already-taught vocabulary**: هُوَ/هِيَ (he/she, A1,
  cited only to explain what the attached pronoun replaces, not used as separate subjects),
  سَعِيد(ة) (happy, A0), سَمِعَ (to hear, A1, reusing batch 14's own verb), فِي الْبَيْتِ (in/at the
  house, an already-established phrase). Zero new lexemes.
- **`gr:inna-sisters` is extended additively again** — same `gr:` id, a new `rule` paragraph, plus
  the irregularity flag, `examples` grown from 7 to 10, one new `commonErrors` entry.

## 3. What ships

**0 new lexemes.** Attached pronoun suffixes are a grammar mechanic stated in `gr:attached-possessive`
and now cross-referenced in `gr:inna-sisters`, not separate vocabulary items.

**`gr:inna-sisters` grown, not replaced**: one new `rule` paragraph stating the attached-pronoun
mechanic and citing `gr:attached-possessive`'s own suffixes directly, plus the 1st-person
irregularity flag; `examples` grows from 7 to 10; one new `commonErrors` entry (expecting a
following noun and treating the pronoun suffix as optional, when it's the required subject).
`prereqs` gains `gr:attached-possessive`.

**3 new example texts** (`concept: "inna-sisters"`): إِنَّهُ سَعِيدٌ ("indeed he is happy" — ـهُ on
bare إِنَّ), سَمِعْتُ أَنَّهَا سَعِيدَةٌ ("I heard that she is happy" — ـهَا on أَنَّ, continuing the
سَمِعْتُ pattern from batch 14), هُوَ سَعِيدٌ لِأَنَّهُ فِي الْبَيْتِ ("he is happy because he is at
home" — ـهُ on لِأَنَّ, showing the mechanic works identically on every sister, not just إِنَّ/أَنَّ).

**1 new lesson**, `b1-inna-attached-pronouns`, `b1-u2`'s fourth (`order: 4`) — same shape as
batches 14/15: `explain` → `reading-practice` → `practice-choice` × 3 → `complete`. One lesson,
not split per-sister, since this is one mechanic (attach a known suffix) demonstrated across three
already-known hosts, not three new things to learn.

**1 small edit:** `b1-u2`'s blurb updated to state إنّ's family (both as a following noun and via
attached pronoun) is now fully covered; only object-relative clauses and "joining ideas into
paragraphs" remain open for the unit.

## 4. Invariants held

- No change to `gr:attached-possessive` itself, or any of its five suffixes.
- No change to any prior `gr:inna-sisters` example or lesson — additive only.
- Zero new lexemes, zero engine changes.
- Lesson title and every option/explanation string checked against the 50%-Arabic lang/dir
  threshold before writing (the recurring mistake in M21.7/batch 14, avoided cleanly in batch 15).

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- `gr:inna-sisters`'s attached-pronoun rule correctly cross-references `gr:attached-possessive`'s
  own suffixes rather than re-teaching them; the 1st-person irregularity is flagged, not taught.
- All 3 new example texts reuse only already-taught vocabulary.
- `npm run content:check`: +0 lexemes, +0 grammar points (same `gr:` id), +3 texts, +1 lesson.
- `tools/qa-harness.js` full regression clean; `tools/a11y-audit.js` clean.
- `b1-u2` stays `available`; blurb states إنّ's family (noun and pronoun subject both) complete.

## 7. Out of scope

- Object-relative clauses + plural/dual relative pronouns — batch 13's own named follow-up, the
  next batch after this one.
- "Joining ideas into paragraphs" — `b1-u2`'s remaining named topic.
- The 1st-person irregular form إِنِّي as a taught (not just flagged) rule.

---

**Implemented** on `main`. See ROADMAP.md M21 row for verification results.
