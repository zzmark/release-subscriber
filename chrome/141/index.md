---
title: Chrome 141 更新总结
description: Chrome 141 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="141"
  version-prefix=""
  date="2025-09-30"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/141?hl=en"
/>

## 概览

本版扩展数字凭据、导航与离线存储能力，并调整本地网络访问限制。

## Breaking Change

- Storage Access API 默认仅为 iframe 的同源请求附加 Cookie；本地网络请求开始受权限提示限制。

## New Feature

- 数字凭据展示、Navigation API 延迟提交以及 IndexedDB 批量读取获得新支持。
- HTTP 磁盘缓存支持 `No-Vary-Search`；预加载与 WebRTC 也有更新。
