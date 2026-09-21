# Arabic Learning App — Master Curriculum & Architectural Specification

**Status:** v2 — authoritative decisions applied 2026-09-21 (see §0.4).

---

## 0. Scope & Relationship to the Existing App

### 0.1 Enrichment layer, not a replacement

This specification is an **enrichment & adaptation layer** on top of the app's existing curriculum — the 45 lessons already built from A1 to B2 (`content/lessons/*.json`, compiled into `index.html` by `tools/build-content.js`). It does **not** replace, renumber, or re-sequence those lessons.

What this layer adds over the existing CEFR backbone:

- The **preference toggle** (🌍 General MSA / 🕌 Quranic & Islamic / 🔄 Both) — changes theme, vocabulary payload, and drill context only; grammar, phonetics, and progression stay shared.
- The **new drill types** in §2.
- The **Smart Nudge** two-way bridge in §5.
- The **vocabulary banks** (§3) and **minimal-pair matrix** (§4).

All changes to `content/*.json` schemas are additive. Where a word in §3 already exists as a lexeme in `content/lexemes.json`, seed data references that existing entry rather than creating a duplicate (e.g. بَيْت → `lex:hom-01`).

### 0.2 Transliteration convention

All transliteration follows the app's established convention (see `content/lexemes.json`):

- Lowercase, ALA-LC-style: `ʾ` (hamza), `ʿ` (ʿayn), macrons for long vowels (ā ī ū), underdots for emphatics and ḥ (ṣ ḍ ṭ ẓ ḥ), digraphs dh / gh / kh / sh.
- Nouns and adjectives in pausal form, no case ending or tanwīn (بَيْتٌ → `bayt`, هُدًى → `hudā`); tāʾ marbūṭa as `-ah` (سَيَّارَة → `sayyārah`).
- Verbs in full citation form (`kataba / yaktubu`).
- Grammar and phonetics term names as the app writes them: fatḥa, ḍamma, kasra, sukūn, shadda, tanwīn, iḍāfa, tāʾ marbūṭa, ḥarakāt.

### 0.3 Metalanguage & visual-signaling policy (summary)

- **A1:** zero grammatical metalanguage (§5.1).
- **A2:** functional semantic roles only — "Doer", "Action Receiver", "Description" — never iʿrāb terminology (§5.1).
- **All levels:** colour coding is never the only signal (§5.2).

### 0.4 Decision log

| # | Decision | Where applied |
| --- | --- | --- |
| 1–5 | Linguistic fixes: minimal pairs حَرَمٌ/هَرَمٌ, حَبَّ/هَبَّ, صَارَ/سَارَ, قَالَ/كَالَ; `sentence_builder` accepts multiple word orders via `accepted_orders` | §2, §4 |
| 6 | Definite article (الـ) & sun/moon letters moved from A2 to late A1.1, immediately before Demonstratives and Iḍāfa | §1, §5.3 |
| 7 | Strict zero metalanguage throughout A1; A2 uses functional semantic roles only; existing A1/A2 lessons with case terms refactored non-destructively | §5.1, §5.4 |
| 8 | Dual-channel visual signaling (WCAG 2.1 AA) — colour always paired with a second cue | §5.2 |
| 9 | This spec is a non-destructive layer over the existing 45 lessons; transliteration normalized to the app's convention | §0.1, §0.2 |

---

## 1. Curriculum & Pedagogical Framework (CEFR-Aligned)

### Core Philosophy: Unified Backbone with Layered Contexts

All learners follow the exact same morphological, phonological, and structural progression — the app's existing CEFR backbone (currently A1 -> B2, extending towards C1). The core structural syllabus remains constant, while vocabulary, themes, and interactive prompts dynamically adapt to the user's selected preference:

- 🌍 **General MSA Emphasis:** Everyday communication, family, travel, study, work.
- 🕌 **Quranic/Islamic Emphasis:** Prayer, high-frequency Quranic vocabulary, supplications, devotion.
- 🔄 **Both / Dual Track:** Alternating contextual examples.

> Unit titles in this spec are internal, author-facing labels. Learner-facing titles and copy must follow the metalanguage policy in §5.1.

---

### Level A1: Absolute Beginner to Elementary

