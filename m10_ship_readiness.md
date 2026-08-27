# M10 Scope: Ship Readiness — Publish to Play Store

**Status:** Draft for review. No code written to `index.html` yet — the feedback-link snippet below is a proposal for your review, not applied. Do not begin implementation until this is approved.

## My approach, in short

- This milestone is infrastructure/distribution, not curriculum — nothing here touches lesson content, data structures, or the pedagogy the M6–M9 discipline was built around.
- Two technical decisions had multiple valid paths; I'm recommending one each rather than leaving them open (per the standing communication rules), with reasoning below.
- Before writing the privacy policy, I verified — not assumed — exactly what this app does with data: grepped for cookies (zero), grepped for any `fetch`/`XMLHttpRequest` (zero), and enumerated every external host the app contacts (exactly two: `fonts.googleapis.com` and `fonts.gstatic.com`). The privacy policy below is grounded in that, not a generic template.
- Deliverables are ordered so each one only depends on what comes before it — hosting has to exist before TWA signing can point at it, which has to exist before Play Console upload.
- Everything requiring money, an external account, or a signing key is explicitly marked as **yours to do** — I'm not able to hold payment details, create accounts on your behalf, or generate signing keys.

## Scope (What Is In)

1. Public hosting recommendation and setup guidance (not a new account created by me).
2. Android packaging approach recommendation (TWA vs. Capacitor) with reasoning.
3. Play Console setup checklist (the $25 fee and account creation are explicitly yours).
4. Privacy policy text, grounded in the app's actual, verified data practices.
5. Play Store listing copy (short + full description).
6. A lightweight feedback channel proposal (code shown, not applied yet).
7. App signing / Digital Asset Links guidance (steps and tools, not code — this is inherently something only you can execute, since it involves a signing key tied to your Play Console identity).

## Out of Scope (will not be implemented, mentioned in code comments, or left as a TODO)

