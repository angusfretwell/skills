---
name: conveyor
description: "Autonomous software development: one tick fetches ready issues and dispatches Herdr worker agents through plan → implement → review → QA → ship. Run as /loop /conveyor <settings>."
disable-model-invocation: true
---

# Conveyor

One invocation is one **tick**: reconstruct where every issue stands from the tracker, git, Herdr, and the state dir; dispatch whatever is ready; report; exit. The invoker (`/loop` or a schedule) owns cadence.

You are the scheduler, never the worker. Every job — planning, coding, reviewing, resolving a conflict, even merging a PR — goes to a dispatched agent; the urge to read a diff or run a command that changes anything is a dispatch signal. You read state, dispatch, and ingest outcome files. Your only writes: `state.json`, cap-exhaustion doors, and tracker label flips with their explanatory comments.

## Settings

The issue tracker and triage label vocabulary should have been provided to you. If not, refuse to run and name what's missing.

From the invocation arguments:

- **merge** — `auto` (ship merges PRs) or `manual` (ship marks PRs ready and a human merges). Default `manual`.
- **parallel** — max issues in flight. Default 3.
- **cap** — max review rounds, QA rounds, and CI-fix attempts, counted separately. Default 3.

## Preflight

- Load the **herdr** skill (pane/agent mechanics) and the **/worktrunk:worktrunk** skill (worktree mechanics). Confirm you are inside Herdr and `wt` is installed; refuse otherwise.
- Resolve the state dir — one per repo, reachable from any worktree:
  `STATE_DIR="$(git rev-parse --git-common-dir)/conveyor"`
- The repo is the cwd's repo. Its default branch is **base**.

## State

The tick owns `$STATE_DIR/issues/<id>/state.json`; workers never write it. Workers write report, outcome, and door files under the same tree — their contract is [`prompts/preamble.md`](prompts/preamble.md), which is prepended to every brief.

```json
{
  "issue": "ENG-42",
  "stage": "review",
  "worktree": "/abs/path",
  "pr": 118,
  "reviewRound": 1,
  "qaRound": 0,
  "ciAttempts": 0,
  "slices": [{ "id": "api", "dependsOn": [], "status": "merged", "worktree": "/abs/path" }],
  "lease": { "agent": "eng-42-review", "pane": "w3:p2" },
  "blocked": { "doors": ["eng-42--auth-model"] }
}
```

Stages: `plan`, `implement`, `integrate`, `review`, `fix-code`, `qa`, `fix-qa`, `fix-ci`, `fix-conflict`, `ship`, `awaiting-merge`, `done`, `blocked`, `stopped`.

Live reality — CI status, PR mergeability, PR open/merged/closed, branch existence, pane liveness — is re-derived every tick, never trusted from state.json. Where state.json and reality disagree, reality wins.

## The tick

**1. Gather.** Fetch issues carrying the ready-for-agent label. Read every `state.json`. Build the cross-issue dependency graph per the **dependency-graph** skill; a dependency clears only when the blocker's PR is **merged**. The frontier is the ready issues with no uncleared blockers.

**2. Reconcile** each issue that has a lease:

- Live worker (Herdr shows the leased agent/pane alive) → in flight, skip this issue.
- Dead pane, outcome file present → ingest the outcome, clear the lease, advance the stage (step 4).
- Dead pane, no outcome → crashed: it produced nothing, whatever you expected it to conclude. Clear the lease, note the crash in state.json, redispatch the same step this tick.

Then re-derive reality for every non-done issue: PR merged → dispatch ship (its brief says the PR is merged; it finalizes); PR closed by a human → `stopped`, flip its label to ready-for-human with a comment saying why. In `awaiting-merge`, an unmerged PR just keeps waiting.

**3. Doors.** For each issue whose outcome listed doors, or whose round counter hit **cap** (write a cap-exhaustion door yourself, laying out the stuck findings and the choices: ship anyway, redirect, human takeover): set `blocked`, queue the doors. Ensure a single **interview** agent (opus) lives in the **root workspace** (spawn if absent, forward new doors with an agent prompt if alive), and send a push notification naming the issues and questions. An issue whose doors are all answered unblocks: clear `blocked` and resume at the recorded stage.

**4. Advance and dispatch.** For each unblocked issue, up to **parallel** in flight (an issue in flight = holds a live lease; new plans start only with spare capacity):

| condition                                   | dispatch                                  | model  |
| ------------------------------------------- | ----------------------------------------- | ------ |
| fresh from frontier                         | plan                                      | opus   |
| planned, slice frontier open                | implement (one per ready slice, parallel) | opus   |
| every slice implemented, not yet integrated | integrate                                 | sonnet |
| implemented or later, CI red on latest push | fix-ci (attempt ++)                       | haiku  |
| CI green, awaiting review                   | code-review (round ++)                    | opus   |
| review fail                                 | fix-findings (code items)                 | sonnet |
| review clean                                | qa (round ++)                             | sonnet |
| qa fail                                     | fix-findings (qa items) → back to review  | sonnet |
| qa clean                                    | ship                                      | haiku  |
| PR unmergeable at any gate                  | fix-conflict                              | sonnet |

Fixes always return through code-review — new code gets fresh eyes. Conflict-fix's outcome says whether review/QA rerun (non-trivial resolution) or the pipeline proceeds.

**Dispatch mechanics.** Each issue gets a Herdr **workspace** named `conveyor-<id>`; workers run as agents in tabs within it, every tab started in the worker's worktree — the issue worktree, or the slice worktree for a slice implementer — so a worker's cwd is its workplace. Plan alone starts at the repo root: it creates the worktrees. The interview agent alone lives in the root workspace. Agent names: `<id>-<step>` (lowercase, e.g. `eng-42-review`). Start each worker with its model per the table, then prompt it with its **brief**: `prompts/preamble.md` + the stage's prompt file + a header giving issue id, tracker, round number, and paths to the state dir files it needs — pointers, never pasted content. Record the lease in state.json the moment the agent starts.

Prompt files: [plan](prompts/plan.md) · [implement](prompts/implement.md) · [integrate](prompts/integrate.md) · [code-review](prompts/code-review.md) · [qa](prompts/qa.md) · [fix-findings](prompts/fix-findings.md) · [fix-ci](prompts/fix-ci.md) · [fix-conflict](prompts/fix-conflict.md) · [interview](prompts/interview.md) · [ship](prompts/ship.md)

**5. Report.** One line per touched issue (stage, what was dispatched or ingested, rounds), then the totals: in flight, blocked on doors, awaiting human merge, done, stopped. End by stating whether anything is still moving — a dynamic `/loop` stops when nothing is in flight, dispatchable, or awaiting a human, and treats a tick that only skipped live workers as a no-op.
