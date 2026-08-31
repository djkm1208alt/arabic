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
    // allow-list silences it
    const allowed = lint(fx.broken, wordlists, { [Object.values(fx.broken)[0][0].id]: [fx.rule === "harakat" ? "harakat" : fx.rule === "levelfit" ? "levelfit" : fx.rule === "longvowel" ? "longvowel" : fx.rule === "length" ? "length" : fx.rule === "emphatic" ? "emphatic" : fx.rule === "ar-indic" ? "ar-indic" : "register"] });
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

console.log("\n" + (fails === 0 ? "✅ ALL LINT FIXTURES BEHAVE" : "❌ " + fails + " FAILURE(S)"));
process.exit(fails ? 1 : 0);
