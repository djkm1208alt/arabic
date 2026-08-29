# M13 Scope: Native-Speaker Audio (preparation only)

**Status:** Implemented on branch `feature/m13-audio-prep`. Approved with three decisions locked in: Tier 3 stays TTS (no recordings commissioned for it), the manifest tooling is built, and the roadmap keeps its "native audio is future work" wording. This file is the milestone record; **[AUDIO.md](AUDIO.md) is the living reference** for coverage and the go-live steps.

**What shipped (vs. this plan):** Option B (central manifest) as recommended. Refinements made during implementation: filenames are keyed off each item's stable data id under type sub-folders (`audio/words/sch-06.mp3`), not a flat transliteration slug — transliterations collide (`sabʿah` / `ṣabāḥ`). The manifest ships **fully populated** (281 keys) but inert behind `RECORDED_AUDIO_ENABLED = false`. No separate `m13_voiceover_brief.md` — `tools/audio-manifest.md` is the generated word list, and the recording spec lives in `AUDIO.md`.

M13 is **entirely prep work**. You are hiring a real voice actor (Fiverr/Upwork) — this milestone does **not** generate, record, or synthesize a single audio file, and explicitly does not use AI voice generation (ElevenLabs etc.). What M13 ships is the *plumbing* that lets recordings drop in later with a one-line switch, plus the generated word list and recording spec.

---

## My approach, in short

