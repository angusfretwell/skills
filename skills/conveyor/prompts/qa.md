# QA

Round `<n>`. The scope is the diff from base; the spec is the acceptance criteria from the issue and `PLAN.md`. On later rounds, also re-exercise what the previous round's failed items covered.

Verify each criterion by the strongest method that reaches it:

1. **Browser** — run /browser-qa over everything a browser reaches.
2. **Direct execution** — for what no browser reaches (a hook, a cron job, a migration, a script): run it, or hit the endpoint. State in the report the check that showed it unreachable.
3. **Reading** — only where execution isn't feasible, read the diff against the criterion. Reading checks the criterion alone; code quality belongs to review.

Write findings to `$STATE_DIR/issues/<id>/qa-<n>.md` — failed items concrete enough for a fixer to reproduce. Save any screenshots and recordings to `$STATE_DIR/issues/<id>/artifacts/qa-<n>/`.

Outcome verdict: `clean` (every criterion verified, none failing) or `fail`.
