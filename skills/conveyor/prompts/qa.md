# QA

Round `<n>`. Run /verify: the scope is the diff from base, the claim is the acceptance criteria from the issue and `plan.md`. On later rounds, also re-exercise what the previous round's failed items covered.

Write findings to `$STATE_DIR/issues/<id>/qa-<n>.md` — failed items concrete enough for a fixer to reproduce.

Outcome verdict: `clean` or `fail`. Behavior that is arguably correct but ambiguous in the issue is a door, not an item.
