## 0.17.5 - 2026-11-26

- **批量归档工作区：** 在侧栏按住 Cmd 或 Ctrl 并单击工作区即可多选，然后一次归档。 ([#10798](https://github.com/getpaseo/paseo/pull/10798), [#10821](https://github.com/getpaseo/paseo/pull/10821))
- **复制草稿中的引用：** 轻点即可复制回复中的引用内容，复制时会去掉 `>` 标记。 ([#10608](https://github.com/getpaseo/paseo/pull/10608) by @pedrovieira, @dinhphieu)
- **重新设计智能体配置页：** 智能体配置现在有独立的设置页，也可以在模型选择器中一键保存新配置。 ([#10789](https://github.com/getpaseo/paseo/pull/10789), [#10824](https://github.com/getpaseo/paseo/pull/10824))
- **重新设计「添加项目」：** 打开后直接进入文件夹搜索，切换标签页即可克隆或新建文件夹。 ([#10767](https://github.com/getpaseo/paseo/pull/10767))
- **选择桌面端更新方式：** 桌面端可以自动下载更新、仅发送通知，或从不检查更新。 ([#10785](https://github.com/getpaseo/paseo/pull/10785))
- **内置 Tailscale 支持：** 可在主机设置或初始设置流程中启用 Tailscale，无需编辑主机配置。 ([#10801](https://github.com/getpaseo/paseo/pull/10801))

<details>
<summary>全部变更</summary>

### 新增

- 主机选择器新增主机图标、连接类型和延迟信息。 ([#10702](https://github.com/getpaseo/paseo/pull/10702) by @artile)
- 模型选择器的搜索和命令中心现在可查找智能体配置。 ([#10774](https://github.com/getpaseo/paseo/pull/10774))
- 在 `paseo schedule create`、`paseo schedule update` 和计划任务 MCP 工具中新增「完成后归档」选项。 ([#8479](https://github.com/getpaseo/paseo/pull/8479) by @ArnoldHueteG)
- 将 Factory Droid 的目录条目更新至 Droid 1.20.0，以提供较新的模型。 ([#10779](https://github.com/getpaseo/paseo/pull/10779) by @dsingal0)

### 调整

- 调整桌面端稳定版的自动更新机制，检查间隔至少为 6 小时，每次更新后等待 24 小时才再次检查。 ([#10882](https://github.com/getpaseo/paseo/pull/10882), [#10901](https://github.com/getpaseo/paseo/pull/10901))

### 修复

- 修复智能体创建的子智能体未显示在标签页和子智能体轨道中的问题。 ([#10887](https://github.com/getpaseo/paseo/pull/10887))
- 修复 Claude 子智能体等待后台任务时，父智能体收到中间回复而非最终回复的问题。 ([#10864](https://github.com/getpaseo/paseo/pull/10864))
- 修复监视拉取请求的智能体在轮次结束后仍显示为「运行中」的问题。 ([#10740](https://github.com/getpaseo/paseo/pull/10740) by @drgould)
- 修复远程仓库名称为 `origin` 以外的名称时，「变更」窗格缺少推送和拉取操作的问题。 ([#10679](https://github.com/getpaseo/paseo/pull/10679))
- 修复拆分窗格中的活动标签页或将其移出窗格后，该窗格切换到错误标签页的问题。 ([#10716](https://github.com/getpaseo/paseo/pull/10716))
- 修复新建工作区时选定项目后，焦点仍停留在项目按钮上的问题。 ([#10632](https://github.com/getpaseo/paseo/pull/10632))
- 修复已归档聊天在窗口重新加载前一直留在内存中的问题。 ([#10866](https://github.com/getpaseo/paseo/pull/10866))
- 修复应用长时间运行后，悬浮卡片等浮层响应变慢的问题。 ([#10778](https://github.com/getpaseo/paseo/pull/10778) by @maci0)
- 修复桌面端打开最后一轮包含数百次工具调用的聊天时卡死的问题。 ([#8661](https://github.com/getpaseo/paseo/pull/8661) by @luoph)
- 修复在较慢的网络连接上加载大型时间线时直连中断的问题。 ([#10651](https://github.com/getpaseo/paseo/pull/10651) by @apple-ouyang)
- 修复大型 Git 工作区的文件监视器扫描期间，守护进程停止响应的问题。 ([#10788](https://github.com/getpaseo/paseo/pull/10788), [#10602](https://github.com/getpaseo/paseo/pull/10602))
- 修复单个 Git 仓库发生变更时，所有检出目录都被重新扫描的问题。 ([#10863](https://github.com/getpaseo/paseo/pull/10863) by @viiqswim)
- 修复 iOS 上待回答的问题高度超过屏幕时，聊天页面一直空白的问题。 ([#10759](https://github.com/getpaseo/paseo/pull/10759))
- 修复 Android 聊天中长按选择文本后，放大镜滞留在屏幕上的问题。 ([#10844](https://github.com/getpaseo/paseo/pull/10844))
- 修复移动端键盘关闭时，弹层底部区域被系统栏遮挡的问题。 ([#10827](https://github.com/getpaseo/paseo/pull/10827))
- 修复 macOS 上侧栏切换按钮遮挡插件页面标题的问题。 ([#10773](https://github.com/getpaseo/paseo/pull/10773))
- 修复 Windows 文件链接的驱动器号前有斜杠时无法打开的问题。 ([#7711](https://github.com/getpaseo/paseo/pull/7711))
- 修复「导入会话」过早放弃响应较慢的提供方，并隐藏提供方错误的问题。 ([#10516](https://github.com/getpaseo/paseo/pull/10516) by @chirag127, @derek-geekdive)
- 修复 OMP 19.1 的 `ask` 问题未显示问答卡片的问题。 ([#10862](https://github.com/getpaseo/paseo/pull/10862) by @gtoxlili)
- 修复共享 OpenCode 服务器运行时，自带 MCP 服务器的 OpenCode 2 智能体运行失败的问题。此修复需要 OpenCode 2.0.29 或更高版本。 ([#10752](https://github.com/getpaseo/paseo/pull/10752))
- 修复已删除的 OpenCode 子智能体仍留在子智能体轨道中的问题。 ([#8332](https://github.com/getpaseo/paseo/pull/8332))
- 修复重新打开父智能体后，已停止的 Claude 后台子智能体仍显示为「运行中」的问题。 ([#9013](https://github.com/getpaseo/paseo/pull/9013))
- 修复插件和 Paseo 的指令覆盖 Codex 智能体自身 `developer_instructions` 的问题。 ([#10792](https://github.com/getpaseo/paseo/pull/10792))
- 修复 Go 密钥存放在 OpenCode 的 `auth.json` 中时，OpenCode Go 用量卡片缺失的问题。 ([#10678](https://github.com/getpaseo/paseo/pull/10678))
- 修复 Windows 上的 GitHub、GitLab 和 Gitea 命令破坏多行参数并展开 `%VAR%` 文本的问题。 ([#10685](https://github.com/getpaseo/paseo/pull/10685))
- 修复 `paseo hub login` 输出链接时未显示代码的问题。 ([#10751](https://github.com/getpaseo/paseo/pull/10751))
- 修复 Antigravity 及其他不支持工具策略的插件提供方无法运行 Hub 触发器的问题。 ([#10889](https://github.com/getpaseo/paseo/pull/10889))
- 修复 Hub 会话读取守护进程的提供方控制设置时遭到拒绝的问题。 ([#10794](https://github.com/getpaseo/paseo/pull/10794))
- 修复 Hermes 等插件 ACP 提供方刷新模型列表超时后仍留下运行进程的问题。 ([#10867](https://github.com/getpaseo/paseo/pull/10867))
- 修复轮次进行中重载插件后，插件的智能体工具返回 `Tool not found` 的问题。 ([#10106](https://github.com/getpaseo/paseo/pull/10106) by @tomgrin10)
- 修复经时间线插件修改的回复丢失「复制」「派生」操作和轮次耗时的问题。 ([#10795](https://github.com/getpaseo/paseo/pull/10795) by @Brandon168)
- 修复空闲插件会话每隔 10 秒唤醒守护进程的问题。 ([#9363](https://github.com/getpaseo/paseo/pull/9363) by @Brandon168)

### 安全

- Claude Code 2.1.326 或更高版本改为通过标准输入接收 MCP 服务器令牌，避免其他本地用户从进程参数读取令牌。 ([#10698](https://github.com/getpaseo/paseo/pull/10698) by @mdbraber)
- 修复归档拉取请求工作树时，即使尚未批准其初始化操作，仍会执行仓库清理命令的问题。 ([#10694](https://github.com/getpaseo/paseo/pull/10694))

### 插件

- 新增启动包装器，插件可在沙箱内运行智能体、终端和工作树命令。 ([#10786](https://github.com/getpaseo/paseo/pull/10786) by @clkao, @bendavid)
- 在插件工作区快照中新增父工作区信息。 ([#10781](https://github.com/getpaseo/paseo/pull/10781) by @spatenotte)
- 将随附的 `paseo-plugin` 技能更新至当前插件 API。 ([#10793](https://github.com/getpaseo/paseo/pull/10793))

</details>
