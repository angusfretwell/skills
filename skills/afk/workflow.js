export const meta = {
  name: "afk",
  description: "One run of the AFK issue-clearing loop",
  phases: [
    {
      title: "Plan",
      detail: "ready issues ⋈ state dir, dependency graph",
      model: "opus",
    },
    {
      title: "Implement",
      detail: "slice the issue, one implementer per slice, draft PR",
      model: "opus",
    },
    {
      title: "CI",
      detail: "watch checks, fix red",
      model: "haiku",
    },
    {
      title: "Review",
      detail: "standards + spec axes per round, then aggregate",
      model: "opus",
    },
    {
      title: "QA",
      detail: "/verify rounds, run inline",
      model: "sonnet",
    },
    {
      title: "Merge",
      detail: "merge or park, summary, labels",
      model: "haiku",
    },
  ],
};

const { tracker, repo, mergeMode, cap = 5, maxNew = null } = args;
const STATE_ROOT = `~/.afk/${repo}`;
const stateDir = (id) => `${STATE_ROOT}/${id}`;

// #region Schemas

const STAGES = [
  "implement",
  "review",
  "review-fix",
  "qa",
  "qa-fix",
  "merge",
  "merged",
  "parked",
  "stopped",
];

const oneOf = (key, values, extra = {}) => ({
  type: "object",
  required: [key],
  properties: { [key]: { enum: values }, ...extra },
});

const optionalString = { type: "string" };

const SLICE = {
  type: "object",
  required: ["id", "title", "dependsOn"],
  properties: {
    id: { type: "string", pattern: "^[a-z0-9-]+$" },
    title: { type: "string" },
    dependsOn: { type: "array", items: { type: "string" } },
    status: { enum: ["pending", "done"] },
  },
};

const ISSUE_STATE = {
  type: ["object", "null"],
  required: ["stage", "pr", "reviewRound", "qaRound", "ciAttempts"],
  properties: {
    stage: { enum: STAGES },
    pr: { type: ["string", "null"] },
    reviewRound: { type: "integer" },
    qaRound: { type: "integer" },
    ciAttempts: { type: "integer" },
    slices: { type: "array", items: SLICE },
  },
};

const PLAN = {
  type: "object",
  required: ["issues"],
  properties: {
    issues: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "kind", "blockedBy", "state"],
        properties: {
          id: { type: "string" },
          kind: { enum: ["workable", "prd"] },
          blockedBy: { type: "array", items: { type: "string" } },
          state: ISSUE_STATE,
        },
      },
    },
  },
};

const PR_STATUS = oneOf("status", ["OPEN", "MERGED", "CLOSED", "MISSING"]);
const SLICED = oneOf("result", ["SLICES", "STOPPED"], {
  pr: optionalString,
  slices: { type: "array", minItems: 1, items: SLICE },
  question: optionalString,
});
const SLICE_DONE = oneOf("result", ["DONE", "STOPPED"], {
  question: optionalString,
});
const CI_RESULT = oneOf("result", ["GREEN", "RED", "CONFLICT"]);
const VERDICT = oneOf("verdict", ["FINDINGS", "CLEAN", "INCOMPLETE"]);
const AXIS_REPORT = {
  type: "object",
  required: ["findings", "report"],
  properties: {
    findings: { type: "integer" },
    report: { type: "string" },
  },
};
const FIXED = oneOf("result", ["ADDRESSED", "STOPPED"], {
  question: optionalString,
});

// #endregion

// #region Shared prompt blocks

const CLEANUP = `
Before you return, stop every server, watcher, or other long-running process you started, and confirm nothing you launched is still listening.`;

const ONE_WAY_DOORS = `
A one-way door is an open question you can't safely decide: the spec is ambiguous, contradicts the codebase, or the choice would be expensive to reverse (data migration, public API shape, irreversible deletion, money flow). Surface it instead of deciding: write the question and the options you considered to door.md in the state dir, post the same text as a "## AFK one-way door" comment on the PR if one is open (else on the issue), patch state.json {"stage":"stopped","outcome":"stopped","stoppedBecause":"one-way door"}, then return STOPPED with the question. The door comes last — finish and record whatever else you were doing first.`;

