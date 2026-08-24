Tracker: {{TRACKER}}. Issue: {{ISSUE_ID}}. State dir: {{STATE_DIR}}. Your agent name: {{AGENT}}.
Read {{STATE_DIR}}/state.json. Your worktree is your cwd; confirm `git status` shows branch {{BRANCH}}. Every later step runs from here. Fetch the issue from the tracker — title, body, and comments are the spec. Read {{DOORS}} — what to do when the work turns on a one-way door.
Division of labour: CI owns the full test suite, lint, and builds; the QA stage owns exercising the running app; you do the checks your brief names and no others.
Notes live in {{STATE_DIR}}/notes as `<number>-<type>.md` — number order is chronological; when your brief has you write one, use the next unused three-digit number.
When you are done, write your outcome file {{OUTCOME_FILE}} as your very last act, with the `result` your brief names — then stop and wait; another prompt may follow.
