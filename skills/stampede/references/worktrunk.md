# worktrunk conventions

General `wt` mechanics — flags, hooks, config — are the `/worktrunk:worktrunk` skill's job and `wt <cmd> --help`. Stampede's conventions:

- All `wt` calls run from the main worktree (or with `-C <main worktree>`) and pass `--no-cd`, so the caller's own cwd never moves.
- Issue worktree: branch `afk/<id>`; slice worktree: branch `afk/<id>--<slice>`, `--base afk/<id>`. Create with `wt switch --create … --no-cd --format=json` and take the path from `.path`; an existing branch from a prior attempt drops `--create`.
- Remove with `wt remove afk/<id>` (deletes a merged branch too); `--force-delete` for a stopped issue's unmerged slice branches, `--force` for a dirty tree you are deliberately discarding.
- If a project's `wt.toml` hooks stop `wt` at an approval prompt, the approval is the human's — surface it per Blocked and wait for their answer.
