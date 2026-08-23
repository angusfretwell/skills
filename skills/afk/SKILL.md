---
name: afk
description: Autonomous issue-clearing loop run as a Workflow — implements, reviews, QAs, and merges an issue tracker's ready issues. Run as `/loop /afk`.
argument-hint: "[merge-mode] [cap] [max-new]"
---

Each invocation is one **pass**: one `Workflow` run of the `workflow.js` beside this file. You are the **driver** — you resolve settings, launch the run, read its return, and schedule the next pass. Everything else — planning, implementing, CI-waiting, reviewing, QA, fixing, merging, summarising — happens inside the workflow. You never read code, diffs, logs, or findings yourself.

The issue tracker should have been provided to you; if it wasn't, stop and ask.

## Settings

`/afk [merge-mode] [cap] [max-new]`. Take each from the invocation; a default applies silently when the invocation omits it.

- **Merge mode** — `merge` (the workflow merges clean PRs) or `park` (it readies them and requests a human's review). No default — ask (`AskUserQuestion`) before the first pass; every later pass restates it.
- **Cap** — rounds or attempts a stage gets before the issue stops: review rounds, QA rounds, and CI-fix attempts are each capped at this number. Default 5.
- **Max new** — how many fresh issues a pass may start. Resumed issues always continue. Default unlimited.

There is no concurrency setting: the workflow runtime's agent cap governs how many run at once.

## A pass

1. Resolve settings; ask for merge mode if the invocation omits it.
2. Compute `repo` = `<owner>-<name>` from `git remote get-url origin`.
3. Call `Workflow` with `scriptPath` = the `workflow.js` beside this file and
   ```json
   { "tracker": "<how agents reach the tracker — MCP server, gh repo, Linear team…>",
     "repo": "<owner>-<name>", "mergeMode": "merge" | "park", "cap": 5, "maxNew": null }
   ```
4. Wait for the completion notification. The run returns `{ settled: [{ id, pr, outcome, stoppedBecause }], blocked: [{ id, blockedBy }], skipped: [id] }` — summaries and labels are already written.
5. Post a status line: merged, parked, stopped (and why), blocked, skipped (over max-new).
6. Any `ready-for-agent` issue remains, or a parked PR awaits its human → `ScheduleWakeup` with the same `/afk` prompt restating all three settings: minimum delay while workable issues remain, maximum when only parked PRs or blocked issues do. Nothing left → stop the loop with the status as your summary.

## State

Every issue the loop touches owns a directory **outside the repo**: `~/.afk/<repo>/<issue-id>/`.

```
state.json              stage, worktree, branch, pr, reviewRound, qaRound, ciAttempts, outcome, stoppedBecause
review-N.md             review round N's findings
review-N-response.md    the fixer's ledger for round N
qa-N.md / qa-N-response.md
door.md                 the one-way door, if one was hit
```

`state.json` is the resume point: a pass reads it, confirms the PR still agrees (merged? closed? conflicted?), and re-enters the pipeline at `stage`. Every agent that changes the issue's position patches `state.json` as its last step — and records its worktree path and PR there, so later agents find them without searching. The PR carries exactly one loop-written comment, `## AFK summary`, which counts rounds and names the outcome; the findings themselves stay on disk.

## Pipeline

Per issue, no barriers — each advances the moment it is ready. Only a **merged** issue unblocks its dependents; parked and stopped ones keep them blocked.

```
plan ─► implement ─► ci ─► review ─► qa ─► ci ─► merge | park
                      ▲        │       │
                      └── fix ◄┘       │      (QA findings → fix → ci → review: the fix is new code)
                      └── fix ◄────────┘
```

- **plan** — list `ready-for-agent` issues, skip PRD issues with linked implementation issues, join against the state dir, build the dependency graph per `/dependency-graph`.
- **implement** — worktree on `afk/<id>`, `/tdd` where there's a seam, typecheck and the tests it touched — never the full suite — push, `/open-pr` as a draft with `Closes <id>`.
- **ci** — a cheap agent watches the PR's checks. Red → fixer (one attempt toward the cap) → watch again. Conflicted → fixer → watch again. Green → continue. Runs before every review round and before merge, so reviewers never see code CI rejects.
- **review** — `/code-review` on the branch; reads prior `review-*.md` and the latest response, re-raises disputed items; writes `review-N.md`; returns `FINDINGS` / `CLEAN` / `INCOMPLETE`. Never runs tests, lint, or typecheck.
- **qa** — `/verify` against the issue's acceptance criteria; writes `qa-N.md`; same verdicts. Never runs tests, lint, or typecheck. Findings send the issue back to review.
- **fix** — triages every item to fix / investigate / won't fix / one-way door before touching code; pushes; writes the round's `-response.md` ledger.
- **merge** — ready the PR, then merge (delete branch, remove worktree, confirm the issue closed) or park (request a human's review).
- **summary** — on every settle, a cheap agent upserts `## AFK summary` on the PR from `state.json` and flips a stopped issue's label from `ready-for-agent` to `ready-for-human`.

**INCOMPLETE** twice in the same round stops the issue. A **one-way door** (`STOPPED` from an implementer or fixer, with `door.md` written and a `## AFK one-way door` comment on the PR or issue) stops it. A round or attempt count reaching the **cap** stops it.

Every agent that starts a server, watcher, or any long-running process stops it before returning.

## Models

opus: plan, implement, fix, review · sonnet: QA · haiku: ci-wait, pr-verify, merge, summary.
