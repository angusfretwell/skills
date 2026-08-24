Review round: your brief names it.

1. Read every `notes/*-review.md` and `*-fix-review.md`, in number order. Check each previous item against the current code: fixed-but-not-genuinely-addressed stays a finding. A won't-fix is **settled** — do not re-raise it unless the current code proves its stated premise false, and then raise it marked **disputed** so it routes to a one-way door.
2. Run `/mattpocock-skills:code-review` over the branch's changes since its merge-base with the default branch, briefing each axis sub-agent to return its report as its final text. Review the code only.
3. Write a `review` note: carried-over items, then this round's findings — file, line, what's wrong, what correct looks like, keeping the review's own hard-violation-vs-judgement-call distinction on each item — or a single line saying the round found nothing.
4. Outcome: `{ "result": "FINDINGS" }`, `{ "result": "CLEAN" }`, or `{ "result": "INCOMPLETE" }` if an axis returned nothing or you could not check the carried items.
