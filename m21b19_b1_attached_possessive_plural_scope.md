# M21 — Batch 19: Attached Possessive Pronouns, Plural Forms (نَا / كُمْ / هُمْ)

**Status:** implemented. `npm run content:check` clean at 618 objects (412 lexemes, 21 grammar
points, 124 texts, 38 units, 70 lessons); `npm run qa` 85/85; `node tools/a11y-audit.js` clean.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · the Session Handoff note (2026-09-15), which flagged
this gap directly: `gr:attached-possessive` only teaches 5 of the paradigm's suffixes (ـِي/ـكَ/ـكِ/
ـهُ/ـهَا) — no plural ("our"/"your, pl."/"their") forms anywhere. Surfaced while drafting batch 18's
paragraph, where "their house" or "our garden" would have been the natural next sentence and
wasn't available.
**Base:** `main`, post batch 18 (`b1-u2` closed).

---

## 1. What this batch covers

Three plural attached possessive suffixes, completing the paradigm's high-frequency core:

- **ـنَا** (nā, "our") — 1st person plural, no gender split.
- **ـكُمْ** (kum, "your," plural) — 2nd person, masculine/mixed-group, the same "generic plural"
  convention this project's own `هُمْ` lexeme note already established ("they, masculine/mixed
  group").
- **ـهُمْ** (hum, "their") — 3rd person, masculine/mixed-group, same convention.

**Deliberately excluded, named but not exampled:** the specifically-feminine-plural forms (ـكُنَّ
"your, f.pl.," ـهُنَّ "their, f.pl.") and the dual forms (ـكُمَا "your, dual," ـهُمَا "their,
dual"). Checked first: neither `أَنْتُنَّ`/`هُنَّ` nor any dual pronoun exists anywhere in the
lexicon as an independent pronoun yet — this project has consistently used the masculine/mixed
form as the default plural (`هُمْ`'s own note says so explicitly) without yet teaching an
all-female-group counterpart. Naming these four suffixes for recognition without a worked example
matches the exact "flag, don't teach" treatment `b1-u1` gave Form IX and `b1-u2` gave dual relative
pronouns — not a new decision, the same one applied consistently.

## 2. Checked before authoring

- **No plural possessive suffix, and no fem.-plural or dual independent pronoun, exists anywhere in
  the lexicon** — confirmed by direct search (`أَنْتُمْ`, `أَنْتُنَّ`, `هُنَّ`, `أَنْتُمَا`,
  `هُمَا` all absent). `هُمْ` (A1) and `نَحْنُ` (A1) already exist as independent pronouns, giving
  ـهُمْ/ـنَا a natural anchor even though the suffix doesn't strictly need its independent-pronoun
  counterpart pre-taught (ـهُ attached fine before هُوَ needed re-teaching, for instance).
- **All three example sentences reuse only already-taught vocabulary**: بَيْت/كَبِير (house/big,
  A0–A1), كِتَاب/أَيْنَ (book/where, A0–A1), مَدْرَسَة/قَرِيب (school/near, A0–A1). Zero new
  lexemes.
- **`gr:noun-number` (A1) is already in place** as the prerequisite for understanding why a group
  ("our," "their") needs its own suffix distinct from the singular set — added to `prereqs`.
- **This stays an A1-level extension, not B1**, even though the gap surfaced while writing B1
  content. The paradigm itself — attaching a suffix to show possession — is foundational A1
  grammar (`gr:attached-possessive`'s own `level` field is already `"A1"`); what was missing was
  completeness, not a harder concept. Bumping the grammar point's level to B1 would misrepresent
  it. The new lesson lives in `b1-u2` anyway (§3) because that's where the gap was found and
  because a genuinely useful practice sentence for "our/your-pl/their" benefits from the plural
  nouns and connected-sentence practice B1 already has running, but the underlying grammar point
  stays where it structurally belongs.

## 3. What ships

**0 new lexemes.** The suffixes are grammar (stated in `gr:attached-possessive`'s rule text), not
separate vocabulary items — the same treatment the original 5 singular suffixes got.

**`gr:attached-possessive` grown, not replaced**: `name` updated to stop naming only 4 suffixes;
`rule` gains the three new suffixes plus the named-but-deferred fem.-plural/dual forms; `examples`
grows from 3 to 6; one new `commonErrors` entry (defaulting to a singular suffix for a group
antecedent); `prereqs` gains `gr:noun-number`.

**3 new example texts**: بَيْتُنَا كَبِيرٌ ("our house is big"), أَيْنَ كِتَابُكُمْ؟ ("where is
your book?," plural addressee), مَدْرَسَتُهُمْ قَرِيبَةٌ ("their school is near").

**1 new lesson**, `b1-attached-possessive-plural`, `b1-u2`'s seventh (`order: 7`) — `explain` →
`reading-practice` → `practice-choice` × 3 → `complete`, the same shape as every other small
"completing the set" lesson this unit has used (batches 15, 17).

**1 small edit:** `b1-u2`'s blurb grows one clause naming the plural possessive suffixes as now
covered too.

## 4. Invariants held

- No change to any existing example, lesson, or the 5 original suffixes in `gr:attached-possessive`
  — additive only.
- No new independent pronoun lexeme added (`أَنْتُمْ`, etc.) — not needed for this batch's scope.
- `buildAudioControl()` / `playArabicAudio()` untouched. Zero engine changes.
- Lesson title and every option/explanation string checked against the 50%-Arabic lang/dir
  threshold before writing.

## 5. Migration requirements

None. Purely additive.

## 6. Acceptance criteria

- `gr:attached-possessive`'s rule correctly states all three new suffixes and cites the
  masculine/mixed-group convention already established by `هُمْ`'s own lexeme note.
- Fem.-plural and dual possessive suffixes are named in the rule text but have no worked example
  and no lexeme.
- `npm run content:check`: +0 lexemes, +0 grammar points (same `gr:` id), +3 texts, +1 lesson.
- `tools/qa-harness.js` full regression clean; `tools/a11y-audit.js` clean.
- `b1-u2` stays `available`; blurb names the plural possessive suffixes as covered.

## 7. Out of scope

- Broken plurals — per the session handoff note, this is a vocabulary-annotation operation across
  future batches, not a bounded grammar lesson, and stays explicitly off the batch list.
- Fem.-plural (`ـكُنَّ`/`ـهُنَّ`) and dual (`ـكُمَا`/`ـهُمَا`) possessive suffixes — named, not
  taught, consistent with every other "rare form" deferral in this arc.
- Any new independent pronoun (`أَنْتُمْ`, `أَنْتُنَّ`, duals) — not needed here.

---

**Implemented** on `main`. See ROADMAP.md M21 row for verification results.
