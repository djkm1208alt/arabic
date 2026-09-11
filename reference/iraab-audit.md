# READ-ONLY iʿRĀB CURRICULUM MAPPING AUDIT

**Status:** read-only analysis. No branch, commit, PR, or content change was made.
**Date:** 2026-09-08
**Source audited:** a two-volume applied-iʿrāb drill manual (48 lessons, "دروس في الإعراب"
genre), held locally in `reference/`. **The book's own content — its lesson list, page
references, and example sentences / vocabulary — has been stripped from this file.** Only the
curriculum-mapping analysis remains.
**Cross-checked against:** `content/grammar.json`, `content/curriculum.json`,
`content/descriptors.json`, `content/skills.json`, `content/levels.json`, `content/marks.json`,
all `content/lessons/*`, `CURRICULUM_ARCHITECTURE.md §10`, `ROADMAP.md`.

This file lives in `reference/` and is **gitignored / local-only** — it is not part of the app
and is not a milestone scope doc. It exists to inform a future, properly-scoped iʿrāb milestone.

---

## 1. Executive Verdict

**BOOK SOURCE.** The source is one continuous 48-lesson *applied iʿrāb drill manual*. Every
lesson has the same two-part shape — a compressed definition of one grammatical category, then a
series of fully worked parses of example sentences. It is organised as a **traditional naḥw
reference table of contents** (definite / built nouns → verbs → المرفوعات → المنصوبات →
المجرورات → التوابع → الأساليب), **not** as a teaching progression ordered by difficulty.