const issueContext = (id) => `
Tracker: ${tracker}. Issue: ${id}. State dir: ${stateDir(id)}.
Read state.json; cd into its worktree and confirm \`git status\` shows branch afk/${id}. Every later step runs from there. Fetch the issue from the tracker — title, body, and comments are the spec.`;

const patchState = (obj) =>
  `Patch ${JSON.stringify(obj)} into state.json (merge keys, keep the rest).`;

const triageFindings = (
  findingsFile,
  ledgerFile,
) => `Read ${findingsFile} and triage EVERY item onto a disposition before changing any code:
- fix — the default; where there's a testable seam, fix with /mattpocock-skills:tdd (the finding is the red test).
- investigate — read the code it names, then settle it into fix or won't fix.
- won't fix — the item is wrong, or minor and discretionary and you judge against it.
- one-way door — the call is bigger than a won't fix, or the item arrived marked **disputed**.
Then write ${ledgerFile}: one line per item, disposition and what you did. Write it after the push so it records what landed.`;

const FIX_JOBS = {
  "failing checks": {
    phase: "CI",
    instructions: () =>
      `Fetch the failing check's output (gh pr checks, then the failing run's log), reproduce locally where possible, fix, confirm that command passes.`,
  },
  "merge conflict": {
    phase: "CI",
    instructions: () =>
      `Fetch and rebase onto the default branch, resolving conflicts with /mattpocock-skills:resolving-merge-conflicts; push with --force-with-lease.`,
  },
  "review findings": {
    phase: "Review",
    instructions: (round) =>
      triageFindings(`review-${round}.md`, `review-${round}-response.md`),
  },
  "QA findings": {
    phase: "QA",
    instructions: (round) =>
      triageFindings(`qa-${round}.md`, `qa-${round}-response.md`),
  },
};

// #endregion

// #region Steps

const step =
  ({ phase, model, returns, prompt }) =>
  (label, ...promptArgs) =>
    agent(prompt(...promptArgs), {
      label,
      phase: typeof phase === "function" ? phase(...promptArgs) : phase,
      model,
      schema: returns,
    });

const plan = step({
  phase: "Plan",
  model: "opus",
  returns: PLAN,
  prompt: () => `
Tracker: ${tracker}. State root: ${STATE_ROOT} (create it if missing).
1. List the tracker's open issues labeled ready-for-agent. A PRD issue with linked implementation issues is kind "prd"; everything else is "workable".
2. For each workable issue, read ${STATE_ROOT}/<id>/state.json if it exists and return it as "state" (null if none).
3. Build a dependency graph over the workable issues per /dependency-graph — declared blockers, produced artefacts, overlapping files, decisions one establishes for another — and return each issue's blockedBy.`,
});

const verifyPr = step({
  phase: "Plan",
  model: "haiku",
  returns: PR_STATUS,
  prompt: (id, pr) => `
Check PR ${pr} for issue ${id} with gh: return MERGED if merged, CLOSED if closed unmerged, MISSING if it no longer exists, else OPEN. Do nothing else.`,
});

const sliceIssue = step({
  phase: "Implement",
  model: "opus",
  returns: SLICED,
  prompt: (id) => `
Tracker: ${tracker}. Issue: ${id}. State dir: ${stateDir(id)} (create it).
1. Fetch the issue; it is the spec — title, body, comments, and any linked tickets or documents. Move it to the tracker's in-progress status so humans see the loop has picked it up.
2. Explore through sub-agents, not yourself: for each area the spec touches — codebase files, data flow, external docs — dispatch an exploration sub-agent briefed to write its notes to ${stateDir(id)}/notes/<topic>.md (file paths, how the code works today, gotchas, relevant docs) and RETURN only the path and two summary lines. Run independent explorations in parallel. Skip this for an issue whose code you already know well enough to plan.
3. Create a worktree on branch afk/${id} — a new branch, or the existing one if a prior attempt left it — outside the main checkout. Push the branch and /open-pr as a DRAFT whose body contains "Closes ${id}". ${patchState({ stage: "implement", branch: `afk/${id}`, worktree: "<absolute path>", pr: "<PR reference>", reviewRound: 0, qaRound: 0, ciAttempts: 0, outcome: null, stoppedBecause: null })}
4. From the spec and the notes, split the work into slices. A slice is a unit one implementer can build, test, and commit without reading the others' code — roughly one module, endpoint, migration, or component, with its tests. Sequence the slices per /dependency-graph: a slice that needs another's code, interface, or decision depends on it; two slices that touch the same files depend on each other in a fixed order. Prefer few, independent slices; a small issue is one slice. Never split for its own sake.
5. Write plan.md in the state dir — the shared understanding every implementer reads instead of re-planning: the goal, the approach, the interfaces slices share (names, signatures, file paths, decided up front so parallel slices agree), which notes/*.md files matter, then one section per slice: id (short kebab-case), title, the files it owns, what done looks like, what it depends on, which notes it should read.
6. ${patchState({ slices: [{ id: "<slice id>", title: "<title>", dependsOn: ["<slice id>"], status: "pending" }] })}
7. Return the PR reference and the slices.${ONE_WAY_DOORS}${CLEANUP}`,
});

