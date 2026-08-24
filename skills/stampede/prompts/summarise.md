Read {{STATE_DIR}}/state.json. Tracker label mapping: {{LABEL_MAP}}.

1. If it names a PR, upsert ONE comment on it headed `## AFK summary` — find it by that heading; create it if absent, else edit it in place:
   **State:** <stage> (round/attempt N where it applies)
   **Outcome:** <outcome, or —>
   then one line per review round, QA round, and CI attempt, each saying only that it happened and how it ended (findings → addressed, clean, red → fixed). Counts only — the findings are on disk. If any review round left discretionary items declined by the fixer, add a final `**Notes for a human:**` line pointing at the review-*.md files that hold them.
2. If outcome is `stopped`, relabel the issue from the mapping's `ready-for-agent` to its `ready-for-human`.
3. If outcome is `merged` and the issue is still open, close it.
Outcome: `{ "result": "DONE" }`.
