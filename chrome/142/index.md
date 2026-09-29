---
title: Chrome 142 更新总结
description: Chrome 142 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="142"
  version-prefix=""
  date="2025-10-28"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/142?hl=en"
/>

## 概览

CSS 视图过渡、WebGPU 纹理格式与用户输入能力继续扩展。

## Breaking Change

- 访问本地网络需要权限提示且仅限安全上下文；JSON 模块对 `*+json` MIME 类型的验证更严格。

## New Feature

- 新增 `:target-before`、`:target-after`，并扩展样式容器查询语法。
- 加入 WebGPU 新纹理格式以及 SVG 链接的 `download` 属性。
