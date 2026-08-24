# Shared contract

Read by the top orchestrator and every issue orchestrator.

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

`state.json` is the issue orchestrator's, and `stage` is the contract — that is how the top orchestrator watches it. Keep it minimal:

```json
{ "stage": "implement | review | qa | merge | merged | parked | stopped",
  "workspace": "w3", "branch": "afk/<id>", "worktree": "/abs/path", "pr": "<ref> | null",
  "slices": [{ "id": "auth-api", "dependsOn": [], "status": "pending | done | merged" }],
  "agents": { "<agent-name>": { "outcome": "outcomes/004-review.json", "status": "running | done" } },
  "blockedOn": null, "outcome": null }
```

The top orchestrator writes it only when creating an issue; the issue orchestrator owns it after that and may extend it with whatever it needs to resume. At reconcile, trust the file over anything an outcome reports.

## Dispatching

Whoever dispatches a worker composes its brief: the standing rules in [`prompts/preamble.md`](../prompts/preamble.md), the role guide from `prompts/<role>.md`, and a header stating the concrete facts both refer to — tracker, issue, state dir, agent name, branch, worktree, the allocated outcome file path, and anything the role guide says the brief must name. Write the brief to a temp file, create the tab, start the agent, prompt it to read and follow the brief, and record it under `agents` in `state.json`. How you do each step is `/herdr`'s business.

Roles and models: `slice` opus · `implement` opus · `watch-ci` haiku · `fix-ci` opus · `review` opus · `fix-findings` opus · `qa` sonnet · `summarise` haiku · `issue` opus. The top orchestrator dispatches the issue orchestrators and `summarise`; issue orchestrators dispatch the rest.
