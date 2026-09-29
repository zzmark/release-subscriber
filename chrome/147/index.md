---
title: Chrome 147 更新总结
description: Chrome 147 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="147"
  version-prefix=""
  date="2026-04-07"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/147?hl=en"
/>

## 概览

元素范围视图过渡、CSS `contrast-color()` 和本地网络访问限制是本版重点。

## Breaking Change

- WebTransport 与 WebSocket 访问本地网络现在会触发权限提示；基于 XSLT 生成 SVG 的特殊用法开始分阶段退出。

## New Feature

- 支持元素范围视图过渡、`contrast-color()` 和 `border-shape`。
- 扩展针对 WebTransport 与 WebSocket 的本地网络访问限制。
