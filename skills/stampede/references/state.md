# State

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
