## 0.18.1 - 2026-11-27

- **Host metadata instructions:** Set host-wide instructions once to guide language, tone, and formatting for generated workspace titles, branch names, commit messages, and pull requests. ([#11064](https://github.com/getpaseo/paseo/pull/11064))
- **Enterprise spending usage:** Usage now shows Claude extra-usage spending and Codex individual spending limits with reset times. ([#8976](https://github.com/getpaseo/paseo/pull/8976) by @mcowger, @JasprW)

<details>
<summary>All changes</summary>

### Fixed

- Fixed Android agent push notifications arriving minutes late during Doze ([#8501](https://github.com/getpaseo/paseo/pull/8501) by @truelecter)
- Fixed Command Center results reordering mid-word while typing ([#11085](https://github.com/getpaseo/paseo/pull/11085))
- Fixed composer slash and `@` autocomplete stopping after closing a web overlay or opening while a prompt submits ([#11041](https://github.com/getpaseo/paseo/pull/11041))
- Fixed the Starting ref popover in New Workspace jumping in height and shifting rows on first open ([#11042](https://github.com/getpaseo/paseo/pull/11042))
- Fixed the iOS Home Screen web app status bar overlapping focus-mode tabs, the overlay sidebar, and the Mermaid fullscreen viewer on wide layouts ([#9970](https://github.com/getpaseo/paseo/pull/9970) by @mywaffles)
- Fixed Mark as read on a workspace not clearing finished terminal attention ([#11040](https://github.com/getpaseo/paseo/pull/11040))
- Fixed GitLab merge request checks and pipeline details failing with 404 when the pipeline runs in a fork project ([#11074](https://github.com/getpaseo/paseo/pull/11074))
- Fixed messages sent while Pi runs a turn it started itself failing instead of queuing ([#11077](https://github.com/getpaseo/paseo/pull/11077))
- Fixed OpenCode v2 tool approvals staying stuck after OpenCode already dropped the request ([#11061](https://github.com/getpaseo/paseo/pull/11061) by @rhettjay)
- Fixed idle cleanup keeping OpenCode v2 chats in memory while another session runs on the shared server ([#11039](https://github.com/getpaseo/paseo/pull/11039))
- Fixed idle ACP agents failing permanently after their process exits instead of reopening on the next message ([#11047](https://github.com/getpaseo/paseo/pull/11047))
- Fixed Kimi usage failing or showing an expired login for global `kimi.ai` accounts ([#8505](https://github.com/getpaseo/paseo/pull/8505) by @benthecarman)
- Fixed the Z.ai Usage card missing when GLM Agent is signed in via `Z_AI_API_KEY` or its credentials file ([#8376](https://github.com/getpaseo/paseo/pull/8376) by @Peanut-HZM)

### Plugins

- Added OMP tool-call intent to `item.metadata.intent` for timeline plugins ([#10727](https://github.com/getpaseo/paseo/pull/10727) by @mcowger)

</details>
