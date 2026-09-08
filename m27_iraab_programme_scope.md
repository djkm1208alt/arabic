# M27 — The Iʿrāb Programme (umbrella scope)

**Status:** Draft for review. **Held — blocked on prerequisites (§4).** No branch, no
implementation, no content-file changes. This doc plans a multi-batch arc; it is not itself a
batch.

**Parent:** [ROADMAP.md](ROADMAP.md) — "Parallel tracks → Advanced / literary Arabic" and the
M21 continuous content operation ("A2 → B1 → B2 → C1 → C2, level by level").

**Builds directly on:** [`reference/iraab-audit.md`](reference/iraab-audit.md) (read-only audit,
2026-09-08) — the source analysis, cross-map, dependency chain, and defer-list. That audit is the
evidence base; this doc is the plan it called for in its §8.

**Source material:** `~/Downloads/iraablessons1.pdf` + `~/Downloads/iraablessons2.pdf` — one
continuous 48-lesson applied-parsing manual ("دروس في الإعراب" genre), printed pp. 7–159,
lessons 1–48. Independently re-catalogued page-by-page 2026-09-08; the audit's lesson table is
accurate and complete. The PDFs are **reference only** and stay out of the repo per CLAUDE.md.

---

## 1. Why this is an umbrella, not a milestone

Standing rule 7 (milestone vs. layer vs. operation): don't scope one as another.

- **Authoring iʿrāb lessons is an _operation_** — it belongs to M21's continuous content work,
  level by level, one small batch per unit, each with its own light `m21bN`-style doc. It has no
  single end state.
- **One piece is a genuine bounded _milestone_:** the engine cannot currently express a parse.
  A `parse` / `label` exercise type plus the naḥw-metalanguage glossary objects is real engine
  work with a definite deliverable — that is **M27.0** below, and it gates everything else.

So M27 is a container: **M27.0** (engine, a milestone —
[m27.0_parse-engine_scope.md](m27.0_parse-engine_scope.md), drafted, held) + **M27.b1…M27.c2**
(content batches, M21 operation work). Each sub-item gets its own scope doc and its own approval.
Nothing here is approved by approving this.

## 2. The book's real level, restated

From the audit's executive verdict — this is a **B2→C2 resource**. It presupposes the whole
grammatical system and drills the act of parsing it. Rough split of its 48 lessons:

| Share | Content | Destination |
|---|---|---|
| ~15% | mubtadaʾ/khabar, fāʿil, mafʿūl bih, muḍāf ilayhi, kāna, the verbal sentence | **already taught functionally** at A1–A2; iʿrāb adds only the _naming + parsing_ layer, at B1 |
| ~35% | إنّ family, relative-clause maḥall, maṣdar, participle government, nāʾib al-fāʿil, the five objects, ḥāl, tamyīz, jussive/subjunctive, لا النافية للجنس, the tawābiʿ | **natural B1–B2** — already mapped in `CURRICULUM_ARCHITECTURE.md §10.2` and the `b1-u*`/`b2-u*` stubs |
| ~50% | الأساليب (تعجب/إغراء/تحذير/ندبة/استغاثة/ترخيم/اختصاص), تنازع, أسماء الأفعال, الكنايات كيت/ذيت, لاتَ, المحكي, ضمير الشأن/الفصل, contested "أو نقول" parses | **C1–C2, or never imported** |

## 3. Destination map — all 48 book lessons

Key: **NAME@B1** = concept already taught functionally; B1 adds the metalanguage + role-labelling ·
**B2** / **C1** / **C2** = full analytical treatment at that level · **NI** = not imported (register,
sourcing, or pedagogical fit fails) · a book example is **never** copied — see §5.

### Book 1 (lessons 1–19)

