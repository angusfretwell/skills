# The house style

What every page shares. [SKILL.md](../SKILL.md) is the order of work; the structure of any one page is yours to choose.

Check the project root for `DESIGN.md`: a brand there — faces, colors, a logo — replaces the house values below, and anything it leaves unsaid keeps its house value. It supplies values, never discipline: the scale, the measure, the monochrome default, and the reflexes hold whatever the brand brings. A brand reaches the page as a `:root` block after the stylesheet, redefining only the tokens it changes, and its faces replace the house faces in the font link below.

## Voice

Make the page precise, calm, direct, technically literate, evidence-led, editorial, and restrained. Build confidence through clarity, proof, and command of the material.

Treat the page as an editorial surface even when it carries product-like interaction. It is evidence, not product UI, a landing page, or a marketing campaign.

## Type, color, and measure

Familjen Grotesk (`--font-heading`) carries headings and only headings; emphasis stays in the body face. Google Sans Code (`--font-mono`) carries code, commands, and paths. `artifact-design` advises against Inter; here it is the body face (`--font-body`) by decision, and its guidance on face choice does not apply.

[assets/style.css](../assets/style.css) carries the tokens, the type scale, and the flow every element sits in. It styles elements and nothing more — no layout, no components, no grid — so the page still chooses its own composition and writes only the CSS that composition needs.

Copy it into the scratchpad beside the page: `files` reads sources only from the working or scratchpad directory, and the skill's own copy sits outside both. Publish the two together with `files: { "style.css": "<the copy's absolute path>" }` — a relative source resolves against the working directory, not the page's.

Open the page with this, before any other page CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
/>
<link rel="stylesheet" href="style.css" />
```

Page CSS takes every face, color, size, and gap from the stylesheet's tokens rather than fresh values; `--radius` carries the corner on code, media, and keys.

`--typeset-size` and `--typeset-flow` are bases rather than values: type steps from one, space between elements from the other, and the page reaches for a step rather than a fresh number.

Prose blocks hold `--typeset-measure` themselves. The page around them is wider: 64rem at minimum, and wider still where tables, charts, or side-by-side evidence earn the room.

Three classes travel with the tokens. `.lead` sets the paragraph that opens the page and `.caption` the one under a table or figure. `.typeset-scroll` wraps any block that can outgrow the column: it scrolls the block sideways and takes over its flow margin. The wrapper widens a table to its full width, so a dense table scrolls rather than compresses; a table carrying prose wants `width: auto` back, so that it wraps first and scrolls only where it cannot.

Design in monochrome. `--color-foreground` and `--color-muted-foreground` carry hierarchy, `--color-border` and `--color-muted` separate, and every size, weight, and gap the page uses is its own consistent scale built on those two colors. Reach for `--color-accent` and the semantic tokens only where color adds meaning to state, action, or data, and pair every color cue with a non-color one. A recommendation, saving, or longer bar stays neutral however favorable it is.

The tokens resolve both themes themselves, so the page writes no theme blocks and shows no theme switcher.

## Reflexes

A **reflex** is a generated-design default that reads as a template rather than as this page's evidence. Ship none of them:

- All-caps or tracked eyebrows, kickers, overlines, and decorative numbered section labels.
- Decorative gradients, gradient text, glows, blobs, textures, grid backgrounds, glass, and fake depth. A gradient earns its place only as a labelled continuous data scale.
- Generic centered hero copy followed by a card grid.
- Repeated metric boxes where one composed relationship would be clearer.
- A badge, pill, or rounded capsule for ordinary metadata, chart annotations, or editorial labels.
- Cards nested inside cards, or borders used to repair weak hierarchy.
- Decorative charts, redundant visualizations, legends that replace direct labels, and color without meaning.
- Visible theme controls, stock imagery, decorative illustrations, abstract shapes, auto-scrolling marquees, and pulsing status indicators.

Clearing the reflexes produces precise hierarchy, excellent typography, clear evidence, and strong alignment, not a sterile template of black, white, thin rules, and large empty margins. The target is judgment, not decoration.
