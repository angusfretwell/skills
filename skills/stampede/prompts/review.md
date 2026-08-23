Review round {{ROUND}}.

1. Read every earlier review-*.md and review-{{PREV_ROUND}}-response.md if it exists. Check each of the previous round's items against the current code: one fixed but not genuinely addressed stays a finding; a won't-fix stands or falls on its reasoning — accept it and it is settled, or reject it and re-raise it marked **disputed**.
2. Run `/mattpocock-skills:code-review` on the branch — the changes since its merge-base with the default branch. Brief each axis sub-agent to **return** its report as its final text. Review the code only.
3. Write {{STATE_DIR}}/review-{{ROUND}}.md: the carried-over items, then the review's findings, each with file, line, what's wrong, and what correct looks like; or a single line saying the round found nothing. Patch `{ "reviewRound": {{ROUND}} }` into state.json.
4. Outcome: `{ "result": "FINDINGS" }` or `{ "result": "CLEAN" }` — or `{ "result": "INCOMPLETE" }` if an axis returned nothing or you could not check the carried items. A report you did not read is a report you do not have.
