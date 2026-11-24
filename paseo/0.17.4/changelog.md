## 0.17.4 - 2026-11-23

### Fixed

- Fixed numbered sublists overlapping their text and quotes inside lists overlapping later messages on Android ([#10499](https://github.com/getpaseo/paseo/pull/10499))
- Fixed Android terminal input so it asks the keyboard to exclude typed text from personalized learning ([#10586](https://github.com/getpaseo/paseo/pull/10586))
- Fixed conversations disappearing when directory capitalization differs on a case-insensitive file system ([#10555](https://github.com/getpaseo/paseo/pull/10555) by @yzim)
- Fixed interrupt and steer messages to archived agents being queued without starting a turn ([#10611](https://github.com/getpaseo/paseo/pull/10611) by @thomasvan)
- Fixed Hermes Shell rows omitting part of the command ([#10614](https://github.com/getpaseo/paseo/pull/10614))
- Fixed OpenCode Go usage for logins stored in the OpenCode 2 database, including Console sign-ins and API keys ([#8729](https://github.com/getpaseo/paseo/pull/8729), [#10612](https://github.com/getpaseo/paseo/pull/10612))
- Fixed existing OpenCode sessions failing to reopen after Paseo tool definitions change ([#10533](https://github.com/getpaseo/paseo/pull/10533) by @Peanut-HZM)
- Fixed Paseo tools missing from agents that use MCP protocol version `2026-07-28` ([#10558](https://github.com/getpaseo/paseo/pull/10558) by @apple-ouyang)
- Fixed Codex MCP startup failures missing from daemon warning logs ([#10566](https://github.com/getpaseo/paseo/pull/10566))
- Fixed the daemon exiting when it closes a session after the plugin process has stopped ([#10585](https://github.com/getpaseo/paseo/pull/10585))
- Fixed Git commands selecting the wrong repository when a directory has the layout of a bare repository ([#10587](https://github.com/getpaseo/paseo/pull/10587))
- Fixed Claude Auto permission mode being unavailable on Bedrock and Vertex ([#6904](https://github.com/getpaseo/paseo/pull/6904))
- Fixed the sidebar host settings button requiring two clicks to open settings ([#10562](https://github.com/getpaseo/paseo/pull/10562) by @ShalokShalom)
- Fixed the Changes pane not offering Push for a new branch that was never pushed in a regular checkout ([#10631](https://github.com/getpaseo/paseo/pull/10631))
- Fixed the daemon using the wrong model catalog when Hub sends a workspace directory for trigger validation ([#10582](https://github.com/getpaseo/paseo/pull/10582))
