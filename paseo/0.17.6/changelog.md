## 0.17.6 - 2026-11-27

### Improved

- Reorganized Settings into Device and Host sections and consolidated sparse pages ([#10933](https://github.com/getpaseo/paseo/pull/10933))
- Added arrow-key navigation for models, providers, and profiles in the model picker ([#10929](https://github.com/getpaseo/paseo/pull/10929), [#10962](https://github.com/getpaseo/paseo/pull/10962))
- Added an in-place Refresh control for Tailscale availability in host settings and setup ([#10903](https://github.com/getpaseo/paseo/pull/10903))

### Changed

- Removed the Antigravity usage source that ran `agy -p /usage` in the background ([#10953](https://github.com/getpaseo/paseo/pull/10953) by @luoph)

### Fixed

- Fixed Paseo Android crashing on Samsung devices when a chat shows a code block or quote ([#10964](https://github.com/getpaseo/paseo/pull/10964))
- Fixed mouse clicks not selecting model picker rows on Android ([#10972](https://github.com/getpaseo/paseo/pull/10972))
- Fixed macOS Desktop freezing during startup because of Dock progress bar updates ([#10939](https://github.com/getpaseo/paseo/pull/10939))
- Fixed Linux AppImage leaking its runtime environment into shells and child processes ([#10920](https://github.com/getpaseo/paseo/pull/10920))
- Fixed background Git fetches on Linux spawning orphan D-Bus daemons and retrying failing auth in a loop ([#10921](https://github.com/getpaseo/paseo/pull/10921))
- Fixed flashes when restoring archived workspaces and agents, and added an unarchiving state ([#10928](https://github.com/getpaseo/paseo/pull/10928))
- Fixed worktree ownership drifting outside the configured worktrees root ([#10878](https://github.com/getpaseo/paseo/pull/10878))
- Fixed new web tabs losing projects after another tab evicts the directory cache ([#10942](https://github.com/getpaseo/paseo/pull/10942))
- Fixed timelines dropping rows when a rewind epoch changes ([#8794](https://github.com/getpaseo/paseo/pull/8794) by @LiebeLee)
