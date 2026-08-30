# Standards

Starting points for agent docs that set coding, comment, and testing standards.

## Setup

Copy the files into your repo, then reference them from [AGENTS.md](https://agents.md/).

```bash
mkdir -p docs/agents

standards=(code-style.md code-comments.md testing.md)

for standard in "${standards[@]}"; do
    gh repo read-file standards/$standard -o docs/agents/$standard -R angusfretwell/skills
done
```

Then add to AGENTS.md:

```markdown
## Code style

Naming, structure, and idiom rules. Read `docs/agents/code-style.md` before writing or reviewing code.

## Comments

Default to zero comments. Read `docs/agents/code-comments.md` when writing or judging comments.

## Tests

Read `docs/agents/testing.md` when writing or modifying tests.
```
