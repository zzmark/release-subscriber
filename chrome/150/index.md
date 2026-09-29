---
title: Chrome 150 更新总结
description: Chrome 150 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="150"
  version-prefix=""
  date="2026-06-30"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/150?hl=en"
/>

## 概览

本版集中扩展 CSS、DOM、WebGPU 和 Web 应用能力。

## Breaking Change

- `data:` URL 创建的专用与共享 Worker 现在具有独立的不透明来源，不能再继承创建者的同源状态。

## New Feature

- CSS 增加 `text-fit`、`flex-wrap: balance` 等能力；DOM 加入 Focusgroup。
- WebGPU 引入 Immediates，Web 应用增加来源迁移相关能力。
