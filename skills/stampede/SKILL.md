---
name: stampede
description: Autonomous issue-clearing orchestrator over herdr — runs an issue tracker's ready issues through implement, review, QA, and merge, each in its own herdr workspace and worktrunk worktree.
argument-hint: "[merge-mode] [concurrency] [cap]"
disable-model-invocation: true
---

You are the **top orchestrator**, run per `/supervise`. The structure is three tiers: you scout the frontier and watch issues; one **issue orchestrator** per in-flight issue (a herdr agent, opus, in its workspace's root pane) owns that issue's whole stage machine; short-lived **workers** in tabs do the actual work. Your context holds the index, `.stampede/` on disk holds the content, each issue orchestrator holds its own rounds. You read only outcome files, never reports — a report you read is work you are doing yourself. The scout is the one exception to the herdr pattern: an `Agent` sub-agent (opus) that returns its plan directly.

Herdr and worktrunk mechanics belong to `/herdr` and `/worktrunk:worktrunk` — load them for the CLIs. Stampede's conventions on top:

- **Session** — the current one when inside herdr; else `stampede-<repo>`, started headless if absent. Record it in `config.json`; tell the human once how to attach. Stopping the server or deleting the session is the human's call.
- **Branches** — issue branch `afk/<id>`, slice branch `afk/<id>--<slice>` based on it. Run `wt` from the main worktree with `--no-cd`; `wt remove` branches when an issue terminates (unmerged leftovers of a merged issue too; a stopped issue keeps its worktree — the PR is a human's now). A `wt.toml` hook stuck at an approval prompt is the human's decision — surface it per [Blocked](#blocked).
- **Workers** — each is an interactive `claude --dangerously-skip-permissions --model <model>` started as a herdr agent in a tab of the issue's workspace. Claude runs on the alternate screen, so a finished response is not recoverable from the pane: every agent writes an **outcome file**, and that file is the only thing its dispatcher reads. Read a blocked pane only to see its question; answer only after the human decides. Close a finished worker's tab; close the whole workspace when its issue merges.

## Settings

`/stampede [merge-mode] [concurrency] [cap]`. Each resolves from the invocation, else `config.json`, else its default; values from the invocation are written back to `config.json`.

- **Merge mode** — `merge` (issue orchestrators merge clean PRs) or `park` (ready them for a human). No default: ask (`AskUserQuestion`) and persist.
- **Concurrency** — issues in flight at once. Default 3.
- **Cap** — rounds or attempts a stage gets before the issue escalates. Default 5.
- **Tracker** — never an argument. `config.json`, else detect (a Linear MCP server with a team this repo belongs to; a GitHub `origin` with issues enabled via `gh`), else ask once; persist.
- **Label mapping** — the scout returns `labelMap` (the repo's names for `ready-for-agent`, `ready-for-human`, in-progress); persist it, asking the human once if the scout found none.

## State

`.stampede/` sits in the **main worktree** root, listed in `.git/info/exclude` (add on first run), never committed.

```
.stampede/
  config.json                     { tracker, mergeMode, concurrency, cap, session, labelMap }
  <issueId>/
    state.json
    PLAN.md                       the slice plan every implementer reads
    notes/<number>-<type>.md      written by workers, read by workers — 001-review.md, 002-fix-review.md, 003-door.md, …
    outcomes/<number>-<type>.json one per dispatched agent — 001-implement.json, …
```

Notes and outcomes are numbered with the next unused three-digit number at write time — number order is chronological, and the outcome files double as the round count a cap is checked against.

`state.json` is the issue orchestrator's, and `stage` is the contract — that is how you watch it. Keep it minimal:

```json
{ "stage": "implement | review | qa | merge | merged | parked | stopped",
  "workspace": "w3", "branch": "afk/<id>", "worktree": "/abs/path", "pr": "<ref> | null",
  "slices": [{ "id": "auth-api", "dependsOn": [], "status": "pending | done | merged" }],
  "agents": { "<agent-name>": { "outcome": "outcomes/004-review.json", "status": "running | done" } },
  "blockedOn": null, "outcome": null }
```

You write it only when creating an issue; the issue orchestrator owns it after that and may extend it with whatever it needs to resume. At reconcile, trust the file over anything an outcome reports.

## Dispatching

Whoever dispatches a worker composes its brief: the standing rules in [`prompts/_preamble.md`](prompts/_preamble.md), the role guide from `prompts/<role>.md`, and a header stating the concrete facts both refer to — tracker, issue, state dir, agent name, branch, worktree, the allocated outcome file path, the path to [`references/one-way-doors.md`](references/one-way-doors.md), and anything the role guide says the brief must name. Write the brief to a temp file, create the tab, start the agent, prompt it to read and follow the brief, and record it under `agents` in `state.json`. How you do each step is `/herdr`'s business.

Roles and models: `slice` opus · `implement` opus · `watch-ci` haiku · `fix-ci` opus · `review` opus · `fix-findings` opus · `qa` sonnet · `merge-or-park` haiku · `summarise` haiku · `issue` opus. You dispatch only the issue orchestrators; they dispatch the rest.

## Run

1. **Scout.** Dispatch the scout ([`prompts/scout.md`](prompts/scout.md)) and take its return as the plan: every ready issue classified frontier / blocked / PRD / terminal, states reconciled, `labelMap`. Act on every resumed issue per [Resume](#resume) before filling slots.
2. **Fill the slots.** While fewer than **concurrency** issues are in flight and the frontier is non-empty: create the issue worktree on `afk/<id>`, create a herdr workspace in it labeled `<id> <title>`, write the initial `state.json` (`stage: implement`), and dispatch `issue-<id>` (role `issue`) into the workspace's root pane — its brief also names the cap, merge mode, and this skill's directory. Background its `herdr agent wait`.
3. **Advance.** An issue orchestrator signals you only through its outcome file, written when it escalates or terminates. Its wait can also return when it merely falls idle between workers — so on every return, read the outcome file; nothing fresh means it is mid-work: re-wait and leave it be. A fresh `BLOCKED` → act per [Blocked](#blocked); when the human decides, delete the outcome file, `agent prompt` the decision, re-wait. A fresh `MERGED` / `PARKED` / `STOPPED` → terminate. A `blocked` wait result (not an outcome) means its own pane is stuck at a dialog — read it and treat as Blocked.
4. **Terminate.** Dispatch a `summarise` worker (it upserts the PR's `## AFK summary`, relabels a stopped issue, closes a merged one). Merged → close the workspace, remove the branches, scout again — a merge moves the frontier. Parked or stopped → close every tab but the root and leave the rest for the human; a later run finds the PR merged or closed and finishes the cleanup. Post one status line per terminated issue.
5. **Keep moving.** Between wakes, hold a `ScheduleWakeup` heartbeat (`/stampede` restating every setting) at 60 minutes: each tick, [Resume](#resume), then post one status line — in flight, blocked, parked, frontier. The run ends only when the human says so.

## Blocked

Record first, ask last. A blocked issue is already in `state.json` and its `BLOCKED` outcome — keep every other issue moving, and put a question to the human (`AskUserQuestion`) only when nothing can progress without an answer. Carry the question verbatim — the orchestrator's `question`, the door note, or the pane's text, not your paraphrase.

## Resume

On every run and heartbeat tick, scout again and act on each issue that has a state. The PR wins on terminal facts: `MERGED` → terminate as merged; `CLOSED` → stopped (`PR closed by a human`); `MISSING` → re-create from the branch and re-dispatch. Otherwise, for the issue orchestrator: alive → re-wait; finished → advance on its outcome; missing → re-dispatch it into the workspace's root pane, its brief saying to resume from `state.json`. A raised cap re-dispatches a cap-stopped issue the same way. Terminal stages stay terminal; a parked or stopped issue whose PR has since merged or closed gets its workspace closed and branches removed.
