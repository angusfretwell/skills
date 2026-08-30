# Standards

Starting points for agent docs that set coding, comment, and testing standards.

## Setup

Paste this prompt into an agent session in your repo:

````md
Set up agent standards docs from angusfretwell/skills:

Download code-style.md, code-comments.md, testing.md, and writing-style.md from the `standards/` directory of angusfretwell/skills into `docs/agents/` — or into this repo's existing agent-docs location if it has one:

```sh
# Using gh
gh repo read-file standards/<file> -R angusfretwell/skills

# Using curl
curl -fsSL https://raw.githubusercontent.com/angusfretwell/skills/main/standards/<file>
```

Add these sections to AGENTS.md (create it if missing), with paths adjusted to where the files landed:

```md
## Code style

Read `docs/agents/code-style.md` before writing or reviewing code.

## Comments

Default to zero comments. Read `docs/agents/code-comments.md` when writing or judging comments.

## Tests

Read `docs/agents/testing.md` when writing or modifying tests.

## Writing

Read `docs/agents/writing-style.md` when writing prose or interface copy.
```

Launch one subagent per downloaded file to tailor it to this repo. Each subagent edits only its own file, and is done when:

- every rule in its file has been checked against the codebase, and each rule that conflicts with an established convention here is rewritten to match what the code actually does;
- conventions this codebase follows that the file is silent on have been added; and
- it has reported what it changed.
````
