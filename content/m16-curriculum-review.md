# M16 · curriculum-spine review

**This is the M16 sign-off gate.** The `levels → units → lessons` tree in [`content/curriculum.json`](curriculum.json) and the `objectives` wiring of every lesson to M14 learning objects are drafted below. Review, then approve — the Learn-view rebuild, the 7-stage generator, and the `deriveLevel` bridge swap are on hold until you do.

Files: [`content/curriculum.json`](curriculum.json) · validated by [`tools/build-content.js`](../tools/build-content.js) (`--check` green).

---

## 1. Shape

| level | status | units | lessons | notes |
|---|---|---:|---:|---|
| Pre-A1 · Absolute Beginner | available | 4 | 11 | all existing foundation content, re-homed into 4 units |
| A1 · Beginner | available | 5 | 7 | 3 real units (2 from existing lessons, 1 new); 2 units + 2 lessons flagged *in development* |
| A2 · Elementary | planned | 6 | 0 | unit stubs only — the map for M20+; no lesson nodes |
| B1 · Intermediate | planned | 6 | 0 | unit stubs only — the map for M20+; no lesson nodes |
| B2 · Upper Intermediate | planned | 6 | 0 | unit stubs only — the map for M20+; no lesson nodes |
| C1 · Advanced | planned | 5 | 0 | unit stubs only — the map for M20+; no lesson nodes |
| C2 · Mastery | planned | 5 | 0 | unit stubs only — the map for M20+; no lesson nodes |

Totals: **37 units, 18 lesson nodes** (15 available, 1 preview, 2 planned).

## 2. A0 & A1 — the real tree

### Pre-A1 · Absolute Beginner

**a0-u1 — The Arabic Alphabet**  
All 28 letters — name, sound, the four positional forms, and which six never join to the left.  
*skills: reading, writing, pronunciation*

| lesson | level | status | source | objectives |
|---|---|---|---|---|
| **Meet the Arabic Alphabet** (`l1`) | A0 | available | `view:alphabet` | أَلِف, بَاء, تَاء, … (28 total) |
| **Arabic Letter Shapes** (`l2`) | A0 | preview | `view:alphabet` | أَلِف, بَاء, تَاء, … (28 total) |
| **Letter Writing Practice** (`alphabet-writing-1`) | A0 | available | `steps:alphabet-writing-1` | أَلِف, بَاء, تَاء, … (28 total) |
| **Directional Stroke-Order Writing** (`stroke-order-writing`) | A0 | available | `steps:stroke-order-writing` | أَلِف, بَاء, تَاء, … (28 total) |

**a0-u2 — Ḥarakāt & Reading Marks**  
The short vowels, sukūn, shaddah, tanwīn, and the long vowels — everything written above and below the line.  
*skills: reading, pronunciation · after a0-u1*

| lesson | level | status | source | objectives |
|---|---|---|---|---|
| **Harakāt & Reading Marks** (`l3`) | A0 | available | `steps:harakat-intro` | fatḥah, kasrah, ḍammah, … (11 total) |
| **Reading Foundations** (`reading-foundations`) | A0 | available | `steps:reading-foundations` | fatḥah, kasrah, ḍammah |

**a0-u3 — Building & Blending Syllables**  
Combine a consonant and a mark into a syllable, then read open, closed, and doubled syllables aloud.  
*skills: reading, pronunciation · after a0-u2*

| lesson | level | status | source | objectives |
|---|---|---|---|---|
| **Reading Simple Syllables** (`l4`) | A0 | available | `steps:syllables-1` | fatḥah, kasrah, ḍammah, بَاء, مِيم, تَاء |
| **Syllables: Long Vowels, Closed Syllables & Doubling** (`syllables-intro`) | A0 | available | `steps:syllables-intro` | بَا, بِي, بُو, … (27 total) |

**a0-u4 — First Words & Sounds**  
Your first real vocabulary, plus ear training and pronunciation practice on familiar words.  
*skills: vocabulary, listening, pronunciation · after a0-u2*

