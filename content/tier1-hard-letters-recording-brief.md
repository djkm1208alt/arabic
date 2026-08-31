# Recording brief — the 6 hardest letters (ready whenever you get to it)

12 short clips. No deadline — this sits here until you're ready. See
[`tts-hard-letter-hint-experiment.md`](tts-hard-letter-hint-experiment.md)
for why these six specifically (TTS can't produce them at all, not even with
hints), and `AUDIO.md` for the full Tier 1 plan these belong to.

## The 12 files

| File | Say this | Meaning |
|---|---|---|
| `audio/letters/ayn.mp3` | ع | the letter's **sound**, not its name |
| `audio/letters/ghayn.mp3` | غ | the letter's **sound**, not its name |
| `audio/letters/kha.mp3` | خ | the letter's **sound**, not its name |
| `audio/letters/qaf.mp3` | ق | the letter's **sound**, not its name |
| `audio/letters/sad.mp3` | ص | the letter's **sound**, not its name |
| `audio/letters/dad.mp3` | ض | the letter's **sound**, not its name |
| `audio/names/ayn.mp3` | عَيْن | the letter's **name** ("ʿayn") |
| `audio/names/ghayn.mp3` | غَيْن | the letter's **name** ("ghayn") |
| `audio/names/kha.mp3` | خَاء | the letter's **name** ("khāʾ") |
| `audio/names/qaf.mp3` | قَاف | the letter's **name** ("qāf") |
| `audio/names/sad.mp3` | صَاد | the letter's **name** ("ṣād") |
| `audio/names/dad.mp3` | ضَاد | the letter's **name** ("ḍād") |

The "letters" row is the important, hard-to-get-right one — a clean, isolated
articulation of just the consonant sound (no vowel attached), held for a
natural beat, not clipped short. The "names" row is just a normal word, so
it's the easy half.

## Recording spec (from `AUDIO.md`, condensed to just these 12)

- Native or near-native Modern Standard Arabic (fuṣḥā). Neutral, clear,
  unhurried. No regional-dialect features.
- MP3, 44.1 kHz, mono, ~192 kbps CBR. Peak around −3 dBFS.
- Trim leading/trailing silence to ~150 ms. Keep consistent room tone across
  all 12 (same session, same mic position, ideally).
- One take per file — if you want backups, record a couple of takes and pick
  the cleanest, but ship one final file per name above.

## Where they go, and how to go live

1. Create `audio/letters/` and `audio/names/` at the repo root (they don't
   exist yet — nothing does, until this).
2. Drop the 12 files in using the exact filenames above.
3. Run `node tools/build-audio-manifest.js` — it reports how many of the
   359 total targets now have a file on disk (these 12, to start).
4. Set `RECORDED_AUDIO_ENABLED = true` in `index.html` (currently `false`).
   No other code change — `playArabicAudio()` already prefers a recording
   when one exists and falls back to TTS for everything else, so partial
   coverage (just these 12) is fine to ship as-is.
5. The "🔈 Synthesized" tag on these two letters' Listen buttons will
   automatically flip to "🎙️ Recorded" — that's `audioSourceKind()` picking
   up the new files, no manual step needed.

Whenever you're ready — no need to do all 12 in one sitting; they can land
individually and each one flips over the moment its file appears.
