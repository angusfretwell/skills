# Skills

[![skills.sh](https://skills.sh/b/angusfretwell/skills)](https://skills.sh/angusfretwell/skills)

A collection of [Agent Skills](https://skills.sh) for Claude Code and other coding agents.

## Install

```bash
npx skills add angusfretwell/skills
```

## Available skills

### [`/commit`](skills/commit/SKILL.md)

Creates commits in [Conventional Commits](https://www.conventionalcommits.org) format.

### [`/open-pr`](skills/open-pr/SKILL.md)

Opens a pull request for the current work, or refreshes an existing PR's title and description.

### [`/address-review`](skills/address-review/SKILL.md)

Interactively triages review findings (from a PR comment, file, or session context).

Applies fixes in parallel, files deferrals, and posts summary.

## In progress

### [`/afk-loop`](skills/afk-loop/SKILL.md)

Autonomous issue-clearing loop: dispatches implementers, reviewers, and fixers over an issue tracker's ready issues.

Run as `/loop /afk-loop`.

### [`/show-me`](skills/show-me/SKILL.md)

Composes a visual explanation of how something works: screenshots, diagrams, and prose as an HTML artifact.

### [`/interview-me`](skills/interview-me/SKILL.md)

Works through the session's open questions in chunked rounds of AskUserQuestion, with recommendations and option previews.

### [`/dependency-graph`](skills/dependency-graph/SKILL.md)

Orders a batch of work items into a dependency graph and surfaces the frontier (the unblocked items).

### [`/supervise`](skills/supervise/SKILL.md)

Supervisor protocol for running a task through sub-agents: the supervisor's context holds only the index, the disk holds the content.

Other skills can invoke it with their own dispatch prompts.
