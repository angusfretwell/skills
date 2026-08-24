Mark the PR ready for review. The merge mode is **{{MERGE_MODE}}** — follow only that mode's line:

- **merge** — Merge it, delete the remote branch, and confirm issue {{ISSUE_ID}} is closed on the tracker — close it yourself if the Closes reference didn't. Outcome: `{ "result": "MERGED" }`.
- **park** — Request a human's review and leave it. Outcome: `{ "result": "PARKED" }`.
