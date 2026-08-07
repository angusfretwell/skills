---
name: show-me
description: Compose a visual explanation of how something works — screenshots, diagrams, and prose on a single page.
argument-hint: "[subject]"
disable-model-invocation: true
---

The deliverable is a **narrative**: one page where each section makes one point and picks the medium that proves it — a capture for *what you see*, a diagram for *how it flows*, prose for *how it's built*. Pitch it at product and architecture; descend into code only when code is the subject. A format the user asked for by name wins over every default below.

## 1. Find the subject

Take it from the first source that has one: what the invocation names; the subject under discussion this session; a PR or issue the user linked; the current branch's diff against the default branch. If every source is empty, ask.

Done when one subject is named.

## 2. Scope the page

Derive the list of points the page will cover. When more than one list is plausible for the subject — say a module deep-dive, a data-flow overview, and a UI journey would each serve — ask once (AskUserQuestion, multiSelect): concrete candidates, your recommendation first. When one list is obvious, skip the ask. Either way this is the last scoping question; the rest of the run is autonomous.

Done when you hold the list of points.

## 3. Gather the media

**Captures** — screenshots, taken by launching the app and driving it through the flow being shown. How to launch and drive is project knowledge: a project skill that covers it first, else the project's own docs and scripts. Captures land as files on disk and embed by path — the pixels stay out of your context. Prefer a sub-agent per flow to drive and capture: flows run in parallel and the logs stay out of your context too. If a planned capture can't be produced — the app won't launch, or the flow won't drive — stop and ask, offering the page without captures as one option. Resize and compress captures so the finished page stays small enough to share.

**Diagrams** — Mermaid by default; hand-drawn inline SVG when Mermaid's auto-layout fights the content. A diagram shows the **mechanism**: real states, real names, real branch conditions, arrows labeled with what moves.

**Prose** — write to ASD-STE100 Simplified Technical English: short sentences, active voice, one instruction per sentence, one name per thing. The project's own **ubiquitous language** is welcome; plain words carry everything else.

Done when every point on the list has its medium in hand.

## 4. Compose

Start from the nearest reference template and deviate freely:

- [`references/feature-walkthrough.md`](references/feature-walkthrough.md) — product-level: what a person using the app experiences.
- [`references/architecture-overview.md`](references/architecture-overview.md) — system-level: how the pieces talk.
- [`references/bug-anatomy.md`](references/bug-anatomy.md) — what went wrong, why, and what fixed it.

Layout: prose sits at a reading measure; captures and diagrams break wider than it.

Done when every point on the list appears on the page.

## 5. Deliver

One self-contained HTML file: inline CSS, images embedded as data URIs. Publish it through the harness's artifact mechanism when it has one; otherwise write the file and report its path.

Done when the user holds the link or the path.