const implementSlice = step({
  phase: "Implement",
  model: "opus",
  returns: SLICE_DONE,
  prompt: (id, slice, siblings) => `${issueContext(id)}
Slice ${slice.id} — ${slice.title}. Read plan.md in the state dir: the overview, the shared interfaces, your slice's section, and the notes/*.md it points you at. ${slice.dependsOn.length ? `Read slice-<id>.md for each slice yours depends on (${slice.dependsOn.join(", ")}) — they record what landed.` : "Yours depends on nothing."} ${siblings.length ? `Slices ${siblings.join(", ")} run alongside yours in their own worktrees — stay inside your slice's files.` : ""}
1. Create a worktree on branch afk/${id}--${slice.id} from afk/${id} — a new branch, or the existing one if a prior attempt left it — outside the main checkout. Work there.
2. Implement the slice; use /mattpocock-skills:tdd where there is a testable seam. After each green, self-contained step run /commit.
3. Typecheck and run the tests you wrote or touched. Do NOT run the full test suite, lint, or any whole-project check — CI does that. Do NOT launch the app or drive a browser to check your work by hand — the QA stage does that.
4. Land it: \`git rebase afk/${id}\`, then from the issue worktree \`git merge --ff-only afk/${id}--${slice.id}\` and push afk/${id}. If any step fails because afk/${id} moved or an index.lock exists, rebase and retry until it lands. Then remove your slice worktree and delete its branch.
5. Write slice-${slice.id}.md in the state dir: what you built, the files, the interfaces dependents should use, and anything that differs from plan.md. In state.json set slices[id=${slice.id}].status to "done" (keep the rest).
6. Return DONE.${ONE_WAY_DOORS}${CLEANUP}`,
});

const finishBranch = step({
  phase: "Implement",
  model: "sonnet",
  prompt: (id) => `${issueContext(id)}
Every slice has landed on afk/${id}. Typecheck once and fix only what the integration of slices broke — /commit and push if you changed anything. Refresh the draft PR's title and body with /open-pr so they describe the whole branch; keep "Closes ${id}" and keep it a draft. ${patchState({ stage: "review" })}
Return done.${CLEANUP}`,
});

const watchCi = step({
  phase: "CI",
  model: "haiku",
  returns: CI_RESULT,
  prompt: (id) => `${issueContext(id)}
Watch the PR's checks with \`gh pr checks --watch\` until they finish. Return GREEN if all pass (or there are no checks), RED if any fail, CONFLICT if the branch conflicts with the default branch (gh pr view --json mergeable). Do nothing else.`,
});

const reviewAxis = step({
  phase: "Review",
  model: "opus",
  returns: AXIS_REPORT,
  prompt: (id, axis) => `${issueContext(id)}
Load the mattpocock-skills:code-review skill with the Skill tool and follow its method for the ${axis} axis ONLY — run that axis yourself, inline; do NOT dispatch sub-agents, and skip the other axis entirely. The fixed point is the branch's merge-base with the default branch. Review the code only: do NOT run tests, lint, typecheck, or builds — CI owns those.
Return the axis report (under 400 words, each finding with file, line, what's wrong, what correct looks like) and the finding count.${CLEANUP}`,
});