| lesson | level | status | source | objectives |
|---|---|---|---|---|
| **First Arabic Words** (`l5`) | A0 | available | `view:vocabulary` | hello, goodbye, mother, … (39 total) |
| **Listening Foundations** (`listening-foundations`) | A0 | available | `steps:listening-foundations` | water, house, book, … (7 total) |
| **Pronunciation Foundations** (`pronunciation-foundations`) | A0 | available | `steps:pronunciation-foundations` | water, house, book, thank you, hello |

### A1 · Beginner

**a1-u1 — Your First Sentences**  
The nominal sentence, noun–adjective agreement, the definite article, and present-tense verbs for reading.  
*skills: reading, grammar, comprehension · after a0-u3, a0-u4*

| lesson | level | status | source | objectives |
|---|---|---|---|---|
| **Reading Real Sentences** (`sentence-reading`) | A1 | available | `steps:sentence-reading` | The house is big., The book is beautiful., The girl is happy. |
| **Grammar for Reading** (`grammar-intro`) | A2 | available | `steps:grammar-intro` | Noun–adjective gender agreement, Sun & moon letters (definite-article assimilation), Present-tense verb prefixes (he / she / they), … (8 total) |

**a1-u2 — Reading Beyond Full Vowels**  
The same sentences with the vowel marks progressively removed — a first look at how Arabic is really written.  
*skills: reading · after a1-u1*

| lesson | level | status | source | objectives |
|---|---|---|---|---|
| **Reading Without Full Vowelling** (`unvowelled-reading`) | A2 | available | `steps:unvowelled-reading` | The house is big., The book is beautiful., The girl is happy. |

**a1-u3 — Everyday Words**  
High-frequency vocabulary for daily life — colours, useful questions, people, and describing things.  
*skills: vocabulary · after a0-u4*

| lesson | level | status | source | objectives |
|---|---|---|---|---|
| **Colours** (`a1-colours`) | A1 | available | `generate` | red, blue, green, … (10 total) |
| **Useful Questions** (`a1-useful-questions`) | A1 | available | `generate` | I don't know, Where is the bathroom?, What time is it?, How much is this? |
| **He, She, They** (`a1-pronouns`) | A1 | planned | `generate` | he, she, they (masculine/mixed group) |
| **Describing Things** (`a1-describing`) | A1 | planned | `generate` | easy, difficult |

**a1-u4 — Talking About People & Places** *(in development)*  
Family, homes, towns, and the phrases that connect them. In development.  
*skills: vocabulary, grammar, speaking · after a1-u1, a1-u3*

_(no lessons yet)_

**a1-u5 — Numbers 1–10** *(in development)*  
Counting, the counted noun, and telling the time — the start of the numbers strand. In development.  
*skills: vocabulary, grammar · after a1-u3*

_(no lessons yet)_

## 3. Every lesson's objectives (full)

**Meet the Arabic Alphabet** (`l1`, A0, available) — `view:alphabet`

- `let:alif` أَلِف
- `let:ba` بَاء
- `let:ta1` تَاء
- `let:tha` ثَاء
- `let:jim` جِيم
- `let:ha1` حَاء
- `let:kha` خَاء
- `let:dal` دَال
- `let:dhal` ذَال
- `let:ra` رَاء
- `let:zay` زَاي
- `let:sin` سِين
- `let:shin` شِين
- `let:sad` صَاد
- `let:dad` ضَاد
- `let:ta2` طَاء
- `let:za2` ظَاء
- `let:ayn` عَيْن
- `let:ghayn` غَيْن
- `let:fa` فَاء
- `let:qaf` قَاف
- `let:kaf` كَاف
- `let:lam` لَام
- `let:mim` مِيم
- `let:nun` نُون
- `let:ha2` هَاء
- `let:waw` وَاو
- `let:ya` يَاء

**Arabic Letter Shapes** (`l2`, A0, preview) — `view:alphabet`

