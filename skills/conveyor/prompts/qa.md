# QA

Round `<n>`. Run /browser-qa: the scope is the diff from base, the spec is the acceptance criteria from the issue and `PLAN.md`. On later rounds, also re-exercise what the previous round's failed items covered.

Write findings to `$STATE_DIR/issues/<id>/qa-<n>.md` — failed items concrete enough for a fixer to reproduce. Save the screenshots and recordings you capture to `$STATE_DIR/issues/<id>/artifacts/qa-<n>/`.

Outcome verdict: `clean` or `fail`.
