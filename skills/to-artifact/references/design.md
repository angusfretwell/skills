# Design judgment

Act as an excellent designer, editor, information architect, data storyteller, and design engineer. Turn the available material into a page that makes the reader's job easier: shape the argument and the interface together rather than restyling a data dump or assembling generic components.

This document is how to judge the page. [SKILL.md](../SKILL.md) is the order of work, and [css-api.md](css-api.md) is how the markup is written: this document decides which primitives the material earns, that one decides how they are written. `artifact-design` loads alongside this document and carries the fundamentals; this document is the delta, and where it disagrees it says so.

## Voice

Make the page precise, calm, direct, technically literate, evidence-led, editorial, and restrained. Build confidence through clarity, proof, and command of the material, never through hype, decoration, novelty, false certainty, or exaggerated claims.

Treat the page as an editorial surface even when it carries product-like interaction. It is evidence, not product UI, a generic SaaS landing page, or a marketing campaign.

## Priority order

When requirements compete, protect them in this order:

1. Supplied facts, formulas, units, qualifiers, privacy requirements, and task constraints.
2. The stylesheet foundation: its tokens, type roles, controls, primitives, and theme behavior.
3. The argument: the reader's question, the strongest supported answer, and its evidence.
4. Consistency through the shell, typography, shared grid, and restraint.
5. A composition specific to this material.
6. Responsive behavior, interaction, and detail, without weakening the hierarchy.

## Ask first

Ask one grouped set of questions when proceeding could change commercial meaning, security or legal claims, privacy, formulas, units, populations, periods, named parties, recommendations, approvals, deadlines, owners, or calls to action. Otherwise omit the unknown, label it honestly, and proceed.

The page's network budget is the Google Fonts requests, `brand.css`, and user-supplied assets. Ask before adding third-party JavaScript, a chart library, an icon kit, stock imagery, or analytics.

## Override artifact-design

Follow `artifact-design` except in these four places:

- **Body face.** Inter is the body face by decision, though `artifact-design` lists it among the faces to avoid.
- **Palette.** The stylesheet fixes the palette, so skip the per-page palette plan and take type and color from the tokens.
- **Theming.** The tokens resolve both themes themselves. Page CSS reads the tokens and writes no theme blocks.
- **Charts.** Chart color comes from the published chart tokens and primitives, in place of the `dataviz` skill's placeholder palette. Its method still applies.

## Composition

The first viewport is the argument, not a masthead followed by setup. It may be claim-led, evidence-led, comparison-led, or tool-led. Match the opening to the reader's job:

- **A decisive recommendation or conclusion:** make the answer and its decisive basis co-primary.
- **A comparison:** put alternatives on the same visual basis so the difference is seen, not reconstructed from prose.
- **A trend or benchmark:** let the relationship or exception lead; keep exact records below.
- **A tool:** let the working tool be focal evidence when manipulating an assumption is the reader's primary job. Do not require a separate static proof before it.
- **A brief with no supported decision:** lead with the strongest supported state, implication, limit, or unresolved question rather than inventing a call to action.

Map the material to a visual variable:

- Magnitude or rank to position or length on a common scale.
- Change over time to horizontal order and aligned position.
- Composition to proportion.
- Threshold or range to distance from a boundary.
- Process or dependency to connection and sequence.
- Qualitative alternatives to aligned rows or deliberately contrasted columns.

Compose the page as a field, not a stack of components. Establish one page-level throughline and one focal relationship in each reading moment or major section. Surround each focal object with a small number of supporting objects and enough open space to amplify its local hierarchy. Pace the scroll deliberately: vary density and quiet while retaining one visual grammar. Repetition creates rhythm only when the repeated items are true peers; otherwise it creates template noise. End with the resolved decision, implication, next action, or open question. Let sources and the footer follow quietly; the page should resolve rather than simply stop after a ledger or caveat.

Two tests judge the result:

- **Squint test:** at a glance the dominant claim or evidence is obvious and the reading path is stable.
- **Text-mask test:** with the words blurred, the hierarchy still communicates emphasis, grouping, and progression. If every block carries equal weight, redesign before coding.

Create presence through commitment, not additional effects. When a page feels too safe, strengthen one focal relationship through proportion, hierarchy, density, pacing, line breaks, or evidence placement, and make supporting content quieter. When the material feels thin, improve its selection, hierarchy, comparison, or explanation. Leave an evidence gap honest and open rather than filling it with panels, borders, icons, color fields, decorative charts, or effects.

## Visual system

Work inside the one system `brand.css` provides, using only the primitives the material earns.

### Grid and alignment

Use the shared outer grid for the masthead, title, sections, evidence, and footer. The foundation is 12 columns on desktop, 6 on tablet, and 4 on mobile. Reading prose normally occupies 6 to 7 desktop columns. Tables, charts, tools, diagrams, and major comparisons may use all 12.

Every object must align to a shared edge, baseline, grid line, or deliberate optical center. Equivalent blocks share type roles, value positions, internal rows, and action alignment. A split heading and paragraph align on their first text baselines. Keep content out of a narrow track while usable columns remain empty.

