# Fix findings

Your brief names a findings report — code-review or QA, round `<n>`.

For every item, decide a disposition and act on it:

- **fix** — make the change. This is the default; the bar for anything else is high.
- **won't fix** — a judgment call you're deciding against, with the reasoning written out. The next review round sees it and may dispute it.
- **invalid** — the finding is factually wrong; show why (the line it misread, the behavior it missed).

An item you can't judge from the report alone gets investigated — read the code, reproduce the behavior — before it gets a disposition. An item that is really an unresolvable judgment call is a door.

Write `$STATE_DIR/issues/<id>/<review|qa>-<n>-response.md`: every item from the report with its disposition and, for fixes, what changed. Every item accounted for — no silent drops. Commit using `/commit`, push, and update the PR description using `/open-pr` if the fixes changed what the PR does.

Outcome verdict: `fixed` (all items dispositioned), or `blocked` on a door.
