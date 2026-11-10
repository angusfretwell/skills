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

### [`/explain-irl`](skills/engineering/explain-irl/SKILL.md)

Explains a bug, edge case, limitation, or trade-off by following one invented person through it.

Depends on `/humanize`.

### [`/humanize`](skills/engineering/humanize/SKILL.md)

Style rules for prose that people read: Orwell's six rules, plus ASD-STE100 Simplified Technical English for text the reader acts on.

### [`/interview-me`](skills/engineering/interview-me/SKILL.md)

Asks the session's open questions, stated or not, in rounds of AskUserQuestion.

### [`/open-pr`](skills/engineering/open-pr/SKILL.md)

Opens or refreshes a pull request, with evidence for visual changes and comments on the lines that need explaining. Pass `--capture` or `--annotate` to force either, or their `--no-` forms to skip them.

Depends on [`/mattpocock-skills:pr`](https://github.com/mattpocock/skills), `/attach-media`, and `/humanize`.

### [`/polish`](skills/engineering/polish/SKILL.md)

Reviews, QAs, and fixes a branch in rounds of parallel sub-agents until a round finds nothing to fix, then simplifies and tidies it. Reports what it fixed, what it won't fix and why, and what needs your call. Pass `--unattended` when nobody can answer: it takes the reversible option it would recommend, leaves out what it can't undo, and comments each call on the PR.

Depends on [`/mattpocock-skills:code-review`](https://github.com/mattpocock/skills), `/browser-qa`, `/commit`, `/humanize`, `/merge-risk`, and `/tidy`.

### [`/ship-it`](skills/engineering/ship-it/SKILL.md)

Merges a PR without human review when a fresh judge sub-agent rules out each of three reasons to hold it: an unmet precondition, a one-way door the spec never agreed to, and a high-stakes change with no evidence it works. Pass `--dry-run` to get the verdict without merging, or `--comment` to post it on the PR.

Depends on `/humanize`.

### [`/tidy`](skills/engineering/tidy/SKILL.md)

Cleans up a branch's changes: removes AI slop, such as needless comments and defensive code, and spaces the code out so it reads easily.

### [`/to-artifact`](skills/engineering/to-artifact/SKILL.md)

Publishes a report, brief, plan, comparison, or dashboard as an Artifact in the house style.

### [`/unblock-pr`](skills/engineering/unblock-pr/SKILL.md)

Gets an open PR's checks passing: reruns transient failures, fixes real ones, and merges the base to resolve conflicts, stopping after three pushes. Pass `--cap` to change the limit. A calling skill can supply its own way to wait and to ask a human.

Depends on `/commit`, `/humanize`, and [`/mattpocock-skills:diagnosing-bugs`](https://github.com/mattpocock/skills).

### [`/work-on`](skills/engineering/work-on/SKILL.md)

Carries a spec or its tickets through implementation, `/polish`, and a PR in one workflow, running tickets that don't block each other in parallel. Pass `--ship` to merge each PR through `/ship-it` and then start the tickets it unblocks, or `--no-pr` to stop after polish.

Depends on `/polish`, `/unblock-pr`, `/ship-it`, `/open-pr`, and [`/mattpocock-skills:tdd`](https://github.com/mattpocock/skills).

## Work in progress

### [`/record-demo`](skills/in-progress/record-demo/SKILL.md)

Records a demo video of each flow you name, or of each user-visible flow your branch changes. A sub-agent rehearses every step first, then records the flow at human pace with a visible cursor and no devtools on screen. Pass `--gif` to get a GIF of each video too, or `--compact` for smaller files.

Depends on [`/agent-browser`](https://www.skills.sh/vercel-labs/agent-browser/agent-browser).

### [`/review-pr`](skills/in-progress/review-pr/SKILL.md)

Reviews a PR with you: runs code review, standards and spec review, and browser QA, sorts the findings into blockers, questions, nits, and drops for you to adjust, then posts the review on GitHub, either submitted in the recommended mode or pending for you to submit.

Depends on [`/mattpocock-skills:code-review`](https://github.com/mattpocock/skills), `/browser-qa`, and `/humanize`. Comment shapes adapted from [`/show-me`](https://github.com/humanlayer/skills).

### [`/status-report`](skills/in-progress/status-report/SKILL.md)

Reports what your session still has in flight: open PRs with their checks and reviews, running agents and workflows, active watches, and what's waiting on you.