- `let:alif` أَلِف
- `let:ba` بَاء
- `let:ta1` تَاء
- `let:tha` ثَاء
- `let:jim` جِيم
- `let:ha1` حَاء
- `let:kha` خَاء
- `let:dal` دَال
- `let:dhal` ذَال
- `let:ra` رَاء
- `let:zay` زَاي
- `let:sin` سِين
- `let:shin` شِين
- `let:sad` صَاد
- `let:dad` ضَاد
- `let:ta2` طَاء
- `let:za2` ظَاء
- `let:ayn` عَيْن
- `let:ghayn` غَيْن
- `let:fa` فَاء
- `let:qaf` قَاف
- `let:kaf` كَاف
- `let:lam` لَام
- `let:mim` مِيم
- `let:nun` نُون
- `let:ha2` هَاء
- `let:waw` وَاو
- `let:ya` يَاء

**Letter Writing Practice** (`alphabet-writing-1`, A0, available) — `steps:alphabet-writing-1`

- `let:alif` أَلِف
- `let:ba` بَاء
- `let:ta1` تَاء
- `let:tha` ثَاء
- `let:jim` جِيم
- `let:ha1` حَاء
- `let:kha` خَاء
- `let:dal` دَال
- `let:dhal` ذَال
- `let:ra` رَاء
- `let:zay` زَاي
- `let:sin` سِين
- `let:shin` شِين
- `let:sad` صَاد
- `let:dad` ضَاد
- `let:ta2` طَاء
- `let:za2` ظَاء
- `let:ayn` عَيْن
- `let:ghayn` غَيْن
- `let:fa` فَاء
- `let:qaf` قَاف
- `let:kaf` كَاف
- `let:lam` لَام
- `let:mim` مِيم
- `let:nun` نُون
- `let:ha2` هَاء
- `let:waw` وَاو
- `let:ya` يَاء

**Directional Stroke-Order Writing** (`stroke-order-writing`, A0, available) — `steps:stroke-order-writing`

- `let:alif` أَلِف
- `let:ba` بَاء
- `let:ta1` تَاء
- `let:tha` ثَاء
- `let:jim` جِيم
- `let:ha1` حَاء
- `let:kha` خَاء
- `let:dal` دَال
- `let:dhal` ذَال
- `let:ra` رَاء
- `let:zay` زَاي
- `let:sin` سِين
- `let:shin` شِين
- `let:sad` صَاد
- `let:dad` ضَاد
- `let:ta2` طَاء
- `let:za2` ظَاء
- `let:ayn` عَيْن
- `let:ghayn` غَيْن
- `let:fa` فَاء
- `let:qaf` قَاف
- `let:kaf` كَاف
- `let:lam` لَام
- `let:mim` مِيم
- `let:nun` نُون
- `let:ha2` هَاء
- `let:waw` وَاو
- `let:ya` يَاء

**Harakāt & Reading Marks** (`l3`, A0, available) — `steps:harakat-intro`

- `mrk:fatha` fatḥah
- `mrk:kasra` kasrah
- `mrk:damma` ḍammah
- `mrk:sukun` sukūn
- `mrk:shadda` shaddah
- `mrk:fathatayn` fatḥatayn
- `mrk:kasratayn` kasratayn
- `mrk:dammatayn` ḍammatayn
- `mrk:madd-alif` fatḥah + alif
- `mrk:madd-ya` kasrah + yāʾ
- `mrk:madd-waw` ḍammah + wāw

**Reading Foundations** (`reading-foundations`, A0, available) — `steps:reading-foundations`

- `mrk:fatha` fatḥah
- `mrk:kasra` kasrah
- `mrk:damma` ḍammah

**Reading Simple Syllables** (`l4`, A0, available) — `steps:syllables-1`

- `mrk:fatha` fatḥah
- `mrk:kasra` kasrah
- `mrk:damma` ḍammah
- `let:ba` بَاء
- `let:mim` مِيم
- `let:ta1` تَاء

**Syllables: Long Vowels, Closed Syllables & Doubling** (`syllables-intro`, A0, available) — `steps:syllables-intro`

