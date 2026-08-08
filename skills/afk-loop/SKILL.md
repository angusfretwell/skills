---
name: afk-loop
description: Autonomous issue-clearing loop. Run as `/loop /afk-loop`.
argument-hint: "[merge-mode] [concurrency] [cap]"
---

You are the **supervisor**. You plan, dispatch sub-agents, and merge — investigators, implementers, reviewers, and fixers do everything else. Every dispatch is a fresh sub-agent. The numbered steps are **pipeline stages**, not phases: each issue advances the moment it's ready. Each invocation is one **pass**.

Findings and logs live on the PR, never in your context; every sub-agent returns only a verdict.

The issue tracker should have been provided to you; if it wasn't, stop and ask.

## Settings

Three **settings** govern the loop — `/afk-loop [merge-mode] [concurrency] [cap]`. Take each from the invocation; a default applies silently when the invocation omits its setting.

- **Merge mode** — you merge clean PRs yourself, or **park** them for a human to merge. No default — ask (`AskUserQuestion`, before planning).
- **Concurrency** — how many issues run in flight at once. Default 5.
- **Cap** — how many fix attempts an issue gets before you stop it. Review rounds and check-fix attempts are counted separately, each capped at this number. Default 5.

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
- **`CLEAN`** → the issue is ready to merge.
- **The round number reaches the cap** → stop the issue (below).

Rounds accumulate on the PR, not within a pass: a PR resumed on a later pass carries on from the round it reached, so the cap holds however many passes it takes to reach. The review comments carry the review count; the summary carries the check-fix count — attempts a pass spent but died before writing down are forgiven.

### 4. Merge

You mark a PR ready for review the moment it is mergeable — clean review, green checks. Draft says the loop is still working on it; ready says a merge can happen. So for each issue whose review came back clean, wait for the PR's checks to finish.

- **Green** → mark the PR ready for review, then act on the merge mode: merge it yourself and delete its branch, or **park** it — request a human's review and leave it for them. After merging, check the `Closes` reference closed the issue; close it on the tracker yourself if it didn't.
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
- Round 1: findings → addressed
- Round 2: findings → addressed
- Checks red → fixed (attempt 1)
```

`State` is the code the investigator returned, or the one the pass's own work left the PR in — the same vocabulary either way, listed in `<states>`. `Outcome` stays `—` until the PR reaches a terminal state, then names it: merged, awaiting a human's merge, review cap hit, check cap hit, or a one-way door — that last one named and nothing more, since the sub-agent's `## AFK one-way door` comment sits on this same PR.

The summary **counts, it never explains** — a round happened, a check went red, an attempt was spent. If writing a line would mean opening a log, a diff, or another comment, leave it out — whatever it says is already on this PR, one comment away.

## Stopping an issue

A stopped issue's `ready-for-agent` label flips to `ready-for-human`: the loop is done with it. The flip is always yours to make, for either cause —

- **One-way door** — an implementer or fixer returns `STOPPED: <the question>` (per `<one-way-doors>`).
- **Cap hit** — review rounds or check-fix attempts reached the **cap**.

— and where the explanation goes depends on how far the issue got:

- **No PR** — the issue gets the comment, written by the sub-agent that hit the door. Only a one-way door reaches here; a cap hit needs a PR to have been capped on.
- **PR open** — the PR carries it and the issue gets no comment: a one-way door as the sub-agent's own `## AFK one-way door` comment, a cap hit as the summary's `Outcome`. Either way one place, written by whoever held the context. The PR stays a draft; convert it back to one if it had already been readied.

## End of pass

