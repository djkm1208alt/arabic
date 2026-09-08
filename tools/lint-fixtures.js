/* =============================================================================
   lint-fixtures.js  —  deliberately-broken content, one per linter rule
   =============================================================================
   Each fixture is a minimal `data` object with exactly one fault. The test
   in this file asserts the linter flags it, and that the fixed version is
   clean. Node built-ins only. Run:  node tools/lint-fixtures.js
   ============================================================================= */
"use strict";
const { lint } = require("./content-lint.js");

const wordlists = { a1: [{ en: "book", topic: "school", pos: "noun", priority: 1 }] };

/* helper: one lexeme object with sane defaults, overridden per fixture */
const lex = (over) => Object.assign({
    id: "lex:fix", kind: "lexeme", ar: "كِتَاب", translit: "kitāb", en: "book",
    pos: "noun", topic: "school", level: "A1", skills: ["vocabulary"], prereqs: [],
}, over);

/* helper: one text object with sane defaults, overridden per fixture */
const txt = (over) => Object.assign({
    id: "txt:fix", kind: "text", textType: "sentence", source: "m20",
    vowelled: "الطَّالِبُ فِي الْمَدْرَسَةِ", translit: "aṭ-ṭālibu fī al-madrasati",
    en: "The student is at school.", level: "A2", skills: ["reading"],
}, over);

const FIXTURES = [
    {
        rule: "register",
        kind: "error",
        broken: { lexemes: [lex({ id: "lex:reg", ar: "أَنَا عَايِز مَاء", translit: "anā ʿāyiz māʾ", en: "I want water" })] },
        fixed:  { lexemes: [lex({ id: "lex:reg", ar: "أُرِيدُ مَاءً", translit: "urīdu māʾan", en: "I want water" })] },
    },
    {
        rule: "ar-indic",
        kind: "error",
        broken: { lexemes: [lex({ id: "lex:dig", ar: "٣ كُتُب", translit: "3 kutub", en: "3 books", topic: "school" })] },
        fixed:  { lexemes: [lex({ id: "lex:dig", ar: "ثَلَاثَةُ كُتُب", translit: "thalāthatu kutub", en: "three books", topic: "school" })] },
    },
    {
        rule: "emphatic",
        kind: "error",
        broken: { lexemes: [lex({ id: "lex:emp", ar: "صَغِير", translit: "saghīr", en: "small" })] },   // ص but translit "s"
        fixed:  { lexemes: [lex({ id: "lex:emp", ar: "صَغِير", translit: "ṣaghīr", en: "small" })] },
    },
    {
        rule: "harakat",
        kind: "warning",
        broken: { lexemes: [lex({ id: "lex:hrk", ar: "بيت", translit: "bayt", en: "house" })] },        // fully bare
        fixed:  { lexemes: [lex({ id: "lex:hrk", ar: "بَيْت", translit: "bayt", en: "house" })] },
    },
    {
        rule: "longvowel",
        kind: "warning",
        broken: { lexemes: [lex({ id: "lex:lv", ar: "بب", translit: "bābā", en: "daddy" })] },
        fixed:  { lexemes: [lex({ id: "lex:lv", ar: "بَابَا", translit: "bābā", en: "daddy" })] },
    },
    {
        rule: "length",
        kind: "warning",
        broken: { lexemes: [lex({ id: "lex:len", ar: "بَاب", translit: "muʿallimatun kabīratun", en: "door" })] },
        fixed:  { lexemes: [lex({ id: "lex:len", ar: "بَاب", translit: "bāb", en: "door" })] },
    },
    {
        rule: "levelfit",
        kind: "warning",
        broken: { lexemes: [lex({ id: "lex:lf", en: "epistemology", topic: "school", level: "A1" })] },
        fixed:  { lexemes: [lex({ id: "lex:lf", en: "book", topic: "school", level: "A1" })] },
    },
    {
        rule: "parseword",
        kind: "error",
        // "الْمُعَلِّمُ" (the teacher) never appears in the fixture sentence
        broken: { texts: [txt({ id: "txt:pw", parse: [{ word: "الْمُعَلِّمُ", role: "fail" }] })] },
        fixed:  { texts: [txt({ id: "txt:pw", parse: [{ word: "الطَّالِبُ", role: "fail" }] })] },
    },
    {
        rule: "parserole",
        kind: "error",
        broken: { texts: [txt({ id: "txt:pr", parse: [{ word: "الطَّالِبُ", role: "subject" }] })] },   // not in the closed vocabulary
        fixed:  { texts: [txt({ id: "txt:pr", parse: [{ word: "الطَّالِبُ", role: "mubtada" }] })] },
    },
    {
        rule: "parsecase",
        kind: "error",
        broken: { texts: [txt({ id: "txt:pc", parse: [{ word: "الطَّالِبُ", role: "mubtada", case: "nominative" }] })] },   // not in the closed vocabulary
        fixed:  { texts: [txt({ id: "txt:pc", parse: [{ word: "الطَّالِبُ", role: "mubtada", case: "raf" }] })] },
    },
];

let fails = 0;
const ok = (c, m) => { console.log((c ? "  ✔ " : "  ✘ ") + m); if (!c) fails++; };

