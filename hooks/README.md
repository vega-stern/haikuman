# Haikuman Hooks

These hooks are **bundled with the haikuman plugin** and activate automatically when the plugin is installed. No manual setup required.

If you installed haikuman standalone (without the plugin), you can use `bash hooks/install.sh` to wire them into your `settings.json` manually.

## What's Included

### `haikuman-activate.js` — SessionStart hook

- Runs once when Claude Code starts
- Writes `full` to `~/.claude/.haikuman-active` (flag file)
- Emits haikuman rules as hidden SessionStart context
- Detects missing statusline config and emits a setup nudge (Claude will offer to help)

### `haikuman-mode-tracker.js` — UserPromptSubmit hook

- Fires on every user prompt, checks for `/haikuman` (and `/haiku`) commands
- Writes the active mode to the flag file when a haikuman command is detected
- Supports: `full`, `lite`, `ultra`, plus independent skills: `commit`, `review`, `compress`

### `haikuman-statusline.sh` / `haikuman-statusline.ps1` — Statusline badge script

- Reads `~/.claude/.haikuman-active` and outputs a colored badge
- Shows `[HAIKUMAN]`, `[HAIKUMAN:ULTRA]`, etc.

## Statusline Badge

The statusline badge shows which haikuman mode is active directly in your Claude Code status bar.

**Plugin users:** If you do not already have a `statusLine` configured, Claude will detect that on your first session after install and offer to set it up for you.

If you already have a custom statusline, haikuman does not overwrite it. Add the badge snippet to your existing script instead.

**Standalone users:** `install.sh` / `install.ps1` wires the statusline automatically if you do not already have a custom statusline.

**Manual setup:** Add one of these to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash /path/to/haikuman-statusline.sh"
  }
}
```

```json
{
  "statusLine": {
    "type": "command",
    "command": "powershell -ExecutionPolicy Bypass -File C:\\path\\to\\haikuman-statusline.ps1"
  }
}
```

**Custom statusline snippet:**

```bash
haikuman_text=""
haikuman_flag="$HOME/.claude/.haikuman-active"
if [ -f "$haikuman_flag" ]; then
  haikuman_mode=$(cat "$haikuman_flag" 2>/dev/null)
  if [ "$haikuman_mode" = "full" ] || [ -z "$haikuman_mode" ]; then
    haikuman_text=$'\033[38;5;172m[HAIKUMAN]\033[0m'
  else
    haikuman_suffix=$(echo "$haikuman_mode" | tr '[:lower:]' '[:upper:]')
    haikuman_text=$'\033[38;5;172m[HAIKUMAN:'"${haikuman_suffix}"$']\033[0m'
  fi
fi
```

Badge examples:
- `/haikuman` → `[HAIKUMAN]`
- `/haikuman ultra` → `[HAIKUMAN:ULTRA]`
- `/haikuman-commit` → `[HAIKUMAN:COMMIT]`
- `/haikuman-review` → `[HAIKUMAN:REVIEW]`

## How It Works

```
SessionStart hook ──writes "full"──▶ ~/.claude/.haikuman-active ◀──writes mode── UserPromptSubmit hook
                                               │
                                            reads
                                               ▼
                                      Statusline script
                                     [HAIKUMAN:ULTRA] │ ...
```

SessionStart stdout is injected as hidden system context — Claude sees it, users don't. The statusline runs as a separate process. The flag file is the bridge.

## Uninstall

If installed via plugin: disable the plugin — hooks deactivate automatically.

If installed via `install.sh`:
```bash
bash hooks/uninstall.sh
```

Or manually:
1. Remove `~/.claude/hooks/haikuman-activate.js`, `~/.claude/hooks/haikuman-mode-tracker.js`, and the matching statusline script
2. Remove the SessionStart, UserPromptSubmit, and statusLine entries from `~/.claude/settings.json`
3. Delete `~/.claude/.haikuman-active`
