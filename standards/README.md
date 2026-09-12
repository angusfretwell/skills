# Standards

Starting points for agent docs that set coding, comment, and testing standards.

## Setup

Paste this prompt into an agent session in your repo:

````md
Set up agent standards docs from angusfretwell/skills:

Download coding-standards.md, comments.md, tests.md, and writing-style.md from the `standards/` directory of angusfretwell/skills into `docs/agents/` — or into this repo's existing agent-docs location if it has one:

```sh
# Using gh
gh repo read-file standards/<file> -R angusfretwell/skills

# Using curl
curl -fsSL https://raw.githubusercontent.com/angusfretwell/skills/main/standards/<file>
```

Add these sections to AGENTS.md (create it if missing), with paths adjusted to where the files landed:

```md
## Coding standards

Read [coding-standards.md](docs/agents/coding-standards.md) before writing or reviewing code.

## Comments

Read [comments.md](docs/agents/comments.md) before writing or judging a comment.

## Tests

Read [tests.md](docs/agents/tests.md) before writing or modifying tests.

## Writing style

Read [writing-style.md](docs/agents/writing-style.md) before writing prose or interface copy.
```

Launch one subagent per downloaded file to tailor it to this repo. Each subagent edits only its own file, and is done when:

- every rule in its file has been checked against the codebase, and each rule that conflicts with an established convention here is rewritten to match what the code actually does;
- conventions this codebase follows that the file is silent on have been added; and
- it has reported what it changed.
````
