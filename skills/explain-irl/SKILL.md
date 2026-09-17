---
name: explain-irl
description: Explain a bug, edge case, limitation, or trade-off as a real-world scenario. Use when the user asks what one means in practice or for an example of it, or says they don't understand an explanation of one.
argument-hint: "[subject]"
---

A **scenario** follows one person through the problem in date order, until the reader sees what it does to them.

## 1. Pick the subject

Take the subject the invocation names. Otherwise take the last one raised in the session; when that message raised several, ask which with AskUserQuestion.

Done when one subject is named.

## 2. Cast and trace

Cast the **person** who feels the consequence, named in the project's vocabulary: a customer, an editor, a caller of the API. Give them a first name and a starting position in real units: a count, a size, a date. Invent the person and every value about them, even when real records are within reach.

**Trace** each number: run the person's inputs through the code that decides the outcome, and note what the system produces at each step. A number you can't trace is **illustrative**; mark it so in the scenario.

For a trade-off, trace the same person through each option, so the option is the only thing that changes.

Done when every number the scenario will show is traced or marked illustrative.

## 3. Tell it

Tell the scenario in the conversation, as prose per `/writing-for-humans`. Bring the cause in at the moment it bites, in product terms: "the search index rebuilds overnight, so the listing she posts at 9am can't be found until tomorrow". Show at most one code snippet: the line where things go wrong.

A scenario usually lands with these; pick what fits the subject:

- The person and their starting position, in numbers.
- What they do, dated.
- What the system shows, beside what is true.
- What happens when they act on what they're shown.
- Who notices: whether the error is **loud** (someone complains) or **silent** (nobody reports a number that looks plausible).
- For a problem that bites only under some condition, the same person on the normal path beside the broken one.
- For a problem of uncertain reach, how often its condition occurs and how sure you are.

Done when the scenario ends on what happens to the person, and reads without the explanation it replaces.
