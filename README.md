# Skills

[![skills.sh](https://skills.sh/b/angusfretwell/skills)](https://skills.sh/angusfretwell/skills)

[Agent Skills](https://skills.sh) for Claude Code and other coding agents.

## Install

```bash
npx skills add angusfretwell/skills
```

## Available skills

### [`/commit`](skills/commit/SKILL.md)

Creates git commits in [Conventional Commits](https://www.conventionalcommits.org) format.

### [`/open-pr`](skills/open-pr/SKILL.md)

Opens a pull request for the current work, or updates the title and description of an open one when later commits leave them stale.

### [`/address-review`](skills/address-review/SKILL.md)

Triages review findings with you (from a PR comment, a file, or the session itself), then applies the fixes in parallel, files the deferrals, and posts a summary.

### [`/dependency-graph`](skills/dependency-graph/SKILL.md)

Builds a dependency graph over a batch of work items and shows the frontier: the items that can start now.

### [`/interview-me`](skills/interview-me/SKILL.md)

Asks the session's open questions in rounds of AskUserQuestion, with a recommendation and a preview for each option.

## In progress

### [`/browser-qa`](skills/browser-qa/SKILL.md)

QAs a change against its spec: launches the app, drives every affected flow in a real browser, and probes the edge cases the change touches.

Depends on [`/agent-browser`](https://www.skills.sh/vercel-labs/agent-browser/agent-browser).

### [`/conveyor`](skills/conveyor/SKILL.md)

Runs autonomous software development in ticks: each tick fetches ready issues and dispatches worker agents through plan, implement, review, QA, ship, and a retro.

The scheduler never touches the code itself; every job goes to a herdr agent in its own worktree.

Depends on [`/herdr`](https://www.skills.sh/herdrdev/herdr/herdr), [`/worktrunk`](https://www.skills.sh/max-sixty/worktrunk/worktrunk), [`/github-image-hosting`](https://www.skills.sh/img402/skills/github-image-hosting), [`/retro`](https://www.skills.sh/mattpocock/skills/retro), `/dependency-graph`, `/commit`, `/open-pr`, `/interview-me`, `/browser-qa`.

### [`/show-me`](skills/show-me/SKILL.md)

Composes a visual explanation of how something works: screenshots, diagrams, and prose on one HTML page.

### [`/supervise`](skills/supervise/SKILL.md)

Runs a task through sub-agents. The supervisor's context holds only the index; the disk holds the content.

Other skills can call it with their own dispatch prompts.

Depends on `/dependency-graph`.

### [`/writing-for-humans`](skills/writing-for-humans/SKILL.md)

Style rules for prose that people read: Orwell's six rules for expository writing, ASD-STE100 Simplified Technical English for procedural writing, and the project's own vocabulary over both.
