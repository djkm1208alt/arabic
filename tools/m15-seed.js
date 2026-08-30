/* =============================================================================
   m15-seed.js  —  ONE-TIME field seed for M15
   =============================================================================

   Adds `skills`, `level`, and `prereqs` to every object in content/*.json,
   per the rules below. Ran once; after M15 the JSON is hand-authored and this
   script is kept only as the record of how the initial tagging was derived.
   Refuses to run if the fields are already present.

   Node built-ins only. Rewrites content/{letters,marks,syllables,grammar,
   texts,lexemes}.json in place.
   ============================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");

const DIR = path.resolve(__dirname, "..", "content");
const read = f => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
const write = (f, o) => fs.writeFileSync(path.join(DIR, f), JSON.stringify(o, null, 2) + "\n");

const letters = read("letters.json");
const marks = read("marks.json");
const syllables = read("syllables.json");
const grammar = read("grammar.json");
const texts = read("texts.json");
const lexemes = read("lexemes.json");

if (letters[0].skills) {
  console.error("m15-seed: letters.json already has `skills` — M15 tagging already applied. Nothing to do.");
  process.exit(0);
}

/* ---- letters: A0, read/write/pronounce, no prereqs (the root of the graph) ---- */
letters.forEach(l => { l.level = "A0"; l.skills = ["reading", "writing", "pronunciation"]; l.prereqs = []; });

/* ---- marks: A0, read/pronounce; long vowels need their short counterpart,
        sukūn/shaddah need the three short vowels, tanwīn needs its base ---- */
const SHORT = { "mrk:madd-alif": "mrk:fatha", "mrk:madd-ya": "mrk:kasra", "mrk:madd-waw": "mrk:damma",
                "mrk:fathatayn": "mrk:fatha", "mrk:kasratayn": "mrk:kasra", "mrk:dammatayn": "mrk:damma" };
marks.forEach(m => {
  m.level = "A0";
  m.skills = ["reading", "pronunciation"];
  if (SHORT[m.id]) m.prereqs = [SHORT[m.id]];
  else if (m.id === "mrk:sukun" || m.id === "mrk:shadda") m.prereqs = ["mrk:fatha", "mrk:kasra", "mrk:damma"];
  else m.prereqs = [];
});

/* ---- syllables: A0, read/pronounce; prereq = constituent consonant + mark ----
   ids are "syl:cvv-ba", "syl:cvc-mu", "syl:gem-ka" -> suffix "ba" / "mu" / "ka". */
const CONS = { ba: "let:ba", bi: "let:ba", bu: "let:ba", ma: "let:mim", mi: "let:mim", mu: "let:mim",
               ta: "let:ta1", ti: "let:ta1", tu: "let:ta1", da: "let:dal", ka: "let:kaf" };
const LONG = { a: "mrk:madd-alif", i: "mrk:madd-ya", u: "mrk:madd-waw" };
syllables.forEach(s => {
  s.level = "A0";
  s.skills = ["reading", "pronunciation"];
  const suffix = s.id.split(":")[1].split("-")[1];   // "ba"
  const letterId = CONS[suffix];
  const vowel = suffix.slice(-1);
  if (s.shape === "CVV") s.prereqs = [letterId, LONG[vowel]].filter(Boolean);
  else if (s.shape === "CVC") s.prereqs = [letterId, "mrk:sukun"].filter(Boolean);
  else s.prereqs = [letterId, "mrk:shadda"].filter(Boolean);  // geminated
});

/* ---- grammar: keep level; add skills; the one critical edge (ال -> sun/moon) ---- */
grammar.forEach(g => {
  g.skills = ["grammar", "reading"];
  g.prereqs = g.id === "gr:sun-moon" ? ["let:lam"] : [];
});

/* ---- texts: level by source; read/comprehension/listening; grammar edge ---- */
const TEXT_LEVEL = { "txt:sent-house-big": "A1", "txt:sent-book-beautiful": "A1", "txt:sent-girl-happy": "A1",
                     "txt:gram-gender-bint": "A1", "txt:gram-sunletter-shams": "A1",
                     "txt:gram-verb-he": "A2", "txt:gram-verb-she": "A2", "txt:gram-verb-they": "A2" };
const TEXT_PREREQ = { "txt:gram-gender-bint": ["gr:gender-agreement"], "txt:gram-sunletter-shams": ["gr:sun-moon"],
                      "txt:gram-verb-he": ["gr:present-tense"], "txt:gram-verb-she": ["gr:present-tense"], "txt:gram-verb-they": ["gr:present-tense"] };
texts.forEach(t => {
  t.level = TEXT_LEVEL[t.id] || "A1";
  t.skills = t.source === "m11" ? ["reading", "comprehension", "listening", "grammar"] : ["reading", "comprehension", "listening"];
  t.prereqs = TEXT_PREREQ[t.id] || [];
});

/* ---- lexemes: keep level; vocabulary strand; no modelled prereqs in M15 ---- */
lexemes.forEach(l => {
  if (!l.level) l.level = "A0";
  l.skills = ["vocabulary"];
  l.prereqs = [];
});

write("letters.json", letters);
write("marks.json", marks);
write("syllables.json", syllables);
write("grammar.json", grammar);
write("texts.json", texts);
write("lexemes.json", lexemes);

console.log("m15-seed: tagged", letters.length, "letters,", marks.length, "marks,", syllables.length, "syllables,",
            grammar.length, "grammar,", texts.length, "texts,", lexemes.length, "lexemes with skills/level/prereqs.");
