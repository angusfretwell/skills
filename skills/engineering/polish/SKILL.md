---
name: polish
description: Polish a branch by reviewing, QAing, fixing, and simplifying it in rounds until nothing worth fixing remains. Use when the user asks for a polish or a quick polish, or when another skill needs a branch polished.
argument-hint: "[--quick]"
---

A **round** is one sweep of review passes, then the fixes they earn. The **ledger** is every finding from every round with its **severity** and **disposition**, kept in a file so it survives a restart. Every pass and every fix runs in a sub-agent.

Sub-agents, and the skills they fork, start in the session's launch directory, which can be another checkout or another repository. So every brief names the **checkout**, the absolute path of the branch's working tree, and says to run each command there. Every range names both ends as SHAs, and `/code-review` takes the checkout before its range: `/code-review <effort> <checkout> <from>..<to>`. A `/code-review` run that returns neither findings nor `(none)` failed: the sub-agent re-runs it once, then reviews the range by hand and says so.

## Quick mode

A **quick** polish, asked for by name or with `--quick`, trades depth for speed. It runs the steps below with these overrides:

- Step 1: when no spec turns up, proceed without one. Browser QA is never live.
- Step 2: the plan is the checks and `/code-review` at `medium` effort, plus `/mattpocock-skills:code-review` when there is a spec.
- Step 5: go straight to step 6.
- Step 6: skip `/simplify`.
- Step 8: the opening lines say this was a quick polish and name what it skipped.

## 1. Establish the scope

The fixed point is the one the user named, else the current branch's merge-base with its base branch. Commit the uncommitted changes that belong to the branch's work per `/commit`, so every pass reads the same tree, and leave the rest uncommitted. When the two can't be separated cleanly, ask the user. The resulting HEAD is the **start**: note it in the ledger file. Then record the diff size against the fixed point (`git diff --shortstat`) for the report.

Find the spec once: the one already in this session, issue references in the commit messages, the open PR, or a spec file matching the branch under `docs/`, `specs/`, or `.scratch/`. If none turns up, ask the user once. The spec, or its confirmed absence, goes into every brief.

Browser QA is **live** when the app is browser-driven and the change under review touches something a user sees.

Done when you hold the checkout, the fixed point, the **start**, the diff size, the spec, and whether QA is live.

## 2. Run the passes

Dispatch each pass in the round's plan as its own sub-agent, all in one message, so they run in parallel. Each brief carries the exact commit range to review and the ledger file, so the pass skips findings the ledger holds as **won't fix**, **defer**, **ask**, or **settled**. It names the skill to invoke and asks for the findings back as a list: file, line, one-line claim, why it matters.

Round 1's plan is every pass against the fixed point:

- The **checks**: the project's tests, typecheck, and lint that cover the change. This pass invokes no skill and changes no code. It returns each check's result, and each failure as a finding that says whether the branch caused it.
- `/code-review` at `high` effort.
- `/mattpocock-skills:code-review`.
- `/browser-qa`, when live.

The checks nearly always pass, so they run beside the reviews instead of ahead of them.

The round 1 `/browser-qa` pass also builds the **fixtures**: the test data its flows need. Its brief asks for them back with the findings: each fixture with how to reach it (ID, URL, or sign-in), and where each flow's effects land outside the app, such as a CRM record or an analytics event. Note them in the ledger file. Every later `/browser-qa` brief carries them, so no round rebuilds its data.

Done when every pass in the plan has returned its list. A reply without the list means the pass is still working: message it to finish and send the list.

## 3. Triage

Merge the lists into the ledger, collapsing findings that make the same claim into one entry naming its sources. Then judge each new finding on its face, whatever its pass called it, and give it a severity and a disposition.

The **severity** is measured against the spec, or the intent the commits state when there is none:

- **blocker**: the case the spec intends is wrong.
- **should**: a real bug that callers will hit within the spec.
- **nit**: everything else, including other paths, rare cases, and small costs.

The **disposition**:

