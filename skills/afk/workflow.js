export const meta = {
  name: "afk",
  description: "One pass of the AFK issue-clearing loop",
  phases: [
    {
      title: "Plan",
      detail: "ready issues ⋈ state dir, dependency graph",
      model: "opus",
    },
    { title: "Implement", detail: "worktree, draft PR", model: "opus" },
    { title: "CI", detail: "watch checks, fix red", model: "haiku" },
    { title: "Review", detail: "/code-review rounds", model: "opus" },
    { title: "QA", detail: "/verify rounds", model: "sonnet" },
    {
      title: "Merge",
      detail: "merge or park, summary, labels",
      model: "haiku",
    },
  ],
};

const { tracker, repo, mergeMode, cap = 5, maxNew = null } = args;
const STATE_ROOT = `~/.afk/${repo}`;
const dir = (id) => `${STATE_ROOT}/${id}`;

// ---------- schemas ----------

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
          state: {
            type: ["object", "null"],
            required: ["stage", "pr", "reviewRound", "qaRound", "ciAttempts"],
            properties: {
              stage: { enum: STAGES },
              pr: { type: ["string", "null"] },
              reviewRound: { type: "integer" },
              qaRound: { type: "integer" },
              ciAttempts: { type: "integer" },
            },
          },
        },
      },
    },
  },
};
const PR_STATUS = {
  type: "object",
  required: ["status"],
  properties: { status: { enum: ["OPEN", "MERGED", "CLOSED", "MISSING"] } },
};
const IMPLEMENTED = {
  type: "object",
  required: ["result"],
  properties: {
    result: { enum: ["PR", "STOPPED"] },
    pr: { type: "string" },
    question: { type: "string" },
  },
};
const CI = {
  type: "object",
  required: ["result"],
  properties: { result: { enum: ["GREEN", "RED", "CONFLICT"] } },
};
const VERDICT = {
  type: "object",
  required: ["verdict"],
  properties: { verdict: { enum: ["FINDINGS", "CLEAN", "INCOMPLETE"] } },
};
const FIXED = {
  type: "object",
  required: ["result"],
  properties: {
    result: { enum: ["ADDRESSED", "STOPPED"] },
    question: { type: "string" },
  },
};

// ---------- shared prompt blocks ----------

const CLEANUP = `
Before you return, stop every server, watcher, or other long-running process you started, and confirm nothing you launched is still listening.`;

const ONE_WAY_DOORS = `
A one-way door is an open question you can't safely decide: the spec is ambiguous, contradicts the codebase, or the choice would be expensive to reverse (data migration, public API shape, irreversible deletion, money flow). Surface it instead of deciding: write the question and the options you considered to door.md in the state dir, post the same text as a "## AFK one-way door" comment on the PR if one is open (else on the issue), patch state.json {"stage":"stopped","outcome":"stopped","stoppedBecause":"one-way door"}, then return STOPPED with the question. The door comes last — finish and record whatever else you were doing first.`;

const context = (id) => `
Tracker: ${tracker}. Issue: ${id}. State dir: ${dir(id)}.
Read state.json; cd into its worktree and confirm \`git status\` shows branch afk/${id}. Every later step runs from there. Fetch the issue from the tracker — title, body, and comments are the spec.`;

const patch = (obj) =>
  `Patch ${JSON.stringify(obj)} into state.json (merge keys, keep the rest).`;

// ---------- prompts ----------

