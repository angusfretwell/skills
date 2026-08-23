---
name: afk-loop
description: Autonomous issue-clearing loop. Run as `/loop /afk-loop`.
argument-hint: "[merge-mode] [concurrency] [cap]"
---

Run this loop per `/supervise`: you plan, dispatch, and merge — investigators, implementers, reviewers, QA agents, and fixers do everything else. The PR is the durable store — findings, logs, and ledgers live there as comments — and each PR's [AFK summary](#afk-summary) is its state file. The numbered steps are **pipeline stages**, not phases: each issue advances the moment it's ready. Each invocation is one **pass**.

Brief sub-agents with **context pointers** — the issue, the PR, prior comments — never with the content itself; what a pointer reaches needs no restating.

The issue tracker should have been provided to you; if it wasn't, stop and ask.

## Settings

Three **settings** govern the loop — `/afk-loop [merge-mode] [concurrency] [cap]`. Take each from the invocation; a default applies silently when the invocation omits its setting.

- **Merge mode** — you merge clean PRs yourself, or **park** them for a human to merge. No default — ask (`AskUserQuestion`, before planning).
- **Concurrency** — how many issues run in flight at once. Default 5.
- **Cap** — how many fix attempts an issue gets before you stop it. Review rounds, QA rounds, and check-fix attempts are counted separately, each capped at this number. Default 5.

Every setting holds for the whole loop.

## Process

### 1. Plan

List the tracker's open issues labeled `ready-for-agent`. A PRD issue with linked implementation issues is never workable — work the implementation issues instead.

Build a dependency graph over the issues and find the frontier per `/dependency-graph`, treating each issue as a work item.

An issue that already has an open PR is resumed, not restarted: launch an investigator with `<investigator-prompt>` and re-enter the pipeline at the stage its state names.

Done when: every open `ready-for-agent` issue is classified as frontier, blocked (by which issues), or PRD.

### 2. Dispatch implementers

Launch one implementer per frontier issue, in the background — at most **concurrency** issues **in flight** at once; the rest wait for a free slot. Prompt each with `<implementer-prompt>`.

When an issue merges, parks, or stops, its slot frees: replan first, then dispatch the next frontier issue into it.

Done when: every frontier issue has exactly one implementer or is waiting for a slot.

### 3. Review rounds

When an implementer returns a PR, launch a reviewer with `<reviewer-prompt>`. Each review is one **round**, numbered in the heading of the comment it posts.

- **`FINDINGS`** → launch a fixer with `<fixer-prompt>` and the payload `ADDRESS: review findings`, then re-review.
- **`CLEAN`** → the issue moves on to QA.
- **`INCOMPLETE`** → the reviewer couldn't complete an axis, so it posted no round. Launch a fresh reviewer for the same round; a second `INCOMPLETE` stops the issue. Never accept a verdict a reviewer couldn't reach, and never relay one yourself — you have not read the code.
- **The round number reaches the cap** → stop the issue (below).

Rounds accumulate on the PR, not within a pass: a PR resumed on a later pass carries on from the round it reached, so the cap holds however many passes it takes to reach. The review and QA comments carry their round counts; the summary carries the check-fix count — attempts a pass spent but died before writing down are forgiven.

### 4. QA rounds

When a review comes back clean, launch a QA agent with `<qa-prompt>`. Each QA pass is one **round**, numbered separately from review rounds in the heading of the comment it posts.

- **`FINDINGS`** → launch a fixer with the payload `ADDRESS: QA findings`, then send the issue back to stage 3: the fix is new code, so it gets a fresh review round before QA sees it again.
- **`CLEAN`** → the issue is ready to merge.
- **`INCOMPLETE`** → the QA agent couldn't exercise the change, so it posted no round. Launch a fresh QA agent for the same round; a second `INCOMPLETE` stops the issue.
- **The round number reaches the cap** → stop the issue (below).

### 5. Merge

You mark a PR ready for review the moment it is mergeable — clean review, clean QA, green checks. Draft says the loop is still working on it; ready says a merge can happen. So for each issue whose QA came back clean, wait for the PR's checks to finish.

