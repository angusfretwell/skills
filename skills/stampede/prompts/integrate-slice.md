Land slice {{SLICE_ID}} of issue {{ISSUE_ID}} onto branch {{BRANCH}}: slice branch {{SLICE_BRANCH}}, worktree {{SLICE_WORKTREE}}, recorded in {{STATE_DIR}}/slice-{{SLICE_ID}}.md.

Rebase {{SLICE_BRANCH}} onto {{BRANCH}} (from its worktree), resolving conflicts with `/mattpocock-skills:resolving-merge-conflicts` and the plan's shared interfaces as the tiebreak; then from here `git merge --ff-only {{SLICE_BRANCH}}` and push {{BRANCH}}. Typecheck once; fix only what the integration broke, `/commit`, push. Remove the slice's worktree and branch with `wt remove {{SLICE_BRANCH}}` from the main worktree ({{MAIN_WORKTREE}}). In state.json set `slices[id={{SLICE_ID}}].status` to `"merged"`.
Outcome: `{ "result": "MERGED", "slice": "{{SLICE_ID}}" }`.