| # | Lesson | Destination |
|---|---|---|
| 1 | إعراب اسم العلم | proper-noun basics **NAME@B1**; ممنوع من الصرف (علمية+عجمة/تركيب), حركة الحكاية, المركب المزجي **NI / C2 curiosity** |
| 2 | المقصور / المنقوص / المضاف لياء المتكلم (التقدير) | **C1** (`c1-u1`) |
| 3 | اسم الفعل (هيهات، صه، رويدَ…) | **C1–C2** |
| 4 | اسم الإشارة | usage **AT** (`gr:demonstratives`); "مبني في محل…" **B2** |
| 5 | اسم الموصول + جملة الصلة | relative clauses **B1** (`b1-u2`); "صلة لا محل لها" **B1** |
| 6 | اسم الاستفهام | **B2** (maḥall of built interrogatives) |
| 7 | اسم الفاعل عمل الفعل | participle government **B2** (needs participles, `b1-u3`) |
| 8 | اسم التفضيل | comparative أَفْعَل **A2 (planned)**; its _government_ **C1** |
| 9 | الأفعال الخمسة | **B2** (`b2-u1`) — as علامة فرعية |
| 10 | الفعل الماضي (مبني…) | معرب/مبني + bināʾ of the past **B2** (`b2-u1`) |
| 11 | فعل الأمر | **B2** (`b2-u1`) |
| 12 | الفعل المضارع (رفع/نصب/جزم، نواصب، جوازم، نون التوكيد) | subjunctive **B1** (`b1-u2`); jussive + نواصب/جوازم **B2** (`b2-u2`) |
| 13 | الفاعل | **NAME@B1**; جرّ الفاعل بمن الزائدة **B2** |
| 14 | نائب الفاعل + الفعل المجهول | **B2** (`b2-u2`, internal passive) |
| 15 | المفاعيل الخمسة (به/مطلق/له/فيه/معه) | **B2** (`b2-u1`); أفعال القلوب, معاذ الله/سبحان الله **C1** |
| 16 | كان وأخواتها | كان **NAME@B1**; the full أخوات + تامة/ناقصة **B2** (`b2-u1`) |
| 17 | كاد وأخواتها | **C1** (not in `§10.2` — verbs of approximation/hope/inception) |
| 18 | إنّ وأخواتها | **B1** (`b1-u2` — "accusative on the noun") |
| 19 | الأحرف المشبهة بليس (ما/لا/لاتَ/إنْ) | ما/لا **B2**; لاتَ, إنْ النافية, باء زائدة edge cases **NI** |

### Book 2 (lessons 20–48)

