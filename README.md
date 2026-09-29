# Skills

[![skills.sh](https://skills.sh/b/angusfretwell/skills)](https://skills.sh/angusfretwell/skills)

[Agent Skills](https://skills.sh) for Claude Code and other coding agents.

## Install

Globally, for every project:

```bash
npx skills add angusfretwell/skills --global
```

Or for the current project only:

```bash
npx skills add angusfretwell/skills
```

## Available skills

### [`/address-review`](skills/address-review/SKILL.md)

Triages review findings with you, then fixes them in parallel, files the deferrals, and reports what it did.

### [`/attach-media`](skills/attach-media/SKILL.md)

Attaches screenshots and recordings to GitHub issues, PRs, and comments with `gh --attach`.

### [`/browser-qa`](skills/browser-qa/SKILL.md)

QAs a change against its spec: drives every affected flow in a real browser, probes the edge cases, and reports pass or fail.

Depends on [`/agent-browser`](https://www.skills.sh/vercel-labs/agent-browser/agent-browser).

### [`/commit`](skills/commit/SKILL.md)

Creates git commits in [Conventional Commits](https://www.conventionalcommits.org) format.

### [`/dependency-graph`](skills/dependency-graph/SKILL.md)

Builds a dependency graph over a batch of work items and shows the frontier: the items that can start now.

### [`/humanize`](skills/humanize/SKILL.md)

Style rules for prose that people read: Orwell's six rules, plus ASD-STE100 Simplified Technical English for text the reader acts on.

### [`/interview-me`](skills/interview-me/SKILL.md)

Asks the session's open questions, stated or not, in rounds of AskUserQuestion.

### [`/open-pr`](skills/open-pr/SKILL.md)

Opens or refreshes a pull request, with a description written for reviewers and comments on the lines that need explaining.

### [`/supervise`](skills/supervise/SKILL.md)

Runs a task through sub-agents that write their reports to disk, so your session's context stays small.

Other skills can call it with their own dispatch prompts.

Depends on `/dependency-graph`.

## Work in progress

### [`/explain-irl`](skills/explain-irl/SKILL.md)

Explains a bug, edge case, limitation, or trade-off by following one invented person through it.

### [`/finish`](skills/finish/SKILL.md)

Gets a branch shippable: reviews, QAs, and fixes it in rounds of parallel sub-agents until a round finds nothing to fix, then simplifies it. Asks you only about fixes that are hard to reverse.

Depends on the built-in `/code-review` and `/simplify`, [`/mattpocock-skills:code-review`](https://github.com/mattpocock/skills), `/browser-qa`, `/commit`, `/interview-me`, and `/open-pr`.

### [`/how`](skills/how/SKILL.md)

Explains how part of the codebase works, deep enough to start working in it, with every claim traced to a file.

### [`/showcase`](skills/showcase/SKILL.md)

Builds a one-page visual explanation of how something works, each point shown as a screenshot, diagram, or prose.

Depends on `/to-artifact`.

### [`/to-artifact`](skills/to-artifact/SKILL.md)

Publishes a report, brief, plan, comparison, or dashboard as an Artifact in the house style.

### [`/why`](skills/why/SKILL.md)

Investigates why code is the way it is, from commits, tickets, docs, chat, and telemetry, and cites each finding with a confidence tier.

Companion to `/how`.
