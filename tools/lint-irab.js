#!/usr/bin/env node
/* =============================================================================
   lint-irab.js  —  M27.0 SPIKE (WIP, NOT FOR MERGE)
   =============================================================================
   Validates `iʿrab` annotation arrays (the optional field the parse engine
   grades from) against the controlled enums. Standalone so the spike drops
   cleanly; the real milestone folds these checks into tools/content-lint.js
   and tools/lint-fixtures.js per m27.0_parse-engine_scope.md §6.

   Node built-ins only. Run:
     node tools/lint-irab.js              lint content/texts.json (a no-op today —
                                          nothing is annotated, by design)
     node tools/lint-irab.js --fixtures   the broken/fixed fixture suite
   ============================================================================= */
"use strict";

const IRAB_ROLES = [
    "mubtada", "khabar", "fiʿl", "faʿil", "naʾib-faʿil", "mafʿul-bih", "mudaf-ilayh",
    "naʿt", "jarr-majrur", "harf", "ism-inna", "khabar-inna", "ism-kana", "khabar-kana",
];
const IRAB_CASES = ["raf", "nasb", "jarr", "jazm", "mabni"];
const IRAB_MARKERS = [
    "damma", "fatha", "kasra", "sukun", "waw", "alif", "ya",
    "nun", "hadhf-nun", "hadhf-illa",
    "damma-muqaddara", "fatha-muqaddara", "kasra-muqaddara", "na",
];

/* Validate one entry's `iʿrab` array.
   entry: { id?, words?, sentence?, textType?, iʿrab }
   resolveObj: optional (id) => truthy when a gr: id exists.
   Returns an array of error strings; empty means clean (absent field = clean). */
function lintIrabEntry(entry, resolveObj) {
    const errs = [];
    const ann = entry["iʿrab"];
    if (ann === undefined) return errs;                       // additive — absent is fine
    const id = entry.id || "(anon)";
    if (!Array.isArray(ann)) return [`${id}: iʿrab must be an array`];
    if (entry.textType && entry.textType !== "sentence") {
        errs.push(`${id}: iʿrab v1 supports textType "sentence" only (got "${entry.textType}")`);
    }
    const nWords = Array.isArray(entry.words) ? entry.words.length
        : (entry.sentence ? String(entry.sentence).trim().split(/\s+/).length : null);

    const seen = new Set();
    ann.forEach((a, i) => {
        const at = `${id}.iʿrab[${i}]`;
        if (typeof a.w !== "number" || a.w < 0 || !Number.isInteger(a.w) || (nWords != null && a.w >= nWords)) {
            errs.push(`${at}: w=${JSON.stringify(a.w)} out of range (0..${nWords == null ? "?" : nWords - 1})`);
        }
        if (seen.has(a.w)) errs.push(`${at}: duplicate annotation for word ${a.w}`);
        seen.add(a.w);

        if (!IRAB_ROLES.includes(a.role)) errs.push(`${at}: role "${a.role}" not in IRAB_ROLES`);
        if (!IRAB_CASES.includes(a["case"])) errs.push(`${at}: case "${a["case"]}" not in IRAB_CASES`);
        if (!IRAB_MARKERS.includes(a.marker)) errs.push(`${at}: marker "${a.marker}" not in IRAB_MARKERS`);

        // `na` is the marker iff the word is mabni
        if ((a.marker === "na") !== (a["case"] === "mabni")) {
            errs.push(`${at}: marker "na" must pair with case "mabni" and vice versa`);
        }
        // mahall: present only for a mabni word, and itself a case value
        if (a.mahall != null && a["case"] !== "mabni") {
            errs.push(`${at}: mahall must be null unless case is "mabni"`);
        }
        if (a.mahall != null && !IRAB_CASES.includes(a.mahall)) {
            errs.push(`${at}: mahall "${a.mahall}" not in IRAB_CASES`);
        }
        // obj: optional, must be a gr: id and (when resolvable) resolve
        if (a.obj != null) {
            if (!/^gr:/.test(String(a.obj))) errs.push(`${at}: obj "${a.obj}" must be a gr: id`);
            else if (resolveObj && !resolveObj(a.obj)) errs.push(`${at}: obj "${a.obj}" does not resolve`);
        }
    });
    return errs;
}

