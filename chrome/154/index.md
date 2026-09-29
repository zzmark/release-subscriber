---
title: Chrome 154 更新总结
description: Chrome 154 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="154"
  version-prefix=""
  date="2026-09-22"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/154?hl=en"
/>

## 概览

本版增加滚动标记无障碍模式、WebSocket 选项和后台获取安全限制。

## Breaking Change

- Background Fetch 现在强制执行 CORS 和本地网络访问限制；连接不安全 HTTP 网站时默认提示用户。

## New Feature

- `scroll-marker-group` 增加链接与标签页模式，改善键盘和辅助技术体验。
- WebSocket 支持选项对象与 `targetAddressSpace`；JavaScript 新增 `Iterator.prototype.includes()`。
