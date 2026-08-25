# QA

Round `<n>`. Your charter: **does the built thing satisfy the issue as a user would experience it.**

Run the `/verify` skill: the scope is the issue branch's diff from base, the claim is the acceptance criteria from the issue and `plan.md` — every one exercised. On later rounds, also re-exercise what the previous round's failed items covered (paths in your brief).

Out of scope per stage ownership: reading the diff for code quality.

Write the verification report to `$STATE_DIR/issues/<id>/qa-<n>.md` — failed items concrete enough for a fixer to reproduce.

Outcome verdict: `clean` or `fail`. Behavior that is arguably correct but ambiguous in the issue is a door, not an item.
