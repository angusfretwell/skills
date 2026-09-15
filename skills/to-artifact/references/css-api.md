# CSS API

The contract for [brand.css](../assets/brand.css). [design.md](design.md) decides which primitives the material earns; this file decides how they are written.

Each tree reads `element.class`, `?` on an optional node, `×n` for repetition, and `|` between alternatives for one slot. A bracketed attribute is one a rule reads when it is present. Copy each primitive from its tree: element, child order, and attributes are all load-bearing.

## Scope

The class names in this file are the entire public API. Take names from this file alone. Never inspect the stylesheet for internal selectors, and never extrapolate a name from another primitive: the detail line of a stat is `art-stat-detail`, and `art-stat-note` matches nothing.

When nothing here fits the material, use semantic HTML plus a page-owned hook: `page-*` for layout geometry, `page-viz-*` for non-text visualization marks. Keep every page-owned visualization class off SVG `text`.

## Loading

Publish `brand.css` as a supporting file through the Artifact tool's `files` parameter, mapped to `brand.css`, then link it relatively, after the Google Fonts link and before any page `<style>`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
/>
<link rel="stylesheet" href="brand.css" />
```

| Role     | Family           | Token                |
| -------- | ---------------- | -------------------- |
| Headings | Familjen Grotesk | `--art-font-heading` |
| Body     | Inter            | `--art-font-sans`    |
| Mono     | Google Sans Code | `--art-font-mono`    |

Page CSS references the family tokens, never the family names.

## Shell

The Artifact tool supplies `<html>`, `<head>`, and `<body>`, so the page starts at `art-shell`.

```
div.art-shell
├── a.art-skip-link
├── header.art-header?
│   ├── div.art-masthead
│   │   ├── p
│   │   └── div.art-document-meta
│   │       ├── p.art-recipient?
│   │       ├── p.art-state[data-status="verified"]?
│   │       ├── p.art-date?
│   │       └── p.art-confidentiality?
│   └── p.art-context?
├── main[id="main"]
└── footer.art-footer?
    └── p.art-sources
```

The masthead's first slot is an author or subject name written as a plain `p`. `art-document-meta` is one wrapping baseline-aligned row; carry at most two sourced fields there. `data-status="verified"` is the only status the stylesheet reads, and it turns `art-state` green.

`art-context` carries one orienting fact the masthead does not, such as the period, population, or basis.

The page `h1` lives in `main`, normally on the opening claim.

## Opening

```
section.art-opening[data-layout="split"]?
├── div.art-opening-claim
│   └── h1.art-title | h1.art-display
├── div.art-opening-proof?
│   └── evidence block
└── div.art-opening-context
    └── p.art-lede