- `syl:cvv-ba` بَا
- `syl:cvv-bi` بِي
- `syl:cvv-bu` بُو
- `syl:cvv-ma` مَا
- `syl:cvv-mi` مِي
- `syl:cvv-mu` مُو
- `syl:cvv-ta` تَا
- `syl:cvv-ti` تِي
- `syl:cvv-tu` تُو
- `syl:cvc-ba` بَحْ
- `syl:cvc-bi` بِنْ
- `syl:cvc-bu` بُرْ
- `syl:cvc-ma` مَدْ
- `syl:cvc-mi` مِرْ
- `syl:cvc-mu` مُسْ
- `syl:cvc-ta` تَشْ
- `syl:cvc-ti` تِسْ
- `syl:cvc-tu` تُصْ
- `syl:gem-da` دَّ
- `syl:gem-ma` مَّ
- `syl:gem-ta` تَّ
- `syl:gem-ka` كَّ
- `mrk:madd-alif` fatḥah + alif
- `mrk:madd-ya` kasrah + yāʾ
- `mrk:madd-waw` ḍammah + wāw
- `mrk:sukun` sukūn
- `mrk:shadda` shaddah

**First Arabic Words** (`l5`, A0, available) — `view:vocabulary`

- `lex:gre-01` hello
- `lex:gre-08` goodbye
- `lex:peo-01` mother
- `lex:peo-02` father
- `lex:peo-03` brother
- `lex:peo-04` sister
- `lex:peo-11` friend (male)
- `lex:num-01` one
- `lex:num-02` two
- `lex:num-03` three
- `lex:num-04` four
- `lex:num-05` five
- `lex:num-06` six
- `lex:num-07` seven
- `lex:num-08` eight
- `lex:num-09` nine
- `lex:num-10` ten
- `lex:foo-01` bread
- `lex:foo-09` water
- `lex:foo-10` coffee
- `lex:foo-11` tea
- `lex:hom-01` house
- `lex:hom-06` door
- `lex:hom-07` window
- `lex:hom-08` table
- `lex:hom-09` chair
- `lex:sch-01` school
- `lex:sch-06` book
- `lex:sch-07` pen
- `lex:sch-08` notebook
- `lex:obj-01` phone
- `lex:obj-02` computer
- `lex:tim-01` today
- `lex:tim-05` morning
- `lex:tim-06` evening
- `lex:exp-01` please
- `lex:exp-02` thank you
- `lex:exp-05` yes
- `lex:exp-06` no

**Listening Foundations** (`listening-foundations`, A0, available) — `steps:listening-foundations`

- `lex:foo-09` water
- `lex:hom-01` house
- `lex:sch-06` book
- `lex:gre-01` hello
- `lex:gre-08` goodbye
- `lex:exp-01` please
- `lex:exp-02` thank you

**Pronunciation Foundations** (`pronunciation-foundations`, A0, available) — `steps:pronunciation-foundations`

- `lex:foo-09` water
- `lex:hom-01` house
- `lex:sch-06` book
- `lex:exp-02` thank you
- `lex:gre-01` hello

**Reading Real Sentences** (`sentence-reading`, A1, available) — `steps:sentence-reading`

- `txt:sent-house-big` The house is big.
- `txt:sent-book-beautiful` The book is beautiful.
- `txt:sent-girl-happy` The girl is happy.

**Grammar for Reading** (`grammar-intro`, A2, available) — `steps:grammar-intro`

- `gr:gender-agreement` Noun–adjective gender agreement
- `gr:sun-moon` Sun & moon letters (definite-article assimilation)
- `gr:present-tense` Present-tense verb prefixes (he / she / they)
- `txt:gram-gender-bint` The girl is big.
- `txt:gram-sunletter-shams` The sun is big.
- `txt:gram-verb-he` He goes to school.
- `txt:gram-verb-she` She goes to school.
- `txt:gram-verb-they` They go to school.

**Reading Without Full Vowelling** (`unvowelled-reading`, A2, available) — `steps:unvowelled-reading`

