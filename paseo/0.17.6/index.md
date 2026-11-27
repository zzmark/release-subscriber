---
title: Paseo 0.17.6 更新总结
description: Paseo 0.17.6 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.17.6"
  date="2026-11-27"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.17.6"
/>

## 概览

Paseo 0.17.6 将设置整理为「设备」和「主机」两个部分，并修复三星设备上的聊天崩溃和 macOS 桌面端启动卡死。Antigravity 移除了通过后台运行 `agy -p /usage` 获取用量的方式。

## New Feature

- 模型选择器支持用方向键浏览模型、提供方和配置。
- 主机设置和设置流程支持直接刷新 Tailscale 的可用状态。

## Bugfix / Security

- 修复 Android 上代码块或引用触发崩溃、鼠标无法选中模型，以及 macOS 启动时更新程序坞进度条导致卡死的问题。
- 修复 Linux AppImage 的运行时环境影响 Shell 和子进程，以及后台 Git fetch 产生孤立 D-Bus 进程并反复重试失败认证的问题。
- 修复工作树归属超出根目录、Web 新标签页丢失项目，以及回退代次变更时丢失时间线条目的问题。恢复归档时会显示进行中状态，界面也不再闪烁。
