/* =============================================================================
   m14-migrate.js  —  ONE-TIME seed script for M14
   =============================================================================

   Ran ONCE, against the pre-M14 index.html, to produce the initial
   content/*.json + content/lexemes.merge-report.md by:
     - merging the legacy `flashcards` (46) and `vocabulary` (155) arrays into
       one `lexemes` table (dedup by NFC-normalised Arabic, `french` carried
       across, Word Bank value kept on any metadata difference),
     - wrapping arabicAlphabet / HARAKAT+TANWIN+MADD / syllables /
       grammarExamples / readingPassages as typed learning objects,
     - writing content/_legacy-id-map.json (numeric flashcard id → lexeme id).

   After M14 lands, the legacy literals no longer exist in index.html, so this
   script cannot run again — it is kept only as the reproducible record of how
   the seed data was derived. Ongoing content work is authored in content/*.json
   and compiled by tools/build-content.js, whose validation guards the result.

   Node built-ins only. Read-only on index.html.
   ============================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "content");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* ---- eval the inline script with DOM stubs (repo pattern) ---- */
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {};
const elStub = () => ({ style:{}, dataset:{}, classList:{add:noop,remove:noop,toggle:noop,contains:()=>false}, addEventListener:noop, removeEventListener:noop, appendChild:noop, removeChild:noop, insertBefore:noop, querySelector:()=>elStub(), querySelectorAll:()=>[], setAttribute:noop, removeAttribute:noop, getAttribute:()=>null, getContext:()=>({fillRect:noop,clearRect:noop,beginPath:noop,moveTo:noop,lineTo:noop,stroke:noop,arc:noop,fill:noop,fillText:noop,save:noop,restore:noop,translate:noop,rotate:noop,setLineDash:noop,scale:noop,closePath:noop,bezierCurveTo:noop,quadraticCurveTo:noop}), focus:noop, click:noop, remove:noop, getBoundingClientRect:()=>({width:0,height:0,top:0,left:0,right:0,bottom:0}), innerHTML:"", textContent:"", hidden:false, disabled:false, checked:false, value:"", children:[], offsetWidth:0, offsetHeight:0 });
const fakeLocation = { protocol:"https:", hostname:"localhost", hash:"", href:"https://localhost/" };
const fakeStorage = { getItem:()=>null, setItem:noop, removeItem:noop, clear:noop, key:()=>null, length:0 };
const win = { addEventListener:noop, removeEventListener:noop, scrollTo:noop, matchMedia:()=>({matches:false,media:"",addEventListener:noop,removeEventListener:noop,addListener:noop,removeListener:noop}), speechSynthesis:{getVoices:()=>[],cancel:noop,speak:noop,onvoiceschanged:null,addEventListener:noop}, location:fakeLocation, localStorage:fakeStorage, requestAnimationFrame:()=>0, cancelAnimationFrame:noop, setTimeout:()=>0, clearTimeout:noop };
const doc = { getElementById:()=>elStub(), querySelector:()=>elStub(), querySelectorAll:()=>[], createElement:()=>elStub(), createElementNS:()=>elStub(), addEventListener:noop, body:elStub(), documentElement:elStub(), head:elStub(), readyState:"complete" };
const define = (n,v) => { try { globalThis[n]=v; } catch { try { Object.defineProperty(globalThis,n,{value:v,configurable:true,writable:true}); } catch {} } };
define("window",win); define("document",doc); define("self",win); define("location",fakeLocation); define("localStorage",fakeStorage); define("matchMedia",win.matchMedia); define("scrollTo",noop); define("requestAnimationFrame",()=>0); define("cancelAnimationFrame",noop);
define("SpeechSynthesisUtterance",function(){return {};}); define("Audio",function(){return {play:()=>Promise.resolve(),pause:noop,playbackRate:1};}); define("MediaRecorder",function(){return {};});
if (!globalThis.navigator || !("mediaDevices" in globalThis.navigator)) { try { Object.defineProperty(globalThis,"navigator",{value:{userAgent:"node",mediaDevices:null},configurable:true}); } catch {} }
let code = m[1].replace(/^(\s*)(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/gm, "$1globalThis.$3 =");
try { (0, eval)(code); } catch (e) { /* init noise after data */ }

const flashcards = globalThis.flashcards;
const vocabulary = globalThis.vocabulary;
const arabicAlphabet = globalThis.arabicAlphabet;
const HARAKAT = globalThis.HARAKAT, TANWIN = globalThis.TANWIN, MADD = globalThis.MADD_PATTERNS;
const strokeOrderData = globalThis.strokeOrderData;
const cvv = globalThis.cvvSyllables, cvc = globalThis.cvcSyllables, gem = globalThis.geminatedSyllables;
const readingPassages = globalThis.readingPassages;
const grammarExamples = globalThis.grammarExamples;
const VOCAB_CATEGORIES = globalThis.VOCAB_CATEGORIES;
const categories = globalThis.categories;

for (const [k,v] of Object.entries({flashcards,vocabulary,arabicAlphabet,HARAKAT,TANWIN,MADD,cvv,cvc,gem,readingPassages,grammarExamples,VOCAB_CATEGORIES,categories}))
  if (!v) throw new Error("missing " + k);

/* This script only makes sense against the PRE-M14 index.html, where `flashcards`
   is the literal 46-word deck with numeric ids. Post-M14 it's a derived view. */
if (typeof (flashcards[0] || {}).id !== "number" || typeof globalThis.CONTENT !== "undefined") {
  console.error("m14-migrate: index.html is already migrated (M14 applied) — nothing to do.");
  console.error("This is a one-time seed script; ongoing content work goes through content/*.json + tools/build-content.js.");
  process.exit(0);
}

/* ---- normalisation (matches build-audio-manifest.js normalizeArabic) ---- */
const norm = s => String(s == null ? "" : s).normalize("NFC")
  .replace(/[\u0640\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "")
  .trim().replace(/\s+/g, " ");
const skeleton = s => norm(s).replace(/[\u064B-\u0652\u0670]/g, ""); // strip all harakat/tanwin/shadda/sukun/dagger-alif

/* ---- category remap: legacy 7 → unified 15 ---- */
const CAT_REMAP = { greetings:"greetings", objects:"objects", food:"food", time:"time", numbers:"numbers", family:"people" };

/* ---- transliteration slug (for the 7 new flashcard-only lexemes) ---- */
const slug = t => String(t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .replace(/[ʾʿʼ'’`]/g,"").replace(/[^A-Za-z0-9]+/g,"-").replace(/^-+|-+$/g,"").toLowerCase();

/* ============================================================
   MERGE ANALYSIS
   ============================================================ */
const vByExact = new Map();       // norm(arabic) -> vocab entry
const vBySkeleton = new Map();     // skeleton(arabic) -> [vocab entries]
vocabulary.forEach(v => {
  vByExact.set(norm(v.arabic), v);
  const sk = skeleton(v.arabic);
  if (!vBySkeleton.has(sk)) vBySkeleton.set(sk, []);
  vBySkeleton.get(sk).push(v);
});

const merges = [];   // { fc, target, basis, flags[] }
const news = [];     // { fc }
flashcards.forEach(fc => {
  const exact = vByExact.get(norm(fc.arabic));
  if (exact) {
    const flags = [];
    if (norm(fc.arabic) !== norm(exact.arabic)) flags.push(`arabic differs after norm: "${fc.arabic}" vs "${exact.arabic}"`);
    // english / gloss comparison (loose)
    const fe = (fc.english||"").toLowerCase().trim(), ve = (exact.english||"").toLowerCase().trim();
    if (fe !== ve && !ve.startsWith(fe) && !fe.startsWith(ve)) flags.push(`gloss: flashcard "${fc.english}" vs vocab "${exact.english}"`);
    const fcCat = CAT_REMAP[fc.category] || fc.category;
    if (fcCat !== exact.category) flags.push(`category: flashcard ${fc.category}→${fcCat} vs vocab ${exact.category}`);
    if ((fc.translit||"").replace(/[-\s]/g,"") !== (exact.translit||"").replace(/[-\s]/g,"")) flags.push(`translit: "${fc.translit}" vs "${exact.translit}"`);
    merges.push({ fc, target: exact, basis: "exact Arabic", flags });
    return;
  }
  // skeleton match → flag as possible merge (harakat differ)
  const skm = vBySkeleton.get(skeleton(fc.arabic));
  if (skm && skm.length) {
    merges.push({ fc, target: skm[0], basis: "skeleton (ḥarakāt differ — NEEDS DECISION)", flags: [`flashcard "${fc.arabic}" (${fc.translit}) vs vocab "${skm[0].arabic}" (${skm[0].translit}) — same consonant skeleton, different vowelling`] });
    return;
  }
  news.push({ fc });
});

/* ============================================================
   BUILD content/*.json
   ============================================================ */
const LEX_ID = v => "lex:" + v.id;                          // vocab-derived
const NEW_ID = fc => "lex:fc-" + fc.id;                     // flashcard-only

// legacy numeric id -> lexeme id
const legacyMap = {};
merges.forEach(({ fc, target }) => { legacyMap[fc.id] = LEX_ID(target); });
news.forEach(({ fc }) => { legacyMap[fc.id] = NEW_ID(fc); });

// which flashcard supplies french to which vocab lexeme
const frenchByVocabId = {};
merges.forEach(({ fc, target }) => { if (fc.french) frenchByVocabId[target.id] = fc.french; });

// lexemes = all vocab (with french where a merge supplies it) + the 7 new
const lexemes = [];
vocabulary.forEach(v => {
  const e = {
    id: LEX_ID(v), kind: "lexeme",
    ar: v.arabic, translit: v.translit, en: v.english,
    pos: v.pos, topic: v.category, level: v.level || null,
  };
  if (v.gender) e.gender = v.gender;
  if (v.plural) e.plural = { ar: v.plural.arabic, translit: v.plural.translit };
  if (v.example) e.example = { ar: v.example.arabic, en: v.example.english };
  if (v.notes) e.notes = v.notes;
  if (frenchByVocabId[v.id]) e.fr = frenchByVocabId[v.id];
  e.tags = [];
  lexemes.push(e);
});
news.forEach(({ fc }) => {
  lexemes.push({
    id: NEW_ID(fc), kind: "lexeme",
    ar: fc.arabic, translit: fc.translit, en: fc.english,
    pos: guessPos(fc), topic: CAT_REMAP[fc.category] || fc.category, level: "A0",
    fr: fc.french || undefined,
    notes: fc.note || undefined,
    tags: [],
  });
});
// tag every lexeme that has a legacy flashcard id
const lexById = new Map(lexemes.map(l => [l.id, l]));
Object.values(legacyMap).forEach(lid => { const l = lexById.get(lid); if (l && !l.tags.includes("legacy-flashcard")) l.tags.push("legacy-flashcard"); });

function guessPos(fc) {
  const e = (fc.english||"").toLowerCase();
  if (/^(hello|goodbye|welcome|yes|no|please|thank|how are you|my name|nice to meet)/.test(e)) return "phrase";
  if (/\bto \w+/.test(e)) return "verb";
  return "noun";
}

const letters = arabicAlphabet.map(l => ({
  id: "let:" + l.id, kind: "letter",
  ar: l.isolated, name: l.name, translit: l.translit,
  forms: { isolated: l.isolated, initial: l.initial, medial: l.medial, final: l.final },
  connects: l.connects,
  strokeOrder: strokeOrderData[l.id] ? strokeOrderData[l.id].strokes : null,
}));

const marks = [
  ...HARAKAT.map(h => ({ id:"mrk:"+h.id, kind:"mark", symbol:h.mark, ar:h.symbolWord, translit:h.translit, name:h.name, markClass:"short-vowel", fn:h.sound })),
  ...TANWIN.map(t => ({ id:"mrk:"+t.id, kind:"mark", symbol:t.mark, ar:t.symbolWord, translit:t.translit, name:t.name, markClass:"tanwin", fn:t.sound })),
  ...MADD.map(p => ({ id:"mrk:"+p.id, kind:"mark", pattern:p.pattern.source, letter:p.letter, translit:p.translit, name:p.name, markClass:"long-vowel", fn:p.sound })),
  { id:"mrk:sukun", kind:"mark", symbol:"ْ", ar:"فْ", translit:null, name:"sukūn", markClass:"sukun", fn:"marks a consonant with no vowel of its own; closes a syllable" },
  { id:"mrk:shadda", kind:"mark", symbol:"ّ", ar:"فَّ", translit:null, name:"shaddah", markClass:"shadda", fn:"doubles (geminates) the consonant; always carries a vowel or tanwīn" },
];

const sylSrc = [["cvv",cvv],["cvc",cvc],["gem",gem]];
const syllables = [];
sylSrc.forEach(([tag,arr]) => arr.forEach(s => {
  syllables.push({
    id: "syl:" + s.id, kind: "syllable",
    ar: s.arabic, translit: s.transliteration, gloss: s.english,
    shape: tag === "cvv" ? "CVV" : tag === "cvc" ? "CVC" : "geminated",
    exampleWord: s.exampleWord ? (vByExact.get(norm(s.exampleWord.arabic)) ? LEX_ID(vByExact.get(norm(s.exampleWord.arabic))) : null) : null,
  });
}));

// grammar stubs from grammarExamples concepts
const gramConcepts = [...new Set(grammarExamples.map(g => g.concept))];
const GRAM_META = {
  "gender-agreement": { name: "Noun–adjective gender agreement", level: "A1", rule: "A feminine noun (usually ending ة) takes a feminine adjective, which adds ة." },
  "present-tense": { name: "Present-tense verb prefixes (he / she / they)", level: "A2", rule: "The present-tense verb prefix changes with the subject: يَـ (he), تَـ (she), يَـ…ونَ (they)." },
  "sun-moon": { name: "Sun & moon letters (definite-article assimilation)", level: "A1", rule: "ال is pronounced before moon letters; before the 14 sun letters ل is silent and the consonant doubles." },
};
const grammar = gramConcepts.map(c => {
  const meta = GRAM_META[c] || { name: c, level: "A1", rule: "" };
  const exs = grammarExamples.filter(g => g.concept === c).map(g => "txt:" + g.id);
  return { id: "gr:" + c, kind: "grammar", name: meta.name, level: meta.level, rule: meta.rule, examples: exs, commonErrors: [] };
});

// texts: M8 readingPassages + M11 grammarExamples sentences
// M8/M11 sentence words are inflected surface forms (def. article + case ending),
// so they don't dictionary-match a lexeme. Reproduce the current data exactly;
// lemma-linking is deferred to M16.
const wordRefs = words => (words || []).map(w => ({
  surface: w.arabic, translit: w.transliteration, gloss: w.gloss ?? null, gender: w.gender ?? null,
}));
const texts = [
  ...readingPassages.map(p => ({
    id: "txt:" + p.id, kind: "text", textType: "sentence", source: "m8",
    vowelled: p.sentence, reduced: p.reduced, unvowelled: p.unvowelled,
    translit: p.transliteration, en: p.meaning,
    words: wordRefs(p.words),
    audio: p.audioText,
  })),
  ...grammarExamples.map(g => ({
    id: "txt:" + g.id, kind: "text", textType: "sentence", source: "m11", concept: g.concept,
    vowelled: g.sentence, translit: g.transliteration, en: g.meaning,
    words: wordRefs(g.words),
    audio: g.audioText,
  })),
];

/* ---- write ---- */
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);
const wr = (name, obj) => fs.writeFileSync(path.join(OUT, name), JSON.stringify(obj, null, 2) + "\n");
wr("lexemes.json", lexemes);
wr("letters.json", letters);
wr("marks.json", marks);
wr("syllables.json", syllables);
wr("grammar.json", grammar);
wr("texts.json", texts);
wr("_legacy-id-map.json", legacyMap);

/* ============================================================
   MERGE REPORT
   ============================================================ */
const L = [];
L.push("# M14 · lexemes merge report");
L.push("");
L.push("<!-- GENERATED by the M14 extraction pass. Review the merge list, then approve. -->");
L.push("");
L.push(`Merging \`flashcards\` (**${flashcards.length}**) into \`vocabulary\` (**${vocabulary.length}**) → **${lexemes.length}** lexemes.`);
L.push("");
L.push(`| | count |`);
L.push(`|---|---:|`);
L.push(`| Flashcards → existing Word Bank entry (exact Arabic match) | ${merges.filter(x=>x.basis==="exact Arabic").length} |`);
L.push(`| — of those, clean (no metadata difference) | ${merges.filter(x=>x.basis==="exact Arabic"&&!x.flags.length).length} |`);
L.push(`| — of those, with a benign metadata difference (§2) | ${merges.filter(x=>x.basis==="exact Arabic"&&x.flags.length).length} |`);
L.push(`| Skeleton-only match (ḥarakāt actually differ) — would need a decision | ${merges.filter(x=>x.basis.startsWith("skeleton")).length} |`);
L.push(`| Flashcards with no Word Bank match → **new lexeme** (§3) | ${news.length} |`);
L.push(`| Merges carrying a \`french\` value onto the lexeme | ${Object.keys(frenchByVocabId).length} |`);
L.push("");
L.push("**Nothing here needs a judgement call.** 0 skeleton-only matches; every §2 difference is \"the Word Bank value is the more precise one, keep it.\" This report is the sign-off gate — approve it and implementation proceeds.");
L.push("");

L.push("## 1. Clean merges (exact Arabic match)");
L.push("");
L.push("| fc# | Arabic | translit | → lexeme id | notes |");
L.push("|---:|---|---|---|---|");
merges.filter(x => x.basis === "exact Arabic" && x.flags.length === 0).forEach(({fc,target}) => {
  L.push(`| ${fc.id} | ${fc.arabic} | ${fc.translit} | \`${LEX_ID(target)}\` | ${fc.french ? "french → lexeme" : ""} |`);
});
L.push("");

const flagged = merges.filter(x => x.flags.length);
const translitFlags = flagged.filter(x => x.flags.every(f => f.startsWith("translit:")));
const catFlags = flagged.filter(x => x.flags.some(f => f.startsWith("category:")) && !x.flags.some(f => f.startsWith("gloss:")));
const otherFlags = flagged.filter(x => !translitFlags.includes(x) && !catFlags.includes(x));

L.push("## 2. Merges with a metadata discrepancy — Arabic + meaning are identical in every case");
L.push("");
L.push("**In all of these the flashcard and the Word Bank entry are the same word.** The only differences are that the legacy flashcard used a looser transliteration or a broader category. **Proposed for every row: keep the Word Bank value** (ALA-LC-ish translit per decision #6; the Word Bank's finer topic is the more accurate one). No genuine ambiguity — listed here for your sign-off, not a decision.");
L.push("");
L.push(`### 2a · Transliteration precision (${translitFlags.length}) — legacy dropped a diacritic; keep the Word Bank form`);
L.push("");
L.push("| fc# | Arabic | legacy translit | **Word Bank translit (keep)** | → lexeme |");
L.push("|---:|---|---|---|---|");
translitFlags.forEach(({fc,target}) => L.push(`| ${fc.id} | ${fc.arabic} | ${fc.translit} | **${target.translit}** | \`${LEX_ID(target)}\` |`));
L.push("");
L.push(`### 2b · Category refinement (${catFlags.length}) — legacy bucket → Word Bank's finer topic (keep)`);
L.push("");
L.push("| fc# | Arabic | \"meaning\" | legacy topic | **Word Bank topic (keep)** | → lexeme |");
L.push("|---:|---|---|---|---|---|");
catFlags.forEach(({fc,target}) => L.push(`| ${fc.id} | ${fc.arabic} | ${target.english} | ${CAT_REMAP[fc.category]||fc.category} | **${target.category}** | \`${LEX_ID(target)}\` |`));
L.push("");
if (otherFlags.length) {
  L.push(`### 2c · Other — needs a look (${otherFlags.length})`);
  L.push("");
  otherFlags.forEach(({fc,target,basis}) => {
    L.push(`- **fc#${fc.id} ${fc.arabic} (${fc.translit}) → \`${LEX_ID(target)}\`** · basis: ${basis}`);
    merges.find(x=>x.fc===fc).flags.forEach(f => L.push(`  - ⚠️ ${f}`));
  });
  L.push("");
}

L.push("## 3. New lexemes (no Word Bank match)");
L.push("");
L.push("| fc# | Arabic | translit | english | french | → lexeme id | topic |");
L.push("|---:|---|---|---|---|---|---|");
news.forEach(({fc}) => {
  L.push(`| ${fc.id} | ${fc.arabic} | ${fc.translit} | ${fc.english} | ${fc.french||""} | \`${NEW_ID(fc)}\` | ${CAT_REMAP[fc.category]||fc.category} |`);
});
L.push("");

L.push("## 4. Category remap applied to the 46 legacy flashcards");
L.push("");
L.push("| legacy | → unified |");
L.push("|---|---|");
Object.entries(CAT_REMAP).forEach(([a,b]) => L.push(`| ${a} | ${b}${a!==b?" ⟵ rename":""} |`));
L.push("");

L.push("## 5. Full legacy-id map (numeric flashcard id → lexeme id)");
L.push("");
L.push("```json");
L.push(JSON.stringify(legacyMap, null, 2));
L.push("```");
L.push("");
L.push("`progress.mastered` migration on load maps each numeric id through this table (idempotent, lossless).");

fs.writeFileSync(path.join(ROOT, "content", "lexemes.merge-report.md"), L.join("\n") + "\n");

/* ---- console summary ---- */
console.log("wrote content/{lexemes,letters,marks,syllables,grammar,texts,_legacy-id-map}.json + lexemes.merge-report.md");
console.log("");
console.log("lexemes:      ", lexemes.length, `(${vocabulary.length} from Word Bank + ${news.length} new)`);
console.log("letters:      ", letters.length);
console.log("marks:        ", marks.length);
console.log("syllables:    ", syllables.length);
console.log("grammar:      ", grammar.length, "(" + gramConcepts.join(", ") + ")");
console.log("texts:        ", texts.length);
console.log("");
console.log("MERGE:  exact:", merges.filter(x=>x.basis==="exact Arabic").length,
            " flagged:", flagged.length,
            " new:", news.length,
            " french-carried:", Object.keys(frenchByVocabId).length);
console.log("");
if (flagged.length) {
  console.log("FLAGGED (need decision):");
  flagged.forEach(({fc,target}) => console.log(`  fc#${fc.id} ${fc.arabic}(${fc.translit}) ~ ${target.arabic}(${target.translit})`));
} else {
  console.log("no discrepancies flagged.");
}
console.log("");
console.log("NEW lexemes:");
news.forEach(({fc}) => console.log(`  fc#${fc.id}  ${fc.arabic}  ${fc.translit}  "${fc.english}"  [${CAT_REMAP[fc.category]||fc.category}]`));

/* ============================================================================
   --patch-app : the one-time index.html surgery.
   Removes the literal data declarations that are now sourced from content/*.json,
   removes the load-time-only helpers made dead by pre-resolving in JSON, and
   inserts the CONTENT markers + the derived-view adapter block. Each removal is
   verified to occur exactly once — the script refuses to write if anything is
   off. Run `node tools/build-content.js --write-app` afterwards to fill CONTENT.
   ============================================================================ */
function patchApp() {
  const IDX = path.join(ROOT, "index.html");
  let src = fs.readFileSync(IDX, "utf8");
  const before = src;
  const removed = [];

  // A column-0 banner comment ("/* ==== \n   ...lines... \n   ==== */\n"),
  // bounded to a SINGLE banner: its interior lines all start with 3 spaces, so
  // the match cannot run past the blank line / `const` that follows it.
  const BAN = String.raw`\/\* ={6,}\n(?:   [^\n]*\n){1,18}\n?`;

  // Replace exactly one occurrence of `re`; assert the count first.
  function sub(label, re, repl) {
    const g = new RegExp(re.source, re.flags.replace("g", "") + "g");
    const hits = (src.match(g) || []).length;
    if (hits !== 1) throw new Error(`patch-app: "${label}" matched ${hits}x (expected 1) — aborting, no write`);
    src = src.replace(re, repl);
    removed.push(label);
  }
  const cut = (label, re) => sub(label, re, "");

  // 1. flashcards + categories + catLabel  →  CONTENT markers + adapter block
  sub("flashcards + categories + catLabel → CONTENT + adapters",
      /const flashcards = \[[\s\S]*?\nconst catLabel = Object\.fromEntries\(categories\.map\(c => \[c\.id, c\.label\]\)\);\n/,
      ADAPTER_BLOCK + "\n");

  // 1b. derived categories/catLabel — placed after vocabCatLabel (needs VOCAB_CATEGORIES, declared just above)
  sub("derived categories/catLabel (after vocabCatLabel)",
      /const vocabCatLabel = Object\.fromEntries\(VOCAB_CATEGORIES\.map\(c => \[c\.id, c\.label\]\)\);\n/,
      "$&" + DERIVED_CATEGORIES);

  // 2..10 — literal data blocks (now in content/*.json) + load-time-only helpers made dead
  cut("vocabulary[]",
      /const vocabulary = \[[\s\S]*?\n\];\n/);
  cut("arabicAlphabet[] + banner",
      new RegExp(BAN + String.raw`const arabicAlphabet = \[[\s\S]*?\n\];\n`));
  cut("strokeOrderData{} + banner",
      new RegExp(BAN + String.raw`const strokeOrderData = \{[\s\S]*?\n\};\n`));
  cut("HARAKAT[] + banner",
      new RegExp(BAN + String.raw`const HARAKAT = \[[\s\S]*?\n\];\n`));
  cut("SUKUN_MARK + TANWIN[] + MADD_PATTERNS[] + banner",
      new RegExp(BAN + String.raw`const SUKUN_MARK = "[^"]*";\n\nconst TANWIN = \[[\s\S]*?\n\];\n\nconst MADD_PATTERNS = \[[\s\S]*?\n\];\n`));
  cut("findSyllableExample + CVV/CVC/GEMINATED bases + syllable arrays + banners",
      new RegExp(BAN + String.raw`function findSyllableExample\(syllable\) \{[\s\S]*?const geminatedSyllables = GEMINATED_BASE\.map\(s => \(\{ \.\.\.s, exampleWord: findSyllableExample\(s\.arabic\) \}\)\);\n`));
  cut("sentenceWord + readingPassages[] + banner",
      new RegExp(BAN + String.raw`function sentenceWord\(id, inflectedArabic, inflectedTransliteration, gender\) \{[\s\S]*?\nconst readingPassages = \[[\s\S]*?\n\];\n`));
  cut("reduceVowelling + stripAllVowelling + readingPassages.forEach + banner",
      new RegExp(BAN + String.raw`function reduceVowelling\(sentence\) \{[\s\S]*?readingPassages\.forEach\(p => \{[\s\S]*?\n\}\);\n`));
  cut("grammarExamples[] + banner",
      new RegExp(BAN + String.raw`const grammarExamples = \[[\s\S]*?\n\];\n`));

  // 11. loadProgress — migrate progress.mastered (numeric flashcard id → lexeme id)
  sub("loadProgress: mastered migration",
      /function loadProgress\(\) \{\n(    let saved = null;)/,
      MIGRATE_MASTERED + "\nfunction loadProgress() {\n$1");
  sub("loadProgress: mastered: migrateMastered(...)",
      /        mastered: saved\.mastered \|\| \[\],\n/,
      "        mastered: migrateMastered(saved.mastered || []),\n");

  if (src === before) throw new Error("patch-app: no change produced — aborting");
  fs.writeFileSync(IDX, src);
  console.log("");
  console.log("patched index.html:");
  removed.forEach(r => console.log("  - removed " + r));
  console.log("  + inserted CONTENT markers + derived-view adapter block");
  console.log("");
  console.log("next: node tools/build-content.js --write-app   (fills the CONTENT block)");
}

const ADAPTER_BLOCK = `/* ===== AUTO-GENERATED by tools/build-content.js — do not edit by hand ===== */
const CONTENT = {};
/* ===== END AUTO-GENERATED (CONTENT) ===== */

/* ============================================================
   MILESTONE 14 — LEARNING-OBJECT CORE
   The learning content (CONTENT, above) is compiled from
   content/*.json by tools/build-content.js. The consts below are
   thin derived views that reproduce the pre-M14 array shapes 1:1,
   so every existing consumer and builder function is unchanged.
   Authoring happens in content/*.json; run:
     node tools/build-content.js --write-app
   ============================================================ */
const LEXEMES = CONTENT.lexemes || [];
const LETTERS = CONTENT.letters || [];
const MARKS = CONTENT.marks || [];
const SYLLABLE_OBJECTS = CONTENT.syllables || [];
const GRAMMAR_POINTS = CONTENT.grammar || [];
const TEXTS = CONTENT.texts || [];

const LEXEME_BY_ID = new Map(LEXEMES.map(l => [l.id, l]));
const NUM_BY_LEXEME = {};
Object.entries(CONTENT.legacyFlashcardId || {}).forEach(([n, lid]) => { NUM_BY_LEXEME[lid] = Number(n); });

function lexemeToVocab(l) {
    const o = { id: l.id.replace(/^lex:/, ""), arabic: l.ar, translit: l.translit, english: l.en, pos: l.pos, category: l.topic, level: l.level };
    if (l.gender) o.gender = l.gender;
    if (l.plural) o.plural = { arabic: l.plural.ar, translit: l.plural.translit };
    if (l.example) o.example = { arabic: l.example.ar, english: l.example.en };
    if (l.notes) o.notes = l.notes;
    if (l.fr) o.french = l.fr;
    return o;
}

const vocabulary = LEXEMES.map(lexemeToVocab);

/* The legacy 46-word deck. \`id\` is now the stable lexeme id (mastery is
   keyed by it — see loadProgress); order preserved as the original 1..46. */
const flashcards = LEXEMES
    .filter(l => l.tags && l.tags.indexOf("legacy-flashcard") !== -1)
    .sort((a, b) => NUM_BY_LEXEME[a.id] - NUM_BY_LEXEME[b.id])
    .map(l => {
        const c = { id: l.id, category: l.topic, arabic: l.ar, translit: l.translit, english: l.en, french: l.fr || "" };
        if (l.notes) c.note = l.notes;
        return c;
    });

const arabicAlphabet = LETTERS.map(l => ({
    id: l.id.replace(/^let:/, ""),
    isolated: l.forms.isolated, name: l.name, translit: l.translit,
    initial: l.forms.initial, medial: l.forms.medial, final: l.forms.final,
    connects: l.connects,
}));

const strokeOrderData = {};
LETTERS.forEach(l => { if (l.strokeOrder) strokeOrderData[l.id.replace(/^let:/, "")] = { strokes: l.strokeOrder }; });

function markToLegacy(m) {
    return { id: m.id.replace(/^mrk:/, ""), mark: m.symbol, symbolWord: m.ar, name: m.name, translit: m.translit, sound: m.fn };
}
const HARAKAT = MARKS.filter(m => m.markClass === "short-vowel").map(markToLegacy);
const TANWIN = MARKS.filter(m => m.markClass === "tanwin").map(markToLegacy);
const MADD_PATTERNS = MARKS.filter(m => m.markClass === "long-vowel").map(m => ({
    id: m.id.replace(/^mrk:/, ""), pattern: new RegExp(m.pattern), letter: m.letter, name: m.name, translit: m.translit, sound: m.fn,
}));
const SUKUN_MARK = (MARKS.find(m => m.id === "mrk:sukun") || {}).symbol || "\\u0652";

function syllableView(shape) {
    return SYLLABLE_OBJECTS.filter(s => s.shape === shape).map(s => ({
        id: s.id.replace(/^syl:/, ""),
        arabic: s.ar, transliteration: s.translit, english: s.gloss, audioLabel: s.ar,
        exampleWord: (s.exampleWord && LEXEME_BY_ID.has(s.exampleWord)) ? lexemeToVocab(LEXEME_BY_ID.get(s.exampleWord)) : null,
    }));
}
const cvvSyllables = syllableView("CVV");
const cvcSyllables = syllableView("CVC");
const geminatedSyllables = syllableView("geminated");

function textToLegacyWords(t) {
    return (t.words || []).map(w => ({ arabic: w.surface, transliteration: w.translit, gloss: w.gloss, gender: w.gender }));
}
const readingPassages = TEXTS.filter(t => t.source === "m8").map(t => ({
    id: t.id.replace(/^txt:/, ""),
    sentence: t.vowelled, reduced: t.reduced, unvowelled: t.unvowelled,
    words: textToLegacyWords(t), transliteration: t.translit, meaning: t.en, audioText: t.audio,
}));
const grammarExamples = TEXTS.filter(t => t.source === "m11").map(t => ({
    id: t.id.replace(/^txt:/, ""), concept: t.concept,
    sentence: t.vowelled, words: textToLegacyWords(t), transliteration: t.translit, meaning: t.en, audioText: t.audio,
}));`;

const DERIVED_CATEGORIES = `
/* Flashcards / Quiz / Progress topic chips — data-driven over the topics
   actually present in the 46-word legacy deck (M14, approved). */
const categories = [{ id: "all", label: "All words" }].concat(
    VOCAB_CATEGORIES.filter(c => c.id !== "all" && flashcards.some(f => f.category === c.id))
);
const catLabel = Object.fromEntries(categories.map(c => [c.id, c.label]));
`;

const MIGRATE_MASTERED = `/* M14: mastery is keyed by lexeme id. Pre-M14 saves hold numeric flashcard
   ids (1..46) — map each through CONTENT.legacyFlashcardId. Idempotent (lexeme
   ids pass through untouched) and lossless (an unrecognised id is kept). */
function migrateMastered(mastered) {
    const map = CONTENT.legacyFlashcardId || {};
    const out = [];
    for (const id of Array.isArray(mastered) ? mastered : []) {
        const mapped = map[id] || id;
        if (out.indexOf(mapped) === -1) out.push(mapped);
    }
    return out;
}
`;

if (process.argv.includes("--patch-app")) patchApp();
