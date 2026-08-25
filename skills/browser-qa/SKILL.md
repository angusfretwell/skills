---
name: browser-qa
description: QA a change by launching it and driving the affected flows in a real browser. Use when asked to QA, browser-test, or confirm a change works in the running app.
---

Verification is **runtime observation**: what you capture from the running app is the evidence; tests and typechecks are CI's output, not yours.

## Steps

### 1. Establish what's under test

Whatever the user said is the scope (a commit SHA, branch name, tag, `main`, `HEAD~5`). If they didn't specify one, ask for it.

### 2. Identify the spec source

Look for the originating spec, in this order:

1. Issue references in the commit messages (`#123`, `Closes #45`, GitLab `!67`), fetched via the workflow in `docs/agents/issue-tracker.md`.
2. A path the user passed as an argument.
3. A spec file under `docs/`, `specs/`, or `.scratch/` matching the branch name or feature.
4. If nothing is found, ask the user where the spec is.

### 3. Drive

Refuse if `agent-browser` isn't installed: stop and tell the user. Invoke the **run** skill and get the URL the app is serving on; refuse likewise if the app won't run.

Invoke the **agent-browser** skill and load its **dogfood** workflow. Follow it against the URL: it owns the browser mechanics, evidence capture, and the report. Scope to the diff, not dogfood's full-app default. Drive every flow the change affects end-to-end, then pick probes from dogfood's edge-case checklist that fit the change.

### 4. Verdict

Open the report with a verdict on the first line: **pass** or **fail**. Fail on any issue that breaks the specified behaviour or fails a probe. There is no partial pass: anything short is a fail, with the passing parts noted.
