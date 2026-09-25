---
name: finish
description: Review, QA, fix, and simplify a branch in rounds until nothing worth fixing remains, committing as it goes.
disable-model-invocation: true
argument-hint: "[fixed-point] [--pr]"
---

A **round** is one sweep of review passes, then the fixes they earn. The **ledger** is every finding from every round with its **disposition**. Your context holds the ledger; every pass and every fix runs in a sub-agent, and you plan, triage, and integrate.

## 1. Establish the scope

The fixed point is the argument, else the merge-base with the default branch. Commit any uncommitted changes per `/commit` first, so every pass reads the same tree.

Find the spec once: issue references in the commit messages, the open PR, or a spec file matching the branch under `docs/`, `specs/`, or `.scratch/`. If none turns up, ask the user once. The spec, or its confirmed absence, goes into every brief.

Browser QA is **live** when the app is browser-driven and the change under review touches something a user sees.

Done when you hold the fixed point, the spec, and whether QA is live.

## 2. Run the passes

Dispatch each pass in the round's plan as its own sub-agent, all in parallel. Each brief carries the spec, the exact commit range to review (`<from>..HEAD`), and the ledger's **won't fix** and **defer** entries so they are not raised again. It names the skill to invoke and asks for the findings back as a list: file, line, one-line claim, why it matters.

Round 1's plan is every pass against the fixed point:

- `/code-review` at `high` effort.
- `/mattpocock-skills:code-review`.
- `/browser-qa`, when live.

Later rounds run the plan made in step 5.

Done when every pass in the plan has returned its list.

## 3. Triage

Merge the lists into the ledger, collapsing findings that make the same claim into one entry naming its sources. Then give each new finding its disposition, on its face:

- **fix**: valid, and fixed this round.
- **won't fix**: invalid, or the change costs more than it earns. Keep the one-line reason.
- **defer**: valid, but separate work.
- **ask**: the fix is hard to reverse and you lack a strong case for which way to go. Hard to reverse looks like a public API's surface, a schema or migration, deleting data, or a rename that ripples past the diff.

A finding whose root cause was already fixed in an earlier round is **oscillation**, even when it arrives by a different route: **defer** it, note the oscillation, and end the loop after this round.

Put the **ask** findings to the user in one `/interview-me` batch: each finding a question, the candidate fixes plus **won't fix** and **defer** as options, your recommendation first. Their answers become the dispositions.

Done when every finding in the ledger carries **fix**, **won't fix**, or **defer**.

## 4. Fix

Cluster the **fix** findings by file: one sub-agent per cluster, in parallel, each briefed with its findings and the spec. Each brief asks the sub-agent to trace every path into the code it changes and run the tests that cover it, so the fix lands no **regression**, and to return what it changed and which behaviour moved. Commit per `/commit`.

Done when every **fix** finding is committed.

## 5. Plan the next round

When this round fixed nothing, or on oscillation, go to step 6.

Otherwise, weigh what the fixes touched and plan the next round's passes. For each pass, choose whether it runs, its range, and for `/code-review` its effort:

- **Range**: the commits since this round began for contained fixes; the fixed point when a fix reshaped the change.
- **Effort**: `low` or `medium` for small, local fixes; `high` when a fix changed control flow, error handling, or state shared across callers.
- `/mattpocock-skills:code-review` runs only when a fix changed behaviour.
- `/browser-qa` runs only when live for the fixes' diff.

Each brief names the fixes behind its range, so the pass hunts **regressions** in them.

Done when every pass is marked run or skipped, and each that runs has its range and, for `/code-review`, its effort. Return to step 2 with the plan.

## 6. Simplify

Dispatch `/simplify` in a sub-agent over the branch diff, once, and commit per `/commit`.

Done when simplify's changes are committed.

## 7. Close

With `--pr`, open or refresh the PR per `/open-pr`.

Report: rounds run (flag more than three), each later round's plan, findings fixed, **won't fix** with reasons, deferrals as a plain list for the user to act on, passes skipped and why, and the PR URL when there is one.
