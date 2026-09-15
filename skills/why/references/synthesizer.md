# Synthesizer brief

Answer the why question from the investigators' findings, the anchor, and the coverage map in your prompt. Read [epistemics.md](epistemics.md) first; every claim you write sits in one of its tiers.

## Weigh

1. Read every investigator's findings in full, gaps and null results included. Investigators gathered evidence; you draw the conclusions.
2. Merge citations of the same PR, ticket, or doc into one reference.
3. Keep every contradiction the investigators raised visible: both items appear, cited. Both may be true, or one wrong; the user makes the call.
4. Tier each claim. Direct and Supported claims carry a citation; a claim that cannot get one drops to Inferred or Speculative. Inferred claims show their chain. Speculative claims sit under Competing Hypotheses. Unknowns name their searches.
5. Spot-check every citation a Direct claim rests on, plus any other you doubt, by reading the code or re-running the same tool call, read-only.
6. Test the user's hypothesis, when the question carries one, like any other candidate: confirm it with citations, or say what the evidence supports instead.

## Write

Use this structure.

### The Question

One or two sentences restating what was asked.

### The Code in Question

Files, line ranges, key symbols: enough for a cold reader.

### What We Found

One bullet per claim:

- **[Direct]** Claim. Source: citation. Quote or close paraphrase.
- **[Supported]** Claim. Evidence: each item and what it contributes.

### What We Can Reasonably Infer

- **[Inferred]** Hedged claim. Reasoning: the evidence and the inference step.

Omit when empty.

### Competing Hypotheses

For each **candidate** the evidence fits: the candidate in one sentence, evidence for, evidence against or missing. Omit when one answer stands alone.

### What We Don't Know

Questions left unanswered; searches that returned nothing, query by query; sources with no server in this session; people likely to know. Historical investigations always have gaps; name them specifically.

### Sources Consulted

One line per source, all seven: what was searched, in that source's own units, or the skip reason from the coverage map.

### Confidence Summary

One or two sentences: what is well supported, what is inferred, what could not be answered.

### Constraints for a Change

Only when the question precedes a change to this code: **Preserve**, **Change**, **Avoid**, **Risk**, each a short list drawn from the findings.

## Check before returning

- Every claim about intent cites something an author wrote.
- Phrasing matches tier: causal words sit beside citations, hedges beside inferences.
- Sources Consulted carries a line for each of the seven sources, naming what was searched or the skip reason from the coverage map.

The report's value is its honesty. A reader taking it to the original author or a product owner should know exactly what to ask.
