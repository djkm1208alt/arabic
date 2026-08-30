# Curriculum & Learning-System Architecture

**Status:** Design proposal for review. **No code written.** This is the program-level plan the next several milestones build against — it defines the data model, the curriculum spine, the assessment framework, and the review system, then breaks the work into milestones. Nothing here ships in one pass.

**How to read it:** §1–2 audit what exists. §3–9 are the target architecture. §10 is the Arabic-content plan. §11–15 cover storage, migration, and the roadmap. **§16 is the list of decisions I need from you before any code.**

---

## 1. What exists today (audit)

Single `index.html`, ~5,300 lines, inline `<style>`+`<script>`, no build, no framework, no runtime dependencies except Google Fonts. Auto-deploys `main` → GitHub Pages. Seven hash-routed views: Home, Learn, Alphabet, Vocabulary, Practice, Progress, Lesson.

### 1.1 The good — keep and build on

| Asset | Why it's sound |
|---|---|
| **Data-driven step engine** | `lessons[id].steps[]`, each `{type, …}`, rendered through a `stepRenderers` map. 9 step types (`explain`, `example-set`, `practice-choice`, `quiz`, `trace-letter`, `reading-practice`, `audio-exercise`, `listen-repeat`, `complete`). New content = new data. |
| **Step builder functions** | `buildSyllableGroupStep`, `buildGrammarPracticeStep`, `buildLetterMarkExampleStep`, `buildSentenceDecodeStep`, … generate steps from base data. Content is recombined, never hand-duplicated. |
| **"Never invent Arabic"** | Every example is pulled live from real vocabulary by helper functions. Linguistic correctness is enforced by construction. |
| **Audio choke point (M13)** | All playback routes through `playArabicAudio()`; `RECORDED_AUDIO_MANIFEST` maps Arabic→file. Native-audio drop-in needs no engine change. |
| **`vocabulary` schema** | Already carries `pos`, `category`, `level`, `example`, `plural`, `gender`, `notes`. Extensible without refactor. |
| **Discipline** | Zero new CSS rules M6–M13; zero runtime deps; safe-storage wrappers; mid-lesson-reload guard; strict Plan→Branch→PR→QA→merge workflow. |
| **Dev tooling precedent (M13)** | `tools/build-audio-manifest.js` established that dev-time Node tooling is acceptable as long as the shipped app stays buildless and dependency-free. |

### 1.2 The debt and the gaps

| # | Problem | Impact |
|---|---|---|
| 1 | **Two disconnected vocabulary systems.** `flashcards` (46 words: `{id:num, arabic, translit, english, french, category}`) powers Flashcards, Quiz, and the Alphabet example words. `vocabulary` (155 words, richer schema) powers only the Word Bank browser. A word like كِتَاب is defined in both. Two category taxonomies (`categories` ×7 vs `VOCAB_CATEGORIES` ×15). | **The #1 blocker.** Nothing can be "defined once and reused everywhere" until this is one table. |
| 2 | **`curriculum` is a façade.** `{levels:[6 display cards], units:[1 unit, 5 lessons]}`. Only A0-Unit-1 exists. Not wired to progression, gating, or the lesson engine beyond a display list + a manual "Mark complete" toggle. | There is no curriculum spine — just a landing page that looks like one. |
| 3 | **No learning-object model.** Letters, marks, syllables, vocab, grammar "concepts" (which are just strings on `grammarExamples`) are unrelated sibling arrays. No shared identity, no cross-reference, no graph. | Can't build "teach this word → it appears in this reading → reviewed here". Everything is a silo. |
| 4 | **No real level or skill model.** `vocabulary[].level` is a display badge. `curriculum.levels` are marketing cards. No per-skill proficiency, no competency descriptors, no placement, no gating. | Can't support "enter at B1 reading / A2 listening". |
| 5 | **Assessment is MCQ-only where it's graded.** `practice-choice`, `quiz`, and the graded `audio-exercise` modes are all multiple choice. `reading-practice`/`trace-letter`/`listen-repeat` are ungraded. | Can't assess spelling, word/sentence construction, dictation, ordering, cloze, or writing. |
| 6 | **Review is a binary toggle.** `progress.mastered` is a list of word ids. `rebuildDeck()` puts unmastered first and a comment calls it "spaced-repetition-lite", but there is no scheduling, interval, forgetting curve, per-item history, or mistake log. | No real retention system, and no data to build one on later. |
| 7 | **Lesson authoring is verbose.** Large literal `steps:[]` arrays. Fine at 11 lessons. Unmaintainable at 200. | Scaling content authoring needs composition, not more literals. |
| 8 | **No audience/age adaptation, no dialect boundary, no morphology model.** | Named goals with no architectural hook yet. |
| 9 | **Content lives as JS literals in one HTML file.** ~5,300 lines today. | Works now; will not hold "thousands of items". This is the central storage decision — §11. |

