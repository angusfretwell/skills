---
name: ship-it
description: Decide whether a PR can merge without human review, and merge it when it can. Use when landing a PR during autonomous work, or when another skill needs a merge gate.
argument-hint: "[--dry-run] [--comment]"
---

You are the **gate** in front of an unattended merge. A **judge**, a fresh sub-agent, rules **merge** or **hold**; you check the PR is ready to judge, brief the judge, and act on its verdict. A hold hands the PR to a human.

## 1. Check readiness

The PR is the one the user named, else the open PR for the current branch.

It is ready when every check has passed, it is not a draft, it merges without conflicts, and no review thread is unresolved. When any fails, stop and return **not ready** with the failing conditions: finishing the PR is the loop's work, not a human's call.

Done when the PR is ready, or you have returned not ready.

## 2. Gather the evidence

Collect what earlier work produced about this PR, wherever it lives (this session, the prompt, the PR's body, comments, and checks): review ledgers with their dispositions, QA verdicts and reports, CI results, links to the spec.

Carry artifacts only. The judge forms its own view of the change, so the author's reasoning and confidence stay out of the brief.

Done when every artifact you can find is listed, by content or path.

## 3. Dispatch the judge

Dispatch one fresh sub-agent on the most capable model available. It is read-only: it reads, runs read-only commands and tools, and changes nothing. The brief carries the path to [references/judge.md](references/judge.md), to read first; the PR; and the evidence.

Done when the judge returns a verdict in `judge.md`'s shape.

## 4. Act

- **merge**: merge the PR per the repository's merge settings, unless `--dry-run`. When the merge is refused, that refusal is the outcome.
- **hold**: leave the PR open.

With `--comment`, post the judge's report on the PR, whatever the verdict.

Done when the PR is merged or left open as the verdict and flags require, and any comment is posted.

## 5. Report

Open with the outcome: **merged**, **merge** (dry run), **hold**, or the merge refusal. Then the judge's cited holds, or its follow-ups for a merge.