function lintIrab(texts, resolveObj) {
    const errs = [];
    for (const t of texts || []) errs.push(...lintIrabEntry(t, resolveObj));
    return errs;
}

module.exports = { lintIrab, lintIrabEntry, IRAB_ROLES, IRAB_CASES, IRAB_MARKERS };

/* ---------------------------------------------------------------------------- */
if (require.main === module) {
    const fs = require("fs");
    const path = require("path");
    const ROOT = path.resolve(__dirname, "..");

    if (process.argv.includes("--fixtures")) {
        const base = { id: "t", words: ["a", "b", "c"] };
        const BROKEN = [
            { name: "w out of range",       ann: [{ w: 9, role: "mubtada", "case": "raf", marker: "damma" }],                          expect: /out of range/ },
            { name: "bad role",             ann: [{ w: 0, role: "nonsense", "case": "raf", marker: "damma" }],                         expect: /not in IRAB_ROLES/ },
            { name: "bad case",             ann: [{ w: 0, role: "mubtada", "case": "xx", marker: "damma" }],                           expect: /not in IRAB_CASES/ },
            { name: "bad marker",           ann: [{ w: 0, role: "mubtada", "case": "raf", marker: "zz" }],                             expect: /not in IRAB_MARKERS/ },
            { name: "na without mabni",     ann: [{ w: 0, role: "fiʿl", "case": "raf", marker: "na" }],                                expect: /marker "na" must pair/ },
            { name: "mabni without na",     ann: [{ w: 0, role: "fiʿl", "case": "mabni", marker: "sukun" }],                          expect: /marker "na" must pair/ },
            { name: "mahall on non-mabni",  ann: [{ w: 0, role: "mubtada", "case": "raf", marker: "damma", mahall: "raf" }],           expect: /mahall must be null/ },
            { name: "duplicate word",       ann: [{ w: 0, role: "mubtada", "case": "raf", marker: "damma" }, { w: 0, role: "khabar", "case": "raf", marker: "damma" }], expect: /duplicate annotation/ },
            { name: "obj not a gr: id",     ann: [{ w: 0, role: "mubtada", "case": "raf", marker: "damma", obj: "txt:x" }],            expect: /must be a gr: id/ },
        ];
        let pass = 0, fail = 0;
        for (const f of BROKEN) {
            const e = lintIrabEntry(Object.assign({}, base, { "iʿrab": f.ann }));
            if (e.some(x => f.expect.test(x))) pass++;
            else { fail++; console.log(`FAIL  ${f.name}\n      got: ${JSON.stringify(e)}`); }
        }
        const clean = lintIrabEntry(Object.assign({}, base, {
            "iʿrab": [
                { w: 0, role: "mubtada", "case": "raf", marker: "damma" },
                { w: 1, role: "mudaf-ilayh", "case": "jarr", marker: "kasra" },
                { w: 2, role: "fiʿl", "case": "mabni", marker: "na", mahall: null },
            ],
        }));
        if (clean.length === 0) pass++;
        else { fail++; console.log(`FAIL  clean fixture\n      got: ${JSON.stringify(clean)}`); }

        console.log(`\niʿrab fixtures: ${pass} passed, ${fail} failed`);
        process.exit(fail ? 1 : 0);
    }

    let texts = [];
    try { texts = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "texts.json"), "utf8")); }
    catch (e) { console.error("cannot read content/texts.json:", e.message); process.exit(1); }
    const errs = lintIrab(texts);
    if (errs.length) { errs.forEach(e => console.log("  " + e)); process.exit(1); }
    const annotated = texts.filter(t => t["iʿrab"]).length;
    console.log(`iʿrab lint: ${texts.length} texts checked, ${annotated} annotated, no errors`);
}
