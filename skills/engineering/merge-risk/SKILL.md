---
name: merge-risk
description: Report a PR's merge risk as its preconditions, one-way doors, and high-stakes changes. Use when assessing what a PR risks, or when another skill needs that report or the one-way door and high-stakes definitions.
---

Report what landing a PR's head commit risks. The report is findings only: each caller decides what they mean, by its own criteria. Stay read-only: look with `gh`, CLIs, and connected services, and change nothing.

## 1. Take the brief

The brief is the PR, its head commit, and the evidence. Given only a PR, use its current head and take the evidence from its body, comments, and checks.

Form your own view of the change, so the brief carries outputs only: the author's reasoning and confidence stay with the author. When this session has them, because it wrote or discussed the change, dispatch one fresh read-only sub-agent with this skill and the brief, and return its report.

Done when the brief you work from carries outputs only.

## 2. Find the risks

Read the diff and the code around it at the head commit, then the spec and the evidence. Apply each definition below to all of it.

Done when every changed file has been checked against every definition.

## 3. Report

Use this shape. A section with no entries says "none found".

```markdown
**PR** #<number> at <head commit>

## Preconditions

- <precondition>: met | unmet | couldn't verify. <how it was checked>

## One-way doors

- <effect> at <where>: blessed | not blessed. <the spec passage that blesses it>

## High-stakes changes

- <change> at <file and line>: <the evidence that proves it, or "none">
  - Ledger: <deferred or won't-fix finding>: open | closed by <evidence>

## Later work

- <work that can wait>
```

List a blessed door like any other, because a caller may refuse any door.

Done when every entry carries its status and its citation.

## Definitions

### Spec

The **spec** is what a human agreed to: tracker issues and the docs they link, and committed PRDs, ADRs, and spec docs. The PR body, the implementer's plans, and uncommitted or scratch files are part of the work being reported on.

### Precondition

A **precondition** is something outside the code that must be in place before the change lands, or landing it breaks: an env var the code reads, a migration it depends on, third-party config, a PR that must land first. Find candidates in the spec, the PR's To-do list, and the diff itself: new env reads, new services, new config keys. Verify each one with read-only tools.

Work that can wait until after landing, such as announcements, docs, and cleanup, is **later work**.

### One-way door

A **one-way door** is an effect a revert cannot undo: data deleted or rewritten, a destructive migration, a public contract others build on, an external side effect (emails, webhooks, charges), an identifier persisted outside the system.

### Blessed

A one-way door is **blessed** when the spec agreed to it, or it follows obviously from what the spec asks. Weigh irreversibility, not the spec's letter: a path off the letter that is as reversible as the spec's path or more is blessed, and a path that adds irreversibility is not, even when a review suggested it. A door with no spec passage to cite is not blessed.

### High-stakes

A change is **high-stakes** when it touches auth and access control, persisted data and migrations, deletion, payments, external side effects, or a crash path (startup, a hot route).

### Evidence

**Evidence** is what earlier work produced about the change, outputs only: review ledgers with their dispositions, QA verdicts and reports, CI results.

A high-stakes change is proved by a test that exercises the changed path, a QA verdict that covers it, or reasoning you can verify in the code. Read the code to confirm the evidence covers the change.

A ledger finding on a high-stakes change that was deferred or marked won't fix stays open until evidence closes it.
