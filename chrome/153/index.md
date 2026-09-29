---
title: Chrome 153 更新总结
description: Chrome 153 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="153"
  version-prefix=""
  date="2026-09-08"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/153?hl=en"
/>

## 概览

滚动轴控制、音频格式与 JavaScript 迭代能力获得更新。

## Breaking Change

- 以 `_current` 为目标的非标准导航已移除；多个 Privacy Sandbox API 进入计划弃用和移除阶段。

## New Feature

- 支持 `scroll-axis-lock` 与新的迭代能力；单轴滚动容器仍仅在非稳定渠道提供。
- 加入 IAMF 解码和 WebGPU `buffer_view`。