| # | Lesson | Destination |
|---|---|---|
| 20 | الأحرف المشبهة بالفعل (re-consolidation; كأنّ, أنْ المخفّفة, ضمير الشأن) | folds into **B1** إنّ point; ضمير الشأن **C1** |
| 21 | لا النافية للجنس | **B2** (expanded negation begins B1; full iʿrāb B2) |
| 22 | حروف الجر (+ المتعلَّق, الزائدة, الشبيهة بالزائد, رُبّ, حتى الجارّة) | core prepositions **AT** (`gr:core-prepositions`); المتعلَّق + شبه الجملة **B2**; رُبّ / زائدة **C1** |
| 23 | المثنى + الملحق (كلا/كلتا, القمران) | forms **AT** (`gr:noun-number`); ا/ي as علامة فرعية **B2** (`b2-u1`); كلا/كلتا **C1** |
| 24 | جمع المذكر السالم + الملحق (أولو, العقود, بنون/سنون) | forms **AT**; و/ي as علامة فرعية **B2** (`b2-u1`) |
| 25 | جمع المؤنث السالم + الملحق (كسرة نيابة عن الفتحة, أولات) | forms **AT**; ـِ for naṣb as علامة فرعية **B2** (`b2-u1`) |
| 26 | المضاف إليه | **NAME@B1** (closest existing point, `gr:idafa`, is already thorough) |
| 27 | إعراب الجملة (الجمل ذات المحل / بلا محل) | **C1** (`c1-u1`) — presupposes full subordination |
| 28 | العدد (أحد عشر مبني, 3–10, tamyīz) | counted-noun rules **AT/PP** (`gr:counted-noun-intro`, `gr:numbers-11-99`); "نعت/مصدر" parse of the number **B2** |
| 29 | أدوات الشرط (جازمة / غير جازمة, جواب الشرط, الفاء, إذا الفجائية) | إذا-conditionals **B1**; jussive جوازم + جواب الشرط الجازم **B2** (`b2-u2`) |
| 30 | الضمير (بارز/مستتر, واجب/جائز, الشأن, الفصل) | attached/object pronouns **AT/PP**; مستتر واجب/جائز **B2**; الشأن/الفصل **C1** |
| 31 | الظرف (المفعول فيه) | **B2** (`b2-u1`) — ظرفية, نائب الظرف, إضافة الظرف للجملة |
| 32 | الكنايات (كم, كأيّن, كذا, كيت, ذيت) | كم الاستفهامية **C1**; كأيّن/الخبرية **C1**; كيت/ذيت **NI** |
| 33 | المبتدأ والخبر (الخبر على ستة أوجه) | **NAME@B1**; جرّه لفظًا / الخبر شبه جملة **B2** |
| 34 | التعجب (ما أفعله / أفعِل به) | **C1** (`c1-u2` area) — سماعي forms **NI** |
| 35 | البدل (مطابق / بعض من كل / اشتمال / تفصيل) | **B2** (`b2-u1`, tawābiʿ) |
| 36 | التوكيد (لفظي / معنوي: نفس، عين، كل، جميع، كلا) | **B2** (`b2-u1`, tawābiʿ) |
| 37 | العطف (النسق: و/ف/ثم/حتى/أو/أم/بل/لا/لكن; البيان; عطف على المحل) | النسق **B2** (`b2-u1`); عطف على المحل, عطف البيان **C1** |
| 38 | النعت (الحقيقي / السببي; القطع) | agreement **AT** (`gr:gender-agreement`); السببي **B2**; القطع **C1** |
| 39 | الترخيم | **C2** curiosity / **NI** |
| 40 | الندبة | **C2** curiosity / **NI** |
| 41 | الاستغاثة | **C2** curiosity / **NI** |
| 42 | المنادى وأنواعه | basic النداء **B1**; the full type set (شبيه بالمضاف, نكرة غير مقصودة, يا اللهمّ, إتباع شكلي) **C1** |
| 43 | المستثنى + الأدوات الثمانية | إلّا as "except/minus" **AT (A2, time only)**; استثناء grammar **C1** |
| 44 | الحال (مفردة / جملة / شبه جملة; واو الحال; الرابط) | **B2** (`b2-u1` — explicitly in `§10.2`) |
| 45 | التمييز (الذات / النسبة; منصوب / مجرور بمن) | **B2** (`b2-u1` — explicitly in `§10.2`) |
| 46 | التنازع | **C1–C2** (`c2-u1`) |
| 47 | الإغراء | **C1** (`c1-u2` area) / **NI** |
| 48 | التحذير (إياكَ والكسلَ) | **C1** (`c1-u2` area) / **NI** |

Nothing in this table becomes real content until §4 clears and the relevant batch doc is
approved.

## 4. The gate — prerequisites, in order

From the audit's §9. Iʿrāb work **does not start** until:

1. **A2 closes.** `a2-u6` still in development (ROADMAP). Standing rule: each level coherent and
   QA'd before the next starts.
2. **B1 exists.** Zero B1 lesson nodes today. The B1 grammar layer iʿrāb presupposes — derived
   forms II–X, relative clauses, إنّ family, maṣdar, participles, subjunctive — must be built
   against the `b1-u1`/`b1-u2`/`b1-u3` stubs first.
3. **M27.0 ships** (engine): the `parse` / `label` exercise type + the naḥw glossary. Without it
   an "iʿrāb lesson" is passive reading, which defeats the purpose.

Only then does M27.b1 (the first content batch) open.

## 5. Non-negotiable authoring rules

- **No book example is ever copied** — not a sentence, not a Qurʾānic āyah, not a line of poetry,
  not a proper noun (سيبويه، أرسطو، نيويورك…), not a high-register verb. Standing rule 1 + CLAUDE.md
  `reference/` policy. The book supplies the _shape of a parse_; every example sentence is
  re-authored from the project's own leveled lexicon, exactly as every M20/M21 batch has done.
- **No vocabulary added to carry iʿrāb** — no أسماء الأفعال, no رُبّ / لدن / مذ, and the naḥh
  metalanguage itself (معرب، مبني، علامة أصلية/فرعية، محل، متعلَّق، تابع، مبدل منه…) enters only as
  M27.0's dedicated glossary objects, never as `lexemes.json` entries.
