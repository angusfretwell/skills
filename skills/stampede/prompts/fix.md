ADDRESS: {{ADDRESS}}.

{{ADDRESS_INSTRUCTIONS}}

Where you changed code: typecheck, run the affected tests (not the suite), `/commit`, push. Do NOT launch the app or drive a browser to check your work by hand — the QA stage does that. If the PR's title or body went stale, `/open-pr` to refresh them — it stays a draft.
Outcome: `{ "result": "ADDRESSED" }`.

`{{ADDRESS_INSTRUCTIONS}}` by case:

- **failing checks** — Fetch the failing check's output (`gh pr checks`, then the failing run's log), reproduce locally where possible, fix, confirm that command passes.
- **merge conflict** — Fetch and rebase onto the default branch, resolving conflicts with `/mattpocock-skills:resolving-merge-conflicts`; push with `--force-with-lease`.
- **review findings (round N)** / **QA findings (round N)** — Read {{STATE_DIR}}/review-N.md (or qa-N.md) and triage EVERY item onto a disposition before changing any code:
  - fix — the default; where there's a testable seam, fix with `/mattpocock-skills:tdd` (the finding is the red test).
  - investigate — read the code it names, then settle it into fix or won't fix.
  - won't fix — the item is wrong, or minor and discretionary and you judge against it.
  - one-way door — the call is bigger than a won't fix, or the item arrived marked **disputed**.
  Then write {{STATE_DIR}}/review-N-response.md (or qa-N-response.md): one line per item, disposition and what you did. Write it after the push so it records what landed.

