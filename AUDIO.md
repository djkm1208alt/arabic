# Audio — status, coverage, and how to add real recordings

## Current status (honest)

**There are no recorded (human) or AI-voice audio files in this project.**
Every Arabic letter, syllable, word, and sentence the app pronounces is spoken
by the browser's built-in speech-synthesis engine (live TTS). Live TTS is a
functional stand-in — it is **not** professionally recorded native-speaker
audio, and (once M15.6's AI-voice tier has real files) it will not be
AI-generated speech either; the app never claims a tier it hasn't earned.

M13 added the *plumbing* for native audio; M15.6 added a second, AI-generated
tier alongside it (see "AI-generated audio (M15.6)" below) — neither has real
audio yet:

| | |
|---|---|
| Recorded (human) audio files in repo | **0** |
| AI-voice audio files in repo (`audio-ai/`, M15.6) | **0** |
| Audio targets the app can play | **756** (all via TTS today) |
| — of those, candidates for native/AI recordings (Tier 1 + 2) | **667** unique + 12 aliases |
| — Tier 3 (consonant × harakah drill grid) | **77** — stays TTS by decision |
| Roadmap line "Professionally recorded native-speaker audio" | still **○ not done** — flips only when real human recordings ship |

*(Figures above regenerate with `node tools/build-audio-manifest.js` — see `tools/audio-manifest.md` for the always-current numbers; these were last refreshed alongside M15.6, since M14–M21's content growth had drifted them from AUDIO.md's M15.5-era count.)*

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
(directly or via the `buildAudioControl()` "Listen" widget). Since M13, extended
by M15.6, it tries three tiers in order:

1. asks `resolveRecordedAudio(text)` for a **human recording** URL;
2. if none, asks `resolveAiVoiceAudio(text)` for an **AI-voice** (pre-rendered
   neural TTS, shipped as a file — see "AI-generated audio (M15.6)" below) URL;
3. plays whichever it got — and if the file is missing or won't play, **falls
   back to live TTS** for the same text, with no error shown to the learner;
4. if both resolvers return `null`, uses live TTS directly.

`resolveRecordedAudio()` looks the (normalised) Arabic string up in
`RECORDED_AUDIO_MANIFEST` — an auto-generated map of `Arabic string → file stem
under audio/`. It returns `null` whenever `RECORDED_AUDIO_ENABLED` is `false`.
`resolveAiVoiceAudio()` is the exact same shape, one tier down: `AI_VOICE_MANIFEST`
→ file stem under `audio-ai/`, gated by `AI_VOICE_ENABLED`.

**M15.5** added two learner-facing pieces on top of this, neither requiring any
code change to go live once real recordings land:

- **`buildAudioControl()`** shows a small provenance tag next to every Listen
  control, computed by `audioSourceKind(text)` (the exact same resolution
  `playArabicAudio()` itself uses, so it can never claim a tier that isn't what
  will actually play): "🎙️ Recorded" for a human recording, "🤖 AI Voice" for
  M15.6's pre-rendered neural TTS, "🔈 Synthesized" for live on-device TTS. With
  both `RECORDED_AUDIO_ENABLED` and `AI_VOICE_ENABLED` at `false`, every tag
  reads "Synthesized" today — that is the accurate state, not a placeholder.
  **"Recorded" is reserved for genuine human native-speaker audio and must
  never be used for AI-generated speech, however good it sounds** — that is the
  whole reason the AI-voice tier is a separate manifest/flag/badge rather than
  reusing the recorded one.
- **`initRecorder(container, { referenceText })`** (used by the `listen-repeat`
  lesson step) gained a "🆚 Compare with model" button once a recording exists:
  it plays the reference pronunciation, then the learner's own recording, back
  to back. Still strictly "compare to model" — it introduces no score.

**Ship state:** `RECORDED_AUDIO_ENABLED` and `AI_VOICE_ENABLED` are both `false`
and neither `audio/` nor `audio-ai/` exists, so playback is 100% live TTS — byte-for-
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

## AI-generated audio (M15.6)

A second, separate go-live path, alongside — not instead of — human recordings.
Full design in [`m15.6_ai_generated_audio_scope.md`](m15.6_ai_generated_audio_scope.md).

**Why it's a separate tier, not just files dropped into `audio/`:** the
"Recorded" badge means a genuine human native speaker. Neural TTS, however
good, is not that. Reusing `RECORDED_AUDIO_MANIFEST`/`RECORDED_AUDIO_ENABLED`
for AI-generated files would make that badge lie. So AI voice gets its own
manifest (`AI_VOICE_MANIFEST`), flag (`AI_VOICE_ENABLED`), base directory
(`audio-ai/`), and badge ("🤖 AI Voice") — see "How the audio system works"
above for the full three-tier resolution order.

**Generation is local and offline**, not a runtime call: `openbmb/VoxCPM2`
(Apache-2.0, commercial-safe, 30 languages including Arabic) run via
`tools/generate-ai-audio.py` on your own machine (needs Python +
`transformers`/`torch`/`ffmpeg` — not part of this repo's Node toolchain, and
not available in every dev environment). The script reads
`tools/audio-manifest.json` for the word list — never a hand-maintained one —
and writes files matching the same format spec as human recordings (§"Recording
spec" above), so a real recording can replace an AI-voice file later with zero
format drift.

**Go-live, once files exist:**

1. Generate a batch: `python tools/generate-ai-audio.py --pilot` (or `--tier 1`,
   `--types letter-name,word`, etc. — see the script's own `--help`).
2. **Listen-review every file before committing.** Non-negotiable — confirm
   neutral MSA register, correct ḥarakāt/case-ending pronunciation, and (for
   isolated-letter targets specifically) that the model produced the letter's
   *sound* and not its *name* or an unnatural mumble on the fragment input.
   A file that fails this check does not get committed; its target keeps using
   live synthesis.
3. Drop reviewed files into `audio-ai/` at the repo root (same relative paths
   the manifest already specifies under `audio/`, e.g. `audio-ai/words/sch-06.mp3`).
4. `node tools/build-audio-manifest.js` — reports AI-voice coverage separately
   from recorded coverage.
5. Flip `AI_VOICE_ENABLED = true` in `index.html` once a meaningful batch exists.
6. Cache for offline (optional): extend the same `sw.js` step as `audio/`.

Stage generation the same way recordings can stage (§"Adding real recordings
later" above) — partial coverage is fine, each target falls back to live
synthesis independently until its own file exists and the flag is on.

## Tier 3 — the consonant × harakah grid

The 78 entries under Tier 3 are the mechanical drill syllables generated for the
"every letter with fatḥah / kasrah / ḍammah" reading steps (بَ بِ بُ, تَ تِ تُ …).
By decision these **stay on TTS** — they are predictable combinations, not
vocabulary. The architecture still allows them to be swapped to recordings later
(add files under `audio/grid/…` and extend the manifest generator); nothing about
the app would need to change.
