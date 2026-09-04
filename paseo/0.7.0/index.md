---
title: Paseo 0.7.0 更新总结
description: Paseo 0.7.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.7.0"
  date="2026-08-31"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.7.0"
/>

## 概览

这是一次覆盖桌面、Web、Android、iOS 与多种代理提供方的大版本更新，新增多项编排和客户端能力，并集中提升输入、语音、时间线、Git 与工作区的可靠性。

## New Feature

- 加入上游 Changelog 所列的新代理、客户端与工作流能力。

## Performance

- 改善长会话回退、慢速提供方启动和守护进程重连路径。

## Bugfix / Security

- 修复守护进程写入关闭进程时崩溃以及 Android 首条消息崩溃。
- 修复移动端输入框、听写、蓝牙音频和 iPad 模型选择器问题。
- 修复 OpenCode 子会话、归档代理与工作区恢复状态。
- 修复 Git 签名、Markdown 字符、iOS 插件和权限卡片等问题。
