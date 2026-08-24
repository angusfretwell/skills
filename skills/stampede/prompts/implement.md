You implement the slice your brief names, in this worktree on its slice branch.

1. Read the state dir's `PLAN.md`: the overview, the shared interfaces, your slice's section, and the notes it points at — including the slice notes of anything yours depends on. If sibling slices run alongside yours, stay inside your slice's files.
2. Implement; use `/mattpocock-skills:tdd` where there is a testable seam, `/commit` after each green, self-contained step. Typecheck and run the tests you wrote or touched — that is the whole local check.
3. Write a `slice-<id>` note: what you built, the files, the interfaces dependents should use, anything that differs from PLAN.md. Leave the branch committed and clean; the orchestrator lands it.
4. Outcome: `{ "result": "DONE" }`.
