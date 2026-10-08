## 0.11.1 - 2026-10-07

### 新增

- 新增 Claude Haiku 5.5 支持，适用于 Claude Code 2.1.293 及更高版本（[#6332](https://github.com/getpaseo/paseo/pull/6332)）

### 修复

- 修复运行超过 30 秒的 Claude 工具调用（例如 WebFetch 或 MCP 工具）显示为子智能体的问题（[#6308](https://github.com/getpaseo/paseo/pull/6308)）
- 修复应用断开连接期间已完成的子智能体仍保持“工作中”状态，直到打开其中一个子智能体才更新的问题（[#6316](https://github.com/getpaseo/paseo/pull/6316)）
- 修复 Claude 智能体的会话记录位于其他项目文件夹时，守护进程重启后历史记录显示“没有可显示的活动”的问题，例如移动守护进程后，或从 WSL 运行 Windows 版 Claude Code 时（[#6301](https://github.com/getpaseo/paseo/pull/6301)）
