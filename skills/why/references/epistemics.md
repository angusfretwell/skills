# Epistemics

Code is **mechanics, not motivation**: what it does is readable, why it exists lives in **the record**, all partial, biased, and sometimes missing. The record is the evidence; the code never testifies to its own intent.

## Tiers

Every claim sits in one tier. The tier fixes which section holds it and how it is phrased.

| Tier | Evidence | Phrasing |
| --- | --- | --- |
| **Direct** | An author wrote the why: a PR body, a ticket, a code comment, a design doc, a chat message. | Plain, present tense, citation adjacent: "This exists because X (PR #123)." |
| **Supported** | Several indirect items converge: a `perf` label, a PR titled "improve performance", tests added for large inputs. | Confident and derived: "The evidence points strongly to X:" then the items, each cited. |
| **Inferred** | A reasonable reading with nothing stating it. | Hedged, chain visible: "Given A and B, C seems likely because D." |
| **Speculative** | A plausible story the thin evidence fits no better than its rivals. | Marked as a guess: "One possibility is X; nothing in the record confirms it." Lives under Competing Hypotheses. |
| **Unknown** | Searched and not found. | Name the searches: "The tracker was searched for A and B, the six PRs since 2023 read, and the repo grepped for the constant; none gave a rationale." |

Causal words carry Direct or Supported weight: *because*, *the reason is*, *was designed to*, *fixes*, *the team decided*. Each sits next to its citation. Hedges carry Inferred weight: *appears to*, *likely*, *suggests*, *is consistent with*, *one reading is*. Report the evidence rather than yourself: "the evidence suggests" where "I think" would go. Words that assert the obvious (*obviously*, *clearly*, *just*) flag a claim whose tier needs checking.

## Rationalisation

Code that makes sense today may have been written for reasons that no longer apply, or were wrong at the time. Take the record as it is: a consistent pattern may be copy-paste, and silence on a concern says nothing about whether it was held.