**CURRENT PROJECT STATE.** The curriculum teaches grammar **functionally without metalanguage**
through A1–A2. Case is explicitly handled as *recognition only* ("the three short-vowel case
endings in fixed high-frequency phrases," `descriptors` A2). There is **no** مرفوع/منصوب/مجرور
terminology, no "علامة رفعه/نصبه," no معرب/مبني distinction, no "محل من الإعراب," no تقدير,
and **no parsing/analysis exercise type** in the engine (`exerciseTypes` registry has
`choice`/`match`/`cloze`/`build`/`order`; `transform` and any `parse` type are deferred).
B1 and beyond are **empty unit stubs** — zero B1/B2 lesson nodes exist.

**PEDAGOGICAL INFERENCE.** This book is a **B2→C2 resource**, not a B1 one. It *presupposes* the
entire grammatical system already known and drills the act of parsing it. Roughly:

| Book coverage | Maps to project level |
|---|---|
| ~15% (mubtadaʾ/khabar, fāʿil, mafʿūl bih, muḍāf ilayhi, kāna, the verbal sentence) | Already taught **functionally** at A1–A2; not yet *named or parsed* |
| ~35% (إنّ family, relative-clause محل, maṣdar, participle government, nāʾib al-fāʿil, the five objects, ḥāl, tamyīz, jussive/subjunctive, لا النافية للجنس, the tawābiʿ) | **Natural B1–B2 next steps** — already mapped in `CURRICULUM_ARCHITECTURE.md §10` and the b1-*/b2-* unit blurbs |
| ~50% (أساليب: تعجب/إغراء/تحذير/ندبة/استغاثة/ترخيم/اختصاص, تنازع, أسماء الأفعال, الكنايات, لات, المحكي, ضمير الشأن/الفصل, contested "أو نقول" parses) | **C1–C2 / defer / not suitable for direct import** |

**Are we ready to implement iʿrāb? No.** Not this year, and never by importing from this book
directly. The prerequisites (see §5, §9) are substantially unbuilt, and the book's examples are
almost entirely above A2. Its correct role is as a **source of drill patterns** to be mined
*after* B1 exists and a parsing exercise type is designed — with original, level-controlled
examples, never copied text.

---

## 2. Book coverage shape (detail removed)

The book proceeds in **traditional naḥw reference order**, not a difficulty ramp: the معارف and
built nouns, then the verb (past / imperative / present with its موانع and نواصب/جوازم), then the
core rafʿ/naṣb roles, then the نواسخ (كان / كاد / إنّ families and their sisters), then the
مجرورات and the sound plurals as iʿrāb markers, then clause-level iʿrāb (الجمل التي لها/لا محل
لها), then numbers, conditionals, pronouns and adverbs, then the أساليب and the التوابع, ending
with تنازع / إغراء / تحذير.

The per-lesson breakdown, lesson titles, and page references have been removed from this file.

---

## 3. Curriculum Cross-Map

Key: **[AT]** already taught · **[PP]** partially present (functional, not analytical) ·
**[NS]** natural next step · **[DEF]** defer · **[ADV]** advanced ·
**[NI]** not suitable for direct import.

| Book concept | Project status | Class |
|---|---|---|
| Nominal sentence: mubtadaʾ + khabar | `gr:nominal-sentence` (A1) — taught by name (mubtadaʾ/khabar); no case parse | **PP** |
| فاعل / مفعول به, VSO | `gr:verbal-sentence` (A2) — "فِعْل–فَاعِل–مَفْعُول" named; no علامة إعراب | **PP** |
| المضاف إليه (genitive, drops ال/tanwīn) | `gr:idafa` (A2) — thorough, incl. "always genitive" | **PP** (closest to full) |
| كان وأخواتها (اسم مرفوع / خبر منصوب) | `gr:kana` (A2) — كان only; "خبر becomes accusative"; hollow-root note | **PP** / **NS** for the أخوات |
| The 3 cases exist; ٌ ً ٍ / ُ َ ِ | `marks.json` + `descriptors` A1 "recognition," A2 "fixed phrases" | **PP** |
| Sun/moon, definiteness, ال vs tanwīn | `gr:sun-moon`, `gr:definiteness` (A1) | **AT** |
| Demonstratives اسم الإشارة | `gr:demonstratives` (A1) — usage only, not "مبني في محل رفع" | **PP** |
| Attached pronouns (as مضاف إليه / مفعول) | `gr:attached-possessive` (A1); object pronouns (A2) | **PP** |
| حروف الجر + noun in genitive | `gr:core-prepositions` (A1) — "noun after a preposition is genitive" | **PP** |
| Negation ليس/لا/ما (+ خبر منصوب) | `gr:negation-a1` (A1) — "comment takes ـً after ليس" | **PP** |
| المثنى / جمع مذكر سالم / جمع مؤنث سالم (morphology) | `gr:noun-number` (A1) — forms taught; **not** as علامات فرعية للإعراب | **PP** form / **NS** iʿrāb role |
| العدد + تمييز | `gr:counted-noun-intro` (A1), `gr:numbers-11-99` (A2) — "singular accusative (تمييز)" named | **PP** |
| العدد الترتيبي | `gr:telling-time`, `gr:dates` (A2) — ordinals taught for time/dates | **PP** |
| اسم الفاعل / اسم المفعول (participles) | Not taught; architecture → **B1** | **NS (B1)** |
| المصدر (verbal noun) | Not taught; architecture → **B1** | **NS (B1)** |
| إنّ وأخواتها (full iʿrāb) | b1-u2 blurb names it; no lesson node | **NS (B1)** |
| اسم الموصول + جملة الصلة (محل) | b1-u2 blurb; no lesson | **NS (B1)** |
| المضارع المرفوع/المنصوب/المجزوم; نواصب & جوازم | Architecture → B1 (subjunctive) / **B2** (jussive) | **NS (B1–B2)** |
| نائب الفاعل + الفعل المجهول | Architecture → **B2** (internal passive) | **NS (B2)** |
| المفاعيل الخمسة (فيه/به/له/مطلق/معه) | Architecture: حال/تمييز at B2; the five objects implied | **NS (B2)** |
| الحال / التمييز (as constructions) | Architecture → **B2** explicitly | **NS (B2)** |
| لا النافية للجنس | Architecture: expanded negation B1; full iʿrāb → **B2** | **NS (B2)** |
| كاد وأخواتها | Not listed anywhere in the architecture | **DEF (B2/C1)** |
| أدوات الشرط الجازمة + جواب الشرط | Architecture → **B2** (jussive after conditional particles); إذا-conditionals B1 | **NS (B2)** |
| التوابع: النعت / العطف / التوكيد / البدل (parsed iʿrāb) | Adjective agreement taught (A1); rest not, and not as tawābiʿ iʿrāb | **NS (B2)** |
| الجمل التي لها محل / لا محل لها من الإعراب | Nothing; presupposes subordination | **DEF (B2–C1)** |
| المعرب والمبني; علامات أصلية/فرعية; الأسماء الخمسة; ممنوع من الصرف | **Entirely absent** — the biggest structural gap | **NS (B2)** — prerequisite for all analytical iʿrāb |
| التقدير (ضمة/فتحة/كسرة مقدّرة); المقصور/المنقوص/مضاف لياء المتكلم | Absent | **DEF (B2–C1)** |
| المنادى وأنواعه (full) | Vocative not taught at all | **DEF (B1 basic / C1 full)** |
| المستثنى + الأدوات الثمانية | إلّا taught as "except/minus" for time (A2); no استثناء grammar | **DEF (B2–C1)** |
| اسم التفضيل (as عامل) | Architecture: comparative أَفْعَل at A2 (not yet built); its *government* is advanced | **DEF (C1)** |
| اسم الفعل | Absent | **ADV (C1–C2)** |
| المحكي / حركة الحكاية | Absent | **NI** |
| المركب المزجي | Absent | **NI** |
| الكنايات (كم الاستفهامية/الخبرية, كأيّن) | كم not taught | **ADV (C1)** |
| ضمير الشأن / ضمير الفصل | Absent | **ADV (C1)** |
| التنازع | Absent | **ADV (C1–C2)** |
| أساليب: التعجب / الإغراء / التحذير / الاختصاص | Absent | **ADV (C1)** |
| الترخيم / الندبة / الاستغاثة | Absent | **NI** (C2 curiosity) |
| لاتَ / إنْ النافية / باء زائدة edge cases | Absent | **NI** |
| Multiple valid parses ("أو نقول… / الإعراب الأول أشهر") | Not applicable below C1 | **NI** |
| Qur'anic āyāt, poetry, proverbs, philosopher names as examples | Violates "Never invent Arabic / real checked sources"; register far above A2–B1 | **NI** |

---

## 4. Vocabulary Dependencies

**BOOK SOURCE.** The book's worked examples are built from vocabulary and proper nouns almost
entirely **outside the current 317-lexeme A1 set + A2 additions** — proper nouns and place names,
higher-register nouns and verbs, asmāʾ al-afʿāl and rare particles, and Qur'anic / poetic
citations. A learner at the project's current ceiling (mid-A2) could not read most example
sentences. The specific word and name lists have been removed from this file; **none of them are
to be added to the lexicon.**

Separately, the **grammatical metalanguage itself** (معرب, مبني, علامة أصلية/فرعية, مقدَّرة,
محل, متعلِّق, تابع, صاحب الحال, الرابط, كافّة, شبيه بالمضاف …) is a vocabulary dependency in its
own right. None of it exists as teachable objects; it must be authored as its own micro-glossary
before any iʿrāb lesson. (This is what `content/metalang.json` + the `term:` kind in
`m27.0_parse-engine_scope.md` are for.)

**PEDAGOGICAL INFERENCE.** When iʿrāb lessons are eventually authored, examples must be
**re-authored from the project's own leveled lexicon** (the same rule every M20/M21 batch has
followed). The book supplies the *pattern* of a parse, not the *sentence*.

