QA round {{ROUND}}.

1. Read every {{STATE_DIR}}/notes/*-qa.md and *-fix-qa.md — number order is chronological. Re-exercise each of the previous round's items against the current code: fixed-but-not-addressed stays a finding. A won't-fix is **settled** — do not re-raise it unless the current behaviour proves its stated premise false, and then raise it marked **disputed**.
2. Load the `verify` skill with the Skill tool and follow its method against the PR with the issue's acceptance criteria as its criteria — do the work yourself, inline. Exercise behaviour only.
3. Write {{STATE_DIR}}/notes/<number>-qa.md: one entry per failed criterion with steps, what happened, what correct looks like; or a single line saying every criterion passed or there was nothing to exercise. Patch `{ "qaRound": {{ROUND}} }` into state.json.
4. Outcome: `{ "result": "FINDINGS" }`, `{ "result": "CLEAN" }`, or — for a criterion left untested or an app that would not run — `{ "result": "INCOMPLETE" }`.
