## 0.10.0 - 2026-09-28

### 新增

- 支持 OpenCode v2，并根据已安装的 `opencode` 版本自动选择（[#5198](https://github.com/getpaseo/paseo/pull/5198)、[#5526](https://github.com/getpaseo/paseo/pull/5526)，由 @karrots、@dsingal0、@gszep 贡献）
- 在 Pi 聊天中显示来自 rpiv-todo、pi-goal-x 和 Pi 示例待办扩展的任务列表（[#5309](https://github.com/getpaseo/paseo/pull/5309)）
- 在“子代理”轨道中显示来自 pi-subagents、Tintinweb pi-subagents 和 Gotgenes pi-subagents 的子代理运行记录（[#5309](https://github.com/getpaseo/paseo/pull/5309)）
- 将 rpiv-ask-user-question 对话框作为一份问题表单显示在 Pi 聊天中（[#5309](https://github.com/getpaseo/paseo/pull/5309)）
- 中继连接增加密码校验，拒绝错误的守护进程密码；后续版本将强制要求提供密码（[#5393](https://github.com/getpaseo/paseo/pull/5393)）
- 对受密码保护的守护进程，在“添加主机”、配对链接和二维码配对流程中增加密码字段（[#5393](https://github.com/getpaseo/paseo/pull/5393)）
- `paseo daemon pair` 支持 `relay://` 连接字符串（[#5393](https://github.com/getpaseo/paseo/pull/5393)）
- 在 OMP 17.4.2 及更新版本中，OMP 的 Ask 选项说明会显示在提问卡片上（[#3628](https://github.com/getpaseo/paseo/pull/3628)，由 @joeshull 贡献）

### 变更

- CLI 和桌面应用连接同一台机器上受密码保护的守护进程时，不再要求输入密码（[#5393](https://github.com/getpaseo/paseo/pull/5393)）
- 主机因密码问题被拒绝时，主机页面和“连接”页面会显示“需要密码”或“密码错误”（[#5393](https://github.com/getpaseo/paseo/pull/5393)）
- 将“设置”重新组织为“通用”“侧栏”“聊天”“终端”“浏览器”和“打开位置”页面（[#5459](https://github.com/getpaseo/paseo/pull/5459)）

### 修复

- 修复守护进程密码包含空格或 `@`、`/` 等字符时，直连失败的问题（[#5393](https://github.com/getpaseo/paseo/pull/5393)）
- 修复 OpenCode 服务重启后，现有 OpenCode 代理因 `ECONNREFUSED` 而失败的问题（[#5338](https://github.com/getpaseo/paseo/pull/5338)）
- 修复 OpenCode 自行添加的消息在聊天中显示得像用户输入的一样的问题（[#5434](https://github.com/getpaseo/paseo/pull/5434)）
- 修复磁盘已满等导致 `daemon.log` 无法写入时，守护进程停止运行的问题（[#5445](https://github.com/getpaseo/paseo/pull/5445)）
- 修复打开工作树已被移除的归档 ACP 代理时，守护进程崩溃的问题（[#5439](https://github.com/getpaseo/paseo/pull/5439)，由 @qinkangdeid 贡献）
- 修复应用启动后，已有工作区未出现在侧栏中的问题，包括此后再次启动时仍会发生的情况（[#5394](https://github.com/getpaseo/paseo/pull/5394)）
- 修复使用独立 `CLAUDE_CONFIG_DIR` 的自定义 Claude 提供商代理在守护进程重启后打开时，聊天记录为空的问题（[#5437](https://github.com/getpaseo/paseo/pull/5437)）
- 修复自定义 Codex 提供商的会话未出现在“导入会话”中的问题（[#5446](https://github.com/getpaseo/paseo/pull/5446)）
- 修复提供商版本检查超过 1.5 秒时，主机设置中的“更新守护进程”和“重启”操作失败的问题（[#5372](https://github.com/getpaseo/paseo/pull/5372)）
- 修复在代理会话中运行 `paseo --host <other daemon> run` 时，因“找不到调用方代理”而失败的问题（[#5392](https://github.com/getpaseo/paseo/pull/5392)）
- 修复 Pi 聊天在先前执行过回退后，再次回退会越过选定消息的问题（[#5383](https://github.com/getpaseo/paseo/pull/5383)）
- 修复守护进程重启后，Pi 聊天的回退结果被撤销的问题（[#5432](https://github.com/getpaseo/paseo/pull/5432)）
- 修复启动 Pi 代理时未指定模型会忽略 Pi 默认模型配置的问题（[#5343](https://github.com/getpaseo/paseo/pull/5343)）
- 修复检出环境切换分支后，新代理 `/` 菜单中的项目技能仍为旧内容的问题（[#5415](https://github.com/getpaseo/paseo/pull/5415)）
- 修复使用自定义 ACP 提供商时，新代理的 `/` 菜单缺少斜杠命令的问题（[#5411](https://github.com/getpaseo/paseo/pull/5411)）
- 修复向运行中的子代理发送提示词后，父代理会收到两次子代理完成通知的问题（[#5407](https://github.com/getpaseo/paseo/pull/5407)）
- 修复阻塞式 `send_agent_prompt` 超过 30 秒等待期限后，即使子代理完成也不会通知调用方的问题（[#5347](https://github.com/getpaseo/paseo/pull/5347)）
- 修复点击 OSC 8 终端链接会显示导航提示并打开空白 Paseo 窗口的问题（[#5388](https://github.com/getpaseo/paseo/pull/5388)，由 @liujin0506 贡献）
- 修复插件主题过多超出窗口时，“主题”菜单无法滚动的问题（[#5374](https://github.com/getpaseo/paseo/pull/5374)）
- 修复上周同一星期几的消息只显示星期几、不显示日期的问题（[#5341](https://github.com/getpaseo/paseo/pull/5341)）
- 修复标准输入不是终端时，`paseo daemon set-password` 静默退出的问题（[#5358](https://github.com/getpaseo/paseo/pull/5358)）