---

## 5. iʿrāb Dependency Chain

**PEDAGOGICAL INFERENCE** (grounded in the book's implicit assumptions + `CURRICULUM_ARCHITECTURE.md §10`).
Read bottom-up; each layer needs the one below.

```
0. Fluent reading of fully-vowelled MSA + the 6 short-vowel/tanwīn marks   → A1/A2  DONE (marks.json, A1 recognition)
1. Parts of speech: اسم / فعل / حرف as an explicit 3-way sort              → not taught explicitly (implicit only)  MISSING
2. Sentence typology: nominal vs verbal, "every sentence has a frame"      → A2  DONE (gr:nominal-sentence, gr:verbal-sentence)
3. The core functional roles BY NAME:
      مبتدأ · خبر · فاعل · مفعول به · مضاف إليه · اسم/خبر كان               → partial (named in prose, never parsed)  PARTIAL
4. المعرب vs المبني — which words even take case, which are frozen          → NOT taught  MISSING  <-- critical keystone
5. The 3 cases + their DEFAULT (أصلية) endings, and "علامة رفعه/نصبه/جره"
   as something you state                                                  → NOT taught (recognition only)  MISSING
6. علامات فرعية: الواو/الياء (sound m. pl., five nouns), الألف/الياء (dual),
   ثبوت/حذف النون (five verbs), الفتحة نيابةً عن الكسرة (ممنوع من الصرف, f. pl.) → morphology taught, iʿrāb role NOT  MISSING
7. شبه الجملة (جار+مجرور, ظرف) as a unit that "يتعلق بـ…"                    → prepositions taught, "متعلَّق" concept NOT  MISSING
8. محل من الإعراب — subordinate clauses occupy a case slot                  → needs relative clauses + subordination (B1)  MISSING
9. التقدير — ضمة/فتحة/كسرة مقدَّرة on مقصور/منقوص/مضاف لياء المتكلم           → NOT taught; needs 4–8 first  MISSING
10. Multi-parse reasoning ("أو نقول…", قطع, إتباع, عطف على المحل)           → C1+  MISSING
```

The project has layers 0, 2, and half of 3. **Layers 1, 4, 5, 6 are the gate** — layer 4
(معرب/مبني) especially, because every worked parse in the book opens by implicitly deciding it.

---

## 6. Recommended First iʿrāb Entry Point

**PEDAGOGICAL INFERENCE.**

- **Not now.** A2 is not closed (`a2-u6` in development) and B1 has zero lesson nodes. Introducing
  parsing metalanguage while learners are still consolidating VSO order and iḍāfa would overload the
  level — and `gr:counted-noun-intro` *already made a promise* to defer reversed-agreement reasoning
  "to a later, dedicated unit," which is the model to follow.

- **Soft entry: late B1**, as a *recognition-and-labelling* skill, not full parsing. Concretely: a
  B1 grammar point that (a) names the معرب/مبني split, (b) names the 3 cases with their default
  endings, (c) has learners **tag the role** (mubtadaʾ / khabar / fāʿil / mafʿūl bih / muḍāf ilayhi)
  of highlighted words in **fully-vowelled sentences already in `texts.json`**. This fits inside the
  existing `b1-u2` blurb ("joining ideas into paragraphs") or a dedicated adjacent point, and it
  pays off the recognition work started at A1–A2. It requires a new exercise type (see §8).

- **Full analytical iʿrāb: B2**, at `b2-u1` ("Nominative, accusative, and genitive used actively
  across nominal and verbal sentences") — this unit stub *already exists and is already correctly
  placed*. That is where علامات فرعية, الأسماء الخمسة, ممنوع من الصرف, and a worked نموذج إعراب
  belong. The `c2-u1` stub ("Advanced Iʿrāb & Contested Parses") already exists for the book's
  hardest 50%.

- **The book is a B2→C2 teacher's source**, consulted when authoring `b2-u1` onward — never a B1
  primer and never the syllabus itself.

---

## 7. Concepts to Defer

**Defer to B1** (already mapped there): إنّ وأخواتها, relative clauses + جملة الصلة, المصدر,
active/passive participles, subjunctive after أن/لن/كي/حتى, conditionals with إذا.

**Defer to B2** (already mapped, or the natural home): the full active case system with علامات فرعية;
معرب/مبني; الأسماء الخمسة; ممنوع من الصرف; نائب الفاعل + internal passive; jussive + نواصب/جوازم
المضارع + جواب الشرط; لا النافية للجنس; الحال; التمييز; the five objects
(مفعول فيه/به/له/مطلق/معه); the tawābiʿ as parsed iʿrāb (نعت/عطف/توكيد/بدل).

**Defer to C1** (or the existing `c1-u1`): الجمل التي لها/لا محل لها من الإعراب; شبه الجملة والمتعلَّق;
التقدير (مقصور/منقوص/مضاف لياء المتكلم); المنادى وأنواعه (full); المستثنى + الأدوات الثمانية; اسم الفاعل/
التفضيل as عامل; ضمير الشأن/الفصل; الكنايات (كم الخبرية, كأيّن); أساليب التعجب/الإغراء/التحذير/الاختصاص;
التنازع; اسم الفعل.

**Defer to C2 / treat as curiosities** (`c2-u1`, `c2-u2`): الترخيم, الندبة, الاستغاثة;
المحكي وحركة الحكاية; المركب المزجي; لاتَ / إنْ النافية / باء زائدة edge cases; كيت وذيت;
multi-parse / قطع / عطف على المحل / إتباع شكلي reasoning; syntactic ambiguity.

---

## 8. Proposed Future Batches (planning only — NO implementation)

Each is a **candidate scope doc**, needing its own `mXX_*_scope.md` and approval per the Master
Standards workflow. Numbering is illustrative, not committed.

**Engine prerequisite (its own milestone, before any of the below):**

- **`parse` / `label` exercise type** — a new entry in the `exerciseTypes` registry: tag a
  highlighted token with its grammatical role and/or case, generated from a new `iʿrāb` annotation
  array on `texts.json` entries (`{token, role, case, marker}`). Parallels how M18 added
  `build`/`order`. Also revives the deferred `transform` type. Biggest blocker; scope independently.
  *(Now drafted as `m27.0_parse-engine_scope.md`.)*
- **Naḥw metalanguage micro-glossary** — a small set of `term:` reference objects for the terms
  in §4 (معرب/مبني, علامة أصلية/فرعية, محل, متعلَّق, تابع…), so lessons can link to definitions.
  *(Now drafted as `content/metalang.json`.)*

**Content batches (in dependency order):**

| Batch | Level / unit | Contents | New grammar points (indicative) |
|---|---|---|---|
| B1-iʿrāb-1 | `b1-u2` area | معرب vs مبني; the 3 cases + default endings; **role-labelling** (mubtadaʾ/khabar/fāʿil/mafʿūl bih/muḍāf ilayhi) on existing vowelled texts | `gr:cases-recognition`, `gr:mabni-muʿrab` |
| B1-iʿrāb-2 | `b1-u2` | إنّ وأخواتها — "accusative on the noun, nominative on the khabar," parsed | folds into the existing b1-u2 إنّ point |
| B1-iʿrāb-3 | `b1-u2` | الاسم الموصول + جملة الصلة "لا محل لها" | `gr:relative-clause` |
| B2-iʿrāb-1 | `b2-u1` (**stub exists**) | Full active case system; علامات فرعية (dual ا/ي, sound m.pl. و/ي, الأسماء الخمسة, sound f.pl. ـِ in نصب, الأفعال الخمسة النون); ممنوع من الصرف; first worked نموذج إعراب of a nominal + a verbal sentence | `gr:iʿrab-nominal`, `gr:iʿrab-verbal`, `gr:five-nouns`, `gr:diptote` |
| B2-iʿrāb-2 | `b2-u1` | نائب الفاعل + internal passive; المفاعيل (فيه/به/له/مطلق/معه) | `gr:passive`, `gr:objects` |
| B2-iʿrāb-3 | `b2-u2` (**stub exists**) | المضارع المرفوع/المنصوب/المجزوم; نواصب & جوازم; جواب الشرط الجازم | `gr:mudari-mood` |
| B2-iʿrāb-4 | `b2-u1`/`b2-u2` | الحال; التمييز; لا النافية للجنس | `gr:hal`, `gr:tamyiz`, `gr:la-nafiya-jins` |
| B2-iʿrāb-5 | `b2-u1` | التوابع parsed: نعت (حقيقي/سببي), عطف النسق, توكيد (لفظي/معنوي), بدل (اشتمال/مطابق/بعض من كل) | `gr:tawabiʿ` |
| C1-iʿrāb-1 | `c1-u1` (**stub exists**) | الجمل ذات المحل / بلا محل; شبه الجملة والمتعلَّق; التقدير (مقصور/منقوص/مضاف لياء المتكلم) | `gr:jumla-mahall`, `gr:taqdir` |
| C1-iʿrāb-2 | `c1-u1` | المنادى وأنواعه; المستثنى + الأدوات الثمانية; أساليب التعجب/الإغراء/التحذير | `gr:nida`, `gr:istithnaʾ` |
| C2-iʿrāb-1 | `c2-u1` (**stub exists**) | contested parses ("أو نقول…"), قطع النعت, عطف على المحل, التنازع, اسم الفعل, الكنايات, ضمير الشأن/الفصل, المحكي, الترخيم/الندبة/الاستغاثة | recognition-only, tied to real classical text |

---

## 9. Implementation Gate

**Are we ready to implement iʿrāb?**
**No.** The curriculum is mid-A2; B1 does not exist as content; the engine cannot express a parse;
and the source book operates two-to-four CEFR levels above the current ceiling.

**What prerequisites are missing?**

1. **A2 not closed** — `a2-u6` (shopping/directions/conversation) still "in development." A2 must
   finish first (standing rule: "Each level coherent and QA'd before the next starts").
2. **B1 is empty** — zero B1 lesson nodes. The whole B1 grammar layer (Forms II–X, relative clauses,
   إنّ family, maṣdar, participles, subjunctive) that iʿrāb presupposes is unbuilt. The architecture
   puts active iʿrāb at B2; B1 cannot be skipped to get there.
3. **No معرب/مبني teaching and no case metalanguage** — the analytical keystone (layer 4–6 of §5)
   is entirely absent. Case is recognition-only by explicit design.
4. **No parsing exercise type** — `exerciseTypes` has no `parse`/`label`/`transform`; there is no
   `iʿrāb` annotation schema on `texts.json`. Without this, an "iʿrāb lesson" can only be passive
   reading, which defeats the purpose. *(Being addressed by `m27.0_parse-engine_scope.md`.)*
5. **No naḥw-term glossary objects** — the Arabic metalanguage is itself an unmet vocabulary
   dependency (§4). *(Being addressed by `content/metalang.json`.)*
6. **Example base** — the book's sentences (proper nouns, Qur'an, poetry, philosophers,
   high-register verbs) cannot be imported; leveled examples must be authored fresh, a real
   content-authoring cost per batch.

**What should happen first (in order)?**

1. Finish A2 (`a2-u6`), per the roadmap.
2. Build B1 grammar against the existing `b1-u1`/`b1-u2`/`b1-u3` stubs — Forms II–X, relative
   clauses, إنّ وأخواتها, maṣdar, participles, subjunctive.
3. Introduce **case as recognition + role-labelling** at B1 (`gr:cases-recognition`,
   `gr:mabni-muʿrab`), reusing existing vowelled texts — the soft entry point from §6.
4. Scope the **`parse`/`label` exercise type + `iʿrāb` annotation schema** as its own milestone
   (parallels M18's exercise-type additions).
5. Only then write a dedicated **`b2-u1` iʿrāb scope doc**, using the book as the teacher's
   reference for *what a correct parse looks like* — with original, level-controlled examples.
6. Mine the book's أساليب / edge-case lessons only when authoring C1–C2 (`c1-u1`, `c2-u1`).

**What should Claude NOT touch yet?**

- `content/grammar.json` — no new grammar points, no edits to existing ones.
- `content/curriculum.json` — no changes to the unit spine, order, blurbs, or statuses; no new
  B1/B2/C1/C2 lesson nodes.
- `content/descriptors.json`, `content/skills.json`, `content/levels.json` — the level/descriptor
  map is settled and correct as-is for iʿrāb.
- `content/lexemes.json` / `wordlists/*.json` — **no vocabulary additions** (no proper nouns, rare
  particles, naḥw terms, or anything else from §4).
- `content/texts.json` — no new texts, no `iʿrāb` annotation field yet (waits on the exercise-type
  milestone).
- The `exerciseTypes` registry in `index.html` — no `parse`/`transform` type yet.
- The deferral note inside `gr:counted-noun-intro` and the A2 "case in fixed phrases" framing in
  `descriptors.json` — both deliberate and correct; leave them.
- No copying of the book's example sentences, Qur'anic verses, poetry, or proverbs into any project
  file, at any level.

---

**STOP.** This is the completed read-only audit. Awaiting review before any scope doc, batch, or
implementation work.
