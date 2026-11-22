---
title: Paseo 0.17.1 更新总结
description: Paseo 0.17.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.17.1"
  date="2026-11-21"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.17.1"
/>

## 概览

Paseo 0.17.1 支持在已有 Git 工作树中启动工作区，可在界面中更新受支持的提供方 CLI，并根据当前用量预测配额耗尽时间。智能体可以跟踪 PR 和 MR 的检查、评审和评论，用户可在「后台任务」中停止跟踪或心跳。

## New Feature

- 从现有工作树、分支或 PR 启动工作区。从 fork 的 PR 或 MR 创建分支时，可通过「运行设置」批准工作区自动化。
- 提供方列表显示已安装版本和可用更新。用量页面补充 OpenRouter 余额和 API 密钥支出、Antigravity 账户配额及配额耗尽预测。
- Antigravity 支持选择权限模式、处理工具审批、导入和重新打开会话。守护进程所在主机需安装 Antigravity CLI 1.5.0 或更高版本，自定义启动命令需包含 `acp`。
- 来自其他智能体的报告和通知会在当前轮次结束后按顺序送达。「停止」会保留排队消息，等待下一次提示。

## Performance

- 移动端工作区导航减少首次加载的屏幕外对话行。短暂断线后，检出内容未变时复用 Git 状态快照。
- 修复重连后多条对话同时刷新导致历史加载超时，以及守护进程繁忙时长篇 Claude 对话打开缓慢的问题。

## Bugfix / Security

- 修复守护进程停止后智能体无法恢复、重启后长篇 Antigravity 对话丢失末尾记录，以及恢复的 Codex 会话继续使用上一工作目录的问题。
- 修复工作树恢复后「更改」视图无法立即识别检出，以及归档期间其他会话或插件仍将工作区视为活跃的问题。
- 修复 Android 输入框和终端手势、分栏文件标签页聚焦，以及 Mermaid 标签含 `@` 时显示源码的问题。
