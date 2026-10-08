---
name: record-demo
description: Record a demo video of a web app flow. Use when asked to record a demo or a video of the app, or when another skill needs one.
argument-hint: "[flow] [--compact] [--gif]"
---

A demo is a **take**: one recording of one flow at human pace, shot from a script after a **rehearsal** has proved every step. The recording runs on wall-clock time, so the take runs as one shell script in a single call, and the only pauses on screen are the ones the script writes.

## 1. Scope the flows

Find the flow in the first source that has one: what the invocation describes; the user-visible flows the current branch changes against its base; else ask. Several flows make several takes, one video each.

Done when each flow is a start screen, the steps a person performs, and the payoff screen it ends on.

## 2. Launch

Refuse if `agent-browser` or `ffmpeg` isn't installed: stop and tell the user. Invoke the **run** skill and note the URL the app serves on; refuse likewise if it won't run. Invoke the **agent-browser** skill.

Every take shares one **frame**: a 1440×900 viewport at 2x DPR, recorded at 60 fps. When the user asks for mobile or another form factor, pick a viewport that fits it, such as 390×844 at 3x for a phone. `--compact` drops the frame to 1x DPR at 30 fps.

Make a run directory under the system temp dir and copy [`scripts/hide-dev-chrome.js`](scripts/hide-dev-chrome.js) into it.

Done when the app serves on a URL and the run directory holds the copy.

## 3. Rehearse

Drive each flow off the record, in a session launched with `--init-script <run-dir>/hide-dev-chrome.js` and set to the frame.

- **Start screen**: screenshot it and look for **dev chrome**: framework indicators, devtools toggles, debug bars, preview toolbars. Add a selector for each to the copy's list, relaunch, and screenshot again until it's clean.
- **Auth**: when the flow sits behind a login, log in and `agent-browser state save <run-dir>/auth.json`. Record login only when login is the flow.
- **Steps**: the take clicks with `click <selector> --human`, so give each step a CSS selector, or an `xpath=` selector to match by text. A scroll step takes a notch count instead, and a hover step the centre of its element's `get box`, which the take glides to with `mouse move <x> <y> --human`. Snapshot `@ref`s don't survive into the take. Only `click --human` and `mouse move --human` glide the cursor; `find`, `hover`, and `dblclick` jump it. Note what the page shows once the step has **settled**: a URL, text, or element to `wait` for.
- **Side effects**: undo what the rehearsal created, so the take starts from the state the rehearsal did.

Done when every step has its target (a selector, notch count, or hover point) and a settle condition that worked, and the start screen shows no dev chrome.

## 4. Write the take

Write `<run-dir>/<flow-slug>.sh` in this shape, filling in the frame and the start URL, with the video at `<run-dir>/<flow-slug>.mp4`. Drop `--state` when the flow needs no login.

```bash
#!/usr/bin/env bash
set -euo pipefail

export AGENT_BROWSER_SESSION=record-demo-$$
trap 'agent-browser close >/dev/null' EXIT
run_dir=/tmp/record-demo.x1y2z3
out=$run_dir/new-project.mp4

type_slowly() {
  local text=$1
  for ((i = 0; i < ${#text}; i++)); do
    agent-browser keyboard type "${text:i:1}"
    sleep "$(printf '0.%03d' $((RANDOM % 81 + 60)))"
  done
}

scroll_down() {
  for ((i = 0; i < $1; i++)); do
    agent-browser mouse wheel 120
    sleep 0.04
  done
}

agent-browser --init-script "$run_dir/hide-dev-chrome.js" --state "$run_dir/auth.json" open http://localhost:3000/projects
agent-browser set viewport 1440 900 2
agent-browser wait --load networkidle

agent-browser record start "$out" --fps 60 --cursor --contact-sheet
agent-browser mouse move 720 450
agent-browser wait 1500

agent-browser click "xpath=//button[normalize-space()='New project']" --human
agent-browser wait --text 'Project name'
agent-browser wait 800

agent-browser click '#project-name' --human
type_slowly 'Launch plan'
agent-browser wait 800

agent-browser wait 2000
agent-browser record stop
```

Each take runs in a session of its own, because `--init-script` and `--state` apply only at launch. The cursor overlay draws nothing until the recording's first pointer event, so `mouse move` to the viewport's centre parks it there for the opening hold.

Pacing:

- Hold the start screen 1.5 s.
- After each action, wait for its settle condition, then dwell 800 ms.
- Click a field, then type into it with `type_slowly`.
- Scroll with `scroll_down <notches>`, 120 px a notch. The wheel scrolls whatever sits under the cursor.
- Hold the payoff screen 2 s.

Done when every rehearsed step is in the script with its settle condition and dwell.

## 5. Shoot

Run the script, then read `<flow-slug>.contact-sheet.png`, saved beside the video. It keeps only frames where much of the screen changed, so a small settle like a toast or a typed value may not appear. When the script fails or the contact sheet shows a wrong screen, undo what the take created, fix the step, and shoot again from the top.

With `--gif`, convert the video to a GIF beside it, scaled to the viewport's CSS width:

```bash
ffmpeg -i new-project.mp4 -vf "fps=15,scale=1440:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" new-project.gif
```

Done when the script exits 0, the contact sheet shows only screens the rehearsal saw and ends on the payoff screen, with no dev chrome, and the GIF exists when `--gif` asked for one.

## 6. Report

Reply with each video's and GIF's absolute path, duration, and size, and each contact sheet's absolute path.