const review = step({
  phase: "Review",
  model: "opus",
  returns: VERDICT,
  prompt: (id, round, reports) => `${issueContext(id)}
Review round ${round}. The axis reports below were produced for this round; do not re-review the diff yourself.
1. Read every review-*.md in the state dir and the review-${round - 1}-response.md ledger if it exists. Check each of the previous round's items against the current code: one fixed but not genuinely addressed stays a finding; a won't-fix stands or falls on its reasoning — accept it and it is settled, or reject it and re-raise it marked **disputed**.
2. Write review-${round}.md: the carried-over items, then the axis reports under "## Standards" and "## Spec" headings — kept separate, never merged or reranked; or a single line saying the round found nothing. ${patchState({ reviewRound: round })} then stage: "review-fix" if there are findings, "qa" if clean.
3. Return the bare verdict FINDINGS or CLEAN.${CLEANUP}

## Standards
${reports.standards}

## Spec
${reports.spec}`,
});

const qa = step({
  phase: "QA",
  model: "sonnet",
  returns: VERDICT,
  prompt: (id, round) => `${issueContext(id)}
QA round ${round}.
1. Read every qa-*.md in the state dir and the qa-${round - 1}-response.md ledger if it exists. Re-exercise each of the previous round's items against the current code: fixed-but-not-addressed stays a finding; a won't-fix stands or falls on its reasoning — accept, or re-raise marked **disputed**.
2. Load the verify skill with the Skill tool and follow its method against the PR with the issue's acceptance criteria as its criteria — do the work yourself, inline; do NOT dispatch sub-agents. Exercise behaviour only: do NOT run tests, lint, typecheck, or builds — CI owns those.
3. Write qa-${round}.md: one entry per failed criterion with steps, what happened, what correct looks like; or a single line saying every criterion passed or there was nothing to exercise. ${patchState({ qaRound: round })} then stage: "qa-fix" if there are findings, "merge" if clean.
4. Return the bare verdict FINDINGS, CLEAN, or — for a criterion left untested or an app that would not run — INCOMPLETE.${CLEANUP}`,
});

const fix = step({
  phase: (id, address) => FIX_JOBS[address].phase,
  model: "opus",
  returns: FIXED,
  prompt: (id, address, round, nextStage) => `${issueContext(id)}
ADDRESS: ${address}${round ? ` (round ${round})` : ""}.
${FIX_JOBS[address].instructions(round)}
Where you changed code: typecheck, run the affected tests (not the suite), /commit, push. Do NOT launch the app or drive a browser to check your work by hand — the QA stage does that. If the PR's title or body went stale, /open-pr to refresh them — it stays a draft. ${patchState({ stage: nextStage })}
Return ADDRESSED.${ONE_WAY_DOORS}${CLEANUP}`,
});

