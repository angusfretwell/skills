#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "usage: dispatch.sh --state-root <abs> --issue <id> --agent <name> --role <role> --model <model> [--cwd <abs>] [--pane <pane_id>] [--no-preamble] [KEY=VALUE ...]" >&2
  exit 2
}

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

STATE_ROOT="" ISSUE="" AGENT="" ROLE="" MODEL="" CWD="" PANE="" PREAMBLE=1
FILLS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --state-root) STATE_ROOT=$2; shift 2 ;;
    --issue) ISSUE=$2; shift 2 ;;
    --agent) AGENT=$2; shift 2 ;;
    --role) ROLE=$2; shift 2 ;;
    --model) MODEL=$2; shift 2 ;;
    --cwd) CWD=$2; shift 2 ;;
    --pane) PANE=$2; shift 2 ;;
    --no-preamble) PREAMBLE=0; shift ;;
    *=*) FILLS+=("$1"); shift ;;
    *) usage ;;
  esac
done
[ -n "$STATE_ROOT" ] && [ -n "$ISSUE" ] && [ -n "$AGENT" ] && [ -n "$ROLE" ] && [ -n "$MODEL" ] || usage

AGENT=$(printf '%s' "$AGENT" | tr '[:upper:]' '[:lower:]' | cut -c1-32)
STATE_DIR="$STATE_ROOT/$ISSUE"
STATE_JSON="$STATE_DIR/state.json"
CONFIG="$STATE_ROOT/config.json"
ROLE_FILE="$SKILL_DIR/prompts/$ROLE.md"
[ -f "$ROLE_FILE" ] || { echo "no such role: $ROLE_FILE" >&2; exit 1; }

if [ -n "${HERDR_ENV:-}" ]; then
  HERDR=(herdr)
else
  HERDR=(herdr --session "$(jq -r .session "$CONFIG")")
fi

TRACKER=$(jq -r .tracker "$CONFIG")
WORKSPACE=$(jq -r .workspace "$STATE_JSON")
[ -n "$CWD" ] || CWD=$(jq -r .worktree "$STATE_JSON")

BRIEF="$STATE_DIR/briefs/$AGENT.md"
mkdir -p "$STATE_DIR/briefs" "$STATE_DIR/outcomes"
{
  if [ "$PREAMBLE" = 1 ]; then cat "$SKILL_DIR/prompts/_preamble.md"; echo; fi
  awk 'BEGIN{n=0} /^---$/{n=1} n==0{print}' "$ROLE_FILE"
} > "$BRIEF"

fill() { K="$1" V="$2" perl -0pi -e 's/\Q{{$ENV{K}}}\E/$ENV{V}/g' "$BRIEF"; }

fill TRACKER "$TRACKER"
fill ISSUE_ID "$ISSUE"
fill STATE_DIR "$STATE_DIR"
fill STATE_ROOT "$STATE_ROOT"
fill AGENT "$AGENT"
fill SKILL_DIR "$SKILL_DIR"
fill DOORS "$SKILL_DIR/references/one-way-doors.md"

BRANCH_SET=0
for kv in ${FILLS[@]+"${FILLS[@]}"}; do
  k=${kv%%=*}
  v=${kv#*=}
  [ "$k" = BRANCH ] && BRANCH_SET=1
  fill "$k" "$v"
done
[ "$BRANCH_SET" = 1 ] || fill BRANCH "$(jq -r .branch "$STATE_JSON")"

LEFT=$(grep -o '{{[A-Z_]*}}' "$BRIEF" | sort -u || true)
[ -z "$LEFT" ] || { echo "unfilled placeholders in $BRIEF: $LEFT" >&2; exit 1; }

TAB=""
if [ -z "$PANE" ]; then
  TAB_JSON=$("${HERDR[@]}" tab create --workspace "$WORKSPACE" --cwd "$CWD" --label "$AGENT")
  PANE=$(jq -r .result.root_pane.pane_id <<<"$TAB_JSON")
  TAB=$(jq -r .result.tab.tab_id <<<"$TAB_JSON")
fi

OUT=""
STARTED=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if OUT=$("${HERDR[@]}" agent start "$AGENT" --kind claude --pane "$PANE" --timeout 120000 -- --dangerously-skip-permissions --model "$MODEL" 2>&1); then
    case "$OUT" in
      *agent_pane_busy*) sleep 3; continue ;;
    esac
    STARTED=1
    break
  fi
  case "$OUT" in
    *agent_pane_busy*) sleep 3 ;;
    *) echo "$OUT" >&2; exit 1 ;;
  esac
done
[ "$STARTED" = 1 ] || { echo "agent start kept failing: $OUT" >&2; exit 1; }

"${HERDR[@]}" agent prompt "$AGENT" "Read and follow the brief at $BRIEF. It names the outcome file to write when you are done." >/dev/null

TMP=$(mktemp)
jq --arg a "$AGENT" --arg r "$ROLE" --arg t "$TAB" '.agents[$a] = {role: $r, tab: $t, status: "running"}' "$STATE_JSON" > "$TMP" && mv "$TMP" "$STATE_JSON"

jq -n --arg agent "$AGENT" --arg tab "$TAB" --arg pane "$PANE" --arg brief "$BRIEF" --arg wait "${HERDR[*]} agent wait $AGENT" \
  '{agent: $agent, tab: $tab, pane: $pane, brief: $brief, wait: $wait}'
