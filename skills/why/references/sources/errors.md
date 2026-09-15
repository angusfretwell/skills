# Errors

## What it holds

Grouped issues with counts, first-seen and last-seen timestamps, affected releases, and comments; individual events with stack traces and tags; release records; session replays. For defensive or corrective code this is often the direct motivation, and its strongest gift is temporal correlation: an issue that first appears, peaks, and stops with the release that shipped the check.

## Searching

1. Orient: find the organisation and the project that owns the target's service.
2. Search issues by the exception classes the target handles, its function or class name, the error strings it checks, and its file path.
3. For each candidate: first seen, last seen, affected releases, frequency trajectory, and whether the stack trace passes through the target.
4. Pull the full event where tags and breadcrumbs matter.
5. Find releases near the target's commit date and cross-reference with the PR's merge date.
6. Treat any AI root-cause analysis the tool offers as a hypothesis; the events and stack traces are the evidence.

## Good evidence

An issue first seen shortly before the PR and last seen shortly after. A stack trace landing on the target function. A comment on the issue from the PR author describing the fix. A PR body citing the issue URL. High event counts that stop after the release containing the target.

## Pitfalls

- Regrouping: a refactor can move the same error under a new issue ID. When an issue ends abruptly, look for a new one starting.
- A release holds many commits; an issue stopping at a release does not prove which commit stopped it.
- The error may have stopped because upstream changed.
- Resolved is a human marker, not a code change.
- Sampling makes low counts ambiguous; record the rate when known.

## Extra fields

Per issue: project; first seen and last seen; event count and sampling rate; affected releases; a verbatim stack-trace excerpt showing the connection; the correlation with the target's ship date.
