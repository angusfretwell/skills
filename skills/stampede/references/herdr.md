# herdr conventions

General herdr mechanics — workspaces, tabs, panes, the agent lifecycle, command syntax — are the `/herdr` skill's job; use it rather than relearning the CLI here. This file holds only what stampede layers on top.

## Targeting the session

Inside herdr (`HERDR_ENV=1`) run `herdr …` bare. Outside, the session is `stampede-<repo>` (`<repo>` = `<owner>-<name>` from `origin`); prefix every command with `--session stampede-<repo>` — a flag on every call, not an environment variable.

Starting it headless (absent or stopped in `herdr session list`): `herdr --session stampede-<repo> server` in a background Bash call — it is the server process and holds the foreground. It is up when `workspace list` returns JSON rather than `server_not_running`. Leave it running at the end of a run; the human attaches with `herdr session attach stampede-<repo>`. `server stop` and `session delete` are the human's to run.

## Dispatching a worker

Every worker is an interactive `claude` in a tab of the issue's workspace, named for its role, prompted with a brief on disk. [`scripts/dispatch.sh`](../scripts/dispatch.sh) does the whole dispatch in one call — brief composition to `.stampede/<id>/briefs/<name>.md`, tab create, `agent start` with a retry loop for `agent_pane_busy` (a fresh pane is often not ready), the prompt (`"Read and follow the brief at <abs brief path>."`), and the `state.json` record. [`scripts/collect.sh`](../scripts/collect.sh) reads the outcome file, marks the agent done, and closes its tab. Never hand-roll what they automate.

- The `wait` command dispatch.sh prints runs in a background Bash call. `done`/`idle` with an outcome file on disk is a finished dispatch; without one, prompt the agent once to write it, then treat a second empty return as the agent missing.
- `agent_not_ready` on start means claude is stuck at a startup dialog — `agent read` it and treat as blocked.
- Agent names: `[a-z][a-z0-9_-]{0,31}`, unique among live agents — the script lowercases and truncates; the role-id-round scheme keeps them and their outcome files distinct.

The **issue orchestrator** is the one long-lived agent per issue: started once in the workspace's root pane (`--pane` from `workspace create`'s `.result.root_pane.pane_id`), then each later cue — a human's decision, a resume — is `agent prompt issue-<id> "…"` followed by a fresh background wait. Prompt it only when `agent get` shows `idle` or `done`; `agent_blocked` on a prompt means it is asking something — read the pane.

## Outcomes live in files, not panes

Claude runs on the alternate screen, so a finished response may not be recoverable from `agent read` — that is why every agent writes an outcome file. Read a blocked pane only to see its question; answer only by `agent prompt` (text) or `agent send-keys` (a dialog), only after the human has decided, and record the decision in `state.json`.

## Closing

A finished worker's tab: `tab close` (this ends the claude inside). A terminated issue: `workspace close` (every tab, the issue orchestrator included). Close only what this run or a prior `state.json` created; everything else in the session is the human's.
