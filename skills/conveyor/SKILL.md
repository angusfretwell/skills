---
name: conveyor
description: "Fetches ready issues and dispatches herdr workers through plan, implement, review, QA, ship, and retro."
argument-hint: "[merge=auto|manual] [parallel=<n>] [cap=<n>]"
---

# Conveyor

One invocation is one **tick**; the invoker owns cadence.

You are the scheduler, never the worker — you read state, dispatch, and ingest outcomes; every job, even merging the PR, goes to a dispatched agent. The urge to read a diff or run a command that changes anything is a dispatch signal.

Your only writes: `state.json`, cap-exhaustion doors, tracker label flips with their explanatory comments, and closing a dead worker's surviving pane. Everything else, reaping included, goes to an agent.

## Settings

The issue tracker and triage label vocabulary should have been provided to you. If not, refuse to run and name what's missing.

From the invocation arguments:

- **merge** — `auto` (ship merges) or `manual` (ship marks ready; a human merges). Default `manual`.
- **parallel** — max issues in flight. Default 3.
- **cap** — max review rounds, QA rounds, and CI-fix attempts, counted separately. Default 4.

## Preflight

Load the /herdr and /worktrunk:worktrunk skills. Confirm you are inside herdr and `wt` is installed; refuse otherwise.

Resolve the state dir — one per repo, reachable from any worktree: `STATE_DIR="$(git rev-parse --git-common-dir)/conveyor"`

Resolve `$SKILL_DIR`, the absolute path of the directory holding this SKILL.md, given to you at invocation. Every prompt file below is passed by absolute path: a subagent or worker runs in its own worktree, where a relative one resolves to nothing.

