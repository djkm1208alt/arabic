# M18 · assessment-framework review

**This is the M18 sign-off gate.** The `exerciseTypes` registry, the four new item types, and the `InteractionEvent` stream are drafted below. Review, then approve — wiring the M16 lesson generator to use the new types broadly, and re-checking all 13 lessons, is on hold until you do.

Every item is generated at runtime from the existing `CONTENT` objects — no authored question file, no new Arabic. `tools/build-content.js` now fails if a kind has no raw material.

---

## 1. The registry

`exerciseTypes[kind] = { render(item, host, onResult), score?, strands?, selfManaged? }`. A lesson step `{ type: "exercise", exercise: { kind, ... } }` routes through `renderExerciseStep`, which owns the daily-goal bump and the `InteractionEvent` emit — except for `choice` (`selfManaged`), which wraps `renderMCQ` and emits itself.

| kind | new? | assesses | strands it can reach | selfManaged |
|---|---|---|---|---|
| `choice` | migrated | recognition (MCQ) | reading, vocabulary, grammar, listening, comprehension, pronunciation | yes |
| `match` | new | pairing — ar↔en, letter↔sound | vocabulary, reading, listening | no |
| `cloze` | new | a word/ending in context — grammar + vocabulary recall | grammar, vocabulary, reading | no |
| `build` | new | spelling from grapheme tiles | writing, reading | no |
| `order` | new | word order / sequence from tiles | grammar, reading, comprehension | no |

Deferred (see scope §2.2): `dictation` (needs reliable audio), `transform` (data-thin → M20), `multi-choice`, `short-write` (→ M19).

## 2. `InteractionEvent`

```
{ objectId, skill, itemType, correct, latencyMs, ts }   // ts = ISO string; latencyMs may be null
```

- Appended to `progress.interactionLog`, an **append-only ring buffer capped at 400** (oldest dropped first).
- **Every** graded answer emits — the new types *and* the legacy `practice-choice` / `quiz` / `audio-exercise` steps (verified live: legacy quizzes emit `itemType: "choice"`; `listening-foundations` emits `itemType: "listen-choose"` with the lexeme id).
- `match` / `order` emit **one event per constituent object** (a 4-pair match → 4 events, each with its own `correct`), so M19 gets per-object signal.
- **Placement (M17) does NOT emit** — verified: a full placement run leaves `interactionLog` empty.
- `skill` falls back to the object's primary skill when the item doesn't set one.

## 3. `deriveLevel` — unchanged

M18 only *produces* the stream. `deriveLevel` keeps its M17 precedence (`mastery > placement > lesson-bridge > null`). Turning `interactionLog` into a graded signal (per-object accuracy → firm levels for the other strands) is **M19**.

## 4. One real generated item per type

### `match` — `exGenMatch("vocabulary")`

```json
{
  "kind": "match",
  "skill": "vocabulary",
  "prompt": "Match each word to its meaning.",
  "objectIds": [
    "lex:col-02",
    "lex:col-10",
    "lex:col-07",
    "lex:col-09"
  ],
  "pairs": [
    {
      "a": "أَزْرَق",
      "b": "blue",
      "objectId": "lex:col-02"
    },
    {
      "a": "رَمَادِيّ",
      "b": "gray",
      "objectId": "lex:col-10"
    },
    {
      "a": "بُرْتُقَالِيّ",
      "b": "orange",
      "objectId": "lex:col-07"
    },
    {
      "a": "وَرْدِيّ",
      "b": "pink",
      "objectId": "lex:col-09"
    }
  ]
}
```

### `cloze` — `exGenCloze("txt:gram-verb-he")`

```json
{
  "kind": "cloze",
  "skill": "grammar",
  "objectId": "txt:gram-verb-he",
  "objectIds": [
    "txt:gram-verb-he"
  ],
  "prompt": "Complete: “He goes to school.”",
  "before": "هُوَ ",
  "after": " إِلَى الْمَدْرَسَةِ",
  "answer": "يَذْهَبُ",
  "options": [
    "يَذْهَبُ",
    "كَبِيرٌ",
    "يَذْهَبُونَ",
    "كَبِيرَةٌ"
  ]
}
```

### `build` — `exGenBuild("lex:hom-01")` (بَيْت, "house")

```json
{
  "kind": "build",
  "skill": "writing",
  "objectId": "lex:hom-01",
  "objectIds": [
    "lex:hom-01"
  ],
  "prompt": "Spell “house” (bayt)",
  "hint": "Tap the letters in order, right to left.",
  "target": [
    "بَ",
    "يْ",
    "ت"
  ]
}
```

### `order` — `exGenOrder("txt:gram-verb-they")`

```json
{
  "kind": "order",
  "skill": "grammar",
  "objectId": "txt:gram-verb-they",
  "objectIds": [
    "txt:gram-verb-they"
  ],
  "prompt": "Put the words in order: “They go to school.”",
  "items": [
    {
      "label": "هُمْ",
      "pos": 0
    },
    {
      "label": "يَذْهَبُونَ",
      "pos": 1
    },
    {
      "label": "إِلَى الْمَدْرَسَةِ",
      "pos": 2
    }
  ]
}
```

## 5. Coverage — which strands each new type opens up

| strand | had graded items before M18 | gains |
|---|---|---|
| vocabulary | `choice` | `match` |
| grammar | `choice` (thin) | `cloze`, `order` |
| reading | `choice` | `match`, `cloze`, `order` |
| writing | — (self-report only) | **`build`** — first machine-checkable writing signal (spelling) |
| listening | `choice` (audio) | `match` on heard words |
| comprehension | `choice` on a text | `order` on a text |

`build` giving `writing` its first real graded signal is the headline win — M15/M17 both flagged writing as unmeasurable.

## 6. Decisions to confirm

1. **Four new types** (`match`, `cloze`, `build`, `order`) — `build` covers the roadmap's `build-word` **and** `build-sentence` (grapheme tiles + word tiles are the same interaction); `order` covers sequence. `dictation`/`transform`/`multi-choice`/`short-write` deferred. OK?
2. **`cloze` gaps the second word** (verb / adjective — the agreement-bearing slot), with distractors preferring the same word-position in sibling sentences (so a gapped verb gets other verb forms). OK?
3. **`build` tiles are graphemes** (base letter + its ḥarakāt), tapped right-to-left; exact-match scoring, no partial credit. OK?
4. **Ring buffer cap 400.** OK, or different?
5. **Legacy steps emit with `objectId: null`** where the hand-written step has no object reference (they still record `skill`/`correct` for M19's aggregate). `listening-foundations` got `_objectId` hints added to its question builders so it emits real ids. OK?
6. **Placement does not emit** — confirmed by test. OK?

---

## Sign-off

Approve, and implementation resumes at rollout step 4: wire `generateLessonSteps` to use `match` / `cloze` / `build` / `order` where a lesson's objectives support them, re-check the 4 generated lessons, finalise CSS, then full QA + draft PR.
