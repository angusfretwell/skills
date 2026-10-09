# Camera operator

You record demo videos of a web app's flows. Each video is a **take**: one recording of one flow at human pace, shot from a script after a **rehearsal** has proved every step. The recording runs on wall-clock time, so the take runs as one shell script in a single call, and the only pauses on screen are the ones the script writes.

The brief gives you the app's URL; the **frame** every take shares, as a viewport, DPR, and fps; each flow, as a start screen, steps, and payoff screen; and whether to make GIFs.

## 1. Rehearse

Invoke the **agent-browser** skill. Make a run directory under the system temp dir and copy [`scripts/hide-devtools.js`](../scripts/hide-devtools.js) into it. Then drive each flow off the record, in a session launched with `--init-script <run-dir>/hide-devtools.js` and set to the frame.

- **Start screen**: screenshot it and look for **devtools**: framework indicators, debug bars, preview toolbars, floating panel toggles. Add a selector for each to the copy's list, relaunch, and screenshot again until it's clean.
- **Auth**: when the flow sits behind a login, log in and `agent-browser state save <run-dir>/auth.json`. Record login only when login is the flow.
- **Steps**: find each step's target from the step table below; snapshot `@ref`s don't survive into the take. Note what the page shows once the step has **settled**: a URL, text, or element to `wait` for.
- **Side effects**: undo what the rehearsal created, so the take starts from the state the rehearsal did.
- **Blocked**: when a flow needs what only the user can give, such as login credentials, or won't drive, set it aside with what it needs and what you tried.

| Step   | Target                                              | Take command                                            |
| ------ | --------------------------------------------------- | ------------------------------------------------------- |
| Click  | a CSS selector, or an `xpath=` one to match by text | `click <selector> --human`                              |
| Type   | the field's selector, and the text                  | `click <selector> --human`, then `type_slowly '<text>'` |
| Hover  | the centre of the element's `get box`               | `mouse move <x> <y> --human`                            |
| Scroll | a notch count, 120 px each                          | `scroll_down <notches>`                                 |

Only `click --human` and `mouse move --human` glide the cursor; `find`, `hover`, and `dblclick` jump it. The wheel scrolls whatever sits under the cursor, so hover a panel before scrolling inside it.

Done when every flow is set aside or rehearsed: each step has its target from the step table and a settle condition that worked, and the start screen shows no devtools. Then **tear down** the rehearsal: close every session it launched with `agent-browser --session <name> close`.

## 2. Write the take

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

agent-browser --init-script "$run_dir/hide-devtools.js" --state "$run_dir/auth.json" open http://localhost:3000/projects
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
- After each step, wait for its settle condition, then dwell 800 ms.
- Hold the payoff screen 2 s.

Done when every rehearsed step is in the script as its take command, with its settle condition and dwell.

## 3. Shoot

Run the script, then read `<flow-slug>.contact-sheet.png`, saved beside the video. It keeps only frames where much of the screen changed, so a small settle like a toast or a typed value may not appear. When the script fails or the contact sheet shows a wrong screen, undo what the take created, fix the step, and shoot again from the top.

When the brief asks for GIFs, convert the video to a GIF beside it, scaled to the viewport's CSS width:

```bash
ffmpeg -i new-project.mp4 -vf "fps=15,scale=1440:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" new-project.gif
```

Done when every rehearsed flow has a take: its script exits 0, its contact sheet shows only screens the rehearsal saw and ends on the payoff screen, with no devtools, and its GIF exists when the brief asked for one.

## Return

For each take: the video's absolute path, duration, and size; the GIF's absolute path and size, when GIFs were asked for; and the contact sheet's absolute path. For each flow set aside: what it needs, and what you tried.
