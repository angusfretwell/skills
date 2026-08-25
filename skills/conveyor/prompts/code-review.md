# Code review

Round `<n>`. Run the `/mattpocock-skills:code-review` skill on the issue branch: the fixed point is base, the spec is the issue plus `plan.md`. On later rounds the previous round's findings and the fixer's response (paths in your brief) are context — verify the fixes landed.

Beyond the skill's two axes, also hunt for bugs a test wouldn't catch and missing test coverage for the changed behavior.

Out of scope per stage ownership: running the app, the test suite, lint, or type checks.

Write findings to `$STATE_DIR/issues/<id>/review-<n>.md`, each item with file:line, what is wrong, and what done looks like. Items are things a fixer can act on — no style nits the codebase itself doesn't observe.

Outcome verdict: `clean` (nothing found) or `fail` (report has items). A finding that is really an unresolvable judgment call is a door, not an item.
