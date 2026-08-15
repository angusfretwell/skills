# Narratives

How to order the points. Start from the nearest shape and deviate freely — each beat names what it proves and how the target changes it; [`recipes.md`](recipes.md) renders it.

## Feature walkthrough

Lead with what the feature does; descend toward how it's built only at the end, if at all.

1. **What it is** — one paragraph: who the feature is for and the job it does.
2. **The journey** — the flow, step by step. *Artifact*: captures in sequence, one per step. *Inline*: a call tree or a numbered list of states, naming the same screens.
3. **How it flows** — one journey or state diagram, naming the real screens and states the journey passed through.
4. **Where it lives** — short prose mapping the journey to the code: the entry points, linked as file references.

## Architecture overview

Captures are optional here — include them only where a UI grounds the system.

1. **The shape** — one paragraph naming the parts and the job of the whole.
2. **The flow** — a data-flow or sequence diagram of the main path.
3. **Part by part** — a short section per part: its job, its inputs and outputs, its entry point linked as a file reference. *Inline*: a shallow file tree does most of this work at once.
4. **The edges** — where the system touches the outside (APIs, queues, third parties), and what crosses each edge.

## Bug anatomy

Past tense for the bug, present tense for the fix.

1. **The symptom** — what the user saw. *Artifact*: a repro storyboard of captures when the bug is visible on screen. *Inline*: the failing output or assertion.
2. **The mechanism** — the failing path: the real states, and the branch where behavior diverged. *Artifact*: a diagram. *Inline*: a control-flow diff, with the minus and plus on that branch.
3. **The fix** — what changed, as prose with linked code references; the failing edge redrawn or annotated.
4. **The proof** — the same flow after the fix: a capture, or the passing test's output.
