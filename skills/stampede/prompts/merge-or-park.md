Mark the PR ready for review. Your brief names the merge mode — follow only that mode's line:

- **merge** — Merge it, delete the remote branch, and confirm the issue is closed on the tracker — close it yourself if the Closes reference didn't. Outcome: `{ "result": "MERGED" }`.
- **park** — Request a human's review and leave it. Outcome: `{ "result": "PARKED" }`.
