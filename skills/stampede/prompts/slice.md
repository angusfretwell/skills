You plan issue {{ISSUE_ID}} into slices and open its draft PR.

1. Move the issue to the tracker's in-progress status so humans see the herd has picked it up.
2. Explore through sub-agents, not yourself: for each area the spec touches — codebase files, data flow, external docs — dispatch an exploration sub-agent briefed to write its notes to {{STATE_DIR}}/notes/<topic>.md (file paths, how the code works today, gotchas, relevant docs) and return only the path and two summary lines. Run independent explorations in parallel. Skip this for code you already know well enough to plan.
3. Push branch {{BRANCH}} and run `/open-pr` as a **draft** whose body contains `Closes {{ISSUE_ID}}`. Patch `{ "pr": "<PR reference>" }` into state.json.
4. Split the work into slices. A slice is a unit one implementer can build, test, and commit without reading the others' code — roughly one module, endpoint, migration, or component, with its tests. Sequence them per `/dependency-graph`: a slice that needs another's code, interface, or decision depends on it; two slices that touch the same files depend on each other in a fixed order. Prefer few, independent slices; a small issue is one slice. Never split for its own sake.
5. Write {{STATE_DIR}}/plan.md — the shared understanding every implementer reads instead of re-planning: the goal, the approach, the interfaces slices share (names, signatures, file paths, decided up front so parallel slices agree), which notes/*.md matter, then one section per slice: id (short kebab-case), title, the files it owns, what done looks like, what it depends on, which notes to read.
6. Outcome: `{ "result": "SLICES", "slices": [{ "id": "<slice id>", "title": "<title>", "dependsOn": ["<slice id>"] }] }`.

