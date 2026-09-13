# M21 — Batch 10: b1-u1, Derived Verb Forms — Form II (first slice)

**Status:** proposed. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [reference/iraab-audit.md](reference/iraab-audit.md) §9 Implementation Gate, prerequisite 2 ("B1 is empty — zero B1 lesson nodes... must be built against the `b1-u1`/`b1-u2`/`b1-u3` stubs first"). This is that prerequisite's first slice — **not** M27/iʿrāb content itself, which stays blocked on this *and* M27.0 shipping (see [m27_iraab_programme_scope.md](m27_iraab_programme_scope.md) §4).
**Base:** `main` @ `a95af7f`.

---

## 1. What this batch covers

`b1-u1` ("Derived Verb Forms II–X") — blurb: "The ten forms, their meaning tendencies, and how to recognise them in text," skills `grammar`/`vocabulary`, prereqs `a2-u1`/`a2-u3` (both available now that A2 is closed). This batch delivers **only Form II** (تَفْعِيل) — the first of ten forms, not the whole unit. `b1-u1` flips `planned` → `available` with its blurb narrowed to match, exactly as `a2-u4` did after its own first partial batch (numbers 11–99 shipped; telling time/prices/dates followed as separate batches).

## 2. Why Form II first, and why now

- Checked before proposing: **zero B1-level objects exist anywhere** — 0 lexemes, 0 grammar points, 0 texts tagged `"level": "B1"` in the whole content set. The audit's "B1 is empty" claim is exactly right.
- The Gate lists this (prerequisite 2) *ahead of* the parse engine (prerequisite 3) and the iʿrāb content batches themselves (M27.b1 onward). This batch is that prerequisite's first slice — plain M21 continuous-content work, same track the 9 A2 batches were on.
- Form II is the highest-frequency derived form and the conventional first form in Arabic pedagogy — causative/intensive/denominative meaning tendency, doubled middle root consonant, low morphological surprise for a first exposure.
- The lexicon already anticipates this: `lex:ver-30` (جَرَّبَ, A2) carries a note explicitly deferring its own Form II pattern to "B1's 'Derived Verb Forms II–X' unit, not here."

## 3. Checked before planning — what's already in place

- `gr:root-pattern` (A2) already taught the general root-and-pattern idea (a root's three consonants carry a core meaning; a pattern poured into it adds a grammatical role) using `كِتَاب`/`كَتَبَ`/`مَكْتَبَة` and three other clusters. This batch extends that same idea specifically to *verb-deriving* patterns — it does not re-introduce root-and-pattern from scratch.
- `content/roots.json`'s د-ر-س cluster (`lex:sch-01` مَدْرَسَة, `lex:sch-09` دَرْس) plus `lex:ver-14` دَرَسَ (Form I, "to study," A1, present tense يَدْرُس already documented) is fully taught — a ready-made home for a Form II minimal pair: دَرَسَ ("he studied") → دَرَّسَ ("he taught / caused to study").
- `lex:ver-30` جَرَّبَ (Form II, A2, "to try/try on") already exists and needs no new authoring — reusable directly as a second worked example.
- Two more A1 lexemes support well-grounded denominative Form II verbs without inventing a root: `lex:hom-16` نَظِيف ("clean," adj.) → نَظَّفَ ("to clean"); `lex:sch-14` كَلِمَة ("word," noun) → كَلَّمَ ("to speak to / address").
- No `wordlists/b1.json` exists yet — unlike A2, B1 has no pre-authored vocabulary checklist to check new lexemes against. Recommend **not** authoring one yet; it only became useful for A2 once several batches existed to check against (see Batch 7's own use of `wordlists/a2.json`). Premature after a single batch.

## 4. Proposed shape (not yet written)

- **New grammar point:** `gr:derived-verb-forms`, level B1. Explains the derived-form system in general (ten patterns poured into a root, each shifting, intensifying, or causing the base meaning) and Form II's own pattern (فَعَّلَ — doubling the middle root consonant) and meaning tendency specifically. `examples` holds only Form II sentences in this batch, structured to grow additively in later batches — the same shape as `gr:numbers-11-99`/`gr:present-tense` growing across A2 batches — rather than spawning a separate `gr:` point per form.
- **New lexemes (4, all level B1):**
  - **دَرَّسَ** (darrasa, "to teach") — root د-ر-س, paired against already-taught دَرَسَ for the flagship minimal pair.
  - **نَظَّفَ** (naẓẓafa, "to clean") — denominative from already-taught نَظِيف.
  - **كَلَّمَ** (kallama, "to speak to / address") — denominative-leaning, from already-taught كَلِمَة.
  - (جَرَّبَ reused as-is from `lex:ver-30` — no new lexeme, but cited again as a fourth worked example.)
  - Each new lexeme's `notes` documents its present-tense form, matching the existing convention (e.g. `lex:ver-14`'s "Present tense: يَدْرُس").
- **Content:** 3–4 new example texts (`textType: sentence`), built only from vocabulary already taught plus this batch's new verbs — no proper nouns, no register beyond the project's existing MSA standard.
- **Lesson:** one `content/lessons/b1-derived-forms-ii.json` on `b1-u1` — an `explain` step (the derived-form system, then Form II specifically, with the دَرَسَ→دَرَّسَ pair as the hook), `reading-practice` (`fromObjectives: true`), 2–3 `practice-choice` questions (recognizing Form II against Form I, matching a verb to its meaning tendency), `complete` step.
- **Flip:** `b1-u1` `planned` → `available`, blurb narrowed to something like "Form II (تَفْعِيل) — a first derived pattern and its causative/intensive meaning tendency," dropping the "ten forms" framing until the remaining forms ship in follow-up batches.

## 5. Open questions

1. **Exact final verb list beyond the four named above** — none needed; four is enough for a first slice (mirrors Batch 6's four root-pattern examples). Flag only if you'd rather see 5–6.
2. **Present-tense citation convention** — recommend continuing the existing `notes` pattern (e.g. "Present tense: يُدَرِّسُ") for each new verb, even though conjugating across persons isn't this batch's own grammar point (already covered generally by `gr:present-tense` from A2 batch 1). Recommend **yes, continue the convention**.
3. **Participles (مُدَرِّس, "teacher") as a bonus pairing with دَرَّسَ** — tempting given the natural tie-in, but `b1-u3` ("Verbal Nouns & Participles," prereq `b1-u1`) already exists as its own stub for exactly this content per `CURRICULUM_ARCHITECTURE.md` §10.2. Recommend **defer to `b1-u3`** — introducing it here blurs a split the architecture already made deliberately.

## 6. Not in this batch

- ❌ Forms III–X, or any `b1-u1` blurb claim beyond what ships here.
- ❌ Any `gr:mabni-muʿrab`, case-recognition, or other M27/iʿrāb-programme content — this batch is Gate prerequisite 2's first slice, not M27 content.
- ❌ Any M27.0 engine/`parse`-type dependency — uses only the existing `sentence`/`reading-practice`/`practice-choice` machinery.
- ❌ `content/wordlists/b1.json` — no B1 checklist yet; premature after one batch.
- ❌ Participles/verbal nouns — `b1-u3`'s job (§5.3).
- ❌ `b1-u2`/`b1-u4`/`b1-u5`/`b1-u6` — untouched.
- ❌ Actual lesson/lexeme/grammar JSON, or any `index.html` change — scope only, per your instruction.
