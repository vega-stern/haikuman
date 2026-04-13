#!/usr/bin/env node
// haikuman — Claude Code SessionStart activation hook
//
// Runs on every session start:
//   1. Writes flag file at ~/.claude/.haikuman-active (statusline reads this)
//   2. Emits haikuman ruleset as hidden SessionStart context
//   3. Detects missing statusline config and emits setup nudge

const fs = require('fs');
const path = require('path');
const os = require('os');
const { getDefaultMode } = require('./haikuman-config');

const claudeDir = path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.haikuman-active');
const settingsPath = path.join(claudeDir, 'settings.json');

const mode = getDefaultMode();

// "off" mode — skip activation entirely, don't write flag or emit rules
if (mode === 'off') {
  try { fs.unlinkSync(flagPath); } catch (e) {}
  process.stdout.write('OK');
  process.exit(0);
}

// 1. Write flag file
try {
  fs.mkdirSync(path.dirname(flagPath), { recursive: true });
  fs.writeFileSync(flagPath, mode);
} catch (e) {
  // Silent fail -- flag is best-effort, don't block the hook
}

// 2. Emit full haikuman ruleset.
//    Reads SKILL.md at runtime so edits propagate automatically.

// Modes that have their own independent skill files — not haikuman intensity levels.
// For these, emit a short activation line; the skill itself handles behavior.
const INDEPENDENT_MODES = new Set(['commit', 'review', 'compress']);

if (INDEPENDENT_MODES.has(mode)) {
  process.stdout.write('HAIKUMAN MODE ACTIVE — skill: /haikuman-' + mode);
  process.exit(0);
}

const modeLabel = mode;

// Read SKILL.md — the single source of truth for haikuman behavior.
// Plugin installs: __dirname = <plugin_root>/hooks/, SKILL.md at <plugin_root>/skills/haikuman/SKILL.md
// Standalone installs: __dirname = ~/.claude/hooks/, SKILL.md won't exist — falls back to hardcoded rules.
let skillContent = '';
try {
  skillContent = fs.readFileSync(
    path.join(__dirname, '..', 'skills', 'haikuman', 'SKILL.md'), 'utf8'
  );
} catch (e) { /* standalone install — will use fallback below */ }

let output;

if (skillContent) {
  // Strip YAML frontmatter
  const body = skillContent.replace(/^---[\s\S]*?---\s*/, '');

  output = 'HAIKUMAN MODE ACTIVE — level: ' + modeLabel + '\n\n' + body;
} else {
  // Fallback when SKILL.md is not found (standalone hook install without skills dir).
  output =
    'HAIKUMAN MODE ACTIVE — level: ' + modeLabel + '\n\n' +
    'Respond as haiku. Keep technical substance exact.\n\n' +
    '## Persistence\n\n' +
    'ACTIVE EVERY RESPONSE. Off only: "stop haiku" / "normal mode".\n\n' +
    'Current level: **' + modeLabel + '**. Switch: `/haikuman lite|full|ultra`.\n\n' +
    '## Rules\n\n' +
    '- Output is haiku(s): 3 lines each.\n' +
    '- Full: aim 5/7/5 syllables. Lite: approximate. Ultra: one haiku only.\n' +
    '- Keep technical terms exact. Code blocks unchanged.\n\n' +
    '## Auto-Clarity\n\n' +
    'Drop haiku for: security warnings, irreversible action confirmations, long multi-step procedures. Resume after.\n\n' +
    '## Boundaries\n\n' +
    'Code/commits/PRs: write normal unless user asks otherwise.';
}

// 3. Detect missing statusline config — nudge Claude to help set it up
try {
  let hasStatusline = false;
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (settings.statusLine) {
      hasStatusline = true;
    }
  }

  if (!hasStatusline) {
    const isWindows = process.platform === 'win32';
    const scriptName = isWindows ? 'haikuman-statusline.ps1' : 'haikuman-statusline.sh';
    const scriptPath = path.join(__dirname, scriptName);
    const command = isWindows
      ? `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`
      : `bash "${scriptPath}"`;
    const statusLineSnippet =
      '"statusLine": { "type": "command", "command": ' + JSON.stringify(command) + ' }';
    output += "\n\n" +
      "STATUSLINE SETUP NEEDED: The haikuman plugin includes a statusline badge showing active mode " +
      "(e.g. [HAIKUMAN], [HAIKUMAN:ULTRA]). It is not configured yet. " +
      "To enable, add this to ~/.claude/settings.json: " +
      statusLineSnippet + " " +
      "Proactively offer to set this up for the user on first interaction.";
  }
} catch (e) {
  // Silent fail — don't block session start over statusline detection
}

process.stdout.write(output);
