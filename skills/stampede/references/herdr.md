# herdr mechanics

The installed binary is the authority on syntax — `herdr <group>` with no subcommand prints a group's commands. This file holds the recipes the orchestrator repeats and the gotchas no `--help` confesses. Every herdr command returns JSON: ids and states come from `.result`.

## Targeting the session

Inside herdr (`HERDR_ENV=1`) the current session is yours: run `herdr …` bare. Outside, the session is `stampede-<repo>` (`<repo>` = `<owner>-<name>` from `origin`); prefix every command with `--session stampede-<repo>`: `herdr --session stampede-<repo> workspace list`. The flag is not an environment variable — it goes on every call.

Starting a session headless (when `herdr session list` shows it absent or stopped): `herdr --session stampede-<repo> server` run in the background (Bash `run_in_background`) — it is the server process and holds the foreground. It is up when `herdr --session stampede-<repo> workspace list` returns JSON rather than `server_not_running`. `herdr session list` shows it `running`. Leave it running at the end of a run; the human attaches with `herdr session attach stampede-<repo>`. `server stop` and `session delete` are the human's to run.

## Dispatching a worker

Every worker is an interactive `claude` in a tab of the issue's workspace, named for its role, prompted with a brief on disk. [`scripts/dispatch.sh`](../scripts/dispatch.sh) does all of it in one call — brief composition, tab create, `agent start` with the pane-ready retry, `agent prompt`, and the `state.json` record — and [`scripts/collect.sh`](../scripts/collect.sh) reads the outcome and closes the tab. What the scripts automate, and the gotchas no `--help` confesses:

1. The brief lands at `.stampede/<id>/briefs/<name>.md`; the agent is prompted `"Read and follow the brief at <abs brief path>."`.
2. `herdr tab create` returns `.result.root_pane.pane_id` and `.result.tab.tab_id`. `herdr agent start <name> --kind claude --pane <pane_id> --timeout 120000 -- --dangerously-skip-permissions --model <model>` returns once claude is idle — but a fresh pane is often not ready: `agent_pane_busy` needs a short-sleep retry loop (the script retries up to ~10 times), and `agent_not_ready` means claude is stuck at a startup dialog (`agent read` it and treat as blocked).
3. `herdr agent wait <name>` (the command the script prints) runs in a background Bash call. It returns on `idle`, `done`, or `blocked`; read `.result.agent.agent_status`. `done`/`idle` with an outcome file on disk is a finished dispatch; without one, prompt the agent once to write it, then treat a second empty return as the agent missing.

The **issue orchestrator** is the one long-lived agent per issue: start it once in the workspace's root pane (`.result.root_pane.pane_id` from `workspace create`, passed to the script as `--pane`), then each later cue — a human's decision, a resume — is `agent prompt issue-<id> "…"` followed by a fresh background `agent wait`. Prompt it only when `herdr agent get issue-<id>` shows `idle` or `done`; `agent_blocked` on a prompt means it is asking something — read the pane.

Agent names: `[a-z][a-z0-9_-]{0,31}`, unique among live agents in the session — the script lowercases and truncates to fit. The role-id-round scheme keeps them unique and their outcome files distinct.

## Reading a blocked pane

`herdr agent read <name> --source recent-unwrapped --lines 80` shows what it is asking. Claude runs on the alternate screen, so a finished response may not be recoverable this way — that is why outcomes live in files, not panes. Answer a question only by `agent prompt` (text) or `agent send-keys <name> <key>` (a dialog) and only after the human has decided; record the decision in `state.json`.

## Closing

- A finished worker's tab: `herdr tab close <tab_id>` — this ends the claude process inside it.
- A terminated issue: `herdr workspace close <workspace_id>` closes every tab, the issue orchestrator included.
- Close only what this run or a prior `state.json` created; everything else in the session is the human's.
