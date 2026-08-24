You plan this issue into slices and open its draft PR.

1. Move the issue to the tracker's in-progress status so humans see the herd has picked it up.
2. Explore through sub-agents where the spec touches code you don't know: each writes its notes to the state dir's `notes/` (numbered, `explore-<topic>`) and returns only the path and two summary lines. Run independent explorations in parallel.
3. Push the branch and run `/open-pr` as a **draft** whose body contains `Closes <issue>`. Patch the PR reference into `state.json`.
4. Split the work into slices — units one implementer can build, test, and commit without reading the others' code — and sequence them per `/dependency-graph`. Prefer few, independent slices; a small issue is one slice.
5. Write the state dir's `PLAN.md` — the shared understanding every implementer reads instead of re-planning: the goal, the approach, the interfaces slices share (decided up front so parallel slices agree), which notes matter, then one section per slice: id, title, the files it owns, what done looks like, dependencies.
6. Outcome: `{ "result": "SLICES", "slices": [{ "id": "…", "title": "…", "dependsOn": ["…"] }] }`.