Name your own tab per [Naming](#naming); leave it that way for the rest of the run.

## State

The tick owns `$STATE_DIR/issues/<id>/state.json`. Workers write report, outcome, and door files under the same tree — their contract is [`prompts/preamble.md`](prompts/preamble.md), prepended to every brief.

```json
{
  "issue": "ENG-42",
  "stage": "code-review",
  "worktree": "/abs/path",
  "workspace": "w7",
  "rounds": { "review": 1, "qa": 0, "ci": 0 },
  "leases": [{ "agent": "eng-42-code-review", "pane": "w3:p2" }],
  "sessions": [{ "agent": "eng-42-plan", "session": "<uuid>" }],
  "blocked": { "doors": ["eng-42--auth-model"] },
  "slices": [{ "id": "api", "dependsOn": [], "worktree": "/abs/path" }]
}
```

Stages: `plan`, `implement`, `integrate`, `code-review`, `fix-findings`, `qa`, `fix-ci`, `fix-conflict`, `ship`, `awaiting-merge`, `done`, `blocked`, `stopped`.

CI status, PR state, branch existence, and pane liveness are re-derived every tick; where state.json disagrees, reality wins. A slice is implemented when its outcome file exists, merged when its branch is an ancestor of the issue branch.

## The tick

A tick reads nothing from the ticks before it — every fact comes from the tracker, the repo, herdr, or `state.json`. The steps that only gather or only execute go to subagents that hand back a digest, so your context holds the decisions: the dispatch table, cap and door judgment, the doors you write, and the report.

### 1. Gather

Dispatch one **survey** subagent (sonnet) with `$SKILL_DIR/prompts/survey.md`, the tracker, the label vocabulary, and `$STATE_DIR`.

It returns the tick's ground truth: one row per issue — stage, PR, CI, each lease live or dead, un-ingested outcomes, slice progress — then the frontier, then the doors and advisories by id. Paths only, never contents.

### 2. Reconcile

Take each survey row in turn. A merged PR makes the issue `done` once its leases are all cleared; a PR a human closed makes it `stopped` — flip its label to ready-for-human with a comment saying why. Every other issue goes on to its leases.

Workers close their own pane after writing their outcome, so for each lease:

- **Herdr shows the leased agent working:** in flight, skip it.
- **Outcome file present:** finished — ingest the outcome, clear the lease, advance the stage, close any surviving pane.
- **No outcome, agent gone or idle:** crashed — it produced nothing, whatever you expected it to conclude. Clear the lease, close any surviving pane, note the crash in state.json, redispatch the same step this tick.

**Reap**: hand every issue that reached `done` to one **reaper** subagent (haiku) — `$SKILL_DIR/prompts/reap.md` plus each issue's worktrees and workspace id. It reports what it removed, and anything it left behind.

### 3. Doors and advisories

For each issue whose outcome listed doors, or whose round counter hit **cap**: set `blocked`, queue the doors. At cap, write the door yourself — grant N more rounds, or park for human takeover. Findings stay in the reviewer's report.

Also queue each advisory in `$STATE_DIR/advisories/` whose **Disposition** is pending — an advisory never blocks its issue.

Keep a single **interview** agent (opus) in a tab beside yours: spawn it there if absent with the brief `$SKILL_DIR/prompts/preamble.md` + `$SKILL_DIR/prompts/interview.md`, naming its tab per [Naming](#naming); forward new doors and advisories with an agent prompt if alive. Either way, send a push notification naming the issues and questions.

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
| QA clean                                    | `ship` & `retro`                            | sonnet |
| Awaiting merge, PR unmerged                 | nothing — keep waiting                      | —      |
| PR unmergeable at any gate                  | `fix-conflict`                              | sonnet |

Fixes always return through `code-review` — new code gets fresh eyes. `fix-conflict`'s outcome says whether review/QA rerun or the pipeline proceeds.

#### Dispatch mechanics

Each issue gets its own herdr **workspace**; workers run as agents in tabs within it, each tab started in the worker's worktree — the issue worktree, or the slice worktree for a slice implementer. Plan alone starts at the repo root: it creates the worktrees. Name every workspace, tab, and activity per [Naming](#naming).

Agent names — the CLI handle, not a display name: `<id>-<step>` (lowercase, e.g. `eng-42-code-review`); a slice implementer's step is `implement-<slice>`.

Compose each worker's **brief**: `$SKILL_DIR/prompts/preamble.md` + `$SKILL_DIR/prompts/<stage>.md` + a header giving issue id, tracker, round number, and paths to the state dir files it needs — pointers, never pasted content. Its model comes from the table above.

Decide the tick's dispatch list yourself, then hand it to one **launcher** subagent (sonnet) with `$SKILL_DIR/prompts/launch.md` and one line per dispatch: issue id, agent name, model, worktree, workspace (id, or the name to create it under), tab name, activity, the brief's file paths, and the brief's header. It returns `{issue, agent, pane, session, workspace}` per dispatch, naming any that failed to start.

Write the leases and `{agent, session}` into `state.json` from what it returns — `state.json` stays yours alone.

### 5. Report

One line per touched issue (stage, what was dispatched or ingested, rounds), then the totals: in flight, blocked on doors, advisories pending, awaiting human merge, done, stopped.

End by stating whether anything is still moving (nothing in flight, dispatchable, or awaiting a human means the run is over) and whether this tick changed anything (a tick that only skipped live workers did not). Then queue your own rename per [Naming](#naming).

## Naming

Three display names, all set by you — a worker never names itself.

**Workspace** — `<ISSUE-ID>: <brief>`, e.g. `SA-271: levy collection view`. The brief is a two-to-four word noun phrase for what is changing; the sidebar truncates, so drop articles, the word the issue id already implies, and anything a reader could guess. Set it at `workspace create` and never touch it again; find the workspace by the id recorded in state.json, not by its label.

**Tab** — a code for the worker type, so the tab bar reads as pipeline position. The round lives in the activity, so a repeat round's tab stays bare (`REV` again); slices carry numbers only because they co-exist. Your own tab is `Conveyor`; the interviewer lives in its own `Interviewer` tab.

**Activity** — the second line in herdr's agent list: a verb plus only what the workspace and tab do not already say, with a round in parentheses for the stages that repeat.

| Worker         | Tab                                          | Activity                                                               |
| -------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| `plan`         | `PLN`                                        | `Planning`                                                             |
| `implement`    | `IMP`, or `SL1`, `SL2`, … in `PLAN.md` order | `Implementing <slice>`, or `Implementing`                              |
| `integrate`    | `INT`                                        | `Integrating`                                                          |
| `code-review`  | `REV`                                        | `Reviewing code (round <n>)`                                           |
| `fix-findings` | `FIX`                                        | `Fixing review findings (round <n>)`, `Fixing QA findings (round <n>)` |
| `qa`           | `QA`                                         | `Running QA (round <n>)`                                               |
| `fix-ci`       | `CI`                                         | `Fixing CI (attempt <n>)`                                              |
| `fix-conflict` | `MRG`                                        | `Resolving conflicts`                                                  |
| `ship`         | `SHP`                                        | `Shipping`                                                             |
| `retro`        | `RET`                                        | `Writing retro`                                                        |

The activity is the agent's terminal title, which Claude Code writes from the session display name — the launcher passes it as the `--name` native arg at `agent start`, where it is set before the first prompt and survives the work that follows.

You and the interviewer carry queue depth instead of a fixed activity: `/rename <text>` sets the same name mid-session. Rename the interviewer whenever its queue changes — `<n> questions waiting`, or `No questions waiting`. Rename yourself with the tick's totals — `<n> running · <n> to merge · <n> blocked`, dropping any zero, or `Idle` when nothing is moving. Type the command into your own pane — a local command costs no turn — and it runs only once your turn ends, which is why the tick's last act is its slot:

```bash
herdr pane send-text "$HERDR_PANE_ID" "/rename 3 running · 2 to merge · 1 blocked" && herdr pane send-keys "$HERDR_PANE_ID" enter
```

## Self-pacing invokers

To tick on worker finishes instead of a fixed interval: after each tick, spawn one background command per live lease, each waiting on a single agent so any one exit wakes you:

```bash
herdr agent wait <agent-name> || true
```

A worker's exit — clean self-close or crash — ends its wait: run the next tick, then respawn waits for the leases now live. Stale or duplicate waits just cost a no-op tick — ticks are idempotent.

An issue awaiting a human merge holds no lease, so no wait fires when the merge lands — the fallback wakeup is what catches it.

Under /loop dynamic pacing, schedule a long fallback wakeup (20–30 min) as the heartbeat and let the background waits do the real waking.
