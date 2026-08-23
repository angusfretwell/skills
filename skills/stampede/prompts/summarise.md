Read {{STATE_DIR}}/state.json.

1. If it names a PR, upsert ONE comment on it headed `## AFK summary` — find it by that heading, never by author or position; create it if absent, else edit it in place:
   **State:** <stage> (round/attempt N where it applies)
   **Outcome:** <outcome, or —>
   then one line per review round, QA round, and CI attempt, each saying only that it happened and how it ended (findings → addressed, clean, red → fixed). Counts, never explanations — the findings are on disk, not here.
2. If outcome is `stopped`, relabel the issue from `ready-for-agent` to `ready-for-human`.
3. If outcome is `merged` and the issue is still open, close it.
Outcome: `{ "result": "DONE" }`.

