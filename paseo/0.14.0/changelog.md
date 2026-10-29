## 0.14.0 - 2026-10-29

Plugins can now add tools to individual agents and configure their MCP servers when sessions open.

Completed conversation turns can be collapsed into summaries and expanded to read the full exchange.

Voice settings now let you configure speech providers and download local models with one tap, including SenseVoice and Whisper for Chinese dictation. Voice mode is now opt-in.

### Added

- Let plugins give tools to specific agents ([#7938](https://github.com/getpaseo/paseo/pull/7938))
- Added Chat display settings that group tool calls or collapse completed conversation turns ([#7785](https://github.com/getpaseo/paseo/pull/7785), [#7990](https://github.com/getpaseo/paseo/pull/7990), [#8026](https://github.com/getpaseo/paseo/pull/8026), [#8042](https://github.com/getpaseo/paseo/pull/8042), [#8109](https://github.com/getpaseo/paseo/pull/8109) by @akaready, @Dey11, @Sebeb, @Waishnav)
- Let plugins add MCP servers whenever an agent session opens ([#7983](https://github.com/getpaseo/paseo/pull/7983))
- Added downloadable local speech models in Voice settings, including SenseVoice and Whisper for Chinese dictation ([#7295](https://github.com/getpaseo/paseo/pull/7295))
- Added a choice of Enter or ⌘/Ctrl+Enter to send messages ([#5503](https://github.com/getpaseo/paseo/pull/5503) by @lukelabonte)
- Added sent-message recall with Up and Down in an empty web or desktop Composer ([#7710](https://github.com/getpaseo/paseo/pull/7710))
- Added long-press Send to queue a message or send it immediately ([#7897](https://github.com/getpaseo/paseo/pull/7897) by @bjspi)
- Added project-specific editor choices, including Xcode on macOS ([#7898](https://github.com/getpaseo/paseo/pull/7898) by @kinoroy)

### Improved

- Release eligible agent runtimes after one idle hour, resuming the saved session on the next prompt ([#7782](https://github.com/getpaseo/paseo/pull/7782))
- Added a link back to the parent in subagent panes ([#7784](https://github.com/getpaseo/paseo/pull/7784))
- Opened subagents in place of the subagent list on phones, with Back returning to the list ([#8093](https://github.com/getpaseo/paseo/pull/8093))
- Added clickable links and selectable descriptions to question cards ([#7419](https://github.com/getpaseo/paseo/pull/7419) by @NoSync)
- Kept large Import session lists responsive on web ([#7872](https://github.com/getpaseo/paseo/pull/7872) by @royenheart)
- Enlarged project and workspace menu buttons on phones ([#7928](https://github.com/getpaseo/paseo/pull/7928))
- Stopped hidden chats from rendering incoming text updates ([#7901](https://github.com/getpaseo/paseo/pull/7901))
- Reduced stalls when highlighting and wrapping large diffs ([#8006](https://github.com/getpaseo/paseo/pull/8006), [#7945](https://github.com/getpaseo/paseo/pull/7945))
- Reduced daemon stalls when opening and paging large Claude and OMP histories ([#7789](https://github.com/getpaseo/paseo/pull/7789), [#7940](https://github.com/getpaseo/paseo/pull/7940), [#7948](https://github.com/getpaseo/paseo/pull/7948), [#7958](https://github.com/getpaseo/paseo/pull/7958) by @ragokan)
- Reduced daemon stalls during plugin builds, image processing and config reloads ([#7967](https://github.com/getpaseo/paseo/pull/7967), [#7954](https://github.com/getpaseo/paseo/pull/7954), [#7959](https://github.com/getpaseo/paseo/pull/7959))
- Reduced blocking filesystem work during workspace and project refreshes ([#7941](https://github.com/getpaseo/paseo/pull/7941), [#7943](https://github.com/getpaseo/paseo/pull/7943), [#7944](https://github.com/getpaseo/paseo/pull/7944))

### Fixed

- Fixed terminal glyph corruption when shared WebGL texture atlases change ([#8013](https://github.com/getpaseo/paseo/pull/8013) by @donghyeonan)
- Fixed restored workspaces with no open chat staying on Loading workspace at launch on phones ([#7918](https://github.com/getpaseo/paseo/pull/7918))
- Fixed restored agent tabs appearing in unrelated workspaces ([#7956](https://github.com/getpaseo/paseo/pull/7956) by @odoo-mvds)
- Fixed background Git fetches opening credential prompts ([#8019](https://github.com/getpaseo/paseo/pull/8019))
- Fixed failed SSH tunnels crashing callers with an unhandled EPIPE ([#7876](https://github.com/getpaseo/paseo/pull/7876))
- Fixed brief Windows file locks preventing atomic saves ([#7955](https://github.com/getpaseo/paseo/pull/7955))
- Fixed large ACP terminal output blocking daemon requests ([#7953](https://github.com/getpaseo/paseo/pull/7953) by @bbtfr)
- Fixed messages sent during Pi manual compaction failing instead of waiting ([#7848](https://github.com/getpaseo/paseo/pull/7848) by @itssimon)
- Fixed late tool updates creating duplicate rows during overlapping turns ([#8010](https://github.com/getpaseo/paseo/pull/8010) by @luoph)
- Fixed plugin ACP reasoning appearing inside assistant replies when message IDs match ([#7272](https://github.com/getpaseo/paseo/pull/7272) by @cncolder)
- Fixed outside-folder links replacing Files with an access error ([#7726](https://github.com/getpaseo/paseo/pull/7726) by @jtomaszewski)
- Fixed command suggestions overlapping a growing Composer on phones ([#7910](https://github.com/getpaseo/paseo/pull/7910))
- Fixed bare Markdown URLs losing ports or stopping at colons in paths ([#7859](https://github.com/getpaseo/paseo/pull/7859) by @mariotaku)
- Fixed inline code sizing inside emphasis, links and headings ([#7889](https://github.com/getpaseo/paseo/pull/7889), [#8088](https://github.com/getpaseo/paseo/pull/8088))
- Fixed compact navigation sizes and a cramped Settings detail pane in docked windows 600–719 wide ([#8052](https://github.com/getpaseo/paseo/pull/8052) by @zeyugao)
- Fixed Settings losing the selected host or sidebar scroll position between sections ([#7893](https://github.com/getpaseo/paseo/pull/7893), [#7899](https://github.com/getpaseo/paseo/pull/7899) by @bingqilinweimaotai, @wangnan0916)
- Fixed OpenCode v2 subagent rows missing model and token details ([#7799](https://github.com/getpaseo/paseo/pull/7799) by @Davnn1)
- Fixed file-link tooltips staying over the preview after leaving a chat ([#7842](https://github.com/getpaseo/paseo/pull/7842))
- Fixed model discovery errors touching the model picker edges ([#8039](https://github.com/getpaseo/paseo/pull/8039) by @ilteoood)
- Fixed model selectors staying open over Settings ([#7783](https://github.com/getpaseo/paseo/pull/7783) by @ragokan)

### Notes

- Voice mode now defaults to off; enable it in Voice settings
- If environment variables select OpenAI speech, move keys and endpoints stored only in legacy `providers.openai` into Voice settings
- Before downgrading to 0.13.2, restore a backed-up `config.json` or convert speech credentials and idle-cleanup settings saved by 0.14.0
- Install the optional [Claude Code entrypoint plugin](https://paseo.sh/plugins/getpaseo/claude-code-entrypoint-env) to launch Claude sessions with `CLAUDE_CODE_ENTRYPOINT=Paseo`, a community workaround for subscription limits draining faster ([#7976](https://github.com/getpaseo/paseo/pull/7976), [#8164](https://github.com/getpaseo/paseo/pull/8164) by @david828019-oss)
