## 0.14.0 - 2026-10-29

插件现在可以向单个代理添加工具，并在会话打开时配置其 MCP 服务器。

已完成的对话轮次可以折叠为摘要，也可展开查看完整对话。

“语音”设置现在支持配置语音服务提供商，并一键下载本地模型，包括用于中文听写的 SenseVoice 和 Whisper。语音模式现在需要主动启用。

### 新增

- 允许插件向指定代理提供工具 ([#7938](https://github.com/getpaseo/paseo/pull/7938))
- 新增聊天显示设置，可将工具调用分组或折叠已完成的对话轮次 ([#7785](https://github.com/getpaseo/paseo/pull/7785), [#7990](https://github.com/getpaseo/paseo/pull/7990), [#8026](https://github.com/getpaseo/paseo/pull/8026), [#8042](https://github.com/getpaseo/paseo/pull/8042), [#8109](https://github.com/getpaseo/paseo/pull/8109)，贡献者 @akaready, @Dey11, @Sebeb, @Waishnav)
- 允许插件在每次代理会话打开时添加 MCP 服务器 ([#7983](https://github.com/getpaseo/paseo/pull/7983))
- 在“语音”设置中新增可下载的本地语音模型，包括用于中文听写的 SenseVoice 和 Whisper ([#7295](https://github.com/getpaseo/paseo/pull/7295))
- 新增消息发送方式选择：Enter 或 ⌘/Ctrl+Enter ([#5503](https://github.com/getpaseo/paseo/pull/5503)，贡献者 @lukelabonte)
- 在网页端或桌面端消息输入框为空时，可通过上、下方向键调出已发送的消息 ([#7710](https://github.com/getpaseo/paseo/pull/7710))
- 新增长按发送按钮，将消息加入队列或立即发送的功能 ([#7897](https://github.com/getpaseo/paseo/pull/7897)，贡献者 @bjspi)
- 新增按项目选择编辑器的功能，包括在 macOS 上选择 Xcode ([#7898](https://github.com/getpaseo/paseo/pull/7898)，贡献者 @kinoroy)

### 改进

- 符合条件的代理运行时在空闲一小时后释放，下次发送提示时恢复已保存的会话 ([#7782](https://github.com/getpaseo/paseo/pull/7782))
- 在子代理面板中新增返回父代理的链接 ([#7784](https://github.com/getpaseo/paseo/pull/7784))
- 手机上打开子代理时直接替换子代理列表视图，返回操作会回到列表 ([#8093](https://github.com/getpaseo/paseo/pull/8093))
- 提问卡片新增可点击链接，并支持选择说明文字 ([#7419](https://github.com/getpaseo/paseo/pull/7419)，贡献者 @NoSync)
- 改善网页端大型导入会话列表的响应速度 ([#7872](https://github.com/getpaseo/paseo/pull/7872)，贡献者 @royenheart)
- 增大手机上的项目和工作区菜单按钮 ([#7928](https://github.com/getpaseo/paseo/pull/7928))
- 隐藏的聊天不再因收到文本更新而渲染 ([#7901](https://github.com/getpaseo/paseo/pull/7901))
- 减少大型差异进行语法高亮和自动换行时的卡顿 ([#8006](https://github.com/getpaseo/paseo/pull/8006), [#7945](https://github.com/getpaseo/paseo/pull/7945))
- 减少打开和分页浏览大型 Claude 与 OMP 历史记录时守护进程的卡顿 ([#7789](https://github.com/getpaseo/paseo/pull/7789), [#7940](https://github.com/getpaseo/paseo/pull/7940), [#7948](https://github.com/getpaseo/paseo/pull/7948), [#7958](https://github.com/getpaseo/paseo/pull/7958)，贡献者 @ragokan)
- 减少插件构建、图片处理和重新加载配置期间守护进程的卡顿 ([#7967](https://github.com/getpaseo/paseo/pull/7967), [#7954](https://github.com/getpaseo/paseo/pull/7954), [#7959](https://github.com/getpaseo/paseo/pull/7959))
- 减少刷新工作区和项目期间阻塞式文件系统操作的工作量 ([#7941](https://github.com/getpaseo/paseo/pull/7941), [#7943](https://github.com/getpaseo/paseo/pull/7943), [#7944](https://github.com/getpaseo/paseo/pull/7944))

### 修复

- 修复共享 WebGL 纹理图集变化时终端字形损坏的问题 ([#8013](https://github.com/getpaseo/paseo/pull/8013)，贡献者 @donghyeonan)
- 修复手机启动时，恢复的工作区没有打开聊天便一直停留在“正在加载工作区”状态的问题 ([#7918](https://github.com/getpaseo/paseo/pull/7918))
- 修复恢复的代理标签页出现在无关工作区中的问题 ([#7956](https://github.com/getpaseo/paseo/pull/7956)，贡献者 @odoo-mvds)
- 修复后台 Git fetch 操作弹出凭据提示的问题 ([#8019](https://github.com/getpaseo/paseo/pull/8019))
- 修复 SSH 隧道失败时，未处理的 EPIPE 导致调用方崩溃的问题 ([#7876](https://github.com/getpaseo/paseo/pull/7876))
- 修复 Windows 文件被短暂锁定时无法原子保存的问题 ([#7955](https://github.com/getpaseo/paseo/pull/7955))
- 修复大量 ACP 终端输出阻塞守护进程请求的问题 ([#7953](https://github.com/getpaseo/paseo/pull/7953)，贡献者 @bbtfr)
- 修复 Pi 手动压缩上下文期间发送的消息直接失败、而非等待的问题 ([#7848](https://github.com/getpaseo/paseo/pull/7848)，贡献者 @itssimon)
- 修复对话轮次重叠时，迟到的工具更新产生重复行的问题 ([#8010](https://github.com/getpaseo/paseo/pull/8010)，贡献者 @luoph)
- 修复消息 ID 相同时，插件 ACP 推理内容出现在助手回复中的问题 ([#7272](https://github.com/getpaseo/paseo/pull/7272)，贡献者 @cncolder)
- 修复指向文件夹外的链接导致“文件”视图被访问错误页面替换的问题 ([#7726](https://github.com/getpaseo/paseo/pull/7726)，贡献者 @jtomaszewski)
- 修复手机上命令建议与不断增高的消息输入框重叠的问题 ([#7910](https://github.com/getpaseo/paseo/pull/7910))
- 修复 Markdown 裸 URL 丢失端口号，或在路径中的冒号处被截断的问题 ([#7859](https://github.com/getpaseo/paseo/pull/7859)，贡献者 @mariotaku)
- 修复强调文本、链接和标题内行内代码的尺寸问题 ([#7889](https://github.com/getpaseo/paseo/pull/7889), [#8088](https://github.com/getpaseo/paseo/pull/8088))
- 修复停靠窗口宽度为 600–719 时，紧凑导航的尺寸问题和“设置”详情面板过于拥挤的问题 ([#8052](https://github.com/getpaseo/paseo/pull/8052)，贡献者 @zeyugao)
- 修复切换“设置”章节时丢失所选主机或侧栏滚动位置的问题 ([#7893](https://github.com/getpaseo/paseo/pull/7893), [#7899](https://github.com/getpaseo/paseo/pull/7899)，贡献者 @bingqilinweimaotai, @wangnan0916)
- 修复 OpenCode v2 子代理行缺少模型和 token 详情的问题 ([#7799](https://github.com/getpaseo/paseo/pull/7799)，贡献者 @Davnn1)
- 修复离开聊天后文件链接的工具提示仍覆盖在预览上方的问题 ([#7842](https://github.com/getpaseo/paseo/pull/7842))
- 修复模型发现错误提示紧贴模型选择器边缘的问题 ([#8039](https://github.com/getpaseo/paseo/pull/8039)，贡献者 @ilteoood)
- 修复模型选择器保持打开并覆盖“设置”的问题 ([#7783](https://github.com/getpaseo/paseo/pull/7783)，贡献者 @ragokan)

### 说明

- 语音模式现在默认关闭；请在“语音”设置中启用
- 如果通过环境变量选择了 OpenAI 语音服务，请将仅存储在旧版 `providers.openai` 中的密钥和端点移至“语音”设置
- 降级到 0.13.2 前，请恢复备份的 `config.json`，或转换由 0.14.0 保存的语音凭据和空闲清理设置
- 可安装可选的 [Claude Code 入口插件](https://paseo.sh/plugins/getpaseo/claude-code-entrypoint-env)，以 `CLAUDE_CODE_ENTRYPOINT=Paseo` 启动 Claude 会话；这是社区为订阅额度消耗过快问题提供的变通方法 ([#7976](https://github.com/getpaseo/paseo/pull/7976), [#8164](https://github.com/getpaseo/paseo/pull/8164)，贡献者 @david828019-oss)
