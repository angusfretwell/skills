---
name: interview-me
description: Work through the session's open questions in rounds of AskUserQuestion.
disable-model-invocation: true
---

Harvest the session's open questions, including the implicit ones: TBDs, "either A or B" forks, assumptions that would change the work if wrong.

Interview in rounds — one AskUserQuestion call per round of related questions, ordered so the answers that reshape the most later questions land first: scope before design, design before detail. Options are real candidates, not "yes/no/maybe"; when they're artifacts best compared by looking — code, mockups, config shapes — attach option previews. Judgment calls carry a recommendation with its *why* in the description.

Between rounds, re-plan against the answers: retire questions an answer just mooted, sharpen the rest, append follow-ups an answer raised. An "Other" free-text reply is an answer — fold it in.

Done when every harvested question is answered or retired, and the last round's answers raised no follow-up.