*Target Competency:* Decoding, phonetic mastery, basic identification, and foundational nominal/verbal interaction.

#### Sub-Level A1.1: Foundations & Phonetics (Shared)

- **Unit 01: Alphabet & Isolated Shapes**
  - Letter identification & standard directional stroke-order (Watch -> Trace -> Write).
  - Minimal pairs listening setup for foreign learners.
- **Unit 02: Short Vowels (Ḥarakāt) & Sukūn**
  - Fatḥa [a], Ḍamma [u], Kasra [i], Sukūn [ø].
  - Auditory discrimination between vowel lengths.
- **Unit 03: Syllable Construction & Long Vowels (Madd)**
  - Open syllables (CV, CVV) & closed syllables (CVC).
  - Madd letters: Alif (ا), Wāw (و), Yāʾ (ي).
  - Shadda (Gemination) & Tanwīn (-an, -un, -in).
- **Unit 04: Definite Article (الـ) & Sun/Moon Letters** *(moved from A2 — Decision 6)*
  - Phonetic assimilation: sun letters (al-shamsiyya) vs. moon letters (al-qamariyya).
  - *Rationale:* learners must be able to read الـ before meeting structures such as كتابُ اللهِ and الكتابُ الجديدُ in A1.2.

#### Sub-Level A1.2: Functional Syntax & Dual Contexts

- **Unit 05: Demonstratives & Identification**
  - Structure: `[هذا + اسم]` / `[هذه + اسم]` | `[ما هذا؟ / مَنْ هذا؟]`
  - *General:* هذا بيتٌ / هذه سيارةٌ.
  - *Quranic:* هذا كتابٌ / هذه تذكرةٌ.
- **Unit 06: Personal Pronouns & Nominal Sentences**
  - Structure: `[ضمير منفصل + اسم / صفة]` (أنا، أنتَ، أنتِ، هو، هي، نحن).
  - *General:* أنا طالبٌ / هو مهندسٌ.
  - *Quranic:* هو مؤمنٌ / نحن مسلمون.
- **Unit 07: Possession & Annexation (Iḍāfa)**
  - Structure: `[اسم + ضمير متصل]` & `[مضاف + مضاف إليه]`.
  - *General:* كتابي / بيتُ المعلمِ.
  - *Quranic:* ربي / كتابُ اللهِ.

---

### Level A2: Elementary Communicative Fluency

- **Unit 08: Prepositions & Spatial Directions (Ḥurūf al-Jarr)**
  - Particle usage: في، على، إلى، مِنْ، مَعَ.
  - *General:* الطالب في الجامعةِ / ذهب إلى السوقِ.
  - *Quranic:* المؤمن في المسجدِ / نزل من السماءِ.
- **Unit 09: Present Tense & Daily Routine**
  - Subject-Verb conjugation (Singular & Plural).
  - High-frequency functional verbs: (يقرأ، يكتب، يشرب، يذهب، يصلي، يذكر).
- **Unit 10: Gender & Number Agreement**
  - Dual and Sound Plurals (مذكر سالم / مؤنث سالم) & Tāʾ Marbūṭa.

---

## 2. Interactive Drills & Generation Engine

### JSON Schemas for Exercise Types

#### 1. Minimal Pair Auditory Discrimination

```json
{
  "drill_id": "aud_min_001",
  "type": "minimal_pair_discrimination",
  "target_contrast": ["ح", "هـ"],
  "focus_phoneme": "ح",
  "audio_target": "audio/words/haram-sanctuary.mp3",
  "options": [
    {"text": "حَرَم", "is_correct": true, "translit": "ḥaram"},
    {"text": "هَرَم", "is_correct": false, "translit": "haram"}
  ],
  "prompt_en": "Listen and select the word containing the deep throat sound /ḥ/ (ح):",
  "prompt_fr": "Écoutez et choisissez le mot contenant le son /ḥ/ (ح):"
}
```

Options are single words heard in isolation, so they are written in pausal form (no tanwīn), matching the audio and the transliteration.

#### 2. Pattern Substitution Drill (Functional Grammar)

