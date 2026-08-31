#!/usr/bin/env node
/* =============================================================================
   a11y-audit.js  —  M14.1 UI baseline: touch-target + contrast audit
   =============================================================================

   DEVELOPMENT / QA-TIME TOOL. Not required by the browser at runtime and
   never fetched or shipped by the app. Audits the *existing* UI against two
   WCAG success criteria across every nav view, both themes, and the six
   breakpoints this project already tests at (320/375/390/768/1024/1280):

     - WCAG 2.5.5 (Target Size, AAA — used here as a baseline floor): every
       interactive control's rendered box is >= 44x44 CSS px.
     - WCAG 1.4.3 (Contrast, AA): text is >= 4.5:1 against its true rendered
       background (large text/UI components >= 3:1).

   Contrast is measured by alpha-compositing each element's own background
   down through its ancestors to the real page backdrop — a raw computed
   rgba() read is not the true rendered color when any layer has alpha < 1,
   which produced a false low-contrast reading earlier in this project's own
   QA history. This audit also waits past this app's 0.3s theme-transition
   CSS before measuring, for the same reason.

   This is advisory QA, not a linter over content or a code path the shipped
   app depends on — see tools/qa-harness.js for the regression battery this
   audit's checks feed into (M14.5).

   Usage
   -----
     node tools/a11y-audit.js
         Runs the full audit and exits 1 if any check fails, 0 otherwise.
         Prints a summary; full detail is written to
         content/m14.1-a11y-review.md by the caller (see that file's header).
   ============================================================================= */

"use strict";

const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const APP_URL = "file://" + path.join(ROOT, "index.html");

const BREAKPOINTS = [320, 375, 390, 768, 1024, 1280];
const THEMES = ["light", "dark"];
const NAV_VIEWS = ["home", "learn", "alphabet", "vocabulary", "practice", "progress"];
const MIN_TARGET_PX = 44;
const MIN_CONTRAST_NORMAL = 4.5;
const MIN_CONTRAST_LARGE = 3.0;
// WCAG's "large text" cutoff: >=24px, or >=18.66px (14pt) if bold.
const LARGE_TEXT_PX = 24;
const LARGE_TEXT_BOLD_PX = 18.66;