const prompts = {
  plan: () => `
Tracker: ${tracker}. State root: ${STATE_ROOT} (create it if missing).
1. List the tracker's open issues labeled ready-for-agent. A PRD issue with linked implementation issues is kind "prd"; everything else is "workable".
2. For each workable issue, read ${STATE_ROOT}/<id>/state.json if it exists and return it as "state" (null if none).
3. Build a dependency graph over the workable issues per /dependency-graph — declared blockers, produced artefacts, overlapping files, decisions one establishes for another — and return each issue's blockedBy.`,

  prVerify: (id, pr) => `
Check PR ${pr} for issue ${id} with gh: return MERGED if merged, CLOSED if closed unmerged, MISSING if it no longer exists, else OPEN. Do nothing else.`,

  implement: (id) => `
Tracker: ${tracker}. Issue: ${id}. State dir: ${dir(id)} (create it).
1. Fetch the issue; it is the spec — title, body, comments.
2. Create a worktree on branch afk/${id} — a new branch, or the existing one if a prior attempt left it — outside the main checkout. ${patch({ stage: "implement", branch: `afk/${id}`, worktree: "<absolute path>", pr: null, reviewRound: 0, qaRound: 0, ciAttempts: 0, outcome: null, stoppedBecause: null })}
3. Implement the issue; use /tdd where there is a testable seam. After each green, self-contained slice run /commit.
4. Typecheck and run the tests you wrote or touched as you go. Do NOT run the full test suite, lint, or any whole-project check — CI does that.
5. Push, then /open-pr as a DRAFT whose body contains "Closes ${id}". ${patch({ stage: "review", pr: "<PR reference>" })}
6. Return the PR reference.${ONE_WAY_DOORS}${CLEANUP}`,

  ci: (id) => `${context(id)}
Watch the PR's checks with \`gh pr checks --watch\` until they finish. Return GREEN if all pass (or there are no checks), RED if any fail, CONFLICT if the branch conflicts with the default branch (gh pr view --json mergeable). Do nothing else.`,

  review: (id, round) => `${context(id)}
Review round ${round}.
1. Read every review-*.md in the state dir and the review-${round - 1}-response.md ledger if it exists. Check each of the previous round's items against the current code: one fixed but not genuinely addressed stays a finding; a won't-fix stands or falls on its reasoning — accept it and it is settled, or reject it and re-raise it marked **disputed**.
2. Run /code-review on the branch — the changes since its merge-base with the default branch. Brief every sub-agent it dispatches to RETURN its report, never to message it. Review the code only: do NOT run tests, lint, typecheck, or builds — CI owns those.
3. Write review-${round}.md: each finding with file, line, what's wrong, what correct looks like; or a single line saying the round found nothing. ${patch({ reviewRound: round })} then stage: "review-fix" if there are findings, "qa" if clean.
4. Return the bare verdict FINDINGS or CLEAN — or, if a sub-agent's report never reached you and re-running it inline came back empty too, write nothing and return INCOMPLETE.${CLEANUP}`,

  qa: (id, round) => `${context(id)}
QA round ${round}.
1. Read every qa-*.md in the state dir and the qa-${round - 1}-response.md ledger if it exists. Re-exercise each of the previous round's items against the current code: fixed-but-not-addressed stays a finding; a won't-fix stands or falls on its reasoning — accept, or re-raise marked **disputed**.
2. Run /verify on the PR with the issue's acceptance criteria as its criteria. Drive the app in a sub-agent briefed to RETURN its evidence so logs and screenshots stay out of your context. Exercise behaviour only: do NOT run tests, lint, typecheck, or builds — CI owns those.
3. Write qa-${round}.md: one entry per failed criterion with steps, what happened, what correct looks like; or a single line saying every criterion passed or there was nothing to exercise. ${patch({ qaRound: round })} then stage: "qa-fix" if there are findings, "merge" if clean.
4. Return the bare verdict FINDINGS, CLEAN, or — for a criterion left untested or an app that would not run — INCOMPLETE.${CLEANUP}`,

  fix: (id, address, round, nextStage) => `${context(id)}
ADDRESS: ${address}${round ? ` (round ${round})` : ""}.
${
  address === "failing checks"
    ? `Fetch the failing check's output (gh pr checks, then the failing run's log), reproduce locally where possible, fix, confirm that command passes.`
    : address === "merge conflict"
      ? `Fetch and rebase onto the default branch, resolving conflicts with /resolving-merge-conflicts; push with --force-with-lease.`
      : `Read ${address === "review findings" ? `review-${round}.md` : `qa-${round}.md`} and triage EVERY item onto a disposition before changing any code:
