## 0.11.1 - 2026-10-07

### Added

- Added Claude Haiku 5.5 for Claude Code 2.1.293 and newer ([#6332](https://github.com/getpaseo/paseo/pull/6332))

### Fixed

- Fixed Claude tool calls that run longer than 30 seconds, such as WebFetch or MCP tools, showing up as subagents ([#6308](https://github.com/getpaseo/paseo/pull/6308))
- Fixed subagents that finish while the app is disconnected staying "working" until one is opened ([#6316](https://github.com/getpaseo/paseo/pull/6316))
- Fixed a Claude agent's history showing "No activity to display" after a daemon restart when its transcript is in another project folder, such as after moving the daemon or running Windows Claude Code from WSL ([#6301](https://github.com/getpaseo/paseo/pull/6301))
