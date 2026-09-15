---
name: to-artifact
description: Publish a page as an Artifact in the house style. Use when asked for an artifact, or for a report, brief, plan, comparison, dashboard, or tool built as one.
argument-hint: "[subject]"
---

The deliverable is an **Artifact**, published in the house style.

Load `artifact-design` and `writing-for-humans` before designing. `artifact-design` carries the fundamentals and [references/design.md](references/design.md) is the delta over it: how to judge the page. [references/css-api.md](references/css-api.md) is how the markup is written against [assets/brand.css](assets/brand.css). Every word of page copy follows `writing-for-humans`.

## 1. Fix the subject

Take the **subject** from the first source that has one: what the invocation names; the subject under discussion this session; a PR or issue related to the current task. If every source is empty, ask.

Done when the subject is one written line and the material it rests on is in hand.

## 2. Frame the reader's job

Inspect all available material before designing. Privately establish:

- Who opens this, in what context, to decide or understand what?
- What is the strongest supported answer?
- What evidence makes that answer credible?
- What tradeoff, uncertainty, or limit changes its interpretation?
- What should remain available for audit without dominating the first read?

Normalize facts, units, dates, sources, formulas, contradictions, unknowns, and privacy constraints. Distinguish observation, derivation, projection, recommendation, and causation. Never invent intent, ownership, urgency, certainty, deadlines, approvals, future behavior, or confidentiality.

Order by reader need, not source order, and support two reading speeds:

- **Executive path:** title, headings, decisive values, captions, and conclusion communicate the argument quickly.
- **Audit path:** exact tables, assumptions, methodology, caveats, and sources preserve the record.

Describe the method actually used and the limits that change its interpretation. Omit failed attempts, unavailable credentials, and tool or environment diary unless a change of method materially affects confidence, reproducibility, or the decision.

Done when the **argument** is written down — the reader's question, the strongest supported answer, and the evidence that makes that answer credible — every section answers a reader question no other section answers, and every claim has one **evidence home**: a later table may preserve exact lookup, but no second summary, chart, card group, or conclusion restates the same answer at equal prominence.

## 3. Choose the composition

Name the obvious layout the material's category would suggest, and reject it unless the material earns it — a renewal proposal need not resemble every renewal proposal. When the material admits several structures, compare two materially different hypotheses, changing topology, density, and evidence placement rather than palette or component choice, and take the one that exposes the reader's question and strongest evidence with the least mediation.

Choose geometry before components: match the opening to the reader's job and the material to a visual variable per [references/design.md](references/design.md). Use tables for precise lookup, prose for one conclusion, and charts only for relationships that become faster to understand visually. Reach for a chart because a relationship needs one, not because values exist.

Give the page one **signature**: an evidence-bearing organizing move that belongs to this material and could not be transplanted unchanged into an unrelated report. A comparison geometry, a threshold, a sequence, a subject-specific diagram, a distinctive evidence rhythm, or the interaction itself. It clarifies the subject rather than decorating it.

Done when the first viewport is the argument rather than a masthead and setup, the chosen composition beat a named alternative, the page has its signature, and the composition passes the squint test and the text-mask test.

## 4. Build the page

Work inside the one system `brand.css` provides, using only the primitives the material earns. Compose per the visual system in [references/design.md](references/design.md), and ship none of the **reflexes** it lists: the generated-design defaults that read as a template rather than as this page's evidence.

Read [references/css-api.md](references/css-api.md) before writing any markup or page CSS. It is the only source for how the stylesheet is loaded, which element carries each class, which children each primitive expects in which order, which data attributes its rules read, and which tokens page-owned CSS may use. Copy each primitive's composition from it rather than reconstructing markup from a class name.

Done when the page is published with `brand.css` alongside it, every primitive is composed as `css-api.md` gives it, every size, weight, color, and gap comes from a published role or token, and the page ships no reflex.

## 5. Inspect and revise

Render the actual result when tooling exists. Inspect the first viewport, the full page, both themes, and responsive reflow. Review in this order:

1. **First read:** does the page read as one system immediately, and would a reader who saw only the first viewport remember the central relationship, decision, or tool rather than the title or mood?
2. **Composition:** is there one dominant object, does each section advance the argument, and is any open space accidental?
3. **Typography:** are roles consistent, peer values equal, baselines aligned, prose readable, gutters unmistakable, and does every visible gap have one owner?
4. **Evidence:** does the geometry prove the claim, do peer rows share exact label, plot, value, and annotation grid lines, do dense tables hold full width with headers intact and aligned to their columns, and is any default audit subset neutral and declared?
5. **Restraint:** can any surface, border, pill, icon, label, color, paragraph, or section go without losing meaning, affordance, or rhythm? If yes, remove it.
6. **Themes and reflow:** do light and dark carry equivalent hierarchy and contrast, and does the page recompose without overflow or character-level wrapping?
7. **Trust and access:** are semantics, focus, labels, text alternatives, sources, caveats, and interaction behavior sound?

Fix the highest-impact systemic defect, render again, and repeat.

Done when a render of the published page clears all seven checks, and the user holds the page itself: this review stays internal, so deliver no score, process diary, comparison log, or self-critique.
