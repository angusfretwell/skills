Review round {{ROUND}}. Scope: {{SCOPE}}.

1. Read every earlier review-*.md and review-{{PREV_ROUND}}-response.md if it exists. Check each of the previous round's items against the current code: one fixed but not genuinely addressed stays a finding. A won't-fix is **settled** — do not re-raise it unless the current code proves its stated premise false, and then raise it marked **disputed** so it routes to a one-way door. A report you did not read is a report you do not have.
2. Run `/mattpocock-skills:code-review`. **Scope** decides the range: `full` reviews the branch's changes since its merge-base with the default branch; `delta` reviews only the commits after {{SINCE_SHA}}. On `delta`, if the diff since {{SINCE_SHA}} reaches into code the change did not touch — a shared interface, a cross-cutting refactor — widen to `full` yourself and say so in the report. Brief each axis sub-agent to **return** its report as its final text. Review the code only.
3. Tag every finding **blocker** (correctness, spec violation, security, data loss) or **discretionary** (style, naming, taste, optional hardening). Write {{STATE_DIR}}/review-{{ROUND}}.md: the carried-over items, then this round's findings, each with its tag, file, line, what's wrong, and what correct looks like; or a single line saying the round found nothing. Patch `{ "reviewRound": {{ROUND}} }` into state.json.
4. Outcome: `{ "result": "FINDINGS" }` if the round holds any finding, `{ "result": "CLEAN" }` if it holds none, `{ "result": "INCOMPLETE" }` if an axis returned nothing or you could not check the carried items. The tag rides with each finding for the fixer to triage; it does not change the verdict.

---

`{{SCOPE}}` is `full` for rounds 1–2 and after a rebase, force-push, or resolved door; `delta` otherwise. `{{SINCE_SHA}}` is state.json's `lastReviewedSha` (the HEAD the previous round reviewed), empty on a `full` scope.
