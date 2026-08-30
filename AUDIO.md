# Audio — status, coverage, and how to add real recordings

## Current status (honest)

**There are no recorded audio files in this project.** Every Arabic letter,
syllable, word, and sentence the app pronounces is spoken by the browser's
built-in speech-synthesis engine (TTS). TTS is a functional stand-in — it is
**not** professionally recorded native-speaker audio, and the app does not claim
that it is.

M13 added the *plumbing* for native audio, not the audio:

| | |
|---|---|
| Recorded audio files in repo | **0** |
| Audio targets the app can play | **359** (all via TTS today) |
| — of those, candidates for native recordings (Tier 1 + 2) | **281** rows (98 + 183) → **275** unique recordings + 6 aliases |
| — Tier 3 (consonant × harakah drill grid) | **78** — stays TTS by decision |
| Roadmap line "Professionally recorded native-speaker audio" | still **○ not done** — flips only when real recordings ship |

*(Figures above regenerate with `node tools/build-audio-manifest.js` — see `tools/audio-manifest.md` for the always-current numbers; these were last refreshed alongside M15.5, since M14–M16's content growth had drifted them from AUDIO.md's original M13-era count.)*

The authoritative, always-current inventory is generated:

- `tools/audio-manifest.json` — machine-readable, every target with its Arabic,
  transliteration, English, category, tier, expected file path, and whether a
  file is present on disk.
- `tools/audio-manifest.md` — the same thing as a readable table, grouped by tier.

Regenerate both (and the in-app lookup table) after changing vocabulary:

```bash
node tools/build-audio-manifest.js --write-app
```

The tool never creates audio. It only inventories what the app references and
reports coverage. Running it twice with no source change produces identical
output.

## How the audio system works

Every playback in the app goes through one function, `playArabicAudio(text)`
(directly or via the `buildAudioControl()` "Listen" widget). Since M13 it:

1. asks `resolveRecordedAudio(text)` for a recording URL;
2. if it gets one, plays that file — and if the file is missing or won't play,
   **falls back to TTS** for the same text, with no error shown to the learner;
3. if it gets `null`, uses TTS directly.

`resolveRecordedAudio()` looks the (normalised) Arabic string up in
`RECORDED_AUDIO_MANIFEST` — an auto-generated map of `Arabic string → file stem
under audio/`. It returns `null` whenever `RECORDED_AUDIO_ENABLED` is `false`.

**M15.5** added two learner-facing pieces on top of this, neither requiring any
code change to go live once real recordings land:

- **`buildAudioControl()`** now shows a small "🎙️ Recorded" / "🔈 Synthesized" tag
  next to every Listen control, computed by `audioSourceKind(text)` (the exact
  same resolution `playArabicAudio()` itself uses, so it can never claim
  "recorded" for something that will actually play as TTS). With
  `RECORDED_AUDIO_ENABLED = false`, every tag reads "Synthesized" today — that
  is the accurate state, not a placeholder.
- **`initRecorder(container, { referenceText })`** (used by the `listen-repeat`
  lesson step) gained a "🆚 Compare with model" button once a recording exists:
  it plays the reference pronunciation, then the learner's own recording, back
  to back. Still strictly "compare to model" — it introduces no score.

**Ship state:** `RECORDED_AUDIO_ENABLED = false` and there is no `audio/`
directory, so step 1 always returns `null` and playback is 100% TTS — byte-for-
byte the same behaviour as before M13.

## Adding real recordings later (go-live)

No code changes are required — this is an asset + one-flag change:

1. **Commission the recordings.** Use `tools/audio-manifest.md` as the word list
   (filename ↔ Arabic ↔ transliteration ↔ English). See the spec below.
2. **Drop the files in.** Create `audio/` at the repo root and place files at the
   paths in the manifest, e.g. `audio/words/sch-06.mp3`, `audio/letters/alif.mp3`,
   `audio/sentences/sent-house-big.mp3`.
3. **Check coverage.** `node tools/build-audio-manifest.js` — the summary shows
   how many recordings are present vs still missing.
4. **Flip the flag.** Set `RECORDED_AUDIO_ENABLED = true` in `index.html`.
5. **Cache for offline (optional).** Add `audio/` handling to `sw.js` and bump
   `CACHE_NAME`, so recordings work offline like the rest of the shell.
6. **Update the roadmap line** in `index.html` from `○` to `●` once coverage is
   meaningful.

Files can land in stages (e.g. Tier 1 first). Any target without a file on disk
simply keeps using TTS until its file appears — the flag can be on with partial
coverage.

## Recording spec (for whoever records / commissions the audio)

- **Voice:** native or near-native speaker of **Modern Standard Arabic (fuṣḥā)**.
  Neutral, clear, unhurried, declarative. No regional-dialect features.
- **Pronunciation:** read every harakah and case ending (iʿrāb) exactly as
  written in the manifest's vowelled Arabic. Apply sun/moon-letter assimilation
  normally. Keep hamza and long vowels distinct.
- **Isolated letters** (`audio/letters/*`): say the letter's sound, not its name.
  **Letter names** (`audio/names/*`): say the name (e.g. "alif", "bāʾ").
- **Format:** MP3, 44.1 kHz, mono, ~192 kbps CBR. Peak around −3 dBFS. Trim
  leading/trailing silence to ~150 ms. Consistent room tone across the set.
- **One item per file.** Filenames exactly as listed in `tools/audio-manifest.md`.
- **Optional:** slower takes for the ~14 lesson sentences as
  `audio/sentences/<id>-slow.mp3` (the "🐢 Slower" button will use `playbackRate`
  on the normal take otherwise).

## Tier 3 — the consonant × harakah grid

The 78 entries under Tier 3 are the mechanical drill syllables generated for the
"every letter with fatḥah / kasrah / ḍammah" reading steps (بَ بِ بُ, تَ تِ تُ …).
By decision these **stay on TTS** — they are predictable combinations, not
vocabulary. The architecture still allows them to be swapped to recordings later
(add files under `audio/grid/…` and extend the manifest generator); nothing about
the app would need to change.
