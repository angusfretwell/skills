# Chat

## What it holds

Real-time deliberation: incident channels, design threads, questions answered by senior engineers, post-merge second thoughts. This is where decisions too small for a doc were made.

## Searching

1. Author-bounded: messages from the PR author around the merge date.
2. Casual phrasings and misspellings of the anchor's terms.
3. The PR URL or `/pull/<number>`; PRs get linked when discussed.
4. Error strings the code handles; incident threads surface this way.
5. Likely channels: `#eng-*`, `#proj-*`, `#incident-*`, `#sev-*`, the owning team's channel, design review channels.

## Good evidence

A thread where tradeoffs were argued ("I was going to use A but B is better because"). An incident message describing the bug the code prevents. A reviewer's question with an authoritative answer. A reference to a meeting where the decision was taken. A product manager explaining a customer ask. A decision is discussion where a tradeoff was weighed and a choice stated; quote that.

## Pitfalls

- The most ephemeral source: retention cliffs, archived channels, and DMs no search reaches. An empty return here is usually a gap; record the cliff and the ground the tools cannot see.

## Extra fields

Per thread: channel, participants, date range, and the discussion or incident it belonged to.
