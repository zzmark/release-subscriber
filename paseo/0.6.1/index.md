---
title: Paseo 0.6.1 更新总结
description: Paseo 0.6.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.6.1"
  date="2026-08-25"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.6.1"
/>

## 概览

这是界面与工作区状态修复版本，改善升级后的侧栏布局、设置关闭行为和分支切换时的 Pull Request 状态。

## Performance

- 包含上游列出的交互体验改进。

## Bugfix / Security

- 修复升级后持久化侧栏标签落入 Explorer。
- 修复 Escape 无法关闭设置。
- 修复切换分支后当前 PR 被隐藏或已合并 PR 误触发自动归档。