const mergeOrPark = step({
  phase: "Merge",
  model: "haiku",
  prompt: (id) => `${issueContext(id)}
Mark the PR ready for review. ${
    mergeMode === "merge"
      ? `Merge it, delete the remote and local branch, remove the worktree (git worktree remove), and confirm issue ${id} is closed on the tracker — close it yourself if the Closes reference didn't. ${patchState({ stage: "merged", outcome: "merged" })}`
      : `Request a human's review and leave it. ${patchState({ stage: "parked", outcome: "parked" })}`
  }`,
});

const summarise = step({
  phase: "Merge",
  model: "haiku",
  prompt: (id) => `
Tracker: ${tracker}. Issue: ${id}. Read ${stateDir(id)}/state.json.
1. If state.json names a PR, upsert ONE comment on it headed "## AFK summary" — find it by that heading, never by author or position; create it if absent, else edit it in place:
   **State:** <stage> (round/attempt N where it applies)
   **Outcome:** <outcome, or —>
   then one line per review round, QA round, and CI attempt, each saying only that it happened and how it ended (findings → addressed, clean, red → fixed). Counts, never explanations — the findings are on disk, not here.
2. If outcome is "stopped", relabel the issue from ready-for-agent to ready-for-human.
3. If outcome is "merged" and the issue is still open, close it.
Return the word done.`,
});

// #endregion

// #region Per-issue pipeline

const stop = (job, why) => {
  job.outcome = "stopped";
  job.stoppedBecause = why;
  return null;
};

const oneWayDoor = (job, question) => stop(job, `one-way door: ${question}`);

async function ciIsGreen(job, stageToResume) {
  while (true) {
    const { result } = await watchCi(`ci:${job.id}`, job.id);

    if (result === "GREEN") {
      return true;
    }

    if (result === "RED") {
      if (job.ciAttempts >= cap) {
        stop(job, "CI cap hit");
        return false;
      }
      job.ciAttempts++;
    }

    const address = result === "RED" ? "failing checks" : "merge conflict";
    const fixed = await fix(`fix:${job.id}`, job.id, address, 0, stageToResume);

    if (fixed.result === "STOPPED") {
      oneWayDoor(job, fixed.question);
      return false;
    }
  }
}

async function implementSlices(job) {
  const slices = job.slices;
  const doneSlices = new Set(
    slices.filter((slice) => slice.status === "done").map((slice) => slice.id),
  );
  const runningSlices = new Map();

  const readySlices = () =>
    slices.filter(
      (slice) =>
        !doneSlices.has(slice.id) &&
        !runningSlices.has(slice.id) &&
        slice.dependsOn.every((dependency) => doneSlices.has(dependency)),
    );

  while (doneSlices.size < slices.length) {
    for (const slice of readySlices()) {
      const siblings = [...runningSlices.keys()];
      const label = `implement:${job.id}/${slice.id}`;

      runningSlices.set(
        slice.id,
        implementSlice(label, job.id, slice, siblings).then((outcome) => ({
          ...outcome,
          sliceId: slice.id,
        })),
      );
    }

    if (runningSlices.size === 0) {
      return stop(job, "slices deadlocked");
    }

    const finished = await Promise.race(runningSlices.values());
    runningSlices.delete(finished.sliceId);

    if (finished.result === "STOPPED") {
      await Promise.all(runningSlices.values());
      return oneWayDoor(job, finished.question);
    }

    doneSlices.add(finished.sliceId);
  }

  return true;
}

const stages = {
  async implement(job) {
    if (!job.slices) {
      const sliced = await sliceIssue(`slice:${job.id}`, job.id);

      if (sliced.result === "STOPPED") {
        return oneWayDoor(job, sliced.question);
      }

      job.pr = sliced.pr;
      job.slices = sliced.slices;
      log(`${job.id}: ${job.slices.length} slice(s)`);
    }

    if (!(await implementSlices(job))) {
      return null;
    }

    await finishBranch(`finish:${job.id}`, job.id);
    return "review";
  },

  async review(job) {
    if (!(await ciIsGreen(job, "review"))) {
      return null;
    }

    const round = job.reviewRound + 1;
    if (round > cap) {
      return stop(job, "review cap hit");
    }

    const [standards, spec] = await parallel(
      ["Standards", "Spec"].map(
        (axis) => () =>
          reviewAxis(
            `review-${axis.toLowerCase()}:${job.id}#${round}`,
            job.id,
            axis,
          ),
      ),
    );

    if (!standards || !spec) {
      job.incompleteVerdicts++;
      if (job.incompleteVerdicts === 2) {
        return stop(job, "review unreachable");
      }
      return "review";
    }

    const { verdict } = await review(
      `review:${job.id}#${round}`,
      job.id,
      round,
      { standards: standards.report, spec: spec.report },
    );

    job.incompleteVerdicts = 0;
    job.reviewRound = round;
    return verdict === "CLEAN" ? "qa" : "review-fix";
  },

  async "review-fix"(job) {
    const fixed = await fix(
      `fix:${job.id}`,
      job.id,
      "review findings",
      job.reviewRound,
      "review",
    );

    if (fixed.result === "STOPPED") {
      return oneWayDoor(job, fixed.question);
    }

    return "review";
  },

  async qa(job) {
    const round = job.qaRound + 1;
    if (round > cap) {
      return stop(job, "QA cap hit");
    }

    const { verdict } = await qa(`qa:${job.id}#${round}`, job.id, round);

    if (verdict === "INCOMPLETE") {
      job.incompleteVerdicts++;
      if (job.incompleteVerdicts === 2) {
        return stop(job, "QA unreachable");
      }
      return "qa";
    }

    job.incompleteVerdicts = 0;
    job.qaRound = round;
    return verdict === "CLEAN" ? "merge" : "qa-fix";
  },

  async "qa-fix"(job) {
    const fixed = await fix(
      `fix:${job.id}`,
      job.id,
      "QA findings",
      job.qaRound,
      "review",
    );

    if (fixed.result === "STOPPED") {
      return oneWayDoor(job, fixed.question);
    }

    return "review";
  },

  async merge(job) {
    if (!(await ciIsGreen(job, "merge"))) {
      return null;
    }

    await mergeOrPark(`merge:${job.id}`, job.id);
    job.outcome = mergeMode === "merge" ? "merged" : "parked";
    return null;
  },
};