- `txt:sent-house-big` The house is big.
- `txt:sent-book-beautiful` The book is beautiful.
- `txt:sent-girl-happy` The girl is happy.

**Colours** (`a1-colours`, A1, available) — `generate`

- `lex:col-01` red
- `lex:col-02` blue
- `lex:col-03` green
- `lex:col-04` yellow
- `lex:col-05` black
- `lex:col-06` white
- `lex:col-07` orange
- `lex:col-08` brown
- `lex:col-09` pink
- `lex:col-10` gray

**Useful Questions** (`a1-useful-questions`, A1, available) — `generate`

- `lex:exp-07` I don't know
- `lex:exp-08` Where is the bathroom?
- `lex:exp-09` What time is it?
- `lex:exp-10` How much is this?

**He, She, They** (`a1-pronouns`, A1, planned) — `generate`

- `lex:pro-01` he
- `lex:pro-02` she
- `lex:pro-03` they (masculine/mixed group)

**Describing Things** (`a1-describing`, A1, planned) — `generate`

- `lex:adj-10` easy
- `lex:adj-11` difficult

## 4. A2–C2 — the stub map (no lesson nodes)

Each is a `status: "planned"` unit carrying a title, level, skills, and a blurb — the slots M20/M21 fill. Sourced from CURRICULUM_ARCHITECTURE.md §10.

### A2 · Elementary

| unit | title | skills | after |
|---|---|---|---|
| `a2-u1` | The Verbal Sentence | grammar, reading | a1-u1 |
| `a2-u2` | The Genitive Construct (Iḍāfa) | grammar, reading | a1-u1 |
| `a2-u3` | Root & Pattern — First Look | grammar, vocabulary | a2-u1 |
| `a2-u4` | Numbers, Counting & Time | vocabulary, grammar | a1-u5 |
| `a2-u5` | Reading Short Paragraphs | reading, comprehension | a1-u2 |
| `a2-u6` | Everyday Exchanges | listening, speaking, comprehension | a1-u3 |

### B1 · Intermediate

| unit | title | skills | after |
|---|---|---|---|
| `b1-u1` | Derived Verb Forms II–X | grammar, vocabulary | a2-u1, a2-u3 |
| `b1-u2` | Relative Clauses & Longer Sentences | grammar, reading | a2-u2 |
| `b1-u3` | Verbal Nouns & Participles | grammar, vocabulary | b1-u1 |
| `b1-u4` | Reading Unvowelled MSA | reading | a2-u5 |
| `b1-u5` | Understanding Standard Speech | listening, comprehension | a2-u6 |
| `b1-u6` | Writing Connected Texts | writing | b1-u2 |

### B2 · Upper Intermediate

| unit | title | skills | after |
|---|---|---|---|
| `b2-u1` | The Full Case System (Iʿrāb) | grammar | b1-u2 |
| `b2-u2` | The Passive, the Jussive & Conditionals | grammar | b1-u3 |
| `b2-u3` | Weak & Irregular Verbs | grammar, vocabulary | b1-u1 |
| `b2-u4` | Reading the News | reading, comprehension | b1-u4 |
| `b2-u5` | Broadcast & Extended Audio | listening, comprehension | b1-u5 |
| `b2-u6` | Argumentative Writing | writing | b1-u6 |

### C1 · Advanced

| unit | title | skills | after |
|---|---|---|---|
| `c1-u1` | Rhetorical Syntax & Style | grammar, reading | b2-u1 |
| `c1-u2` | Editorials, Essays & Literary Prose | reading, comprehension | b2-u4 |
| `c1-u3` | Register & Formal Correspondence | writing | b2-u6 |
| `c1-u4` | Following Lectures & Debates | listening, comprehension | b2-u5 |
| `c1-u5` | Fluent Discussion | speaking | b2-u5 |

### C2 · Mastery

