Findings: the highest-numbered note of the kind your brief names (`review` or `qa`).

Triage **every** item onto a disposition before changing any code:

- **fix** — the default for a hard violation; where there's a testable seam, fix with `/mattpocock-skills:tdd` (the finding is the red test).
- **investigate** — read the code it names, then settle it into fix or won't fix.
- **won't fix** — the default for a judgement call: take it only when it earns its churn, otherwise decline it with a one-line reason. Also for a hard violation the code proves wrong.
- **one-way door** — the call is bigger than a won't fix, or the item arrived marked **disputed**.

Where you changed code: typecheck, run the affected tests, `/commit`, push. If the PR's title or body went stale, `/open-pr` to refresh them — it stays a draft.

Then write a `fix-<kind>` note: one line per item, disposition and what you did, written after the push so it records what landed.

Outcome: `{ "result": "ADDRESSED" }`.
