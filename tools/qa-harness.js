#!/usr/bin/env node
/* =============================================================================
   qa-harness.js  —  M14.5 content validation framework: regression battery
   =============================================================================

   DEVELOPMENT / QA-TIME TOOL. Not required by the browser at runtime and
   never fetched or shipped by the app. Codifies, as a repeatable script, the
   manual Playwright QA pass this project has run by hand for every milestone:
   walk every lesson to completion, check for console/page errors, check for
   layout overflow at mobile breakpoints, check lang="ar" coverage, check
   theme switching, and check the app's resilience to storage failures and a
   stale #lesson hash.

   This is advisory regression QA, not a linter over content structure —
   that's `tools/build-content.js --lint`. This harness only observes the
   running app; it is never a code path the shipped app depends on.

   Usage
   -----
     node tools/qa-harness.js
         Runs the full battery against index.html and exits 1 on any failure,
         0 if everything passes. Prints a PASS/FAIL line per check.

     node tools/qa-harness.js --grep <substring>
         Only run checks whose name contains <substring>.

   Requires the `playwright` devDependency (see package.json) with a Chromium
   build available — see PLAYWRIGHT_BROWSERS_PATH in this environment, or run
   `npx playwright install chromium` in one with none pre-installed.
   ============================================================================= */

"use strict";

const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const INDEX_HTML = path.join(ROOT, "index.html");
const APP_URL = "file://" + INDEX_HTML;

const BREAKPOINTS = [320, 375, 390, 768, 1024, 1280];
const NAV_VIEWS = ["home", "learn", "alphabet", "vocabulary", "practice", "progress"];

const args = process.argv.slice(2);
const grepIdx = args.indexOf("--grep");
const grepFilter = grepIdx !== -1 ? args[grepIdx + 1] : null;

