---
title: Chrome 155 更新总结
description: Chrome 155 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="155"
  date="2026-09-23"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://chromestatus.com/release-notes/155"
/>

## 概览

Chrome 155 扩展窗口控制、CSS、WebCrypto、数字凭据签发和 WebTransport 能力，并加入 JPEG XL 解码及 WebGPU 原子操作支持。企业环境中的扩展需要处理 `chrome.debugger` 因主机或截图策略而拒绝附加的情况。

发布日期依据 [ChromiumDash Windows Stable 实际记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=155&num=1000)：首条匹配构建为 155.0.8059.12，日期为 2026-09-23（UTC）。ChromeStatus 的通用 Preview 徽标及计划日期 2026-10-06 已在 Changelog 中保留；卡片使用实际首发日期。此核验基于 Windows Stable，不代表所有平台同步发布。

## Breaking Change

- 受管理浏览器中的 `chrome.debugger` 现在会检查企业主机和截图策略。附加调试器可能因主机限制、禁用截图或 DLP 规则而被拒绝；扩展应处理错误，或采用支持细粒度来源权限的高层 API。

## New Feature

- Window Management API 新增窗口最大化、最小化、还原及禁止调整大小的能力，并提供 `display-state`、`resizable` CSS 媒体特性。
- WebCrypto 新增 ML-KEM、ML-DSA、ChaCha20-Poly1305 和 X-Wing；Digital Credentials API 支持向移动钱包签发凭据。
- CSS 新增 `symbols()`、`text-decoration-skip-spaces` 和 `margin-trim` 能力；`margin-trim` 支持常规块容器及多列容器，规范中对 flex、grid 容器的支持已移除。
- JavaScript 支持文本模块导入；画布新增 `srgb-linear`、`display-p3-linear` 色彩空间；Blink 使用纯 Rust 的 jxl-rs 解码 JPEG XL 图像。
- WebGPU 在 WGSL 中支持对 `atomic<vec2u>` 执行 64 位原子最小值、最大值运算，无需完整的 64 位整数支持。
- WebTransport 新增数据报可读字节流、独立可写流及优先级、接收流统计和可靠性属性。Chromium 当前仍不支持 HTTP/2 回退，成功会话使用 HTTP/3 并支持不可靠数据报。

## Performance

- 新增 `media-playback-while-not-visible` 权限策略，可在 iframe 隐藏时阻止其输出可听见的媒体，重新显示后解除限制，让浏览器处理不可见内容的播放并改善性能。