- **fix**: valid, and fixed this round.
- **won't fix**: invalid, or the change costs more than it earns. Keep the one-line reason.
- **defer**: valid, but separate work.
- **ask**: the fix is a **one-way door**, as `/merge-risk` defines it, and you lack a strong case for which way to go. Keep the candidate fixes, your recommendation first.
- **settled**: its fix would undo a fix from an earlier round. This is **oscillation**: the earlier fix stands. Name that fix.

A check failure the branch caused is a **blocker**. One it didn't cause is **pre-existing**: a **won't fix**, named in every later brief, so no pass or fix chases it.

A **fix** finding that is a bug an earlier round fixed, back by a new route, is a **recurrence**: that fix was too shallow, so its fix brief names the earlier fix and targets the shared cause.

From round 2 on, a naming finding, test names included, is a **fix** only when the name **misleads**: it claims something the code doesn't do, or contradicts the project's glossary. A name that could merely be better is **won't fix**, so later rounds stop relitigating names earlier rounds chose.

From round 3 on, a **blocker** or **should** is an **ask**, not a **fix**: one that serious this late means the fixes aren't converging, so a human looks. One in security, auth, permissions, data loss, or concurrency stays a **fix** through round 5. This list names bugs worth another round. It is separate from the changes `/merge-risk` calls high-stakes.

Done when every finding in the ledger carries a severity and a disposition.

## 4. Fix

Cluster the **fix** findings by file: one sub-agent per cluster, in parallel, each briefed with its findings. Each brief asks the sub-agent to:

- Confirm each finding holds before changing code.
- Fix the class: find the same bug elsewhere in the code the branch changes and fix those instances too. Note any instance outside it, unfixed.
- Trace every path into the code it changes and run the tests that cover it, so the fix lands no **regression**.
- Return what it changed, which behaviour moved, what it checked and left alone with why, and the instances it noted.

Each item left alone enters the ledger as **won't fix** with that reason, and each noted instance as **defer**. Commit per `/commit`.

Done when every **fix** finding is committed or moved to **won't fix**.

## 5. Plan the next round

When no **blocker** or **should** fix this round changed behaviour, go to step 6.

Otherwise, plan the next round's passes. A **settled** finding this round predicts more oscillation, so lean toward skipping passes, narrower ranges, and lower effort.

- **Range**: the commits since this round began for contained fixes; the fixed point when a fix reshaped the change.
- **Effort**: `low` for small, local fixes; `medium` when a fix changed control flow, error handling, or state shared across callers, or fixed a **recurrence**.
- `/mattpocock-skills:code-review` runs only when a fix changed behaviour.
- `/browser-qa` runs only when live for the fixes' diff.
- After a **dense** round 1, one that fixed many findings, round 2's `/code-review` covers the fixed point: a dense round leaves misses in unchanged code.

Each brief names the fixes behind its range, so the pass hunts **regressions** in them.

Done when you have stated the plan to the user: every pass run or skipped with its reason, and each that runs with its range and, for `/code-review`, its effort. Return to step 2 with the plan.

## 6. Simplify and tidy

Dispatch one sub-agent over the branch diff. It runs `/simplify`, then `/tidy`, committing after each per `/commit`. When either changed code outside tests, it then runs the checks that cover those changes and fixes each failure, so the cleanup lands no **regression**. It returns what each skill changed and each check's result.

Done when simplify's and tidy's changes are committed and their checks pass.

## 7. Squash

When every commit since the **start** is local, squash each run into one commit written per `/commit`: the commits before step 6 into a `fix` commit whose body lists every **fix** finding, then step 6's into a `refactor` commit. Build each with `git commit-tree` from the tree its run ended on, so nothing replays and nothing can conflict.

When any of them is already pushed, the history stays as it is, and the report's opening lines say so.

Done when HEAD's tree is unchanged by the squash and the branch since the **start** holds one commit per run, or the pushed history stands as it was.

## 8. Report

Report in this shape:

- One or two opening lines: whether the branch is ready or has items that need the user, the rounds run, flagging more than three, and the diff size before and after.
- `## Fixed`: each **fix** finding with its severity, one line apiece.
- `## Won't fix`: each with its reason; each **settled** finding names the fix that stands.
- `## Needs you`: each **ask** with its candidate fixes, your recommendation first; then each **defer** as a plain item to act on.
