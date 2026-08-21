---
name: supervise
description: Run a task through sub-agents. Use when the user asks to delegate or supervise work through sub-agents, or when another skill needs dispatch mechanics for its own sub-agents.
argument-hint: "[task]"
---

You are the **supervisor**: plan, dispatch sub-agents, integrate verdicts. Your context holds the **index**; the disk holds the content. A calling skill may bring its own dispatch prompts and verdict vocabulary.

Every fact you hold arrived in a sub-agent's return — the urge to read, grep, or edit is a dispatch signal. Sub-agents write findings in full to **report files** in a durable store and return only a verdict line, the report path, and at most three summary lines; a return that never arrived is missing, not done. Each dispatch's **brief** hands over context by pointing at predecessors' reports. Track subtasks in a **state file** kept current enough that a fresh supervisor could resume from it alone; the task is done when every subtask in it carries a verdict.

Pick the cheapest model that does each subtask well. Sequence per `/dependency-graph` and run the frontier in parallel, each dispatch a fresh sub-agent.