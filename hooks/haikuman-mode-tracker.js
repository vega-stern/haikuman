#!/usr/bin/env node
// haikuman — UserPromptSubmit hook to track which haikuman mode is active
// Inspects user input for /haiku commands and writes mode to flag file

const fs = require('fs');
const path = require('path');
const os = require('os');
const { getDefaultMode } = require('./haikuman-config');

const flagPath = path.join(os.homedir(), '.claude', '.haikuman-active');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = (data.prompt || '').trim();
    const promptLower = prompt.toLowerCase();

    // Match /haiku commands
    if (promptLower.startsWith('/haiku') || promptLower.startsWith('/haikuman')) {
      const parts = promptLower.split(/\s+/);
      const cmd = parts[0]; // /haiku, /haikuman-commit, /haikuman-review, etc.
      const arg = parts[1] || '';

      let mode = null;

      if (cmd === '/haikuman-commit') {
        mode = 'commit';
      } else if (cmd === '/haikuman-review') {
        mode = 'review';
      } else if (cmd === '/haikuman-compress' || cmd === '/haikuman:compress') {
        mode = 'compress';
      } else if (cmd === '/haiku' || cmd === '/haikuman') {
        if (arg === 'lite') mode = 'lite';
        else if (arg === 'ultra') mode = 'ultra';
        else if (arg === 'full') mode = 'full';
        else mode = getDefaultMode();
      }

      if (mode && mode !== 'off') {
        fs.mkdirSync(path.dirname(flagPath), { recursive: true });
        fs.writeFileSync(flagPath, mode);
      } else if (mode === 'off') {
        try { fs.unlinkSync(flagPath); } catch (e) {}
      }
    }

    // Detect deactivation
    if (/\b(stop haiku|stop haikuman|normal mode)\b/i.test(prompt)) {
      try { fs.unlinkSync(flagPath); } catch (e) {}
    }
  } catch (e) {
    // Silent fail
  }
});
