# Source control

## What it holds

Commit messages, dates, authors, and diffs; PR bodies, review threads, and linked issues via `gh`; inline comments, TODOs, and deprecation notes; ADRs; tests, whose names and assertions encode the edge cases that motivated a change; CHANGELOG entries; co-changed files. The most trustworthy source, tied directly to the code, and the most complete.

## Searching

Start from the anchor's commit list and widen:

```bash
git log --follow -p -- <file>
git log -S '<exact string from the code>' -- <file>
git log -G '<regex>' -- <file>
git show <hash>
git log <old>..<new> -p -- <file>
gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews,files
rg -l -i 'architecture.decision' --glob '*.md'
rg -n -C2 '(TODO|FIXME|HACK|XXX|NOTE)' <file>
rg -l '<symbol>' --glob '*test*'
git log --grep='incident\|outage\|hotfix\|defensive' -- <file>
```

A revert followed by a re-apply marks a change that went wrong once.

Trace each pattern to its origin commit, then to the earlier site it was copied from when the pattern predates the file.

## Good evidence

A PR body that states the problem, not just the change. A review thread where alternatives were argued. An inline comment naming an external constraint. A test named for the edge case. A commit that cites a ticket or incident ID. A CHANGELOG line giving the user-visible reason.

## Pitfalls

- Squash merges flatten the branch history; the PR body and review comments hold what the commits lost.
- "Small refactor" can hide an intentional behaviour change. Read the diff as well as the message.
- Bot commits (Dependabot, Renovate, backports) carry no motivation.

## Extra fields

Per commit or PR: the merge date, and whether the motivation sits in the commit message, the PR body, or a review thread.