- **One integration point.** Every Arabic playback in the app already funnels through `playArabicAudio()` (directly, or via the `buildAudioControl()` Listen/Slower widget). Callers pass a plain Arabic string. So M13 needs to touch exactly one function, not fifteen data arrays and ten call sites.
- **A central manifest, keyed by the Arabic string** — `RECORDED_AUDIO` maps `"كِتَاب" → "word-kitaab"`. `playArabicAudio()` looks a string up there before falling back to speech synthesis. This covers *generated* content (letter+harakah grids, syllable combinations) for free, which per-entry `audioUrl` fields would not.
- **Ships dormant behind a flag.** `RECORDED_AUDIO_ENABLED = false` on merge → resolver returns `null` every time → behaviour is byte-for-byte identical to today. You flip it to `true` the day the recordings land in `audio/`. No further code change to go live.
- **Real TTS fallback**, per the roadmap: if a recording is missing *or* fails to load/play, `speakText()` takes over silently instead of surfacing an error.
- **The deliverables for the voice work** — `tools/audio-manifest.md` (generated: exact filename ↔ vowelled Arabic ↔ transliteration ↔ English, grouped by tier) plus the recording spec + pronunciation guidance in `AUDIO.md`. Together these are what a voice actor works from, with zero knowledge of this codebase. *(The plan below proposed a single hand-written `m13_voiceover_brief.md`; the generated table + AUDIO.md replaced it so the word list can't drift from the data.)*
- Verified the inventory by evaluating the live data (not grepping) — counts below are real.

---

## Core architecture decision

The M6 audio abstraction was built to accept `{ text, audioUrl }` in place of a bare string, "with no change needed anywhere that already calls `playArabicAudio()`/`buildAudioControl()`." Two ways to actually use that:

### Option A — per-entry `audioUrl` fields (the literal roadmap wording)
Add an `audioUrl` to each entry in `vocabulary`, `arabicAlphabet`, `HARAKAT`, `readingPassages`, `grammarExamples`, the syllable arrays… and change every call site to pass `{ text: x.arabic, audioUrl: x.audioUrl }` instead of `x.arabic`.

- ➖ Touches ~8 data structures and ~10 render call sites — the largest surface-area change since M6.
- ➖ **Does not cover generated content.** The M6 "every letter × every harakah" reading grids, `buildSyllableGroupStep()` combinations, and the M9 reduced/unvowelled sentence forms are all synthesised at runtime from other data — there is no entry to hang an `audioUrl` on.
- ➖ The M9 case is worse: an unvowelled sentence (`البيت كبير`) and its full form (`الْبَيْتُ كَبِيرٌ`) need the *same* recording; per-entry fields can't express "alias".
- ➕ Each URL sits next to the word it belongs to.

### Option B — central `RECORDED_AUDIO` manifest, resolved in `playArabicAudio()` ✅ recommended
One new object; one ~10-line change inside `playArabicAudio()`; **zero** call-site or data-array changes.

- ➕ Covers generated content automatically — a synthesised `"بَ"` or `"مَا"` string hits the manifest the same as a hand-authored word.
- ➕ Aliasing is trivial — three keys (`الْبَيْتُ كَبِيرٌ`, `البيت كبير`, reduced form) point at one stem.
- ➕ The manifest *is* the single source of truth for what needs recording — the brief's word list and the manifest are generated from the same place and can't drift.
- ➕ The `{ text, audioUrl }` object path still works untouched, for any future explicit override.
- ➖ ~280 Arabic-keyed entries in one object. It's generated data, reviewed once; acceptable.

**Recommendation: Option B.** It is smaller, it honours "no rendering changes" more completely than Option A does, and it's the only one that covers the parts of the app that build Arabic strings on the fly.

---

## Scope (What Is In)

1. `RECORDED_AUDIO_MANIFEST` — a generated object (normalised Arabic string → path stem under `audio/`), fully populated with every Tier 1–2 string. **No audio files are added.** Regenerated by the tool between `AUTO-GENERATED` markers.
2. `RECORDED_AUDIO_ENABLED` — a single boolean, `false` on merge. When `false`, `resolveRecordedAudio()` short-circuits to `null` and the app behaves exactly as it does today.
3. `normalizeArabicForAudio()` + `resolveRecordedAudio()` — small pure helpers (NFC, trim, strip tatweel/bidi marks; keep every harakah, shaddah, sukūn, hamza). The normaliser is mirrored in the build tool.
4. A ~12-line change inside `playArabicAudio()`: (a) if no explicit `audioUrl`, try the manifest; (b) on `audio` load/play failure, fall back to `speakText(text, opts)` instead of surfacing `opts.onerror`; (c) fire `onstart` on `playing` so a failed file doesn't flash the control.
5. `tools/build-audio-manifest.js` — a dev-only Node tool that regenerates the manifest + word-list table from `index.html`'s data, so they stay current as vocabulary grows in M14+.
6. `AUDIO.md` — honest coverage status, how the system works, the recording spec, and the go-live steps (drop files in `audio/`, flip the flag, redeploy).

*(As planned this section listed a hand-written `m13_voiceover_brief.md`; see the "What shipped" note at the top — the generated `tools/audio-manifest.md` + `AUDIO.md` took its place.)*

## Out of Scope (not implemented, not referenced in a comment, not left as a TODO)

- ❌ **Any audio file.** No recording, no TTS-to-file, no AI voice generation. The `audio/` directory does not exist in this commit.
- ❌ Wiring real recordings into the manifest values' *existence* — that's the post-M13 content drop, done when the voice actor delivers.
- ❌ Per-word "slow" recordings — the existing 🐢 Slower button keeps using TTS rate control; a second recorded take per word is a future call, not assumed here.
- ❌ Service-worker caching of audio files (deferred — `sw.js` currently passes non-shell requests straight through; revisit when files exist).
- ❌ Changing the 🔊 UI, adding download/offline-pack controls, or any visual change. Zero new CSS (holds the M6–M12 streak).
- ❌ Recording student voice / playback scoring — already exists (M6), untouched.
- ❌ Accounts, subscriptions — M14, M15.

---

## Audio inventory (verified against live data)

| Bucket | Count | Notes |
|---|---:|---|
| Alphabet — isolated letters | 28 | `letter-*.mp3` |
| Alphabet — letter names (أَلِف, بَاء…) | 28 | `name-*.mp3` |
| Vowel-mark syllables (فَ فِ فُ فً فٍ فٌ) | 6 | `mark-*.mp3` |
| Vocabulary headwords | 155 | `word-*.mp3` |
| Vocabulary example sentences | 16 | `sent-*.mp3` |
| Vocabulary plurals | 5 | `word-*-pl.mp3` |
| Syllables — CVV / CVC / geminated | 22 | `syl-*.mp3` |
| Sentences — M8 reading (fully vowelled) | 3 | `sent-*.mp3` |
| Sentences — M11 grammar | 5 | `sent-*.mp3` |
| Legacy flashcards not already in vocabulary | ~15 | remainder of the 46-word pool |
| **Tier 1 + 2 subtotal (de-duplicated)** | **≈ 281** | this is what the brief lists |
| *Optional* Tier 3 — every consonant × 3 harakāt grid | +78 | `syl-*.mp3`; recorded only if you want the M6 reading grids fully voiced |

**Recommended tiering for the brief** (lets you commission in stages / control cost):

- **Tier 1 — foundation (~95 clips):** 28 letters, 28 names, 6 marks, 22 syllables, 11 sentences (M8 + M11 + 3 vocab examples used in lessons). Everything the structured *lessons* play.
- **Tier 2 — vocabulary (~185 clips):** all 155 Word Bank headwords + remaining example sentences + plurals + the ~15 legacy-only flashcards. Everything the Alphabet view and Word Bank play.
- **Tier 3 — optional (+78):** the full consonant×harakah matrix behind the M6 "every letter with fatḥah/kasrah/ḍammah" reading grids. TTS is arguably fine here (they're mechanical syllables); flagged so you decide, not assumed.

The manifest ships covering Tiers 1–2 (~281 keys). Tier 3 keys can be added in the same commit or left for the content-drop follow-up — your call.

---

## File naming convention

Flat `audio/` directory, ASCII-only stems, type prefix so one folder stays greppable:

| Prefix | For | Example | Source of the slug |
|---|---|---|---|
| `letter-` | isolated letter | `letter-alif.mp3` | letter `id` in `arabicAlphabet` |
| `name-` | letter name | `name-alif.mp3` | letter `id` |
| `mark-` | vowel-mark syllable | `mark-fatha.mp3` | `HARAKAT` / `TANWIN` `id` |
| `syl-` | syllable | `syl-baa.mp3`, `syl-badh.mp3` | transliteration, stripped to ASCII |
| `word-` | vocabulary / flashcard word | `word-kitaab.mp3` | transliteration → lowercase, drop `ʾ ʿ -`, spaces → `-` |
| `sent-` | any full sentence | `sent-al-baytu-kabirun.mp3` | transliteration of the sentence, same rules |

Slug rules, stated once in the brief: take the transliteration, lowercase it, drop `ʾ` / `ʿ` / macrons / hyphens, replace spaces with `-`, collapse doubles. Every filename in the brief is spelled out explicitly next to its Arabic, so the actor never has to apply the rule — it's just there for reproducibility.

Format spec (in the brief): **Modern Standard Arabic (fuṣḥā)**, clear, moderate-slow pace, neutral declarative tone, no dialect features. 44.1 kHz, mono, MP3 192 kbps CBR. Peak ≈ −3 dBFS, leading/trailing silence trimmed to ~150 ms, consistent room tone. Read case endings (iʿrāb) exactly as vowelled. One word/sentence per file, filename as given.

---

## Proposed data shape & code change (illustrative — no code to be written yet)

```js
// ---- in the DATA section ----
const RECORDED_AUDIO_ENABLED = false;   // flip to true when audio/ is populated
const RECORDED_AUDIO_BASE = "audio/";
const RECORDED_AUDIO = {
    // letters
    "ا": "letter-alif",
    "أَلِف": "name-alif",
    // marks
    "فَ": "mark-fatha",
    // words
    "كِتَاب": "word-kitaab",
    // sentences — note the M9 aliases pointing at one recording
    "الْبَيْتُ كَبِيرٌ": "sent-al-baytu-kabirun",
    "البيت كبير":        "sent-al-baytu-kabirun",
    // ... ~281 entries, generated by tools/build-audio-manifest.js
};

function normalizeArabic(s) {
    return String(s).normalize("NFC").replace(/[ـ‎‏]/g, "").trim().replace(/\s+/g, " ");
}
function resolveRecordedAudio(text) {
    if (!RECORDED_AUDIO_ENABLED || typeof text !== "string") return null;
    const stem = RECORDED_AUDIO[normalizeArabic(text)];
    return stem ? RECORDED_AUDIO_BASE + stem + ".mp3" : null;
}
```

```js
// ---- the only change to playArabicAudio() ----
function playArabicAudio(source, opts) {
    opts = opts || {};
    const text = source && typeof source === "object" ? source.text : source;
    let audioUrl = source && typeof source === "object" ? source.audioUrl : null;
    if (!audioUrl) audioUrl = resolveRecordedAudio(text);        // NEW

    if (audioUrl) {
        const audio = new Audio(audioUrl);
        const toTTS = () => speakText(text, opts);               // NEW — fallback, not onerror
        if (opts.onstart) opts.onstart();
        audio.onended = () => { if (opts.onend) opts.onend(); };
        audio.onerror = toTTS;                                   // was: opts.onerror(...)
        audio.play().catch(toTTS);                               // was: opts.onerror(...)
        return true;
    }
    return speakText(text, opts);
}
```

Implementation detail to handle in QA: the fallback re-enters `speakText()`, which re-fires `opts.onstart`/`onend`. For every current caller those are idempotent class toggles (`.add("speaking")` / `.remove("speaking")`), so it's harmless — will confirm during the regression pass rather than restructure speculatively.

---

## What a voice actor is handed (shipped as `AUDIO.md` + `tools/audio-manifest.md`)

Originally planned as one hand-written `m13_voiceover_brief.md`; split into a generated word list + a static spec so the list can't drift from the app data:

- **`tools/audio-manifest.md`** (generated) — the word list. One table per tier, ~320 native-target rows: `file | Arabic (vowelled) | transliteration | English | role | playback`. Regenerated by `build-audio-manifest.js` whenever vocabulary changes.
- **`AUDIO.md`** (static) — the recording spec (MSA, clear/unhurried, 44.1 kHz mono MP3, −3 dBFS, trimmed silence), pronunciation guidance (read every harakah + case ending; isolated letters say the sound, `names/` say the name), the go-live steps, and the optional slow-takes note for lesson sentences.

---

## Service worker / PWA note

`sw.js` today caches only the app shell + Google Fonts and lets everything else hit the network. When audio files land, we'll want them cached for offline use — but that's a change to make *with* the files (so the cache manifest reflects what actually exists and the cache version bumps). Out of scope for M13; noted here so it isn't forgotten.

---

## Roadmap line

`index.html` line ~1493: `○ Professionally recorded native-speaker audio`.

**Recommendation: leave it `○`.** M13 ships the infrastructure and the brief, but "professionally recorded native-speaker audio" is not *in the app* until the recordings are. Flipping it to `●` on M13 merge would overstate what shipped. It flips when the content drop lands. (Alternative, if you'd rather show progress: split into two lines — "audio infrastructure & recording brief ●" / "native-speaker recordings ○". I lean against adding roadmap lines for internal plumbing, but happy to.)

---

## QA plan (read-only audit + live trace, per Master Standards)

- **Flag off (ship state):** every 🔊 across flashcards, Word Bank, Alphabet (letter + example), Harakāt lesson, all reading/listening/pronunciation lessons behaves identically to `main` — TTS only, no network requests for audio, no console errors. Diff `playArabicAudio()` behaviour against current for both string and `{text,audioUrl}` inputs.
- **Flag on, with 2–3 dummy MP3s:** matching strings resolve to and play the file; non-matching strings fall through to TTS; a deliberately-broken path falls back to TTS (not a silent failure, not an error toast).
- **Normalization:** `normalizeArabic()` unit-checked on tatweel, NFC/NFD pairs, leading/trailing space, internal double space; confirmed it does **not** strip harakāt (بَ ≠ بِ must stay distinct keys).
- **Manifest integrity (via the build script):** every value stem is unique-or-intentionally-aliased; every key appears in real app data; no orphan keys.
- **Regression:** M6–M12 lessons run end-to-end; `localStorage` progress persists across reload; 320 / 375 / 390 / desktop; console clean; Node Unicode-range check (not shell grep) for stray Arabic-Indic numerals.
- Working tree clean afterwards — no `.claude/launch.json`, no dummy MP3s, no stopped servers committed.

---

## Open questions — and how they were resolved

1. **Option A vs B** — went with **B** (central manifest), as recommended.
2. **Tier 3 (+78 letter×harakah grid)** — **stays TTS** (locked decision). Listed in the manifest as `tier: 3, playback: tts` so coverage stays honest; architecture allows swapping them to recordings later.
3. **`tools/build-audio-manifest.js`** — **included** (first `tools/` dir; dev-only, never shipped to users, no PWA impact).
4. **Hand-written brief vs generated** — **generated.** `tools/audio-manifest.md` is the word list; `AUDIO.md` holds the spec. No `m13_voiceover_brief.md`.
5. **Manifest coverage at merge** — ships covering **Tier 1 + 2 (281 keys, incl. 6 M9 aliases)** with the flag off. Tier 3 left as TTS.
6. **Legacy `flashcards` vs `vocabulary`** — the ~7 flashcard words not in the Word Bank get their own recording target (`words/fc-*`); the other 39 alias their Word Bank twin.

## Follow-up (not M13)

- When real recordings arrive: drop files in `audio/`, run the tool to check coverage, set `RECORDED_AUDIO_ENABLED = true`, add `audio/` caching to `sw.js` + bump the cache version, flip the roadmap line. Steps in [AUDIO.md](AUDIO.md).