Make column gutters unmistakable. Wrapped headings, labels, and prose must not visually bridge from one column into the next. If adjacent columns can be misread as one line or phrase, widen the gutter, shorten or rebalance the content, or stack the columns.

Open space must amplify the focal object. Large empty rectangles caused by an underfilled split, orphaned third item, or delayed proof are layout failures. Reflow or rebalance them. A deliberately dominant peer may earn more width, but its difference must be meaningful.

Rank materially unequal findings, group them, or give the decisive finding more visual consequence, so the geometry matches the argument.

### Typography and rhythm

The heading face carries headings. The sans face carries prose, labels, controls, tables, KPIs, dates, counts, percentages, durations, and financial figures. The mono face is only for code, commands, paths, raw tokens, timestamps, and short operational identifiers such as region, plan, SKU, account, or environment IDs. Set only the identifier in mono, not its sentence or entire table.

Every size and weight comes from a published type role. Use `display` only for the single page-defining statement when scale is earned. Headings use the published heading roles at their defined weight; body copy uses regular; emphasis is scarce. Use tabular numerals for aligned comparisons. Equivalent peers always share role, size, weight, line-height, and numeric treatment; never resize one because its string is longer or its value is larger.

Build vertical rhythm from relationships:

- Heading to its first paragraph: close.
- Paragraph to paragraph or list: one body rhythm.
- Label to value to detail: identical across peers.
- Content group to new section: clearly larger.
- Caption or source to the evidence it qualifies: close enough to read together.

Give every gap one owner. A published flow, stack, grid, or page-owned wrapper sets the gap; its children carry no competing default margins. In page-owned CSS, reset the margins of grouped direct children and use the published spacing tokens. These express relationships, not one universal stack rule.

Judge the whole transition, not just its token. A large gap next to an underfilled split, short section, or sparse final row compounds emptiness even when the token is valid. Reduce the gap, rebalance the grid, or stack the content until the open space has a clear compositional purpose.

Group a heading, explanation, and list inside a page-owned grid cell rather than leaving them as unrelated siblings. Align equivalent roles across peers and let the group own its internal rhythm. Repair an awkward transition at its grouping or spacing owner, not with a one-off margin.

Keep body text at a comfortable reading size and line height; density comes from editing, never from tiny gray copy. Keep prose near 60 to 68 characters per line. Rewrite before shrinking.

Establish hierarchy through typography before surfaces or color. Separate paragraphs with space; never use first-line indents. Inspect important line breaks. Fix stranded words in large headings or ledes by improving the copy or measure, not by shrinking an individual element.

### Color, surfaces, and boundaries

Design in monochrome. Use color only when it adds significant meaning to state, action, or data, and pair it with a non-color cue. A recommendation, savings figure, cost component, or longer bar stays neutral however favorable it is. Use chart color only when it is needed to distinguish series or encode a sourced state. Light and dark themes are implicit; the page shows no theme switcher.

The page is normally one continuous canvas. Earn a surface or boundary only when it communicates selection, interaction, warning, contrast, or a real grouping that spacing cannot express. Prefer spacing, alignment, typography, and a change in density before borders or boxes.

Reserve cards for the few groupings that earn one, rather than wrapping every section, metric, or comparison. Keep panels unnested. Keep radii restrained and consistent with the foundation.

Create a strong contrast field only with the published contrast band; it owns the correct nested text, border, control, and theme colors. Build no second contrast surface in page CSS.

Diagnose quantity separately from intensity. If the page feels busy, remove, combine, or reorder content. If it feels loud, reduce competing color, scale, weight, borders, surfaces, and motion. Preserve one deliberate anchor; restraint must not flatten the page into neutral sameness.

### Data and evidence

Make the visual encoding honest. Show units, periods, populations, bases, and material comparators near the evidence they qualify. Use zero baselines for length encodings unless a clearly marked range or delta view better answers the question. Small differences keep their true scale rather than being exaggerated by cropped bars or hidden inside nearly identical totals; show the exact delta on the same basis. A bar track encodes a value or it is not a bar. Every peer bar shares one documented scale and its length must encode the value; otherwise use aligned text.

When peer denominators differ, choose count or rate explicitly from the reader's question. Compare rates to rates, not raw numerators across unequal bases. If length encodes a rate, show its count and base; if length encodes a count, explain why volume rather than incidence answers the question. Use aligned text or separate views when neither encoding is sufficient alone.

Size repeated horizontal bars as one layout, never row by row. Give the set one shared label lane, one plot lane, and one shared lane for every aligned value or annotation column. Every bar track starts and ends on the same grid lines; only the fill length varies. A row whose label, value, or annotation changes the plot width is a layout failure.

Reserve a clear lane for every chart label so no mark, line, bracket, or annotation crosses its glyph box. Keep chart text legible in both themes. Use a caption to state what the reader should notice and what the chart does not establish. Provide a semantic table or concise text alternative for material chart data.

When a chart is the primary proof, give it enough width, height, and contrast to carry the first read. Visual salience must agree with the argument: the decisive series, exception, or threshold receives the strongest emphasis in both themes, while supporting evidence recedes without becoming illegible.

