## 0.10.1 - 2026-09-29

### Added

- Added Claude Sonnet 5.5 for Claude Code 2.1.284 and newer ([#5583](https://github.com/getpaseo/paseo/pull/5583) by @yangqi)

### Fixed

- Fixed OpenCode chats failing with "Variant unavailable" after switching to a model without the selected thinking level ([#5587](https://github.com/getpaseo/paseo/pull/5587))
- Fixed rewinding a Codex chat dropping its custom provider and Paseo tools ([#5345](https://github.com/getpaseo/paseo/pull/5345) by @zbaibg)
- Fixed streamed replies joining lines of code blocks and Mermaid diagrams until the chat reloads ([#5577](https://github.com/getpaseo/paseo/pull/5577))
- Fixed a subagent opened from a split pane opening in a different pane ([#5451](https://github.com/getpaseo/paseo/pull/5451))
- Fixed archiving a custom Codex provider's agent leaving its session in Import session ([#5572](https://github.com/getpaseo/paseo/pull/5572))
- Fixed the `/` menu of a custom Codex provider with its own `CODEX_HOME` listing the daemon's prompts instead of its own ([#5450](https://github.com/getpaseo/paseo/pull/5450))
- Fixed a background `send_agent_prompt` returning `idle` for a prompt the agent accepted ([#5386](https://github.com/getpaseo/paseo/pull/5386))
- Fixed Windows file-link tooltips showing the full path for files inside the workspace ([#1987](https://github.com/getpaseo/paseo/pull/1987))
- Fixed terminal profiles that run `cursor-agent` showing the generic terminal icon ([#5379](https://github.com/getpaseo/paseo/pull/5379))
