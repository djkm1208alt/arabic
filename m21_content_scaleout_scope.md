# M21 Scope: Content Scale-Out (A2 → C2)

**Status:** Draft for review. No implementation, no Arabic authored. This is a milestone-level plan — like [m20_content_pipeline_scope.md](m20_content_pipeline_scope.md) — not a batch. Do not begin implementation until this shape is approved; each batch it proposes still gets its own scope doc before any code or Arabic lands, per the standing workflow.

**Parent:** [ROADMAP.md](ROADMAP.md) M21 · depends on M20 (complete).

**One-line summary:** M20 built the pipeline and proved it on a complete A1. M21 runs that same proven process — wordlist → grammar → vocabulary → texts → writing, wired incrementally — up through A2, and sets the pattern the roadmap already says repeats for B1 → B2 → C1 → C2. This doc scopes **A2 concretely** and names the shape for what comes after; it does not plan five levels of content in detail up front, which would be exactly the kind of AI-mountain-of-content the roadmap's own "quality over quantity" rule exists to prevent.

---

## 1. What's already in place — checked, not assumed

Before scoping to the roadmap's A2 blurb literally, I checked what M14–M20 already built for A2, the same way batch 6 checked `a2-u4` before touching `a1-u5`:

- **Descriptors, levels, `deriveLevel`** (M15): all 7 levels already carry 8 can-do descriptors each, A2 included. `levels.json`'s A2 entry already reads *"Fully-vowelled paragraphs and routine exchanges; the verbal sentence, past and present Form I, iḍāfa, numbers."* The engine has been ready for A2 content since M15 — nothing to build there.
- **Curriculum stubs** (M16): `a2-u1` through `a2-u6` already exist in `content/curriculum.json`, `"status": "planned"`, with sensible titles, blurbs, and prereqs back into A1 units. This is the map M21 fills in, not something M21 needs to design.
- **One A2 grammar point already exists**: `gr:present-tense` (present-tense verb prefixes). `a2-u1` ("The Verbal Sentence") wants past tense, VSO word order, and كَانَ too — roughly a quarter done.
- **A head start on `a2-u3`**: M20.5's `content/roots.json` (11 verified root clusters, e.g. ك-ت-ب → كِتَاب/كَتَبَ/مَكْتَبَة) was built for quiz distractors, but it's directly reusable as `a2-u3`'s ("Root & Pattern — First Look") core content. Whoever scopes that batch inherits real, sourced data, not a blank page.
- **The pipeline needs a small, proven-pattern extension, not new capability.** Checked `tools/content-lint.js` directly rather than trust the M20 Phase A doc's own aspirational comment ("once they exist, a2.json…"): the level-fit rule is currently hardcoded to A1 only (`content-lint.js:116,194`), and only loads `wordlists/a1.json` (`build-content.js:143`). The ḥarakāt-coverage rule is hardcoded to `A0 || A1` (`content-lint.js:182`) — since A2 content is still **fully vowelled** per `levels.json`'s own A2 description (the "mostly-unvowelled" shift is B1's job, not A2's), that check needs to extend through A2 too. Both are small, mechanical extensions of code that's already proven on A1 — not a new linter, not new rule categories. This is meaningfully lighter than M20 Phase A, which built 8 rule categories from nothing.

## 2. What M21 delivers for A2

### 2.1 Pipeline extension (small — folds into Batch 1, no separate Phase-A PR)

Unlike M20, this doesn't need its own heavyweight Phase A: no new rule categories, no new lesson-JSON format, no new compiler capability. It needs:
- `content/wordlists/a2.json` — the A2 target lexicon as an English-side spec, same shape as `a1.json` (`{ en, topic, pos, priority }`, sourced, `_meta` header), sized to what A2 topics actually need (routine exchanges, short narrative, numbers 11–99) rather than a pre-committed count.
- `content-lint.js`: extend the level-fit check to also validate A2 lexemes against `wordlists.a2` (generalizing the existing A1-only conditional).
- `content-lint.js`: extend the ḥarakāt-coverage check's level guard from `A0 || A1` to include `A2`.
- `build-content.js`: load `wordlists/a2.json` alongside `a1.json`.

Recommend this rides inside **Batch 1** as its first deliverable, proven with a fixture the same way M20 Phase A proved each new rule, rather than a separate PR — there's no independent "prove the pipeline" gate needed this time since the pipeline itself isn't new, only its data.

### 2.2 Batches (proposed order — each gets its own scope doc, approved before it starts)

Grammar first, same reasoning M20 used: reading/text batches need the grammar to build sentences with.

