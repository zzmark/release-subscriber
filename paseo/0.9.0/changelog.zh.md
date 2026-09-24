## 0.9.0 - 2026-09-22

### 新增

- 在文件窗格中新增 Cmd/Ctrl+F 查找，并可在可编辑文件中替换内容（[#4589](https://github.com/getpaseo/paseo/pull/4589)）
- 在终端历史输出中新增 Cmd/Ctrl+F 查找（[#4650](https://github.com/getpaseo/paseo/pull/4650)）
- 在聊天中新增 Cmd/Ctrl+F 查找，包括查找当前加载的历史范围之外的消息（[#4765](https://github.com/getpaseo/paseo/pull/4765)）
- 在移动端“变更”中新增“跳转到文件”，通过底部弹层打开已更改文件树（[#4861](https://github.com/getpaseo/paseo/pull/4861)）
- 检测到拉取请求时，每个工作区会自动打开一次“拉取请求”标签页（[#4956](https://github.com/getpaseo/paseo/pull/4956)）
- 新增可展开的计划卡片；被拒绝的计划默认折叠（[#4756](https://github.com/getpaseo/paseo/pull/4756)）
- 选定的文件上传期间，显示带有加载指示器的附件占位项（[#4958](https://github.com/getpaseo/paseo/pull/4958)）
- 在历史记录搜索结果的工作区、代理、项目和分支字段中高亮匹配内容（[#4945](https://github.com/getpaseo/paseo/pull/4945)）

### 插件

- 支持从 npm 安装插件，包括指定作用域包、版本、标签和版本范围（[#4975](https://github.com/getpaseo/paseo/pull/4975)）
- 新增 `paseo plugin update`，支持 `--all`、`--check` 和 `--yes`；批准前会显示当前修订版和拟更新的修订版（[#4975](https://github.com/getpaseo/paseo/pull/4975)）
- 在“设置 → 插件”中显示每个插件的说明、来源和已安装修订版（[#4975](https://github.com/getpaseo/paseo/pull/4975)）
- 新增可选的 `serverId` 参数，供 `navigation.openAgent()` 和 `navigation.openWorkspace()` 使用（[#4942](https://github.com/getpaseo/paseo/pull/4942)）
- 支持通过 `useHosts()` 发现主机，并通过 `getPaseoClient(serverId)` 获取面向指定主机的 SDK 客户端（[#4971](https://github.com/getpaseo/paseo/pull/4971)）
- 新增 `openExternalUrl()` 和 `<ExternalLink>`，用于在 Paseo 外部打开 URL（[#4972](https://github.com/getpaseo/paseo/pull/4972)）
- 新增 `navigation.openBrowser()`，用于在桌面端的工作区浏览器中打开 URL（[#4972](https://github.com/getpaseo/paseo/pull/4972)）
- `registerSettings()` 现在返回带有 `read()` 和 `subscribe()` 方法的服务端设置句柄（[#4674](https://github.com/getpaseo/paseo/pull/4674)，由 @mcowger 贡献）
- `assistant_message` 转换器改为在每次更新时接收完整的已累积消息（[#4675](https://github.com/getpaseo/paseo/pull/4675)，由 @mcowger、@jegork 贡献）
- `tool_call` 转换器改为在“概览”分组之前接收每个原始调用（[#4675](https://github.com/getpaseo/paseo/pull/4675)）
- 修复插件会话的心跳租约到期后永久失去主机 API 访问能力的问题（[#4912](https://github.com/getpaseo/paseo/pull/4912)，由 @gpambrozio 贡献）
- 修复插件构建命令在 Windows 上因 `spawn npm ENOENT` 而失败的问题（[#4776](https://github.com/getpaseo/paseo/pull/4776)，由 @ABorakati 贡献）
- 修复不带 `messageId` 的 ACP 文本分块将一条回复拆成每块一条消息的问题（[#4701](https://github.com/getpaseo/paseo/pull/4701)，由 @L4XB 贡献）
- 修复嵌套的提供商子代理显示为根代理直接子节点的问题（[#4970](https://github.com/getpaseo/paseo/pull/4970)）

### 变更

- 历史记录搜索结果现在按日期分组并保持时间顺序，不再按相关性重排（[#4945](https://github.com/getpaseo/paseo/pull/4945)）
- 恢复工作区时保留对已归档代理的选中状态，并为该代理提供单独的“取消归档”操作（[#4736](https://github.com/getpaseo/paseo/pull/4736)）
- 工作区错误页面的“重试”改为“重新加载”，操作后会重新打开项目选择器（[#4598](https://github.com/getpaseo/paseo/pull/4598)）
- 关闭最后一个内容标签页后，现在会保留“新建”启动页，而非留下无法使用的窗格（[#4844](https://github.com/getpaseo/paseo/pull/4844)）
- `paseo daemon start` 改为读取持久化配置；使用已移除的配置选项时，会报错并提示迁移方法（[#4575](https://github.com/getpaseo/paseo/pull/4575)）

### 改进

- 回复流式输出期间，粗体、斜体、删除线、行内代码和链接文字会保持原有格式（[#4742](https://github.com/getpaseo/paseo/pull/4742)）
- 对于三句话的回复，首段语音音频的等待时间从 4.80 秒降至 0.95 秒（[#4927](https://github.com/getpaseo/paseo/pull/4927)）
- 在包含 213 个文件的工作区中，首次生成 diff 的时间从 11.45 秒降至 2.65 秒（[#4676](https://github.com/getpaseo/paseo/pull/4676)）
- 加载守护进程管理功能后，Electron 主进程的桌面端内存占用从 290.5 MiB RSS 降至 152.1 MiB RSS（[#5007](https://github.com/getpaseo/paseo/pull/5007)）
- 打开的聊天在视图被移出缓存、应用转入后台和重新连接期间会保持订阅（[#4863](https://github.com/getpaseo/paseo/pull/4863)）
- 聊天提示消息新增重新连接及“正在更新消息”状态（[#4863](https://github.com/getpaseo/paseo/pull/4863)）
- 上传大文件时，每处理 128 KiB 数据块就让出执行机会，以保持应用响应（[#4958](https://github.com/getpaseo/paseo/pull/4958)）
- 桌面窗口隐藏时，常驻浏览器页面可在两次截图之间进入空闲状态（[#4646](https://github.com/getpaseo/paseo/pull/4646)）

### 修复

- 修复长对话中不断累积的工具输出耗尽守护进程堆内存的问题（[#4838](https://github.com/getpaseo/paseo/pull/4838)）
- 修复重复提交同一请求会创建多个工作区或代理的问题（[#4442](https://github.com/getpaseo/paseo/pull/4442)）
- 修复关闭工作区最后一个内容标签页后持续崩溃的问题（[#4844](https://github.com/getpaseo/paseo/pull/4844)）
- 修复已启用的提供商发布重复模型 ID 时，“新建代理”页面崩溃的问题（[#4839](https://github.com/getpaseo/paseo/pull/4839)）
- 修复 Android 和 iOS 上的长篇草稿延伸到聊天标题栏后方的问题（[#4824](https://github.com/getpaseo/paseo/pull/4824)）
- 修复 Android 键盘关闭时，消息编辑框反而变高的问题（[#4902](https://github.com/getpaseo/paseo/pull/4902)）
- 修复长按删除清空草稿后，Android 消息编辑框仍保持原有高度的问题（[#4946](https://github.com/getpaseo/paseo/pull/4946)）
- 修复消息编辑框增高时，“新建工作区”的设置内容没有同步上移的问题（[#4973](https://github.com/getpaseo/paseo/pull/4973)）
- 修复在 Android 聊天中点击或选择文本时，时间线意外滚离当前位置的问题（[#5013](https://github.com/getpaseo/paseo/pull/5013)）
- 修复 Android 上附件尚未加入消息编辑框时，粘贴图片失败的问题（[#4758](https://github.com/getpaseo/paseo/pull/4758)）
- 修复 Android 平板上的提供商和模型选择器无响应的问题（[#4845](https://github.com/getpaseo/paseo/pull/4845)，由 @cjcrjc、@mkuhl 贡献）
- 修复 Linux 桌面安装包启动时未启用 Chromium 沙箱的问题（[#4447](https://github.com/getpaseo/paseo/pull/4447)）
- 修复 `paseo daemon stop` 关闭的守护进程并非所选实例的问题（[#4575](https://github.com/getpaseo/paseo/pull/4575)）
- 修复已恢复的归档工作区中“变更”和“提交”均为空的问题（[#4926](https://github.com/getpaseo/paseo/pull/4926)）
- 修复被拒绝的计划显示在拒绝它的后续消息下方的问题（[#4756](https://github.com/getpaseo/paseo/pull/4756)）
- 修复消息编辑框获得焦点时，Cmd/Ctrl+F 无法打开聊天查找的问题（[#4991](https://github.com/getpaseo/paseo/pull/4991)）
- 修复分支的远端地址为仓库 URL 时，无法检测到关联拉取请求的问题（[#4862](https://github.com/getpaseo/paseo/pull/4862)）
- 修复插件筛选后的代理列表替换应用自身目录订阅的问题（[#4596](https://github.com/getpaseo/paseo/pull/4596)）
- 修复更新后的应用拒绝连接缺少独立订阅能力的守护进程的问题（[#4737](https://github.com/getpaseo/paseo/pull/4737)）
- 修复连接 0.8.0 及更早版本守护进程时，工作区和代理创建失败，或代理标题一直显示“正在加载…”的问题（[#4895](https://github.com/getpaseo/paseo/pull/4895)）
- 修复 Cursor 模型显示其他模型的思考选项的问题（[#4180](https://github.com/getpaseo/paseo/pull/4180)，由 @fidelix 贡献）
- 修复 Pi 模型选择器提供模型不支持的思考级别的问题（[#4413](https://github.com/getpaseo/paseo/pull/4413)，由 @mcowger、@therainisme 贡献）
- 修复 Pi 会话报告用户请求的思考级别，而非 Pi 实际采用级别的问题（[#4413](https://github.com/getpaseo/paseo/pull/4413)）
- 修复语音聊天中的用户消息显示内部提示词包装，而非转写文本的问题（[#4927](https://github.com/getpaseo/paseo/pull/4927)）
- 修复历史记录和命令中心搜索将分散在不同单词中的字母拼成查询并错误匹配的问题（[#4945](https://github.com/getpaseo/paseo/pull/4945)）
- 修复触控布局下，工作区标题被隐藏的 diff 统计信息提前截断的问题（[#4698](https://github.com/getpaseo/paseo/pull/4698)）
- 修复拖动打开资源管理器时错误显示 `+0 -0` 和“无变更”的问题（[#4861](https://github.com/getpaseo/paseo/pull/4861)）
- 修复打开已保存的聊天时，重新连接提示消息的入场动画重新播放的问题（[#4925](https://github.com/getpaseo/paseo/pull/4925)）
- 修复已更改文件弹层中，Android 文件行周围出现凸起阴影的问题（[#4898](https://github.com/getpaseo/paseo/pull/4898)）
