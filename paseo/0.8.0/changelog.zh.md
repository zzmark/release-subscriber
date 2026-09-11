## 0.8.0 - 2026-09-10

Paseo 0.8 新增插件页眉按钮、自定义提供商和更丰富的聊天组件，同时修复桌面端更新与移动端键盘相关问题。

**升级前须知：**桌面应用现在要求 macOS 13 或更高版本。面向 0.7 编写的插件需要按照 [0.8 迁移指南](https://paseo.sh/docs/plugins/v0.8/migration)进行迁移，其中包括拆分客户端/服务端入口，以及使用修订后的编辑器胶囊按钮 API。

### 新增

- 新增回答表单，用于处理代理继续工作期间 Codex 提出的问题（[#4587](https://github.com/getpaseo/paseo/pull/4587)）
- 在侧栏菜单中为已完成的工作区新增“标记为未读”功能（[#3603](https://github.com/getpaseo/paseo/pull/3603)，由 @edihasaj 贡献）
- 在帮助菜单、“设置 → 关于”和桌面更新提示中新增应用内“新功能”面板（[#4576](https://github.com/getpaseo/paseo/pull/4576)）
- 在侧栏页脚、历史记录和命令中心中新增“导入会话”入口（[#4216](https://github.com/getpaseo/paseo/pull/4216)）
- 为“导入会话”新增搜索、分页和工作区筛选功能（[#4216](https://github.com/getpaseo/paseo/pull/4216)）
- 在外观设置中新增侧栏项目排序及可见性控制（[#4203](https://github.com/getpaseo/paseo/pull/4203)）
- 在时间线中新增来自 Pi 扩展和 OpenCode 的提供商通知（[#3411](https://github.com/getpaseo/paseo/pull/3411)，由 @trim21 贡献）
- 在 Web 端和桌面端新增全屏 Mermaid 查看器（[#4107](https://github.com/getpaseo/paseo/pull/4107)，由 @gengjiawen 贡献）
- 在 Web 端 diff 上下文菜单中新增“复制”“复制行”和“全选”（[#4229](https://github.com/getpaseo/paseo/pull/4229)）
- 将 Gajae Code 加入 ACP 提供商目录（[#3471](https://github.com/getpaseo/paseo/pull/3471)，由 @Yeachan-Heo 贡献）
- 新增按提供商控制 Paseo 工具的功能，可禁用全部工具或指定工具（[#4277](https://github.com/getpaseo/paseo/pull/4277)，由 @mcowger 贡献）
- 在 fork 拉取请求工作区中运行初始化、自动终端或脚本前，新增明确的批准步骤（[#4215](https://github.com/getpaseo/paseo/pull/4215)）
- 支持通过 Hub 向现有代理发送后续任务，并可恢复已归档的工作区（[#4354](https://github.com/getpaseo/paseo/pull/4354)）
- 为 Hub 执行新增提供商目录发现能力（[#4242](https://github.com/getpaseo/paseo/pull/4242)）

### 插件

- 新增自定义提供商支持，可配置独立图标、设置、权限和时间线渲染方式（[#4314](https://github.com/getpaseo/paseo/pull/4314)）
- 支持在插件重新加载后恢复提供商会话（[#4629](https://github.com/getpaseo/paseo/pull/4629)，由 @mcowger 贡献）
- 新增自定义时间线组件和持久化时间线行（[e34aea2](https://github.com/getpaseo/paseo/commit/e34aea206e6ec7ac2d5fa9766db28fb221ae990c)）
- 新增无需触发提供商回合即可运行的客户端斜杠命令（[e34aea2](https://github.com/getpaseo/paseo/commit/e34aea206e6ec7ac2d5fa9766db28fb221ae990c)）
- 在“设置 → 插件”中新增插件设置界面（[#4357](https://github.com/getpaseo/paseo/pull/4357)）
- 为代理创建、回合、权限和归档事件新增生命周期钩子（[#4435](https://github.com/getpaseo/paseo/pull/4435)）
- 新增转换钩子，可调整新代理的提供商、模型、环境、MCP 服务器和工作区隔离设置（[#4435](https://github.com/getpaseo/paseo/pull/4435)）
- 新增页眉按钮和编辑器胶囊按钮，支持操作、菜单、自定义弹出层和实时更新（[#4577](https://github.com/getpaseo/paseo/pull/4577)）
- 新增自定义模态框主体，支持滚动、键盘自适应输入和剪贴板操作（[#4392](https://github.com/getpaseo/paseo/pull/4392)）
- SDK 新增终端创建、输入、内容捕获和管理能力（[#4358](https://github.com/getpaseo/paseo/pull/4358)）
- 可通过 `paseo.projects.subscribe()` 实时订阅项目（[#3983](https://github.com/getpaseo/paseo/pull/3983)，由 @omercnet 贡献）
- 可通过 `agent.respondToPermission()` 响应权限请求（[#3985](https://github.com/getpaseo/paseo/pull/3985)，由 @omercnet 贡献）
- 可通过 `providers.listUsage()` 查询提供商用量（[#4062](https://github.com/getpaseo/paseo/pull/4062)，由 @ivanbrykov 贡献）
- 插件清单新增所需 Paseo 版本声明（[#4430](https://github.com/getpaseo/paseo/pull/4430)）
- 插件改为使用独立的客户端和服务端入口，并分别导入对应运行时的 SDK（[#4347](https://github.com/getpaseo/paseo/pull/4347)，由 @liujin0506、@panrafal 贡献）
- 编辑器胶囊按钮注册方式改为使用 `button`、`registration.update()` 和 `registration.remove()`（[#4577](https://github.com/getpaseo/paseo/pull/4577)）
- `paseo plugin ls` 改为直接显示运行时状态、已安装提交和加载错误，无需访问远端（[#4265](https://github.com/getpaseo/paseo/pull/4265)）
- 修复工作区插件面板未显示在资源管理器菜单中的问题（[#4446](https://github.com/getpaseo/paseo/pull/4446)）

### 变更

- 桌面应用现在要求 macOS 13 或更高版本；macOS 12 将不再收到桌面应用更新（[#4322](https://github.com/getpaseo/paseo/pull/4322)）
- 将 `--host` 改为全局 CLI 选项：`paseo --host <target> <command>`（[#4238](https://github.com/getpaseo/paseo/pull/4238)）
- 将侧栏页脚的“主页”按钮改为“导入会话”（[#4216](https://github.com/getpaseo/paseo/pull/4216)）
- `paseo hub init` 和默认的 `paseo hub deploy` 改为使用 `.paseo/triggers/` 中的组织级触发器（[#4517](https://github.com/getpaseo/paseo/pull/4517)）
- Codex Fast 的可用范围改为受支持模型列表，其中包括 GPT-6 Astra（[#4640](https://github.com/getpaseo/paseo/pull/4640)）
- CLI 安装改为解析已修补的 React 19.1.x 版本（[#4100](https://github.com/getpaseo/paseo/pull/4100)，由 @liujin0506 贡献）

### 改进

- 返回应用时立即重新连接所有主机（[#4160](https://github.com/getpaseo/paseo/pull/4160)）
- 让时间线与编辑器一同移动，使移动端键盘切换更加平滑（[#4275](https://github.com/getpaseo/paseo/pull/4275)）
- 减少打开大型 diff 时的卡顿（[#4574](https://github.com/getpaseo/paseo/pull/4574)）
- 仅重新加载配置发生变化的提供商（[#4332](https://github.com/getpaseo/paseo/pull/4332)）
- 移除空闲 SDK 连接中未经请求的时间线和目录流量（[#4470](https://github.com/getpaseo/paseo/pull/4470)）
- 在“应用诊断”中新增 macOS 更新程序诊断信息（[#4322](https://github.com/getpaseo/paseo/pull/4322)）

### 修复

- 修复 macOS 桌面更新会关闭应用但未安装新版本的问题（[#4322](https://github.com/getpaseo/paseo/pull/4322)）
- 修复发布清单尚未就绪时，桌面更新程序错误报告已是最新版本的问题（[#4201](https://github.com/getpaseo/paseo/pull/4201)）
- 修复执行 `paseo restart` 时，通过桌面应用安装的 CLI 在 Linux `.deb`、RPM 和 tarball 安装环境中失败的问题（[#4207](https://github.com/getpaseo/paseo/pull/4207)）
- 修复打包后的 macOS Dock 图标显示过大的问题（[#4389](https://github.com/getpaseo/paseo/pull/4389)）
- 修复使用工具栏按键或 Enter 时，移动端终端键盘会关闭并重新打开的问题（[#4469](https://github.com/getpaseo/paseo/pull/4469)）
- 修复加载期间收到实时更新时，缓存的对话和工作区列表无法显示的问题（[#4436](https://github.com/getpaseo/paseo/pull/4436)）
- 修复应用处于后台且回合结束后，队列消息未发送的问题（[#4160](https://github.com/getpaseo/paseo/pull/4160)）
- 修复归档工作区后，Codex 重新加载和后续任务因 active-writer 错误而失败的问题（[#4353](https://github.com/getpaseo/paseo/pull/4353)）
- 修复 Claude 多次压缩上下文时留下额外且持续旋转的“Compacting”行的问题（[#4391](https://github.com/getpaseo/paseo/pull/4391)，由 @tomgrin10 贡献）
- 修复 Pi 代理在扩展触发回合后仍卡在运行状态的问题（[#3849](https://github.com/getpaseo/paseo/pull/3849)，由 @mjakl 贡献）
- 修复工作区创建较慢时，用户已经切换到其他位置却仍被导航到新工作区的问题（[#2986](https://github.com/getpaseo/paseo/pull/2986)，由 @cleiter 贡献）
- 修复创建工作区后，“新建工作区”丢失所选模型的问题（[#4401](https://github.com/getpaseo/paseo/pull/4401)）
- 修复创建工作区期间所选提供商消失会导致崩溃的问题（[#4332](https://github.com/getpaseo/paseo/pull/4332)）
- 修复 Codex 模型选择器中的模型行始终显示“Loading”的问题（[#4283](https://github.com/getpaseo/paseo/pull/4283)，由 @colonelpanic8 贡献）
- 修复嵌套子代理显示在根代理下、而非实际父代理下的问题（[#4321](https://github.com/getpaseo/paseo/pull/4321)）
- 修复自主回合之间重复的工具调用 ID 会产生重复时间线行的问题（[140b0bb](https://github.com/getpaseo/paseo/commit/140b0bb716205cf0e00c0ff5b6b3c20af6c79413)）
- 修复某个提供商无响应时，“导入会话”一直加载的问题（[#4216](https://github.com/getpaseo/paseo/pull/4216)）
- 修复“导入会话”忽略 Claude Code `/rename` 标题的问题（[#4216](https://github.com/getpaseo/paseo/pull/4216)）
- 修复导入会话时，为已经打开的目录创建重复工作区的问题（[#4216](https://github.com/getpaseo/paseo/pull/4216)）
- 修复空 ACP 会话出现在“导入会话”中的问题（[#4335](https://github.com/getpaseo/paseo/pull/4335)）
- 修复恢复的终端在标题加载前短暂显示“Terminal”的问题（[#4553](https://github.com/getpaseo/paseo/pull/4553)）
- 修复在 Web 端和桌面端滚动时，diff 文件标题更新滞后的问题（[#4240](https://github.com/getpaseo/paseo/pull/4240)）
- 修复在“已提交”和“未提交”之间切换时，“变更”列表与对应 diff 不同步的问题（[#4199](https://github.com/getpaseo/paseo/pull/4199)）
- 修复 Mermaid 图表在流式输出期间缩小，或重新加载后损坏的问题（[#4210](https://github.com/getpaseo/paseo/pull/4210)）
- 修复桌面端“设置”导航将已关闭视图保留在内存中的问题（[#4228](https://github.com/getpaseo/paseo/pull/4228)）
- 修复 Windows 文件监视器漏掉嵌套目录变更的问题（[#4354](https://github.com/getpaseo/paseo/pull/4354)）
- 修复守护进程执行 Git 命令时允许仓库的 `core.fsmonitor` 运行自定义命令的问题（[#4208](https://github.com/getpaseo/paseo/pull/4208)）
- 修复 OpenCode 2 会话的终端活动报告问题（[#4300](https://github.com/getpaseo/paseo/pull/4300)，由 @mr-karan 贡献）
- 修复网站在加载完成前提供错误平台下载项的问题（[#4222](https://github.com/getpaseo/paseo/pull/4222)）
