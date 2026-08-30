# Chore Scope: Alphabet forms-table — no horizontal page overflow at 320px

**Status:** Implemented, QA passed (320 / 375 / 390 / desktop + console + regression) — opening draft PR, holding for merge approval per standing workflow.

## The problem

In the Alphabet view, `selectLetter()` renders the letter-detail forms table (Isolated / Initial / Medial / Final):

```html
<table class="forms-table">
    <thead><tr><th>Isolated</th><th>Initial</th><th>Medial</th><th>Final</th></tr></thead>
    ...
</table>
```

At exactly **320px** viewport width the table pushes `document.documentElement.scrollWidth` to 332–333 vs a 320 client width — a ~13px horizontal page scroll on the narrowest supported phones. Reproduced on every one of the 28 letters (worst case: non-connecting letters, which also render the `= isolated` / `= final` annotation spans).

**Pre-existing.** Confirmed identical on pristine `main` (HEAD `3fd7dc3`): 12px overflow, same cause. It dates from the M12 / branding-cleanup era.

## Root cause

The responsive rule in the existing `@media (max-width: 560px)` block:

```css
.forms-table th, .forms-table td { font-size: 16px; padding: 6px; }
```

The grouped selector sweeps `th` up with `td`. The base rule deliberately keeps headers small (`.forms-table th { font-size: 11px }`); this media query instead **enlarges** them to 16px. The `th` cells hold whole uppercase words ("ISOLATED", "MEDIAL", …) which at 16px are far wider than the single Arabic glyphs in the `td` cells below them. "ISOLATED" @ 16px forces column 1 to ~90px; the four columns' combined min-content width (~292px) then exceeds the `.letter-detail` inner width (~238px at 320px), and ~13px of it escapes the viewport.

Bumping `th` to 16px is almost certainly unintended — the media query's whole purpose is to *shrink* the table on small screens.

## The fix

One additive line in the same `@media (max-width: 560px)` block, immediately after the grouped rule:

```css
.forms-table th { font-size: 10px; } /* word headers stay small — scaling them up with the cells overflows the 4-col table at 320px */
```

- Headers render at **10px** on ≤560px screens (1px below the desktop base of 11px — intentionally a touch smaller on the narrowest phones; still clearly legible).
- Table min-content drops to **~206px** vs the ~238px container → **~32px of headroom** at 320px, with real Amiri/Inter fonts loaded.
- The single-glyph `td` cells are untouched (still 16px on mobile, 22px on desktop).

**Zero new CSS classes. No existing declaration modified** — the grouped `th, td` rule is left exactly as-is; the new line is a narrower override scoped to the one buggy media query. No change to `selectLetter()` or any markup. Not wrapped in an `overflow-x: auto` container — a 4-column table of single letters should *fit* a phone, not scroll, and making it fit is the smaller change.

## Out of scope

- ❌ No redesign of the Alphabet view or the letter-detail card.
- ❌ No change to `.letter-detail` padding, `.forms-table` structure, `.form-equiv`, or the non-connector note.
- ❌ No change to `selectLetter()` / `renderAlphabetGrid()` or any rendered HTML.
- ❌ No `overflow-x` scroll wrapper.
- ❌ Desktop (media query inactive) is not touched — `th` stays at its base 11px there.

## QA pass

Static file served locally (no build step); measured with `getBoundingClientRect` / `getComputedStyle` / `scrollWidth` in a real browser with Amiri + Inter actually loaded. Before/after compared against pristine `main`.

| Width | `@media ≤560` | `<th>` size | Max horizontal page overflow, all 28 letters |
|---|---|---|---|
| 320 | active | 10px | **0** (pristine `main`: 12–13px) |
| 375 | active | 10px | 0 |
| 390 | active | 10px | 0 |
| ~1009 (desktop) | inactive | 11px (base, unchanged) | 0 |

- **Regression — Alphabet view** — walked all 28 letters at 320px via real `.letter-tile` clicks (not just direct `selectLetter`): forms table renders, "✍️ Practice Writing This Letter" button present, pronunciation 🔊 button present, `= isolated` / `= final` annotation spans still render at 8px for non-connectors, non-connector explanatory note renders within the viewport. Example-word row ("الْيَوْم (al-yawm) — today", "بَيْت (bayt) — house", "وَاحِد (wāḥid) — one", …) renders with no overflow.
- **Regression — other views** — Home / Learn / Vocabulary / Practice / Progress all still 0 horizontal overflow at 320px. `.forms-table` exists only in the Alphabet letter detail, so nothing else is in scope of the selector.
- **Console** — no new errors. One pre-existing `An unknown error occurred when fetching the script.` (service-worker registration, `navigator.serviceWorker.register("sw.js")`) appears in this sandboxed preview browser — **confirmed identical on pristine `main`**, environment-only, unrelated to a CSS change, and already swallowed by the app's `.catch()`.
