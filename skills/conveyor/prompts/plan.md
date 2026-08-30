# Plan

Claim the issue and produce the implementation plan the rest of the pipeline executes.

1. **Claim.** Mark the issue in-progress in the tracker.
2. **Scaffold.** Create the issue worktree and branch using /worktrunk:worktrunk, make an empty commit (a PR cannot open on a branch identical to base), push, and open a **draft PR** whose body is a placeholder: one line pointing at the issue — the real description comes after implementation.
3. **Explore.** Read the issue and the code it touches until you can name every file, interface, and behavior that must change, and the acceptance criteria QA will hold the work to. Ambiguities that block a safe start are doors.
4. **Slice** only if the whole change is too large for one implementer to hold — each slice must be implementable within a 150k-token context. Give each slice an id, a scope (files and behavior), and `dependsOn` (a slice depends on another when it needs its code, or they collide on the same files — collisions are an ordering, pick one). Prefer few, coherent slices over many thin ones; an unsliced plan is the default. Create each slice's worktree and branch.
5. **Write** `$STATE_DIR/issues/<id>/PLAN.md`: the change described concretely enough that an implementer who has never seen the issue can execute a slice from the plan plus the code alone — files to touch, interfaces, acceptance criteria, and per-slice scope when sliced. Every domain claim the plan prescribes must trace to something you verified in the code during Explore.

Outcome verdict: `planned` (with `"slices": [{"id", "dependsOn"}]` when sliced, else `"slices": []`), or `blocked` on a door.