async function main() {
    const browser = await chromium.launch({ executablePath: chromium.executablePath() });
    const context = await browser.newContext();
    await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort());
    const page = await context.newPage();

    const findings = { touchTargets: [], contrast: [] };
    let checkedTargets = 0, checkedText = 0;

    for (const theme of THEMES) {
        for (const width of BREAKPOINTS) {
            await page.setViewportSize({ width, height: 900 });
            await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
            await page.waitForSelector("#view-home:not([hidden])", { timeout: 5000 });
            if (theme === "dark") {
                await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
                await page.waitForTimeout(350); // past the 0.3s CSS background/color transition
            }

            for (const view of NAV_VIEWS) {
                await page.click(`.nav-btn[data-view="${view}"]`);
                await page.waitForSelector(`#view-${view}:not([hidden])`, { timeout: 5000 });

                const result = await page.evaluate(({ MIN_TARGET_PX, MIN_CONTRAST_NORMAL, MIN_CONTRAST_LARGE, LARGE_TEXT_PX, LARGE_TEXT_BOLD_PX }) => {
                    function parseColor(str) {
                        const m = str.match(/rgba?\(([^)]+)\)/);
                        if (!m) return null;
                        const parts = m[1].split(",").map(s => parseFloat(s.trim()));
                        return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
                    }
                    // Composite `fg` (with alpha) over `bg` (opaque) -> opaque color.
                    function composite(fg, bg) {
                        const a = fg.a;
                        return {
                            r: fg.r * a + bg.r * (1 - a),
                            g: fg.g * a + bg.g * (1 - a),
                            b: fg.b * a + bg.b * (1 - a),
                            a: 1,
                        };
                    }
                    // Walk from `el` up through ancestors, compositing every
                    // partially/fully-opaque background down onto a base
                    // white canvas, so the result is what a viewer actually sees.
                    function effectiveBackground(el) {
                        const chain = [];
                        let node = el;
                        while (node) {
                            const bg = parseColor(getComputedStyle(node).backgroundColor);
                            if (bg && bg.a > 0) chain.push(bg);
                            node = node.parentElement;
                        }
                        chain.reverse(); // outermost first
                        let acc = { r: 255, g: 255, b: 255, a: 1 }; // page canvas default
                        for (const layer of chain) acc = composite(layer, acc);
                        return acc;
                    }
                    function relLuminance(c) {
                        const chan = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
                        return 0.2126 * chan(c.r) + 0.7152 * chan(c.g) + 0.0722 * chan(c.b);
                    }
                    function contrastRatio(c1, c2) {
                        const l1 = relLuminance(c1), l2 = relLuminance(c2);
                        const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
                        return (hi + 0.05) / (lo + 0.05);
                    }
                    function isVisible(el) {
                        const r = el.getBoundingClientRect();
                        if (r.width === 0 || r.height === 0) return false;
                        const cs = getComputedStyle(el);
                        return cs.visibility !== "hidden" && cs.display !== "none";
                    }

                    const targetFindings = [];
                    const activeView = document.querySelector(".view:not([hidden])");
                    if (activeView) {
                        const interactive = activeView.querySelectorAll("button, a[href], [role='button'], input, select");
                        for (const el of interactive) {
                            if (!isVisible(el)) continue;
                            // offsetWidth/offsetHeight (the rounded border-box
                            // layout size — what min-width/min-height actually
                            // guarantee) rather than getBoundingClientRect,
                            // which can read ~1px under a flex item's true
                            // layout size inside a scrollable (overflow-x:auto)
                            // flex row due to Chromium sub-pixel positioning —
                            // a measurement artifact, not a real target-size
                            // defect (see UI_BASELINE.md).
                            const w = el.offsetWidth, h = el.offsetHeight;
                            if (w < MIN_TARGET_PX || h < MIN_TARGET_PX) {
                                targetFindings.push({
                                    selector: el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : ""),
                                    width: w,
                                    height: h,
                                    text: (el.textContent || "").trim().slice(0, 30),
                                });
                            }
                        }
                    }

                    const contrastFindings = [];
                    let textNodeCount = 0;
                    if (activeView) {
                        const walker = document.createTreeWalker(activeView, NodeFilter.SHOW_TEXT, {
                            acceptNode: (n) => (n.textContent && n.textContent.trim()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
                        });
                        let node;
                        // Color emoji render from the font's own embedded
                        // palette, not the CSS `color` property — a node that
                        // is emoji only (once whitespace is stripped) has no
                        // meaningful "text color vs background" contrast to
                        // measure, so it's excluded rather than reported as an
                        // uncontrollable false positive. A node that mixes an
                        // emoji with real text (e.g. "🔀 Shuffle") keeps the
                        // real-text portion checked.
                        const EMOJI_RE = /\p{Extended_Pictographic}|️|‍/gu;
                        while ((node = walker.nextNode())) {
                            const el = node.parentElement;
                            if (!el || !isVisible(el)) continue;
                            textNodeCount++;
                            if (node.textContent.replace(EMOJI_RE, "").trim() === "") continue;
                            const cs = getComputedStyle(el);
                            const fg = parseColor(cs.color);
                            if (!fg) continue;
                            const bg = effectiveBackground(el);
                            const ratio = contrastRatio(fg, bg);
                            const fontPx = parseFloat(cs.fontSize);
                            const isBold = parseInt(cs.fontWeight, 10) >= 700;
                            const isLarge = fontPx >= LARGE_TEXT_PX || (isBold && fontPx >= LARGE_TEXT_BOLD_PX);
                            const min = isLarge ? MIN_CONTRAST_LARGE : MIN_CONTRAST_NORMAL;
                            if (ratio < min) {
                                contrastFindings.push({
                                    text: node.textContent.trim().slice(0, 30),
                                    ratio: Math.round(ratio * 100) / 100,
                                    min,
                                    tag: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : ""),
                                });
                            }
                        }
                    }

                    return { targetFindings, contrastFindings, targetCount: activeView ? activeView.querySelectorAll("button, a[href], [role='button'], input, select").length : 0, textNodeCount };
                }, { MIN_TARGET_PX, MIN_CONTRAST_NORMAL, MIN_CONTRAST_LARGE, LARGE_TEXT_PX, LARGE_TEXT_BOLD_PX });

                checkedTargets += result.targetCount;
                checkedText += result.textNodeCount;
                for (const f of result.targetFindings) findings.touchTargets.push({ theme, width, view, ...f });
                for (const f of result.contrastFindings) findings.contrast.push({ theme, width, view, ...f });
            }
        }
    }

    await browser.close();

    console.log(`Checked ${checkedTargets} interactive-control renders and ${checkedText} text-node renders across ${THEMES.length} themes x ${BREAKPOINTS.length} breakpoints x ${NAV_VIEWS.length} views.`);
    console.log("");
    if (findings.touchTargets.length) {
        console.log(`Touch-target findings (< ${MIN_TARGET_PX}x${MIN_TARGET_PX}px): ${findings.touchTargets.length}`);
        const seen = new Set();
        for (const f of findings.touchTargets) {
            const key = f.selector + f.text;
            if (seen.has(key)) continue;
            seen.add(key);
            console.log(`  ! [${f.theme} @ ${f.width}px, ${f.view}] ${f.selector} "${f.text}" — ${f.width}x${f.height}px`);
        }
    } else {
        console.log(`Touch targets: clean — every interactive control is >= ${MIN_TARGET_PX}x${MIN_TARGET_PX}px.`);
    }
    console.log("");
    if (findings.contrast.length) {
        console.log(`Contrast findings (below WCAG AA): ${findings.contrast.length}`);
        const seen = new Set();
        for (const f of findings.contrast) {
            const key = f.tag + f.text;
            if (seen.has(key)) continue;
            seen.add(key);
            console.log(`  ! [${f.theme} @ ${f.width}px, ${f.view}] ${f.tag} "${f.text}" — ${f.ratio}:1 (needs ${f.min}:1)`);
        }
    } else {
        console.log("Contrast: clean — every measured text node meets WCAG AA against its true rendered background.");
    }

    process.exitCode = (findings.touchTargets.length || findings.contrast.length) ? 1 : 0;
}

main().catch(e => { console.error(e); process.exit(1); });
