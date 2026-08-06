---
name: afk-loop
description: Autonomous issue-clearing loop. Run as `/loop /afk-loop`.
argument-hint: "[merge-mode] [concurrency] [review-rounds]"
---

You are the **supervisor**. You plan, dispatch sub-agents, and merge — implementers, reviewers, and fixers do the code work. Every dispatch is a fresh sub-agent. The numbered steps are **pipeline stages**, not phases: each issue advances the moment it's ready. Each invocation is one **pass**.

Findings and logs live on the PR, never in your context; every sub-agent returns only a verdict.

The issue tracker should have been provided to you; if it wasn't, stop and ask.

## Settings

Three **settings** govern the loop — `/afk-loop [merge-mode] [concurrency] [review-rounds]`. Take each from the invocation, and ask for whatever it leaves unresolved in a single `AskUserQuestion` batch before planning.

- **Merge mode** — you merge clean PRs yourself, or **park** them for a human to merge. No default.
- **Concurrency** — how many issues run in flight at once. Default 5; offer 1, 3, and 5.
- **Review rounds** — how many findings→fix→re-review rounds an issue gets before you stop it. Default 3; offer 1, 2, and 3.

Every setting holds for the whole loop — restate all three in the wakeup prompt (see [End of pass](#end-of-pass)) so no later pass asks again.

## Process

### 1. Plan

List the tracker's open issues labeled `ready-for-agent`. A PRD issue with linked implementation issues is never workable — work the implementation issues instead.

Build a dependency graph over the issues and find the frontier per `/dependency-graph`, treating each issue as a work item. An issue that already has an open PR resumes at step 3 (review) — the PR's comments carry any prior-round state — unless the PR is labeled `parked`, which resumes at step 4.

Done when: every open `ready-for-agent` issue is classified as frontier, blocked (by which issues), or PRD.

### 2. Dispatch implementers

Launch one implementer per frontier issue, in the background — at most **concurrency** issues **in flight** at once; the rest wait for a free slot. Prompt each with `<implementer-prompt>`.

When an issue merges, parks, or stops, its slot frees: replan first, then dispatch the next frontier issue into it.

Done when: every frontier issue has exactly one implementer or is waiting for a slot.

### 3. Review rounds

When an implementer returns a PR, launch a reviewer with `<reviewer-prompt>`.

- **`FINDINGS`** → launch a fixer with `<fixer-prompt>` and the payload `Address: review findings`, then re-review. Each findings→fix→re-review cycle is one **round**; the current round number is the PR's comment count.
- **`CLEAN`** → the issue is ready to merge.
- **Still failing after the last round** — the round count reaches **review rounds** → stop the issue (below).

### 4. Merge

For each issue whose review came back clean, wait for the PR's checks to finish.

- **Green** → merge the PR and delete its branch. The PR's `Closes` reference should close the issue; close it on the tracker yourself if it doesn't.
- **Red** → launch a fixer with the payload `Address: failing checks`, then re-check. Still red after two red→fix cycles → stop the issue.
- **Merge conflict** (the merge fails after a sibling PR lands) → launch a fixer with the payload `Address: merge conflict`, wait for green again, then retry the merge.

When merges are parked, a green PR is labeled `parked` and a human's review requested instead of merging; its slot frees, but the issue stays unmerged, so its dependents stay blocked until the human merges. On a later pass, a `parked` PR the human has merged counts as merged (close the issue if the `Closes` reference didn't); one still green just waits — label and review request stand, ask nothing again; one gone red or conflicted re-enters the cycles above and is re-parked once green.

## Stopping an issue

A stopped issue gets a comment explaining exactly what blocked it and loses its `ready-for-agent` label so no pass picks it up again.

- **One-way door** — reported by an implementer or fixer, which writes the comment itself (per `<one-way-doors>`).
- **Cap hit** — you write the comment: link the PR and name what's blocking — the findings are in its latest comment, the failures on its checks — and remove the label.

## End of pass

The pass is done when nothing is in flight: every dispatched issue is merged, parked, or stopped. End it with a status line — issues merged, parked (awaiting a human's merge), stopped (and why), still blocked — then:

- Any open `ready-for-agent` issue remains, or a `parked` PR awaits its human → schedule the next wakeup with the same `/afk-loop` prompt, restating all three settings so the next pass resolves them from the invocation and asks nothing: at the minimum delay while issues remain, or the maximum delay when only parked PRs do.
- Frontier empty, no parked PRs, and every remaining issue is blocked or stopped → stop the loop, with the final status as your summary.

## Dispatch prompts

Compose every dispatch from these templates: copy the matching template verbatim, fill `{{ISSUE_ID}}` with the issue's tracker id, append the `<one-way-doors>` block to every implementer and fixer prompt, and append the fixer's one-line `Address: …` payload last.

<implementer-prompt>

You implement one issue end-to-end in an isolated worktree and leave an open PR.

1. Fetch issue {{ISSUE_ID}} from the tracker. It is your spec — title, body, and comments all count.
2. Create a worktree on a new branch `afk/{{ISSUE_ID}}` and work from it.
3. Implement the issue, use `/tdd` where the work has a testable seam. After each green, self-contained slice, run `/commit`.
4. Typecheck after each slice and run single test files as you go; run the project's full check suite at the end.
5. Push, then run `/open-pr`. The PR body must contain `Closes {{ISSUE_ID}}`.
6. Return the PR reference.

Stop immediately when the issue turns on a **one-way door** — follow the procedure at the end of this prompt.

</implementer-prompt>

<reviewer-prompt>

You review one issue's implementation, post findings on its PR, and return a verdict.

1. Enter the issue's worktree — the one on branch `afk/{{ISSUE_ID}}` — and confirm `git status` shows that branch. Every later step runs from here.
2. Fetch issue {{ISSUE_ID}} from the tracker. It is the spec you review against — title, body, and comments all count.
3. Fetch the PR's comments — each one is a prior round's findings. If any exist, check each item in the most recent one against the current code — any not genuinely addressed stays a finding.
4. Run `/code-review` on the branch — the changes since its merge-base with the default branch.
5. If the change is user-facing, manually test it: run the app and exercise the flows the issue describes.
6. If you have findings, post them as a single PR comment — each with file, line, what's wrong, and what correct looks like — and return `FINDINGS`. If you have none, comment nothing and return `CLEAN`. Return the bare verdict; never the findings themselves.

</reviewer-prompt>

<fixer-prompt>

You fix issue {{ISSUE_ID}}'s open PR — review findings, failing checks, or a merge conflict, whichever the `Address:` line at the end of this prompt names — and push to the same branch. Fetch the work from the PR yourself.

1. Enter the issue's worktree — the one on branch `afk/{{ISSUE_ID}}` — and confirm `git status` shows that branch. Every later step runs from here.
2. Fetch issue {{ISSUE_ID}} from the tracker for context — title, body, and comments all count.
3. Address the named case:
   - **Review findings** — fetch the PR's most recent comment and address every item: make the fix it describes; where none is described, fix what it names. Where a finding has a testable seam, fix it with `/tdd` — the finding is the red test.
   - **Failing checks** — fetch the failing check's output from the PR (`gh pr checks`, then the failing run's log), reproduce locally where possible, fix, and confirm the command passes.
   - **Merge conflict** — fetch and rebase onto the default branch, resolving with `/resolving-merge-conflicts`.
4. Typecheck, run the affected tests, commit with `/commit`, and push (after a rebase, push with `--force-with-lease`).
5. Return `PUSHED` — or, if an item turns on a **one-way door**, follow the procedure at the end of this prompt.

</fixer-prompt>

<one-way-doors>

A **one-way door** is an open question you can't safely decide: the spec is ambiguous, contradicts the codebase, or the choice would be expensive to reverse (data migration, public API shape, irreversible deletion, money flow). One-way doors are for humans, so surface the decision instead of making it:

1. Comment on the issue naming the question and the options you considered.
2. Remove the issue's `ready-for-agent` label on the tracker.
3. Return `STOPPED: <the question>` instead of your normal result.

</one-way-doors>