- **Green** → mark the PR ready for review, then act on the merge mode: merge it yourself, delete its branch, and remove its worktree, or **park** it — request a human's review and leave it for them. After merging, check the `Closes` reference closed the issue; close it on the tracker yourself if it didn't.
- **Red** → launch a fixer with the payload `ADDRESS: failing checks`, then re-check. Still red once the attempt count reaches the **cap** → stop the issue.
- **Merge conflict** (the merge fails after a sibling PR lands) → launch a fixer with the payload `ADDRESS: merge conflict`, wait for green again, then retry the merge.

A parked PR frees its slot, but its issue stays unmerged and keeps `ready-for-agent` — the loop still owns it, so its dependents stay blocked and later passes keep watching it. On a later pass, one the human has merged counts as merged (close the issue if the `Closes` reference didn't); one still green just waits — its review request stands, request nothing again; one gone red or conflicted converts back to a draft, re-enters the cycles above, and is readied again once green.

## AFK summary

Every PR carries one **summary** comment recording where it got to, written once per pass at the [end of the pass](#end-of-pass). You are its only writer.

It is keyed by its heading, `## AFK summary` — find it by that marker, never by author or position, since your sub-agents' comments share your identity and usually sit later in the thread. Create it on a PR's first summary, edit that same comment forever after.

```
## AFK summary
**State:** NEEDS_REVIEW (round 3)
**Outcome:** —
- Review round 1: findings → addressed
- Review round 2: clean
- QA round 1: findings → addressed
- Checks red → fixed (attempt 1)
```

`State` is the code the investigator returned, or the one the pass's own work left the PR in — the same vocabulary either way, listed in `<states>`. `Outcome` stays `—` until the PR reaches a terminal state, then names it: merged, awaiting a human's merge, review cap hit, QA cap hit, check cap hit, a review or QA round it couldn't complete, or a one-way door — that last one named and nothing more, since the sub-agent's `## AFK one-way door` comment sits on this same PR.

The summary **counts, it never explains** — a round happened, a check went red, an attempt was spent. If writing a line would mean opening a log, a diff, or another comment, leave it out — whatever it says is already on this PR, one comment away.

## Stopping an issue

A stopped issue's `ready-for-agent` label flips to `ready-for-human`: the loop is done with it. The flip is always yours to make, whatever the cause —

- **One-way door** — an implementer or fixer returns `STOPPED: <the question>` (per `<one-way-doors>`).
- **Cap hit** — review rounds, QA rounds, or check-fix attempts reached the **cap**.
- **Review or QA unreachable** — two reviewers, or two QA agents, running the same round both returned `INCOMPLETE`.

— and where the explanation goes depends on how far the issue got:

- **No PR** — the issue gets the comment, written by the sub-agent that hit the door. Only a one-way door reaches here; a cap hit needs a PR to have been capped on.
- **PR open** — the PR carries it and the issue gets no comment: a one-way door as the sub-agent's own `## AFK one-way door` comment, a cap hit or an unreachable round as the summary's `Outcome`. Either way one place, written by whoever held the context. The PR stays a draft; convert it back to one if it had already been readied.

## End of pass

The pass is done when nothing is in flight: every dispatched issue is merged, parked, or stopped. Write the summary of every PR the pass moved — one write each, now that the thread has settled — then a status line: issues merged, parked (awaiting a human's merge), stopped (and why), still blocked. Then:

- Any open `ready-for-agent` issue remains, or a parked PR awaits its human → schedule the next wakeup with the same `/afk-loop` prompt, restating all three settings so the next pass resolves them from the invocation and asks nothing: at the minimum delay while issues remain, or the maximum delay when only parked PRs do.
- Frontier empty, no parked PRs, and every remaining issue blocked → stop the loop, with the final status as your summary.

## Dispatch prompts

Compose every dispatch from these templates: copy the matching template verbatim, fill `{{ISSUE_ID}}` with the issue's tracker id, then append the blocks the template names, the fixer's one-line `ADDRESS: …` payload last.

<investigator-prompt>

You establish where one issue's open PR left off and return its state.

1. Read the PR for issue {{ISSUE_ID}}: its `## AFK summary` comment if it has one, its `## AFK review findings`, `## AFK review clean`, `## AFK review response`, `## AFK QA findings`, `## AFK QA clean`, and `## AFK QA response` comments, its checks, whether it is a draft, and its commits since the most recent review or QA comment.
2. Where the summary and the PR's actual state disagree, the PR wins — a pass can end mid-stage after its last write.
3. Return exactly one state from the `<states>` block at the end of this prompt, with its round or attempt number where the state takes one. Return the bare state; never the findings themselves.

Append: `<states>`.

</investigator-prompt>

<implementer-prompt>

You implement one issue end-to-end in an isolated worktree and leave an open PR.

1. Fetch issue {{ISSUE_ID}} from the tracker. It is your spec — title, body, and comments all count.
2. Create a worktree on branch `afk/{{ISSUE_ID}}` — a new branch, or the existing one if a prior attempt left it behind — and work from it.
3. Implement the issue, use `/tdd` where the work has a testable seam. After each green, self-contained slice, run `/commit`.
4. Typecheck after each slice and run single test files as you go; run the project's full check suite at the end.
5. Push, then run `/open-pr`, opening the PR as a **draft**. The PR body must contain `Closes {{ISSUE_ID}}`.
6. Return the PR reference.

Stop immediately when the issue turns on a **one-way door** — follow the procedure at the end of this prompt.

Append: `<one-way-doors>`.

</implementer-prompt>

<worktree-preamble>

1. Enter the issue's worktree — the one on branch `afk/{{ISSUE_ID}}` — and confirm `git status` shows that branch. Every later step runs from here.
2. Fetch issue {{ISSUE_ID}} from the tracker. It is the spec — title, body, and comments all count.

</worktree-preamble>

<reviewer-prompt>

You review one issue's implementation, post findings on its PR, and return a verdict.

3. Fetch the PR's comments headed `## AFK review findings` — those, and only those, carry prior rounds' items — together with the `## AFK review response` comment answering the most recent. Check each of that round's items against the current code: one the fixer fixed but didn't genuinely address stays a finding; one it won't-fixed stands or falls on its reasoning — accept it and the item is settled, or reject it and re-raise the item marked **disputed**.
4. Run `/code-review` on the branch — the changes since its merge-base with the default branch. It fans out one sub-agent per axis; brief each to **return** its report, never to message it — you are a sub-agent yourself, so nothing it dispatches can address you by name, and a report it messages instead lands somewhere you will never read. Review the code, not the checks: don't run tests, lint, or typecheck — CI runs those, and stage 5 acts on what it finds.
5. Every round ends in a single PR comment, numbered round N — one past the highest round already on the PR: findings under `## AFK review findings (round N)`, each with file, line, what's wrong, and what correct looks like; a clean round under `## AFK review clean (round N)`, saying only that it found nothing. Then return the bare verdict — `FINDINGS` or `CLEAN` — never the findings themselves.

Prepend: `<worktree-preamble>`. Append: `<unread-reports>`.

</reviewer-prompt>

<qa-prompt>

You QA one issue's implementation, post findings on its PR, and return a verdict.

3. Fetch the PR's comments headed `## AFK QA findings` — those, and only those, carry prior QA rounds' items — together with the `## AFK QA response` comment answering the most recent. Re-exercise each of that round's items against the current code: one the fixer fixed but didn't genuinely address stays a finding; one it won't-fixed stands or falls on its reasoning — accept it and the item is settled, or reject it and re-raise the item marked **disputed**.
4. Run `/verify` on the PR, the issue's acceptance criteria as its criteria. Drive the app in a sub-agent briefed to **return** its evidence — never to message it — so the logs and screenshots stay out of your context. Exercise the behaviour, not the checks: don't run tests, lint, or typecheck — CI runs those, and stage 5 acts on what it finds.
5. Every round ends in a single PR comment, numbered round N — one past the highest QA round already on the PR: findings under `## AFK QA findings (round N)`, one per failed criterion, with the steps taken, what happened, and what correct looks like; a clean round under `## AFK QA clean (round N)`, saying only that every criterion passed, or that there was nothing to exercise. Then return the bare verdict — `FINDINGS` or `CLEAN` — never the findings themselves. A criterion left untested, or an app that will not run, is `INCOMPLETE`, never clean.

Prepend: `<worktree-preamble>`. Append: `<unread-reports>`.

</qa-prompt>

<unread-reports>

A report you did not read is a report you do not have. A sub-agent that returns nothing — it stalls, it dies, or it messaged its findings away — is **missing**, not clean: re-run it inline and read what it finds, or — if it comes back empty again — post no round and return the bare verdict `INCOMPLETE`. Never write an item, or a clean verdict, from what you expected it to say; a round reconstructed from anticipation reads exactly like a real one, and everything downstream trusts it.

</unread-reports>

<fixer-prompt>

You fix issue {{ISSUE_ID}}'s open PR — review findings, QA findings, failing checks, or a merge conflict, whichever the `ADDRESS:` line at the end of this prompt names — and push what you change to the same branch. Fetch the work from the PR yourself.

3. Work the case the `ADDRESS:` line names, per its section below.
4. Where you changed code, typecheck, run the affected tests, commit with `/commit`, and push (after a rebase, push with `--force-with-lease`). If what landed leaves the PR's title or body stale — scope or approach they no longer describe — run `/open-pr` to refresh them; the PR stays a draft.
5. For review or QA findings, post the round's ledger last — after the push, so it records what landed: a single PR comment headed `## AFK review response (round N)` or `## AFK QA response (round N)`, matching the heading and N of the findings comment you answered, one line per item giving its disposition and what you did. The diff carries the code; this carries the calls.
6. Return `ADDRESSED` — or, if anything turned on a **one-way door**, follow the procedure at the end of this prompt. The door comes last: steps 4 and 5 still run first, so the other items land and the ledger records the round before you stop.

**Review findings** / **QA findings** — fetch the PR's most recent `## AFK review findings` or `## AFK QA findings` comment, whichever the `ADDRESS:` line names, and **triage** every item onto a **disposition** before you change any code:

- **fix** — the default. Make the fix the item describes; where none is described, fix what it names. Where the item has a testable seam, fix it with `/tdd` — the finding is the red test.
- **investigate** — the item seems off. Read the code it names, then settle it into fix or won't fix.
- **won't fix** — the item is wrong, or it is minor and discretionary and you judge against it.
- **one-way door** — the call is bigger than a won't fix, or the item arrived marked **disputed**: the reviewer rejected a won't fix and the standoff is the human's to settle. This item's ledger line names the door, and the door comment itself follows the procedure at the end of this prompt.

**Failing checks** — fetch the failing check's output from the PR (`gh pr checks`, then the failing run's log), reproduce locally where possible, fix, and confirm the command passes.

**Merge conflict** — fetch and rebase onto the default branch, resolving with `/resolving-merge-conflicts`.

Prepend: `<worktree-preamble>`. Append: `<one-way-doors>`, then the `ADDRESS:` line.

</fixer-prompt>

<one-way-doors>

A **one-way door** is an open question you can't safely decide: the spec is ambiguous, contradicts the codebase, or the choice would be expensive to reverse (data migration, public API shape, irreversible deletion, money flow). One-way doors are for humans, so surface the decision instead of making it:

1. Comment naming the question and the options you considered, headed `## AFK one-way door` — on the PR if one is open, otherwise on the issue. You hold the context here, so this comment is the record; your supervisor only notes that you hit one.
2. Return `STOPPED: <the question>` instead of your normal result.

</one-way-doors>

<states>

A PR is in exactly one of these states. Return the code verbatim, with its number where the code takes one:

- **`NEEDS_REVIEW (round N)`** — the code is waiting on its Nth review, N one past the highest review round on the PR: no review comments exist yet, the most recent review round's findings have their `## AFK review response`, or a `## AFK QA response` postdates the most recent `## AFK review clean`.
- **`NEEDS_FIXES (round N)`** — review round N posted findings that no `## AFK review response (round N)` comment answers yet.
- **`NEEDS_QA (round N)`** — an `## AFK review clean` is the most recent review or QA comment, and N is one past the highest QA round on the PR.
- **`NEEDS_QA_FIXES (round N)`** — QA round N posted findings that no `## AFK QA response (round N)` comment answers yet.
- **`AWAITING_CHECKS`** — an `## AFK QA clean` comment settles QA, and checks are still running.
- **`NEEDS_CHECK_FIXES (attempt N)`** — checks are red.
- **`NEEDS_CONFLICT_RESOLUTION`** — the branch conflicts with the default branch.
- **`AWAITING_HUMAN_MERGE`** — ready for review, green, and left for a human to merge.
- **`MERGED`** — already merged.
- **`STOPPED`** — the summary's `Outcome` names a cap hit, an unreachable round, or a one-way door.

</states>
