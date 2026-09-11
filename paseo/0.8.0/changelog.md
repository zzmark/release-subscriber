## 0.8.0 - 2026-09-10

Paseo 0.8 adds plugin header buttons, custom providers, and richer chat components, alongside fixes for desktop updates and mobile keyboards.

**Before upgrading:** desktop now requires macOS 13 or newer. Plugins written for 0.7 need the [0.8 migration guide](https://paseo.sh/docs/plugins/v0.8/migration), including separate client/server entries and the revised composer pill API.

### Added

- Added answer forms for Codex questions asked while the agent continues working ([#4587](https://github.com/getpaseo/paseo/pull/4587))
- Added Mark as unread to finished workspaces in the sidebar menu ([#3603](https://github.com/getpaseo/paseo/pull/3603) by @edihasaj)
- Added an in-app What's new sheet in the help menu, Settings → About, and desktop update callout ([#4576](https://github.com/getpaseo/paseo/pull/4576))
- Added Import session to the sidebar footer, History, and Command Center ([#4216](https://github.com/getpaseo/paseo/pull/4216))
- Added search, pagination, and workspace filtering to Import session ([#4216](https://github.com/getpaseo/paseo/pull/4216))
- Added sidebar item reordering and visibility controls in Appearance settings ([#4203](https://github.com/getpaseo/paseo/pull/4203))
- Added provider notifications from Pi extensions and OpenCode to the timeline ([#3411](https://github.com/getpaseo/paseo/pull/3411) by @trim21)
- Added a fullscreen Mermaid viewer on web and desktop ([#4107](https://github.com/getpaseo/paseo/pull/4107) by @gengjiawen)
- Added Copy, Copy line, and Select all to the web diff context menu ([#4229](https://github.com/getpaseo/paseo/pull/4229))
- Added Gajae Code to the ACP provider catalog ([#3471](https://github.com/getpaseo/paseo/pull/3471) by @Yeachan-Heo)
- Added per-provider controls for disabling all or selected Paseo tools ([#4277](https://github.com/getpaseo/paseo/pull/4277) by @mcowger)
- Added explicit approval before running setup, automatic terminals, or scripts in fork pull request workspaces ([#4215](https://github.com/getpaseo/paseo/pull/4215))
- Added Hub follow-ups to existing agents, including archived workspace recovery ([#4354](https://github.com/getpaseo/paseo/pull/4354))
- Added provider catalog discovery to Hub executions ([#4242](https://github.com/getpaseo/paseo/pull/4242))

### Plugins

- Added custom providers with their own icons, settings, permissions, and timeline rendering ([#4314](https://github.com/getpaseo/paseo/pull/4314))
- Added provider session recovery after plugin reload ([#4629](https://github.com/getpaseo/paseo/pull/4629) by @mcowger)
- Added custom timeline components and persisted timeline rows ([e34aea2](https://github.com/getpaseo/paseo/commit/e34aea206e6ec7ac2d5fa9766db28fb221ae990c))
- Added client slash commands that run without a provider turn ([e34aea2](https://github.com/getpaseo/paseo/commit/e34aea206e6ec7ac2d5fa9766db28fb221ae990c))
- Added plugin settings screens under Settings → Plugins ([#4357](https://github.com/getpaseo/paseo/pull/4357))
- Added lifecycle hooks for agent creation, turns, permissions, and archive events ([#4435](https://github.com/getpaseo/paseo/pull/4435))
- Added transforms for new agents' provider, model, environment, MCP servers, and workspace isolation ([#4435](https://github.com/getpaseo/paseo/pull/4435))
- Added header buttons and composer pills with actions, menus, custom popovers, and live updates ([#4577](https://github.com/getpaseo/paseo/pull/4577))
- Added custom modal bodies with scrolling, keyboard-aware inputs, and clipboard actions ([#4392](https://github.com/getpaseo/paseo/pull/4392))
- Added terminal creation, input, capture, and management to the SDK ([#4358](https://github.com/getpaseo/paseo/pull/4358))
- Added live project subscriptions through `paseo.projects.subscribe()` ([#3983](https://github.com/getpaseo/paseo/pull/3983) by @omercnet)
- Added permission responses through `agent.respondToPermission()` ([#3985](https://github.com/getpaseo/paseo/pull/3985) by @omercnet)
- Added provider usage queries through `providers.listUsage()` ([#4062](https://github.com/getpaseo/paseo/pull/4062) by @ivanbrykov)
- Added supported Paseo version requirements to plugin manifests ([#4430](https://github.com/getpaseo/paseo/pull/4430))
- Changed plugins to separate client and server entries with runtime-specific SDK imports ([#4347](https://github.com/getpaseo/paseo/pull/4347) by @liujin0506, @panrafal)
- Changed composer pill registration to use `button`, `registration.update()`, and `registration.remove()` ([#4577](https://github.com/getpaseo/paseo/pull/4577))
- Changed `paseo plugin ls` to show runtime state, installed commit, and load errors without contacting a remote ([#4265](https://github.com/getpaseo/paseo/pull/4265))
- Fixed workspace plugin panels missing from the Explorer menu ([#4446](https://github.com/getpaseo/paseo/pull/4446))

### Changed

- Changed the desktop app to require macOS 13 or newer; macOS 12 stops receiving desktop updates ([#4322](https://github.com/getpaseo/paseo/pull/4322))
- Changed `--host` to a global CLI option: `paseo --host <target> <command>` ([#4238](https://github.com/getpaseo/paseo/pull/4238))
- Changed the sidebar footer Home button to Import session ([#4216](https://github.com/getpaseo/paseo/pull/4216))
- Changed `paseo hub init` and default `paseo hub deploy` to use organization triggers in `.paseo/triggers/` ([#4517](https://github.com/getpaseo/paseo/pull/4517))
- Changed Codex Fast availability to the supported model list, including GPT-6 Astra ([#4640](https://github.com/getpaseo/paseo/pull/4640))
- Changed CLI installs to resolve patched React 19.1.x releases ([#4100](https://github.com/getpaseo/paseo/pull/4100) by @liujin0506)

### Improved

- Reconnected every host immediately when returning to the app ([#4160](https://github.com/getpaseo/paseo/pull/4160))
- Smoothed mobile keyboard transitions by moving the timeline and composer together ([#4275](https://github.com/getpaseo/paseo/pull/4275))
- Reduced stalls when opening large diffs ([#4574](https://github.com/getpaseo/paseo/pull/4574))
- Reloaded only providers whose configuration changed ([#4332](https://github.com/getpaseo/paseo/pull/4332))
- Removed unsolicited timeline and catalog traffic from idle SDK connections ([#4470](https://github.com/getpaseo/paseo/pull/4470))
- Added macOS updater diagnostics to App Diagnostics ([#4322](https://github.com/getpaseo/paseo/pull/4322))

### Fixed

- Fixed macOS desktop updates closing the app without installing the new version ([#4322](https://github.com/getpaseo/paseo/pull/4322))
- Fixed the desktop updater reporting up to date before release manifests were available ([#4201](https://github.com/getpaseo/paseo/pull/4201))
- Fixed `paseo restart` failing from the desktop-installed CLI on Linux `.deb`, RPM, and tarball installs ([#4207](https://github.com/getpaseo/paseo/pull/4207))
- Fixed the packaged macOS Dock icon rendering oversized ([#4389](https://github.com/getpaseo/paseo/pull/4389))
- Fixed the mobile terminal keyboard closing and reopening when using toolbar keys or Enter ([#4469](https://github.com/getpaseo/paseo/pull/4469))
- Fixed cached conversations and workspace lists failing to appear when live updates arrived during loading ([#4436](https://github.com/getpaseo/paseo/pull/4436))
- Fixed queued messages not sending after a turn completed while the app was in the background ([#4160](https://github.com/getpaseo/paseo/pull/4160))
- Fixed Codex reloads and follow-ups after workspace archive failing with an active-writer error ([#4353](https://github.com/getpaseo/paseo/pull/4353))
- Fixed repeated Claude compaction updates leaving extra Compacting rows spinning ([#4391](https://github.com/getpaseo/paseo/pull/4391) by @tomgrin10)
- Fixed Pi agents stuck running after an extension-triggered turn ([#3849](https://github.com/getpaseo/paseo/pull/3849) by @mjakl)
- Fixed delayed workspace creation navigating away after you switched elsewhere ([#2986](https://github.com/getpaseo/paseo/pull/2986) by @cleiter)
- Fixed New workspace losing the selected model after creating a workspace ([#4401](https://github.com/getpaseo/paseo/pull/4401))
- Fixed a crash when the selected provider disappeared during workspace creation ([#4332](https://github.com/getpaseo/paseo/pull/4332))
- Fixed Codex model rows staying on Loading in the model picker ([#4283](https://github.com/getpaseo/paseo/pull/4283) by @colonelpanic8)
- Fixed nested subagents appearing under the root agent instead of their actual parent ([#4321](https://github.com/getpaseo/paseo/pull/4321))
- Fixed repeated tool-call IDs across autonomous turns producing duplicate timeline rows ([140b0bb](https://github.com/getpaseo/paseo/commit/140b0bb716205cf0e00c0ff5b6b3c20af6c79413))
- Fixed Import session loading forever when one provider hung ([#4216](https://github.com/getpaseo/paseo/pull/4216))
- Fixed Import session ignoring Claude Code `/rename` titles ([#4216](https://github.com/getpaseo/paseo/pull/4216))
- Fixed importing a session creating a duplicate workspace for an already-open directory ([#4216](https://github.com/getpaseo/paseo/pull/4216))
- Fixed empty ACP sessions appearing in Import session ([#4335](https://github.com/getpaseo/paseo/pull/4335))
- Fixed restored terminal titles briefly showing Terminal before loading ([#4553](https://github.com/getpaseo/paseo/pull/4553))
- Fixed diff file headers lagging behind while scrolling on web and desktop ([#4240](https://github.com/getpaseo/paseo/pull/4240))
- Fixed Changes and its diff going out of sync when switching between Committed and Uncommitted ([#4199](https://github.com/getpaseo/paseo/pull/4199))
- Fixed Mermaid diagrams shrinking during streaming or becoming corrupted on reload ([#4210](https://github.com/getpaseo/paseo/pull/4210))
- Fixed Settings navigation retaining closed views in memory on desktop ([#4228](https://github.com/getpaseo/paseo/pull/4228))
- Fixed the file watcher missing nested directory changes on Windows ([#4354](https://github.com/getpaseo/paseo/pull/4354))
- Fixed daemon Git commands allowing a repository's `core.fsmonitor` to execute its own command ([#4208](https://github.com/getpaseo/paseo/pull/4208))
- Fixed terminal activity reporting for OpenCode 2 sessions ([#4300](https://github.com/getpaseo/paseo/pull/4300) by @mr-karan)
- Fixed the website offering downloads for the wrong platform before loading ([#4222](https://github.com/getpaseo/paseo/pull/4222))
