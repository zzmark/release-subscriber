---
title: Paseo 0.12.0 更新总结
description: Paseo 0.12.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.12.0"
  date="2026-10-19"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.12.0"
/>

## 概览

Paseo 0.12.0 新增后台工作区、手机全屏消息输入框和 CLI 用量查询，重新设计移动端 Markdown 渲染与布局，并修复内存、代理会话、定时任务、Git 差异、终端及插件问题。升级前需调整后台运行参数，并留意权限确认命令的退出码变化。

## Breaking Change

- `paseo run --background` 已弃用，改用 `--no-wait`。
- 守护进程未在 15 秒内确认时，`paseo permit allow` 和 `deny` 现在以非零退出码退出，避免请求仍待处理却报告成功。
- 重新绑定“跳转到标签页”或“跳转到工作区”的快捷键修复后，已有自定义绑定需要重新录制。

## New Feature

- 新增后台工作区，仅开启“显示后台工作区”时才在侧栏显示；差异面板可直接向代理发送评审反馈。
- 手机新增全屏消息输入框、跨段落／标题／列表文本选择、代码块复制按钮和宽表格横向滚动；文件、子代理及差异评论使用可关闭的面板。
- 新增 `paseo usage`，查询账户配额、余额和重置时间；已安装的 Claude Code 声明支持时，提供 Claude Mythos 5.1。
- 改进命令中心排序、子代理模型与上下文信息，以及手机设置、脚本和工作区创建入口。
- 代理之间通过 CLI 或 MCP 发送消息时，引导当前轮次继续执行；检出 Gitea／Forgejo fork PR 的分支名包含 fork 所有者。

## Performance

- 减少长聊天流式回复期间的渲染工作，重新打开侧栏的速度提高约 45%。
- 加快重新连接后项目与工作区的加载，改善多面板拖动资源管理器边缘时的卡顿。
- 修复插件宿主、CLI 和桌面应用运行 30 至 75 分钟后内存增长至约 1 GB，以及 OpenCode v2 长流式回复、多目录并发搜索造成守护进程内存耗尽的问题。

## Bugfix / Security

- 修复 Codex、Claude、OpenCode、Copilot、Pi 和 OMP 的会话恢复、运行状态、提问、模式、思考级别及上下文用量问题。
- 修复插件类型依赖安装、移动端就绪等待、ACP 后续消息、重载超时和时间线查找；修复父子代理完成通知及后台子代理卡片。
- 修复定时任务运行记录失败后不再执行，以及共享 cron 分钟时重复运行并跳过下一次执行的问题。
- 修复 Git 差异、重命名文件、特殊路径、worktree 创建和合并、工作区服务及终端交互问题；保留配置文件符号链接和复制文件夹时的相对符号链接。
- 修复移动端文字选择、韩文复制、听写、配对二维码、触控反馈和键盘快捷键，以及网络重连、反向代理、文件下载和本地图片加载。
- 修复 CLI 代理列表截断、worktree 列表与归档、日志时间过滤及流式输出顺序，并改进用量卡片的刷新与账户区分。
