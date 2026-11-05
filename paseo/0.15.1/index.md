---
title: Paseo 0.15.1 更新总结
description: Paseo 0.15.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.15.1"
  date="2026-11-05"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.15.1"
/>

## 概览

Paseo 0.15.1 修复 Windows 上的守护进程启动故障。在 Windows PowerShell 5.1 无法运行 `Get-CimInstance` 时，终端工作进程无法读取自身进程标识，进而导致守护进程无法启动，Paseo Desktop 因而没有可用的守护进程。

## Bugfix / Security

- 修复终端工作进程无法读取自身进程标识时引发的守护进程启动失败，解决上述 Windows 环境下 Paseo Desktop 缺少守护进程的问题（[#8810](https://github.com/getpaseo/paseo/pull/8810)）。