```json
{
  "drill_id": "sub_pat_001",
  "type": "pattern_substitution",
  "context": "general",
  "base_sentence": "هَذَا كِتَابٌ جَمِيلٌ",
  "prompt_cue": "سَيَّارَةٌ",
  "correct_sentence": "هَذِهِ سَيَّارَةٌ جَمِيلَةٌ",
  "distractors": [
    "هَذَا سَيَّارَةٌ جَمِيلٌ",
    "هَذِهِ سَيَّارَةٌ جَمِيلٌ",
    "هَذَا سَيَّارَةٌ جَمِيلَةٌ"
  ],
  "explanation_en": "سَيَّارَة ends in ـة, so the words around it change to match: هَذَا becomes هَذِهِ, and جَمِيلٌ becomes جَمِيلَةٌ."
}
```

This is an A1 drill, so `explanation_en` describes the visible pattern and uses no grammatical terms (§5.1).

#### 3. Stepwise De-vowelling Reader

```json
{
  "drill_id": "read_step_001",
  "type": "reduced_vowel_reading",
  "level_1_full": "ذَهَبَ الطَّالِبُ إِلَى الْمَسْجِدِ",
  "level_2_partial": "ذَهَب الطالبُ إلى المسجدِ",
  "level_3_unvowelled": "ذهب الطالب إلى المسجد",
  "translation_en": "The student went to the mosque.",
  "audio_url": "audio/sentences/student_masjid.mp3"
}
```

#### 4. Sentence Builder (Drag & Drop)

```json
{
  "drill_id": "arr_001",
  "type": "sentence_builder",
  "tokens": ["الْمُسْلِمُ", "يَقْرَأُ", "الْقُرْآنَ", "فِي", "الْمَسْجِدِ"],
  "accepted_orders": [
    [0, 1, 2, 3, 4],
    [1, 0, 2, 3, 4]
  ],
  "translation_en": "The Muslim reads the Quran in the mosque."
}
```

- `tokens` are stored in one canonical order and shuffled at runtime.
- `accepted_orders` lists every arrangement of token indices graded as correct. Here both the nominal-sentence order (الْمُسْلِمُ يَقْرَأُ الْقُرْآنَ فِي الْمَسْجِدِ) and the verbal-sentence order (يَقْرَأُ الْمُسْلِمُ الْقُرْآنَ فِي الْمَسْجِدِ) are accepted.
- Each entry must be a permutation of all token indices; at least one entry is required.

---

## 3. Core Vocabulary Banks (Dual-Layered)

### 1. High-Frequency General MSA Bank

| Arabic (Vowelled) | Transliteration | Part of Speech | English Meaning | French Meaning |
| --- | --- | --- | --- | --- |
| بَيْتٌ | bayt | Noun (m) | House / Home | Maison |
| قَلَمٌ | qalam | Noun (m) | Pen | Stylo |
| بَابٌ | bāb | Noun (m) | Door | Porte |
| سَيَّارَةٌ | sayyārah | Noun (f) | Car | Voiture |
| مَدِينَةٌ | madīnah | Noun (f) | City | Ville |
| طَعَامٌ | ṭaʿām | Noun (m) | Food | Nourriture |
| مَاءٌ | māʾ | Noun (m) | Water | Eau |
| رَجُلٌ | rajul | Noun (m) | Man | Homme |
| اِمْرَأَةٌ | imraʾah | Noun (f) | Woman | Femme |
| وَلَدٌ | walad | Noun (m) | Boy / Child | Garçon / Enfant |
| طَالِبٌ | ṭālib | Noun (m) | Student | Étudiant |
| مُعَلِّمٌ | muʿallim | Noun (m) | Teacher | Enseignant |
| كَبِيرٌ | kabīr | Adjective (m) | Big / Large | Grand |
| صَغِيرٌ | ṣaghīr | Adjective (m) | Small | Petit |
| جَدِيدٌ | jadīd | Adjective (m) | New | Nouveau |

### 2. High-Frequency Quranic & Devotional Bank