| unit | title | skills | after |
|---|---|---|---|
| `c2-u1` | Advanced Iʿrāb & Contested Parses | grammar | c1-u1 |
| `c2-u2` | Classical & Heritage Texts | reading | c1-u2 |
| `c2-u3` | Academic & Analytical Writing | writing | c1-u3 |
| `c2-u4` | Near-Native Comprehension | comprehension, listening | c1-u2, c1-u4 |
| `c2-u5` | Idiomatic & Stylistic Mastery | speaking, vocabulary | c1-u5 |

## 5. What `deriveLevel` will do with this (preview)

The M15 `LESSON_LEVEL_FLOOR` map (11 hand-maintained rows) is replaced by **real coverage from `progress.objectsIntroduced`** — the union of `objectives` across every completed lesson.

- **Mastery coverage** (`progress.mastered`) is unchanged and always wins — it can be `firm`.
- **Introduced coverage** is the new bridge: a strand reaches a level *provisionally* when enough of its objects at that level have been introduced by a completed lesson. **Capped at A1** — completing lessons can never assert A2+ (that needs graded evidence in M18/M19). This keeps the honest contract: *introduced ≠ learned*.
- `self-report` (speaking) → always `null`. `partial` (writing, pronunciation) → provisional at most. No evidence → `{ level: null, reason: "insufficient evidence" }`.

Worked examples (fresh profile, then completing the lesson shown):

| completed | introduces | strand effect |
|---|---|---|
| Meet the Arabic Alphabet | 28 `let:*` | reading / writing / pronunciation → **A0 · provisional** |
| Harakāt & Reading Marks | 11 `mrk:*` | reading / pronunciation → stays **A0 · provisional** (marks are A0) |
| Reading Real Sentences | 3 `txt:sent-*` | reading / comprehension → **A1 · provisional** |
| Grammar for Reading | 3 `gr:*` + 5 `txt:gram-*` | grammar → **A1 · provisional** (A2 objects are introduced but the bridge is capped at A1) |
| Colours (generated) | 10 `lex:col-*` | vocabulary → still **keep going** (introduced ≠ mastered; vocabulary level needs mastery) |

## 6. Decisions & refinements to confirm

1. **`objectives` live only on curriculum nodes**, not duplicated onto the `lessons` catalog objects in `index.html`. A `lessonObjectives(completedId)` resolver maps either id form (`l3` or `harakat-intro`) to the node's list. Single source of truth, no drift. *(Refines scope §2.2, which mentioned both places.)*
2. **`grammar-intro` is tagged `level: A2`** but lives in the A1 unit *Your First Sentences* — it teaches A1 gender agreement **and** A2 present-tense prefixes, as a reading-focused first pass. The Learn view will show an "A2" tag on that one lesson. The fuller treatment is the planned `a2-u1`.
3. **`unvowelled-reading` is tagged `level: A2`** in the A1 unit *Reading Beyond Full Vowels* — unvowelled reading is an A2 competency per the descriptor map; the lesson is a first exposure using the A1 sentences.
4. **The A0 practice activities** (`reading-foundations`, `listening-foundations`, `pronunciation-foundations`, `syllables-intro`, `stroke-order-writing`, `alphabet-writing-1`) now have a home in the tree. They stay reachable from the Practice view unchanged.
5. **`l1` / `l2` / `l5`** keep their ids (no migration needed) and their `view:` targets — they open the Alphabet / Vocabulary views, and completion stays a manual "Mark complete".
6. **The 2 generated proof lessons** are *Colours* and *Useful Questions* (both `source: generate`, `status: available`). *He/She/They* and *Describing Things* are wired (`generate` + objectives) but `status: planned` pending M20 polish.
7. **`deriveLevel` bridge capped at A1** (see §5) — completing lessons never asserts A2+. Confirm this is the right honesty line.

---

## Sign-off

Approve, and implementation resumes at rollout step 4: `--write-app` → `generateLessonSteps` v1 → the 2 generated proof lessons → rebuild `renderLearn` (ladder + "start where you fit") → swap the `deriveLevel` bridge → `loadProgress` migration → QA → draft PR.