- **Recognition before production.** B1 iʿrāb is _label the role / name the case_ on
  already-vowelled text — not "produce a full نموذج إعراب". Full worked parses begin at B2
  (`b2-u1`), matching `§10.2`.
- **Levels/descriptors are already correct.** `levels.json`, `descriptors.json`, `skills.json`
  (grammar's blurb already names "case (iʿrāb)") need no change. Do not touch the deferral note
  inside `gr:counted-noun-intro` or the A2 "case in fixed phrases" framing in `descriptors.json`.

## 6. M27.0 — the engine milestone

Full detail in [m27.0_parse-engine_scope.md](m27.0_parse-engine_scope.md) (drafted, held). The
bounded deliverable that unblocks the rest. Parallels how M18 added `build` / `order`.

- **`parse` / `label` exercise type** — a new `exerciseTypes` entry: the learner tags a
  highlighted token with its grammatical role and/or case and/or `علامة`. Driven by a new optional
  `iʿrāb` annotation array on `texts.json` entries — indicative shape
  `{ token, role, case, marker, mahall? }`. Revives the long-deferred `transform` type in the same
  pass if cheap. Buildless-runtime rule holds: it compiles through `build-content.js` like every
  other type.
- **Naḥw metalanguage glossary** — a small set of `grammar`- or a new `term`-kind objects for the
  terms in the audit's §4, each with an `ar` name, an English gloss, a `level`, and `prereqs`, so
  lessons can link to a definition instead of re-explaining. ~20–30 entries, authored once.
- **QA:** new fixtures for the annotation schema and the exercise type; `qa-harness.js` walks a
  fixture lesson using the new type to completion; `a11y-audit.js` clean (the tag UI is a new
  interactive surface — keyboard + ARIA from day one, per standing rule 3).

M27.0 **does not** author any real iʿrāb lesson — it ships the capability plus fixtures only.

## 7. Content batches (M21 operation work — indicative, each its own `m21bN`-style doc)

| Batch | Unit | Adds | New grammar points (indicative) |
|---|---|---|---|
| M27.b1 | `b1-u2` | معرب vs مبني; the 3 cases + default (أصلية) endings; **role-labelling** (mubtadaʾ/khabar/fāʿil/mafʿūl bih/muḍāf ilayhi) on existing vowelled `texts.json` | `gr:mabni-muʿrab`, `gr:cases-recognition` |
| M27.b2 | `b1-u2` | إنّ وأخواتها parsed — accusative on the noun, nominative on the khabar | folds into the existing `b1-u2` إنّ point |
| M27.b3 | `b1-u2` | الاسم الموصول + جملة الصلة "لا محل لها" | `gr:relative-clause` |
| M27.b4 | `b2-u1` **(stub exists — "The Full Case System (Iʿrāb)")** | full active case system; علامات فرعية (dual ا/ي, sound m.pl. و/ي, الأسماء الخمسة, sound f.pl. ـِ in naṣb, الأفعال الخمسة النون); ممنوع من الصرف; first worked نموذج إعراب of a nominal + a verbal sentence | `gr:iʿrab-nominal`, `gr:iʿrab-verbal`, `gr:five-nouns`, `gr:diptote` |
| M27.b5 | `b2-u1` | نائب الفاعل + internal passive; المفاعيل (فيه/به/له/مطلق/معه) | `gr:passive`, `gr:objects` |
| M27.b6 | `b2-u2` **(stub exists)** | المضارع المرفوع/المنصوب/المجزوم; نواصب & جوازم; جواب الشرط الجازم | `gr:mudari-mood` |
| M27.b7 | `b2-u1` | الحال; التمييز; لا النافية للجنس | `gr:hal`, `gr:tamyiz`, `gr:la-nafiya-jins` |
| M27.b8 | `b2-u1` | التوابع parsed: نعت (حقيقي/سببي), عطف النسق, توكيد (لفظي/معنوي), بدل (اشتمال/مطابق/بعض من كل) | `gr:tawabiʿ` |
| M27.c1 | `c1-u1` **(stub exists — "Rhetorical Syntax & Style")** | الجمل ذات المحل / بلا محل; شبه الجملة والمتعلَّق; التقدير (مقصور/منقوص/مضاف لياء المتكلم); المنادى (full); المستثنى + الأدوات الثمانية; أساليب التعجب/الإغراء/التحذير | `gr:jumla-mahall`, `gr:taqdir`, `gr:nida`, `gr:istithnaʾ` |
| M27.c2 | `c2-u1` **(stub exists — "Advanced Iʿrāb & Contested Parses")** | contested parses ("أو نقول…"), قطع النعت, عطف على المحل, التنازع, اسم الفعل, الكنايات, ضمير الشأن/الفصل, المحكي, الترخيم/الندبة/الاستغاثة — recognition-only, tied to real cited classical text | recognition-only |

Order is the dependency order: b1 → b2 → c1 → c2, and within B2 the `b2-u1` case-system batch
(M27.b4) before anything that parses on top of it.

## 8. What must NOT be touched while this doc is held

`content/grammar.json` · `content/curriculum.json` (spine, order, blurbs, statuses, new B1/B2/C1/C2
lesson nodes) · `content/descriptors.json` · `content/skills.json` · `content/levels.json` ·
`content/lexemes.json` · `content/wordlists/*.json` · `content/texts.json` (no `iʿrāb` annotation
field yet — waits on M27.0) · the `exerciseTypes` registry in `index.html` · the `gr:counted-noun-intro`
deferral note · any copying of the PDFs' sentences, āyāt, poetry, or proper nouns into any repo file.

## 9. Acceptance criteria (for the programme, not this doc)

- Every batch above ships through the Master Standards workflow (own scope doc → branch → draft PR
  → live-browser QA trace → merge on explicit approval).
- Every iʿrāb example sentence traces to the project's own leveled lexicon; a reviewer can confirm
  zero strings originate from the PDFs.
- `build-content.js --check` / `--lint`, `build-audio-manifest.js --check`, `tools/qa-harness.js`,
  `tools/a11y-audit.js` all clean after each batch.
- The B1 batches never require a full نموذج إعراب; the B2 `b2-u1` batch is where worked parses
  first appear.

## 10. Open questions

1. **Numbering.** Filed as **M27** (a container past the committed M-sequence). Alternative: make
   the engine piece a `.5` insert (e.g. **M23.5**, next to the other infrastructure `.5` batches)
   and run the content purely as `m21bN` batches with no M27 umbrella at all. Recommend **keep the
   M27 umbrella** — the arc spans four CEFR levels and is worth one place to see it whole — but the
   number is yours to set.
2. **`parse` type vs. reusing `match`.** A role-labelling drill _could_ be encoded as a `match`
   (token → role). Recommend a dedicated `parse` type anyway — it needs the `iʿrāb` annotation
   schema on `texts.json` regardless, case/marker are more than a 2-column match, and M18's
   precedent is to add the type rather than overload one.
3. **Glossary object kind.** New `term` kind, or reuse `grammar` with a `metalanguage: true` flag?
   Recommend a small new `term` kind — these are definitions of analysis vocabulary, not grammar
   rules with examples/commonErrors, and mixing them into `grammar.json` muddies that file's shape.
4. **C2 curiosities (الترخيم/الندبة/الاستغاثة, كيت/ذيت, لاتَ).** Include as recognition-only trivia
   tied to a real classical passage, or omit entirely? Recommend **omit until `c2-u2` (classical
   texts) exists** and a genuine cited passage naturally contains one — never as invented drill.
5. **`gr:present-tense` / `gr:demonstratives` etc.** — when B1 adds the parsing layer, extend the
   existing A1/A2 point's `examples` additively (the M12/M21b1 precedent), or make a new `gr:` point
   that links back? Recommend **new point that links back** for anything that adds metalanguage —
   keeps the A1/A2 point readable at its own level.

---

**STOP.** Draft umbrella scope, held on §4. Nothing here is approved by approving adjacent work;
each of M27.0 and M27.bN needs its own scope doc and its own sign-off.
