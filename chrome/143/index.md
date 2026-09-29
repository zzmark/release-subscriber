---
title: Chrome 143 更新总结
description: Chrome 143 的中文更新总结、原始 Release Notes 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="143"
  version-prefix=""
  date="2025-12-02"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://developer.chrome.com/release-notes/143?hl=en"
/>

## 概览

本版增加 WebTransport 协商、WebGPU 纹理分量映射和 FedCM 能力。

## Breaking Change

- ICU 77 可能改变意大利语数字和部分英语日期格式；FedCM 的 nonce 与错误字段迁移进入控制台警告阶段。

## New Feature

- 支持 WebTransport 应用协议协商、WebGPU 纹理分量映射及 Web App Manifest 更新资格配置。
- 来源试用介绍 Web Install API 和数字凭据签发能力，尚非默认稳定能力。
