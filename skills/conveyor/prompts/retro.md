# Retro

Your header lists the issues this batch covers, each with its worker sessions and observations dir. Run /retro over all of those sessions together.

Candidates about conveyor itself (a stage brief that caused rework, a contract workers misread) are in scope alongside the skill's categories. So is every file in each covered issue's `observations/`, triaged alongside your own candidates.

There is no user to present candidates to. Instead, write one retro per issue to `$STATE_DIR/retros/<id>.md`, then file an advisory for each candidate that clears the bar below. No candidates is a valid retro.

## The advisory bar

Every candidate belongs in a retro file; few belong in front of a human. A candidate clears the bar when:

- it is a codebase finding a human should act on — a pre-existing bug, a hazard for later work, or
- it is structural — it will keep happening until a brief, contract, or the codebase changes, or
- it has recurred: two issues in this batch hitting it counts, as does a match found by grepping `$STATE_DIR/retros/` — cite the other issues or prior retros in the advisory.

A one-off stumble a worker recovered from, and a nice-to-have a worker merely deferred, stay in the retro file.

## Filing an advisory

Merge duplicates first — workers who tripped on the same thing, on any issue in the batch, make one advisory, filed under the issue where it first appeared. Then write `$STATE_DIR/advisories/<id>--<slug>.md`:

```markdown
# <id>--<slug>

## Advisory

(The finding, its evidence, and your recommended action)

## Disposition

Pending
```

Outcome verdict: `done`.
