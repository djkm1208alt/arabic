# Refactor Scope: Alphabet letter detail as a modal overlay

**Status:** Implemented, QA passed. Ready for review/merge.

## The problem

In the Alphabet view, tapping a letter tile calls `selectLetter(id)`, which
fills `#letterDetail` — a block rendered directly *below* the 28-tile
`.alphabet-grid`. On mobile the grid alone is several screens tall, so
opening a letter's detail (forms table, audio, example, articulation
diagram, "Practice Writing" link) means scrolling past the whole grid to
reach it. Poor mobile UX, and the task requirement (user-supplied) asks for
a fix.

## The fix

Wrap the existing `#letterDetail` render target in a modal overlay that
covers the grid instead of pushing it down:

```html
<div class="letter-modal-overlay" id="letterModalOverlay" hidden>
  <div class="letter-modal" role="dialog" aria-modal="true"
       aria-label="Letter detail" tabindex="-1" id="letterModalDialog">
    <button type="button" class="pill next-btn letter-modal-close"
            id="letterModalClose">✕ Close</button>
    <div class="letter-detail" id="letterDetail"></div>
  </div>
</div>
```

- `selectLetter(id)` is untouched — it still just sets `#letterDetail`'s
  innerHTML and wires the speak buttons. Zero change to its content, its
  IDs, or the audio/articulation-diagram code paths that read from it.
- New: `openLetterModal(id)` — calls `selectLetter(id)`, unhides the
  overlay, locks background scroll, moves focus into the dialog, and
  remembers the triggering tile so focus can return to it on close.
- New: `closeLetterModal()` — hides the overlay, restores scroll, returns
  focus to the tile that opened it.
- Close paths: the "✕ Close" button, `Escape` while the modal is open,
  and a click/tap on the backdrop (`.letter-modal-overlay` itself, not its
  content).
- A minimal `Tab`/`Shift+Tab` focus wrap keeps keyboard focus inside the
  open modal (first/last focusable element in `#letterModalDialog`).
- `.letter-modal` uses `max-height` + `overflow-y: auto` so long content
  (forms table + articulation diagram + example) scrolls **inside** the
  modal rather than growing the page.
- `renderAlphabetGrid()` still pre-renders the first letter into
  `#letterDetail` on load (existing behavior, kept so the DOM/audio wiring
  is ready) but the overlay stays `hidden` until a tile is tapped — no
  auto-open on view entry.
- Grid tile `onclick` changed from `selectLetter(letter.id)` to
  `openLetterModal(letter.id)`; tile `.active` highlighting is unchanged.

## Dependency sweep — other call sites that assumed the old inline layout

A grep for every other reader of `selectLetter`, `#letterDetail`, and
`currentView`/`setView` transitions turned up two call sites that predated
this refactor and silently depended on the letter detail being inline and
always visible. Both are fixed as part of this change, not left as
follow-up:

1. **`jumpToArticulationLetter(id)`** (used by the "Where each sound is
   made" overview's per-letter jump links, inside the same Alphabet view)
   called `selectLetter(id)` directly and then
   `detail.scrollIntoView(...)`. With the detail now living inside a
   `hidden` overlay by default, this populated the modal's content but
   never opened it — clicking an articulation-overview letter would do
   nothing visible. Fixed: it now calls `openLetterModal(id)`, which
   supersedes the old scroll-to-anchor behavior (there's no page position
   to scroll to anymore — the modal opens in place).
2. **Leaving the Alphabet view while the modal was open left
   `body.letter-modal-open` (scroll lock) stuck**, most reachably via the
   in-modal "✍️ Practice Writing This Letter" button, which calls
   `startLesson()` → `setView("lesson")` without ever closing the letter
   modal first. Confirmed via Playwright: after that path, `body`'s
   computed `overflow` stayed `hidden` on the destination view, i.e. the
   learner would land on the lesson runner unable to scroll. Fixed with a
   single guard in `setView(id, opts)`: `if (id !== "alphabet")
   closeLetterModal();` right where `currentView` is set — covers every
   way a view change can happen (nav click, in-app calls like
   `startLesson`/`exitLesson`, and `hashchange`), not just the one button
   that surfaced it. Verified all three paths (in-modal button, direct
   `location.hash` change, `exitLesson()` return trip) leave `body`
   unlocked and the overlay `hidden` again.

Both fixes verified with ad hoc Playwright scripts (not part of the
standing suite) and a subsequent full `npm run qa` / `a11y-audit.js` pass
(both clean, see below) to confirm neither fix introduced a regression.

## Out of scope

- ❌ No change to `selectLetter()`'s generated markup, the forms table,
  articulation diagrams, or example-word logic.
- ❌ No change to `buildAudioControl()` / `playArabicAudio()` — the
  speak-button wiring inside `selectLetter()` is copied verbatim.
- ❌ No change to any other view or to hash-based routing — the modal is
  local UI state, not a new route.
- ❌ No new dependency — pure CSS + vanilla JS, single file.

## QA pass

- `npm run content:check` — clean, 619 objects in sync.
- `npm run qa` — **86/86 checks passed**, including every nav view, all 86
  catalog/generated lessons walked to completion, zero horizontal overflow
  at all six breakpoints (320–1280px), zero new console/page errors.
- `node tools/a11y-audit.js` — clean: every interactive control ≥44×44px,
  every text node ≥WCAG AA contrast, across 2 themes × 6 breakpoints × 6
  views (2,868 control renders, 10,080 text-node renders checked).
- Targeted Playwright script against the modal itself (not part of the
  standing suite, run ad hoc to verify the new interaction):
  - Overlay starts `hidden`; a tile click un-hides it, adds
    `body.letter-modal-open` (scroll lock), and moves focus to
    `#letterModalDialog`.
  - `Escape`, a backdrop click, and the "✕ Close" button each close the
    modal; focus returns to the triggering tile in every case.
  - At 320×480 (alif and a mid-alphabet letter with a taller articulation
    diagram): modal `scrollHeight` (607–655px) exceeds `clientHeight`
    (440px) with `overflow-y: auto` — confirmed internal scrolling, not
    page growth.
  - Zero horizontal page overflow at 320×480 with the modal open; the
    sticky Close button stays on-screen and ≥44px tall throughout.
  - Zero new console/page errors in any of the above.
