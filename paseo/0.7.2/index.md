---
title: Paseo 0.7.2 更新总结
description: Paseo 0.7.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.7.2"
  date="2026-09-02"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.7.2"
/>

## 概览

本版本继续增强模型与客户端体验，并重点修复大型 diff、超长消息、移动端面板、Codex 回退和 Windows 守护进程生命周期。

## New Feature

- 加入上游 Changelog 所列的新能力。

## Performance

- 改善大型及多文件 diff 的打开与滚动稳定性。
- 将单条助手消息渲染限制为 32,000 字符，避免时间线崩溃。

## Bugfix / Security

- 修复移动端侧栏位置、Codex 分页线程回退和图片预览 Escape 行为。
- 修复 Windows 守护进程优雅退出、OMP 超时、完成时间和 Explorer 重命名覆盖问题。
