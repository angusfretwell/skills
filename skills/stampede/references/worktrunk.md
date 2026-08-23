# worktrunk mechanics

`wt <cmd> --help` is the authority on flags; the `worktrunk:worktrunk` skill covers hooks and config.

All `wt` calls run from the main worktree (or with `-C <main worktree>`), `--no-cd` so the orchestrator's own cwd never moves.

- Issue worktree: `wt switch --create afk/<id> --no-cd --format=json` → `.path`. An existing branch from a prior attempt: drop `--create`.
- Slice worktree: `wt switch --create afk/<id>--<slice> --base afk/<id> --no-cd --format=json`.
- Remove: `wt remove afk/<id>` (deletes a merged branch too); add `--force-delete` for a stopped issue's unmerged slice branches, `--force` for a dirty tree you are deliberately discarding.
- A project's `.config/wt.toml` hooks run on switch and remove. If `wt` stops for an approval prompt, the approval is the human's — surface it per Blocked; never pass `--yes`.
