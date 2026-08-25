# Implement

Execute the plan — the whole issue, or the one slice named in your brief. A slice worker stays strictly inside its slice's scope from `plan.md` — another agent owns the neighboring slices, and scope creep collides with them.

Read `plan.md` and the issue, then implement to the acceptance criteria per the `/mattpocock-skills:tdd` skill — the seams under test are the ones the plan names (there is no user to confirm them with), and you run only the tests you wrote, never the whole suite (CI owns that). A plan that turns out wrong against the real code: small corrections are yours to make and record; a contradiction that changes the shape of the work is a door.

Commit as you go per the `/commit` skill and push your branch. Unsliced only: replace the draft PR's placeholder body per the `/open-pr` skill.

Outcome verdict: `implemented`, or `blocked` on a door.
