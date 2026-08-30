# M15 · descriptor + tagging review

**This is the M15 sign-off gate.** The proficiency map (56 can-do descriptors) and the skill/level/prereq tagging of all 234 learning objects are drafted below. Review, then approve — implementation (`deriveLevel`, the Progress panel, the migration) is on hold until you do.

Files: [`content/skills.json`](skills.json) · [`content/levels.json`](levels.json) · [`content/descriptors.json`](descriptors.json) · the `skills`/`level`/`prereqs` fields added to `letters/marks/syllables/grammar/texts/lexemes.json` by [`tools/m15-seed.js`](../tools/m15-seed.js).

---

## 1. The 8 strands

| id | assess | one line |
|---|---|---|
| `vocabulary` | reliable | breadth + control of known words |
| `grammar` | reliable | structure, agreement, tense, forms, iʿrāb |
| `reading` | reliable | decoding + literal understanding of text |
| `listening` | reliable | understanding spoken Arabic |
| `pronunciation` | partial | recognition scored; production compared to a model |
| `comprehension` | reliable | inference, gist, stance, argument — on read **and** heard texts |
| `writing` | partial | formation/spelling scored; composition self-assessed |
| `speaking` | self-report | interaction + fluency — never machine-scored |

**`comprehension` kept as a distinct 8th strand** (your Q3 = recommendation). It is *not* re-decoding — it is inferential/integrated understanding, assessed the same way whether the input was read or heard. It has no single external CEFR scale, so its descriptors are synthesised from the CEFR "identifying cues / inferring" and "understanding argumentation" scales with a documented rationale.

## 2. The 7 levels

`A0 → A1 → A2 → B1 → B2 → C1 → C2` (your Q1 = keep `A0`; Q7 = `C2` added). `A0` displays as "Pre-A1 · Absolute Beginner."

## 3. The 56 descriptors

**Framework** (your Q2 = recommendation): each cell is checked against the **CEFR Companion Volume 2018** scale for that strand, adapted for Arabic, cross-referenced with the **ACTFL Arabic Proficiency Guidelines** and the progression common to standard first/second-year sequences (Al-Kitaab / Georgetown). Cells with no external analogue — the script-literacy competencies, the Arabic phoneme inventory, the whole `comprehension` strand — carry a **documented rationale** in the `source` field instead of a citation.

### reading

| level | can-do |
|---|---|
| A0 | Names + sounds all 28 letters; the four positional forms; the 6 non-connectors (ا د ذ ر ز و); reads fully-vowelled CV / CVV syllables aloud. |
| A1 | Reads fully-vowelled words + short sentences aloud accurately; sukūn, shaddah, tanwīn, ة, ى, sun/moon assimilation of ال. |
| A2 | Reads fully-vowelled paragraphs; begins reading high-frequency words with only ambiguity-resolving vowels; recognises common wazn patterns. |
| B1 | Reads mostly-unvowelled MSA on familiar topics, supplying vowels from pattern + context; broken plurals + derived forms in context. |
| B2 | Reads unvowelled authentic texts (news, articles, factual prose) with occasional lookup; follows the argument, separates main points from detail. |
| C1 | Reads editorials, essays, literary prose fluently; register shifts, ellipsis, complex subordination, implicit meaning. |
| C2 | Reads virtually any prose — classical, specialised academic/legal, sophisticated literary — parsing structural ambiguity + stylistic nuance. |

### writing *(composition self-assessed against a rubric at every level)*

| level | can-do |
|---|---|
| A0 | Forms all 28 letters in isolation, correct stroke order + direction; copies fully-vowelled syllables. |
| A1 | Correct joining in initial/medial/final position; spells familiar fully-vowelled words from dictation; short subject-predicate sentences. |
| A2 | Short connected paragraph on a familiar topic with basic connectors; high-frequency spelling generally accurate. |
| B1 | Straightforward connected texts (description, narrative, informal message); conjunctions + relative clauses; case endings attempted. |
| B2 | Clear detailed texts (argument paragraph, formal message, summary) with paragraphing + cohesion; case system + derived forms, occasional slips. |
| C1 | Well-structured essays + formal correspondence; register + style for the reader; subordinate structures + rhetorical devices. |
| C2 | Sophisticated prose — analytical essays, formal reports, stylised literary/persuasive — classical constructions + deliberate stylistic variation. |

### listening