async function resumePoint(job, saved) {
  let stage = saved?.stage ?? "implement";

  if (saved && job.pr) {
    const { status } = await verifyPr(`pr-verify:${job.id}`, job.id, job.pr);

    if (status === "MERGED") {
      job.outcome = "merged";
      return null;
    }
    if (status === "CLOSED") {
      return stop(job, "PR closed by a human");
    }
    if (status === "MISSING") {
      stage = "implement";
    }
  }

  if (stage === "merged" || stage === "parked") {
    job.outcome = stage;
    return null;
  }
  if (stage === "stopped") {
    return stop(job, "already stopped");
  }

  return stage;
}

async function runIssue(issue) {
  const saved = issue.state;
  const job = {
    id: issue.id,
    pr: saved?.pr ?? null,
    outcome: null,
    stoppedBecause: null,
    reviewRound: saved?.reviewRound ?? 0,
    qaRound: saved?.qaRound ?? 0,
    ciAttempts: saved?.ciAttempts ?? 0,
    slices: saved?.slices ?? null,
    incompleteVerdicts: 0,
  };

  let stage = await resumePoint(job, saved);
  while (stage) {
    stage = await stages[stage](job);
  }

  return job;
}

async function settle(issue) {
  const job = await runIssue(issue).catch((error) => ({
    id: issue.id,
    pr: null,
    outcome: "stopped",
    stoppedBecause: `agent error: ${String(error)}`,
  }));

  await summarise(`summary:${job.id}`, job.id).catch(() => null);
  return job;
}

// #endregion

// #region Scheduler

phase("Plan");
const planned = await plan("plan");
const issues = planned.issues.filter((issue) => issue.kind === "workable");
const prdIssues = planned.issues.filter((issue) => issue.kind === "prd");

const settledIssues = new Set();
const mergedIssues = new Set();
const runningIssues = new Map();
const results = [];
const skipped = [];
let freshStarted = 0;

const frontier = () =>
  issues.filter(
    (issue) =>
      !settledIssues.has(issue.id) &&
      !runningIssues.has(issue.id) &&
      issue.blockedBy.every((blocker) => mergedIssues.has(blocker)),
  );

const overMaxNew = () => maxNew !== null && freshStarted >= maxNew;

log(
  `${issues.length} workable issues, ${issues.filter((issue) => issue.state).length} resuming, ${frontier().length} on the frontier`,
);

while (true) {
  for (const issue of frontier()) {
    const isFresh = !issue.state;

    if (isFresh && overMaxNew()) {
      if (!skipped.includes(issue.id)) {
        skipped.push(issue.id);
      }
      continue;
    }

    if (isFresh) {
      freshStarted++;
    }
    runningIssues.set(issue.id, settle(issue));
  }

  if (runningIssues.size === 0) {
    break;
  }

  const job = await Promise.race(runningIssues.values());
  runningIssues.delete(job.id);
  settledIssues.add(job.id);
  if (job.outcome === "merged") {
    mergedIssues.add(job.id);
  }
  results.push(job);

  log(
    `${job.id}: ${job.outcome}${job.stoppedBecause ? ` (${job.stoppedBecause})` : ""}`,
  );
}

return {
  settled: results.map(({ id, pr, outcome, stoppedBecause }) => ({
    id,
    pr,
    outcome,
    stoppedBecause,
  })),
  blocked: issues
    .filter(
      (issue) => !settledIssues.has(issue.id) && !skipped.includes(issue.id),
    )
    .map((issue) => ({
      id: issue.id,
      blockedBy: issue.blockedBy.filter(
        (blocker) => !mergedIssues.has(blocker),
      ),
    })),
  skipped,
  prd: prdIssues.map((issue) => issue.id),
};
