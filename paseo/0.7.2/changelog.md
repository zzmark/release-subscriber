## 0.7.2 - 2026-09-02

### Added

- Added active-turn steering for pi agents so new messages reach the running turn without interrupting it ([#3752](https://github.com/getpaseo/paseo/pull/3752) by @mcowger)
- Added declared build commands and monorepo source paths for Git-hosted plugins ([#4158](https://github.com/getpaseo/paseo/pull/4158))

### Improved

- Reduced JS stalls while watching a streaming agent on mobile ([#4190](https://github.com/getpaseo/paseo/pull/4190))

### Fixed

- Fixed large and many-file diffs stalling or crashing while opening and scrolling ([#4174](https://github.com/getpaseo/paseo/pull/4174))
- Fixed mobile sidebar and explorer panels losing their settled position when a JS stall crossed the animation ([#4190](https://github.com/getpaseo/paseo/pull/4190))
- Fixed a single oversized assistant message crashing the timeline by capping rendered content at 32,000 characters ([#4166](https://github.com/getpaseo/paseo/pull/4166))
- Fixed Codex rewind failing on paginated threads with Codex 0.151 and later ([#4119](https://github.com/getpaseo/paseo/pull/4119))
- Fixed Escape closing an image preview also interrupting the running agent ([#4161](https://github.com/getpaseo/paseo/pull/4161))
- Fixed daemon stop and restart on Windows skipping graceful shutdown and orphaning agent processes ([#4168](https://github.com/getpaseo/paseo/pull/4168))
- Fixed OMP startup timing out at 10 seconds regardless of the configured RPC timeout ([#4143](https://github.com/getpaseo/paseo/pull/4143) by @Juns-g)
- Fixed completed turns without a visible prompt showing no completion time ([#4170](https://github.com/getpaseo/paseo/pull/4170))
- Fixed Explorer renames replacing an existing file when file identity metadata is unavailable ([#4171](https://github.com/getpaseo/paseo/pull/4171))
