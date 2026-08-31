# TTS hint for the hardest Arabic letters — experiment note

**Status: unverified.** This is a small, reversible, opt-out-per-letter change to
`speakText()`, not a milestone. It exists to test one hypothesis; it is not a
claim that it works.

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

## If it doesn't help

Delete the offending letter's line from `TTS_ISOLATED_LETTER_HINTS` (or the
whole map, to revert entirely) — a one-line change, no other code depends on
this map existing.

## If it does help

It's still a stopgap, not a fix — TTS pronunciation of these six letters will
never be fully correct without a Arabic-trained voice or (better) real
native-speaker recordings, which is what `AUDIO.md`'s Tier 1 plan is for.
