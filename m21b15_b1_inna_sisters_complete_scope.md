# M21 — Batch 15: B1 إنّ وأخواتها, Completing the Set (كَأَنَّ / لٰكِنَّ / لَعَلَّ / لَيْتَ)

**Status:** implemented.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · `b1-u2` ("Relative Clauses & Longer Sentences") ·
[m21b14_b1_inna_wa_akhawatuha_scope.md](m21b14_b1_inna_wa_akhawatuha_scope.md) §7/§8, which named
this exact set ("كَأَنَّ, لٰكِنَّ, لَعَلَّ, لَيْتَ — four more sisters, a genuinely separate follow-up
batch") as its own next step.
**Base:** `main`, post batch 14 (إِنَّ / أَنَّ / لِأَنَّ, merged).

---

## 1. What this batch covers

The remaining four of `gr:inna-sisters`' ten members, each carrying the same case-shift rule
already taught (accusative subject, nominative predicate) but a distinct meaning:

- **كَأَنَّ** (kaʾanna, "as if") — comparison/simile.
- **لٰكِنَّ** (lākinna, the *heavy*, case-marking "but") — a genuine minimal pair against the
  already-known *light* لَكِنْ (`lex:prt-16`, no shadda, does not shift case).
- **لَعَلَّ** (laʿalla, "perhaps") — hope or expectation.
- **لَيْتَ** (layta, "would that / I wish") — an irrealis wish, often for something unattainable.

**Not touched, still deferred:** attached-pronoun forms of إنّ's family (إِنَّهُ, أَنَّهَا, لَيْتَهُ,
…) — a separate mechanic (the family takes a pronoun suffix instead of a following noun), named as
its own follow-up in batch 14 and staying that way here too.

## 2. Checked before authoring

- **No sister of إنّ under any of these four spellings existed anywhere in the lexicon** —
  confirmed by direct search. `lex:prt-16` لَكِنْ (A1, "but") is confirmed to remain the *light*
  form only; this batch's لٰكِنَّ is a new, separate entry, explicitly contrasted with it (same
  discipline batch 14 used for لِأَنَّ vs. لَكِنْ).
- **All four example sentences reuse only already-taught vocabulary**, continuing batch 14's
  weather theme so the whole `gr:inna-sisters` example set reads as one coherent thread rather than
  four unrelated one-offs: الطَّقْس/بَارِد (weather/cold, A1), الْبَيْتُ/حَدِيقَة/كَبِير/صَغِير
  (house/garden/big/small, A0–A1), غَدًا (tomorrow, A0), دَافِئ (warm, A1, already used in batch
  14's لِأَنَّ example). No new content nouns or adjectives needed beyond the four particles
  themselves.
- **`gr:inna-sisters` is extended additively**, exactly as batch 14 itself extended nothing (it was
  the point's first authoring) and as `gr:derived-verb-forms` was grown across `b1-u1`'s eight
  lessons — same `gr:` id, `rule` text grown, `examples` grown from 3 to 7, `commonErrors` gains
  entries for the two new confusion risks this batch introduces (لَكِنْ/لٰكِنَّ; treating لَيْتَ's
  wish as ordinary rather than irrealis).

## 3. What ships

**4 new lexemes** (`content/lexemes.json`, B1, `pos: "particle"`, `topic: "particles"`):
كَأَنَّ, لٰكِنَّ, لَعَلَّ, لَيْتَ.

**`gr:inna-sisters` grown, not replaced**: `name` drops the "— إِنَّ, أَنَّ, لِأَنَّ" suffix (no
longer accurate once all ten are named); `rule` gains one paragraph per new sister stating its
meaning and citing its example; `examples` grows from 3 to 7; `commonErrors` gains two entries
(لَكِنْ vs. لٰكِنَّ; لَيْتَ as a real wish, not a polite request).

**4 new example texts** (`concept: "inna-sisters"`): كَأَنَّ الطَّقْسَ بَارِدٌ الْيَوْمَ ("as if the
weather is cold today"), الْبَيْتُ كَبِيرٌ لٰكِنَّ الْحَدِيقَةَ صَغِيرَةٌ ("the house is big, but the
garden is small"), لَعَلَّ الطَّقْسَ جَمِيلٌ غَدًا ("perhaps the weather will be beautiful
tomorrow"), لَيْتَ الطَّقْسَ دَافِئٌ ("would that the weather were warm").

**1 new lesson**, `b1-inna-sisters-2`, `b1-u2`'s third (`order: 3`, after batch 13's relative
clauses and batch 14's first three sisters) — same shape as every prior B1 lesson: `explain` →
`reading-practice` → `practice-choice` × 3 → `complete`. Bundles all four sisters in one lesson
(matching batch 14's own shape, not `b1-u1`'s one-form-per-lesson split) because — unlike the
derived verb forms, which are eight *distinct morphological patterns* — these four sisters share
one rule already taught; the learning load here is new *vocabulary and meaning*, not a new pattern
to distinguish under time pressure, so bundling doesn't repeat the pacing mistake the derived-forms
recovery corrected.

**1 small edit:** `b1-u2`'s blurb updated to state إنّ وأخواتها is now complete (all ten sisters
named/covered, seven with a full lesson), naming object-relative clauses and attached-pronoun forms
as what's still open.

## 4. Invariants held

- No change to `lex:prt-16` (لَكِنْ) or any other existing lexeme.
- No change to `b1-relative-clauses` or `b1-inna-sisters` (batch 14's lesson) — additive only.
- `buildAudioControl()` / `playArabicAudio()` untouched. Zero runtime dependencies / zero runtime
  fetches. No engine change, no `index.html`/`tools/*.js` edits beyond the `content:write` rebuild.
- Lesson title and every option/explanation string checked against `qa-harness.js`'s 50%-Arabic
  lang/dir-coverage threshold before writing (the mistake caught in both M21.7 and batch 14) —
  citing one term in the title, English-forward option/explanation wording throughout.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- `gr:inna-sisters`'s rule correctly states all four new sisters' meaning; لَكِنْ/لٰكِنَّ and
  ordinary/irrealis لَيْتَ distinctions are explicit.
- All 4 new example texts reuse only already-taught vocabulary beyond the 4 new particles.
- `npm run content:check`: +4 lexemes, +0 grammar points (same `gr:` id), +4 texts, +1 lesson.
- `tools/qa-harness.js` full regression clean (new lesson walking to completion by name);
  `tools/a11y-audit.js` clean.
- `b1-u2` stays `available`; blurb states إنّ وأخواتها complete.

## 7. Out of scope

- Attached-pronoun forms of إنّ's family — still its own separate mechanic, still deferred.
- Object-relative clauses + plural/dual relative pronouns — batch 13's own named follow-up,
  unrelated to this batch.
- "Joining ideas into paragraphs" — `b1-u2`'s remaining named topic.

---

**Implemented** on `main`. See ROADMAP.md M21 row for verification results.
