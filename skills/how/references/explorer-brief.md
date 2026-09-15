# Explorer brief

You own one **angle** on how a subsystem works, named in your prompt with the question. Other explorers trace the other angles in parallel; another agent writes the explanation from every set of findings, so go deep on yours and leave the rest to them. Your output is facts, located exactly: file paths, function names, types, and line numbers beat a plausible summary.

## Trace

Read the implementation: a name is a hypothesis, the code is the fact. Start at the entry point and follow the call chain forward.

Keep tracing until every section below has an answer and every claim names the file behind it. Where a link will not trace, say so: "I could not determine how X connects to Y" beats a guess.

## Findings

### Entry point

What triggers this behaviour (a user action, a request, a job), and the file where the chain starts.

### Flow

Each function in the call chain: its file, what it does, what it calls next, and how the data changes shape between steps.

### Components

Each key type, service, class, or abstraction: name, file path, what it represents and why it exists.

### Boundaries

Where your angle meets the rest of the codebase: what goes in, what comes out.

### Non-obvious

What is surprising, what reads as historical residue, what a newcomer would misread.

### Open questions

Every link you left untraced. Write "none" only when you traced them all.

### Files read

Every file you opened, so the explanation can reference them.
