# Integrate

Merge the completed slice branches into the issue branch `conveyor/<id>`.

Merge in dependency order from `plan.md`, resolving conflicts as you go using `/mattpocock-skills:resolving-merge-conflicts` — each slice's primary source is its `plan.md` spec; a conflict that forces a design choice neither slice made is a door. Merge and remove each slice worktree using `/worktrunk:worktrunk`.

When every slice is in: push the issue branch and update the PR using `/open-pr` to describe the integrated whole.

Outcome verdict: `integrated`, or `blocked` on a door. Note in `summary` any resolution non-trivial enough that reviewers should look at it.
