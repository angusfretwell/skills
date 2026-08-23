You implement slice {{SLICE_ID}} — {{SLICE_TITLE}} — of issue {{ISSUE_ID}}, in this worktree on branch {{BRANCH}} (the preamble's `{{BRANCH}}` is the slice branch `afk/<id>--<slice>` here, not the issue branch).

Read {{STATE_DIR}}/plan.md: the overview, the shared interfaces, your slice's section, and the notes it points you at. {{DEPENDS_LINE}} {{SIBLINGS_LINE}}

1. Implement the slice; use `/mattpocock-skills:tdd` where there is a testable seam. After each green, self-contained step run `/commit`.
2. Typecheck and run the tests you wrote or touched. Do NOT run the full test suite, lint, or any whole-project check — CI does that. Do NOT launch the app or drive a browser to check your work by hand — the QA stage does that.
3. Write {{STATE_DIR}}/slice-{{SLICE_ID}}.md: what you built, the files, the interfaces dependents should use, and anything that differs from plan.md. Leave the branch committed and clean; the integrator lands it.
4. Outcome: `{ "result": "DONE" }`.

`{{DEPENDS_LINE}}` is `Read slice-<id>.md for each slice yours depends on (<ids>) — they record what landed.` or `Yours depends on nothing.` `{{SIBLINGS_LINE}}` is `Slices <ids> run alongside yours in their own worktrees — stay inside your slice's files.` or empty.

