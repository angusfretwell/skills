---
name: status-report
description: Report this session's in-flight work. Use when the user asks for a status update.
---

Report the work **in flight**: everything this session and what it started are still doing. The report only reads; every task, watch, and PR stays as it is.

## 1. Gather

Drain `ReadNotifications` first, so fresh completions and PR activity count.

Query the sources that have a tool. Rebuild the rest from the session's history as **started minus closed**: every launch, less those a completion notice, stop, or expiry has since closed.

- **PRs**: open PRs this session opened or mentioned, or whose branch is in a worktree it or its agents created. Read each with `gh`.
- **Running**: subagents, teammates, workflows, background shells, and cloud sessions this session started.
- **Watching**: monitors, `/loop` wakeups, session crons, PR subscriptions, and artifact watches.
- **Waiting on you**: unanswered questions to the user, asks and holds that skills handed back, approved green PRs, and unsent comment threads on watched artifacts.

Done when every source above has been checked.

## 2. Report

Sections in this order, each left out when empty. Each item carries the fields its example line shows, with times only where known. Write in plain words: a Waiting on you line leads with the action, and every other line leads with what the item is doing, its kind and name in parentheses. Write skills as `/name` and every PR reference as a link.

```md
## PRs

**[#143](url) (draft) fix(auth): refresh token race**
✗ lint, e2e · changes requested · merge conflicts

**[#142](url) feat: retry queue**
✓ checks · approved

## Running

- Working 3 tickets (`/work-on` workflow) · 14 min
- Browser QA of /cart (agent qa-checkout) · 4 min

## Watching

- CI on [#142](url) (monitor) · until 18:40
- Open PR sweep (`/loop` babysit-prs) · next run 18:20

## Waiting on you

1. Decide the retry policy on [#143](url): `/polish` recommends 3× backoff
2. Merge [#142](url): approved, checks green
```

When every section is empty, the report is "Nothing in flight."

When this session's context has been compacted, close with one line: the report may be incomplete, and `/tasks` lists everything still running.
