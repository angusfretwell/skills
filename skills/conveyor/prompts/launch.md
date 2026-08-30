# Launch

Start the workers the scheduler has decided on. You start agents and report what happened; the scheduler owns `state.json`.

Your header lists one dispatch per line: issue id, agent name, model, worktree, workspace (an id, or a name to create one under), tab name, activity, the brief's file paths, and the brief's header text.

Load /herdr. For each dispatch:

1. Open the workspace by its id; when the dispatch gives a name instead, create the workspace under that name.
2. Create its tab under the given tab name, its pane starting in the given worktree.
3. Start the agent under the given name on its model, with `--effort high --dangerously-skip-permissions --name "<activity>"` as native args:

   ```bash
   herdr agent start eng-42-code-review --kind claude --pane w7:p1 \
     -- --effort high --dangerously-skip-permissions --name "Reviewing code (round 1)"
   ```

4. Prompt it with its brief: the listed files in order, as paths for it to read, followed by its header text verbatim.
5. Read back the pane agent's Claude session id, reported by the SessionStart hook.

Start every dispatch you can; one that fails is no reason to skip the rest.

## Return

One line per dispatch — `{issue, agent, pane, session, workspace}` — and for any that failed to start, the issue, the step, and the error.