- fix — the default; where there's a testable seam, fix with /tdd (the finding is the red test).
- investigate — read the code it names, then settle it into fix or won't fix.
- won't fix — the item is wrong, or minor and discretionary and you judge against it.
- one-way door — the call is bigger than a won't fix, or the item arrived marked **disputed**.
Then write ${address === "review findings" ? `review-${round}-response.md` : `qa-${round}-response.md`}: one line per item, disposition and what you did. Write it after the push so it records what landed.`
}
Where you changed code: typecheck, run the affected tests (not the suite), /commit, push. If the PR's title or body went stale, /open-pr to refresh them — it stays a draft. ${patch({ stage: nextStage })}
Return ADDRESSED.${ONE_WAY_DOORS}${CLEANUP}`,

  merge: (id) => `${context(id)}
Mark the PR ready for review. ${
    mergeMode === "merge"
      ? `Merge it, delete the remote and local branch, remove the worktree (git worktree remove), and confirm issue ${id} is closed on the tracker — close it yourself if the Closes reference didn't. ${patch({ stage: "merged", outcome: "merged" })}`
      : `Request a human's review and leave it. ${patch({ stage: "parked", outcome: "parked" })}`
  }`,

  summary: (id) => `
Tracker: ${tracker}. Issue: ${id}. Read ${dir(id)}/state.json.
1. If state.json names a PR, upsert ONE comment on it headed "## AFK summary" — find it by that heading, never by author or position; create it if absent, else edit it in place:
   **State:** <stage> (round/attempt N where it applies)
   **Outcome:** <outcome, or —>
   then one line per review round, QA round, and CI attempt, each saying only that it happened and how it ended (findings → addressed, clean, red → fixed). Counts, never explanations — the findings are on disk, not here.
2. If outcome is "stopped", relabel the issue from ready-for-agent to ready-for-human.
3. If outcome is "merged" and the issue is still open, close it.
Return the word done.`,
};

// ---------- per-issue pipeline ----------

const run = (prompt, label, phase, model, schema) =>
  agent(prompt, { label, phase, model, schema });

const stop = (rec, why) => {
  rec.outcome = "stopped";
  rec.stoppedBecause = why;
  return rec;
};
const door = (rec, q) => stop(rec, `one-way door: ${q}`);

async function ciGate(rec, nextStage) {
  while (true) {
    const { result } = await run(
      prompts.ci(rec.id),
      `ci:${rec.id}`,
      "CI",
      "haiku",
      CI,
    );
    if (result === "GREEN") return null;
    if (result === "RED") {
      if (rec.ciAttempts >= cap) return stop(rec, "CI cap hit");
      rec.ciAttempts++;
    }
    const fix = await run(
      prompts.fix(
        rec.id,
        result === "RED" ? "failing checks" : "merge conflict",
        0,
        nextStage,
      ),
      `fix:${rec.id}`,
      "CI",
      "opus",
      FIXED,
    );
    if (fix.result === "STOPPED") return door(rec, fix.question);
  }
}

async function runIssue(issue) {
  const s = issue.state;
  const rec = {
    id: issue.id,
    pr: s?.pr ?? null,
    outcome: null,
    stoppedBecause: null,
    reviewRound: s?.reviewRound ?? 0,
    qaRound: s?.qaRound ?? 0,
    ciAttempts: s?.ciAttempts ?? 0,
  };
  let stage = s?.stage ?? "implement";
  let incomplete = 0;

  if (s && rec.pr) {
    const { status } = await run(
      prompts.prVerify(rec.id, rec.pr),
      `pr-verify:${rec.id}`,
      "Plan",
      "haiku",
      PR_STATUS,
    );
    if (status === "MERGED") {
      rec.outcome = "merged";
      return rec;
    }
    if (status === "CLOSED") return stop(rec, "PR closed by a human");
    if (status === "MISSING") stage = "implement";
  }
  if (stage === "merged" || stage === "parked") {
    rec.outcome = stage;
    return rec;
  }
  if (stage === "stopped") return stop(rec, "already stopped");

  while (true) {
    if (stage === "implement") {
      const r = await run(
        prompts.implement(rec.id),
        `implement:${rec.id}`,
        "Implement",
        "opus",
        IMPLEMENTED,
      );
      if (r.result === "STOPPED") return door(rec, r.question);
      rec.pr = r.pr;
      stage = "review";
    } else if (stage === "review") {
      if (await ciGate(rec, "review")) return rec;
      const round = rec.reviewRound + 1;
      if (round > cap) return stop(rec, "review cap hit");
      const { verdict } = await run(
        prompts.review(rec.id, round),
        `review:${rec.id}#${round}`,
        "Review",
        "opus",
        VERDICT,
      );
      if (verdict === "INCOMPLETE") {
        if (++incomplete === 2) return stop(rec, "review unreachable");
        continue;
      }
      incomplete = 0;
      rec.reviewRound = round;
      stage = verdict === "CLEAN" ? "qa" : "review-fix";
    } else if (stage === "review-fix") {
      const r = await run(
        prompts.fix(rec.id, "review findings", rec.reviewRound, "review"),
        `fix:${rec.id}`,
        "Review",
        "opus",
        FIXED,
      );
      if (r.result === "STOPPED") return door(rec, r.question);
      stage = "review";
    } else if (stage === "qa") {
      const round = rec.qaRound + 1;
      if (round > cap) return stop(rec, "QA cap hit");
      const { verdict } = await run(
        prompts.qa(rec.id, round),
        `qa:${rec.id}#${round}`,
        "QA",
        "sonnet",
        VERDICT,
      );
      if (verdict === "INCOMPLETE") {
        if (++incomplete === 2) return stop(rec, "QA unreachable");
        continue;
      }
      incomplete = 0;
      rec.qaRound = round;
      stage = verdict === "CLEAN" ? "merge" : "qa-fix";
    } else if (stage === "qa-fix") {
      const r = await run(
        prompts.fix(rec.id, "QA findings", rec.qaRound, "review"),
        `fix:${rec.id}`,
        "QA",
        "opus",
        FIXED,
      );
      if (r.result === "STOPPED") return door(rec, r.question);
      stage = "review";
    } else if (stage === "merge") {
      if (await ciGate(rec, "merge")) return rec;
      await run(prompts.merge(rec.id), `merge:${rec.id}`, "Merge", "haiku");
      rec.outcome = mergeMode === "merge" ? "merged" : "parked";
      return rec;
    }
  }
}

