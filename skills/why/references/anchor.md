# Anchor brief

You pin the question to concrete code. Every investigator starts from the seed you return, so locate exactly: paths, line ranges, hashes, and numbers beat a summary. The target and the question are in your prompt. Return, in these sections:

## Files

Paths and line ranges of the target.

## Symbols

Functions, classes, constants, error strings, and configuration keys the target defines, plus the ones it calls or reads directly. One hop, not the transitive closure.

## Commits

Every commit that touched the target lines, newest first, through renames, with hash, date, author, and subject:

```bash
git blame -L <start>,<end> <file>
git log --follow --oneline -- <file>
```

Mark the **origin commit**, the one that introduced the pattern. The origin carries the why more often than the last touch, and a pattern copied from elsewhere in the codebase points at its first appearance.

## PRs

Numbers from merge subjects (`(#1234)`) and bodies (`git log -1 --format=%B <hash>`). For each:

```bash
gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews
```

Read the body and the review threads, and record title, author, merge date, labels, and linked issues. The ticket IDs below come from there.

## Tickets

Ticket IDs named in commit messages or PR bodies (`ENG-1234`, `#567`, `[BUG-89]`).

## Defensive

Yes or no, with the signals: null checks, retries, timeouts, rate limits, circuit breakers, feature flags, egress guards, OOM handlers. Defensive code is usually incident-shaped.

Done when every section above is filled from the commands, the **origin commit** is marked, and **Defensive** reads yes or no.
