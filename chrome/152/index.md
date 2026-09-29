---
title: Chrome 152 更新总结
description: Chrome 152 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="152"
  version-prefix=""
  date="2026-08-25"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/152?hl=en"
/>

## 概览

CSS 伪元素接口、隔离 Web 应用窗口模式与隐私防护继续扩展。

## Breaking Change

- Private Aggregation API 已移除；客户端 XSLT 提供弃用试用以争取迁移时间。

## New Feature

- `CSSPseudoElement` 覆盖更多伪元素，并加入 CSS `alpha()`。
- 隔离 Web 应用支持无边框显示模式，另加入可疑网站警告。
