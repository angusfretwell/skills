Your brief names why checks failed:

- **RED** — Fetch the failing check's output (`gh pr checks`, then the failing run's log), reproduce locally where possible, fix, confirm that command passes.
- **CONFLICT** — Fetch and rebase onto the default branch, resolving conflicts with `/mattpocock-skills:resolving-merge-conflicts`; push with `--force-with-lease`.

Where you changed code: typecheck, run the affected tests, `/commit`, push. If the PR's title or body went stale, `/open-pr` to refresh them — it stays a draft.
Outcome: `{ "result": "ADDRESSED" }`.