```

`art-opening` is a 12-column block. The claim, proof, and context hold grid rows 1, 2, and 3 whatever the source order. `data-layout="split"` puts the claim on columns 1 to 7 and the proof on 8 to 12 of row 1, with the context on columns 1 to 7 of row 2.

The proof takes any evidence block. A lone `art-result[data-priority="primary"]` placed there gets the largest value size.

## Layout

| Class         | What it lays out                                                                                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `art-section` | Block-axis run inside a 12-column grid, 24px column gap. Prose children (`h2`, `h3`, `h4`, `p`, `ul`, `ol`, `dl`, `blockquote`, `art-reading`) narrow to 7 columns; everything else spans all 12. Child rhythm runs from 16px between paragraphs to 64px above a non-leading `h2`. |
| `art-chapter` | Groups sections, narrowing the section turn to clamp(32px, 4vw, 48px). Chapter to chapter takes clamp(64px, 8vw, 96px) when the chapters are direct children of `main` or `art-flow`.                                                                                   |
| `art-reading` | Wraps one prose run, capped at `--art-reading-width` (68ch). Child rhythm is 16px between paragraphs, larger above headings and evidence blocks.                                                                                                                        |
| `art-flow`    | Same rhythm as `art-reading` with no cap on itself; caps its prose children at reading width instead. For runs where evidence blocks and prose alternate at full width.                                                                                                 |
| `art-stack`   | One-column grid, 16px gap. `data-gap` takes `tight` (8px), `group` (32px), or `section` (64px).                                                                                                                                                                         |
| `art-cluster` | Inline-axis flex row that wraps, 12px gap, items centered.                                                                                                                                                                                                              |
| `art-grid`    | 12-column grid, 24px gap, children full width until given a span. `art-span-4`, `art-span-5`, `art-span-6`, `art-span-7`, and `art-span-8` take that many columns, `art-span-12` takes the row. Below 1000px the grid drops to 6 columns and spans of 6 or more go full width; below 600px every child goes full width. |
| `art-split`   | Two columns, 7fr to 5fr, 24px gap, aligned to the top. `data-ratio="equal"` gives 1fr to 1fr and `"wide"` gives 8fr to 4fr. Stacks at 800px and under.                                                                                                                  |
| `art-band`    | One-column grid, 16px gap, no surface. `data-tone="contrast"` is the only tone: it adds the contrast ground and its padding, and rebinds the text, border, and control tokens for everything nested inside.                                                              |

```
main[id="main"]
├── section.art-section
│   ├── h2
│   ├── p
│   └── div.art-grid
│       ├── div.art-stack.art-span-7
│       └── div.art-stack.art-span-5[data-gap="tight"]
└── section.art-band[data-tone="contrast"]
    ├── p.art-heading-24
    └── div.art-cluster
```

Every published container owns the gaps between its children, section to section included. Pages add no margins between them. Wrapping the sections in an `art-chapter`, or putting `art-stack` on that chapter, takes the section turn over.

`art-band` works as a direct child of `main` or nested inside an `art-section`; only the nested form inherits the section top margin.

The `art-span-*` classes carry column spans only inside `art-grid`. On a child of `art-split` they do nothing; change the split with `data-ratio` instead.

`art-reading` goes on a prose run, never on the shell or the whole page: it caps the evidence blocks too.

## Type roles

Every size, weight, and leading comes from one of these roles. Put the role on the element that carries the meaning.

| Class                 | Element and use                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `art-display`         | One page-defining statement, capped at 20ch.                                                                                    |
| `art-title`           | The `h1` role, capped at 24ch. Goes on the page `h1`, including the one in `art-opening-claim`. A bare `h1` already carries it. |
| `art-heading-24`      | The `h2` role on an element that is not an `h2`. Bare `h2`, `h3`, and `h4` already carry their own.                             |
| `art-heading-20`      | The `h3` role.                                                                                                                  |
| `art-heading-16`      | The `h4` role.                                                                                                                  |
| `art-lede`            | One short orientation paragraph under the title, capped at reading width.                                                       |
| `art-label`           | Compact name above a value or control.                                                                                          |
| `art-meta`            | Subordinate metadata line, tabular figures.                                                                                     |
| `art-caption`         | Standalone caption, the same rule `figcaption` gets.                                                                            |
| `art-mono`            | The identifier only, not its sentence: region, plan, SKU, account, path, command. Normally on a `span` inside the prose.        |
| `art-numeric`         | Tabular figures that never wrap. On a `th` or `td` it also right-aligns the cell, which `data-align="numeric"` does too.        |
| `art-value-primary`   | A single decisive figure standing outside a stat, metric, or result block.                                                      |
| `art-formula`         | One formula line, wrapping rather than overflowing. Pair it with `art-mono` on the same element.                                |
| `art-sources`         | The sources and method passage, at metadata size.                                                                               |
| `art-link`            | Anchor inside prose. `data-variant="highlight"` colors it, `data-variant="secondary"` quiets it.                                |
| `art-visually-hidden` | Text for assistive technology only.                                                                                             |

## Editorial blocks

`art-note` is a padded paragraph and `art-callout` a wrapper around block content. Both take `data-tone` of `info`, `success`, `warning`, or `error`, and `art-callout` also takes `data-variant="contained"`. The tone paints the background on `art-callout`; on `art-note` it is inert, so a toned note renders exactly like an untoned one.

```
p.art-note[data-tone="warning"]
```

```
div.art-callout[data-tone="success"]
└── p
```

`art-decision`, `art-recommendation`, and `art-action` are one-column grids with a 12px gap. Each goes directly on a `p`, `li`, or `blockquote` when the point is one sentence, or wraps a label, a heading-role line, and prose or a control. `data-priority` on `art-decision` is inert.

```
div.art-decision
├── p.art-label
├── p.art-heading-20
└── p
```

`art-next-step` takes exactly two children: a primary line in a 4fr label lane, and the supporting content it governs in an 8fr content lane.

```
div.art-next-step
├── p.art-label
└── div
    ├── p
    └── div.art-actions
