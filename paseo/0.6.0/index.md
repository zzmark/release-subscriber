---
title: Paseo 0.6.0 更新总结
description: Paseo 0.6.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.6.0"
  date="2026-08-25"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.6.0"
/>

## 概览

本版本调整代理编排与客户端行为，增加新能力，并集中修复 OpenCode 启动阶段的事件流连接与就绪时序问题。

## New Feature

- 加入上游 Changelog 所列的新功能和工作流改进。

## Bugfix / Security

- 修复首次事件流连接停滞导致 OpenCode 回合失败。
- 确保提供方报告连接就绪后才开始发送 OpenCode 提示。
