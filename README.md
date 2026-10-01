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

### [`/address-review`](skills/engineering/address-review/SKILL.md)

Triages review findings with you, then fixes them in parallel, files the deferrals, and reports what it did.

### [`/attach-media`](skills/engineering/attach-media/SKILL.md)

Attaches screenshots and recordings to GitHub issues, PRs, and comments with `gh --attach`.

### [`/browser-qa`](skills/engineering/browser-qa/SKILL.md)

QAs a change against its spec: drives every affected flow in a real browser, probes the edge cases, and reports pass or fail.

Depends on [`/agent-browser`](https://www.skills.sh/vercel-labs/agent-browser/agent-browser).

### [`/commit`](skills/engineering/commit/SKILL.md)

Creates git commits in [Conventional Commits](https://www.conventionalcommits.org) format.

### [`/humanize`](skills/engineering/humanize/SKILL.md)

Style rules for prose that people read: Orwell's six rules, plus ASD-STE100 Simplified Technical English for text the reader acts on.

### [`/interview-me`](skills/engineering/interview-me/SKILL.md)

Asks the session's open questions, stated or not, in rounds of AskUserQuestion.

### [`/open-pr`](skills/engineering/open-pr/SKILL.md)

Opens or refreshes a pull request, with a description written for reviewers and comments on the lines that need explaining.

Depends on `/attach-media`, `/commit`, and `/humanize`.

### [`/supervise`](skills/engineering/supervise/SKILL.md)

Runs a task through sub-agents that write their reports to disk, so your session's context stays small.

Other skills can call it with their own dispatch prompts.

### [`/to-artifact`](skills/engineering/to-artifact/SKILL.md)

Publishes a report, brief, plan, comparison, or dashboard as an Artifact in the house style.

## Work in progress

### [`/explain-irl`](skills/in-progress/explain-irl/SKILL.md)

Explains a bug, edge case, limitation, or trade-off by following one invented person through it.

Depends on `/humanize`.

### [`/how`](skills/in-progress/how/SKILL.md)

Explains how part of the codebase works, deep enough to start working in it, with every claim traced to a file.

Depends on `/humanize`.

### [`/polish`](skills/in-progress/polish/SKILL.md)

Reviews, QAs, and fixes a branch in rounds of parallel sub-agents until a round finds nothing to fix, then simplifies it. Reports what it fixed, what it won't fix and why, and what needs your call.

Depends on [`/mattpocock-skills:code-review`](https://github.com/mattpocock/skills), `/browser-qa`, and `/commit`.

### [`/ship-it`](skills/in-progress/ship-it/SKILL.md)

Merges a PR without human review when a fresh judge sub-agent rules out each of three reasons to hold it: an unmet precondition, a one-way door the spec never agreed to, and a high-stakes change with no evidence it works. Pass `--dry-run` to get the verdict without merging, or `--comment` to post it on the PR.

Depends on `/humanize`.

### [`/showcase`](skills/in-progress/showcase/SKILL.md)

Builds a one-page visual explanation of how something works, each point shown as a screenshot, diagram, or prose.

Depends on `/to-artifact`, `/how`, and `/why`.

### [`/why`](skills/in-progress/why/SKILL.md)

Investigates why code is the way it is, from commits, tickets, docs, chat, and telemetry, and cites each finding with a confidence tier.

Companion to `/how`.

### [`/work-on`](skills/in-progress/work-on/SKILL.md)

Carries a spec or its tickets through implementation, `/polish`, and a PR in one workflow, running tickets that don't block each other in parallel. Pass `--ship` to merge each PR through `/ship-it` and then start the tickets it unblocks, or `--no-pr` to stop after polish.

Depends on `/polish`, `/ship-it`, `/open-pr`, `/supervise`, and [`/mattpocock-skills:tdd`](https://github.com/mattpocock/skills).
