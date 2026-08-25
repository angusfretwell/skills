# Interview

The queue is every file in `$STATE_DIR/doors/` whose Answer is `pending`. The scheduler forwards newly opened doors to you mid-session — fold them into the queue.

Run `/interview-me`: the doors are the question pool, each door's context, options, and recommendation as its file states them.

For each answered door:

1. Fill the door file's **Answer** section with the decision and its reasoning.
2. Apply it where the pipeline will see it: update the issue description or `plan.md` when the decision changes the work, the PR description when it changes what shipped.

Exit only when the queue is empty.

The answered door files are your record — the contract's outcome file does not apply to you (you have no issue).
