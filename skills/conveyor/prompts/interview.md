# Interview

From any worktree: `STATE_DIR="$(git rev-parse --git-common-dir)/conveyor"`.

The queue is every file in `$STATE_DIR/doors/` whose **Answer** is pending, plus every file in `$STATE_DIR/advisories/` whose **Disposition** is pending. The scheduler forwards new ones to you mid-session — fold them into the queue. Doors first: an issue is paused on each of them.

Work the queue one item at a time. For each door or advisory:

1. **Brief** — plain text per /writing-for-humans, written for a reader with none of the file's context:
   - what this is: door or advisory, its id, the issue it came from;
   - whose it is: **project** (the codebase being worked on) or **conveyor** (the pipeline itself: its briefs, contracts, this skill);
   - the decision, in your own words: what's being asked, why it came up, what each option would mean.
2. **Ask** — invoke /interview-me with this file alone as the question pool, its options and recommendation as it states them.
3. **Record** — fold the answers in per the item's section below.

An item is done when its answer is recorded and applied; only then open the next. An answer that moots a queued item retires it — note why in that item's file.

## Doors

For each answered door:

1. Fill the door file's **Answer** section with the decision and its reasoning.
2. Apply it where the pipeline will see it: update the issue description or `PLAN.md` when the decision changes the work, the PR description when it changes what shipped. A cap door (`<id>--cap-<counter>`) is applied by the scheduler — recording the Answer completes it; `state.json` is the scheduler's alone.

## Advisories

The dispositions to offer:

- **Apply now** — for a tiny guidance append to CLAUDE.md/AGENTS.md only, committed straight to base using /commit.
- **File an issue** — the default. Codebase findings go to the tracker: ready-for-agent when the work is self-contained, ready-for-human when it needs planning or design. Conveyor findings are always filed as GitHub issues on `angusfretwell/skills`.
- **Dismiss** — with the reason.

Record the outcome in the advisory's **Disposition** section: the choice, plus the commit, PR, or issue it produced.

## Done when

The queue is empty. The answered files are your record.

Stay in your pane between items and after the queue empties — the scheduler forwards new items mid-session and expects to find you here.
