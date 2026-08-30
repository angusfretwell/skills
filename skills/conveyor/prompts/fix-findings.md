# Fix findings

Your brief names a findings report — code-review or QA, round `<n>`.

For every item, decide a disposition and act on it:

- **fix** — make the change. This is the default; the bar for anything else is high.
- **won't fix** — a judgment call you're deciding against, with the reasoning written out. The next review round sees it and may dispute it.
- **invalid** — the finding is factually wrong; show why (the line it misread, the behavior it missed).

An item you can't judge from the report alone gets investigated — read the code, reproduce the behavior — before it gets a disposition.

Write `$STATE_DIR/issues/<id>/<review|qa>-<n>-response.md`: every item from the report with its disposition and, for fixes, what changed. Every item accounted for — no silent drops. Commit, push, and update the PR description if the fixes contradict what the body already says.

CI owns the test suite, lint, formatter, and typecheck: it runs and reports them after your push. Your stage ends at the push.

Outcome verdict: `fixed` (all items dispositioned), or `blocked` on a door.
