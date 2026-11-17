## 0.16.1 - 2026-11-17

### Fixed

- Fixed Claude Bypass approving actions without a permission card when a `permissions.ask` rule or a hook that returns `ask` required one ([#9927](https://github.com/getpaseo/paseo/pull/9927))
- Fixed controls being touch-sized on a touch-screen laptop when a trackpad or mouse is its primary input ([#9909](https://github.com/getpaseo/paseo/pull/9909) by @michaelhthomas)
- Fixed Claude sessions failing until `/login` when Paseo refreshed the Claude model list while Claude Code was renewing an expired access token ([#9855](https://github.com/getpaseo/paseo/pull/9855) by @daysun-k)
- Fixed Add host text fields on web drawing without a box, which left the host password field invisible ([#9865](https://github.com/getpaseo/paseo/pull/9865) by @angusb93)
- Fixed an OpenCode question that could not be answered or dismissed after a new message steered the turn ([#9891](https://github.com/getpaseo/paseo/pull/9891))
- Fixed Pi and OMP model names that contain `/` being cut to the text after the last slash ([#9823](https://github.com/getpaseo/paseo/pull/9823), [#9836](https://github.com/getpaseo/paseo/pull/9836) by @rms523)
- Fixed Changes leaving out an edit when the file was saved with the same size in the same second it was staged ([#9854](https://github.com/getpaseo/paseo/pull/9854))
- Fixed an error toast that never closed when marking a chat as read failed ([#9837](https://github.com/getpaseo/paseo/pull/9837))
- Fixed wait results and finish notifications after a daemon restart joining an agent's self-started reply to the reply before it ([#9846](https://github.com/getpaseo/paseo/pull/9846))
- Fixed Codex chats staying loaded in the daemon until restart when a client opened them only to read their history ([#9859](https://github.com/getpaseo/paseo/pull/9859) by @Spshulem)