| level | can-do |
|---|---|
| A0 | Distinguishes the 28 letter sounds + the hard contrasts (س/ص، ت/ط، د/ض، ه/ح، ك/ق، ذ/ز/ظ) in minimal pairs; short vs. long vowels by ear. |
| A1 | Familiar words + very short, slow, clear phrases (greetings, numbers, personal info) with repetition available. |
| A2 | Main point of short clear passages + simple exchanges on familiar everyday matters, near-natural pace. |
| B1 | Main points of clear standard speech on familiar topics (short narrative, interview, simple dialogue); a straightforward factual report. |
| B2 | Extended speech + most broadcast audio (news, documentary, discussion) on concrete + abstract topics; follows stance + argument. |
| C1 | Extended speech even when not clearly structured — lectures, debates, films; implicit meaning, humour, register. |
| C2 | Any standard-Arabic speech at natural native pace, incl. specialised lectures + rapid/accented delivery, given time to adjust. |

### speaking *(never machine-scored — self-assessed against model recordings)*

| level | can-do |
|---|---|
| A0 | Produces individual letter sounds + short syllables intelligibly by imitation. |
| A1 | Simple memorised phrases for personal info, greetings, very simple Q&A; long pauses normal. |
| A2 | Short social exchanges + simple routine transactions (ordering, buying, directions); describes family, background, surroundings simply. |
| B1 | Sustains conversation on familiar topics; narrates an event, gives reasons + brief explanations; some hesitation on less routine situations. |
| B2 | Fluency + spontaneity; clear detailed description or argument on a range of subjects; defends a point of view. |
| C1 | Fluent + almost effortless; flexible for social/academic/professional purposes; precise formulation, skilful turn-taking. |
| C2 | Effortless in any conversation with idiomatic + colloquial-register fluency; clear, smoothly flowing argument in a context-appropriate style. |

### vocabulary *(size bands scaled for Arabic's root density — recognising a root multiplies coverage)*

| level | can-do |
|---|---|
| A0 | Small set of concrete words + set phrases (greetings, a few objects, numbers 1–10), fully vowelled. |
| A1 | ~300–500 high-frequency words for personal details + everyday needs. |
| A2 | ~1,000–1,500 for routine topics; begins recognising root-based word families. |
| B1 | ~2,500–3,500; active use of common derived forms + verbal nouns; recognises many broken plurals. |
| B2 | ~5,000–7,000 incl. abstract + topical + lower-frequency; collocations + register distinctions. |
| C1 | ~8,000–10,000+ incl. idiomatic, literary, specialised; connotation + stylistic colour. |
| C2 | Very broad + precise incl. rare, classical, technical, figurative; near-native nuance + idiom. |

### grammar *(spine = CURRICULUM_ARCHITECTURE.md §10.2)*

| level | can-do |
|---|---|
| A0 | *Pre-grammar* — building the script + sound system; no sentence grammar expected yet. |
| A1 | Gender + number; definiteness (ال, tanwīn); nominal sentence; demonstratives; attached possessives; core prepositions; adjective agreement; negation ليس/لا/ما. |
| A2 | Verbal sentence + VSO; past + present Form I; 3 short-vowel case endings in fixed phrases; iḍāfa; object pronouns; كان; comparatives; numbers 1–10 + counted noun. |
| B1 | Derived Forms II–X (recognition + high-freq production); relative clauses; إنّ وأخواتها; maṣdar; participles; subjunctive after أن/لن/كي/حتى; expanded negation. |
| B2 | Full case system (iʿrāb) active; jussive; conditionals; internal passive; كان وأخواتها in full; ḥāl + tamyīz. |
| C1 | Rhetorical syntax — fronting/emphasis, particle nuance, stylistic case variation; complex subordination; formal + classical constructions. |
| C2 | Advanced iʿrāb incl. contested/stylistic parses; classical + heritage constructions; syntactic-ambiguity analysis. |

### pronunciation *(recognition scored; production compared to a model)*

| level | can-do |
|---|---|
| A0 | Short + long vowels + non-emphatic consonants intelligibly; recognises emphatic vs. plain + the pharyngeals ع ح by ear. |
| A1 | Most consonants clear incl. ع ح ق غ; sun/moon assimilation; word stress usually right; accent evident but not impeding. |
| A2 | Clearly intelligible on familiar material; shaddah + syllable-boundary clusters; ة correct in pause vs. construct. |
| B1 | Consistently intelligible; case-ending pronunciation attempted in careful speech; intonation carries statement/question. |
| B2 | Clear natural pronunciation + intonation; occasional low-frequency slips; reads a prepared text aloud with phrasing + case endings. |
| C1 | Near-native articulation + prosody; varies delivery for effect; occasional non-native feature only. |
| C2 | Effectively indistinguishable from an educated native speaker, incl. reading classical text aloud with correct iʿrāb. |

### comprehension *(synthesised — no single external scale; documented rationale)*

