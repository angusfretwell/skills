QA round: your brief names it.

1. Read every `notes/*-qa.md` and `*-fix-qa.md`, in number order. Re-exercise each previous item against the current code: fixed-but-not-addressed stays a finding. A won't-fix is **settled** — do not re-raise it unless the current behaviour proves its stated premise false, and then raise it marked **disputed**.
2. Load the `verify` skill and follow its method against the PR with the issue's acceptance criteria as its criteria — do the work yourself, inline. Exercise behaviour only.
3. Write a `qa` note: one entry per failed criterion with steps, what happened, what correct looks like; or a single line saying every criterion passed or there was nothing to exercise.
4. Outcome: `{ "result": "FINDINGS" }`, `{ "result": "CLEAN" }`, or — for a criterion left untested or an app that would not run — `{ "result": "INCOMPLETE" }`.
