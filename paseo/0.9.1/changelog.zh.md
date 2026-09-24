## 0.9.1 - 2026-09-22

### 新增

- 在 Claude Code 2.1.280 及更新版本中，将 Opus 5.5 加入 Claude 模型目录并设为默认模型，支持 1M 上下文窗口和 Fast Mode（[#5200](https://github.com/getpaseo/paseo/pull/5200)，由 @leonardourci、@sebgalind0、@rp4ri 贡献）

### 修复

- 修复应用重新连接守护进程后，侧栏只保留最近发生变化的对话的问题（[#5189](https://github.com/getpaseo/paseo/pull/5189)，由 @bagutzu 贡献）
- 修复“导入会话”只提供最新 100 条 Codex 对话的问题（[#5174](https://github.com/getpaseo/paseo/pull/5174)，由 @3ae3ae 贡献）
- 修复带次版本号的 Claude 模型（如 Opus 5.5）在一个回合结束后，消息编辑框中的模型选择退回到对应主版本的问题（[#5200](https://github.com/getpaseo/paseo/pull/5200)）