```

`art-list` puts 8px between list items and `art-list-compact` puts 4px. Both go on the `ul` or `ol`.

## Controls and results

`art-control-group` stacks `art-field` blocks 16px apart. An `art-field` holds its label, then the control, then `art-range-ends` for a range, then `art-helper`, then `art-error`. `data-invalid="true"` on the field reddens its control, and `art-error` stays hidden while empty. Put a range's live readout in an `output` inside that field's `art-helper`.

```
div.art-control-group
├── div.art-field
│   ├── label.art-label
│   ├── input[type="range"]
│   ├── p.art-range-ends
│   │   ├── span.art-range-min
│   │   └── span.art-range-max
│   ├── p.art-helper
│   │   └── output
│   └── p.art-error?
└── div.art-field
    ├── label.art-label
    ├── div.art-unit-field
    │   ├── span.art-unit-prefix?
    │   ├── input
    │   └── span.art-unit-suffix?
    ├── p.art-helper?
    └── p.art-error?
```

`art-unit-field` is the bordered box and holds the prefix, the input, and the suffix in that order and nothing else; the label and helper stay outside it.

`art-result-group` is an auto-fit grid of peer `art-result` blocks. A result holds its label, then its value, then an optional detail.

```
div.art-result-group
└── div.art-result ×n
    ├── p.art-result-label
    ├── p.art-result-value | strong | output
    └── p.art-result-detail?
```

`art-actions` and `art-action-row` are the same wrapping flex row as `art-cluster`, holding buttons and links. They are the row; `art-action` is the label-and-control grid above.

```
div.art-actions
├── button[data-variant="primary"]
├── button
├── button[data-variant="tertiary"]
├── button[data-selected="true"]
├── button[disabled]
└── a.art-button
```

Buttons take `data-variant="primary"` or `data-variant="tertiary"`, and default with no attribute. `data-selected="true"` gives the filled pressed treatment, as do `aria-pressed="true"` and `data-state="active"`. `art-button` gives an anchor the identical rule.

## Evidence

`art-stat-strip` and `art-metrics` own peer blocks under one contract: label, then value, then an optional detail, with a subgrid keeping the lanes aligned across peers. Position two accepts the named value class, a `strong`, or an `output`. Three peers occupy one row.

```
div.art-stat-strip
└── div.art-stat ×n
    ├── p.art-stat-label
    ├── p.art-stat-value | strong | output
    └── p.art-stat-detail?
```

```
div.art-metrics
└── div.art-metric ×n
    ├── p.art-metric-label
    ├── p.art-metric-value | strong | output
    └── p.art-metric-detail?
