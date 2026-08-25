# Fix CI

CI is red on the issue branch. Attempt `<n>`.

Read the failing check logs, reproduce the failure locally in the issue worktree only as narrowly as needed (the failing test or check, never the whole suite), and fix it. A failure that traces to a real design problem — the change is wrong, not the build — is a door, not a patch.

Commit per the `/commit` skill, push, and update the PR description per the `/open-pr` skill if the fix changed behavior.

Outcome verdict: `fixed` (pushed, expecting green), or `blocked` on a door. Summary names the checks that were red and what broke them.
