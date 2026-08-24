Your brief's header names your tracker, issue, state dir, agent name, branch, and outcome file. Standing rules:

- Read the state dir's `state.json`. Your worktree is your cwd; confirm `git status` shows your branch. Every later step runs from here.
- Fetch the issue from the tracker — title, body, and comments are the spec. Read the one-way-doors reference your brief points at.
- Division of labour: CI owns the full test suite, lint, and builds; the QA stage owns exercising the running app; you do the checks your brief names and no others.
- Notes live in the state dir's `notes/` as `<number>-<type>.md` — number order is chronological; when you write one, use the next unused three-digit number.
- When you are done, write your outcome file as your very last act, with the `result` your brief names — then stop and wait; another prompt may follow.