- ❌ Accounts, subscriptions, native audio, grammar lessons, stroke-order — all separate future milestones.
- ❌ Any curriculum/lesson content changes of any kind.
- ❌ iOS/App Store — Android/Play Store only, per your request. (Worth a one-line flag: the same TWA-free PWA already works fine as an iOS home-screen install without a store listing at all, if that's ever wanted — not building toward it now.)

---

## Decision 1 — Hosting: GitHub Pages (recommended)

| Option | Verdict |
|---|---|
| **GitHub Pages** | **Recommended.** The repo already lives on GitHub — zero new account, zero new login, free, and it serves the exact static files already in this repo with no build step (there isn't one to run). Turned on via a repo settings toggle. |
| Netlify / Vercel | Both fine platforms, but they're built around apps with a build pipeline. This app has none — using either would mean creating and maintaining a whole extra service account for no functional benefit over GitHub Pages. |

**One technical detail this affects, already handled:** GitHub Pages serves a repo like this one at a *subpath* (`https://<username>.github.io/arabic/`), not the domain root. `manifest.json`'s `start_url`/`scope` were already written as relative paths (`./index.html`, `./`) back in the PWA groundwork milestone specifically so this would work without changes — confirmed, nothing to redo there.

## Decision 2 — Android packaging: TWA via PWABuilder (recommended)

| Option | Verdict |
|---|---|
| **Trusted Web Activity, built with PWABuilder (pwabuilder.com)** | **Recommended.** This is Google's own intended path for exactly this situation — a PWA-ready static site with no native-only feature needs. PWABuilder generates a signed-ready Android package directly from the hosted URL, reusing the `manifest.json`/`sw.js` already merged. Minimal moving parts. |
| Capacitor | Overkill here — it brings a full native build pipeline (Android Studio, Gradle) for native-plugin access this app doesn't need (no camera beyond the mic API already working fine in a WebView, no push notifications, no filesystem access). More to maintain for zero functional gain. |

---

## Deliverable 2 — Privacy Policy (ready to copy-paste)

Grounded in what was actually verified in this codebase, not a generic template. **Fill in the bracketed contact email before publishing** — I'm not assuming which address you want public-facing.

```markdown
# Privacy Policy — Learn Arabic

Last updated: [DATE]

Learn Arabic ("the app") is designed to work entirely on your device. This
policy describes exactly what happens with your data, in plain language.

## What we collect
We do not collect, transmit, or have access to any of your data. There are
no user accounts, no sign-up, and no server that the app talks to.

## What's stored, and where
Your learning progress (streak, mastered words, completed lessons, daily
goal) and your theme preference (light/dark) are stored using your
browser's local storage, directly on your device. This data:
- never leaves your device,
- is not visible to us or to anyone else,
- can be erased at any time by clearing your browser's site data for
  this app.

## Microphone access
The Pronunciation Practice feature can optionally use your device's
microphone so you can record yourself and play the recording back. This
recording is processed entirely on your device and is never uploaded,
stored remotely, or shared. If you don't grant microphone permission, you
can still use every other part of the app.

## Third-party services
The app loads its Arabic and Latin fonts from Google Fonts
(fonts.googleapis.com and fonts.gstatic.com). Loading a font causes your
browser to make a request to Google's servers, which may receive standard
web request information (such as your IP address) as part of that
request. We do not control this data or receive any of it ourselves. See
Google's privacy policy for details: https://policies.google.com/privacy

No other third-party service is contacted by this app. There are no
analytics, no advertising, no tracking scripts, and no cookies.

## Children's privacy
The app does not collect personal information from anyone, including
children, for the reasons above.

## Changes to this policy
If this policy changes, the "Last updated" date at the top will change
accordingly.

## Contact
Questions about this policy: [YOUR CONTACT EMAIL]
```

## Deliverable 3 — Play Store Listing Copy (ready to copy-paste)

**Short description** (max 80 characters — this is at 78):
```
Learn Arabic letters, vowels, syllables & sentences — free, no account.
```

**Full description** (max 4000 characters):
```
Learn Arabic — Vocabulary Trainer

A focused, ground-up way to learn to read and speak Arabic, built for
English and French speakers.

WHAT'S INSIDE
• The full Arabic alphabet, with letter forms and audio
• Harakāt (vowel marks) — fatḥah, kasrah, ḍammah, sukūn, shaddah, and
  tanwīn — taught from first principles
• Syllables: long vowels, closed syllables, and doubled consonants
• Real sentence reading — fully vowelled, then with progressively fewer
  marks, the way real Arabic text actually looks
• A structured vocabulary Word Bank with flashcards and quizzes
• Letter-writing practice you trace with your finger or mouse
• Pronunciation practice — listen, repeat, and record yourself
• Progress tracking, streaks, and a daily goal
• Dark mode, and works offline once loaded

WHY IT'S DIFFERENT
Every lesson follows the same careful sequence: see the concept, hear it,
practice it, then read it in a real word or sentence — never a rule or a
symbol you haven't been shown first.

No account needed. No ads. No tracking. Your progress stays on your
device.

Currently supports English and French interface languages, with more
planned.
```

## Deliverable 4 — Checklist (yours to perform; guidance provided for each)

Ordered so each step's prerequisites are already done:

1. **[You] Enable GitHub Pages** on this repo (Settings → Pages → deploy from `main`), confirm the app loads correctly at the resulting `https://<username>.github.io/arabic/` URL.
2. **[You] Publish the privacy policy** somewhere public — simplest is adding it as a second page in this same repo (e.g. `privacy.html`) so it's hosted at no extra cost; Play Console requires a URL, not just text.
3. **[You] Create a Google Play Console developer account** (the $25 one-time fee — this has to be you; I can't hold payment details).
4. **[You, with my guidance] Generate the Android package via PWABuilder**: go to pwabuilder.com, enter your GitHub Pages URL, let it validate the manifest/service worker (already in place from the PWA milestone), then use its Android package generator. It will walk you through generating a signing key — **keep that key file and its password somewhere safe; losing it means you can never update the app again under the same listing.**
5. **[You, with my guidance] Digital Asset Links verification**: PWABuilder's flow generates the exact `assetlinks.json` content and tells you where it needs to be hosted. One thing to double-check carefully at this step, not assumed here: whether it needs to sit at your GitHub Pages domain's root `.well-known/` folder or can be scoped under the `/arabic/` subpath — PWABuilder's own guided instructions will give the authoritative answer for your specific setup, since this detail depends on exactly how the domain is configured.
6. **[You] Fill out Play Console's Data Safety form** — based on what's actually verified in this app: declare microphone permission (used locally only, never collected or shared), and declare no other data collection (no accounts, no analytics, no tracking).
7. **[You] Upload the signed package**, paste in the listing copy from Deliverable 3, add the privacy policy URL from step 2, complete the content rating questionnaire (straightforward — no violence, no user-generated content, no data collection).
8. **[You] Add store listing visual assets**: an icon (the existing `icons/icon-512.png` already meets Play Store's 512×512 requirement), a feature graphic (1024×500 — doesn't exist yet, would need to be created), and at least 2 phone screenshots (can be taken directly from the live GitHub Pages URL once hosted).
9. **[You] Submit for review.**

## Deliverable 5 — Feedback Channel (proposed snippet, not yet applied to `index.html`)

Simplest possible option per your ask — a `mailto:` link, reusing the existing `.pill`/`quick-link` button styling already in the app so no new CSS is needed, placed as a new Home-view quick link (matching the existing pattern used for Alphabet/Vocabulary/Flashcards/Quiz):

```html
<button class="quick-link" onclick="window.location.href='mailto:[YOUR CONTACT EMAIL]?subject=Learn%20Arabic%20feedback'">💬<span>Feedback</span></button>
```

This reuses the exact existing `.quick-link` class (zero new CSS) and the same pattern as every other Home quick-link button already in the app. Placement and exact wording are easy to adjust — flagging this as a proposal for your review, per "do not write code yet."

## Open Questions / Risks Flagged (not blockers, just noting before implementation)

- The feature graphic (1024×500) and phone screenshots don't exist yet and aren't something I can generate — screenshots need the live hosted app, and the feature graphic needs actual design work.
- The Digital Asset Links exact hosting path (domain root vs. subpath) needs confirming against PWABuilder's own guidance for your specific GitHub Pages setup — flagged above rather than asserted with false confidence.
- Signing key custody is entirely on your side by necessity — I want to flag this clearly now, before it's needed, rather than at upload time.
