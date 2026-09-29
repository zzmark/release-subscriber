---
title: Chrome 145 更新总结
description: Chrome 145 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="145"
  version-prefix=""
  date="2026-02-10"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/145?hl=en"
/>

## 概览

本版带来可自定义选择控件、存储更新能力和性能度量扩展。

## Breaking Change

- `UserAgentReduction` 企业政策已移除；依赖它获取完整旧版 User-Agent 的系统应迁移到 User-Agent Client Hints。

## New Feature

- CSS 增加 `text-justify` 和多列换行；选择控件支持更丰富的定制。
- 加入 Cookie Store 的 `maxAge`，并扩展性能与布局偏移指标。
