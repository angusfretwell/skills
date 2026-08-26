# Retro

Run /retro: the sessions are the transcripts listed in `state.json`'s `sessions` — every worker that touched this issue. Candidates about conveyor itself (a stage brief that caused rework, a contract workers misread) are in scope alongside the skill's categories.

There is no user to present candidates to. Instead, write the full retro to `$STATE_DIR/retros/<id>.md`, then one advisory per candidate worth a human decision — `$STATE_DIR/advisories/<id>--<slug>.md`:

```markdown
# <id>--<slug>

## Advisory

(The finding, its evidence from the sessions, and your recommended action)

## Disposition

Pending
```

Advisories never go in your outcome's `doors` — they block nothing. No candidates is a valid retro.

Outcome verdict: `done`.
