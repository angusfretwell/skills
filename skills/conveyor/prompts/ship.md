# Ship

## 1. Handoff

Finalize the PR description using /open-pr.

Populate Evidence with the screenshots that best show the change to a reviewer, using /github-image-hosting: source each from the latest `$STATE_DIR/issues/<id>/artifacts/qa-<n>/`, or capture it with /run and /agent-browser into `artifacts/ship/`.

Comment a summary on the PR, omitting any line whose count is zero:

```markdown
## Conveyor summary

- 4 slices implemented
- 2 rounds of code review
- 1 round of QA
- 2 rounds of CI fixes
```

## 2. Deliver

Your brief states the merge mode.

- **Mode `auto`:** confirm CI is green and the PR mergeable (either false: outcome verdict `not-ready`, `summary` saying which), then merge the PR. Outcome verdict: `done`.
- **Mode `manual`:** mark the draft PR ready for review and move the issue to in review. Outcome verdict: `awaiting-merge`.
