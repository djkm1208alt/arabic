# M28 — Implementation scope (wiring the emphasis layer into the app)

**Status:** Draft for review — held for approval (ROADMAP standing rule 6). No code changed yet; this doc plans the work that turns the approved design + merged seed into shipped behaviour.
**Parent:** [m28_emphasis_layer_scope.md](m28_emphasis_layer_scope.md) (design, approved 2026-09-22) · [ROADMAP.md](ROADMAP.md) M28. This doc expands that scope's §6 into concrete, sequenced, testable passes.

---

## 1. What this is

The design is settled and the Unit 01–02 seed is merged under `content/seed/m28/`, but nothing is wired: `index.html` and the live `content/*.json` are untouched, and the 5 A0 lessons are invisible to learners. This is the build-out.

Line anchors below are from `main` at `ba1e642` (verified this session); treat them as starting points, not exact addresses, since any earlier edit shifts them.

## 2. Sequencing — three passes, foundation first

M28 touches the build tool, learner state, and UI at once. Per the project's foundation-before-feature rule (how M14 was scoped: "just the core… unblocks everything") it ships as three sequenced passes, each independently QA-gated and independently mergeable. Each is a candidate `mXX.N` milestone with its own draft-PR/QA/merge cycle.

| Pass | Milestone | Delivers | User-visible after it? |
| --- | --- | --- | --- |
| A | **M28.1** | Build tool learns the new schema; seed moves into `content/`; 5 A0 lessons compile into `index.html` | Yes — the 5 listening/tracing lessons appear and run |
| B | **M28.2** | `progress.emphasis` + migration; the 3-surface selector; visibility filter; Quranic-occurrence line | Yes — learners can pick an emphasis; Quranic context appears on pair answers |
| C | **M28.3** | Role styling (colour + underline + A2 label), `fr` content rendering, Smart Nudge card, `acceptedOrders` in `build` | Only where content uses them — lands with, or just before, the A1.2 content seed |

**Recommendation: build A first and merge it on its own.** It makes the merged seed live with zero new UI chrome and the smallest surface area. A is a hard prerequisite for B and C; B and C are independent of each other (either order).

**Why C can trail:** the A0 seed uses no roles, no nudges, and no multi-token `acceptedOrders`. C's machinery has no A0 content to exercise, so it's honest to land it alongside the first content that needs it (A1.2) rather than shipping dead code. B is worth doing right after A because the emphasis selector and the Quranic-occurrence line *do* apply to the A0 seed.

---

## 3. Pass A — M28.1: build tool + schema + seed wiring

**Goal:** the 5 seed lessons compile into `index.html` and run, with the new object kinds and fields validated. No new UI.

### 3.1 `tools/build-content.js`

