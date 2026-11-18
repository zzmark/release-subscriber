## 0.16.2 - 2026-11-18

### 修复

- 修复 Claude 回应后续后台任务通知时，“折叠轮次”隐藏已完成回复的问题 ([#10092](https://github.com/getpaseo/paseo/pull/10092))
- 修复归档工作区时丢失分离 HEAD 状态下的工作树提交的问题 ([#10009](https://github.com/getpaseo/paseo/pull/10009)，由 @ragokan)
- 修复旧桌面端会话启动的守护进程在桌面端更新后仍以旧版本运行的问题 ([#10067](https://github.com/getpaseo/paseo/pull/10067))
- 修复执行权限变更后守护进程与 Hub 断开连接的问题 ([#10113](https://github.com/getpaseo/paseo/pull/10113))
- 修复某条已存储记录无法读取时，已保存的主机消失的问题 ([#9847](https://github.com/getpaseo/paseo/pull/9847)，由 @ragokan)
- 修复创建工作树时扫描未在 `.worktreeinclude` 中列出的大型忽略目录，导致创建超时的问题 ([#10020](https://github.com/getpaseo/paseo/pull/10020)，由 @mgranderath)
- 修复使用 Steer 调整当前轮次时取消 Claude 正在进行的上下文压缩的问题 ([#10028](https://github.com/getpaseo/paseo/pull/10028)，由 @NightMachinery)
- 修复提供方复用已取消的轮次 ID 时，再次点击“停止”会使智能体卡住的问题 ([#9774](https://github.com/getpaseo/paseo/pull/9774)，由 @DAnaeto)
- 修复桌面端渲染进程意外退出后，窗口一直空白的问题 ([#10035](https://github.com/getpaseo/paseo/pull/10035))
- 修复网页端和桌面端下载文件失败时，错误页面占据整个应用窗口的问题 ([#9937](https://github.com/getpaseo/paseo/pull/9937)，由 @panta82)
- 修复在“导入会话”中选择“加载更多”后丢失滚动位置的问题 ([#9974](https://github.com/getpaseo/paseo/pull/9974))
- 修复主目录所在的文件系统不允许创建 Unix 套接字时（如 AFS），无法打开终端的问题 ([#9214](https://github.com/getpaseo/paseo/pull/9214)，由 @bendavid)
- 修复 Git 文件监视器超时后反复扫描大型仓库的问题 ([#9828](https://github.com/getpaseo/paseo/pull/9828)，由 @Spshulem)
- 修复 `paseo workspace create --path .` 使用本地守护进程所在目录的问题。现在使用调用者的当前目录 ([#10010](https://github.com/getpaseo/paseo/pull/10010))
- 修复 MCP 的智能体状态和列表响应遗漏空闲智能体后台任务信息的问题 ([#10022](https://github.com/getpaseo/paseo/pull/10022)，由 @ortschun)
- 修复 OMP 更改思考级别后，选择器仍显示旧级别的问题 ([#9841](https://github.com/getpaseo/paseo/pull/9841)，由 @dsingal0)
