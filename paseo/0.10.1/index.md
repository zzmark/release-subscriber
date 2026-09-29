---
title: Paseo 0.10.1 更新总结
description: Paseo 0.10.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.10.1"
  date="2026-09-28"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.10.1"
/>

## 概览

Paseo 0.10.1 为 Claude Code 2.1.284 及更新版本加入 Claude Sonnet 5.5，并修复 OpenCode 模型切换、Codex 聊天回退、流式回复代码块显示及自定义提供商会话管理等问题。另修复子代理窗格定位、后台提示词状态、Windows 文件链接提示及终端图标。

## New Feature

- 在 Claude Code 2.1.284 及更新版本中支持 Claude Sonnet 5.5。

## Bugfix / Security

- 修复切换到不支持当前思考级别的模型后，OpenCode 聊天报“Variant unavailable”的问题。
- 修复回退 Codex 聊天时丢失自定义提供商和 Paseo 工具，以及自定义 Codex 提供商的归档会话仍出现在“导入会话”中的问题。
- 修复流式回复中的代码块和 Mermaid 图表各行在重新加载聊天前连在一起的问题。
- 修复分屏子代理打开位置、后台 `send_agent_prompt` 状态、Windows 文件链接提示和终端图标等问题。
