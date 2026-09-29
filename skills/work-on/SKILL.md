---
name: work-on
description: Carry the spec or tickets the user has provided through implementation, polish, and PRs in one workflow, running work items in parallel. Use when the user asks to work on a spec or tickets.
argument-hint: "[--no-pr] [--ship]"
---

You **author** a workflow and report on what it returns. The work is the spec or tickets the user has provided; each **work item** runs through the **chain** in its own agents, and your context holds only the results.

Workflow agents are **leaves**: they have no Agent tool and no way to reach the user. The script makes every dispatch, and every choice a skill would put to the user is settled here before launch.

- `--no-pr`: the chain ends after polish.
- `--ship`: the chain ships each PR, and work items it blocks start once it merges. Refuse it alongside `--no-pr`.

## 1. Map the work

A spec with tickets gives one work item per ticket, with the spec as context for each. A spec without tickets, or a lone ticket, is one work item.

Find each work item's **blockers** per `/supervise`'s frontier rules, the implicit ones as well as the declared. A blocker is **done** when its PR has merged; one outside the batch that is not done keeps its dependents blocked.

Done when every work item is on the **frontier** or names every blocker it waits on.

## 2. Author the script

Load `/workflow-authoring`. Read the `SKILL.md` of `/polish` and `/ship-it`, and ship-it's `references/judge.md`; they sit beside this skill in the same skills directory. They are the source of truth for their stages: the script encodes their orchestration and points each agent at their rules.

### Translation

- Each sub-agent a skill dispatches becomes an `agent()` call, briefed as the skill says.
- The skill's own orchestrator work (polish's scoping, triage, and round planning; ship-it's readiness check and acting on the verdict) becomes an `agent()` call that returns its result through a schema.
- The skill's loops, exits, and carried state become script control flow. Polish's ledger lives in the script and rides into every brief that needs it.
- `/mattpocock-skills:code-review`, wherever the chain runs it, becomes two parallel `agent()` calls, one for its Spec axis and one for its Standards axis, each briefed per that skill.

Every brief names the work item, its branch, the spec, and the skill step it performs, so the agent reads that step at the source.

### The chain

For each work item, in order:

1. **Implement.** Implement the work item. Use `/mattpocock-skills:tdd` where possible, at pre-agreed seams. Run typechecking and single test files regularly, and the full test suite once at the end. Commit to the work item's branch. Then review the work with `/mattpocock-skills:code-review`, translated, and an agent addresses the findings and commits.
2. **Polish.** `/polish`, translated, with the work item as its spec.
3. **Open the PR**, unless `--no-pr`. `/open-pr --capture --annotate`, as a draft when polish left an **ask** open.
4. **Ship**, with `--ship` and a PR that is not a draft. Wait for checks; when one fails, an agent fixes it and pushes, then wait again, at most 2 attempts. Then `/ship-it --comment`, translated, with polish's report as its evidence.

A stage that fails ends its work item's chain. A work item's stages run isolated from every other work item's and share its branch.

### Scheduling

Start every work item on the frontier at once. With `--ship`, when a work item merges, start each work item whose blockers are now all done.

### Return

Per work item: its outcome (merged, held, draft, PR open, branch only, failed at a stage, or still blocked), its PR or branch, and every stage's report, including polish's report and the judge's verdict.

Done when the script carries the chain, the scheduling, and the return for every work item.

## 3. Launch

Run Workflow with the script, passing the work items and their blockers in `args`.

Done when the workflow returns.

## 4. Report

- One line per work item: its id, outcome, and PR or branch. A failure names the stage and why.
- `## Needs you`: grouped by work item with its PR. Polish's asks with their candidate fixes, recommendation first; polish's defers; ship-it's holds with their citations; and what was still not ready once the check fixes ran out.

Then stop.
