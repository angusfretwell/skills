---
name: show-me
description: Compose a visual explanation of how something works — inline in the conversation, or as a page of screenshots and diagrams.
argument-hint: "[--artifact|--inline] [subject]"
disable-model-invocation: true
---

The deliverable is a **narrative**: a sequence of points, each in the medium that proves it — a text shape for _how it's built_, a diagram for _how it flows_, a capture for _what you see_. Every visual is a **proof**: the smallest view that makes its point, and nothing else. Pitch it at product and architecture; descend into code only when code is the subject. A format the user asked for by name wins over every default below.

## 1. Frame the request

**Subject** — take it from the first source that has one: what the invocation names; the subject under discussion this session; a PR or issue the user linked; the current branch's diff against the default branch. If every source is empty, ask.

**Target** — two of them: **inline** in the conversation, or an **artifact**, a page published through the harness. `--artifact` and `--inline` settle it outright. Otherwise go inline, and upgrade to an artifact when the explanation:

- needs captures,
- needs a diagram that must be seen rather than read,
- covers more than a handful of points,
- is a document someone else will read.

Done when the subject and the target are both named.

## 2. Scope the points

Derive the list of points the explanation will cover. [`references/narratives.md`](references/narratives.md) holds the recurring shapes — a walkthrough, an architecture overview, a bug anatomy — as ordered beats; start from the nearest and deviate freely.

Going to an artifact, when more than one list is plausible for the subject — say a module deep-dive, a data-flow overview, and a UI journey would each serve — ask once (AskUserQuestion, multiSelect) with concrete candidates. When one list is obvious, skip the ask. Either way this is the last question about what to cover; the rest of the run is autonomous.

Going inline, take the smallest set of points that answers the question asked and move on.

Done when you hold the list of points.

## 3. Gather the media

Pick the medium that proves each point: pseudocode, call tree, component tree, file tree, diff, Mermaid, capture, hand-drawn SVG. [`references/recipes.md`](references/recipes.md) works each one.

**Captures** — artifact only. Launch the app and drive it through the flow per `/run`. Captures land as files on disk and embed by path — the pixels stay out of your context. Prefer a sub-agent per flow to drive and capture: flows run in parallel and the logs stay out of your context too. When a planned capture can't be produced — the app won't launch, or the flow won't drive — stop and ask, offering the page without captures as one option.

**Diagrams** — Mermaid by default. A diagram shows the **mechanism**: real states, real names, real branch conditions, arrows labeled with what moves.

**Prose** — write to ASD-STE100 Simplified Technical English: short sentences, active voice, one instruction per sentence, one name per thing. The project's own **ubiquitous language** is welcome; plain words carry everything else.

Done when every point on the list has its medium in hand.

## 4. Deliver

**Inline** — the points in order in the conversation, each visual sitting next to the short text it supports.

**Artifact** — one self-contained page, composed per `/artifact-design`, published through the Artifact tool. Prose sits at a reading measure; captures and diagrams break wider than it. Re-running on a subject you already published updates that page: publish from the same file path, or pass its URL.

Done when the user holds the explanation or its link.
