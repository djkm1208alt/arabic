# UI Baseline

Reference for the UI foundations every milestone builds on — breakpoints, color tokens and their measured contrast, the touch-target floor, and the `lang`/`dir` policy. Established by **M14.1**; see [m14.1_ui_baseline_scope.md](m14.1_ui_baseline_scope.md) for the scope this codifies and [content/m14.1-a11y-review.md](content/m14.1-a11y-review.md) for the before/after audit run.

This is a reference, not a redesign. It documents what the app already does and locks it down with a repeatable check (`tools/a11y-audit.js`) and a regression test (`tools/qa-harness.js`) — it does not introduce new visual language. The full UI/UX pass is **M24**.

## Breakpoints

The six widths this project tests at, matching real device classes already in use throughout QA:

| Width | Represents |
|---|---|
| 320px | Smallest common phone (iPhone SE class) |
| 375px | Standard phone |
| 390px | Modern iPhone |
| 768px | Tablet / small laptop |
| 1024px | Tablet landscape / small desktop |
| 1280px | Desktop |

Checked via `tools/a11y-audit.js` (touch targets, contrast) and `tools/qa-harness.js` (zero horizontal overflow) at every width, in both themes, across every nav view.

## Color tokens and measured contrast

All colors are CSS custom properties on `:root` (light) and `[data-theme="dark"]` (dark) — see `index.html`'s `:root` block. Contrast is measured by **alpha-compositing each element's own background down through its ancestors to the real rendered backdrop**, not a raw `rgba()` read — a flat read produced a false low-contrast result earlier in this project's QA history when a layer had partial alpha. The same technique also waits past the app's 0.3s theme-transition CSS before measuring, for the same reason (a mid-transition read is not the settled color).

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg-1` / `--bg-2` | `#f6f2e9` / `#eee6d3` | `#14181a` / `#0d1011` | Page backdrop |
| `--ink` | `#21201c` | `#f1ede2` | Primary text |
| `--ink-soft` | `#6b6459` | `#a5a196` | Muted/secondary text |
| `--panel` | `#fffdf8` | `#1b2124` | Card/panel surface |
| `--panel-border` | `#e4dac3` | `#2a3235` | Borders, low-emphasis fills |
| `--accent` | `#0f6b5c` | `#3aa88f` | Primary action color |
| `--gold` | `#8a5a1f`¹ | `#d9ac54` | Secondary accent (shuffle, preview badge, warnings) |
| `--danger` | `#b8452f` | `#e07357` | Errors/warnings |

¹ Changed from `#b8862e` by this milestone — see below.

**WCAG AA thresholds applied:** 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px/14pt bold) and non-text UI components. `tools/a11y-audit.js` checks every rendered text node against its true composited background at every breakpoint/theme/view combination.

**Fixes this milestone made**, each traceable to a specific audit finding (see the review doc for the full before/after):

- `--gold` (light theme) darkened from `#b8862e` to `#8a5a1f`. The original value on `--gold-soft` backgrounds (the "Preview" badge, the Shuffle button, `.audio-btn-slow`, warning text) measured 2.69:1 — well under AA. The darker value clears 4.5:1 everywhere that pairing is used; dark theme's `--gold`/`--gold-soft` pairing was already compliant (7.3:1) and is untouched.
- `.badge-upcoming` and `.lesson-level-tag` (light theme only) get a scoped `color: #5c564b` override. The default `--ink-soft` on `--panel-border` measured 4.21:1 — just under the 4.5:1 floor. Scoped to these two low-emphasis tags rather than darkening `--ink-soft` globally, since that token is used far more widely and a global change wasn't individually verified against every consumer.

**Not a defect — excluded from measurement:** color emoji (🔊, 🔀, etc.) render from the font's own embedded palette, not the CSS `color` property, so "contrast" between an emoji glyph and its background isn't a meaningful measurement. `tools/a11y-audit.js` excludes text nodes that are emoji-only (once whitespace is stripped); a node mixing an emoji with real text (e.g. "🔀 Shuffle") still has its real-text portion checked normally.

## Touch targets

**Floor: 44×44 CSS px** (WCAG 2.5.5), measured via `offsetWidth`/`offsetHeight` — the rounded border-box layout size that `min-width`/`min-height` actually guarantee. `getBoundingClientRect()` was tried first and rejected: inside a horizontally-scrolling flex row (`overflow-x: auto`), it reads up to ~1px under an element's true layout size due to Chromium's sub-pixel positioning inside a scroll container — a measurement artifact, not a real target-size defect. `offsetHeight` doesn't have this problem and matches what `min-height` resolves to.

**Fixes this milestone made:**

- `button.pill` (the base rule behind every `.show-btn` / `.next-btn` / `.know-btn` / `.shuffle-btn` / `.review-btn` variant, including the smaller overrides in `.lesson-actions .pill` and `.trace-controls .pill`) gained `min-height: 44px` plus `display: inline-flex; align-items: center; justify-content: center;` for correct centering at the new height. One change fixes every `.pill` button across the app — "Start →", "Mark complete", "Preview →", "Show Answer", "Next Card →", "Shuffle", every "Start …" button in Practice, etc.
- `.chip` (category filter pills in Vocabulary) gained the same `min-height: 44px` + flex-centering treatment.
- `.mode-switch button` (the Flashcards / Quiz / Word Bank tabs) gained the same treatment.
- `.speak-btn.small` grew from 34×34px to 44×44px.

The base `.speak-btn` (46×46px) and `.recorder-controls .pill` (already `min-height: 44px`, added ahead of this milestone) were already compliant.

## `lang` / `dir` policy

Every element that is a **dedicated Arabic-content element** — an Arabic word, phrase, or sentence that is the primary content of that element, not incidental to it — carries both `lang="ar"` and `dir="rtl"`. `lang="ar"` shipped incrementally across M4–M16 as each feature was built; `dir="rtl"` was added uniformly across all 26 existing `lang="ar"` occurrences (plus 2 JS `.lang = "ar"` property-assignment sites) by this milestone, since it had never been set anywhere in the app before.

**Deliberately left unmarked:** a short Arabic term or phrase **cited inline within otherwise-English prose** — a grammar rule explanation ("The present-tense verb prefix... يَـ (he), تَـ (she)"), a curriculum blurb ("How ك-ت-ب gives كِتَاب, كَاتِب, مَكْتَب"), a can-do descriptor citing a grammar term. Wrapping a substring mid-sentence requires string-splitting content that is otherwise plain text — a materially different, more invasive, and error-prone class of edit than tagging a whole dedicated-Arabic element, touching potentially dozens of hand-authored strings across `content/grammar.json`, `content/descriptors.json`, and `content/curriculum.json` for a marginal correctness gain on text a screen reader already mostly gets right from context. This project has consistently chosen not to do this, from the original lang="ar" pass through this milestone.

**Operational rule** (how `tools/qa-harness.js`'s lang/dir coverage check tells the two apart): a text node is "dedicated Arabic content" — and must have a `lang="ar" dir="rtl"` ancestor — when Arabic-script characters make up **more than 50% of its non-whitespace content**. A node under that threshold is an inline citation and is not flagged. This is a real, load-bearing distinction, not a workaround: an earlier, cruder version of this check (any Arabic character anywhere) correctly caught a genuine dedicated-content gap (a curriculum blurb's pronoun list) but would also have flagged four more curriculum/grammar/descriptor strings that are inline citations by design — the threshold keeps the check honest about which category it's actually looking at.
