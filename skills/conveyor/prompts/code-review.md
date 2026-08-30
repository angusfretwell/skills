# Code review

Round `<n>`. Run /mattpocock-skills:code-review: the fixed point is base, the spec is the issue plus `PLAN.md`. On later rounds the previous round's findings and the fixer's response are context — verify the fixes landed.

Write findings to `$STATE_DIR/issues/<id>/review-<n>.md` — each item concrete enough for a fixer to act on.

Replacement wording a finding prescribes is a claim about the code: verify it against the code, ADR, or doc it describes and cite that source in the finding. With nothing to cite, describe what's wrong and leave the wording to the fixer.

Outcome verdict: `clean` (nothing found) or `fail` (report has items).
