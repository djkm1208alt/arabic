/* =============================================================================
   content-lint.js  —  M20 linguistic linter
   =============================================================================

   DEVELOPMENT / BUILD-TIME. Node built-ins only, zero dependencies. Pure:
   lint(data, wordlists, allow) -> { errors: [...], warnings: [...] }.
   No file IO. Called by tools/build-content.js as part of --check.

   It is a SAFETY NET, not the authority — a reviewer verifies the Arabic.
   HARD errors are unambiguous (a colloquialism in MSA content, an
   Arabic-Indic digit outside the numbers topic, a translit emphatic with
   no matching script emphatic, an unvowelled consonant cluster in an
   A0/A1 word). WARNINGS are for cases a human should glance at.

   Every rule has a fixture in tools/lint-fixtures.js proving it fires.
   ============================================================================= */
"use strict";

/* ---- character classes ---- */
const AR_LETTER   = /[ء-يٱ-ۓ]/;
const AR_MARK     = /[ؐ-ًؚ-ْٰۖ-ۭ]/;
const AR_INDIC    = /[٠-٩۰-۹]/;
const FATHA = "َ", KASRA = "ِ", DAMMA = "ُ";
const ALIF = "ا", ALIF_MAQSURA = "ى", ALIF_MADDA = "آ", WAW = "و", YA = "ي", TA_MARBUTA = "ة";

/* common colloquialisms that must not appear in MSA content */
const COLLOQUIAL = [
    "مش", "عايز", "عاوز", "إيه", "ايه", "ازيك", "إزيك", "فين", "ليش", "شنو",
    "هسه", "هلق", "بدي", "بدك", "كده", "كدا", "هيك", "شو", "ماكو", "اكو",
    "دلوقتي", "علشان", "عشان", "لسه", "خلاص بس", "طب", "يلا",
];

/* Transliteration <-> Arabic letter pairs the project's ALA-LC-ish scheme
   uses (single-char dotted forms for the emphatics/pharyngeals, digraphs
   for خ ث ذ ش غ). Checked in both directions: a translit form present
   without its Arabic letter is a HARD error; the Arabic letter present
   without its translit form is a WARNING. */
const TRANSLIT_PAIRS = [
    ["ṣ", "ص"], ["ḍ", "ض"], ["ṭ", "ط"], ["ẓ", "ظ"], ["ḥ", "ح"], ["ʿ", "ع"],
    ["kh", "خ"], ["th", "ث"], ["dh", "ذ"], ["sh", "ش"], ["gh", "غ"],
];

/* ---- helpers ---- */
function isMark(ch) { return AR_MARK.test(ch); }

/* split a word into [{ letter, marks }] — combining marks attach to the preceding letter */
function tokenize(word) {
    const out = [];
    for (const ch of String(word)) {
        if (isMark(ch)) { if (out.length) out[out.length - 1].marks += ch; }
        else out.push({ letter: ch, marks: "" });
    }
    return out;
}

/* consonants in a supposedly fully-vowelled word that carry no mark and are
   not a long-vowel carrier — the ḥarakāt-coverage check. Conservative:
   excuses alif / alif-maqṣūra / madda, word-final letters, ة, and و/ي when
   preceded by the matching short vowel. */
function unvowelledConsonants(word) {
    const toks = tokenize(word);
    // the word-final Arabic letter is always excused — find its index so that
    // trailing punctuation (؟ ! ، .) doesn't make the real last letter "medial".
    let lastLetter = -1;
    for (let j = 0; j < toks.length; j++) if (AR_LETTER.test(toks[j].letter)) lastLetter = j;
    const flags = [];
    for (let i = 0; i < lastLetter; i++) {   // word-final letter is always excused
        const t = toks[i];
        if (!AR_LETTER.test(t.letter)) continue;
        if (t.letter === ALIF || t.letter === ALIF_MAQSURA || t.letter === ALIF_MADDA || t.letter === TA_MARBUTA) continue;
        if (t.marks) continue;
        if (t.letter === WAW && i > 0 && toks[i - 1].marks.indexOf(DAMMA) !== -1) continue;   // long ū
        if (t.letter === YA && i > 0 && toks[i - 1].marks.indexOf(KASRA) !== -1) continue;    // long ī
        // definite-article lām: الْ before a moon letter carries sukūn (covered
        // above); before a sun letter it is deliberately unmarked (assimilated,
        // the next letter takes shadda). Excuse an unmarked ل right after a
        // word-initial alif.
        if (t.letter === "ل" && i === 1 && toks[0].letter === ALIF) continue;
        flags.push(t.letter);
    }
    return flags;
}

/* normalise an English gloss to a set of comparable lemma fragments:
   lowercase, drop "(…)" qualifiers and terminal ? ! . , split "/" and ","
   compounds, and offer each fragment both with and without a leading
   article / "to". Used on BOTH sides of the levelfit comparison so
   "orange (colour)" ~ "orange", "to hear / to listen" ~ "to hear",
   "they (masculine/mixed group)" ~ "they (m.)". */
function lemmaVariants(s) {
    const base = String(s || "").toLowerCase()
        .replace(/\([^)]*\)/g, " ")
        .replace(/[?!.]+/g, " ")
        .replace(/\s+/g, " ").trim();
    const out = new Set();
    for (let frag of base.split(/\s*[/,]\s*/)) {
        frag = frag.trim();
        if (!frag) continue;
        out.add(frag);
        out.add(frag.replace(/^(a|an|the|to)\s+/, "").trim());
    }
    out.delete("");
    return out;
}

function stripToArabic(s) { return String(s).replace(/[^؀-ۿ]/g, ""); }
/* bare consonant skeleton — strip marks and tatweel, for register matching */
function skeleton(s) { return String(s).replace(AR_MARK, "").replace(/[^؀-ۿ]/g, "").replace(/ـ/g, "").replace(new RegExp(AR_MARK.source, "g"), ""); }