| level | can-do |
|---|---|
| A0 | *Not yet assessed* — decoding, not yet extracting meaning from connected text. |
| A1 | Specific predictable information from a very short simple text/exchange (name, number, time, place); overall topic when explicit. |
| A2 | Main idea + several supporting details on a familiar topic; simple strongly-signalled inferences. |
| B1 | Gist + sequence of ideas in a straightforward text/talk; fact vs. opinion when marked; infers unknown words from context. |
| B2 | Writer's/speaker's stance, purpose, line of argument; main points vs. supporting detail; how a text is organised. |
| C1 | Implicit meaning, tone, irony, attitude; relates a text to context + other texts; evaluates argument strength. |
| C2 | Critically analyses sophisticated texts for structure, style, assumption, effect; cultural + intertextual reference. |

## 4. Object tagging summary

234 objects, every one tagged with `skills[]` + `level` + `prereqs[]`.

| by strand | count | | by level | count |
|---|---:|---|---|---:|
| vocabulary | 162 (all lexemes) | | A0 | 192 |
| reading | 72 (letters, marks, syllables, texts, grammar points) | | A1 | 38 |
| pronunciation | 61 (letters, marks, syllables) | | A2 | 4 |
| writing | 28 (letters) | | | |
| grammar | 8 (3 points + 5 grammar texts) | | | |
| listening / comprehension | 8 each (texts) | | | |
| speaking | 0 — always self-tracked, never derived | | | |

**Lexeme levels unchanged from M14**: 131 at A0, 31 at A1 (the Word Bank's own split; refined in M16/M20).

## 5. Prerequisite edges — 62

M15 ships the graph *mechanism* + these edges (the full fine-grained graph is M16). Validated: acyclic, and **level-monotonic** (no prereq is a higher level than its dependent).

| edge family | count | rationale |
|---|---:|---|
| `mrk:fathatayn/kasratayn/dammatayn` ← the matching short vowel | 3 | tanwīn is a doubled short vowel |
| `mrk:madd-alif/ya/waw` ← the matching short vowel | 3 | a long vowel is the stretched short one |
| `mrk:sukun`, `mrk:shadda` ← all three short vowels | 6 | "no vowel" / "held consonant" only make sense once vowels are known |
| `syl:cvv-*` ← its consonant letter + its long-vowel mark | 16 | a CVV syllable is exactly those two parts |
| `syl:cvc-*` ← its consonant letter + `mrk:sukun` | 14 | closed syllable = consonant + coda-with-sukūn |
| `syl:gem-*` ← its consonant letter + `mrk:shadda` | 14 | gemination = the shadda on that consonant |
| `gr:sun-moon` ← `let:lam` | 1 | ال assimilation is about the ل of the article |
| `txt:gram-*` ← the grammar point it demonstrates | 5 | you meet the sentence after the rule |
| **total** | **62** | |

## 6. What `deriveLevel` will show (preview — honest by design)

M15's only mastery signal today is `progress.mastered` (lexeme ids). So:

- **`vocabulary`** — derived from mastered-lexeme coverage per level. A fresh learner → `{ level: null, reason: "insufficient evidence" }`. A learner who has mastered most A0 words → `A0` (firm, once ≥ 12 items) → `A1` as A1 words accumulate.
- **`reading` / `grammar` / `listening` / `comprehension` / `pronunciation`** — no per-object mastery signal yet → mostly `"insufficient evidence"` (the placement check is M17). A light bridge from `lessonsCompleted` gives a **provisional** floor (finished the harakāt / syllables / reading-foundations lessons → `reading` ≥ A0 provisional; finished `grammar-intro` → `grammar` **and** `reading` ≥ A1 provisional). This bridge is replaced by real object coverage in M16.
- **`writing` / `pronunciation`** (`assess: partial`) — a level only ever from the lesson bridge, shown **provisional**; never "firm."
- **`speaking`** (`assess: self-report`) — always `{ level: null, reason: "self-tracked" }`; shown as "self-tracked," never a derived level.
- **Headline level** (your Q5) = **min of `reading`, `vocabulary`, `grammar`** when all three are known ("Overall: …"); when only one or two are known it falls back to the min of those, labelled "So far: … from your …" so the panel never implies evidence it doesn't have; `null` (→ "complete a few lessons") when none are known.
- **Thresholds** (your Q4): a level `L` is "cleared" when ≥ 75 % of the strand's objects **at level `L`** are mastered (each level judged on its own objects — clearing A0 can't imply A1+). "Firm" additionally needs ≥ 12 mastered items in the strand **and** `assess: reliable`; otherwise "provisional." Tunable constants — deliberately conservative until M18/M19 add real signal.

---

## Sign-off

Approve, and implementation resumes at rollout step 4: extend `build-content.js` validation → `--write-app` → `deriveLevel` + `deriveHeadlineLevel` + the "Your skills" Progress panel + the `loadProgress` migration → QA → draft PR.
