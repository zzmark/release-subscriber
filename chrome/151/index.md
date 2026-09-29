---
title: Chrome 151 更新总结
description: Chrome 151 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="151"
  version-prefix=""
  date="2026-07-28"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/151?hl=en"
/>

## 概览

本版加入文本流读取和软导航性能指标，并停止为 macOS 12 提供后续更新。

## Breaking Change

- Chrome 151 要求 macOS 13 或更高版本；macOS 12 上现有 Chrome 可继续运行，但不再获得安全或功能更新。

## New Feature

- `Response`、`Request` 与 `Blob` 提供 `textStream()`；加入软导航性能条目。
- 扩展 `aria-actions` 与 Web Speech；WebCrypto 算法更新仍处来源试用。