Keep exhaustive ledgers after the decision path or behind native disclosure. A filterable audit table with dozens of rows defaults to a neutral decision-relevant subset — all failures, all exceptions, or every row named in the decision — rather than "All." State the active filter and selection rule; never hand-pick favorable rows. Keep an explicit way to inspect all rows, and show the current and total counts.

Tables are evidence, not decoration:

- Keep peer units and precision consistent; do not add fake precision.
- Give the row-label column enough width for ordinary short labels to stay on one line, rather than wrapping one while sibling columns hold unused width.
- Group related rows with semantic row groups, or separate tables when the category changes how the rows are interpreted, instead of spending a column repeating one category down a run of rows. Keep the category column only when readers need its value for row-level sorting or filtering.
- Use normal density for ordinary short tables; compact density is for genuinely dense lookup.
- Highlight a recommended row only when the source supports the recommendation.
- Reorder columns around the reader's lookup task before shrinking or wrapping them.
- Give dense evidence enough width before choosing a split layout. A table with five or more columns, or any table whose headers wrap at normal desktop width, owns the full section width. Keep every header intact at full size: move the introduction above the table or simplify the columns instead of clipping, truncating, or shrinking one to preserve a neighboring prose rail.

Use a qualitative comparison for concise differences; use a comparison table when exact row-by-row scanning matters. Peer columns must have matching type roles and aligned row starts. If one peer needs a different structure, it is not a peer grid.

### Interaction

Treat interaction as evidence, not decoration. A tool should make one model legible and let the reader test the assumptions that materially change the result.

Define one canonical state model: variables, fixed inputs, formulas, units, full precision, ranges, defaults, display precision, and dependencies. One control owns each variable. Fixed parameters are not controls. Pre-render the default result. Update dependent outputs atomically from full-precision state, then format for display. Preserve invalid entries and the last valid result rather than silently clamping or defaulting.

Keep the focal result, controls, and supporting outputs in one coherent tool. A ceremonial static version of the same answer before it, or a default-scenario recap after it, is redundant. Explain formulas, assumptions, bounds, or interpretation only when they help the reader trust or use the model.

### Motion and delight

Default to stillness. Add motion only when it explains a state change, preserves continuity, or confirms an action. Reading never waits on animation, sections appear without scroll reveals, and imagery holds still on hover. Keep the base experience complete without motion and respect reduced-motion preferences.

Create delight through unusually clear evidence or unusually low interaction friction: a comparison understood immediately, a tool that makes a model obvious, or a subject-specific interaction that removes work. Jokes, celebration, Easter eggs, decorative motion, and effects are not personality.

### Media and icons

Use supplied screenshots, diagrams, media, or brand marks only when they are evidence or materially improve understanding. Use an icon only where an established one makes an action materially faster to recognize; prefer text labels, and leave icons out of colored tiles.

### Access and reflow

Use landmarks, one descriptive `h1`, ordered headings, a skip link, native controls, semantic tables, figures and captions, accessible names, visible focus, and text alternatives. Meet WCAG AA and pair every color cue with a non-color one. Treat source order as reading order.

Keep page overflow visible rather than concealed. Give grid and flex children `min-width: 0`; reflow before shrinking. Preserve readable type and control sizes. Short comparisons may stack; long ledgers may scroll locally when reordering and simplification cannot preserve lookup. The page must remain usable in light and dark and across desktop and narrow screens without a visible theme switcher.

## Reflexes

A **reflex** is a generated-design default that reads as a template rather than as this page's evidence. Ship none of them:

- All-caps or tracked eyebrows, kickers, overlines, and decorative numbered section labels.
- Decorative gradients, gradient text, glows, blobs, stripes, textures, grid backgrounds, glass, paper simulation, colored side rails, ornamental shadows, and fake depth. A gradient earns its place only as a labelled continuous data scale.
- Generic centered hero copy followed by a card grid.
- Repeated metric boxes when one composed relationship would be clearer.
- A badge, pill, or rounded capsule for ordinary metadata, chart annotations, or editorial labels.
- Cards nested inside cards, or borders used to repair weak hierarchy.
- A dark rounded rectangle around every chart or tool.
- Arbitrary icon tiles, oversized icons, or mixed icon styles.
- Tiny muted prose, arbitrary font sizes, inconsistent peer values, or misaligned baselines.
- A narrow table floating inside a wide section, or a wide table compressed into broken words.
- Decorative charts, redundant visualizations, legends that replace direct labels, or color without meaning.
- Repeated full-width bars that do not share a scale or encode a visible difference.
- Identical section silhouettes across unrelated reader questions.
- Repeated recommendation, summary, rationale, and conclusion sections that say the same thing.
- Auto-scrolling marquees, simulated typing cursors, decorative pulsing status indicators, bounce, parallax, cinematic transitions, sound, and spectacle.
- Visible theme controls, print-only UI, stock imagery, decorative illustrations, abstract shapes, fake screenshots, mandatory hero media, and decorative marks.

Clearing the reflexes produces precise hierarchy, excellent typography, clear evidence, strong alignment, and deliberate tension, not a sterile template of black, white, thin rules, and large empty margins. The target is judgment, not decoration.
