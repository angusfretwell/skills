# Rules

Starting points for agent docs that set coding, comment, and testing standards.

## Setup

Copy the files into your repo, then either reference them from [AGENTS.md](https://agents.md/) or wire them up as rules for your agent.

For example, as [Claude Code rules](https://code.claude.com/docs/en/memory#set-up-rules):

```bash
rules=(coding-standards.md comment-standards.md testing-standards.md)

mkdir -p docs/agents .claude/rules

for rule in "${rules[@]}"; do
    gh repo read-file "rules/$rule" \
        --output "docs/agents/$rule" \
        --repo angusfretwell/skills

    ln -s "../../docs/agents/$rule" ".claude/rules/$rule"
done
```
