# M19 · review & retention preview

**This is the M19 sign-off gate.** The SM-2-lite scheduler, the six-state lifecycle, the review queues, and the `deriveLevel` change are drafted below. Review, then approve — the `#view-review` runner UI is on hold until you do.

---

## 1. The scheduler — isolated, deterministic, replaceable

`scheduler` is a **frozen object with one method**, `next(state, quality, nowISO)`. It reads no globals, mutates nothing, and never touches a clock (`nowISO` is passed in). Everything SM-2-lite lives here — nowhere else in the review system does interval arithmetic. Swapping it for FSRS or anything better is a one-file change.

```
state    = { reps, ease, intervalD, lapses }
returns  = { reps, ease, intervalD, lapses, dueDate }
```

## 2. Grading — correctness first, latency bounded & secondary

`gradeQuality(correct, latencyMs)` is deterministic:

| correct? | latency | quality |
|---|---|---|
| no | *any* | `again` |
| yes | ≤ 3s | `easy` |
| yes | ≥ 20s | `hard` |
| yes | in between, or unknown | `good` |

**Safeguard:** only `correct: false` produces `again`. A slow-but-correct answer (`hard`) still increments `reps`, never adds a lapse, and **never shortens the interval** — it just takes a more conservative forward step. Verified:

| from `{reps:3, ease:2.5, interval:30, lapses:1}` | reps | ease | interval | lapses |
|---|---|---|---|---|
| answered **slowly but correct** (`hard`) | 4 | 2.45 | 36 | 1 |
| answered **wrong** (`again`) | 0 | 2.3 | 1 | 2 |

## 3. Interval schedule — a worked sequence

Starting from nothing, answering `good` each time (`nowISO` = the previous due date):

| answer | reps | ease | interval (days) | due |
|---|---|---|---|---|
| `good` | 1 | 2.5 | 1 | +1d |
| `good` | 2 | 2.5 | 4 | +4d |
| `good` | 3 | 2.5 | 10 | +10d |
| `good` | 4 | 2.5 | 25 | +25d |
| `hard` | 5 | 2.45 | 30 | +30d |
| `good` | 6 | 2.45 | 74 | +74d |
| `again` | 0 | 2.25 | 1 | +1d |
| `good` | 1 | 2.25 | 1 | +1d |
| `good` | 2 | 2.25 | 4 | +4d |

`again` at row 7 resets `reps` to 0 and the interval to 1 day (a lapse); the schedule rebuilds from there.

## 4. The six-state lifecycle

`reviewStatus(state, now)` is a pure function of the schedule fields:

| status | condition |
|---|---|
| `learned` | introduced, no graded attempt yet |
| `practised` | `reps` = 1, not due |
| `weak` | `ease < 2.0` or last result `again`/`hard`, and not currently due |
| `forgotten` | `reps` back to 0 after a lapse, or overdue by more than a full interval with ≥ 1 lapse |
| `reviewed` | `reps` ≥ 2 |
| `retained` | `reps` ≥ 4 and `ease` ≥ 2.3 |

A `mastered` flashcard seeds at `{ reps: 2, ease: 2.5, interval: 4d }` → status **`reviewed`** on day one. The existing signal is preserved; no history is invented.

## 5. Review queues (each a filter, no new store)

| queue | membership |
|---|---|
| **Due for review** | `status` ∈ {practised, reviewed, retained} and `dueDate ≤ now` |
| **Fix mistakes** | object whose *most recent* graded event was incorrect (a pure view over M18's `correct:false` events) |
| **Weak spots** | `status` ∈ {weak, forgotten} |
| **Haven't seen in a while** | `lastSeen` older than 21 days and not due |

## 6. `deriveLevel` — the graded signal now covers every strand

**Before M19:** the graded tier read `new Set(progress.mastered)` — only vocabulary could populate it, so only vocabulary ever reached `firm`.

**After M19:** it reads `retainedSet()` = objects whose `reviewStatus` is `retained` or `reviewed`, **unioned with `progress.mastered`**. Because the review state is seeded from `mastered`, every currently-mastered vocab object is in the set on day one — **verified: `deriveLevel("vocabulary")` on a pre-M19 mastered profile returns the identical `{level, confidence}`.** And now a grammar point answered correctly across a few `cloze` reviews, or a letter drilled in `build`, also counts — verified live: 4 correct `cloze` reviews of the A1 grammar objects → `deriveLevel("grammar")` reaches **A1** from the graded tier (it was only reachable from the lesson bridge before).

`EVIDENCE_MIN` (12) and the `assess: "reliable"` gate for `firm` are unchanged — 4 grammar objects is enough for a *provisional* A1, not `firm`.

## 7. What else changes

- `emitInteraction` (M18) now calls `foldReviewState()` after logging — the object is rescheduled immediately.
- `markCard` (flashcards) emits an `InteractionEvent` — a self-graded card moves its schedule. `progress.mastered` is still written exactly as before.
- `rebuildDeck`'s stale *"Spaced-repetition-lite"* comment is corrected — it only orders unmarked-first; the real schedule is `scheduler.next`.
- `progress` gains `reviewState {}` + `reviewCursor`. Additive, idempotent, seeded from `mastered`, folded past the cursor so it survives the 400-event log rotation.

## 8. Decisions to confirm

1. **Latency thresholds 3s / 20s** — a fast answer earns `easy`, a > 20s answer is nudged to `hard` (still a forward step). Tunable constants. OK?
2. **`MASTERED_SEED` = reps 2 / ease 2.5 / interval 4d** — status `reviewed`, due in 4 days. OK?
3. **`deriveLevel` graded tier → `retainedSet()`** (unioned with `mastered` so no regression). OK?
4. **`REVIEW_RETAINED_REPS` = 4, `REVIEW_STALE_DAYS` = 21.** OK?
5. **`markCard` emits** — a flashcard self-grade counts as a graded interaction. OK?

---

## Sign-off

Approve, and implementation resumes at rollout step 4: the `#view-review` runner (queue picker → items via `exerciseTypes` → summary), the Practice **Review** card with live counts, scoped CSS.
