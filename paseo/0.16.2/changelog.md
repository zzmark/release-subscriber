## 0.16.2 - 2026-11-18

### Fixed

- Fixed Collapse turns hiding a finished reply when Claude answers a later background task notification ([#10092](https://github.com/getpaseo/paseo/pull/10092))
- Fixed detached worktree commits getting lost when archiving a workspace ([#10009](https://github.com/getpaseo/paseo/pull/10009) by @ragokan)
- Fixed Desktop updates leaving an older daemon running when an earlier Desktop session started it ([#10067](https://github.com/getpaseo/paseo/pull/10067))
- Fixed daemons losing their Hub connection after execution permissions changed ([#10113](https://github.com/getpaseo/paseo/pull/10113))
- Fixed saved hosts disappearing when one stored entry could not be read ([#9847](https://github.com/getpaseo/paseo/pull/9847) by @ragokan)
- Fixed worktree creation timing out while scanning large ignored folders that `.worktreeinclude` does not name ([#10020](https://github.com/getpaseo/paseo/pull/10020) by @mgranderath)
- Fixed Steer cancelling a Claude compaction in progress ([#10028](https://github.com/getpaseo/paseo/pull/10028) by @NightMachinery)
- Fixed agents getting stuck after a second Stop when the provider reused the cancelled turn ID ([#9774](https://github.com/getpaseo/paseo/pull/9774) by @DAnaeto)
- Fixed Desktop staying blank after its renderer exited unexpectedly ([#10035](https://github.com/getpaseo/paseo/pull/10035))
- Fixed failed file downloads taking over the app window on web and Desktop ([#9937](https://github.com/getpaseo/paseo/pull/9937) by @panta82)
- Fixed Import Session losing its scroll position when you select Load more ([#9974](https://github.com/getpaseo/paseo/pull/9974))
- Fixed terminals failing to open when the home filesystem refuses Unix sockets, such as on AFS ([#9214](https://github.com/getpaseo/paseo/pull/9214) by @bendavid)
- Fixed timed-out Git watchers repeatedly rescanning large repositories ([#9828](https://github.com/getpaseo/paseo/pull/9828) by @Spshulem)
- Fixed `paseo workspace create --path .` using the local daemon's directory instead of the caller's ([#10010](https://github.com/getpaseo/paseo/pull/10010))
- Fixed MCP agent status and list responses omitting background work for idle agents ([#10022](https://github.com/getpaseo/paseo/pull/10022) by @ortschun)
- Fixed the thinking selector showing an old level after OMP changes it ([#9841](https://github.com/getpaseo/paseo/pull/9841) by @dsingal0)
