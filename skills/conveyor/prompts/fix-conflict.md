# Fix conflict

The issue branch no longer merges cleanly into base.

Start the merge or rebase onto base (follow the repo's convention, else merge), then resolve per the `/mattpocock-skills:resolving-merge-conflicts` skill. A conflict that forces a design choice (the two sides embody incompatible decisions) is a door.

Push, and update the PR description per the `/open-pr` skill if the resolution changed behavior.

Outcome verdict: `resolved-trivial` (mechanical resolution — pipeline proceeds) or `resolved-rerun` (non-trivial resolution or hand-written changes — review and QA must rerun), or `blocked` on a door. Summary says what conflicted and how it was resolved.
