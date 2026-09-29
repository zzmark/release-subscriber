---
title: Chrome 149 更新总结
description: Chrome 149 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="149"
  version-prefix=""
  date="2026-06-02"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/149?hl=en"
/>

## 概览

CSS 间隙装饰、剪贴板格式读取和 WebSocket 生命周期行为得到更新。

## Breaking Change

- 页面进入 bfcache 时会关闭活跃 WebSocket；需要在恢复页面时重新建立连接。

## New Feature

- 支持 CSS 间隙装饰及更多 `shape-outside` 图形函数。
- 加入选择性剪贴板格式读取；页面进入 bfcache 时断开 WebSocket。
