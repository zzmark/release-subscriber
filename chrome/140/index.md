---
title: Chrome 140 更新总结
description: Chrome 140 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="140"
  version-prefix=""
  date="2025-09-02"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/140?hl=en"
/>

## 概览

CSS 类型化算术、嵌套视图过渡及 JavaScript 字节数组转换是本版的主要开发者更新。

## Breaking Change

- 预取和预渲染开始移除旧版 `Purpose: prefetch` 请求头；依赖该请求头的服务端逻辑应检查 `Sec-Purpose`。

## New Feature

- 支持 CSS 类型化算术、`caret-animation`、嵌套视图过渡和 `scroll-target-group`。
- 加入 `Uint8Array` 的 Base64/十六进制转换，并调整视图过渡完成 Promise 的时间点。
