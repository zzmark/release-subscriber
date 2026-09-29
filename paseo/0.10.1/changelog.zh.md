## 0.10.1 - 2026-09-29

### 新增

- 在 Claude Code 2.1.284 及更新版本中支持 Claude Sonnet 5.5（[#5583](https://github.com/getpaseo/paseo/pull/5583)，由 @yangqi 贡献）

### 修复

- 修复切换到不支持所选思考级别的模型后，OpenCode 聊天因“Variant unavailable”而失败的问题（[#5587](https://github.com/getpaseo/paseo/pull/5587)）
- 修复回退 Codex 聊天时，自定义提供商和 Paseo 工具丢失的问题（[#5345](https://github.com/getpaseo/paseo/pull/5345)，由 @zbaibg 贡献）
- 修复流式回复中的代码块和 Mermaid 图表各行连在一起、直到重新加载聊天才恢复正常的问题（[#5577](https://github.com/getpaseo/paseo/pull/5577)）
- 修复从分屏窗格打开子代理时，子代理在另一个窗格中打开的问题（[#5451](https://github.com/getpaseo/paseo/pull/5451)）
- 修复归档自定义 Codex 提供商的代理后，其会话仍留在“导入会话”中的问题（[#5572](https://github.com/getpaseo/paseo/pull/5572)）
- 修复使用独立 `CODEX_HOME` 的自定义 Codex 提供商，其 `/` 菜单列出守护进程提示词而非该提供商自身提示词的问题（[#5450](https://github.com/getpaseo/paseo/pull/5450)）
- 修复后台 `send_agent_prompt` 对代理已接受的提示词返回 `idle` 的问题（[#5386](https://github.com/getpaseo/paseo/pull/5386)）
- 修复 Windows 上工作区内文件的链接提示显示完整路径的问题（[#1987](https://github.com/getpaseo/paseo/pull/1987)）
- 修复运行 `cursor-agent` 的终端配置显示通用终端图标的问题（[#5379](https://github.com/getpaseo/paseo/pull/5379)）
