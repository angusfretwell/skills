Findings: {{STATE_DIR}}/{{KIND}}-{{ROUND}}.md.

Triage EVERY item onto a disposition before changing any code:

- fix — the default; where there's a testable seam, fix with `/mattpocock-skills:tdd` (the finding is the red test).
- investigate — read the code it names, then settle it into fix or won't fix.
- won't fix — the item is wrong, or minor and discretionary and you judge against it.
- one-way door — the call is bigger than a won't fix, or the item arrived marked **disputed**.

Where you changed code: typecheck, run the affected tests, `/commit`, push. If the PR's title or body went stale, `/open-pr` to refresh them — it stays a draft.

Then write {{STATE_DIR}}/{{KIND}}-{{ROUND}}-response.md: one line per item, disposition and what you did. Write it after the push so it records what landed.
Outcome: `{ "result": "ADDRESSED" }`.
