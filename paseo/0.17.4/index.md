---
title: Paseo 0.17.4 更新总结
description: Paseo 0.17.4 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.17.4"
  date="2026-11-23"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.17.4"
/>

## 概览

Paseo 0.17.4 修复 Android 消息排版和终端输入、OpenCode 会话恢复，以及插件进程停止后守护进程意外退出的问题。

## Bugfix / Security

- Android 修复列表和引用块重叠。终端会请求键盘将输入排除在个性化学习之外。
- 修复 Paseo 工具定义变更后 OpenCode 会话无法重开，以及 MCP `2026-07-28` 客户端缺少 Paseo 工具的问题。Codex MCP 启动失败会出现在守护进程的警告日志中。
- 修复已归档智能体收到中断或引导消息后未启动轮次、插件进程停止后关闭会话导致守护进程退出，以及 Hub 校验触发器时使用错误模型目录的问题。
- 修复目录路径大小写差异导致对话消失、Git 在裸仓库布局下选错仓库，以及普通检出目录的新分支缺少「推送」操作的问题。
