# Skills

[![skills.sh](https://skills.sh/b/angusfretwell/skills)](https://skills.sh/angusfretwell/skills)

[Agent Skills](https://skills.sh) for Claude Code and other coding agents.

## Install

```bash
npx skills add angusfretwell/skills
```

## Available skills

### [`/address-review`](skills/address-review/SKILL.md)

Triages review findings with you (from a PR comment, a file, or the session itself), then applies the fixes in parallel, files the deferrals, and posts a summary.

### [`/attach-media`](skills/attach-media/SKILL.md)

Attaches screenshots and recordings to GitHub issues, PRs, and comments with `gh --attach`.

### [`/browser-qa`](skills/browser-qa/SKILL.md)

QAs a change against its spec: launches the app, drives every affected flow in a real browser, and probes the edge cases the change touches.

Depends on [`/agent-browser`](https://www.skills.sh/vercel-labs/agent-browser/agent-browser).

### [`/commit`](skills/commit/SKILL.md)

Creates git commits in [Conventional Commits](https://www.conventionalcommits.org) format.

### [`/dependency-graph`](skills/dependency-graph/SKILL.md)

Builds a dependency graph over a batch of work items and shows the frontier: the items that can start now.

### [`/finish`](skills/finish/SKILL.md)

Gets a branch shippable: runs code review, standards and spec review, and browser QA in parallel sub-agents, triages the findings, fixes and simplifies in rounds until nothing worth fixing remains, and commits along the way. Asks you only about fixes that are hard to reverse; deferrals come back as a list for you to decide.

Depends on the built-in `/code-review` and `/simplify`, [`/mattpocock-skills:code-review`](https://github.com/mattpocock/skills), `/browser-qa`, `/commit`, `/interview-me`, and `/open-pr`.

### [`/interview-me`](skills/interview-me/SKILL.md)

Asks the session's open questions in rounds of AskUserQuestion, with a recommendation and a preview for each option.

### [`/open-pr`](skills/open-pr/SKILL.md)

Opens a pull request for the current work, or refreshes an open one when later commits leave it stale. Writes the description so reviewers can follow the change, and annotates the diff where a line needs explaining.

### [`/supervise`](skills/supervise/SKILL.md)

Runs a task through sub-agents. The supervisor's context holds only the index; the disk holds the content.

Other skills can call it with their own dispatch prompts.

Depends on `/dependency-graph`.

### [`/writing-for-humans`](skills/writing-for-humans/SKILL.md)

Style rules for prose that people read: Orwell's six rules for expository writing, ASD-STE100 Simplified Technical English for procedural writing, and the project's own vocabulary over both.

## Work in progress

### [`/explain-irl`](skills/explain-irl/SKILL.md)

Explains a bug, edge case, limitation, or trade-off as a real-world scenario: one invented person, traced numbers, and what happens to them.

### [`/how`](skills/how/SKILL.md)

Explains how something in the codebase works, at the depth a senior engineer needs to start working in it. Parallel explorers trace every claim back to a file.

### [`/showcase`](skills/showcase/SKILL.md)

Composes a visual explanation of how something works: captures, diagrams, and prose on one page, each point in the medium that proves it.

Depends on `/to-artifact`.

### [`/to-artifact`](skills/to-artifact/SKILL.md)

Publishes a report, brief, plan, comparison, or dashboard as an Artifact in the house style.

### [`/why`](skills/why/SKILL.md)

Investigates why code is the way it is across commits, tickets, docs, chat, and telemetry, and answers with cited findings, each carrying a confidence tier and the gaps behind it.

Companion to `/how`.
