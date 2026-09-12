# Comment Standards

Default to zero comments, in every hand-written file. Names, types, and structure carry the meaning.

A comment earns its place only when what it says comes from **outside** this codebase. Anything inside is a refactor target: rename, extract, or restructure until the comment has nothing left to say.

## What earns a comment

Three things, and nothing else:

- A workaround for an external quirk we cannot reshape: a library bug, an API oddity, a vendor or protocol constraint. Say what breaks without it.
- A constraint set outside this code that no name or type can carry: what a caller must honour, what an upstream module guarantees.
- A link to a decision record or an external authority: `@see docs/adr/NNNN-slug.md`. The link, never a summary.

A pointer at our own code is none of them. An import or a name should already have led the reader there.

Reference only what stays true: no PR numbers, issue IDs, "new", "temporary".

Put it in JSDoc at the function or export level. `@throws` earns its place where `@param` and `@returns` would only echo the types. Several inline comments in one function is a decomposition smell; split it into named pieces.

## Delete on review

Imagine the comment gone. If the code loses nothing, delete it. If it loses something held inside this codebase, reshape until it loses nothing, then delete it.

The failure mode is narrating your work instead of documenting the code. A long justification is a confession, not a defence. Delete:

- **Narration** restating the next line: `// fetch the user`.
- **Section headers**: `// Step 2: validate`. Extract a named function.
- **Process commentary**: `// as requested`. It belongs in the commit message.
- **Signature echoes**: `@param userId - the user's id`.
- **Obvious summaries** the name already gives: `/** Formats a date. */` on `formatDate`.
- **Rationale** for a choice over its alternatives: `/** A Map rather than an object, because the keys collide. */`.
