---
name: tldr
description: Rewrite a verbose explanation as its bottom line and the few facts that carry it. Use when the user asks for a tldr, or says an explanation is too long.
argument-hint: "[subject] [--technical | --non-technical]"
---

A **tldr** gives the **bottom line** first, then only the **load-bearing** facts: the ones the reader would decide or act differently without.

## 1. Pick the subject and the reader

Take the explanation the invocation names: a message, a file, pasted text. Otherwise take the last explanation in the session.

The reader is **technical** or **non-technical**. A technical reader works in the code and wants the mechanism: what happens, where, and why. A non-technical reader works with the product and wants the consequence: what they or their users see, and what it costs them.

`--technical` and `--non-technical` set the reader. Without either, the reader is technical when the user has been working in the code this session, and non-technical otherwise.

Done when one explanation and one reader are named.

## 2. Find the bottom line

The bottom line is the one sentence this reader needs if they read nothing else: what is true, and what it asks of them. When the explanation ends on a decision or an action for the reader, that is the bottom line.

Test every other idea in the explanation against it. A load-bearing idea changes what this reader decides or does. For a technical reader that is often a file, a function, a command, or the condition that triggers a bug. For a non-technical reader it is a date, a cost, who is affected, or a choice that is theirs to make. Cut the rest, however true or hard-won: how the answer was found, the background, the options already ruled out.

Done when the bottom line is one sentence, and every idea in the explanation is marked load-bearing or cut.

## 3. Tell it

Tell the tldr in the conversation, as prose per `/humanize`. Lead with the bottom line. It alone is a complete tldr; each load-bearing fact after it earns its place, most consequential first.

Carry each figure and name over exactly as the explanation has it, and state only what the explanation states. Use words the reader already has: where the explanation leans on a term it coined, say what the term means.

For a technical reader, name code by its identifiers and paths, and read [references/shapes.md](references/shapes.md): when the load-bearing facts describe structure, flow, or a change, one shape carries them in place of prose.

For a non-technical reader, name each thing as the product shows it, and bring the mechanism in only as the clause that makes a consequence make sense: "the search index rebuilds overnight, so a listing posted at 9am can't be found until tomorrow".

Done when the tldr leads with the bottom line, everything after it is a load-bearing fact, and it reads without the explanation it replaces.
