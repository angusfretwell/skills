# Retro

Run /retro over every worker that touched this issue: the sessions listed in `state.json`'s `sessions`.

Candidates about conveyor itself (a stage brief that caused rework, a contract workers misread) are in scope alongside the skill's categories. So is every file in `$STATE_DIR/issues/<id>/observations/`, triaged alongside your own candidates.

There is no user to present candidates to. Instead, write the full retro to `$STATE_DIR/retros/<id>.md`, then file an advisory for each candidate that clears the bar below. No candidates is a valid retro.

## The advisory bar

Every candidate belongs in the retro file; few belong in front of a human. A candidate clears the bar when:

- it is a codebase finding a human should act on — a pre-existing bug, a hazard for later work, or
- it is structural — it will keep happening until a brief, contract, or the codebase changes, or
- it has recurred: grep `$STATE_DIR/retros/` for the same lesson and cite the prior retros in the advisory.

A one-off stumble a worker recovered from, and a nice-to-have a worker merely deferred, stay in the retro file.

## Filing an advisory

Merge duplicates first — workers who tripped on the same thing make one advisory. Then write `$STATE_DIR/advisories/<id>--<slug>.md`:

```markdown
# <id>--<slug>

## Advisory

(The finding, its evidence, and your recommended action)

## Disposition

Pending
```

Outcome verdict: `done`.
