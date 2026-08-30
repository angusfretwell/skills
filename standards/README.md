# Standards

Starting points for agent docs that set coding, comment, and testing standards.

## Setup

Paste this prompt into an agent session in your repo:

```markdown
Set up agent standards docs from angusfretwell/skills:

1. Download code-style.md, code-comments.md, testing.md, and writing-style.md from the `standards/` directory of angusfretwell/skills (`gh repo read-file standards/<file> -R angusfretwell/skills`, or `curl -fsSL https://raw.githubusercontent.com/angusfretwell/skills/main/standards/<file>` if that gh subcommand is unavailable) into `docs/agents/` — or into this repo's existing agent-docs location if it has one. Done when all four files exist in the target directory.

2. Add these sections to AGENTS.md (create it if missing), with paths adjusted to where the files landed:

   ## Code style

   Read `docs/agents/code-style.md` before writing or reviewing code.

   ## Comments

   Default to zero comments. Read `docs/agents/code-comments.md` when writing or judging comments.

   ## Tests

   Read `docs/agents/testing.md` when writing or modifying tests.

   ## Writing

   Read `docs/agents/writing-style.md` when writing prose or interface copy.

3. Launch one subagent per downloaded file to tailor it to this repo. Each subagent edits only its own file, and is done when:
   a. every rule in its file has been checked against the codebase, and each rule that conflicts with an established convention here is rewritten to match what the code actually does;
   b. conventions this codebase follows that the file is silent on have been added; and
   c. it has reported what it changed.
```
