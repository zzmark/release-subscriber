---
title: Paseo 0.18.0 更新总结
description: Paseo 0.18.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.18.0"
  date="2026-11-27"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.18.0"
/>

## 概览

Paseo 0.18.0 支持在桌面端浏览器标签页直接打开远程工作区的 `localhost` 服务，新增按设备设置通知的选项，并允许为智能体配置保存系统提示词。

## Breaking Change

- Antigravity ACP 需要 [Antigravity CLI 1.5.1 或更高版本](https://paseo.sh/docs/supported-providers/antigravity)。

## New Feature

- 远程工作区的浏览器标签页通过工作区守护进程转发请求，可访问远程主机上的本地服务。
- 各设备可分别选择触发通知的智能体、终端和插件事件。插件可发送通知并处理点按操作。
- 使用智能体配置启动新智能体时，可以应用该配置保存的系统提示词。语法高亮新增对 diff、patch、Kotlin、SQL 和 PowerShell 等格式和语言的支持。

## Performance

- ACP 提供方缓存模型目录，以便守护进程重启后继续使用，并取消后台探测。

## Bugfix / Security

- 修复客户端插件导入 `react-native` 时 Paseo iOS 连接后崩溃、OpenCode v2 智能体停止后仍处于运行状态，以及向自行启动运行的 Pi 智能体发送引导消息时中止运行的问题。
- 修复从派生仓库的克隆创建工作区时检出同编号的错误拉取请求，以及拖入附件后输入框未获得焦点的问题。