```

Inside `art-stat-strip`, `art-metrics`, or `art-result-group` every value shares one size and the peer rule outranks `data-priority`. `data-priority` of `primary` or `supporting` changes the value size only on a lone `art-result`, such as the one in `art-opening-proof`.

`:has()` drops a four-block strip to two columns between 801px and 900px. `data-count="4"` on the strip is the fallback without `:has()`, and also takes two columns between 600px and 800px.

`art-comparison` is the same auto-fit grid for peer columns, each column normally an `art-stack`. `data-align="rows"` makes columns of exactly two children share row lines. A column with more than two children falls back to plain stack flow.

```
div.art-comparison[data-align="rows"]
└── div.art-stack ×n
    ├── p.art-heading-20
    └── p
```

`art-table-wrap` directly owns one semantic table and nothing else. Its attributes are `data-density="compact"`, `data-variant="comparison"` (which reads `data-recommended="true"` on a row), `data-sticky-first="true"`, and `data-mobile="stack"` (which needs `data-label` on every body cell and at most five rows). `art-table-emphasis` goes on a `tr`, `th`, or `td` to raise it onto the secondary ground.

```
p.art-overflow-cue?
div.art-table-wrap[data-variant="comparison"]
└── table
    ├── caption
    ├── thead
    │   └── tr
    │       ├── th[scope="col"]
    │       └── th.art-numeric[scope="col"] ×n
    ├── tbody
    │   └── tr[data-recommended="true"] ×n
    │       ├── th[scope="row"]
    │       └── td.art-numeric ×n
    └── tfoot?
p.art-caption?
```

`art-overflow-cue` is a paragraph placed immediately before the wrapper; it shows at 800px and under and suppresses the stylesheet's own scroll hint. A caption paragraph follows the wrapper.

A table spans the full 12-column evidence width by default. Put `art-numeric` or `data-align="numeric"` on the numeric `th` as well as every numeric `td`; body alignment does not align the header.

`art-figure` is a `figure` holding one image, inline SVG, or diagram plus its `figcaption`.

```
figure.art-figure
├── svg | img
└── figcaption
```

`art-evidence` is a 16px grid that flattens any surface or table nested inside it.

```
div.art-evidence
├── p.art-label
└── div.art-table-wrap
```

`art-surface` is transparent until given `data-variant="contained"` or `data-contained="true"`, which are the same switch. A surface frames evidence from outside, so `art-surface` and `art-evidence` go on separate nodes.

`art-swatch` is a 10px inline chip that reads its color from an `art-series-*` class on the same element.

```
div.art-surface[data-variant="contained"]
└── p
    └── span.art-swatch.art-series-1
```

## Bar list

```
div.art-bar-comparison
└── ul.art-bar-list
    └── li.art-bar[data-role="primary" | "reference"] ×2-6
        ├── span.art-bar-label
        ├── span.art-bar-value
        └── span.art-bar-track
            └── span.art-bar-fill[style="width: N%"]
