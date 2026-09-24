---
title: Paseo 0.9.1 更新总结
description: Paseo 0.9.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.9.1"
  date="2026-09-22"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.9.1"
/>

## 概览

Paseo 0.9.1 将 Opus 5.5 加入 Claude 模型目录，并在受支持的 Claude Code 版本中设为默认模型，支持 1M 上下文窗口和 Fast Mode。同时修复重新连接后侧栏对话丢失、“导入会话”仅显示最新 100 条 Codex 对话，以及带次版本号的 Claude 模型在回合结束后被错误切换的问题。

## New Feature

- 在 Claude Code 2.1.280 及更新版本中加入 Opus 5.5，并设为默认 Claude 模型，支持 1M 上下文窗口与 Fast Mode。

## Bugfix / Security

- 修复重新连接守护进程后，侧栏只保留最近变化的对话的问题。
- 修复“导入会话”只能选择最新 100 条 Codex 对话的问题。
- 修复带次版本号的 Claude 模型（如 Opus 5.5）在回合结束后退回对应主版本的问题。
