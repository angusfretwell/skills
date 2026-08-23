---
name: stampede
description: Autonomous issue-clearing orchestrator over herdr — runs an issue tracker's ready issues through implement, review, QA, and merge, each in its own herdr workspace and worktrunk worktree.
argument-hint: "[merge-mode] [concurrency] [cap]"
disable-model-invocation: true
---

You are the **orchestrator**, run per `/supervise`: plan, dispatch, wait, advance. Your context holds the index; `.stampede/` on disk holds the content. Every worker is a **herdr agent** — an interactive `claude` in its own tab — never an `Agent` tool call. The herdr recipes live in [`references/herdr.md`](references/herdr.md) and the worktree ones in [`references/worktrunk.md`](references/worktrunk.md) — read both once, at the start of the run. Every dispatch's brief is composed per [Briefs](#briefs) from the role's file in [`prompts/`](prompts/) — read the role file when you first dispatch that role.

Workers write reports in full to the issue's state dir and signal you through an **outcome file** — a small JSON the brief names. The outcome file is all you read of a worker's work: read a report and you are doing the work yourself, which is a dispatch signal.

## Settings

`/stampede [merge-mode] [concurrency] [cap]`. Each resolves from the invocation, else from `config.json`, else from its default; a value that arrived from the invocation is written back to `config.json`.

