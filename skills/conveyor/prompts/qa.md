# QA

Round `<n>`. Your charter: **does the built thing satisfy the issue as a user would experience it.**

In the issue worktree, run the built-in `/verify` skill against the issue's acceptance criteria (from the issue and `plan.md`). On later rounds, also re-exercise what the previous round's failed items covered (paths in your brief).

Out of scope per stage ownership: reading the diff for code quality.

Translate the verification report into `$STATE_DIR/issues/<id>/qa-<n>.md`: for each failed item, pair the report's step (what you did, what happened) with what the issue says should happen — concrete enough for a fixer to reproduce.

Outcome verdict: `clean` or `fail`. Behavior that is arguably correct but ambiguous in the issue is a door, not an item.
