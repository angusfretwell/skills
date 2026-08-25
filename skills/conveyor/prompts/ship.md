# Ship

Your brief states the merge mode and whether the PR is already merged.

- **PR unmerged, mode `auto`:** confirm CI is green and the PR mergeable (either false: outcome verdict `not-ready`, `summary` saying which). Merge the PR, then finalize.
- **PR unmerged, mode `manual`:** mark the draft PR ready for review, flip the issue's label from ready-for-agent to ready-for-human, and comment on the PR that it passed review and QA. Outcome verdict: `awaiting-merge`. Finalization happens on a later dispatch, after the human merges.
- **PR merged, any mode:** finalize.

**Finalize.** Mark the issue done in the tracker. Outcome verdict: `done`.
