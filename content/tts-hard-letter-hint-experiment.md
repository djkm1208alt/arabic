# TTS hint for the hardest Arabic letters — experiment note

**Status: tried, reverted.** Tested on a real Redmi 12C in Chrome — all six
letters (ق غ ع ض ص خ) still sounded wrong with the sukūn hint applied. The
hint has been removed from `index.html`; this note stays as a record of what
was tried and why it didn't work, so nobody re-attempts the same idea.

## The problem

The Alphabet view's 🔊 button plays `letter.isolated` — the bare, unvowelled
single consonant character (e.g. ب) — through the browser's speech-synthesis
engine. That's the hardest possible input for a general-purpose TTS engine:
these models are trained on real vowelled words and sentences, not isolated
phonemes with no vowel nucleus to attach to.

It's worst for six letters with no equivalent in the languages most TTS
engines are actually trained on — the pharyngeal, uvular, and emphatic set:

| Letter | Sound | Where TTS usually gives up |
|---|---|---|
| ع ʿayn | voiced pharyngeal fricative | often silent, or a plain glottal stop |
| غ ghayn | voiced uvular fricative | often flattened to a plain g/r |
| خ khāʾ | voiceless uvular fricative | often pulled forward to a lighter h/k |
| ق qāf | voiceless uvular stop | commonly collapsed to plain ك kāf |
| ص ṣād | emphatic/pharyngealized س | the emphasis is usually just dropped |
| ض ḍād | emphatic/pharyngealized د | Arabic's own namesake sound — rarely modeled at all |

## The experiment

`TTS_ISOLATED_LETTER_HINTS` in `index.html` (next to `speakText()`) maps each
of these six letters to the same letter + an explicit sukūn (ـْ, the
no-vowel marker) — e.g. ع → عْ. The hypothesis: making the "no vowel follows"
explicit might nudge some engines toward actually articulating the bare
consonant, instead of defaulting to silence or the letter's name.

**Scope, deliberately narrow:**
- Only these 6 letters — the highest-failure-rate subset (Tier 1 in
  `AUDIO.md`), not all 28. Easy to evaluate, easy to revert per-letter.
- Only inside `speakText()` — the TTS-fallback layer. `resolveRecordedAudio()`
  (the recorded-audio manifest lookup) runs earlier, on the *original*
  unmodified text, so this has zero effect on recorded-audio matching now or
  once real recordings exist for these letters.
- Nothing else changes: not what's displayed, not `RECORDED_AUDIO_MANIFEST`,
  not any other letter or word.

## What was actually verified (and what wasn't)

**Verified, mechanically, via Playwright:**
- Each of the 6 letters produces the sukūn-appended text at the exact point
  it's handed to `SpeechSynthesisUtterance`; all other letters (tested: ب م ل
  ا) pass through completely unchanged.
- Full regression: `npm run content:check` clean, `npm run qa` 32/32.

**NOT verified — and can't be, from here:** whether the hint actually sounds
better. This sandbox has no audio output device. Effectiveness is inherently
voice/OS/engine-dependent (this is TTS, not a deterministic function) — it
may help on one browser/OS combination and do nothing (or sound worse) on
another. This needs a real person listening on a real device.

## How to actually test this

1. Open the app (Chrome or Firefox on desktop, or Chrome on Android).
2. Go to **Alphabet**, select ع (or غ, خ, ق, ص, ض), press 🔊, listen.
3. Compare against your memory of how it sounded before this change (or
   check out `main` in a second tab/profile to A/B directly).
4. Repeat across whatever devices/browsers you actually care about — this is
   exactly where results are likely to diverge (e.g. Android's Google TTS
   engine vs. desktop Chrome vs. Firefox/eSpeak-NG on Linux).

## Result

Tested on a real device (Redmi 12C, Chrome) against all six letters. All six
still sounded wrong — no audible improvement over the bare-letter baseline.
`TTS_ISOLATED_LETTER_HINTS` and the substitution in `speakText()` have been
reverted in full; `index.html` is back to exactly what it was before this
experiment.

This is a real, useful negative result, not a wasted attempt: it confirms
these six sounds are missing from the underlying voice model's training
data, not just mis-cued by ambiguous input text. No amount of clever text
formatting can make an engine produce a sound it was never trained on — the
fix has to be a better voice, not better hints. That rules out the free,
zero-cost path for these specific letters and points at the two remaining
real options from `AUDIO.md`'s Tier 1 plan:

1. **Real native-speaker recordings** for these 6 (12 files: isolated sound +
   name each) — the actual fix, not a workaround.
2. **A paid Arabic-capable neural TTS** (ElevenLabs, Google Cloud, Azure) as
   a stronger stopgap, pre-generated and dropped in through the same
   `RECORDED_AUDIO_MANIFEST` mechanism — untested here, but a categorically
   different (and more likely to actually work) approach than a text hint to
   a free browser engine, since these services are trained on real Arabic
   speech data including these phonemes.
