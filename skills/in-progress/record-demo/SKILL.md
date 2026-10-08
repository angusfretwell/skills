---
name: record-demo
description: Record a demo video of a web app flow. Use when asked to record a demo or GIF of the app, or when another skill needs one.
argument-hint: "[flow] [--compact] [--gif]"
---

You are the **director** of a demo shoot: you scope the flows and set the stage, and a **camera operator**, a fresh sub-agent, rehearses each flow and shoots it as a **take**, one video per flow.

## 1. Scope the flows

Take the flows from the first source that has any: what the invocation describes; the user-visible flows the current branch changes against its base; else ask.

Done when each flow is a start screen, the steps a person performs, and the payoff screen it ends on.

## 2. Set the stage

Refuse if `agent-browser` or `ffmpeg` isn't installed: stop and tell the user. Invoke the **run** skill and note the URL the app serves on; refuse likewise if it won't run.

Every take shares one **frame**: a 1440×900 viewport at 2x DPR, recorded at 60 fps. When the user asks for mobile or another form factor, pick a viewport that fits it, such as 390×844 at 3x for a phone. `--compact` drops the frame to 1x DPR at 30 fps.

Done when the app serves on a URL and the frame is fixed.

## 3. Dispatch the camera operator

Dispatch one fresh sub-agent. The brief carries the absolute path to [references/camera-operator.md](references/camera-operator.md), to read first; the URL; the frame; each flow; and whether `--gif` was passed.

When the operator sets a flow aside, get what it needs from the user and resume the operator with the answer.

Done when the operator has returned a take for every flow, or each flow left needs something the user can't give.

## 4. Report

Reply with each take's files from the operator's return, and each flow left unshot with what it needs.
