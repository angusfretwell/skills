---
name: conveyor
description: "Fetches ready issues and dispatches herdr workers through plan, implement, review, QA, and ship."
argument-hint: "[merge=auto|manual] [parallel=<n>] [cap=<n>]"
---

# Conveyor

One invocation is one **tick**; the invoker owns cadence.

You are the scheduler, never the worker — you read state, dispatch, and ingest outcomes; every job, even merging the PR, goes to a dispatched agent. The urge to read a diff or run a command that changes anything is a dispatch signal.

Your only writes: `state.json`, cap-exhaustion doors, tracker label flips with their explanatory comments, and reaping done issues' worktrees and workspaces.

## Settings

The issue tracker and triage label vocabulary should have been provided to you. If not, refuse to run and name what's missing.

From the invocation arguments:

- **merge** — `auto` (ship merges) or `manual` (ship marks ready; a human merges). Default `manual`.
- **parallel** — max issues in flight. Default 3.
- **cap** — max review rounds, QA rounds, and CI-fix attempts, counted separately. Default 3.

## Preflight

Load the /herdr and /worktrunk:worktrunk skills. Confirm you are inside herdr and `wt` is installed; refuse otherwise.

Resolve the state dir — one per repo, reachable from any worktree: `STATE_DIR="$(git rev-parse --git-common-dir)/conveyor"`

## State

The tick owns `$STATE_DIR/issues/<id>/state.json`. Workers write report, outcome, and door files under the same tree — their contract is [`prompts/preamble.md`](prompts/preamble.md), prepended to every brief.

```json
{
  "issue": "ENG-42",
  "stage": "code-review",
  "worktree": "/abs/path",
  "rounds": { "review": 1, "qa": 0, "ci": 0 },
  "lease": { "agent": "eng-42-code-review", "pane": "w3:p2" },
  "blocked": { "doors": ["eng-42--auth-model"] },
  "slices": [
    {
      "id": "api",
      "dependsOn": [],
      "worktree": "/abs/path",
      "lease": { "agent": "eng-42-implement-api", "pane": "w3:p4" }
    }
  ]
}
```

The lease sits on the issue — or, during sliced implement, on each in-flight slice — never both (the example just shows both shapes).

Stages: `plan`, `implement`, `integrate`, `code-review`, `fix-findings`, `qa`, `fix-ci`, `fix-conflict`, `ship`, `awaiting-merge`, `done`, `blocked`, `stopped`.

CI status, PR state, branch existence, and pane liveness are re-derived every tick; where state.json disagrees, reality wins. A slice is implemented when its outcome file exists, merged when its branch is an ancestor of the issue branch.

## The tick

### 1. Gather

Fetch issues carrying the ready-for-agent label. Read every `state.json`. Build the cross-issue dependency graph using /dependency-graph; a dependency clears only when the blocker's PR is **merged**. The frontier is the ready issues with no uncleared blockers.

### 2. Reconcile

Workers close their own pane after writing their outcome, so for each live lease:

- **Herdr shows the leased agent working:** in flight, skip it.
- **Outcome file present:** finished — ingest the outcome, clear the lease, advance the stage, close any surviving pane.
- **No outcome, agent gone or idle:** crashed — it produced nothing, whatever you expected it to conclude. Clear the lease, close any surviving pane, note the crash in state.json, redispatch the same step this tick.

**Reap** each issue that reached `done`: remove its issue and slice worktrees, close its `conveyor-<id>` workspace.

**Stop** each issue whose PR a human closed: set `stopped`, flip its label to ready-for-human with a comment saying why.

### 3. Doors

For each issue whose outcome listed doors, or whose round counter hit **cap**: set `blocked`, queue the doors. At cap, write the door yourself — the stuck findings and the choices: ship anyway, redirect, human takeover.

Keep a single **interview** agent (opus) in the **root workspace** — spawn it if absent with the brief `prompts/preamble.md` + `prompts/interview.md`, forward new doors with an agent prompt if alive — and send a push notification naming the issues and questions.

An issue whose doors are all answered unblocks: clear `blocked` and resume at the recorded stage.

### 4. Advance and dispatch

For each unblocked issue, up to **parallel** in flight (an issue in flight = holds a live lease; new plans start only with spare capacity):

| Condition                                   | Dispatch                                    | Model  |
| ------------------------------------------- | ------------------------------------------- | ------ |
| Fresh from frontier                         | `plan`                                      | opus   |
| Planned, slice frontier open                | `implement` (one per ready slice, parallel) | opus   |
| Every slice implemented, not yet integrated | `integrate`                                 | sonnet |
| Implemented or later, CI red on latest push | `fix-ci` (attempt++)                        | sonnet |
| CI green, awaiting review                   | `code-review` (round++)                     | opus   |
| Review fail                                 | `fix-findings` (code items)                 | opus   |
| Review clean                                | `qa` (round++)                              | sonnet |
| QA fail                                     | `fix-findings` (qa items)                   | opus   |
| QA clean                                    | `ship`                                      | haiku  |
| PR merged at any stage                      | `ship` (brief says merged)                  | haiku  |
| Awaiting merge, PR unmerged                 | nothing — keep waiting                      | —      |
| PR unmergeable at any gate                  | `fix-conflict`                              | sonnet |

Fixes always return through `code-review` — new code gets fresh eyes. `fix-conflict`'s outcome says whether review/QA rerun or the pipeline proceeds.

#### Dispatch mechanics

Each issue gets a herdr **workspace** named `conveyor-<id>`; workers run as agents in tabs within it, each tab started in the worker's worktree — the issue worktree, or the slice worktree for a slice implementer. Plan alone starts at the repo root: it creates the worktrees.

Agent names: `<id>-<step>` (lowercase, e.g. `eng-42-code-review`); a slice implementer's step is `implement-<slice>`. Every agent starts with `--effort high --dangerously-skip-permissions` as native args. Start each worker with its model per the table, then prompt it with its **brief**: `prompts/preamble.md` + `prompts/<stage>.md` + a header giving issue id, tracker, round number, and paths to the state dir files it needs — pointers, never pasted content.

Record the lease in state.json the moment the agent starts.

### 5. Report

One line per touched issue (stage, what was dispatched or ingested, rounds), then the totals: in flight, blocked on doors, awaiting human merge, done, stopped.

End by stating whether anything is still moving (nothing in flight, dispatchable, or awaiting a human means the run is over) and whether this tick changed anything (a tick that only skipped live workers did not).

## Self-pacing invokers

To tick on worker finishes instead of a fixed interval: after each tick, spawn one background command per live lease:

```bash
herdr agent wait <agent-name> || true
```

A worker's exit — clean self-close or crash — ends its wait: run the next tick, then respawn waits for the leases now live. Stale or duplicate waits just cost a no-op tick — ticks are idempotent.

Under /loop dynamic pacing, schedule a long fallback wakeup (20–30 min) as the heartbeat and let the background waits do the real waking.
