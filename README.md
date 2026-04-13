<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/cherry-blossom_1f338.png" width="120" />
</p>

<h1 align="center">haikuman</h1>

<p align="center">
  <strong>why use many words / when three lines will do / keep truth, add breeze</strong>
</p>

<p align="center">
  <a href="https://github.com/vega-stern/haikuman/stargazers"><img src="https://img.shields.io/github/stars/vega-stern/haikuman?style=flat&color=yellow" alt="Stars"></a>
  <a href="https://github.com/vega-stern/haikuman/commits/main"><img src="https://img.shields.io/github/last-commit/vega-stern/haikuman?style=flat" alt="Last Commit"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/vega-stern/haikuman?style=flat" alt="License"></a>
</p>

---

A Claude Code skill/plugin + Codex plugin + Gemini CLI extension that makes your agent answer in **haiku** (3 lines, 5/7/5-ish), while keeping technical accuracy.

Forked from Julius Brussee’s caveman:
https://github.com/JuliusBrussee/caveman

## Before / After

**Normal**

> "Your component is re-rendering because you're creating a new object reference on each render. React sees a different object every time and re-renders. Use useMemo."

**Haikuman**

> New object each render
> Props shift, shallow checks fire
> Memo holds it still

## Install

| Agent | Install |
|------|---------|
| **Claude Code** | `claude plugin marketplace add vega-stern/haikuman && claude plugin install haikuman@haikuman` |
| **Codex** | Clone repo → `/plugins` → Search "Haikuman" → Install |
| **Gemini CLI** | `gemini extensions install https://github.com/vega-stern/haikuman` |
| **Cursor** | `npx skills add vega-stern/haikuman -a cursor` |
| **Windsurf** | `npx skills add vega-stern/haikuman -a windsurf` |
| **Copilot** | `npx skills add vega-stern/haikuman -a github-copilot` |
| **Cline** | `npx skills add vega-stern/haikuman -a cline` |
| **Any other** | `npx skills add vega-stern/haikuman` |

## Usage

Activate:
- `/haikuman`
- "haiku mode"
- "talk in haiku"

Switch level:
- `/haikuman lite` (3 lines, syllables approximate)
- `/haikuman` or `/haikuman full` (default 5/7/5)
- `/haikuman ultra` (exactly one haiku)

Deactivate:
- "stop haiku" or "normal mode"

### Notes

- If code/commands are needed: haiku first, then code blocks unchanged.
- For security warnings and destructive commands: the model should drop haiku and be clear, then resume.

## License

MIT.
