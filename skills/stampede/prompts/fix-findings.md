Findings: {{STATE_DIR}}/{{KIND}}-{{ROUND}}.md.

Triage EVERY item onto a disposition before changing any code:

- fix — the default for a **blocker**; where there's a testable seam, fix with `/mattpocock-skills:tdd` (the finding is the red test).
- investigate — read the code it names, then settle it into fix or won't fix.
- won't fix — the default for a **discretionary** item: take it only when it earns its churn, otherwise decline it with a one-line reason. Also for a blocker the code proves wrong.
- one-way door — the call is bigger than a won't fix, or the item arrived marked **disputed**.

Where you changed code: typecheck, run the affected tests, `/commit`, push. If the PR's title or body went stale, `/open-pr` to refresh them — it stays a draft.

Then write {{STATE_DIR}}/{{KIND}}-{{ROUND}}-response.md: one line per item, disposition and what you did. Write it after the push so it records what landed.
Outcome: `{ "result": "ADDRESSED", "scope": "<scope>" }` — `scope` is `none` if you changed no code (every item declined), `surgical` if the change was local to the findings, `broad` if it reached across shared interfaces or refactored cross-cutting code.