| Arabic (Vowelled) | Transliteration | Part of Speech | English Meaning | Quranic Occurrences Context |
| --- | --- | --- | --- | --- |
| رَبٌّ | rabb | Noun (m) | Lord / Sustainer | رَبِّ الْعَالَمِينَ |
| قُرْآنٌ | qurʾān | Noun (m) | Quran / Recitation | إِنَّ هَٰذَا الْقُرْآنَ |
| مَسْجِدٌ | masjid | Noun (m) | Mosque | إِلَى الْمَسْجِدِ |
| صَلَاةٌ | ṣalāh | Noun (f) | Prayer | أَقِيمُوا الصَّلَاةَ |
| نُورٌ | nūr | Noun (m) | Light | نُورٌ عَلَىٰ نُورٍ |
| قَلْبٌ | qalb | Noun (m) | Heart | فِي قُلُوبِهِمْ |
| يَوْمٌ | yawm | Noun (m) | Day | يَوْمِ الدِّينِ |
| رَحْمَةٌ | raḥmah | Noun (f) | Mercy | رَحْمَةً لِلْعَالَمِينَ |
| هُدًى | hudā | Noun (m) | Guidance | هُدًى لِلْمُتَّقِينَ |
| جَنَّةٌ | jannah | Noun (f) | Paradise / Garden | جَنَّاتِ النَّعِيمِ |

### 3. High-Frequency Functional Verbs (Shared Core)

| Verb (Past / Present) | Transliteration | Root | English Meaning |
| --- | --- | --- | --- |
| قَرَأَ / يَقْرَأُ | qaraʾa / yaqraʾu | ق-ر-أ | He read / He reads |
| كَتَبَ / يَكْتُبُ | kataba / yaktubu | ك-ت-ب | He wrote / He writes |
| سَمِعَ / يَسْمَعُ | samiʿa / yasmaʿu | س-م-ع | He heard / He hears |
| عَلِمَ / يَعْلَمُ | ʿalima / yaʿlamu | ع-ل-م | He knew / He knows |
| ذَهَبَ / يَذْهَبُ | dhahaba / yadhhabu | ذ-ه-ب | He went / He goes |
| خَلَقَ / يَخْلُقُ | khalaqa / yakhluqu | خ-ل-ق | He created / He creates |

---

## 4. Phonetics Matrix & Minimal Pair Contrasts

Every pair differs in exactly one sound, and both members are real words.

| Target Sound | Contrast Sound | Target Word | Contrast Word | Contrast Meaning | Focus Point |
| --- | --- | --- | --- | --- | --- |
| ح /ḥ/ | هـ /h/ | حَرَمٌ (Sanctuary) | هَرَمٌ (Pyramid) | Pharyngeal fricative vs. Glottal | Deep throat friction |
|  |  | حَبَّ (Loved) | هَبَّ (Blew) |  |  |
| ع /ʿ/ | أ /ʾ/ (Hamza) | عَلِمَ (Knew) | أَلِمَ (Felt pain) | Voiced pharyngeal vs. Glottal stop | Mid-throat constriction |
|  |  | عَمَلٌ (Action) | أَمَلٌ (Hope) |  |  |
| ص /ṣ/ | س /s/ | صَيْفٌ (Summer) | سَيْفٌ (Sword) | Emphatic vs. Plain | Tongue retraction & resonance |
|  |  | صَارَ (Became) | سَارَ (Walked) |  |  |
| ط /ṭ/ | ت /t/ | طَابَ (Became good) | تَابَ (Repented) | Emphatic dental vs. Plain dental | Heavy dental explosion |
|  |  | طِينٌ (Clay) | تِينٌ (Fig) |  |  |
| ق /q/ | ك /k/ | قَلْبٌ (Heart) | كَلْبٌ (Dog) | Uvular stop vs. Velar stop | Deep back of throat tap |
|  |  | قَالَ (Said) | كَالَ (Measured out, by volume — Quranic, cf. 83:3) |  |  |
| ض /ḍ/ | د /d/ | ضَلَّ (Strayed) | دَلَّ (Guided) | Emphatic lateralized vs. Dental | Tongue-side dental closure |

---

## 5. Functional Grammar & Intelligent Nudge Rules

### 5.1 Metalanguage Policy (Decision 7)

