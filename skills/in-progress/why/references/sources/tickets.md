# Tickets

## What it holds

Issues with their descriptions and comments; parent and sub-issue trees; project docs and attached specs; labels such as `compliance`, `customer-request`, `perf`, `incident-followup`; milestones; linked PRs. This is where the product or business forcing function lives: "customer X asked" or "the Q3 compliance initiative".

## Searching

1. Fetch the ticket IDs the anchor found.
2. Search business and customer terms: product names, customer names, initiative names.
3. Walk up the tree. Sub-issues are tactical; parents carry the why.
4. Read the project and its documents when an issue belongs to one.
5. Note labels and milestones: the label class hints at the kind of motivation (`sev-*`, `postmortem-action-item`, `reliability` on incident work), and a deadline often is the motivation.

## Good evidence

A description stating the business problem. A comment recording a decision and its reason. A parent issue named like an initiative. An attached PRD or spec. A label such as `customer:acme` or `incident-followup`.

## Pitfalls

- A ticket can be closed and reopened with a new scope. Read its whole history and check its dates against the code's ship date.
- A "Why" section is evidence when it names a customer, a number, a date, or an incident; boilerplate like "improve user experience" is not.
- Follow duplicate-of chains back to the canonical ticket.

## Extra fields

Per ticket: whether the motivation sits in the description or a comment; labels, parent, project, and the created and closed dates.
