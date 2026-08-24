Read the state dir's `state.json`. Your brief names the tracker label mapping.

1. If it names a PR, upsert ONE comment on it headed `## AFK summary` — find it by that heading, edit in place: the stage and outcome, then one line per review round, QA round, and CI attempt saying only that it happened and how it ended. Counts only — the findings are on disk. If any round left discretionary items declined, add a `**Notes for a human:**` line pointing at the notes that hold them.
2. If the outcome is `stopped`, relabel the issue from `ready-for-agent` to `ready-for-human`.
3. If the outcome is `merged` and the issue is still open, close it.

Outcome: `{ "result": "DONE" }`.
