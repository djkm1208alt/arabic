# M21 — Batch 7: Narrative & Everyday-Exchanges Vocabulary

**Status:** scope, held for approval. No implementation yet.
**Parent:** [ROADMAP.md](ROADMAP.md) M21 row · [m21_content_scaleout_scope.md](m21_content_scaleout_scope.md) §2.2, steps 2–3 ("A2 core/remaining vocabulary"). `content/wordlists/a2.json`'s own `_meta` note (batch 1) named these two topics as feeding `a2-u5` (Reading Short Paragraphs) and `a2-u6` (Everyday Exchanges) respectively — this batch closes both checklists so those two units' own future reading/listening batches have real vocabulary to build from, the same way `a2-u4`'s vocabulary was authored before its lessons landed.
**Base:** `main` @ `c5607d8` (batch 6 / PR #36 merged).
**Branch:** `claude/pensive-darwin-7mao26`, already restarted from `main`.

---

## 1. What this batch covers

A **pure vocabulary batch** — no lesson, no curriculum wiring, no new grammar point. It closes the `narrative` (10 entries) and `everyday-exchanges` (12 entries remaining, after batch 4 already took the 4 currency nouns) topics in `content/wordlists/a2.json`, the last two unclosed A2 checklist topics. `a2-u5` and `a2-u6` stay `planned` — they need actual reading paragraphs and dialogues, not just words, which is later batches' job per the milestone doc's own order.

## 2. Checked before planning

Grepped the full lexicon before assuming anything was missing (the exact discipline batch 3 learned the hard way):

- **"I would like..." is already covered.** `lex:ver-16` أَرَادَ (to want) already documents its present tense in its own `notes`: "Present tense: يُرِيد (yurīd)" — its first-person أُرِيدُ is exactly the standard MSA "I would like." No new lexeme needed.
- **"There is / there are" is already covered.** `lex:pla-17` هُنَاكَ (there) already carries the note "Also means 'there is / there are'." No new lexeme needed.
- **"To have"/"do you have" has a head start.** `lex:ver-17` عِنْدَ already exists (A1) with the exact possessive-suffix paradigm documented (عِنْدِي "I have", عِنْدَهُ "he has"). "Do you have...?" only needs the ready-made interrogative form added as its own phrase entry.
- Neither `شَيْء` (thing) nor `مُمْكِن` (possible) exist anywhere in the lexicon yet, despite being high-frequency — confirmed by direct grep, not assumed.
- `content/grammar.json`'s existing `gr:negation-a1` already states the rule "لَا negates the noun that follows it ('no…', 'there is no…')" — the same negation family the fixed phrase لَا بَأْسَ (no problem) belongs to. No new grammar point needed; this is a direct, if unremarked-on-until-now, application of a rule already taught.
- `content/wordlists/a2.json` needs no edits — every target item is already listed; this batch only fills it in.

## 3. What ships: 21 new lexemes, zero new grammar, zero new texts

**Two wordlist items need nothing new** (see §2): "I would like..." (`lex:ver-16`) and "there is/there are" (`lex:pla-17`).

**4 new particles** (`lex:prt-26`–`29`, topic `particles`, alongside the existing prepositions/conjunctions):

| id | Arabic | Gloss | Note |
|---|---|---|---|
| prt-26 | ثُمَّ | then / next | Coordinating conjunction, alongside existing وَ/أَوْ/لَكِنْ. |
| prt-27 | أَثْنَاءَ | during | Governs a genitive noun, same category as existing قَبْلَ ("before"). |
| prt-28 | بَيْنَمَا | while | Subordinating conjunction — cited as vocabulary only, same treatment already-existing لِأَنَّ ("because") got at A1; full clause-subordination analysis isn't attempted here. |
| prt-29 | كُلّ | every / each / all | Genuinely dual behaviour, flagged in its own `notes`: + indefinite singular noun = "every X" (كُلُّ يَوْمٍ); + definite noun/attached pronoun = "all of / the whole of X" (كُلُّ النَّاسِ, كُلُّهُ) — an iḍāfa first term either way, reusing `gr:idafa` rather than needing a new grammar point. |

**10 new expressions** (`lex:exp-13`–`22`, topic `expressions`, alongside existing بِخَيْر/كَمِ السَّاعَة-style fixed phrases):

| id | Arabic | Gloss | Note |
|---|---|---|---|
| exp-13 | أَيْضًا | also / too | |
| exp-14 | أَخِيرًا | finally / at last | |
| exp-15 | فَجْأَةً | suddenly | |
| exp-16 | أَوَّلًا | first / firstly | Adverb built on batch 5's أَوَّل (1st) — same word, different role. |
| exp-17 | ذَاتَ يَوْمٍ | one day (story opener) | Fixed time-adverbial (ذَات accusative + يَوْمٍ genitive) — cited whole, not grammatically dissected, same treatment as other multi-word fixed phrases already in the lexicon. |
| exp-18 | طَبْعًا | of course | |
| exp-19 | لَا بَأْسَ | no problem / never mind | لا + accusative-without-tanwīn noun — the same negation family `gr:negation-a1` already names; بَأْسَ (not بَأْسًا) is the correct form. |
| exp-20 | هَلْ عِنْدَكَ...؟ | do you have...? | Built directly on `lex:ver-17`'s already-documented عِنْدَ + suffix paradigm. |
| exp-21 | مُمْكِن...؟ | may I...? / is it possible...? | Cited as a fixed conversational opener, not formally parsed as governing a following verb's mood — the subjunctive itself is explicitly a B1 topic per `levels.json`'s own B1 blurb, not introduced here. |
| exp-22 | هَذَا كُلُّ شَيْءٍ | that's all / nothing else | Needs the one supporting lexeme below. |

**1 supporting lexeme beyond the literal checklist**, needed to build exp-22 naturally: `شَيْء` (thing) — topic `objects`, next available id. Flagged transparently since it's not itself a named wordlist line item, the same kind of small, justified addition batch 5 made when a natural sentence needed one extra word.

**4 new shopping nouns** (`lex:shp-11`–`14`, topic `shopping`, continuing from batch 4's currencies):

| id | Arabic | Gloss |
|---|---|---|
| shp-11 | نَقْد | cash |
| shp-12 | بِطَاقَة اِئْتِمَان | credit card (iḍāfa compound, cited bare/pausal like every other multi-word noun citation — no invented case ending on a word that will carry different case endings depending on the sentence it ends up in) |
| shp-13 | مَقَاس | size (clothing) |
| shp-14 | خَصْم | discount |

**1 new verb** (`lex:ver-30`, topic `verbs`): جَرَّبَ (to try/try on) — cited in the same dictionary (3rd-person-past) form every other verb in this lexicon uses. Honesty note: جَرَّبَ is a Form II verb; its derivational pattern (how Form II differs from Form I) is formally taught in B1's own "Derived Verb Forms II–X" unit, not here — this batch only adds the word as vocabulary, exactly the way كَتَبَ and أَرَادَ were usable vocabulary long before `a2-verbal-sentence` formally taught verb conjugation.

**1 new noun** (`lex:sch-22`, topic `school`): قِصَّة (story) — grouped with school/reading vocabulary rather than a new topic.

**No new grammar point, no new example texts, no lesson file, no curriculum.json change.** `a2-u5`/`a2-u6` stay `planned` — this batch only stocks their future vocabulary.

## 4. Open questions

1. **One combined batch/PR, not split by topic** — unlike batches 4/5 (which split because each shipped a distinct *lesson*), neither topic here gets a lesson yet, and the two topics are comparable in size (10 vs. 12 entries, not the 4-vs-24 mismatch that justified splitting dates from prices). Recommend **one PR for both topics**.
2. **`جَرَّبَ` citation despite Form II not being formally taught until B1** — consistent with how every verb in this lexicon has always worked (cited as vocabulary well before its conjugation pattern gets formal treatment). Recommend **yes, as reasoned above**.
3. **`مُمْكِن...؟` left grammatically unanalyzed** rather than explaining what mood/verb-form typically follows it — avoids reaching into B1's reserved subjunctive territory. Recommend **yes**; a fuller treatment can return once B1 actually teaches the subjunctive.
4. **`شَيْء` added beyond the literal checklist**, purely to make `exp-22` a real phrase rather than an abstract gloss. Recommend **keep it** — it's independently useful, high-frequency vocabulary regardless.

## 5. Not in this batch

- ❌ Any lesson file or curriculum.json change — `a2-u5`/`a2-u6` remain `planned`, unchanged.
- ❌ Fully-vowelled narrative paragraphs (`a2-u5`'s actual job) or dialogues (`a2-u6`'s actual job) — this batch only supplies the words they'll be built from.
- ❌ Any new grammar point — every item here reuses grammar already taught (`gr:idafa`, `gr:negation-a1`, `gr:core-prepositions`) or is deliberately left as unanalyzed fixed vocabulary pending B1.
- ❌ `content/wordlists/a2.json` changes — nothing here was unanticipated; the checklist already named every item.
