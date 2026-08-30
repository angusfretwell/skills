# Reap

Remove the worktrees and workspaces of the issues that finished, and nothing else.

Your header lists, per issue: its issue worktree, its slice worktrees, and its herdr workspace id.

Load /herdr and /worktrunk:worktrunk. Per issue, remove the slice worktrees, then the issue worktree, then close the workspace.

An issue reaches you only after its PR merged, so a worktree holding uncommitted or unpushed work is a surprise: leave that worktree in place and report it.

## Return

One line per issue: what you removed, plus anything you left behind and why.
