# Survey

Establish the tick's ground truth and hand it back as one table. You read; you change nothing.

Your header gives the tracker, the triage label vocabulary, and `$STATE_DIR`. Load /herdr — lease liveness comes from it.

## Issue set

The union of the issues carrying the ready-for-agent label and every `$STATE_DIR/issues/<id>/state.json`. An issue past ship has dropped the label but still needs watching.

## Per issue

`state.json` records the stage; everything else you re-derive from reality, and where the two disagree reality wins.

- **PR** — absent, open, merged, or closed unmerged; mergeable or conflicted.
- **CI** — green, red, or pending on the latest push.
- **Leases** — for each one in `state.json`, whether herdr shows that agent working, idle, or gone.
- **Outcomes** — the files under `outcomes/` that the recorded stage has not yet ingested.
- **Slices** — implemented where the outcome file exists, merged where the slice branch is an ancestor of the issue branch.
- **Retro** — for an issue at `ship` or beyond: whether `$STATE_DIR/retros/<id>.md` exists.

## Across issues

Run /dependency-graph over the set; a dependency clears only when the blocker's PR is **merged**. The frontier is the ready issues with no uncleared blockers.

## Return

A markdown table, one row per issue, carrying the fields above. Then the frontier; then each door in `$STATE_DIR/doors/` by id with its answer pending or given; then each advisory in `$STATE_DIR/advisories/` by id whose **Disposition** is pending.

Paths only, never contents — reports, findings, and diffs stay unread. Table and lists, no narrative.
