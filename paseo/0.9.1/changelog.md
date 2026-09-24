## 0.9.1 - 2026-09-22

### Added

- Added Opus 5.5 to the Claude catalog as its default model, with a 1M context window and Fast Mode, on Claude Code 2.1.280 and newer ([#5200](https://github.com/getpaseo/paseo/pull/5200) by @leonardourci, @sebgalind0, @rp4ri)

### Fixed

- Fixed the sidebar keeping only recently changed conversations after the app reconnects to a daemon ([#5189](https://github.com/getpaseo/paseo/pull/5189) by @bagutzu)
- Fixed Import session offering only the newest 100 Codex conversations ([#5174](https://github.com/getpaseo/paseo/pull/5174) by @3ae3ae)
- Fixed a Claude model whose ID carries a minor version, such as Opus 5.5, reverting to its major version in the composer once a turn finished ([#5200](https://github.com/getpaseo/paseo/pull/5200))
