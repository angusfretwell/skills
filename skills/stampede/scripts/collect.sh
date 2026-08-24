#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "usage: collect.sh --state-root <abs> --issue <id> --agent <name> [--keep-tab]" >&2
  exit 2
}

STATE_ROOT="" ISSUE="" AGENT="" KEEP=0
while [ $# -gt 0 ]; do
  case "$1" in
    --state-root) STATE_ROOT=$2; shift 2 ;;
    --issue) ISSUE=$2; shift 2 ;;
    --agent) AGENT=$2; shift 2 ;;
    --keep-tab) KEEP=1; shift ;;
    *) usage ;;
  esac
done
[ -n "$STATE_ROOT" ] && [ -n "$ISSUE" ] && [ -n "$AGENT" ] || usage

STATE_DIR="$STATE_ROOT/$ISSUE"
STATE_JSON="$STATE_DIR/state.json"
OUTCOME=$(jq -r --arg a "$AGENT" '.agents[$a].outcome // empty' "$STATE_JSON")
[ -n "$OUTCOME" ] || { echo "no outcome path recorded for $AGENT in $STATE_JSON" >&2; exit 1; }
[ -f "$OUTCOME" ] || { echo "no outcome file: $OUTCOME" >&2; exit 1; }

if [ -n "${HERDR_ENV:-}" ]; then
  HERDR=(herdr)
else
  HERDR=(herdr --session "$(jq -r .session "$STATE_ROOT/config.json")")
fi

TAB=$(jq -r --arg a "$AGENT" '.agents[$a].tab // empty' "$STATE_JSON")
TMP=$(mktemp)
jq --arg a "$AGENT" '.agents[$a].status = "done"' "$STATE_JSON" > "$TMP" && mv "$TMP" "$STATE_JSON"

if [ "$KEEP" = 0 ] && [ -n "$TAB" ]; then
  "${HERDR[@]}" tab close "$TAB" >/dev/null || true
fi

cat "$OUTCOME"
