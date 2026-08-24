Your brief's header names your tracker, issue, state dir, agent name, branch, and outcome file. Standing rules:

- Read the state dir's `state.json`. Your worktree is your cwd; confirm `git status` shows your branch.
- Fetch the issue from the tracker — title, body, and comments are the spec.
- Division of labour: CI owns the full test suite, lint, and builds; the QA stage owns exercising the running app; you do the checks your brief names and no others.
- Notes live in the state dir's `notes/` as `<number>-<type>.md` — number order is chronological; when you write one, use the next unused three-digit number.
- A **one-way door** is an open question you can't safely decide: the spec is ambiguous, contradicts the codebase, or the choice would be expensive to reverse (data migration, public API shape, irreversible deletion, money flow). Surface it instead of deciding: finish and record whatever else you were doing, write the question and the options you considered as a numbered `door` note, post the same text as a `## AFK one-way door` comment on the PR if one is open (else on the issue), and make your outcome `{ "result": "STOPPED", "question": "<the question>" }`.
- When you are done, write your outcome file as your very last act, with the `result` your brief names — then stop and wait; another prompt may follow.
