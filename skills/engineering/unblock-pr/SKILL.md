---
name: unblock-pr
description: Get an open PR's checks passing by rerunning transient failures, fixing real ones, and resolving conflicts. Use when a PR has failed checks or conflicts, or when another skill needs a PR green.
argument-hint: "[<pr>] [--cap <n>]"
---

You carry one open PR to **green**: every check passing on its head commit. Work in a checkout of its head branch. The **base** is the PR's base branch. Every push goes plainly on top of the branch's history, with the base brought in by merge.

## Inputs

A caller sets these in its brief. A run with no caller takes the defaults.

- The **cap** is how many pushes the run may make: three, or `--cap <n>`. A conflict resolution counts as a push, and a rerun doesn't. A run that needs a push beyond the cap stops **stuck**.
- The **wait** is how you block on the head commit's checks: `gh pr checks <n> --watch`. It covers every check, required or not, apart from any the caller names as not counting. A caller's wait may end your turn, or return at the first failure.
- The **escalation** is how you put a question to a human: ask the user, when this session has one who can answer. A question with no escalation, or no reply through it, is **unanswered**.

## 1. Clear conflicts

Read `gh pr view <n> --json mergeable`. GitHub computes it lazily, so re-query `UNKNOWN` until it settles. Conflicts come before the wait because GitHub starts no `pull_request` workflow on a branch that conflicts.

On `CONFLICTING`, merge the base into the branch and resolve each hunk from both sides' intent, read from the commits and PRs behind them. A hunk that turns on intent those sources don't settle goes to the escalation, asking which side wins: a guessed resolution costs more than a wait. When it's unanswered, run `git merge --abort` and stop **stuck**. Otherwise keep git's default message on the merge commit and push.

Done when the PR has no conflict.

## 2. Wait

Run the wait. `gh pr checks` can report no checks just after a push, so retry for a few minutes. When none ever appear, the PR runs no checks: stop **green** and say so.

When the wait returns, re-read `mergeable`: a conflict goes back to step 1.

Done when the wait has returned and the PR has no conflict.

## 3. Classify

List the checks with `gh pr checks <n> --json name,bucket,link`. A check has failed when its bucket is `fail` or `cancel`. For each failed check, read the failed step with `gh run view <run-id> --log-failed`, taking the run ID from its `link`. Give it the first class that fits:

1. **Shared**: the base's latest completed run of the same workflow fails the same step the same way. The base is red, and that isn't the PR's to fix.
2. **Transient**: the failure traces to nothing the PR changes, such as a timeout or a runner, network, or install error, and its run is on its first attempt (`gh run view <run-id> --json attempt`).
3. **Real**: everything else, including any check from outside GitHub Actions, which `gh` can't rerun.

Then take the first that applies:

1. A **real** failure goes to step 4, and its push reruns every check.
2. A **transient** failure gets `gh run rerun <run-id> --failed`, then back to step 2.
3. A check still pending goes back to step 2.
4. With only **shared** failures left, stop **main red**.
5. Otherwise every check passes: stop **green**.

Done when every failed check has a class and the next move is taken.

## 4. Fix

Fix the cause of every **real** failure in one push, with the failing step's command, run locally, as your loop. Verify a step that can't run locally through the push itself. A test changes only when the PR deliberately changed what it pins. GitHub runs `pull_request` workflows on the branch merged into the base, so a failure that won't reproduce may need the base merged first.

When a cause isn't plain from the log and the diff, diagnose it with `/mattpocock-skills:diagnosing-bugs` on that loop, sending its questions for a human to the escalation. Stop **stuck** on a cause outside the branch, such as an expired secret or an outage, or on a question left unanswered.

Commit per `/commit`, push, and go back to step 1.

Done when the fix is pushed or the run has stopped.

## 5. Report

Open with the PR's head SHA and the outcome:

- **green**: every check passes.
- **main red**: the only failures left are ones the base shares.
- **stuck**: the cap ran out, a merge was aborted, or a cause is out of reach.

Then give the pushes made and each comment or review that arrived. Those stay with the PR's author, unanswered.

When **stuck**, comment on the PR per `/humanize` with what still fails, why, and what would unblock it. Whether the PR becomes a draft is the caller's call.

Done when the report is written and any comment is posted.