---

## 2. Design principles (the brief, as engineering constraints)

1. **Multiple entry points.** Level = demonstrated ability, not lessons completed. A learner who can already read starts past the alphabet.
2. **Skill-specific proficiency.** Reading / Writing / Listening / Speaking / Vocabulary / Grammar / Pronunciation / Comprehension progress independently. The model must *represent* this even where assessment isn't reliable yet.
3. **No fake precision.** If a skill can't be reliably assessed (speaking, free writing), the system says "self-assessed / not machine-graded" — it never fabricates a number.
4. **Define once, reference everywhere.** A lexeme, letter, grammar point, audio clip, or example sentence is one object with one id, referenced by lessons, exercises, reading passages, and review.
5. **Curriculum as a dependency graph**, not a flat list. Objects have prerequisites; lessons declare objectives; progress flows along edges.
6. **Linguistic correctness > volume.** Every Arabic string checked for spelling, ḥarakāt, grammar, transliteration, meaning, natural usage, level-appropriateness.
7. **Preserve what works.** Extend the step engine, the audio abstraction, the vocabulary schema, the "never invent" helpers. No rewrite for cosmetics.
8. **Stay buildless at runtime.** The shipped app keeps zero dependencies and zero runtime fetches unless a decision in §11 changes that deliberately. Dev-time tooling (like M13's) is fine.

---

## 3. Core model — learning objects (the atoms)

Everything teachable becomes a typed **learning object** with a stable id. Lessons, exercises, texts, and review all reference objects by id; no object's Arabic content is ever written twice.

### 3.1 Shared shape

```
LearningObject = {
  id:        string            // stable, namespaced: "lex:kitaab", "let:ba", "gr:idafa-basic"
  kind:      "letter" | "mark" | "syllable" | "lexeme" | "grammar" | "morphology"
           | "text" | "collocation"
  labels:    { ar, translit, en }      // the canonical forms
  level:     { [skill]: LevelId }       // e.g. { reading:"A1", vocabulary:"A1" } — only relevant skills
  skills:    SkillId[]                  // which strands this object develops
  tags:      string[]                   // topic, frequency band, register, cefr notes, age-safe, …
  prereqs:   ObjectId[]                 // graph edges — what must be known first
  audio:     AssetRef                   // → RECORDED_AUDIO_MANIFEST key or asset id (M13)
  notes?:    string
}
```

Plus a small `kind`-specific payload:

| kind | payload | source today |
|---|---|---|
| `letter` | isolated/initial/medial/final forms, `connects`, name, sound, `strokeOrder` (M12) | `arabicAlphabet` + `strokeOrderData` |
| `mark` | symbol, function, category (short-vowel / long-vowel / sukūn / shaddah / tanwīn / hamza / tāʾ marbūṭa …) | `HARAKAT`, `TANWIN`, `MADD_PATTERNS`, `SUKUN_MARK` |
| `syllable` | shape (CV/CVV/CVC/…), constituent letter+mark ids, `exampleWord` ref | `cvv/cvc/geminatedSyllables` |
| `lexeme` | `pos`, `root?`, `pattern?`, `plural?`, `gender?`, `forms?` (inflections), `senses[]`, `examples[]` (→ text ids), `frequencyBand`, `register` | **merge of `flashcards` + `vocabulary`** |
| `grammar` | rule statement, contrast pairs, worked examples (→ text ids), common errors | strings on `grammarExamples` → real objects |
| `morphology` | root / pattern / derived-form data | *new* |
| `text` | vowelled + reduced + unvowelled forms, word refs, translation, audio, `textType` (word/phrase/sentence/dialogue/paragraph/authentic), difficulty controls | `readingPassages`, `grammarExamples`, sentence data |
| `collocation` | multi-word chunk, gloss, register | *new* |

### 3.2 Migration note

`flashcards` and `vocabulary` collapse into one `lexemes` table. The legacy `flashcards` numeric ids get a compatibility alias so `progress.mastered` entries survive. The `french` field is preserved on the lexeme (real functionality, not curriculum positioning — same call as the branding cleanup). This is **M14**, and it's the prerequisite for everything else.

---

## 4. Skills

Eight strands, tracked independently:

`reading` · `writing` · `listening` · `speaking` · `vocabulary` · `grammar` · `pronunciation` · `comprehension`

Each learning object, lesson, and exercise declares which strands it touches. Progress is accumulated **per strand**, so a learner is legitimately "Reading B1 / Listening A2 / Speaking A1".

**Assessment reliability per strand** (honest, and surfaced in the UI):

| Strand | Can assess now | Method | Notes |
|---|---|---|---|
| Vocabulary | ✅ | recognition + recall exercises, review history | reliable |
| Grammar | ✅ | targeted item types (agreement, case, conjugation) | reliable |
| Reading | ✅ | comprehension questions, cloze, decoding accuracy | reliable |
| Pronunciation (recognition) | ✅ | minimal-pair discrimination, listen-and-identify | reliable |
| Listening | ✅ | comprehension of TTS/recorded audio | reliable; improves with native audio |
| Writing (mechanics) | ⚠️ partial | stroke-order match, letter-form selection, spelling/dictation | form-level only |
| Writing (composition) | ❌ | self-assessment + rubric checklist | **not machine-graded** — labelled as such |
| Speaking | ❌ | self-assessment + "compare to model" + optional recording | **not machine-graded** — labelled as such |

The model stores a **confidence** flag with every derived level. Strands we can't measure show "self-reported" and never a fake number.

---

## 5. Levels — CEFR, adapted for Arabic

Level ids: `PRE_A1` · `A1` · `A2` · `B1` · `B2` · `C1` · `C2`.

CEFR is the external reference frame; the **descriptors are rewritten for Arabic**, because the hard parts of Arabic don't map to a European-language ladder. Each level has a **can-do statement per skill** that names the Arabic-specific competency.

### 5.1 Illustrative descriptors (reading + grammar strands)

| Level | Reading | Grammar |
|---|---|---|
| **PRE_A1** | Recognises all 28 letters by name and sound; knows the four positional forms and which 6 letters don't connect forward; reads fully-vowelled CV/CVV syllables. | — (pre-grammar) |
| **A1** | Reads fully-vowelled words and short sentences; handles sukūn, shaddah, tanwīn, tāʾ marbūṭa, alif maqṣūra, sun/moon assimilation. | Gender agreement; definite/indefinite; nominal sentence (mubtadaʾ + khabar); demonstratives; attached possessive pronouns; basic prepositions; negation with ليس/لا/ما. |
| **A2** | Reads fully-vowelled paragraphs; starts reading high-frequency words with only ambiguity-resolving vowels. | Verbal sentence (VSO); past & present tense form I; iḍāfa; object pronouns; كان; comparative; numbers 3–10 with counted noun. |
| **B1** | Reads mostly-unvowelled MSA on familiar topics; infers vowels from pattern and context; handles broken plurals in context. | Derived verb forms II–X (recognition); relative clauses (اَلَّذِي family); إنّ وأخواتها; verbal nouns; participles; subjunctive after أن/لن. |
| **B2** | Reads unvowelled authentic texts (news, articles) with occasional lookup; follows argument structure. | Full case system (iʿrāb) actively; jussive; conditional sentences; passive; كان وأخواتها fully; حال and تمييز constructions. |
| **C1** | Reads editorials, essays, literary prose; handles register shifts, ellipsis, complex subordination. | Rhetorical syntax; fronting/emphasis; nuanced particle use; stylistic case variation. |
| **C2** | Reads classical and specialist prose; parses syntactic ambiguity; analyses style. | Advanced iʿrāb; classical constructions; syntactic analysis of ambiguous strings. |

Full descriptor tables for all 8 strands × 7 levels are authored in **M15** (the curriculum-spine milestone), one strand at a time.

### 5.2 Proficiency derivation — honest

`deriveLevel(skill)` computes a strand level from **object coverage**, not lessons finished:

```
level(skill) = highest L such that
  masteredObjects(skill, ≤ L) / totalObjects(skill, ≤ L) ≥ threshold(L)
  AND enough graded evidence exists (else → "insufficient evidence")
```

- "Mastered" comes from the review model (§7): an object is mastered when it has been recalled correctly across spaced intervals, not on first exposure.
- If a strand has < N graded interactions, `deriveLevel` returns `{ level: null, reason: "insufficient evidence" }` and the UI shows "keep going / take a check" — never a guess.
- Placement (§8) can seed an initial level; it's marked `source: "placement"` and firms up as real evidence accrues.

---

## 6. Lessons as composition

A lesson stops being a hand-written wall of steps and becomes:

```
Lesson = {
  id, title, level, skills:[…],
  objectives:  ObjectId[]        // the learning objects this lesson is responsible for
  audience:    "all" | "child" | "adult" | "advanced"   // §12
  steps: [ … ]                   // literal steps OR generator calls, same as today
}
```

- The step engine (`stepRenderers`, the 9 step types) is **unchanged** — this is additive.
- A lesson's steps can be **generated from its `objectives`**: given `objectives:["mark:shaddah"]`, a generator emits the standard Concept → Example → Explain → Listen → Practice → Quiz arc pulling real examples from objects that reference `mark:shaddah`. Hand-written steps still allowed for bespoke lessons.
- Completing a lesson marks its `objectives` as *introduced* (not mastered) and schedules them for review.
- The 7-stage pedagogical arc (Concept → Visual → Explanation → Pronunciation → Practice → Quiz → Application) from the Master Standards becomes the **default generator template**, not something re-typed per lesson.

---

## 7. Assessment architecture

### 7.1 Exercise-type registry

An `exerciseTypes` map, parallel to `stepRenderers`: each entry is `{ render(item, onResult), score(item, response) }`. Items reference learning objects, so an exercise is authored as data.

| Type | Assesses | Status |
|---|---|---|
| `choice` (MCQ) | recognition | exists |
| `multi-choice` | recognition (multi-answer) | new |
| `match` | pairing (letter↔sound, word↔picture, ar↔en) | new |
| `order` | sequence (word order, story order, stroke order) | new |
| `cloze` / `fill-blank` | grammar in context, vocabulary recall | new |
| `build-word` | spelling from letter/mark tiles | new |
| `build-sentence` | syntax from word tiles | new |
| `dictation` | listening → writing (tile or keyboard) | new |
| `transform` | conjugation, pluralisation, case change | new |
| `trace` / `stroke-order` | writing mechanics | exists (M12), formalise scoring |
| `comprehension` | reading/listening understanding (Q set on a `text`) | partial |
| `record` | speaking — **ungraded**, "compare to model" | exists (M6), stays honest |
| `short-write` | composition — **self-assessed against a rubric checklist** | new, honest |

**Rule (from the brief): not every exercise is MCQ.** Each strand gets item types suited to it.

### 7.2 Item result → review

Every graded interaction emits `{ objectId, skill, correct, latency, timestamp, itemType }` into the review store (§7.3). Wrong answers also land in a **mistake log** keyed by object.

### 7.3 What's stored

```
InteractionEvent = { objectId, skill, itemType, correct, latency, ts }
```

Local-first (localStorage/IndexedDB); syncs when accounts land. This is the raw material for §7 review and §5 level derivation.

---

## 8. Review & retention

### 8.1 Data model (ships early, even before a scheduler)

```
ReviewState[objectId] = {
  objectId, skill,
  reps:       int,        // successful reviews
  ease:       float,      // SM-2-style, default 2.5
  intervalD:  float,      // days until next due
  dueDate:    date,
  lapses:     int,
  lastResult: "again"|"hard"|"good"|"easy",
  history:    InteractionEvent[]   // capped
}
```

### 8.2 Scheduler — pluggable, not faked

- A `scheduler` module with one function: `next(reviewState, result) → { intervalD, ease, dueDate }`.
- **v1 = SM-2-lite** (well-understood, transparent, no ML). Swappable later.
- Until the scheduler ships, the data model above is still populated from `InteractionEvent`s, so no history is lost. The UI shows "review" queues built from `dueDate`; if the scheduler isn't in yet, "due" = "answered wrong or not seen in N days" — and it says so.
- **Never labelled "spaced repetition" until a real scheduler is running.** (Today's `rebuildDeck()` comment gets corrected.)

### 8.3 Review queues

Mistake review · due-vocabulary · due-grammar · weak-objects (low ease) · "haven't seen in a while". Each queue is just a filter over `ReviewState` + `mistake log`.

---

## 9. Placement / diagnostic

- **Per-strand mini-assessments**, adaptive-lite: start mid-range, step up/down by response. 8–15 items per strand.
- Covers what's reliably measurable (§4): alphabet, decoding, vocabulary, grammar, reading comprehension, listening, pronunciation discrimination.
- Writing: a few form/spelling items + "rate your own writing" against samples. Speaking: "record and compare" + self-rating. **Both explicitly marked not machine-graded.**
- Output: a recommended entry level **per strand**, each with a confidence flag, plus a plain-language explanation. **The learner can override every one.**
- Re-takeable per strand. Placement seeds `deriveLevel` with `source:"placement"`; real evidence overtakes it.

---

## 10. The Arabic curriculum map

The content plan. High-level here; each level×strand cell is authored in its own milestone.

### 10.1 Foundations ladder (PRE_A1 → A1) — the corrected linguistic progression

This sequence has been checked for linguistic correctness:

1. **Letters as shape + name + sound.** ب is *bāʾ*, makes /b/. All 28.
2. **Positional forms & joining.** Four forms; the **6 non-connectors** (ا د ذ ر ز و) never join to the *following* letter — they have no distinct initial/medial shape, only isolated/final. (The app already encodes this correctly since the branding cleanup.)
3. **Short vowels (ḥarakāt).** fatḥah /a/, kasrah /i/, ḍammah /u/. `LETTER + ḤARAKAH = SYLLABLE`: بَ /ba/, بِ /bi/, بُ /bu/. Across the whole alphabet.
4. **Sukūn.** Absence of a vowel; closes a syllable, never opens one. Coda position: مِنْ /min/, هَلْ /hal/.
5. **Long vowels (ḥurūf al-madd).** ā = fatḥah + ا, ī = kasrah + ي, ū = ḍammah + و → بَا /bā/, بِي /bī/, بُو /bū/ (CVV). **Alif carries a long vowel or seats a hamza — it never takes a ḥarakah itself.**
6. **Shaddah.** Gemination; the consonant is held. Always co-occurs with a vowel/tanwīn above or below it. Often morphologically loaded (form II فَعَّلَ, intensives). شَدَّة.
7. **Tanwīn.** ً ٍ ٌ — word-final /-an/ /-in/ /-un/; marks indefiniteness **and** carries case (accusative/genitive/nominative). fatḥatayn is written on a supporting alif (ـًا) **except** after tāʾ marbūṭa (ةً) and word-final hamza-on-alif (ـئًا contexts). Introduced for *recognition* at A1; case *function* formalised at A2–B1.
8. **Hamzah.** Glottal stop. Seat (ء / أ ؤ ئ / bare) depends on adjacent vowels — taught as a small rule set, not memorised per word. **hamzat al-waṣl** (the elided hamza of ال and certain verbs/nouns) vs **hamzat al-qaṭʿ**: al-waṣl drops in connected pronunciation.
9. **Tāʾ marbūṭa ة.** Feminine/collective marker; pronounced /-a/ in pause, /-at/ before a case ending or in iḍāfa. **Alif maqṣūra ى**: final /ā/ written dotless-yāʾ.
10. **Syllable structure.** Arabic permits **no onset clusters**. Types: CV, CVV, CVC, CVVC, CVCC (the last two word-finally / with heavy structure). Stress rules (penult/antepenult by weight). Blending drills: بَ + تْ → بَتْ; مِ + نْ → مِنْ.
11. **Sun & moon letters.** ال assimilation before the 14 sun letters (اَلشَّمْس /ash-shams/) vs pronounced ل before moon letters (اَلْقَمَر /al-qamar/). (Started in M11.)
12. **Reading ladder.** fully-vowelled words → fully-vowelled phrases → fully-vowelled sentences → short vowelled texts → **partial vowelling** (only where a form is ambiguous) → **unvowelled MSA** (real-world text) → handwriting & font variation, the لا ligature, common typographic forms.

### 10.2 Grammar spine (by level) — architecture, not full content

- **A1 (foundation):** gender; number (sg/pl overview); definiteness (ال, tanwīn); nominal sentence; demonstratives (هٰذَا/هٰذِهِ/…); personal & attached possessive pronouns; core prepositions; adjective agreement (gender, definiteness); negation ليس/لا/ما.
- **A2 (elementary):** verbal sentence & VSO order; past & present form I; the 3 short-vowel case endings in fixed high-frequency phrases; iḍāfa (construct); object pronouns; كان; conjunctions; adverbs of time/frequency; comparative أَفْعَل; numbers 1–10 + counted-noun agreement (incl. polarity 3–10); telling time.
- **B1 (intermediate):** derived verb forms II–X (recognition + high-frequency production); relative clauses (اَلَّذِي / اَلَّتِي / اَلَّذِينَ …); إنّ وأخواتها (accusative on the noun); verbal nouns (maṣdar); active/passive participles; subjunctive after أن/لن/كي/حتى; expanded negation; conditionals with إذا.
- **B2 (upper-int):** the full case system used actively (iʿrāb of nominals and verbs); jussive after لم / لا الناهية / conditional particles; passive voice (internal vowel change); كان وأخواتها in full; حال (circumstantial) and تمييز (specification); more subordination.
- **C1–C2 (advanced):** rhetorical syntax, fronting & emphasis, particle nuance, stylistic case variation, classical constructions, parsing of syntactically ambiguous strings, text-level analysis.

### 10.3 Morphology (root & pattern) — introduced progressively

- **A2:** the *idea* of a triliteral root (ك-ت-ب → كِتَاب, كَاتِب, مَكْتَب, كَتَبَ); the metalanguage فَعَلَ.
- **B1:** noun patterns (فَاعِل, مَفْعُول, مَفْعَل/مَفْعِل, مِفْعَال); the derived verb forms and their meaning tendencies; sound plurals; regular maṣdar (forms II–X).
- **B2:** weak verbs — assimilated (وَصَلَ), hollow (قَالَ/بَاعَ), defective (دَعَا/رَمَى/نَسِيَ), doubled (مَدَّ), hamzated; broken-plural patterns as *recognition*.
- **C1+:** productive derivation, rare patterns, morphophonemic detail.

### 10.4 Numbers — its own curriculum area

Western digits (0–9) everywhere in **UI chrome**. **Arabic-Indic digits (٠–٩) appear only as taught content**, inside the numbers curriculum, never in the interface. Progression: cardinals 1–10 → gender polarity (3–10 take the opposite-gender form, counted noun plural genitive) → 11–99 → hundreds/thousands → ordinals → dates → clock time → prices/quantities → number agreement edge cases.

### 10.5 Topic & culture threads (woven through levels)

greetings · family · food · home · shopping · travel · school · work · health · directions · daily routine · weather · social situations → (B2+) news, formal correspondence, essays, speeches, argumentation, literary excerpts, analytical reading. Culture presented concretely and specifically; **no stereotyping**; heritage-learner and child-safe framings available via `audience` (§12).

### 10.6 Writing curriculum

Beyond "draw over the letter":

- **Letter formation** per positional form, with real **stroke-order data** (start point, sequence, direction, end point) — M12 shipped a simplified 1–2 stroke model for isolated forms; this expands to a **scalable stroke model** covering contextual forms.
- Distinguish four modes explicitly: **free draw** (no guide) · **trace** (ghost + coverage) · **guided stroke order** (ordered numbered strokes, animated demo) · **stroke validation** (did the learner follow the sequence). Stroke-order teaching is only ever claimed where real stroke data backs it.
- Then: joining practice → vowelled-word copying → dictation → guided sentence writing → free composition with rubric self-check.

### 10.7 Listening & speaking ladders

- **Listening:** controlled sounds → minimal pairs → words → phrases → sentences → short dialogues → everyday conversation → narrative → interview → news → lecture → authentic. Difficulty knobs: vocabulary level, speed, grammatical complexity, length, register, number of speakers, background context. Every listening item references an audio asset (TTS now, native later — M13 architecture).
- **Speaking:** repeat/imitate → isolated sounds → words → phrases → sentence production → Q&A → role-play → guided conversation → free response → presentation → discussion → argumentation. Recorder stays **ungraded**; "compare to model" is the mechanism; no pronunciation score unless a genuinely reliable one exists.

---

## 11. Content storage — the central decision

Content as JS literals in `index.html` will not reach "thousands of items". Three options:

| Option | How | Pros | Cons |
|---|---|---|---|
| **A. Stay single-file** | Keep growing JS literals in `index.html` | zero change; no build; no fetch | breaks well before "thousands"; `index.html` becomes unreviewable; merge conflicts |
| **B. Runtime JSON fetch** | `content/*.json` fetched by the app on demand | clean separation; lazy-load | **breaks the zero-fetch / offline-first property**; needs a loader + cache layer; PWA/SW work; slower first paint |
| **C. Dev-time compile** ✅ | Author content as `content/*.json`; `tools/build-content.js` compiles it into the shipped `index.html` (or a single `app.js`) at dev time | runtime stays **buildless, dependency-free, zero-fetch, offline-first**; content is reviewable JSON in small files; validated at build; extends the exact precedent M13 set with `build-audio-manifest.js` | introduces a dev build step (one Node script, no npm deps); `index.html` is partly generated (between markers, like M13's manifest block) |

**Recommendation: C.** It's the only option that scales content *and* keeps every property the app has defended since M6. The M13 audio-manifest tool already does exactly this pattern (author data → `--write-app` splices it into `index.html` between markers, `--check` guards staleness). `build-content.js` is the same idea at curriculum scale: it reads `content/{lexemes,letters,grammar,texts,lessons,levels}/*.json`, validates (schema + linguistic lint), and emits the compiled data block. Authoring happens in small reviewable files; the shipped artifact stays a single self-contained HTML file.

A **schema + linguistic linter** runs in the same tool: checks ḥarakāt presence where required, transliteration↔Arabic consistency, dangling object refs, prereq cycles, level monotonicity, Arabic-Indic digits outside the numbers namespace, unresolved audio keys.

---

## 12. Audience adaptation

One content spine, presented differently:

- `audience` on lessons/exercises: `"all" | "child" | "adult" | "advanced"`, plus a learner setting.
- **Child mode** does *not* dumb down the Arabic. It changes: activity length, visual density, game framing, encouragement copy, example selection (child-safe topics), and pacing. The linguistic ladder is the same rigour.
- **Advanced/intellectual mode** unlocks the C1–C2 content threads: essays, news, rhetoric, literary excerpts, analytical reading — the platform must carry a learner from "أَنَا طَالِبٌ" to producing sophisticated MSA prose.
- Adults are never forced into a children's UI; children get an age-appropriate shell over the same engine.

This is a **presentation layer + a content tag**, not a fork of the curriculum.

---

## 13. Dialects

Hard boundary. The core curriculum is **MSA / fuṣḥā**. The architecture reserves a `variety` field (`"MSA"` default) on objects and a future `dialectModules` namespace (Egyptian, Levantine, Gulf, Moroccan, …), but **no dialect content is authored until explicitly commissioned**. Dialect modules attach *alongside* the MSA spine; they never modify or contaminate it.

---

## 14. Migration — today → the model, without breaking M6–M13

Ordered, each step shippable and reversible:

1. ✅ **[M14]** **Unify vocabulary** (`flashcards` + `vocabulary` → `lexemes`), `progress.mastered` migrated numeric → lexeme id. Flashcards/Quiz/Word-Bank read `lexemes`; Alphabet examples stay scoped to the legacy 46. One taxonomy.
2. ✅ **[M14]** **Wrap existing arrays as learning objects** — `LETTERS` / `MARKS` / `SYLLABLE_OBJECTS` / `GRAMMAR_POINTS` (stubs) / `TEXTS`, in `content/*.json` compiled by `tools/build-content.js`. Existing consts are now thin derived views; every lesson + builder function is byte-unchanged.
3. **Introduce `skills` + `levels` + descriptors** as data; add `deriveLevel()` (honest, "insufficient evidence" aware). No UI upheaval — Progress view gains a per-strand panel.
4. **Real `curriculum` tree** wired to objects and levels; Learn view shows levels → units → lessons with "start where you fit".
5. **`InteractionEvent` + `ReviewState`** populated from existing quizzes immediately (data first, scheduler later).
6. **Exercise-type registry**; migrate `practice-choice`/`quiz` into it; add the first non-MCQ types.
7. **Placement**, then **SM-2-lite scheduler**, then the **content build pipeline** (§11) and the first full-level content drop.

Every step keeps M6–M13 lessons byte-compatible: the step engine, `stepRenderers`, `playArabicAudio`, and the reload/storage guards are untouched.

---

## 15. Roadmap

The existing roadmap had **M14 = student accounts**, **M15 = paid subscriptions**. Per-skill progress, placement results, review history, and mistake logs are all **per-user state that wants cross-device sync** — so accounts get *more* valuable after this work, not less. But the content model and curriculum spine are **local-first** and should come first. Proposed resequencing (numbers are provisional — see §16):

| Milestone | Deliverable | Ships |
|---|---|---|
| **M14 — Learning-object core** | Unify vocabulary into `lexemes`; wrap letters/marks/syllables/grammar/texts as objects; id-compat for `progress.mastered`; one taxonomy. No new views. | data layer only; all existing lessons unchanged |
| **M15 — Skills, levels & the graph** | `skills` (8), `levels` (7) + Arabic descriptors per strand; `prereqs` edges; `deriveLevel()` with honest "insufficient evidence"; Progress view per-strand panel. | model + one panel |
| **M16 — Curriculum spine** | Real `curriculum` tree (levels → units → lessons) wired to objects; Learn view "enter where you fit"; lesson `objectives` + the generator template. | Learn view rebuild |
| **M17 — Placement** | Per-strand diagnostics for the reliably-measurable skills; honest confidence; learner override; seeds `deriveLevel`. | new flow |
| **M18 — Assessment framework** | `exerciseTypes` registry; migrate MCQ in; add `match`, `order`, `cloze`, `build-word`, `build-sentence`, `dictation`. | engine + item types |
| **M19 — Review & retention** | `InteractionEvent` + `ReviewState` (backfilled); SM-2-lite scheduler; mistake log; review queues; correct the "spaced repetition" language. | review system |
| **M20 — Content pipeline + A1 build** | `tools/build-content.js` + schema/linguistic linter; migrate existing content to `content/*.json`; author a **complete A1 across all 8 strands** as the reference implementation. | build tool + first full level |
| **M21+ — Content scale-out** | A2 → B1 → B2 → C1 → C2 content; grammar curriculum; morphology; writing/stroke expansion; listening & speaking ladders; numbers curriculum; child mode; advanced threads. | ongoing, level by level |
| **M22 (was M14) — Accounts** | Email/pw auth, cross-device sync of per-strand progress + review history. First backend dependency (Firebase vs Supabase — still open). | backend |
| **M23 (was M15) — Subscriptions** | Premium tier gate. Depends on accounts. | payments |

M14–M16 are relatively small and safe (data + one view each). M18–M20 are the substantial engineering. M21+ is mostly authoring against a stable engine — which is the whole point of building the system first.

---

## 16. Decisions I need from you before any code

1. **Content storage (§11): A, B, or C?** I recommend **C** (dev-time compile, extending the M13 tooling pattern). This shapes M20 and influences M14's file layout.
2. **Roadmap resequencing (§15): does the curriculum system come before Accounts/Subscriptions?** I recommend **yes** — the local-first model first, accounts once there's per-user state worth syncing. If you'd rather keep Accounts as the next milestone, M14–M21 shift after it.
3. **Milestone numbering.** This work is 7+ milestones. Keep extending M-numbers (M14…M23), or start a parallel track (e.g. "C1, C2…" for curriculum)? I recommend **keep the M-sequence** — one history.
4. **Scope of the first milestone (M14).** I recommend M14 = *just* the learning-object core + vocabulary unification (§14 steps 1–2). Smallest coherent foundation, no UI change, unblocks everything. Confirm, or widen it.
5. **Vocabulary unification: keep the Flashcards view?** The legacy 46-word `flashcards` deck powers a distinct Flashcards UI. After merging into `lexemes`, do we (a) keep Flashcards as a view backed by the unified table, or (b) retire it in favour of the Word Bank + review queues? I lean **(a) keep it** — it's a familiar mode — backed by the unified data.
6. **Transliteration standard.** Current usage is ALA-LC-ish (ʾ ʿ, macrons ā ī ū, dots ṣ ḍ ṭ ẓ ḥ). Standardise on it formally, or switch to a simpler scheme for beginners? I recommend **keep ALA-LC-ish**, and add an optional "simple" display layer later.
7. **Descriptor authorship.** The A0–C2 × 8-strand can-do tables (§5) are a big content artefact. Author them **all in M15**, or **incrementally per level** as each level's content is built? I recommend **all in M15** — the map needs to exist before the territory.

---

## 17. Near-term non-goals (explicitly not now)

- No accounts / backend / database until M22.
- No dialect content until commissioned (§13).
- No pronunciation *scoring* — recorder stays "compare to model".
- No AI-generated Arabic content in the curriculum — examples come from checked, real sources (the "never invent Arabic" rule holds).
- No full grammar/morphology content in M14–M19 — those milestones build the *engine*; content is M21+.
- No runtime dependencies; no framework migration; no rewrite of the step engine or audio layer.