for (const fx of FIXTURES) {
    const b = lint(fx.broken, wordlists, {});
    const f = lint(fx.fixed, wordlists, {});
    const bag = fx.kind === "error" ? b.errors : b.warnings;
    const hit = bag.some(x => x.indexOf(fx.rule) === 0);
    ok(hit, `[${fx.rule}] fixture is flagged (${fx.kind})`);
    const fixedClean = f.errors.length === 0 && f.warnings.filter(x => x.indexOf(fx.rule) === 0).length === 0;
    ok(fixedClean, `[${fx.rule}] fixed version is clean`);
    // allow-list silences it — the allow-listed rule name is always exactly
    // fx.rule (M21.6: simplified from a hand-enumerated ternary chain that
    // silently fell back to "register" for any rule name it didn't already
    // know about — dead code for the 7 rules that predate it, since each of
    // those branches just mapped fx.rule back to itself, but a real bug for
    // parseword/parserole/parsecase below, which it would have mis-tested).
    const allowed = lint(fx.broken, wordlists, { [Object.values(fx.broken)[0][0].id]: [fx.rule] });
    const stillFlagged = (fx.kind === "error" ? allowed.errors : allowed.warnings).some(x => x.indexOf(fx.rule) === 0);
    ok(!stillFlagged, `[${fx.rule}] _lint-allow.json silences it`);
}

/* levelfit gloss normalisation — a compound / qualified English gloss should
   still match a plain word-list lemma (and vice-versa), so real A1 vocab
   isn't flagged just because the gloss is worded differently. */
const nWl = { a1: [
    { en: "orange (colour)", topic: "colours", pos: "adjective", priority: 3 },
    { en: "to hear",         topic: "verbs",   pos: "verb",      priority: 1 },
    { en: "town / village",  topic: "places",  pos: "noun",      priority: 2 },
    { en: "they (m.)",       topic: "social",  pos: "pronoun",   priority: 1 },
] };
const nOK = [
    lex({ id: "lex:n1", en: "orange" }),
    lex({ id: "lex:n2", en: "to hear / to listen" }),
    lex({ id: "lex:n3", en: "village" }),
    lex({ id: "lex:n4", en: "they (masculine/mixed group)" }),
];
const nRes = lint({ lexemes: nOK }, nWl, {});
ok(nRes.warnings.filter(w => w.indexOf("levelfit") === 0).length === 0,
   "[levelfit] compound / qualified glosses match a plain lemma");
const nBad = lint({ lexemes: [lex({ id: "lex:n5", en: "photosynthesis" })] }, nWl, {});
ok(nBad.warnings.some(w => w.indexOf("levelfit") === 0),
   "[levelfit] a genuinely off-level word still warns");

/* M21 batch 1: harakat and levelfit both now also cover A2, checked against
   wordlists.a2 the same way A1 is checked against wordlists.a1. */
const a2Wl = { a1: wordlists.a1, a2: [
    { en: "yesterday", topic: "verbal-sentence", pos: "adverb", priority: 1 },
] };

const a2HrkBad = lint({ lexemes: [lex({ id: "lex:a2hrk", ar: "بيت", translit: "bayt", en: "house", level: "A2" })] }, a2Wl, {});
ok(a2HrkBad.warnings.some(w => w.indexOf("harakat") === 0),
   "[harakat] now also fires on A2 content");

const a2LfOK = lint({ lexemes: [lex({ id: "lex:a2lf1", en: "yesterday", topic: "verbal-sentence", level: "A2" })] }, a2Wl, {});
ok(a2LfOK.warnings.filter(w => w.indexOf("levelfit") === 0).length === 0,
   "[levelfit] an A2 lexeme on wordlists.a2 doesn't warn");

const a2LfBad = lint({ lexemes: [lex({ id: "lex:a2lf2", en: "photosynthesis", topic: "verbal-sentence", level: "A2" })] }, a2Wl, {});
ok(a2LfBad.warnings.some(w => w.indexOf("levelfit") === 0 && w.indexOf("A2") !== -1 && w.indexOf("wordlists/a2.json") !== -1),
   "[levelfit] an A2 lexeme missing from wordlists.a2 warns, citing a2.json");

/* M21 batch 3: a single attachable prefix (وَ, فَ, بِ, لِ, كَ) glued directly
   onto the definite article — وَالنِّصْفُ, "and the half" — must not trip the
   harakat check on the assimilated ل, the same way word-initial الـ already
   doesn't. A genuinely bare ل elsewhere still has to warn. */
const prefixDefOK = lint({ lexemes: [lex({ id: "lex:pfx1", ar: "وَالنِّصْفُ", translit: "wa-n-niṣfu", en: "and the half", level: "A2" })] }, a2Wl, {});
ok(prefixDefOK.warnings.filter(w => w.indexOf("harakat") === 0).length === 0,
   "[harakat] وَالنِّصْفُ (prefix + assimilated definite article) doesn't warn");

const bareLamBad = lint({ lexemes: [lex({ id: "lex:pfx2", ar: "بلغ", translit: "balagha", en: "he reached", level: "A2" })] }, a2Wl, {});
ok(bareLamBad.warnings.some(w => w.indexOf("harakat") === 0),
   "[harakat] a genuinely unvowelled ل elsewhere still warns");

console.log("\n" + (fails === 0 ? "✅ ALL LINT FIXTURES BEHAVE" : "❌ " + fails + " FAILURE(S)"));
process.exit(fails ? 1 : 0);
