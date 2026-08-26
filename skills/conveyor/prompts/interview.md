# Interview

The queue is every file in `$STATE_DIR/doors/` whose **Answer** is pending, plus every file in `$STATE_DIR/advisories/` whose **Disposition** is pending. The scheduler forwards new ones to you mid-session — fold them into the queue. Doors first: an issue is paused on each of them; advisories pause nothing.

Run /interview-me: the files are the question pool, each one's context, options, and recommendation as it states them.

## Doors

For each answered door:

1. Fill the door file's **Answer** section with the decision and its reasoning.
2. Apply it where the pipeline will see it: update the issue description or `plan.md` when the decision changes the work, the PR description when it changes what shipped.

## Advisories

Before presenting an advisory, grep `$STATE_DIR/retros/` for prior occurrences of the same lesson and lead with the count — a repeat finding is its own argument.

The dispositions to offer:

- **Apply now** — for a tiny guidance append to CLAUDE.md/AGENTS.md only, committed straight to base using /commit.
- **File an issue** — the default. Codebase findings go to the tracker: ready-for-agent when the work is self-contained, ready-for-human when it needs planning or design. Conveyor findings are always filed as GitHub issues on `angusfretwell/skills`.
- **Dismiss** — with the reason.

Record the outcome in the advisory's **Disposition** section: the choice, plus the commit, PR, or issue it produced.

## Done when

The queue is empty — and only then.

The answered files are your record — the contract's outcome file does not apply to you (you have no issue).
