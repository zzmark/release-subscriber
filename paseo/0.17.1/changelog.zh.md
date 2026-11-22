## 0.17.1 - 2026-11-21

- **使用现有工作树：** 在已有工作树中启动工作区，也可从分支或拉取请求创建工作区。插件可以管理工作树的创建、移除和恢复。从 fork 的 PR 或 MR 创建分支时，选择「运行设置」以批准工作区自动化。 ([#10190](https://github.com/getpaseo/paseo/pull/10190), [#10278](https://github.com/getpaseo/paseo/pull/10278))
- **在 Paseo 中更新提供方：** 在提供方列表中查看状态、已安装版本和可用更新。可从设置、初始配置或模型选择器打开提供方设置，更新受支持的 CLI 并查看输出。 ([#9568](https://github.com/getpaseo/paseo/pull/9568), [#9661](https://github.com/getpaseo/paseo/pull/9661))
- **提供方配额预测：** 用量页面根据当前使用速度估算配额是否会在重置前用尽，并将预计耗尽时间与重置时间并排显示。充足的配额现在以绿色进度条显示，重置和耗尽时间在需要时会显示星期和日期。 ([#10289](https://github.com/getpaseo/paseo/pull/10289), [#10385](https://github.com/getpaseo/paseo/pull/10385), [#10397](https://github.com/getpaseo/paseo/pull/10397))
- **关注 PR 和 MR：** 可以让智能体关注 GitHub、GitLab、Gitea、Forgejo 或 Codeberg 上的变更请求，跟踪检查、评审或评论的更新。可在「后台任务」中停止关注。 ([#10148](https://github.com/getpaseo/paseo/pull/10148), [#10279](https://github.com/getpaseo/paseo/pull/10279), [#10280](https://github.com/getpaseo/paseo/pull/10280))
- **在「后台任务」中管理心跳：** 可在智能体的后台任务旁查看和停止其心跳。 ([#10097](https://github.com/getpaseo/paseo/pull/10097), [#10216](https://github.com/getpaseo/paseo/pull/10216))
- **智能体消息按顺序处理：** 来自其他智能体的报告和通知会在当前轮次结束后按顺序送达。中断或发送提示时，更早排队的消息会在同一轮处理。点击「停止」会将排队消息保留到下一次提示。 ([#9757](https://github.com/getpaseo/paseo/pull/9757), [#10404](https://github.com/getpaseo/paseo/pull/10404))
- **Antigravity 的审批和历史记录：** 可以选择权限模式、响应工具审批，以及导入或重新打开会话。守护进程所在主机需要 Antigravity CLI 1.5.0 或更高版本。若覆盖启动命令，请包含 `acp`。如果 Hub 中保存的模型 ID 包含旧的推理强度后缀，请重新选择模型和推理级别。 ([#10193](https://github.com/getpaseo/paseo/pull/10193))
- **更多 goose 模型：** 可以从 goose 中配置的所有提供方选择模型。原有 goose 设置和会话会迁移到内置插件。 ([#9719](https://github.com/getpaseo/paseo/pull/9719) by @i386)
- **插件的智能体指令：** 插件可向智能体添加自定义指令。 ([#9781](https://github.com/getpaseo/paseo/pull/9781))

<details>
<summary>全部变更</summary>

### 新增

- 在用量页面和 `paseo usage` 中显示 OpenRouter 余额和 API 密钥支出。 ([#10269](https://github.com/getpaseo/paseo/pull/10269))
- 在用量页面中显示 Antigravity 账户配额。 ([#10232](https://github.com/getpaseo/paseo/pull/10232) by @luoph, @RRD-dev)
- 在提示中输入 `/` 时显示 Antigravity 技能建议。 ([#10383](https://github.com/getpaseo/paseo/pull/10383))
- 在已安装 Paseo 技能的主机上，向 Antigravity 提供内置的编排技能。 ([#10273](https://github.com/getpaseo/paseo/pull/10273))
- 新增快捷键。Cmd/Ctrl+/ 打开模型选择器，Cmd/Ctrl+Shift+/ 循环切换推理级别。 ([#10147](https://github.com/getpaseo/paseo/pull/10147))
- 发送首条消息前，可通过命令中心搜索找到智能体设置。 ([#10182](https://github.com/getpaseo/paseo/pull/10182) by @cleiter)
- 可在命令中心回退最近一轮对话。 ([#10144](https://github.com/getpaseo/paseo/pull/10144))
- 为符合条件的 Claude 模型新增独立的 Ultracode 开关。 ([#10150](https://github.com/getpaseo/paseo/pull/10150) by @fivetaku)
- 新增 Codex Flex 速度选项。 ([#9809](https://github.com/getpaseo/paseo/pull/9809) by @qjqqyy)
- 为 Shell 脚本和 Dockerfile 添加语法高亮。 ([#10178](https://github.com/getpaseo/paseo/pull/10178))
- 具有 `hub.execute` 权限的 Hub 会话可以列出已连接守护进程上的项目。 ([#10392](https://github.com/getpaseo/paseo/pull/10392))
- 在 `paseo ls --json` 输出中加入标签和工作区 ID。 ([#10076](https://github.com/getpaseo/paseo/pull/10076))

### 变更

- 外观设置中的内容宽度改为默认（820 px）、宽屏（1,200 px）和全宽三种预设。打开的对话、输入框和 Markdown 预览会一同调整。 ([#10231](https://github.com/getpaseo/paseo/pull/10231))
- Antigravity 工具卡片现在显示 Shell 命令及输出、文件差异和 Paseo 工具详情。 ([#10379](https://github.com/getpaseo/paseo/pull/10379))
- 从 GitHub 克隆时，优先显示匹配的私有仓库。 ([#10264](https://github.com/getpaseo/paseo/pull/10264))
- 清理命令超过一分钟或超过 `worktree.teardownTimeoutMs`（在 `paseo.json` 中设置）时，保留工作树。 ([#9852](https://github.com/getpaseo/paseo/pull/9852) by @ragokan)
- 移动端工作区导航会更快响应点击，并减少初次加载的屏幕外对话行。 ([#9887](https://github.com/getpaseo/paseo/pull/9887))
- 短暂断线重连后，如果检出内容未变，工作区会复用 Git 状态快照。 ([#10142](https://github.com/getpaseo/paseo/pull/10142) by @VladimirGVP)
- 同时连接多个 Desktop 时，`browser_new_tab` 会要求智能体选择其中一个。 ([#10189](https://github.com/getpaseo/paseo/pull/10189))

### 修复

- 修复应用逐出目录缓存后，在线主机的工作区一直不显示的问题。 ([#10318](https://github.com/getpaseo/paseo/pull/10318))
- 修复重连后大量打开的对话同时刷新导致历史记录加载超时的问题。 ([#10368](https://github.com/getpaseo/paseo/pull/10368))
- 修复守护进程繁忙时重新打开长篇 Claude 对话耗时过长的问题。 ([#10369](https://github.com/getpaseo/paseo/pull/10369))
- 修复实时回复中的图片需要等待另一对话的历史图片加载完毕的问题。 ([#10371](https://github.com/getpaseo/paseo/pull/10371))
- 修复在 macOS 或 Linux 上用 Ctrl+C 停止前台守护进程后，智能体无法恢复且空闲智能体显示错误的问题。 ([#10381](https://github.com/getpaseo/paseo/pull/10381))
- 修复守护进程重启后重新打开长篇 Antigravity 对话时丢失末尾历史的问题。 ([#10428](https://github.com/getpaseo/paseo/pull/10428))
- 修复后台命令仍在运行时 Antigravity 提前结束轮次的问题。 ([#10310](https://github.com/getpaseo/paseo/pull/10310))
- 修复当提供方发现过程缓慢或失败时，保存自定义模型后「添加模型」面板仍保持打开的问题。 ([#10432](https://github.com/getpaseo/paseo/pull/10432))
- 修复提供方报告重复命令名时斜杠命令建议失效的问题。 ([#10275](https://github.com/getpaseo/paseo/pull/10275))
- 修复在不同目录中打开已恢复的 Codex 会话时，配置和 MCP 服务器仍使用上一个工作目录的问题。 ([#10390](https://github.com/getpaseo/paseo/pull/10390) by @tabulius-ux)
- 修复重新打开或回退父对话后 Codex 子智能体状态未更新的问题。 ([#10171](https://github.com/getpaseo/paseo/pull/10171) by @AnalyticETH)
- 修复切换 Claude 账户后，用量页面仍显示上一个账户配额的问题。 ([#10236](https://github.com/getpaseo/paseo/pull/10236))
- 修复固定多个用量时间窗口时，侧栏用量行丢失 `5h` 和 `wk` 等周期标签的问题。 ([#10274](https://github.com/getpaseo/paseo/pull/10274))
- 修复恢复工作树后，「更改」视图无法立即识别检出的问题。 ([#10224](https://github.com/getpaseo/paseo/pull/10224), [#10304](https://github.com/getpaseo/paseo/pull/10304), [#10406](https://github.com/getpaseo/paseo/pull/10406))
- 修复添加窗格时，如果某一行曾调整过大小，分隔条在拖动中会停止响应或滞后的问题。 ([#5996](https://github.com/getpaseo/paseo/pull/5996))
- 修复双击差异内容时的选词和三击时的整行选择问题。 ([#10252](https://github.com/getpaseo/paseo/pull/10252) by @pedrovieira)
- 修复启用对话大纲时，输入框与对话列未对齐的问题。 ([#10277](https://github.com/getpaseo/paseo/pull/10277))
- 修复 Web 端输入框聚焦快捷键提示在窄屏或译文较长时与占位文本重叠的问题。 ([#6200](https://github.com/getpaseo/paseo/pull/6200))
- 修复当前工作区所属的侧栏分组折叠时，归档快捷键失效的问题。 ([#10356](https://github.com/getpaseo/paseo/pull/10356) by @hiennd-ctrl, @neihyud)
- 修复一个会话正在归档工作区时，其他会话和插件仍将该工作区视为活跃的问题。 ([#10391](https://github.com/getpaseo/paseo/pull/10391) by @tabulius-ux)
- 修复在对话图片中输入内容或缩放图片后，Android 端输入框按钮需点击两次才生效的问题。 ([#10057](https://github.com/getpaseo/paseo/pull/10057), [#10308](https://github.com/getpaseo/paseo/pull/10308))
- 修复在 Android 浏览器中滑动终端时意外弹出已关闭键盘的问题。 ([#10225](https://github.com/getpaseo/paseo/pull/10225) by @tonylt)
- 修复显示空闲提供方通知时，折叠轮次会隐藏已完成的 OMP 或 Pi 回复的问题。 ([#10135](https://github.com/getpaseo/paseo/pull/10135))
- 修复智能体响应后台任务且上一条完成通知尚未阅读时，反复发送完成通知的问题。 ([#10200](https://github.com/getpaseo/paseo/pull/10200))
- 修复回复过程中重连时，原本为空的对话丢失提示和回复开头的问题。 ([#9723](https://github.com/getpaseo/paseo/pull/9723) by @ragokan)
- 修复切换 Claude 推理级别时后台任务被停止的问题。 ([#10008](https://github.com/getpaseo/paseo/pull/10008) by @gilad-rubin)
- 修复共享 OpenCode 服务停止后，OpenCode 轮次仍显示运行中的问题。 ([#10187](https://github.com/getpaseo/paseo/pull/10187))
- 修复 OMP 在提供会话或授权选项时拒绝已批准工具调用的问题。 ([#10126](https://github.com/getpaseo/paseo/pull/10126) by @dsingal0)
- 修复 Codex 消息在轮次开始前被停止时显示为错误的问题，现在会显示为已取消。 ([#9931](https://github.com/getpaseo/paseo/pull/9931) by @3ae3ae)
- 修复 Git 元数据监视达到上限后，「更改」视图无法打开的问题。 ([#10188](https://github.com/getpaseo/paseo/pull/10188))
- 修复复制选中的回复文本到纯文本目标时夹带 Markdown 语法的问题。 ([#10079](https://github.com/getpaseo/paseo/pull/10079) by @danberindei)
- 修复在预览和源码之间切换时，文件视图丢失滚动位置的问题。iOS 上的 HTML 预览除外。 ([#10195](https://github.com/getpaseo/paseo/pull/10195) by @apple-ouyang)
- 修复分栏中的文件标签页显示或聚焦错误文件的问题。 ([#9888](https://github.com/getpaseo/paseo/pull/9888) by @KosmoCHE)
- 修复触屏子菜单一打开就关闭的问题。 ([#10175](https://github.com/getpaseo/paseo/pull/10175) by @christiantwu)
- 修复另一个使用麦克风的对话关闭后，语音听写失效的问题。 ([#10185](https://github.com/getpaseo/paseo/pull/10185) by @Brandon168)
- 修复 Samsung DeX 上文字被截断的问题。 ([#9995](https://github.com/getpaseo/paseo/pull/9995) by @easyhunjune)
- 修复主机连接缓慢时，对话中的工作区图片加载失败的问题。 ([#10111](https://github.com/getpaseo/paseo/pull/10111) by @ragokan)
- 修复桌面浏览器截图完全透明的问题。 ([#9807](https://github.com/getpaseo/paseo/pull/9807) by @monarchmaisuriya)
- 修复标签中含有 `@` 的 Mermaid 流程图显示源码的问题。 ([#10165](https://github.com/getpaseo/paseo/pull/10165) by @monarchmaisuriya)
- 修复隐藏的后台工作区触发 Dock 徽标和网站图标提示的问题。 ([#9983](https://github.com/getpaseo/paseo/pull/9983))
- 修复桌面端侧栏导航挤占工作区列表空间的问题。 ([#9903](https://github.com/getpaseo/paseo/pull/9903) by @pentatonic-alex)
- 修复仓库默认分支显示已关闭的历史 PR 徽标的问题。 ([#10053](https://github.com/getpaseo/paseo/pull/10053))
- 修复提供方关闭会话后，插件智能体无法重新打开的问题。 ([#10153](https://github.com/getpaseo/paseo/pull/10153))
- 修复插件页面和设置无法使用插件状态钩子的问题。 ([#10049](https://github.com/getpaseo/paseo/pull/10049))

### 插件

- 新增插件导航选项 `focusHost`，用于在打开工作区或智能体时，在侧栏选中目标主机。 ([#5574](https://github.com/getpaseo/paseo/pull/5574) by @discwl)

</details>
