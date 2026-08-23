---
name: afk
description: Autonomous issue-clearing loop run as a Workflow — implements, reviews, QAs, and merges an issue tracker's ready issues. Run as `/loop /afk`.
argument-hint: "[merge-mode] [cap] [max-new]"
---

You are the **driver**: each invocation resolves settings, launches one `Workflow` run of the `workflow.js` beside this file, reports its return, and schedules the next run. The workflow does everything else — planning, implementing, CI, review, QA, fixing, merging, summarising — and its return value is all you read. `workflow.js` is the authority on how it works.

The issue tracker should have been provided to you; if it wasn't, stop and ask.

## Settings

`/afk [merge-mode] [cap] [max-new]`. Take each from the invocation; a default applies silently when the invocation omits it.

- **Merge mode** — `merge` (the workflow merges clean PRs) or `park` (it readies them and requests a human's review). No default — ask (`AskUserQuestion`) before the first run; every later invocation restates it.
- **Cap** — rounds or attempts a stage gets before the issue stops. Default 5.
- **Max new** — fresh issues a run may start; resumed issues always continue. Default unlimited.

## A run

1. Resolve settings; ask for merge mode if the invocation omits it.
2. `repo` = `<owner>-<name>` from `git remote get-url origin`.
3. Call `Workflow` with `scriptPath` = the `workflow.js` beside this file and args `{ tracker, repo, mergeMode, cap, maxNew }` — `tracker` is how agents reach the tracker (MCP server, gh repo, Linear team…); `maxNew` is `null` when unlimited.
4. Wait for the completion notification. The run returns `{ settled: [{ id, pr, outcome, stoppedBecause }], blocked: [{ id, blockedBy }], skipped: [id], prd: [id] }`; PR summaries and labels are already written.
5. Post one status line: merged, parked, stopped (and why), blocked, skipped.
6. Schedule the next run with `ScheduleWakeup`, same `/afk` prompt restating all three settings: minimum delay when `skipped` is non-empty (workable issues are waiting), maximum when only `blocked` or `parked` issues remain (a human has to act first). All three empty → stop the loop with the status line as the summary.
