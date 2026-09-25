---
name: finish
description: Review, QA, fix, and simplify a branch in rounds until nothing worth fixing remains, committing as it goes.
disable-model-invocation: true
argument-hint: "[fixed-point] [--pr]"
---

A **round** is one sweep of the passes over the branch, then the fixes they earn. The **ledger** is every finding from every round with its **disposition**. Your context holds the ledger; every pass and every fix runs in a sub-agent, and you plan, triage, and integrate.

A pass is **stale** when the tree changed since it last ran; on the first round, the whole branch is that change. Every round runs every stale pass.

## 1. Establish the scope

The fixed point is the argument, else the merge-base with the default branch. Commit any uncommitted changes per `/commit` first, so every pass reads the same tree.

Find the spec once: issue references in the commit messages, the open PR, or a spec file matching the branch under `docs/`, `specs/`, or `.scratch/`. If none turns up, ask the user once. The spec, or its confirmed absence, goes into every brief.

Browser QA is **live** when the app is browser-driven and the stale change touches something a user sees.

Done when you hold the fixed point, the spec, and whether QA is live.

## 2. Run the passes

Dispatch each pass as its own sub-agent, all in parallel. Each brief carries the fixed point and the spec, names the skill to invoke, and asks for the findings back as a list: file, line, one-line claim, why it matters.

- `/code-review` at `high` effort against the fixed point.
- `/mattpocock-skills:code-review` since the fixed point.
- `/browser-qa`, when live.

Done when every pass has returned its list.

## 3. Triage

Merge the lists into the ledger, collapsing findings that make the same claim into one entry naming its sources. Then give each new finding its disposition, on its face:

- **fix**: valid, and fixed this round.
- **won't fix**: invalid, or the change costs more than it earns. Keep the one-line reason.
- **defer**: valid, but separate work.
- **ask**: the fix is hard to reverse and you lack a strong case for which way to go. Hard to reverse looks like a public API's surface, a schema or migration, deleting data, or a rename that ripples past the diff.

A finding that comes back after being fixed in an earlier round is **oscillation**: **defer** it, note the oscillation, and end the loop after this round.

Put the **ask** findings to the user in one `/interview-me` batch: each finding a question, the candidate fixes plus **won't fix** and **defer** as options, your recommendation first. Their answers become the dispositions.

Done when every finding in the ledger carries **fix**, **won't fix**, or **defer**.

## 4. Fix

Cluster the **fix** findings by file: one sub-agent per cluster, in parallel, each briefed with its findings and the spec and asked to return what it changed. Commit per `/commit`.

Then dispatch `/simplify` in a sub-agent over the branch diff, when stale, and commit again.

Done when every **fix** finding is committed and simplify is no longer stale.

## 5. Loop or stop

Start another round from step 2 when this round changed code. Stop when it changed nothing, or on oscillation.

## 6. Close

With `--pr`, open or refresh the PR per `/open-pr`.

Report: rounds run (flag more than three), findings fixed, **won't fix** with reasons, deferrals as a plain list for the user to act on, passes skipped and why, and the PR URL when there is one.
