---
title: Paseo 0.17.3 更新总结
description: Paseo 0.17.3 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.17.3"
  date="2026-11-22"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.17.3"
/>

## 概览

Paseo 0.17.3 修复 iPhone 面板的滑动手势、Antigravity 的模型推理级别，以及通过窗口历史记录返回工作区后选择器消失的问题。

## Bugfix / Security

- iPhone 上的「工作区标签页」等面板可响应内容区域内的滑动手势，支持展开、滚动和折叠。
- Antigravity 按模型处理推理级别，修复 Orchestrator 对话无法打开的问题。
- 通过窗口历史记录返回工作区后，`/` 和 `@` 选择器无需重新加载即可使用。