- **Merge mode** — `merge` (you merge clean PRs) or `park` (ready them and request a human's review). No default: ask (`AskUserQuestion`) and persist.
- **Concurrency** — issues in flight at once. Default 3.
- **Cap** — rounds or attempts a stage gets before the issue stops. Default 5.
- **Tracker** — never an argument. `config.json`'s `tracker`, else detect (a Linear MCP server with a team this repo belongs to; a GitHub `origin` with issues enabled via `gh`), else ask once; persist whichever you settle on.

## State

`.stampede/` sits in the **main worktree** root (`git worktree list`'s first entry; `wt` calls it the default-branch worktree) and is listed in `.git/info/exclude` — add it there on first run; it is never committed.

```
.stampede/
  config.json              { tracker, mergeMode, concurrency, cap, session }
  <issueId>/
    state.json             the issue's state — schema below
    plan.md notes/ slice-*.md review-*.md qa-*.md door.md   written by workers, read by workers
    briefs/<agent>.md      the dispatch brief each agent was prompted with
    outcomes/<agent>.json  the outcome file each agent wrote
```

`state.json`:

```json
{
  "stage": "implement | review | review-fix | qa | qa-fix | merge | merged | parked | stopped",
  "workspace": "w3", "branch": "afk/<id>", "worktree": "/abs/path", "pr": "<ref> | null",
  "reviewRound": 0, "qaRound": 0, "ciAttempts": 0, "incompleteVerdicts": 0,
  "slices": [{ "id": "auth-api", "title": "…", "dependsOn": [], "status": "pending | done | merged", "worktree": "/abs/path" }],
  "agents": { "<agent-name>": { "role": "…", "tab": "w3:t2", "status": "running | done" } },
  "blockedOn": "<what a blocked agent is asking> | null",
  "outcome": "merged | parked | stopped | null", "stoppedBecause": "… | null"
}
```

Workers patch only the fields their briefs name (`pr`, `reviewRound`, `qaRound`, `slices[].status`); every other field is yours. Keep it current enough that a fresh orchestrator resumes from it alone.

## Briefs

A brief is the preamble below (`{{DOORS}}` is the absolute path of this skill's `references/one-way-doors.md`), then the role's text from `prompts/<role>.md`, with every `{{…}}` filled: absolute paths, never relative ones, since workers sit in different worktrees. A role file's trailing notes (after its outcome line) are instructions to you for filling its placeholders, not brief text. Cues to the integrator (`integrate-slice`, `finish-branch` in `prompts/integrate.md`) are prompted directly, without a preamble: it already has one.

<preamble>

Tracker: {{TRACKER}}. Issue: {{ISSUE_ID}}. State dir: {{STATE_DIR}}. Your agent name: {{AGENT}}.
Read {{STATE_DIR}}/state.json. Your worktree is your cwd; confirm `git status` shows branch {{BRANCH}}. Every later step runs from here. Fetch the issue from the tracker — title, body, and comments are the spec. Read {{DOORS}} — what to do when the work turns on a one-way door.
Division of labour: CI owns the full test suite, lint, and builds; the QA stage owns exercising the running app; you do the checks your brief names and no others.
When you are done, write your outcome file {{STATE_DIR}}/outcomes/{{AGENT}}.json as your very last act, with the `result` your brief names — then stop and wait; another prompt may follow.

</preamble>

## Session

Per `references/herdr.md`: the current session inside herdr, else `stampede-<repo>`, started headless if absent or stopped. Record it in `config.json` and tell the human once per run how to attach.

## Run

### 1. Plan

List the tracker's open issues labeled `ready-for-agent`. A PRD issue with linked implementation issues is never workable — work the implementation issues instead. Pair each with its `state.json` if one exists: those are **resumed**, the rest **fresh**. Build the dependency graph and frontier per `/dependency-graph`; a merged issue unblocks its dependents.

Done when: every `ready-for-agent` issue is classified as frontier, blocked (by which issues), PRD, or terminal.

### 2. Fill the slots

While fewer than **concurrency** issues are in flight and the frontier is non-empty, start the next frontier issue — resumed issues first. Starting a fresh issue:

1. Create the issue worktree on branch `afk/<id>` (`references/worktrunk.md`).
2. Create a herdr workspace in it labeled `<id> <title>` (`references/herdr.md`).
3. Write `state.json` (`stage: implement`, the paths and ids above, rounds at 0).
4. Dispatch **`integ-<id>`** (integrator, opus) into the workspace's root pane with `prompts/integrate.md`; it lives until the issue terminates.
5. Dispatch **`slice-<id>`** (slicer, opus) with `prompts/slice.md`.

A resumed issue re-enters at [Resume](#resume).

### 3. Advance an issue

An issue advances the moment one of its agents' `herdr agent wait` returns. Read that agent's outcome file, mark the agent done in `state.json`, close its tab (the integrator's stays), then act on the stage:

**implement**

- Slicer `SLICES` → record the slices; dispatch one **`impl-<id>-<slice>`** (opus, `prompts/implement.md`) per slice on the frontier of the slice graph, each in its own tab and slice worktree (`references/worktrunk.md`). A slice's `DONE` → prompt `integ-<id>` with `integrate-slice`; its `MERGED` frees the slice's dependents. Integrate one slice at a time per issue.
- Every slice `merged` → prompt `integ-<id>` with `finish-branch`; its `FINISHED` → stage `review`.

**The CI gate** — run before review and before merge. Dispatch a haiku **`ci-<id>-<a>`** (a = `ciAttempts` + 1) with `prompts/watch-ci.md`. `GREEN` → through the gate. `RED` → `ciAttempts` + 1; > cap → stop (`check cap hit`), else dispatch a fresh opus **`fix-<id>-ci-<a>`** in the issue worktree with `prompts/fix-ci.md`, `REASON: RED`. `CONFLICT` → the same fixer with `REASON: CONFLICT`, uncounted. Either fixer's `ADDRESSED` → re-run the gate.

**review** — round N = `reviewRound` + 1; N > cap → stop (`review cap hit`). Through the CI gate, dispatch an opus **`review-<id>-<n>`** with `prompts/review.md`. `CLEAN` → stage `qa`. `FINDINGS` → stage `review-fix`. `INCOMPLETE` → `incompleteVerdicts` + 1 (any other verdict resets it to 0); at 2 stop the issue (`review unreachable`), else re-run the round.

**review-fix** — dispatch a fresh opus **`fix-<id>-review-<n>`** in the issue worktree with `prompts/fix-findings.md`, `KIND: review`, `ROUND: N`. `ADDRESSED` → stage `review`.

**qa** — round N = `qaRound` + 1; N > cap → stop (`QA cap hit`). Dispatch a sonnet **`qa-<id>-<n>`** with `prompts/qa.md`. `CLEAN` → stage `merge`; `FINDINGS` → stage `qa-fix`; `INCOMPLETE` as for review (`QA unreachable`).

**qa-fix** — **`fix-<id>-qa-<n>`** with `prompts/fix-findings.md`, `KIND: qa`, `ROUND: N`. `ADDRESSED` → stage `review` (the fix is new code).

**merge** — through the CI gate, dispatch a haiku **`merge-<id>`** with `prompts/merge-or-park.md`. Its `MERGED` or `PARKED` is terminal.

Any worker's `STOPPED` (a **one-way door** — the worker has already written `door.md` and commented) → stop the issue (`one-way door`).

### 4. Terminate an issue

Dispatch a haiku **`sum-<id>`** with `prompts/summarise.md` (it upserts the PR's `## AFK summary`, relabels a stopped issue `ready-for-human`, closes a merged one). Then:

- **merged** → close the workspace; `wt remove` the issue branch and any slice branches left; replan — a merge moves the frontier.
- **parked** / **stopped** → close every tab but the root, leave the worktree and workspace: the PR is a human's now. A later run finds the PR merged or closed and finishes the cleanup.

Post one status line per terminated issue: id, outcome, and why if stopped.

### 5. Keep the herd moving

Each dispatch is followed by `herdr agent wait <name>` in a **background** Bash call, so a finishing agent wakes you. `blocked` is a wait result too: `herdr agent read` the pane, write what it is asking to `state.json` (`blockedOn`), and act per [Blocked](#blocked).

Between wakes, hold a `ScheduleWakeup` heartbeat (`/stampede` restating every setting) at 20–30 minutes: on each tick [Resume](#resume), then post one status line — in flight, blocked, parked, frontier. The run ends only when the human says so.

## Blocked

Record first, ask last. A blocked agent, a one-way door, a cap hit, a dead agent: write it to `state.json` and keep every other issue moving. Put a question to the human (`AskUserQuestion`) only when nothing can progress without an answer — every in-flight issue is waiting on one, or a decision gates the next dispatch. When you ask, carry the question in the human's words: the pane's text or `door.md`'s question, not your paraphrase.

## Resume

On every run, and on every heartbeat tick, replan (new issues, humans merging parked PRs) and reconcile three sources for each non-terminal `state.json`: the file, `herdr agent list` in the session, and the PR (`gh`/tracker). The PR wins on terminal facts — merged → terminate as merged; closed unmerged → stop (`PR closed by a human`); missing → back to `implement` from the branch. An agent the file calls running that `herdr agent list` shows alive gets re-waited if its wait is no longer pending; one it shows gone, with no outcome file, has its stage re-dispatched; one gone with an outcome file is advanced as if its wait had just returned. `merged`/`parked`/`stopped` stages are terminal on sight.