The pass is done when nothing is in flight: every dispatched issue is merged, parked, or stopped. Write the summary of every PR the pass moved — one write each, now that the thread has settled — then a status line: issues merged, parked (awaiting a human's merge), stopped (and why), still blocked. Then:

- Any open `ready-for-agent` issue remains, or a parked PR awaits its human → schedule the next wakeup with the same `/afk-loop` prompt, restating all three settings so the next pass resolves them from the invocation and asks nothing: at the minimum delay while issues remain, or the maximum delay when only parked PRs do.
- Frontier empty, no parked PRs, and every remaining issue blocked → stop the loop, with the final status as your summary.

## Dispatch prompts

Compose every dispatch from these templates: copy the matching template verbatim, fill `{{ISSUE_ID}}` with the issue's tracker id, append the `<one-way-doors>` block to every implementer and fixer prompt and the `<states>` block to every investigator prompt, and append the fixer's one-line `ADDRESS: …` payload last.

<investigator-prompt>

You establish where one issue's open PR left off and return its state.

1. Read the PR for issue {{ISSUE_ID}}: its `## AFK summary` comment if it has one, its `## AFK review findings`, `## AFK review clean`, and `## AFK review response` comments, its checks, whether it is a draft, and its commits since the most recent review comment.
2. Where the summary and the PR's actual state disagree, the PR wins — a pass can end mid-stage after its last write.
3. Return exactly one state from the `<states>` block at the end of this prompt, with its round or attempt number where the state takes one. Return the bare state; never the findings themselves.

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

</implementer-prompt>

<reviewer-prompt>

You review one issue's implementation, post findings on its PR, and return a verdict.

1. Enter the issue's worktree — the one on branch `afk/{{ISSUE_ID}}` — and confirm `git status` shows that branch. Every later step runs from here.
2. Fetch issue {{ISSUE_ID}} from the tracker. It is the spec you review against — title, body, and comments all count.
3. Fetch the PR's comments headed `## AFK review findings` — those, and only those, carry prior rounds' items — together with the `## AFK review response` comment answering the most recent. Check each of that round's items against the current code: one the fixer fixed but didn't genuinely address stays a finding; one it won't-fixed stands or falls on its reasoning — accept it and the item is settled, or reject it and re-raise the item marked **disputed**.
4. Run `/code-review` on the branch — the changes since its merge-base with the default branch.
5. If the change is user-facing, QA it in a sub-agent: run the app and exercise the flows the issue describes, returning what broke. Its findings join yours, and its logs and screenshots stay out of your context.
6. Every round ends in a single PR comment, numbered round N — one past the highest round already on the PR: findings under `## AFK review findings (round N)`, each with file, line, what's wrong, and what correct looks like; a clean round under `## AFK review clean (round N)`, saying only that it found nothing. Then return the bare verdict — `FINDINGS` or `CLEAN` — never the findings themselves.

</reviewer-prompt>

<fixer-prompt>

You fix issue {{ISSUE_ID}}'s open PR — review findings, failing checks, or a merge conflict, whichever the `ADDRESS:` line at the end of this prompt names — and push what you change to the same branch. Fetch the work from the PR yourself.

1. Enter the issue's worktree — the one on branch `afk/{{ISSUE_ID}}` — and confirm `git status` shows that branch. Every later step runs from here.
2. Fetch issue {{ISSUE_ID}} from the tracker for context — title, body, and comments all count.
3. Work the case the `ADDRESS:` line names, per its section below.
4. Where you changed code, typecheck, run the affected tests, commit with `/commit`, and push (after a rebase, push with `--force-with-lease`). If what landed leaves the PR's title or body stale — scope or approach they no longer describe — run `/open-pr` to refresh them; the PR stays a draft.
5. For review findings, post the round's ledger last — after the push, so it records what landed: a single PR comment headed `## AFK review response (round N)`, N matching the findings comment you answered, one line per item giving its disposition and what you did. The diff carries the code; this carries the calls.
6. Return `ADDRESSED` — or, if anything turned on a **one-way door**, follow the procedure at the end of this prompt. The door comes last: steps 4 and 5 still run first, so the other items land and the ledger records the round before you stop.

**Review findings** — fetch the PR's most recent `## AFK review findings` comment and **triage** every item onto a **disposition** before you change any code:

- **fix** — the default. Make the fix the item describes; where none is described, fix what it names. Where the item has a testable seam, fix it with `/tdd` — the finding is the red test.
- **investigate** — the item seems off. Read the code it names, then settle it into fix or won't fix.
- **won't fix** — the item is wrong, or it is minor and discretionary and you judge against it.
- **one-way door** — the call is bigger than a won't fix, or the item arrived marked **disputed**: the reviewer rejected a won't fix and the standoff is the human's to settle. This item's ledger line names the door, and the door comment itself follows the procedure at the end of this prompt.

**Failing checks** — fetch the failing check's output from the PR (`gh pr checks`, then the failing run's log), reproduce locally where possible, fix, and confirm the command passes.

**Merge conflict** — fetch and rebase onto the default branch, resolving with `/resolving-merge-conflicts`.

</fixer-prompt>

<one-way-doors>

A **one-way door** is an open question you can't safely decide: the spec is ambiguous, contradicts the codebase, or the choice would be expensive to reverse (data migration, public API shape, irreversible deletion, money flow). One-way doors are for humans, so surface the decision instead of making it:

1. Comment naming the question and the options you considered, headed `## AFK one-way door` — on the PR if one is open, otherwise on the issue. You hold the context here, so this comment is the record; your supervisor only notes that you hit one.
2. Return `STOPPED: <the question>` instead of your normal result.

</one-way-doors>

<states>

A PR is in exactly one of these states. Return the code verbatim, with its number where the code takes one:

- **`NEEDS_REVIEW (round N)`** — the code is waiting on its Nth review: one past the most recent round an `## AFK review response` answers, or 1 when no review comments exist yet.
- **`NEEDS_FIXES (round N)`** — round N posted findings that no `## AFK review response (round N)` comment answers yet.
- **`AWAITING_CHECKS`** — an `## AFK review clean` comment settles the review, and checks are still running.
- **`NEEDS_CHECK_FIXES (attempt N)`** — checks are red.
- **`NEEDS_CONFLICT_RESOLUTION`** — the branch conflicts with the default branch.
- **`AWAITING_HUMAN_MERGE`** — ready for review, green, and left for a human to merge.
- **`MERGED`** — already merged.
- **`STOPPED`** — the summary's `Outcome` names a cap hit or a one-way door.

</states>