p.art-caption?
```

Each bar takes exactly three children in the order label, value, track: label in column one and value in column two of row one, track spanning both columns on row two.

`art-bar-fill` has zero length until an inline `style="width: N%"` sets it, where N is the value's share of the domain maximum on one shared zero-based scale. `data-role="primary"` on a bar quiets every other fill in the list; `data-role="reference"` quiets that bar alone.

## Charts

```
figure.art-chart[data-mobile="scroll"]?
├── div.art-chart-header
│   ├── p.art-chart-title
│   └── p.art-chart-description?
├── div.art-chart-viewport[tabindex="0"]
│   ├── svg.art-chart-desktop
│   └── svg.art-chart-mobile
├── figcaption
└── ul.art-legend?
```

Both SVGs are direct children of the viewport: `art-chart-desktop` shows above 800px and `art-chart-mobile` at 800px and under. A sibling between them is fine; a wrapper around either one breaks the swap. `data-mobile="scroll"` on the figure holds a single SVG at `--art-chart-min-width` (640px) and lets the viewport scroll instead.

`art-chart-plot` marks a non-SVG plot element, such as a canvas or a positioned plot box, and takes the relative positioning and width clamping an SVG inside `art-chart` gets.

Size the SVG at the pixel width of the lane it sits in, so one user unit is one CSS pixel and the stylesheet's 12px chart text renders at 12px. The shell is `min(100% - 48px, --art-content-width)` wide, which resolves to 1152 at the 1200px reference width, so a full-lane desktop chart takes `viewBox="0 0 1152 H"` and its mobile twin takes `viewBox="0 0 360 H"`. A chart inside a split column or an `art-span-*` cell uses that column's width in place of 1152.

| Class                                                                                    | Element it goes on          | What it sets                                                            |
| ---------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| `art-chart-axis`, `art-chart-gridline`, `art-chart-annotation-line`, `art-series-stroke` | `line`, `path`, `polyline`  | Stroke, with fill forced to none                                        |
| `art-series-fill`                                                                        | `rect`, `path`, `circle`    | Fill from the series color                                              |
| `art-data-point`                                                                         | `circle`                    | Surface fill with a series-colored stroke                               |
| `art-chart-direct-label`, `art-chart-value`, `art-chart-annotation`, `art-mono`          | `text`                      | Fill, size, and weight                                                  |
| `art-series-1` to `art-series-6`, `art-series-primary`, `art-series-reference`           | Any mark, or a wrapping `g` | `--art-series-color`, read by the stroke, fill, point, and swatch rules |

Combine a numbered series with a role class from the first four rows. The numbered classes also give strokes distinct dash patterns. `art-series-primary` and `art-series-reference` mark a decisive and a baseline series without spending a numbered slot, and take effect only inside `art-chart`. Chart tokens 4 to 6 repeat 1 to 3.

## Tokens

Page-owned CSS may read these public token families:

- Surfaces and text: `--art-surface-primary`, `--art-surface-secondary`, `--art-surface-contrast`, `--art-text-primary`, `--art-text-secondary`, `--art-text-on-contrast`, `--art-text-on-contrast-secondary`.
- Borders and state: `--art-border-subtle`, `--art-border-default`, `--art-border-strong`, `--art-border-on-contrast`, `--art-focus`, `--art-color-info`, `--art-color-success`, `--art-color-warning`, `--art-color-error`.
- Data: `--art-chart-1` through `--art-chart-6`.
- Rhythm and shape: `--art-space-1`, `--art-space-2`, `--art-space-3`, `--art-space-4`, `--art-space-5`, `--art-space-6`, `--art-space-8`, `--art-space-10`, `--art-space-12`, `--art-space-16`, `--art-radius-small`, `--art-radius`.
- Type family: `--art-font-heading`, `--art-font-sans`, `--art-font-mono`.
- Type size: `--art-type-display`, `--art-type-page-title`, `--art-type-title`, `--art-type-section`, `--art-type-subsection`, `--art-type-lede`, `--art-type-body`, `--art-type-compact`, `--art-type-label`, `--art-type-metadata`.
- Type weight and leading: `--art-weight-regular`, `--art-weight-heading`, `--art-weight-medium`, `--art-weight-semibold`, `--art-leading-body`, `--art-leading-compact`, `--art-leading-caption`, `--art-leading-display`, `--art-leading-page-title`, `--art-leading-title`, `--art-leading-section`, `--art-leading-subsection`, `--art-leading-lede`.

Use the exact names with `var()`. Never invent, alias, or redeclare an `--art-*` token. Prefer `currentColor`, `inherit`, or `transparent` when a page-owned mark needs no distinct semantic role. Every page-owned `font-weight` uses a published weight token.

Spend the spacing tokens on relationships: within-group gaps take `--art-space-2` through `--art-space-4`, between-group gaps `--art-space-6` through `--art-space-8`, and section turns `--art-space-8` through `--art-space-12`. Reserve `--art-space-16` for a chapter break between two substantial sections.

Every token resolves in both themes, so page CSS reads the tokens and writes no `prefers-color-scheme` or `data-theme` block.
