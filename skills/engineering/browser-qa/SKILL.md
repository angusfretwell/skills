---
name: browser-qa
description: QA a change by launching it and driving the affected flows in a real browser. Use when asked to QA, browser-test, or confirm a change works in the running app.
---

Verification is **runtime observation**: what you capture from the running app is the evidence; tests and typechecks are CI's output, not yours.

## Steps

### 1. Establish what's under test

Whatever the user said is the scope (a commit SHA, branch name, tag, `main`, `HEAD~5`). If they didn't specify one, ask for it.

### 2. Launch the app

Boot is the longest wait in a run, so start it before you read anything.

Refuse if `agent-browser` isn't installed: stop and tell the user.

When the brief hands you a running app, use it. Otherwise invoke the **run** skill and get the URL the app is serving on. An app already serving this checkout is used as it stands. One that isn't is launched in the background while you carry on with steps 3 and 4.

Refuse likewise if the app still isn't serving after one relaunch.

### 3. Identify the spec source

Look for the originating spec, in this order:

1. A spec or path the brief or the user handed you.
2. Issue references in the commit messages (`#123`, `Closes #45`, GitLab `!67`), fetched via the workflow in `docs/agents/issue-tracker.md`.
3. A spec file under `docs/`, `specs/`, or `.scratch/` matching the branch name or feature.
4. If nothing is found, ask the user where the spec is.

### 4. Plan the flows

Read the diff and write the **flow list** before you open a page: every flow the change affects, each with the URL it starts at, the account and data it needs, and the observation that proves it works. Read code beyond the diff only to resolve those: a route, a permission, a seed record.

When the brief hands you **fixtures**, test data already set up, plan the flows around them and build only what they lack.

Add the **probes** that fit the change:

- Empty, invalid, and oversized input on a changed form.
- The empty, loading, and error states of a changed view.
- A reload or a step back mid-flow where the change holds state.
- A narrow viewport where the layout changed.
- A signed-out or lower-privileged account where access changed.
- Console errors and failed requests, on every flow.

Done when every user-visible behaviour the diff changes sits in a flow, or is listed as unreachable in a browser.

### 5. Drive

Drive each flow end-to-end with `agent-browser`, in one named session (`export AGENT_BROWSER_SESSION=<name>`). Its usage guide is `agent-browser skills get core`; load it when a command is unfamiliar.

Keep the loop **tight**:

- Make one shell call per step of a flow: the action, a wait for it to land, then the read that proves the result.
- Wait on a condition: `agent-browser wait` with a selector, `--text`, `--url`, or `--fn`. A fixed `sleep` wastes time on a fast page and races a slow one.
- Assert on text: `snapshot -i -c` finds the controls, `get text` or `eval` reads the result.
- Screenshot each flow's end state and every failure, for the report. Open a screenshot yourself only where the look is under test: layout, colour, overflow.

A failure counts once it reproduces on a second try. Capture its repro: the steps, expected against actual, and a screenshot, or a video (`record start`, `record stop`) when a still can't show it.

Done when every flow and probe on the list has an observed result.

### 6. Verdict

The report is your reply, not a file, citing screenshots and videos by absolute path.

Open the report with a verdict on the first line: **pass** or **fail**. Fail on any issue that breaks the specified behaviour or fails a probe. There is no partial pass: anything short is a fail, with the passing parts noted.

Then **tear down** what you started: close each browser session you opened with `agent-browser --session <name> close`, and stop any app process you launched, leaving one you found running. Each session holds a headless Chrome until it's closed. Teardown runs on every exit, refusals included.

Done when the report opens on its verdict and teardown is complete.
