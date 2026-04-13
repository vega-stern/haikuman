---
name: haikuman-help
description: >
  Quick-reference card for haikuman commands.
  One-shot display, not a persistent mode. Trigger: /haikuman-help,
  "haikuman help", "haiku commands", "how do I use haikuman".
---

# Haikuman Help

Display this reference card when invoked. One-shot — do NOT change mode, write flag files, or persist anything. Output in normal prose.

## Modes

| Mode | Trigger | What change |
|------|---------|-------------|
| **Lite** | `/haikuman lite` | 3 lines; syllable count approximate; keep it short |
| **Full** | `/haikuman` or `/haikuman full` | Default. Aim 5/7/5 syllables |
| **Ultra** | `/haikuman ultra` | Exactly one haiku; no extra haiku blocks |

Mode sticks until changed or session end.

## Skills

| Skill | Trigger | What it does |
|-------|---------|--------------|
| **haikuman-commit** | `/haikuman-commit` | Generate a Conventional Commit message (not haiku). |
| **haikuman-review** | `/haikuman-review` | Generate terse, actionable review comments. |
| **caveman-compress** | `/haikuman:compress <file>` | Compress .md files to reduce input tokens (keeps code/URLs intact). |
| **haikuman-help** | `/haikuman-help` | This card. |

## Deactivate

Say "stop haiku" or "normal mode".

## Configure Default Mode

Default mode = `full`. Change it:

**Environment variable** (highest priority):
```bash
export HAIKUMAN_DEFAULT_MODE=ultra
```

**Config file** (`~/.config/haikuman/config.json`):
```json
{ "defaultMode": "lite" }
```

Set `"off"` to disable auto-activation on session start.

Resolution: env var > config file > `full`.

## More

Docs: https://github.com/vega-stern/haikuman
Forked from: https://github.com/JuliusBrussee/caveman