1. **A2 grammar** — complete `a2-u1` (past tense Form I, VSO word order, كَانَ) and `a2-u2` (iḍāfa). Real grammatical weight here — VSO order and iḍāfa are genuinely more structurally involved than anything A1 taught; each point gets the same `rule`/`examples`/`commonErrors` treatment as every existing `gr:` entry, cited against a real reference grammar, not compressed to fit A1's simpler pattern.
2. **A2 core vocabulary** — the highest-priority new lemmas for the six A2 units' topics.
3. **A2 remaining vocabulary** — same split-if-needed discipline M20's batch 3 learned the hard way (verify against the full existing lexeme set before finalizing a "missing" list, not just an English-string diff against the wordlist — that's the exact mistake batch 3 caught and fixed).
4. **`a2-u3` (Root & Pattern)** — smaller than the others; largely wiring `roots.json`'s existing 11 clusters into a lesson, plus whatever few additional clusters the unit needs.
5. **A2 reading** (`a2-u5`, "Reading Short Paragraphs") — connected, fully-vowelled paragraphs built only from A2-or-below vocab + grammar, same discipline as M20 batch 4.
6. **A2 listening/speaking** (`a2-u6`, "Everyday Exchanges") — dialogues, reusing the `listen-repeat`/dialogue machinery already built for A1.
7. **A2 writing** — extends the existing `build`/`exerciseTypes` machinery to A2 vocabulary and the new grammar; likely small, same shape as M20 batch 5.

**Wiring:** incremental, batch by batch, flipping each `a2-uN` unit to `available` as its content lands — not deferred to a final "wire everything" batch. M20 was originally planned with wiring as its own closing batch (6); in practice, batches 2 onward wired as they went and batch 6 turned out to be one small leftover unit, not a big integration step. Doing it incrementally from the start avoids a repeat of that drift.

### 2.3 Honesty notes carried forward

- Every A2 grammar point and vocabulary entry gets the same sourcing discipline as every milestone so far: Al-Kitaab (Part One's later chapters and Part Two's early chapters cover A2 territory — not Part One alone, which M20's batches drew from) plus Ryding's *Reference Grammar of Modern Standard Arabic* for the harder structural points, plus Buckwalter–Parkinson frequency data for vocabulary selection.
- **No AI-generated mountain of Arabic.** Same batch discipline as M20: small, individually reviewed, linted, cited.

## 3. Out of scope for this doc

- ❌ Detailed content planning for B1, B2, C1, C2. The roadmap already states the shape (each level coherent and QA'd before the next starts) — B1's own scope doc is written when A2 is done, the same way this doc was only written once M20 was done, not speculatively during M20.
- ❌ The advanced/literary track (الأدب، الشِّعر، البلاغة…) — explicitly "the top of this ladder" per `ROADMAP.md`; a C1/C2 concern, not touched by an A2 batch.
- ❌ Dialect content — never in the fuṣḥā core, per the roadmap's standing rule.
- ❌ Any engine change beyond the two small linter extensions in §2.1 — no new step types, no new `exerciseTypes`, no UI/nav/CSS change. A2 content runs on the exact machinery A1 already proved.
- ❌ M22/M23 (accounts, monetisation) — unrelated, later, per the roadmap's own sequencing.

## 4. Acceptance criteria

- `content/wordlists/a2.json` exists, sourced, sized to actual A2 unit needs (not a pre-committed count).
- `content-lint.js`'s level-fit and ḥarakāt-coverage rules cover A2, each proven against a fixture, the same way every M20 Phase A rule was.
- Each of the 7 batches in §2.2 lands as its own reviewed, linted, QA'd PR — `tools/qa-harness.js` and `tools/a11y-audit.js` stay green throughout, the way they did across all of M20's six batches.
- All six `a2-uN` units read `"status": "available"` when this milestone closes, each with real lesson content, none left as a "planned" stub.
- `ROADMAP.md`'s M21 row and Position line updated as each batch lands — kept current, not left to drift stale the way M20's own row needed a fix mid-milestone.

## 5. Open questions

1. **Folding the pipeline extension into Batch 1 rather than a separate Phase-A PR** (§2.1) — agreed, given it's a small extension of proven code rather than new capability? Recommend **yes**.
2. **Batch order** (§2.2) — grammar → vocab core → vocab rest → root/pattern → reading → listening → writing, matching M20's own proven sequence with `a2-u3` slotted in once its prereq (`a2-u1`) exists. Recommend **as proposed**; happy to reorder if you'd rather see reading land earlier.
3. **`content/wordlists/a2.json` sizing** — M20 Phase A pre-committed to "~350 entries" for A1 up front and then grew it organically; would you rather this one also start with a rough target number, or stay fully organic (size it to what each A2 unit's topics actually need, batch by batch, no upfront count)? Recommend **fully organic** — the "~350" pre-commitment turned out not to bind M20's actual batches anyway.
4. **First concrete step** — once this doc is approved, should I go ahead and scope **Batch 1 (A2 grammar + the `a2.json` wordlist)** next, the same way M20 Phase A was approved before batch 1 was separately scoped?
