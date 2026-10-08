---
title: Paseo 0.11.1 更新总结
description: Paseo 0.11.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.11.1"
  date="2026-10-07"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.11.1"
/>

## 概览

Paseo 0.11.1 新增 Claude Haiku 5.5 支持，并修复 Claude 长时间工具调用被误显示为子智能体、断线期间完成的子智能体状态不更新，以及守护进程重启后跨项目会话历史为空的问题。

## New Feature

- 支持 Claude Haiku 5.5，要求 Claude Code 2.1.293 或更高版本。

## Bugfix / Security

- 运行超过 30 秒的 WebFetch、MCP 等 Claude 工具调用不再误显示为子智能体。
- 应用断开连接期间完成的子智能体不再一直显示“工作中”，直到打开其中一个才更新。
- 修复会话记录位于其他项目文件夹时，守护进程重启后历史记录显示“没有可显示的活动”的问题，包括移动守护进程及从 WSL 运行 Windows 版 Claude Code 的场景。
