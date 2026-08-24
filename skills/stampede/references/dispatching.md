# Dispatching

Whoever dispatches a worker composes its brief: the standing rules in [`prompts/preamble.md`](../prompts/preamble.md), the role guide from `prompts/<role>.md`, and a header stating the concrete facts both refer to — tracker, issue, state dir, agent name, branch, worktree, the allocated outcome file path, the path to [`references/one-way-doors.md`](one-way-doors.md), and anything the role guide says the brief must name. Write the brief to a temp file, create the tab, start the agent, prompt it to read and follow the brief, and record it under `agents` in `state.json`. How you do each step is `/herdr`'s business.

Roles and models: `slice` opus · `implement` opus · `watch-ci` haiku · `fix-ci` opus · `review` opus · `fix-findings` opus · `qa` sonnet · `merge-or-park` haiku · `summarise` haiku · `issue` opus. The top orchestrator dispatches only the issue orchestrators; they dispatch the rest.