async function settle(issue) {
  const rec = await runIssue(issue).catch((e) => ({
    id: issue.id,
    outcome: "stopped",
    stoppedBecause: `agent error: ${String(e)}`,
  }));
  await run(
    prompts.summary(rec.id),
    `summary:${rec.id}`,
    "Merge",
    "haiku",
  ).catch(() => null);
  return rec;
}

// ---------- scheduler: frontier recomputed whenever an issue settles ----------

phase("Plan");
const plan = await run(prompts.plan(), "plan", "Plan", "opus", PLAN);
const issues = plan.issues.filter((i) => i.kind === "workable");
const settled = new Set(),
  merged = new Set(),
  running = new Map(),
  results = [],
  skipped = [];
let started = 0;
const frontier = () =>
  issues.filter(
    (i) =>
      !settled.has(i.id) &&
      !running.has(i.id) &&
      i.blockedBy.every((b) => merged.has(b)),
  );
log(
  `${issues.length} workable issues, ${issues.filter((i) => i.state).length} resuming, ${frontier().length} on the frontier`,
);

while (true) {
  for (const issue of frontier()) {
    if (!issue.state) {
      if (maxNew !== null && started >= maxNew) {
        if (!skipped.includes(issue.id)) skipped.push(issue.id);
        continue;
      }
      started++;
    }
    running.set(issue.id, settle(issue));
  }
  if (running.size === 0) break;
  const rec = await Promise.race(running.values());
  running.delete(rec.id);
  settled.add(rec.id);
  if (rec.outcome === "merged") merged.add(rec.id);
  results.push(rec);
  log(
    `${rec.id}: ${rec.outcome}${rec.stoppedBecause ? ` (${rec.stoppedBecause})` : ""}`,
  );
}

return {
  settled: results.map((r) => ({
    id: r.id,
    pr: r.pr,
    outcome: r.outcome,
    stoppedBecause: r.stoppedBecause,
  })),
  blocked: issues
    .filter((i) => !settled.has(i.id) && !skipped.includes(i.id))
    .map((i) => ({
      id: i.id,
      blockedBy: i.blockedBy.filter((b) => !merged.has(b)),
    })),
  skipped,
  prd: plan.issues.filter((i) => i.kind === "prd").map((i) => i.id),
};
