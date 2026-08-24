# One-way doors

Every worker's preamble points here.

A **one-way door** is an open question you can't safely decide: the spec is ambiguous, contradicts the codebase, or the choice would be expensive to reverse (data migration, public API shape, irreversible deletion, money flow). Surface it instead of deciding: write the question and the options you considered to the state dir's `notes/` as a numbered `door` note, post the same text as a `## AFK one-way door` comment on the PR if one is open (else on the issue), then write the outcome `{ "result": "STOPPED", "question": "<the question>" }`. The door comes last — finish and record whatever else you were doing first.
