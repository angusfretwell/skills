# The house style

What every page shares. [SKILL.md](../SKILL.md) is the order of work; the structure of any one page is yours to choose.

Check the project root for `DESIGN.md`: a brand there — faces, colors, a logo — replaces the house values below, and anything it leaves unsaid keeps its house value. It supplies values, never discipline: the scale, the measure, the monochrome default, and the reflexes hold whatever the brand brings.

## Voice

Make the page precise, calm, direct, technically literate, evidence-led, editorial, and restrained. Build confidence through clarity, proof, and command of the material.

Treat the page as an editorial surface even when it carries product-like interaction. It is evidence, not product UI, a landing page, or a marketing campaign.

## Type, color, and measure

Familjen Grotesk carries headings and only headings; emphasis stays in the body face. Google Sans Code carries code, commands, and paths. `artifact-design` advises against Inter; here it is the body face by decision, and its guidance on face choice does not apply.

Open the page with this, before any other page CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
/>
<style>
  :root {
    color-scheme: light dark;

    --font-heading: "Familjen Grotesk", ui-sans-serif, sans-serif;
    --font-body: "Inter", ui-sans-serif, sans-serif;
    --font-mono: "Google Sans Code", ui-monospace, monospace;

    --typeset-size: 16px;
    --typeset-leading: 1.6;
    --typeset-flow: 1.25em;
    --typeset-measure: 60ch;

    --color-bg: light-dark(oklch(1 0 0), oklch(0 0 0));
    --color-bg-subtle: light-dark(oklch(0.984 0 0), oklch(0.027 0 0));
    --color-text: light-dark(oklch(0.205 0 0), oklch(0.946 0 0));
    --color-text-muted: light-dark(oklch(0.42 0 0), oklch(0.706 0 0));
    --color-border: light-dark(oklch(0.925 0 0), oklch(0.281 0 0));
    --color-accent: light-dark(
      oklch(0.5761 0.2508 258.23),
      oklch(0.5761 0.2321 258.23)
    );
    --color-success: light-dark(
      oklch(0.5175 0.1453 147.65),
      oklch(0.731 0.2158 148.29)
    );
    --color-warning: light-dark(
      oklch(0.5279 0.1496 54.65),
      oklch(0.7721 0.1991 64.28)
    );
    --color-danger: light-dark(
      oklch(0.5499 0.232 25.29),
      oklch(0.6996 0.2136 22.03)
    );
  }

  body {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: var(--typeset-size);
    line-height: var(--typeset-leading);
  }
</style>
```

`--typeset-size` and `--typeset-flow` are bases rather than values: type steps from one, space between elements from the other, and the page reaches for a step rather than a fresh number.

Prose blocks hold `--typeset-measure`. The page around them is wider: 64rem at minimum, and wider still where tables, charts, or side-by-side evidence earn the room.

Design in monochrome. `--color-text` and `--color-text-muted` carry hierarchy, `--color-border` and `--color-bg-subtle` separate, and every size, weight, and gap the page uses is its own consistent scale built on those two colors. Reach for `--color-accent` and the semantic tokens only where color adds meaning to state, action, or data, and pair every color cue with a non-color one. A recommendation, saving, or longer bar stays neutral however favorable it is.

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