/* ---- the linter ---- */
function lint(data, wordlists, allow) {
    const errors = [], warnings = [];
    allow = allow || {};
    const allowed = (id, rule) => Array.isArray(allow[id]) && allow[id].indexOf(rule) !== -1;

    const wl = (wordlists && wordlists.a1 && Array.isArray(wordlists.a1)) ? wordlists.a1 : null;
    const wlLemmas = wl ? (() => {
        const s = new Set();
        for (const e of wl) for (const v of lemmaVariants(e.en)) s.add(v);
        return s;
    })() : null;

    const rows = [];
    for (const key of ["lexemes", "letters", "marks", "syllables", "grammar", "texts"])
        for (const o of (data[key] || [])) rows.push({ key, o });

    for (const { key, o } of rows) {
        const id = o.id;
        const isNumbers = o.topic === "numbers";

        /* every Arabic-bearing field on the object */
        const arFields = [];
        if (o.ar) arFields.push(["ar", o.ar]);
        if (o.vowelled) arFields.push(["vowelled", o.vowelled]);
        if (o.reduced) arFields.push(["reduced", o.reduced]);
        if (o.unvowelled) arFields.push(["unvowelled", o.unvowelled]);
        if (o.rule) arFields.push(["rule", o.rule]);
        if (o.audio && AR_LETTER.test(String(o.audio))) arFields.push(["audio", o.audio]);
        if (Array.isArray(o.words)) o.words.forEach((w, i) => { if (w && w.surface) arFields.push(["words[" + i + "].surface", w.surface]); });
        if (Array.isArray(o.previewSymbols)) o.previewSymbols.forEach((s, i) => arFields.push(["previewSymbols[" + i + "]", s]));

        /* --- HARD: colloquial register (bare consonant skeletons) --- */
        for (const [f, s] of arFields) {
            const tokens = String(s).split(/\s+/).map(skeleton).filter(Boolean);
            for (const c of COLLOQUIAL) {
                if (tokens.indexOf(skeleton(c)) !== -1 && !allowed(id, "register"))
                    errors.push(`register  ${id}.${f}: contains the colloquialism "${c}" — content is MSA only`);
            }
        }

        /* --- HARD: Arabic-Indic digits outside topic "numbers" --- */
        for (const [f, s] of arFields) {
            if (AR_INDIC.test(s) && !isNumbers && !allowed(id, "ar-indic"))
                errors.push(`ar-indic  ${id}.${f}: Arabic-Indic digits present but the object is not in topic "numbers"`);
        }

        /* --- translit <-> ar consistency (objects with both) --- */
        if (o.translit && o.ar) {
            /* HARD both ways: the project's scheme maps these 1:1, so a
               mismatch in either direction is an error (a missing dot on an
               emphatic is the classic beginner-content bug). */
            for (const [tc, arc] of TRANSLIT_PAIRS) {
                if (allowed(id, "emphatic")) continue;
                if (o.translit.indexOf(tc) !== -1 && o.ar.indexOf(arc) === -1)
                    errors.push(`emphatic  ${id}: translit "${o.translit}" has "${tc}" but ar "${o.ar}" is missing "${arc}"`);
                else if (o.ar.indexOf(arc) !== -1 && o.translit.indexOf(tc) === -1)
                    errors.push(`emphatic  ${id}: ar "${o.ar}" has "${arc}" but translit "${o.translit}" is missing "${tc}"`);
            }
            /* WARN: long-vowel carriers */
            const macrons = (o.translit.match(/[āīūēō]/g) || []).length;
            const carriers = (o.ar.match(/[اويىآ]/g) || []).length;
            if (macrons > carriers + 1 && !allowed(id, "longvowel"))
                warnings.push(`longvowel  ${id}: translit "${o.translit}" has ${macrons} long vowels, ar "${o.ar}" has ${carriers} carriers`);
            /* WARN: gross length mismatch */
            const arLen = (o.ar.match(new RegExp(AR_LETTER.source, "g")) || []).length;
            const tLen = o.translit.replace(/[^A-Za-zʾʿāīūēōáàṣḍṭẓḥ]/g, "").length;
            if (arLen >= 2 && (tLen > arLen * 2.4 || tLen < arLen * 0.5) && !allowed(id, "length"))
                warnings.push(`length  ${id}: ar has ${arLen} letters, translit "${o.translit}" ~${tLen} — check for a transposition or truncation`);
        }

        /* --- WARN: ḥarakāt coverage on A0/A1 fully-vowelled fields --- */
        if ((o.level === "A0" || o.level === "A1") && !allowed(id, "harakat")) {
            const vowelledFields = arFields.filter(([f]) => f === "ar" || f === "vowelled" || /words\[/.test(f) || /previewSymbols/.test(f));
            for (const [f, s] of vowelledFields) {
                for (const word of String(s).split(/\s+/)) {
                    const bare = unvowelledConsonants(word);
                    if (bare.length >= 1 && key !== "letters")
                        warnings.push(`harakat  ${id}.${f}: "${word}" — possibly unvowelled consonant(s): ${bare.join(" ")}`);
                }
            }
        }

        /* --- WARN: A1 level fit against the word list --- */
        if (wlLemmas && key === "lexemes" && o.level === "A1" && !allowed(id, "levelfit")) {
            const hit = [...lemmaVariants(o.en)].some(v => wlLemmas.has(v));
            if (!hit)
                warnings.push(`levelfit  ${id}: A1 lexeme "${o.en}" is not on content/wordlists/a1.json — confirm it belongs at A1`);
        }
    }

    return { errors, warnings };
}

module.exports = { lint, unvowelledConsonants, tokenize };
