---
name: review-pr
description: Review a pull request with the user, then post the review to GitHub, submitted or pending.
argument-hint: "<PR> [passes]"
---

A **finding** is one claim about the PR: where it applies, what's wrong, and why it matters. A **note** is a finding the user adds themselves, a `file:line` and a rough remark; it is triaged like any finding but never dropped. The review lands on GitHub submitted, or as a **pending review**, visible only to the user until they submit it there. **Triage** sorts every finding onto a **disposition** before a word of the review is written:

- **blocker**: would do harm on merge: a bug, a missed requirement, a risk to data.
- **question**: a suspected problem the code can't settle; it goes in the review as a question.
- **nit**: valid but optional; the author can take it or leave it.
- **drop**: invalid, already raised, or not worth the author's time.

## 1. Establish the PR

Take the PR from the invocation; otherwise ask. Read its title, body, base, head SHA, and every existing review thread, from any reviewer. The **range** every pass reviews runs from the head SHA's merge-base with the base branch to the head SHA.

Done when you hold the head SHA, the range, and the existing threads.

## 2. Choose the passes

- `/code-review` at `high` effort: always.
- `/mattpocock-skills:code-review`: always. It finds the spec itself.
- `/browser-qa`: when the app is browser-driven and the diff touches something a user sees.

When the user has named the passes, take those. Otherwise choose them by the rules above. Ask only when a rule is a close call, such as a diff whose effect on what users see you can't settle from the code: one multiSelect AskUserQuestion listing every pass, your picks marked recommended, each with a one-line reason.

Done when the passes are chosen.

## 3. Run the passes

Dispatch each chosen pass as its own sub-agent, all in parallel. Each brief carries the range, names the skill to invoke, and asks for the findings back as a list: file, line (or none), one-line claim, why it matters. A `/browser-qa` brief asks for each failure as a **repro**: steps to reproduce, expected against actual.

While the passes run, name them to the user with a one-line reason each, and tell them they can add notes at any point before the comments are written.

Done when every pass has returned its list. A reply without the list means the pass is still working: message it to finish and send the list.

## 4. Collect

Merge the lists into one, collapsing findings that make the same claim. Compare each finding with the existing threads, and tag one that repeats a thread with who raised it.

Done when every finding from every pass is on the list exactly once.

## 5. Triage

Judge each finding on its face, from what it claims and what you already know, and give it a disposition. When a finding can't be placed without reading the code, dispatch a sub-agent to **investigate** it: confirm whether it holds and return the evidence. Run every investigation in parallel, and place each finding from its evidence. An inconclusive investigation makes it a **question**.

Done when every finding has a disposition and every investigation has reported.

## 6. Present the triage

Write the triage as a message:

```md
Reviewed **#<number> <title>** with <passes>. <N> findings; I investigated <K> before sorting.

### Blockers (<count>)
1. `<file>:<line>` <claim>.
   _Investigated: <evidence>._

### Questions (<count>)
### Nits (<count>)
### Drop (<count>)
```

- Number the findings straight through every section, so the user can name them by number.
- Order **blockers** by harm on merge, worst first.
- Open a note's claim with **Your note:**, and a missed requirement with **Spec:**.
- Give the evidence line only to investigated findings.
- Name who raised a finding that repeats a thread.
- Phrase a **question** claim as its question; end a **drop** claim with why it drops.
- Leave out an empty section.

Recommend a **mode** from the dispositions:

- **Request changes**: any **blocker**.
- **Comment**: no blocker, but a **question**.
- **Approve**: only **nits**, or nothing.

On the user's own PR, GitHub offers only Comment, so recommend Comment.

Then ask the user how to proceed (AskUserQuestion), and say in the question that they can type changes instead:

- **Post as pending**, recommended: post the review pending, for the user to read and submit from GitHub.
- **Submit as <mode>**: post it submitted, in the recommended mode, once the user has read the comments.
- **Interview me**: work through every finding, or the ones the user names, one per question, four per call, offering the dispositions with yours first. Then ask again.
- **Changes**, typed: apply them, from moves between dispositions to a different mode, new notes, and explanations. Reply with the lines that changed, and ask again.

Done when the user picks **Post as pending** or **Submit**.

## 7. Write the comments

Load `/humanize` and read [references/shapes.md](references/shapes.md): both govern every comment.

Write a comment for each finding not dropped, from the code, as the user, a teammate talking to the author. Show, don't tell:

- When the fix replaces lines inside the diff's hunks, the comment is a `suggestion` over those lines with a one-sentence caption.
- When the point is about logic, flow, or structure, pick its **shape** from the menu and caption it.
- Otherwise, write one or two sentences: the problem, then the fix. Add why it matters only when the author couldn't infer it.
- Phrase a **question** as the question the user wants answered.
- Open a **nit** with `Nit:`.
- Give a `/browser-qa` failure as its repro.

Then edit each comment against `/humanize`: cut every sentence the shape already shows or the author would infer.

Done when every finding not dropped has a comment, every fix that replaces lines inside the hunks is a `suggestion`, and every comment has had its edit pass.

## 8. Post the review

GitHub allows each user one pending review per PR. When the user already has one on this PR, ask whether to delete it first.

Anchor each comment on the line that owns it: the line where the cause sits. GitHub accepts anchors only inside the diff's hunks, so when the cause sits outside them, anchor on the changed line that brings it into play. Anchor a `suggestion` on the lines it replaces, a range from `start_line` to `line` when it spans several. A comment with no owning line in the hunks goes in the review body. The body holds those comments and nothing else, so it is empty when everything anchors.

To submit, first show the user every comment with its anchor, then confirm (AskUserQuestion): **Submit as <mode>**, or **Post as pending** instead. Apply typed edits and ask again.

Create the review in one call: write the payload as JSON and send it with `gh api repos/<owner>/<repo>/pulls/<number>/reviews --input <file>`. The payload holds `commit_id` (the head SHA), `body`, and `comments[]` of `{path, line, side, body}`, adding `start_line` for a range. `side` is `"RIGHT"`, or `"LEFT"` on a line the PR deletes. To submit, set `event` to the mode: `REQUEST_CHANGES`, `COMMENT`, or `APPROVE`. To post pending, omit `event`.

Done when the review exists on the PR, submitted or pending as the user chose.

## 9. Report

Report the review's link and its mode. For a pending review, give the recommended mode with a one-line reason.

Done when the user holds the link and the mode.
