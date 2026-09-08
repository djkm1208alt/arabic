# CLAUDE.md

Context for Claude Code when working in this repo.

## What this project is

A single-page Arabic-learning web app for `index.html` — alphabet, harakāt,
syllables, vocabulary, grammar, flashcards, quizzes, progress tracking, audio
pronunciation, dark mode. Deployed via GitHub Pages, auto-built from `main`.

## Architecture — read before making changes

- **The shipped app is `index.html` itself** (single file, ~5,000+ lines,
  zero runtime dependencies, zero runtime fetches — nothing loads from a
  CDN or external API at runtime). A handful of same-origin static files
  sit alongside it (`icons/`, `manifest.json`, `assets/`) — that's fine,
  "no build step / no third-party dependency" is the actual rule, not
  "must literally be one file."
- **Curriculum data lives in `content/*.json`** (letters, lexemes, grammar,
  curriculum spine, levels, skills, syllables, texts, roots, marks,
  wordlists). `tools/build-content.js` validates/lints/writes this data
  into `index.html`'s embedded lookup tables. Never hand-edit the
  generated tables in `index.html` when a `content/*.json` source exists
  for them — edit the JSON and run `npm run content:write`.
- Some large hand-authored lookup tables (e.g. the M20.9 articulation
  diagram data) live directly in `index.html` by deliberate exception —
  see the relevant `mXX_..._scope.md` doc's "Architectural decision"
  section before assuming everything must go through `content/`.

## Dev workflow

```bash
npm install
npx playwright install chromium   # first time only; needed by qa/a11y tools
npm run content:check             # confirms content/*.json <-> index.html in sync
npm run qa                        # tools/qa-harness.js — full regression suite
node tools/a11y-audit.js          # touch-target + contrast audit (WCAG AA)
```

All three should be clean before considering a change done. `npm run qa`
and the a11y audit drive a real headless Chromium via Playwright — they
need the browser binary installed once per machine.

## Milestone workflow (how work gets planned and tracked here)

Every non-trivial feature gets a `mXX[.Y]_<name>_scope.md` doc at the repo
root **before** implementation: what it is, why it needs its own milestone,
architectural decisions, invariants that must not break, acceptance
criteria. `ROADMAP.md` is the index — each milestone gets a row there with
its status. Don't start building a new feature without checking whether a
scope doc already exists or is expected first.

## Things that must never regress

- `buildAudioControl()` / `playArabicAudio()` behavior — the audio system
  is explicitly protected across multiple milestones (M13/M15.5).
- Zero runtime dependencies / zero runtime fetches.
- `content/*.json` schemas — additive changes only unless a scope doc says
  otherwise.
- The QA/a11y baseline (`npm run qa`, `node tools/a11y-audit.js`) — treat a
  new failure as a regression to fix, not a check to relax.

## `reference/` folder (gitignored, local only)

`reference/` may contain personal source material (textbooks, grammar
references, etc.) kept locally to consult while writing or verifying
curriculum content. It is **not** part of the app, is **not** committed
(see `.gitignore`), and its contents are never copied verbatim into
`content/*.json` or `index.html` — treat it the same as any other
reference source: read it, understand it, then write original curriculum
content, going through the normal scope-doc process for anything
non-trivial.
