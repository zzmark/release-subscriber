---
title: Paseo 0.10.0 更新总结
description: Paseo 0.10.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.10.0"
  date="2026-09-28"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.10.0"
/>

## 概览

Paseo 0.10.0 支持 OpenCode v2，并将多种 Pi 扩展的任务列表、子代理运行记录和提问表单接入聊天界面。中继连接开始校验守护进程密码；本版会拒绝错误密码，后续版本才会强制要求提供密码。桌面端与 CLI 连接本机受密码保护的守护进程时无需再次输入密码，设置页面也重新分组。修复集中在守护进程连接与启动、工作区恢复、代理会话及界面交互。

## New Feature

- 根据已安装的 `opencode` 版本自动启用 OpenCode v2；在 Pi 聊天中显示任务列表、子代理运行记录及 `rpiv-ask-user-question` 问题表单。
- 中继连接开始验证守护进程密码；“添加主机”、配对链接与二维码配对支持输入密码，`paseo daemon pair` 支持 `relay://` 连接字符串。
- OMP 17.4.2 及更新版本的提问卡片显示选项说明。

## Bugfix / Security

- 修复密码含空格、`@` 或 `/` 时直连失败，以及 OpenCode 服务重启后已有代理连接失败的问题。
- 修复磁盘写满等情况下无法写入 `daemon.log` 导致守护进程停止、打开工作树已删除的归档 ACP 代理导致崩溃，以及应用启动后工作区未出现在侧栏等问题。
- 修复 Claude、Codex、Pi 和自定义 ACP 提供商的会话导入、模型选择、回退、命令菜单及子代理通知问题。
- 修复 OSC 8 终端链接、主题菜单滚动、日期显示和非交互终端中 `paseo daemon set-password` 静默退出等交互问题。