/* -------------------------------------------------------------------------- */
/* Small test runner                                                        */
/* -------------------------------------------------------------------------- */
const results = [];
async function check(name, fn) {
    if (grepFilter && !name.includes(grepFilter)) return;
    try {
        await fn();
        results.push({ name, ok: true });
        console.log(`  PASS  ${name}`);
    } catch (e) {
        results.push({ name, ok: false, error: e.message || String(e) });
        console.log(`  FAIL  ${name}`);
        console.log(`        ${(e.message || String(e)).split("\n").join("\n        ")}`);
    }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

/* -------------------------------------------------------------------------- */
/* Page helpers                                                              */
/* -------------------------------------------------------------------------- */
// Fresh context + fresh error collectors per check, so one check's failures
// never leak into the next check's assertions.
async function freshPage(browser, { blockStorage } = {}) {
    const context = await browser.newContext();
    // Abort the Google Fonts request at the Playwright layer instead of
    // letting it hit the real network: this sandbox has no outbound path to
    // it, so an un-intercepted attempt still fails, but only after a long OS
    // connection timeout (~12s per page load, observed) that blocks
    // page.goto's "load" event the whole time. Aborting resolves it near-
    // instantly and produces the identical "Failed to load resource" console
    // message + requestfailed event that assertNoErrors() already reconciles.
    await context.route(EXTERNAL_FONT_RE, (route) => route.abort());
    if (blockStorage) {
        await context.addInitScript(() => {
            const throwing = () => { throw new DOMException("blocked for QA resilience test", "SecurityError"); };
            Object.defineProperty(window, "localStorage", { get: throwing, configurable: true });
        });
    }
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    const failedRequestUrls = [];
    page.on("requestfailed", (req) => failedRequestUrls.push(req.url()));
    page.on("pageerror", (err) => pageErrors.push(err.message || String(err)));
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
    return { context, page, pageErrors, consoleErrors, failedRequestUrls };
}

async function gotoApp(page) {
    await page.goto(APP_URL, { waitUntil: "load" });
    await page.waitForSelector("#view-home:not([hidden])", { timeout: 5000 });
}

const GENERIC_RESOURCE_FAIL_RE = /^Failed to load resource: net::ERR_/;
const EXTERNAL_FONT_RE = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

// index.html links Google Fonts (fonts.googleapis.com / fonts.gstatic.com —
// see index.html's <head>). A real user's browser fetches that fine; this QA
// sandbox's browser process has no outbound network path to reach it, so it
// always fails here — an environment limitation, not an app defect. Console
// and network events aren't guaranteed to arrive in a fixed order, so this
// reconciles the two lists after the fact rather than filtering live: every
// generic "Failed to load resource" console message is matched off against
// an actual failed request to a known-external-font host; anything left
// over (a different message, or more generic failures than known-safe
// requests explain) is treated as real.
function assertNoErrors(pageErrors, consoleErrors, failedRequestUrls, label) {
    assert(pageErrors.length === 0, `${label}: ${pageErrors.length} pageerror(s) — ${pageErrors.join(" | ")}`);

    let safeFontFailures = failedRequestUrls.filter(u => EXTERNAL_FONT_RE.test(u)).length;
    const realErrors = [];
    for (const text of consoleErrors) {
        if (GENERIC_RESOURCE_FAIL_RE.test(text) && safeFontFailures > 0) { safeFontFailures--; continue; }
        realErrors.push(text);
    }
    assert(realErrors.length === 0, `${label}: ${realErrors.length} console.error(s) — ${realErrors.join(" | ")}`);
}

// A step rendered by the M18 exerciseTypes registry (match/cloze/build/order —
// choice reuses renderMCQ and is handled by the generic loop below) wraps
// itself in .exercise-host. Each sub-type resolves its interaction a
// different way; distinguished by markup rather than hardcoding which lesson
// uses which, so this stays correct as the generator emits new items.
// Returns true if it did something (caller should re-check #lessonNextBtn),
// false if there's no exercise-host on this step at all.
async function resolveExerciseHost(page) {
    const host = page.locator("#lessonStepBody .exercise-host");
    if (!(await host.count())) return false;

    // match: pair each left tile with its right-side counterpart via the
    // shared data-i the renderer already assigns — deterministic regardless
    // of shuffle order, and never guesses at a pairing.
    if (await host.locator(".match-tile").count()) {
        for (let guard = 0; guard < 25; guard++) {
            const left = host.locator(".match-tile[data-side='l']:not(.done)").first();
            if (!(await left.count())) break;
            const dataI = await left.getAttribute("data-i");
            await left.click({ force: true });
            await host.locator(`.match-tile[data-side='r'][data-i='${dataI}']`).click({ force: true });
            await page.waitForTimeout(60);
        }
        return true;
    }

    // cloze: one tile click resolves the whole interaction (right or wrong).
    if (await host.locator(".cloze-gap").count()) {
        await host.locator(".tile-bank .tile").first().click({ force: true });
        return true;
    }

    // build / order: both share the same tile-bank -> answer -> Check
    // pattern. Placement order doesn't gate progression — Check resolves
    // the interaction whether the build/order ends up correct or not.
    const checkBtn = host.locator(".exercise-check");
    if (await checkBtn.count()) {
        for (let guard = 0; guard < 25 && (await host.locator(".tile-bank .tile").count()); guard++) {
            await host.locator(".tile-bank .tile").first().click({ force: true });
            await page.waitForTimeout(30);
        }
        await checkBtn.click({ force: true });
        return true;
    }

    return false; // an exercise-host type this harness doesn't yet recognize
}

// Resolve whichever gated interaction the current lesson step exposes
// (a quiz/practice-choice option, a "Reveal Arabic" button, a mid-step
// "Next question →" button, or an M18 exerciseTypes host) without
// hardcoding per-lesson logic — every step renderer that gates
// lessonCanProceed does so through one of these conventions (see renderMCQ /
// renderQuizStep / renderAudioExerciseStep / exerciseTypes.* in index.html).
async function resolveGatedStep(page) {
    for (let i = 0; i < 25; i++) {
        const disabled = await page.locator("#lessonNextBtn").isDisabled().catch(() => true);
        if (!disabled) return;
        if (await resolveExerciseHost(page)) continue;
        const opt = page.locator("#lessonStepBody .quiz-opt:not([disabled])").first();
        if (await opt.count()) { await opt.click(); continue; }
        const reveal = page.locator("#lessonStepBody button.show-btn:not([disabled])").first();
        if (await reveal.count()) { await reveal.click(); continue; }
        const midNext = page.locator("#lessonStepBody button.next-btn").first();
        if (await midNext.count()) { await midNext.click(); continue; }
        return; // nothing left to click — either already proceedable or a step type this harness doesn't yet know
    }
    throw new Error("resolveGatedStep: gave up after 25 clicks without enabling Next");
}

async function walkActiveLessonToCompletion(page, label) {
    for (let step = 0; step < 200; step++) {
        await resolveGatedStep(page);
        const nextHidden = await page.locator("#lessonNextBtn").evaluate(b => getComputedStyle(b).display === "none");
        if (nextHidden) {
            const finish = page.locator("#lessonFinishBtn");
            assert(await finish.count() > 0, `${label}: last step has no #lessonFinishBtn`);
            await finish.click();
            return;
        }
        await page.locator("#lessonNextBtn").click();
    }
    throw new Error(`${label}: did not reach a "complete" step within 200 step advances`);
}

/* -------------------------------------------------------------------------- */
/* Checks                                                                    */
/* -------------------------------------------------------------------------- */
async function main() {
    // This environment ships a pre-installed, non-default Chromium build
    // (headless-shell is not present) — launch it explicitly rather than
    // via Playwright's default resolution.
    const browser = await chromium.launch({ executablePath: chromium.executablePath() });

    await check("app loads with zero console/page errors", async () => {
        const { context, page, pageErrors, consoleErrors, failedRequestUrls } = await freshPage(browser);
        await gotoApp(page);
        assertNoErrors(pageErrors, consoleErrors, failedRequestUrls, "home load");
        await context.close();
    });

    for (const view of NAV_VIEWS) {
        await check(`nav → ${view} view renders with zero console/page errors`, async () => {
            const { context, page, pageErrors, consoleErrors, failedRequestUrls } = await freshPage(browser);
            await gotoApp(page);
            await page.click(`.nav-btn[data-view="${view}"]`);
            await page.waitForSelector(`#view-${view}:not([hidden])`, { timeout: 5000 });
            assertNoErrors(pageErrors, consoleErrors, failedRequestUrls, view);
            await context.close();
        });
    }

    await check("theme toggle switches data-theme with zero new errors", async () => {
        const { context, page, pageErrors, consoleErrors, failedRequestUrls } = await freshPage(browser);
        await gotoApp(page);
        const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
        await page.click("#themeToggle");
        await page.waitForTimeout(250); // let the CSS transition settle before reading state
        const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
        assert(before !== after, `theme did not change (still "${after}")`);
        await page.click("#themeToggle"); // back to original, so later checks in this run see the default
        await page.waitForTimeout(250);
        assertNoErrors(pageErrors, consoleErrors, failedRequestUrls, "theme toggle");
        await context.close();
    });

    for (const width of BREAKPOINTS) {
        await check(`no horizontal overflow at ${width}px (all nav views)`, async () => {
            const { context, page } = await freshPage(browser);
            await page.setViewportSize({ width, height: 900 });
            await gotoApp(page);
            for (const view of NAV_VIEWS) {
                await page.click(`.nav-btn[data-view="${view}"]`);
                await page.waitForSelector(`#view-${view}:not([hidden])`, { timeout: 5000 });
                const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
                assert(overflow <= 1, `${view} @ ${width}px: horizontal overflow of ${overflow}px`);
            }
            await context.close();
        });
    }

    await check("lang/dir coverage — dedicated Arabic content has lang=\"ar\" dir=\"rtl\"", async () => {
        const { context, page } = await freshPage(browser);
        await gotoApp(page);
        // Walk every nav view (not just home) so generated/late-rendered markup is included.
        for (const view of NAV_VIEWS) {
            await page.click(`.nav-btn[data-view="${view}"]`);
            await page.waitForSelector(`#view-${view}:not([hidden])`, { timeout: 5000 });
        }
        const offenders = await page.evaluate(() => {
            const ARABIC_RE = /[؀-ۿ]/g;
            const NON_SPACE_RE = /\S/g;
            const found = [];
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                const text = node.textContent;
                if (!text) continue;
                const arabicChars = (text.match(ARABIC_RE) || []).length;
                if (arabicChars === 0) continue;
                const totalChars = (text.match(NON_SPACE_RE) || []).length;
                // Policy (see UI_BASELINE.md): dedicated Arabic content — where
                // Arabic makes up the majority of the text node — must carry
                // lang="ar" dir="rtl". A short Arabic term or phrase cited
                // inline within otherwise-English prose (a grammar rule, a
                // curriculum blurb) is deliberately left unmarked — wrapping a
                // substring mid-sentence is a different, riskier class of edit
                // than tagging a whole dedicated-Arabic element, and this
                // project has consistently chosen not to do it. Only the
                // majority case is a real coverage gap.
                if (arabicChars / totalChars < 0.5) continue;
                const el = node.parentElement;
                const langEl = el && el.closest("[lang]");
                if (langEl && langEl.lang === "ar" && langEl.closest("[dir='rtl']")) continue;
                found.push(text.trim().slice(0, 40));
            }
            return found;
        });
        assert(offenders.length === 0, `${offenders.length} dedicated-Arabic text node(s) missing lang="ar" dir="rtl" — e.g. "${offenders[0]}"`);
        await context.close();
    });

    await check("localStorage-throwing resilience — app still renders home", async () => {
        const { context, page, pageErrors } = await freshPage(browser, { blockStorage: true });
        await gotoApp(page);
        assert(pageErrors.length === 0, `${pageErrors.length} pageerror(s) with localStorage blocked — ${pageErrors.join(" | ")}`);
        await context.close();
    });

    await check("stale #lesson hash falls back to home instead of a broken shell", async () => {
        const { context, page, pageErrors } = await freshPage(browser);
        await page.goto(APP_URL + "#lesson", { waitUntil: "load" });
        await page.waitForSelector("#view-home:not([hidden])", { timeout: 5000 });
        const lessonHidden = await page.locator("#view-lesson").isHidden();
        assert(lessonHidden, "view-lesson is visible with no activeLesson set");
        assert(pageErrors.length === 0, `${pageErrors.length} pageerror(s) on stale #lesson hash — ${pageErrors.join(" | ")}`);
        await context.close();
    });

    await check("mid-lesson reload does not crash", async () => {
        const { context, page, pageErrors } = await freshPage(browser);
        await gotoApp(page);
        const catalogId = await page.evaluate(() => Object.keys(lessons)[0]);
        await page.evaluate((id) => startLesson(id), catalogId);
        await page.waitForSelector("#view-lesson:not([hidden])", { timeout: 5000 });
        await page.reload({ waitUntil: "load" });
        await page.waitForSelector("#view-home:not([hidden])", { timeout: 5000 });
        assert(pageErrors.length === 0, `${pageErrors.length} pageerror(s) across mid-lesson reload — ${pageErrors.join(" | ")}`);
        await context.close();
    });

    // Walk every catalog lesson, and every "available" curriculum generate
    // lesson, to completion. Each lesson gets its own page so one bad lesson
    // can't take out the rest of the run.
    const { context: probeCtx, page: probePage } = await freshPage(browser);
    await gotoApp(probePage);
    const lessonIds = await probePage.evaluate(() => Object.keys(lessons));
    const curriculumGenIds = await probePage.evaluate(() => {
        const cur = (typeof CURRICULUM !== "undefined" && CURRICULUM.lessons) || [];
        return cur.filter(l => l.source === "generate" && l.status === "available").map(l => l.id);
    });
    await probeCtx.close();

    for (const id of lessonIds) {
        await check(`catalog lesson "${id}" walks to completion`, async () => {
            const { context, page, pageErrors } = await freshPage(browser);
            await gotoApp(page);
            await page.evaluate((lid) => startLesson(lid), id);
            await page.waitForSelector("#view-lesson:not([hidden])", { timeout: 5000 });
            await walkActiveLessonToCompletion(page, id);
            assert(pageErrors.length === 0, `${pageErrors.length} pageerror(s) walking "${id}" — ${pageErrors.join(" | ")}`);
            await context.close();
        });
    }

    for (const id of curriculumGenIds) {
        await check(`generated curriculum lesson "${id}" walks to completion`, async () => {
            const { context, page, pageErrors } = await freshPage(browser);
            await gotoApp(page);
            await page.evaluate((nid) => startCurriculumLesson(nid), id);
            await page.waitForSelector("#view-lesson:not([hidden])", { timeout: 5000 });
            await walkActiveLessonToCompletion(page, id);
            assert(pageErrors.length === 0, `${pageErrors.length} pageerror(s) walking "${id}" — ${pageErrors.join(" | ")}`);
            await context.close();
        });
    }

    await browser.close();

    const failed = results.filter(r => !r.ok);
    console.log("");
    console.log(`${results.length} check(s), ${results.length - failed.length} passed, ${failed.length} failed.`);
    process.exit(failed.length ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
