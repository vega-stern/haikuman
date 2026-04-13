#!/bin/bash
# haikuman — statusline badge script for Claude Code
# Reads the haikuman mode flag file and outputs a colored badge.
#
# Usage in ~/.claude/settings.json:
#   "statusLine": { "type": "command", "command": "bash /path/to/haikuman-statusline.sh" }

FLAG="$HOME/.claude/.haikuman-active"
[ ! -f "$FLAG" ] && exit 0

MODE=$(cat "$FLAG" 2>/dev/null)
if [ "$MODE" = "full" ] || [ -z "$MODE" ]; then
  printf '\033[38;5;172m[HAIKUMAN]\033[0m'
else
  SUFFIX=$(echo "$MODE" | tr '[:lower:]' '[:upper:]')
  printf '\033[38;5;172m[HAIKUMAN:%s]\033[0m' "$SUFFIX"
fi
