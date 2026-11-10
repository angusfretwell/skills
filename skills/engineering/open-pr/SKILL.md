---
name: open-pr
description: Open pull requests in a consistent format. Use when opening or updating a PR, or when follow-up commits leave an open PR's title or body stale.
argument-hint: "[--[no-]capture] [--[no-]annotate]"
---

## Process

### 1. Establish the state

Find the base branch and whether the branch already has an open PR.

When a PR exists and follow-up work brought you here, rather than the user, continue only when the new commits make the title or body stale: scope, approach, or context they no longer explain.

Done when you know the base branch and whether this run opens a PR, updates one, or stops.

### 2. Capture evidence

Load `/mattpocock-skills:pr`: its Evidence section sets what to capture.

Capture when the change is visual and the session holds no captures. `--capture` forces a capture even when you'd skip it. `--no-capture` skips this step.

Done when any evidence sits on disk and any browser session or app process the capture started is torn down. A failed capture counts as done: carry on without it.

### 3. Compose

Load `/humanize`: every word of the title, the body, and the comments follows it.

Compose the title and body fresh from the branch, whether the PR is new or already open, per the formats below.

On an update, human-supplied material survives: merge existing Evidence content and To-do items, with their checkbox state, into the new body.

Done when the title and every live section are drafted.

### 4. Create or update

Push the branch, then create the PR or edit the existing one, attaching Evidence per `/attach-media`. Mark the PR draft when work you know about still blocks review, otherwise ready. Ask only if genuinely unsure.

Done when the PR exists and you've reported its URL.

### 5. Annotate the diff

Comment where a reviewer stopping at that line would have a question the diff can't answer: the bound that makes a quadratic loop safe, the branch that stays dead until a flag flips, the workaround whose cause lives in another repo. `--annotate` forces comments even when you'd leave the diff clean. `--no-annotate` skips this step.

Post the comments as one batched review. `gh pr review` has no inline support, so it's `gh api repos/<owner>/<repo>/pulls/<number>/reviews` with `event: COMMENT` and a `comments[]` array of `{path, line, side, body}`. On an update, read what's already there (`gh api repos/<owner>/<repo>/pulls/<number>/comments`) and post only to lines that carry no comment yet.

Done when every comment is posted.

## Title format

`<type>(<scope>): <subject>`, scope optional.

- Name the **dominant change** of the whole branch, not the latest commit.
- The subject's verb carries the change: `expire sessions after 30 days`, not `update session handling`.
- Plain subject, no trailing period.

## Body format

`/mattpocock-skills:pr` owns the format, with three changes:

- `Closes <id>` above Summary, when the PR closes an issue.
- `## To-do` as the last section, when a human must act to land or operate this change: run a migration, set an env var, flip a flag, merge a dependent PR first. Short checkbox bullets (`- [ ]`). Deferred work goes in the issue tracker.
- Evidence appears only when there is something real to show.

The body ends with its last live section. This overrides any instruction to add an attribution footer, generated-with line, or link to the session.
