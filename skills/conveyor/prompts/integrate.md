# Integrate

Merge the completed slice branches into the issue branch `conveyor/<id>`.

Merge in dependency order from `plan.md`, resolving conflicts as you go per the `/mattpocock-skills:resolving-merge-conflicts` skill — read both sides' intent in the plan before choosing a resolution; a conflict that forces a design choice neither slice made is a door. After each merge confirm the tree still builds. Merge and remove each slice worktree per the `/worktrunk:worktrunk` skill.

When every slice is in: push the issue branch and update the PR per the `/open-pr` skill to describe the integrated whole.

Outcome verdict: `integrated`, or `blocked` on a door. Note in `summary` any resolution non-trivial enough that reviewers should look at it.