- **New content file `content/minimal-pairs.json`** (the `minimal-pair` kind, `mp:` prefix). Add to the `FILES` map (`tools/build-content.js:62`) alongside `letters`/`marks`/etc. Validate each pair: `contrastPhonemes` (exactly 2, each resolving to a letter/mark id), `words[]` each with `phoneme` ∈ `contrastPhonemes`, ḥarakāt present, `lexemeId` (when set) resolving and matching `ar`, `audioKey` resolving to a manifest target or a `pairs/…` key, `quranic` shape (`{ref, form}` or null). Emit the pairs into the compiled `CONTENT` block.
- **`mrk:hamza`** — no code change beyond it being a normal new `marks.json` entry; the existing marks validation covers it.
- **`emphasisTag`** — accept `"general" | "quranic" | "both"` (or absent = `both`) on lexemes, texts, minimal pairs, lessons, and steps. Reject any other value.
- **Reachability invariant** — for every unit, assert its objectives stay reachable under each of the three preferences (a `general` lesson needs a `quranic`/`both` sibling covering the same objectives, and vice versa). For the A0 seed this is trivially satisfied (all `both`), but the check must exist before any split content lands.
- **`trace-letter` in data lessons** — the seed's tracing steps carry `{ "letterId": "let:ha1", "strokes": "fromLetter" }`. The build must (a) allow `letterId` on a `trace-letter` step in the data-lesson validator (`STEP_TYPES`, `tools/build-content.js:375`), resolving it to a real letter; (b) at compile time, expand it into the shape `renderTraceLetterStep` expects — `{ letter: <the letter object>, strokes: <that letter's strokeOrder> }` (mirrors how `index.html:3778` builds the inline stroke-order lesson from `arabicAlphabet` + `strokeOrderData`). This removes the runtime error the browser test caught ("Cannot read properties of undefined (reading 'isolated')").
- **`drillType`, `acceptedOrders`, `contrastPhonemes`, `pairRef`, `audioKey` on exercise items, and `fr` blocks** — validate shape (e.g. `acceptedOrders` entries are full permutations, no dupes; `fr` mirrors the localizable keys) and pass them through into the compiled lessons. Grading behaviour for these is Pass C; here they only need to compile without loss.
- **`curriculum-nodes.json` → `curriculum.json`** and **`proposed-objects.json` → `marks.json`** and the **`dots` field → `letters.json`**: these are the seed's staged additions. On this pass they move into the real files (§3.2), so the build just validates the merged result.

### 3.2 Moving the seed into place

- `content/seed/m28/lessons/*.json` → `content/lessons/` (5 files).
- `content/seed/m28/curriculum-nodes.json` entries → appended to `content/curriculum.json` `lessons` (orders already set; no existing node renumbered).
- `content/seed/m28/minimal-pairs.json` → `content/minimal-pairs.json`.
- `content/seed/m28/proposed-objects.json` `mrk:hamza` → `content/marks.json`.
- `content/seed/m28/letter-tracing.json` `dots` → an additive `dots` field on each `content/letters.json` entry, then **regenerate `LETTER_DOT_NOTES`** (`index.html:9729`) from `letters.json` at build time (today it's a hand-maintained inline table; the generator already verified the two agree, so this is a lossless switch to a single source).
- Keep `tools/m28-seed-generator.py` and `content/seed/m28/` as the provenance record, or delete them once merged — decide at merge. (Leaning: keep the generator, drop `content/seed/` once its outputs live in `content/`.)

### 3.3 Pass A acceptance

- `npm run content:check` clean; object count rises by the seed's objects (11 pairs + `mrk:hamza`); `--lint` shows no new warnings (already verified in the drop-in test).
- `npm run qa` and `node tools/a11y-audit.js` clean.
- All 5 lessons run end to end in a real browser, **including the tracing steps** (the runtime error is gone).
- Each drill logs an interaction on the phoneme heard (already verified for the `choice` path pre-wiring).

---

## 4. Pass B — M28.2: emphasis state + selector

**Goal:** the learner can choose and change an emphasis; the choice filters content and surfaces Quranic context.

### 4.1 State (`progress.emphasis`)

- Add one field in `loadProgress()` (`index.html:5150`), exactly the additive pattern the M15–M19 fields already use:
  `emphasis: (saved.emphasis === "general" || saved.emphasis === "quranic") ? saved.emphasis : "both",`
  Any missing/invalid value becomes `"both"` — so every existing profile keeps today's behaviour. `saveProgress()` needs no change (it serializes the whole object).
- **Migration check (standing rule 2):** because the default reproduces current behaviour exactly, the before/after verification is: load a pre-M28 profile blob → `progress.emphasis === "both"` and every other field byte-identical. Add this as a QA assertion.

### 4.2 Visibility filter

- One helper — `isVisibleUnderEmphasis(item, pref)` → `!item.emphasisTag || item.emphasisTag === "both" || pref === "both" || item.emphasisTag === pref`. Apply it wherever lessons/lexemes/pairs/texts are listed or drawn from (lesson lists, word bank, example pickers). A step inherits its lesson's tag unless it sets its own.
- No A0 content is filtered yet (all `both`), so this pass's visible effect at A0 is the selector itself + §4.4; the filter is exercised for real by A1.2 split content.

### 4.3 Selector — three surfaces (design §4.8)

1. **Onboarding step** — the app has no onboarding today, so this is a new first-run flow: UI-language pick (EN/FR; FR strings deferred to M29 but the control exists) → "What is your primary Arabic goal?" with the three cards. Gated on a `progress`-level "onboarded" flag so it shows once. Existing profiles are treated as already-onboarded (they migrate to `both`), so they never see it.
2. **Settings panel** — a ⚙️ button beside `#themeToggle` (`index.html:1480`) opens a lightweight modal: "Learning Preferences" → "Learning Emphasis" 3-way segmented control, plus the EN/FR switch (wired to a no-op until M29). Reuses existing modal/pill styles; no new dependency.
3. **Contextual in-lesson dropdown** — a small "Emphasis" dropdown placed directly above the exercise inside the lesson view (`#view-lesson`, the `#lessonStepBody` region, `index.html:1768`), so a learner can retune focus in the moment without leaving the lesson. Shows the current value; changing it re-renders the current step under the new preference. (Replaces the earlier Home/Learn dashboard pill — decision 2026-09-22.)

All three write `progress.emphasis` via one setter that also `saveProgress()`s and re-renders the current view. Switching never touches lesson progress.

### 4.4 Quranic-occurrence line

- After a minimal-pair answer, for `quranic`/`both` learners, show the word's Quranic occurrence from the pair's `quranic` field (e.g. تِين → وَالتِّينِ, 95:1). This is the emphasis layer's first concrete payoff on A0 content. `general` learners don't see it.

### 4.5 Pass B acceptance

- Migration check passes (pre-M28 profile → `emphasis: "both"`, nothing else changed).
- Selector reachable on all three surfaces (onboarding, Settings panel, in-lesson dropdown); switching is instant, persists across reload, and leaves `lessonsCompleted`/`mastered`/etc. untouched.
- Quranic-occurrence line shows for quranic/both, hidden for general.
- `npm run qa` / a11y clean, including the harness lang/dir check on any new Arabic strings (the occurrence line is Arabic — needs `lang="ar" dir="rtl"`).

---

## 5. Pass C — M28.3: role styling, French rendering, Smart Nudge

**Goal:** the presentation machinery the richer content will use. No A0 content exercises it, so this lands with (or just before) the A1.2 content seed.

- **Role styling** — three CSS token pairs (design §4.7): emerald/solid, sky/dashed, gold/dotted, each `border-bottom`+`padding-bottom` (not `text-decoration`, which cuts the dots under ب ج ي). A1 = colour+underline only; A2 = tap-label ("Topic" on nominal / "Doer" on verbal / "Receiver" / "Description"). Confirm all values with `node tools/a11y-audit.js` in both themes.
- **`fr` content rendering** — a `t(item, key)` helper returning the `fr` variant when the UI language is French, English otherwise, per-key fallback. Applies to lesson/step/curriculum-node strings that carry `fr`. (App chrome stays English — that's M29.)
- **Smart Nudge** — a dismissible card driven by a step/lesson `smartNudge` block (design §4.4): `general-to-quranic` shown only to general learners, `quranic-to-general` only to quranic, ≤1/day, never returns once dismissed, references an existing object (no new inline Arabic).
- **`acceptedOrders` in `build`** — the `build` exercise type (`index.html:4850`) currently checks one exact order; extend its `check` to accept any permutation listed in `acceptedOrders` (falling back to the single canonical order when absent). Needed for the sentence-builder drill; no A0 lesson uses it yet.

### 5.1 Pass C acceptance

- Role colours pass a11y in both themes; underlines don't clip letter dots.
- A French UI setting renders `fr` content strings; missing `fr` falls back to English cleanly.
- A nudge appears only for its target audience, at most daily, and stays gone once dismissed.
- A multi-order `build` item grades every listed order correct and everything else wrong.

---

## 6. Cross-cutting invariants (all passes)

- **Buildless runtime:** zero new runtime dependencies, zero runtime fetches. All new content compiles into `index.html` via `tools/build-content.js`.
- **Additive schema only:** every new field is optional; absent = today's behaviour. No existing lesson, node, order, or object id changes.
- **Audio untouched:** no changes to `buildAudioControl()` / `playArabicAudio()`.
- **Accessibility never regresses:** every pass ends with `npm run qa` and `node tools/a11y-audit.js` clean; new Arabic strings carry `lang="ar" dir="rtl"` (the harness fails ≥50%-Arabic strings without it).
- **Content honesty:** the seed's Quranic refs are checked against a muṣḥaf before Pass B ships the occurrence line; FR labels stay provisional until M29.

## 7. What to build first

Pass A (M28.1). It is the smallest coherent change, the prerequisite for B and C, and it turns already-merged, already-verified data into a live, testable feature with no new UI risk. On approval I'll take M28.1 to a draft PR: the `build-content.js` changes, the seed move, the `LETTER_DOT_NOTES` switch, and the QA/a11y run.

## 8. Open questions

1. **Keep or drop `content/seed/m28/` after Pass A** merges its contents into `content/`? (Lean: keep `tools/m28-seed-generator.py`, drop the `seed/` outputs.)
2. **Onboarding scope in Pass B** — build the full first-run flow (language + goal), or just the goal step now and fold the language step into M29 when the FR switch becomes real? (Lean: goal step now; language control present but inert until M29.)
3. **Merge B and C, or keep separate?** They're independent; C has no A0 content to exercise. (Lean: keep separate; land C with the A1.2 seed.)