| Level | What learners see | Never shown |
| --- | --- | --- |
| **A1** | Zero metalanguage. Grammar is learned only through implicit patterns, colour-plus-underline signaling (§5.2), substitution drills, and chunks. No role labels. | Any grammatical term, English or Arabic — e.g. *Fāʿil, Mafʿūl, Mubtadaʾ, Khabar, Marfūʿ, Manṣūb*, "subject", "adjective", "feminine". |
| **A2** | Functional semantic roles only: **Doer**, **Action Receiver**, **Description**. | Theoretical iʿrāb terminology (*Fāʿil, Mafʿūl, Marfūʿ, Manṣūb*, case names). |
| **B1 onward** | Unchanged — the existing B1/B2 lessons introduce formal role and case terminology as already built. | — |

This applies to all learner-facing text: lesson and unit titles, drill prompts, explanations, feedback, and nudge copy.

Pedagogy guidelines:

1. **Implicit Learning:** Teach grammar through colour-coded, underline-coded patterns (§5.2) and repetitive pattern recognition.
2. **Chunking:** Present complete functional chunks before breaking them down.

### 5.2 Accessible Visual Signaling — WCAG 2.1 AA (Decision 8)

Colour is **never** the only signal. Every colour-coded role also carries at least one non-colour cue:

| Role | Colour | Secondary cue | Role tag (A2+) |
| --- | --- | --- | --- |
| Doer | Green text | Solid underline | "Doer" pill |
| Action Receiver | Blue text | Dashed underline | "Action Receiver" pill |
| Description | To be assigned | Distinct underline style (to be assigned) | "Description" pill |

- In A1, roles are signaled by colour + underline only; the text pill tags appear from A2, because a role name is itself metalanguage.
- Exact colour values must pass the app's contrast audit (`node tools/a11y-audit.js`, WCAG AA) in both light and dark mode.

### 5.3 Progression Sequence

```text
Step 0: Definite Article & Sun/Moon Letters (الـ) — A1.1 Unit 04 (Decision 6)
        ↓
Step 1: Demonstratives (هذا / هذه)
        ↓
Step 2: Subject Pronouns (أنا / أنتَ / أنتِ / هو / هي)
        ↓
Step 3: Definiteness & Adjectives (كتابٌ جديدٌ vs. الكتابُ الجديدُ)
        ↓
Step 4: Attached Pronouns & Possession (كتابي / كتابكَ / كتابه)
        ↓
Step 5: Prepositions (في / على / من / إلى)
        ↓
Step 6: Present Verbs (هو يقرأ / هي تقرأ / أنا أقرأ)
        ↓
Step 7: Plurals (ـونَ / ـات)
```

### 5.4 Existing A1/A2 Lessons to Refactor (Decision 7)

A keyword scan found case terminology (nominative / accusative / genitive) in these existing lessons:

- `content/lessons/a1-grammar-function-words.json`
- `content/lessons/a1-numbers.json`
- `content/lessons/a2-idafa.json`
- `content/lessons/a2-numbers-11-99.json`
- `content/lessons/a2-prices.json`
- `content/lessons/a2-verbal-sentence.json`

Each is to be checked for learner-facing terminology and refactored **non-destructively** into functional pattern models: lesson ids, object ids, and learner progress stay intact; only the teaching presentation changes. This is a separate, scoped task — not yet done.

### 5.5 Dynamic Nudge (Two-Way Bridge) Rules

#### Rule A: General Track Learner -> Quranic Discovery

- Trigger: Completing a grammatical milestone (e.g., Step 3: Adjective Agreement).
- Prompt (A1 learner — no grammatical terms, §5.1):

  > "Great job! You can now make describing words match the word they describe. Would you like to see this pattern in a famous Quranic verse?"

- Action: Displays Quranic verse with vocabulary breakdown (e.g., Surah Al-Buruj 85:21-22: بَلْ هُوَ قُرْآنٌ مَجِيدٌ \* فِي لَوْحٍ مَحْفُوظٍ).

#### Rule B: Quranic Track Learner -> General MSA Discovery

- Trigger: Mastering a root verb (e.g., ك-ت-ب).
- Prompt:

  > "You know 'كَتَبَ' from the Quran. Want to see how you can use this to say 'I am writing an email' today?"

- Action: Displays a practical modern communicative dialogue snippet.
